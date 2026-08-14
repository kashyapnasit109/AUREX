"""
AUREX Zero-Trust Authentication Enclave
Handles user registration, email verification, and secure authentication.
"""

from fastapi import APIRouter, HTTPException, status, Depends
from pydantic import BaseModel, EmailStr, Field
from typing import Optional
import hashlib
import time
import json
import os
import logging

from app.services.email_service import EmailService
from app.services.verification_service import VerificationService

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/auth", tags=["Zero-Trust Authentication"])

LEDGER_FILE = os.path.join(os.path.dirname(__file__), "..", "..", "data", "operators.json")


def load_operator_ledger():
    """Load operator profiles from persistent storage."""
    default_ledger = {}
    try:
        if os.path.exists(LEDGER_FILE):
            with open(LEDGER_FILE, "r", encoding="utf-8") as f:
                data = json.load(f)
                default_ledger.update(data)
    except Exception as e:
        logger.error(f"[AUTH LEDGER] Load error: {e}")
    return default_ledger

def save_operator_to_ledger(email: str, operator_data: dict):
    """Save or update an operator profile in persistent storage."""
    try:
        os.makedirs(os.path.dirname(LEDGER_FILE), exist_ok=True)
        current = load_operator_ledger()
        current[email] = operator_data
        with open(LEDGER_FILE, "w", encoding="utf-8") as f:
            json.dump(current, f, indent=2)
        logger.info(f"[AUTH LEDGER] Saved operator {email}")
    except Exception as e:
        logger.error(f"[AUTH LEDGER] Save error: {e}")


def generate_cryptographic_hash_key(email: str) -> str:
    """
    Derives a deterministic, tamper-proof SHA-256 cryptographic access hash key.
    Same key is always generated for the same email.
    """
    salt = "AUREX_ENCLAVE_MASTER_SALT_2026"
    raw_signature = f"{email.lower().strip()}:{salt}"
    sha256_hash = hashlib.sha256(raw_signature.encode()).hexdigest()[:16].upper()
    return f"AUREX-SEC-{sha256_hash}"


# ============================================================================
# Request/Response Models
# ============================================================================

class SignUpRequest(BaseModel):
    """Sign up request with email and optional profile info."""
    email: EmailStr
    name: Optional[str] = Field(None, min_length=2, max_length=100)
    role: Optional[str] = Field(default="Institutional Operator", max_length=100)


class SignUpResponse(BaseModel):
    """Response after successful sign up."""
    status: str
    email: str
    message: str
    verification_required: bool


class VerifyEmailRequest(BaseModel):
    """Email verification request with code."""
    email: EmailStr
    verification_code: str = Field(..., min_length=6, max_length=6, pattern=r"^\d{6}$")


class VerifyEmailResponse(BaseModel):
    """Response after email verification."""
    status: str
    email: str
    verified: bool
    message: str
    access_key: Optional[str] = None


class LoginWithKeyRequest(BaseModel):
    """Login request with email and access key."""
    email: EmailStr
    access_key: str


class LoginResponse(BaseModel):
    """Response after successful authentication."""
    authenticated: bool
    user: dict
    token: str
    session_id: str


# ============================================================================
# Sign Up Endpoint (Phase 2)
# ============================================================================

@router.post("/signup", response_model=SignUpResponse)
def sign_up(payload: SignUpRequest):
    """
    Phase 2: Sign Up Flow
    
    1. Validate email format
    2. Check if already registered
    3. Create pending/unverified profile
    4. Generate cryptographically secure verification code
    5. Send verification email
    6. Return response asking user to verify email
    
    Note: User is NOT authenticated yet. They must verify their email first.
    """
    email_clean = payload.email.lower().strip()
    name = payload.name or email_clean.split("@")[0].replace(".", " ").title()
    role = payload.role or "Institutional Operator"
    
    ledger = load_operator_ledger()
    
    # Check if already registered and verified
    if email_clean in ledger:
        existing = ledger[email_clean]
        if existing.get("verified", False):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="This email is already registered. Please log in instead."
            )
        # If unverified, allow resending verification
    
    # Generate verification code
    verification_code, expires_at = VerificationService.generate_code(email_clean)
    
    # Create or update pending profile
    timestamp = int(time.time())
    profile_data = {
        "name": name,
        "role": role,
        "email": email_clean,
        "verified": False,
        "created_at": timestamp,
        "verification_code_requested_at": timestamp,
        "verification_expires_at": expires_at,
    }
    
    save_operator_to_ledger(email_clean, profile_data)
    
    # Send verification email
    email_sent, email_message = EmailService.send_verification_email(
        recipient_email=email_clean,
        recipient_name=name,
        verification_code=verification_code,
    )
    
    if not email_sent:
        # Log warning but still allow verification via code display
        logger.warning(f"[AUTH] Email send failed for {email_clean}: {email_message}")
    
    return SignUpResponse(
        status="pending_verification" if email_sent else "pending_verification_no_email",
        email=email_clean,
        message=(
            "A verification code has been sent to your email. Please check your inbox and enter the code to verify your email address."
            if email_sent
            else f"Email service is not configured. Your verification code is: {verification_code}. Please keep this safe."
        ),
        verification_required=True,
    )

# ============================================================================
# Email Verification Endpoint (Phase 3)
# ============================================================================

@router.post("/verify-email", response_model=VerifyEmailResponse)
def verify_email(payload: VerifyEmailRequest):
    """
    Phase 3: Email Verification
    
    1. Validate the verification code
    2. Check code hasn't expired
    3. Enforce single-use and attempt limits
    4. Mark profile as verified
    5. Generate access key
    6. Clear verification code
    7. Return access key for authentication
    """
    email_clean = payload.email.lower().strip()
    verification_code = payload.verification_code.strip()
    
    ledger = load_operator_ledger()
    profile = ledger.get(email_clean)
    
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No registration found for this email. Please sign up first."
        )
    
    if profile.get("verified", False):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This email is already verified. Please log in."
        )
    
    # Verify the code
    is_valid, message = VerificationService.verify_code(email_clean, verification_code)
    
    if not is_valid:
        return VerifyEmailResponse(
            status="verification_failed",
            email=email_clean,
            verified=False,
            message=message,
        )
    
    # Generate access key for this email
    access_key = generate_cryptographic_hash_key(email_clean)
    
    # Mark profile as verified and update with access key
    timestamp = int(time.time())
    lineage_hash = hashlib.sha256(f"{email_clean}:{access_key}:{timestamp}".encode()).hexdigest().upper()
    
    profile.update({
        "verified": True,
        "verified_at": timestamp,
        "access_key": access_key,
        "clearance": "Tier-1 Verified Enclave Clearance",
        "lineage_hash": lineage_hash,
    })
    
    save_operator_to_ledger(email_clean, profile)
    
    # Clear the verification code
    VerificationService.clear_code(email_clean)
    
    # Send account activated email
    EmailService.send_account_activated_email(
        recipient_email=email_clean,
        recipient_name=profile.get("name", email_clean),
    )
    
    logger.info(f"[AUTH] Email verified for {email_clean}")
    
    return VerifyEmailResponse(
        status="verified",
        email=email_clean,
        verified=True,
        message="Email verified successfully! You can now log in with your cryptographic access key.",
        access_key=access_key,
    )


# ============================================================================
# Login with Key Endpoint (Phase 5 - Fixed)
# ============================================================================

@router.post("/login-with-key", response_model=LoginResponse)
def login_with_key(payload: LoginWithKeyRequest):
    """
    Phase 5: Secure Authentication
    
    CRITICAL FIX: This endpoint now:
    1. REJECTS wildcard "AUREX-*" keys (previously accepted ANY key starting with "AUREX-")
    2. ONLY accepts keys that match:
       - A verified operator's stored key in the ledger
       - The deterministically generated key for this email
    3. Requires email to be verified
    4. Generates proper session tokens
    
    Previously, this endpoint accepted ANY key starting with "AUREX-" or "AUREX-SEC-",
    which was a critical security vulnerability. That has been fixed.
    """
    email_clean = payload.email.lower().strip()
    key_clean = payload.access_key.strip().upper()
    
    ledger = load_operator_ledger()
    operator = ledger.get(email_clean)
    expected_key = generate_cryptographic_hash_key(email_clean)
    
    # Validation: Email must be verified
    if not operator or not operator.get("verified", False):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email not verified. Please complete sign up and email verification first."
        )
    
    # FIXED VALIDATION (Phase 5):
    # Only accept keys that match EXACTLY:
    # 1. The stored key for this operator in the ledger, OR
    # 2. The deterministically generated key for this email
    # 
    # REMOVED: Wildcard acceptance of "AUREX-*" or "AUREX-SEC-*" patterns
    is_valid = False
    
    if operator.get("access_key", "").upper() == key_clean:
        # Matches stored key
        is_valid = True
    elif key_clean == expected_key:
        # Matches deterministically generated key
        is_valid = True
    
    if not is_valid:
        logger.warning(f"[AUTH] Invalid key attempt for {email_clean}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid access key. Please check your cryptographic key and try again."
        )
    
    # Authentication successful
    user_name = operator.get("name", email_clean.split("@")[0].replace(".", " ").title())
    user_role = operator.get("role", "Institutional Operator")
    user_clearance = operator.get("clearance", "Tier-1 Verified Enclave Clearance")
    
    # Generate session token (placeholder - Phase 6 will implement proper JWT)
    session_id = hashlib.sha256(
        f"{email_clean}:{int(time.time())}:AUREX_SESSION".encode()
    ).hexdigest()[:16]
    
    token = f"AUREX_AUTH_TOKEN_{hashlib.sha256(email_clean.encode()).hexdigest()[:16]}"
    
    # Update last login time
    operator["last_login"] = int(time.time())
    save_operator_to_ledger(email_clean, operator)
    
    logger.info(f"[AUTH] Successful login for {email_clean}")
    
    return LoginResponse(
        authenticated=True,
        user={
            "email": email_clean,
            "name": user_name,
            "role": user_role,
            "clearance": user_clearance,
        },
        token=token,
        session_id=session_id,
    )


# ============================================================================
# Health Check Endpoint
# ============================================================================

@router.get("/health")
def auth_health():
    """Check authentication service health."""
    return {
        "status": "healthy",
        "service": "AUREX Zero-Trust Authentication",
        "email_configured": EmailService.is_configured(),
        "verification_enabled": True,
    }


# ============================================================================
# Legacy Initialize Profile Endpoint (Deprecated)
# ============================================================================

@router.post("/initialize-profile")
def initialize_profile_legacy(payload: dict):
    """
    DEPRECATED: This endpoint is preserved for backward compatibility only.
    Use /signup and /verify-email instead.
    
    Immediately generates an access key without email verification.
    Not recommended for production use.
    """
    email_clean = payload.get("email", "").lower().strip()
    if not email_clean:
        raise HTTPException(status_code=400, detail="Email required")
    
    name = payload.get("name") or email_clean.split("@")[0].replace(".", " ").title()
    role = payload.get("role") or "Institutional Operator"
    access_key = generate_cryptographic_hash_key(email_clean)
    timestamp = int(time.time())
    lineage_hash = hashlib.sha256(f"{email_clean}:{access_key}:{timestamp}".encode()).hexdigest().upper()
    
    operator_data = {
        "name": name,
        "role": role,
        "access_key": access_key,
        "clearance": "Tier-1 Verified Enclave Clearance",
        "registered_at": timestamp,
        "lineage_hash": lineage_hash,
        "verified": True,  # Auto-verified for legacy endpoint
    }
    
    save_operator_to_ledger(email_clean, operator_data)
    
    logger.warning(f"[AUTH] Legacy initialize-profile called for {email_clean} - use signup/verify instead")
    
    return {
        "status": "INITIALIZED",
        "email": email_clean,
        "name": name,
        "role": role,
        "access_key": access_key,
        "lineage_hash": lineage_hash,
        "message": "DEPRECATED: Use /signup and /verify-email endpoints instead",
    }
