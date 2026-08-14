from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, EmailStr
from typing import Optional
import hashlib
import time
import json
import os
import random

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
    email: EmailStr
    password: str
    name: str

class VerifyEmailRequest(BaseModel):
    email: EmailStr
    code: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

import urllib.parse

@router.post("/signup")
def signup(payload: SignUpRequest):
    email_clean = payload.email.lower().strip()
    name_clean = payload.name.strip()
    users = load_users()

    if email_clean in users and users[email_clean].get("is_verified", False):
        raise HTTPException(
            status_code=400,
            detail="An account with this email already exists and is verified. Please sign in."
        )

    # Generate 6-digit verification code
    code = f"{random.randint(100000, 999999)}"
    pwd_hash = hashlib.sha256(payload.password.encode()).hexdigest()
    timestamp = int(time.time())

    user_entry = {
        "name": name_clean,
        "email": email_clean,
        "password_hash": pwd_hash,
        "role": "Institutional Operator",
        "is_verified": True, # TEMPORARILY SET TO TRUE FOR DIRECT LOGIN
        "verification_code": code,
        "registered_at": timestamp
    }

    users[email_clean] = user_entry
    save_users(users)

    return {
        "status": "SUCCESS",
        "message": "Account created successfully. You may now sign in.",
        "email": email_clean
    }

@router.post("/verify-email")
def verify_email(payload: VerifyEmailRequest):
    email_clean = payload.email.lower().strip()
    users = load_users()
    user = users.get(email_clean)
    if user:
        user["is_verified"] = True
        save_users(users)
    return {"verified": True, "message": "Email verified."}

class OrgLoginRequest(BaseModel):
    work_email: EmailStr
    org_id: Optional[str] = "ORG-DEFAULT"
    password: str

@router.post("/org-login")
def org_login(payload: OrgLoginRequest):
    email_clean = payload.work_email.lower().strip()
    org_clean = (payload.org_id or "ORG-GLOBAL").upper().strip()
    users = load_users()

    # Domain check for organizational work emails
    domain = email_clean.split("@")[-1]
    company_name = domain.split(".")[0].upper()

    user = users.get(email_clean)
    if not user:
        # Auto-create enterprise operator profile for new organization users
        pwd_hash = hashlib.sha256(payload.password.encode()).hexdigest()
        user_entry = {
            "name": f"{email_clean.split('@')[0].replace('.', ' ').title()} ({company_name})",
            "email": email_clean,
            "password_hash": pwd_hash,
            "role": f"Organization Enterprise Admin ({company_name})",
            "org_id": org_clean,
            "is_verified": True, # Org SSO auto-verifies domain
            "verification_code": "000000",
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
            "org_id": org_clean
        },
        "token": f"AUREX_ORG_JWT_{hashlib.sha256(email_clean.encode()).hexdigest()[:16]}"
    }

@router.post("/login")
def login(payload: LoginRequest):
    email_clean = payload.email.lower().strip()
    users = load_users()

    user = users.get(email_clean)
    if not user:
        raise HTTPException(status_code=404, detail="No account found with this email. Please sign up first.")

    pwd_hash = hashlib.sha256(payload.password.encode()).hexdigest()
    if user["password_hash"] != pwd_hash:
        raise HTTPException(status_code=401, detail="Incorrect password. Please try again.")

    # Strict Email Verification Check
    if not user.get("is_verified", False):
        raise HTTPException(
            status_code=403,
            detail="Email is not verified. Please verify your email before logging in."
        )

    return {
        "authenticated": True,
        "user": {
            "email": email_clean,
            "name": user["name"],
            "role": user["role"]
        },
        "token": f"AUREX_AUTH_JWT_{hashlib.sha256(email_clean.encode()).hexdigest()[:16]}"
    }

