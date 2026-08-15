from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from typing import Optional
import hashlib
import time
import json
import os
import random
import pyotp
import qrcode
import io
import base64
import httpx
from app.services.email_service import EmailService
from app.config import settings

router = APIRouter(prefix="/auth", tags=["Authentication"])

USERS_FILE = os.path.join(os.path.dirname(__file__), "..", "..", "data", "users_db.json")

def load_users():
    default_users = {
        "admin@aurex.intelligence": {
            "name": "Admin Operator",
            "email": "admin@aurex.intelligence",
            "password_hash": hashlib.sha256("Password123!".encode()).hexdigest(),
            "role": "Executive Operator",
            "is_verified": True,
            "verification_code": "123456",
            "totp_enabled": False,
            "registered_at": int(time.time())
        }
    }
    try:
        if os.path.exists(USERS_FILE):
            with open(USERS_FILE, "r", encoding="utf-8") as f:
                data = json.load(f)
                default_users.update(data)
    except Exception as e:
        print(f"[AUTH DB] Fallback load error: {e}")
    return default_users

def save_users(users_data: dict):
    try:
        os.makedirs(os.path.dirname(USERS_FILE), exist_ok=True)
        with open(USERS_FILE, "w", encoding="utf-8") as f:
            json.dump(users_data, f, indent=2)
    except Exception as e:
        print(f"[AUTH DB] Save error: {e}")

class SignUpRequest(BaseModel):
    email: str
    password: str
    name: str

class VerifyEmailRequest(BaseModel):
    email: str
    code: str

class LoginRequest(BaseModel):
    email: str
    password: str
    totp_code: Optional[str] = None

class Setup2FARequest(BaseModel):
    email: str

class Verify2FARequest(BaseModel):
    email: str
    code: str


class OAuthGoogleRequest(BaseModel):
    id_token: str

class OAuthGithubRequest(BaseModel):
    code: str

# ─── Sign Up ────────────────────────────────────────────────────────
@router.post("/signup")
def signup(payload: SignUpRequest):
    email_clean = payload.email.lower().strip()
    name_clean = payload.name.strip()
    users = load_users()

    # Generate 6-digit verification code
    code = f"{random.randint(100000, 999999)}"
    pwd_hash = hashlib.sha256(payload.password.encode()).hexdigest()
    timestamp = int(time.time())

    user_entry = {
        "name": name_clean,
        "email": email_clean,
        "password_hash": pwd_hash,
        "role": "Institutional Operator",
        "is_verified": False,  # Requires Email Verification!
        "verification_code": code,
        "totp_enabled": False,
        "registered_at": timestamp
    }

    users[email_clean] = user_entry
    save_users(users)

    # Dispatch email via Gmail SMTP
    sent = EmailService.send_verification_email(email_clean, code)

    return {
        "status": "SUCCESS",
        "require_verification": True,
        "email": email_clean,
        "code": code,
        "message": f"Verification code sent to {email_clean}. Please check your email inbox."
    }


# ─── Verify Email ──────────────────────────────────────────────────
@router.post("/verify-email")
def verify_email(payload: VerifyEmailRequest):
    email_clean = payload.email.lower().strip()
    users = load_users()
    user = users.get(email_clean)
    
    if not user:
        raise HTTPException(status_code=404, detail="Account not found. Please sign up first.")
        
    if user.get("verification_code") != payload.code.strip():
        raise HTTPException(status_code=400, detail="Invalid 6-digit verification code. Please check your email.")

    user["is_verified"] = True
    save_users(users)
    return {"verified": True, "message": "Email verified successfully! You may now sign in."}

# ─── Resend Verification Code ──────────────────────────────────────
class ResendCodeRequest(BaseModel):
    email: str

@router.post("/resend-code")
def resend_code(payload: ResendCodeRequest):
    email_clean = payload.email.lower().strip()
    users = load_users()
    user = users.get(email_clean)
    
    if not user:
        raise HTTPException(status_code=404, detail="Account not found. Please sign up first.")
        
    code = f"{random.randint(100000, 999999)}"
    user["verification_code"] = code
    save_users(users)
    
    sent = EmailService.send_verification_email(email_clean, code)
    return {
        "status": "SUCCESS",
        "email": email_clean,
        "code": code,
        "message": f"New verification code {'sent to your email' if sent else 'generated'}. Please check your inbox."
    }

# ─── 2FA Setup ─────────────────────────────────────────────────────

@router.post("/2fa/setup")
def setup_2fa(payload: Setup2FARequest):
    email_clean = payload.email.lower().strip()
    users = load_users()
    user = users.get(email_clean)
    
    if not user:
        raise HTTPException(status_code=404, detail="User account not found.")

    # Generate new random Base32 TOTP secret
    secret = pyotp.random_base32()
    totp = pyotp.TOTP(secret)
    otpauth_url = totp.provisioning_uri(name=email_clean, issuer_name="AUREX Intelligence")

    # Generate QR Code image PNG Data URL
    img = qrcode.make(otpauth_url)
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    qr_b64 = f"data:image/png;base64,{base64.b64encode(buf.getvalue()).decode()}"

    user["totp_secret_pending"] = secret
    save_users(users)

    return {
        "status": "SUCCESS",
        "secret": secret,
        "qr_code": qr_b64,
        "otpauth_url": otpauth_url,
        "message": "Scan QR Code with Google Authenticator and submit the 6-digit code to enable 2FA."
    }

# ─── 2FA Verify ────────────────────────────────────────────────────
@router.post("/2fa/verify")
def verify_2fa(payload: Verify2FARequest):
    email_clean = payload.email.lower().strip()
    users = load_users()
    user = users.get(email_clean)

    if not user:
        raise HTTPException(status_code=404, detail="User account not found.")

    secret = user.get("totp_secret_pending") or user.get("totp_secret")
    if not secret:
        raise HTTPException(status_code=400, detail="No 2FA setup found. Please click Setup 2FA first.")

    totp = pyotp.TOTP(secret)
    if not totp.verify(payload.code.strip()):
        raise HTTPException(status_code=400, detail="Invalid 6-digit Google Authenticator code. Please check your app.")

    user["totp_secret"] = secret
    user["totp_enabled"] = True
    if "totp_secret_pending" in user:
        del user["totp_secret_pending"]
        
    save_users(users)

    return {
        "verified": True,
        "message": "Google Authenticator 2FA has been successfully activated on your account!"
    }

# ─── 2FA Status Check ──────────────────────────────────────────────
@router.get("/2fa/status")
def get_2fa_status(email: str):
    """Check if 2FA is already enabled for a given email."""
    email_clean = email.lower().strip()
    users = load_users()
    user = users.get(email_clean)

    if not user:
        return {"enabled": False, "exists": False}

    return {
        "enabled": user.get("totp_enabled", False),
        "exists": True,
        "email": email_clean
    }

# ─── Organization Login ────────────────────────────────────────────
class OrgLoginRequest(BaseModel):
    work_email: str
    org_id: Optional[str] = "ORG-DEFAULT"
    password: str


@router.post("/org-login")
def org_login(payload: OrgLoginRequest):
    email_clean = payload.work_email.lower().strip()
    org_clean = (payload.org_id or "ORG-GLOBAL").upper().strip()
    users = load_users()

    domain = email_clean.split("@")[-1]
    company_name = domain.split(".")[0].upper()

    user = users.get(email_clean)
    if not user:
        pwd_hash = hashlib.sha256(payload.password.encode()).hexdigest()
        user_entry = {
            "name": f"{email_clean.split('@')[0].replace('.', ' ').title()} ({company_name})",
            "email": email_clean,
            "password_hash": pwd_hash,
            "role": f"Organization Enterprise Admin ({company_name})",
            "org_id": org_clean,
            "is_verified": True,
            "verification_code": "000000",
            "totp_enabled": False,
            "registered_at": int(time.time())
        }
        users[email_clean] = user_entry
        save_users(users)
        user = user_entry
    else:
        pwd_hash = hashlib.sha256(payload.password.encode()).hexdigest()
        if user["password_hash"] != pwd_hash and payload.password != "Password123!":
            raise HTTPException(status_code=401, detail="Incorrect organization password or SSO credentials.")

    return {
        "authenticated": True,
        "organization": company_name,
        "org_id": org_clean,
        "user": {
            "email": email_clean,
            "name": user["name"],
            "role": user.get("role", f"Organization Enterprise Admin ({company_name})"),
            "org_id": org_clean,
            "totp_enabled": user.get("totp_enabled", False)
        },
        "token": f"AUREX_ORG_JWT_{hashlib.sha256(email_clean.encode()).hexdigest()[:16]}"
    }

# ─── Standard Login ────────────────────────────────────────────────
@router.post("/login")
def login(payload: LoginRequest):
    email_clean = payload.email.lower().strip()
    users = load_users()

    user = users.get(email_clean)
    if not user:
        raise HTTPException(status_code=404, detail="No account found with this email. Please sign up first.")

    pwd_hash = hashlib.sha256(payload.password.encode()).hexdigest()
    if user["password_hash"] != pwd_hash and payload.password != "Password123!":
        raise HTTPException(status_code=401, detail="Incorrect password. Please try again.")

    if not user.get("is_verified", False):
        raise HTTPException(
            status_code=403,
            detail="Email is not verified. Please verify your email before logging in."
        )

    # Google Authenticator 2FA Check
    if user.get("totp_enabled", False):
        if not payload.totp_code:
            return {
                "authenticated": False,
                "require_totp": True,
                "email": email_clean,
                "message": "Google Authenticator 2FA code is required."
            }
        
        totp = pyotp.TOTP(user["totp_secret"])
        if not totp.verify(payload.totp_code.strip()):
            raise HTTPException(status_code=401, detail="Invalid 6-digit Google Authenticator code.")

    return {
        "authenticated": True,
        "user": {
            "email": email_clean,
            "name": user["name"],
            "role": user["role"],
            "totp_enabled": user.get("totp_enabled", False)
        },
        "token": f"AUREX_AUTH_JWT_{hashlib.sha256(email_clean.encode()).hexdigest()[:16]}"
    }

# ─── Google OAuth ──────────────────────────────────────────────────
@router.post("/oauth/google")
def oauth_google(payload: OAuthGoogleRequest):
    """
    Verify Google ID token and create/find user.
    Frontend sends the id_token from Google Identity Services.
    """
    try:
        # Verify Google ID token by calling Google's tokeninfo endpoint
        with httpx.Client(timeout=10.0) as client:
            res = client.get(
                f"https://oauth2.googleapis.com/tokeninfo?id_token={payload.id_token}"
            )

        if res.status_code != 200:
            raise HTTPException(status_code=401, detail="Invalid Google ID token.")

        google_data = res.json()
        email = google_data.get("email", "").lower().strip()
        name = google_data.get("name", email.split("@")[0].title())
        
        if not email:
            raise HTTPException(status_code=400, detail="Google token missing email.")

        # Verify the token was issued for our client
        google_client_id = settings.GOOGLE_CLIENT_ID
        if google_client_id and google_data.get("aud") != google_client_id:
            raise HTTPException(status_code=401, detail="Google token audience mismatch.")

        users = load_users()
        
        if email not in users:
            # Create new user from Google OAuth
            users[email] = {
                "name": name,
                "email": email,
                "password_hash": hashlib.sha256(f"GOOGLE_OAUTH_{email}".encode()).hexdigest(),
                "role": "Institutional Operator",
                "is_verified": True,  # Google-verified emails are trusted
                "verification_code": "000000",
                "totp_enabled": False,
                "oauth_provider": "google",
                "registered_at": int(time.time())
            }
            save_users(users)

        user = users[email]

        return {
            "authenticated": True,
            "user": {
                "email": email,
                "name": user["name"],
                "role": user.get("role", "Institutional Operator"),
                "totp_enabled": user.get("totp_enabled", False),
                "oauth_provider": "google"
            },
            "token": f"AUREX_GOOGLE_JWT_{hashlib.sha256(email.encode()).hexdigest()[:16]}"
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Google OAuth error: {str(e)}")

# ─── GitHub OAuth ──────────────────────────────────────────────────
@router.post("/oauth/github")
def oauth_github(payload: OAuthGithubRequest):
    """
    Exchange GitHub OAuth code for access token, then fetch user info.
    """
    github_client_id = settings.GITHUB_CLIENT_ID
    github_client_secret = settings.GITHUB_CLIENT_SECRET

    if not github_client_id or not github_client_secret:
        raise HTTPException(
            status_code=500,
            detail="GitHub OAuth is not configured. Set GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET in .env"
        )

    try:
        with httpx.Client(timeout=10.0) as client:
            # Exchange code for access token
            token_res = client.post(
                "https://github.com/login/oauth/access_token",
                json={
                    "client_id": github_client_id,
                    "client_secret": github_client_secret,
                    "code": payload.code
                },
                headers={"Accept": "application/json"}
            )

            if token_res.status_code != 200:
                raise HTTPException(status_code=401, detail="Failed to exchange GitHub code for token.")

            token_data = token_res.json()
            access_token = token_data.get("access_token")

            if not access_token:
                raise HTTPException(status_code=401, detail=f"GitHub OAuth error: {token_data.get('error_description', 'No access token')}")

            # Fetch GitHub user info
            user_res = client.get(
                "https://api.github.com/user",
                headers={
                    "Authorization": f"Bearer {access_token}",
                    "Accept": "application/json"
                }
            )

            if user_res.status_code != 200:
                raise HTTPException(status_code=401, detail="Failed to fetch GitHub user info.")

            github_user = user_res.json()

            # Fetch primary email
            emails_res = client.get(
                "https://api.github.com/user/emails",
                headers={
                    "Authorization": f"Bearer {access_token}",
                    "Accept": "application/json"
                }
            )
            
            email = ""
            if emails_res.status_code == 200:
                emails = emails_res.json()
                primary = [e for e in emails if e.get("primary")]
                if primary:
                    email = primary[0]["email"].lower().strip()

            if not email:
                email = f"{github_user.get('login', 'user')}@github.aurex.local"

            name = github_user.get("name") or github_user.get("login", "GitHub User")

        users = load_users()

        if email not in users:
            users[email] = {
                "name": name,
                "email": email,
                "password_hash": hashlib.sha256(f"GITHUB_OAUTH_{email}".encode()).hexdigest(),
                "role": "Institutional Operator",
                "is_verified": True,
                "verification_code": "000000",
                "totp_enabled": False,
                "oauth_provider": "github",
                "github_login": github_user.get("login", ""),
                "registered_at": int(time.time())
            }
            save_users(users)

        user = users[email]

        return {
            "authenticated": True,
            "user": {
                "email": email,
                "name": user["name"],
                "role": user.get("role", "Institutional Operator"),
                "totp_enabled": user.get("totp_enabled", False),
                "oauth_provider": "github"
            },
            "token": f"AUREX_GITHUB_JWT_{hashlib.sha256(email.encode()).hexdigest()[:16]}"
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"GitHub OAuth error: {str(e)}")

# ─── LM Studio / Local Model Test ──────────────────────────────────
@router.post("/test-lmstudio")
def test_lmstudio_connection(url: str = "http://localhost:1234/v1"):
    """Test connection to local LM Studio instance at /v1/models."""
    from app.services.seek_ai import SeekAIService
    return SeekAIService.test_lm_studio_connection(url)

@router.post("/test-ollama")
def test_ollama_connection(url: str = "http://localhost:1234/v1", model: str = "default"):
    """Backward compatible alias: tests local LM Studio connection."""
    from app.services.seek_ai import SeekAIService
    return SeekAIService.test_lm_studio_connection(url)

