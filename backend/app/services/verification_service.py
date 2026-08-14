"""
Verification code management for email verification.

Generates cryptographically secure verification codes and stores them
with expiration times and single-use enforcement.
"""

import secrets
import time
import json
import os
from typing import Optional, Tuple
from datetime import datetime, timedelta
import logging

logger = logging.getLogger(__name__)

# In-memory storage for verification codes (production should use Redis)
# Format: {email: {'code': str, 'created_at': int, 'expires_at': int, 'used': bool, 'attempts': int}}
_VERIFICATION_STORE: dict = {}
_VERIFICATION_FILE = os.path.join(os.path.dirname(__file__), '..', '..', 'data', 'verification_codes.json')


def _load_verification_store() -> dict:
    """Load verification codes from file."""
    global _VERIFICATION_STORE
    try:
        if os.path.exists(_VERIFICATION_FILE):
            with open(_VERIFICATION_FILE, 'r', encoding='utf-8') as f:
                _VERIFICATION_STORE = json.load(f)
    except Exception as e:
        logger.warning(f'[VERIFICATION] Failed to load verification store: {e}')
        _VERIFICATION_STORE = {}
    return _VERIFICATION_STORE


def _save_verification_store() -> None:
    """Save verification codes to file."""
    try:
        os.makedirs(os.path.dirname(_VERIFICATION_FILE), exist_ok=True)
        with open(_VERIFICATION_FILE, 'w', encoding='utf-8') as f:
            json.dump(_VERIFICATION_STORE, f, indent=2)
    except Exception as e:
        logger.error(f'[VERIFICATION] Failed to save verification store: {e}')


def _cleanup_expired() -> None:
    """Remove expired verification codes."""
    now = int(time.time())
    expired = [email for email, data in _VERIFICATION_STORE.items() if data.get('expires_at', 0) < now]
    for email in expired:
        del _VERIFICATION_STORE[email]
    if expired:
        _save_verification_store()


class VerificationService:
    """Service for generating and validating verification codes."""
    
    # Code validity: 24 hours
    CODE_EXPIRY_SECONDS = 24 * 60 * 60
    # Rate limiting: max 5 attempts per code
    MAX_ATTEMPTS = 5
    # Code length: 6 digits
    CODE_LENGTH = 6
    
    @staticmethod
    def generate_code(email: str) -> Tuple[str, int]:
        """
        Generate a new verification code for an email.
        
        Invalidates any previous codes for this email.
        
        Args:
            email: Email address to generate code for
            
        Returns:
            Tuple of (verification_code, expires_at_timestamp)
        """
        _load_verification_store()
        _cleanup_expired()
        
        email_lower = email.lower().strip()
        
        # Generate cryptographically secure random 6-digit code
        code = ''.join([str(secrets.randbelow(10)) for _ in range(VerificationService.CODE_LENGTH)])
        
        now = int(time.time())
        expires_at = now + VerificationService.CODE_EXPIRY_SECONDS
        
        _VERIFICATION_STORE[email_lower] = {
            'code': code,
            'created_at': now,
            'expires_at': expires_at,
            'used': False,
            'attempts': 0,
        }
        
        _save_verification_store()
        logger.info(f'[VERIFICATION] Code generated for {email_lower}, expires at {datetime.fromtimestamp(expires_at)}')
        
        return code, expires_at
    
    @staticmethod
    def verify_code(email: str, code: str) -> Tuple[bool, str]:
        """
        Verify a verification code.
        
        Args:
            email: Email address
            code: Verification code to check
            
        Returns:
            Tuple of (is_valid: bool, message: str)
        """
        _load_verification_store()
        _cleanup_expired()
        
        email_lower = email.lower().strip()
        code_upper = code.strip().upper()
        
        # Check if email has a pending code
        if email_lower not in _VERIFICATION_STORE:
            return False, 'No verification code found for this email. Please request a new code.'
        
        data = _VERIFICATION_STORE[email_lower]
        now = int(time.time())
        
        # Check if already used
        if data.get('used'):
            return False, 'This verification code has already been used.'
        
        # Check if expired
        if now > data.get('expires_at', 0):
            del _VERIFICATION_STORE[email_lower]
            _save_verification_store()
            return False, 'Verification code has expired. Please request a new code.'
        
        # Check attempts
        if data.get('attempts', 0) >= VerificationService.MAX_ATTEMPTS:
            del _VERIFICATION_STORE[email_lower]
            _save_verification_store()
            return False, 'Too many failed attempts. Please request a new verification code.'
        
        # Increment attempts
        data['attempts'] = data.get('attempts', 0) + 1
        
        # Verify code (case-insensitive)
        if data.get('code', '').upper() != code_upper:
            _save_verification_store()
            remaining = VerificationService.MAX_ATTEMPTS - data['attempts']
            if remaining <= 0:
                del _VERIFICATION_STORE[email_lower]
                _save_verification_store()
                return False, 'Too many failed attempts. Please request a new verification code.'
            return False, f'Invalid verification code. {remaining} attempt(s) remaining.'
        
        # Mark as used
        data['used'] = True
        data['verified_at'] = now
        _save_verification_store()
        
        logger.info(f'[VERIFICATION] Code verified successfully for {email_lower}')
        return True, 'Email verified successfully.'
    
    @staticmethod
    def is_verified(email: str) -> bool:
        """
        Check if an email has been verified.
        
        Args:
            email: Email address to check
            
        Returns:
            True if email has a verified code, False otherwise
        """
        _load_verification_store()
        email_lower = email.lower().strip()
        
        data = _VERIFICATION_STORE.get(email_lower, {})
        return data.get('used', False) and data.get('verified_at') is not None
    
    @staticmethod
    def get_verification_status(email: str) -> dict:
        """
        Get detailed verification status for an email.
        
        Args:
            email: Email address to check
            
        Returns:
            Dictionary with verification status details
        """
        _load_verification_store()
        _cleanup_expired()
        
        email_lower = email.lower().strip()
        
        if email_lower not in _VERIFICATION_STORE:
            return {
                'verified': False,
                'status': 'not_initiated',
                'message': 'No verification code has been requested for this email.',
            }
        
        data = _VERIFICATION_STORE[email_lower]
        now = int(time.time())
        
        if data.get('used'):
            return {
                'verified': True,
                'status': 'verified',
                'message': 'Email has been verified.',
                'verified_at': data.get('verified_at'),
            }
        
        if now > data.get('expires_at', 0):
            return {
                'verified': False,
                'status': 'expired',
                'message': 'Verification code has expired. Please request a new one.',
            }
        
        if data.get('attempts', 0) >= VerificationService.MAX_ATTEMPTS:
            return {
                'verified': False,
                'status': 'locked',
                'message': 'Too many failed attempts. Please request a new verification code.',
            }
        
        return {
            'verified': False,
            'status': 'pending',
            'message': 'Verification code sent. Please check your email.',
            'attempts_remaining': VerificationService.MAX_ATTEMPTS - data.get('attempts', 0),
            'expires_at': data.get('expires_at'),
        }
    
    @staticmethod
    def clear_code(email: str) -> None:
        """Clear a verification code (on successful registration)."""
        _load_verification_store()
        email_lower = email.lower().strip()
        if email_lower in _VERIFICATION_STORE:
            del _VERIFICATION_STORE[email_lower]
            _save_verification_store()
            logger.info(f'[VERIFICATION] Code cleared for {email_lower}')
