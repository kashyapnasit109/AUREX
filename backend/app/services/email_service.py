"""
Email service abstraction layer for AUREX authentication.

This service handles all email communications including:
- Verification code dispatches
- Account notifications
- Password resets (future)

Email is only sent if SMTP is properly configured. Otherwise, 
the system clearly reports that email functionality is not available.
"""

import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Optional, Tuple
import logging

logger = logging.getLogger(__name__)


class EmailConfig:
    """Email configuration loaded from environment variables."""
    
    SMTP_HOST: Optional[str] = os.getenv('SMTP_HOST')
    SMTP_PORT: Optional[int] = int(os.getenv('SMTP_PORT', '587'))
    SMTP_USER: Optional[str] = os.getenv('SMTP_USER')
    SMTP_PASSWORD: Optional[str] = os.getenv('SMTP_PASSWORD')
    SMTP_FROM_EMAIL: str = os.getenv('SMTP_FROM_EMAIL', 'auth-enclave@aurex.intelligence')
    SMTP_USE_TLS: bool = os.getenv('SMTP_USE_TLS', 'true').lower() == 'true'
    
    @classmethod
    def is_configured(cls) -> bool:
        """Check if SMTP is properly configured."""
        return all([
            cls.SMTP_HOST,
            cls.SMTP_USER,
            cls.SMTP_PASSWORD,
        ])


class EmailService:
    """Service for sending emails. No-op if SMTP is not configured."""
    
    @staticmethod
    def is_configured() -> bool:
        """Return whether email service is configured."""
        return EmailConfig.is_configured()
    
    @staticmethod
    def send_verification_email(
        recipient_email: str,
        recipient_name: str,
        verification_code: str,
        verification_url: Optional[str] = None,
    ) -> Tuple[bool, str]:
        """
        Send a verification code email.
        
        Args:
            recipient_email: Email address to send to
            recipient_name: User's name for personalization
            verification_code: The verification code/token to send
            verification_url: Optional URL for one-click verification
            
        Returns:
            Tuple of (success: bool, message: str)
        """
        if not EmailConfig.is_configured():
            message = 'Email service is not configured. Verification email cannot be sent.'
            logger.warning(f'[EMAIL] {message} Recipient: {recipient_email}')
            return False, message
        
        try:
            subject = f'🏛️ [AUREX ENCLAVE] Verify Your Email Address'
            
            # Build HTML email body
            if verification_url:
                verification_section = f'''
                <p style="margin-bottom: 20px;">
                    Click the link below to verify your email and activate your account:
                </p>
                <p style="margin-bottom: 20px;">
                    <a href="{verification_url}" style="display: inline-block; padding: 12px 24px; background-color: #06b6d4; color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">
                        Verify Email Address
                    </a>
                </p>
                <p style="margin-bottom: 20px; font-size: 12px; color: #999;">
                    Or copy and paste this code: <code style="background: #f0f0f0; padding: 4px 8px; border-radius: 4px;">{verification_code}</code>
                </p>
                '''
            else:
                verification_section = f'''
                <p style="margin-bottom: 20px;">
                    Your verification code is:
                </p>
                <p style="margin-bottom: 20px;">
                    <code style="display: inline-block; background: #0a0d14; color: #06b6d4; padding: 12px 16px; border-radius: 8px; font-size: 16px; font-weight: bold; font-family: monospace; letter-spacing: 2px;">
                        {verification_code}
                    </code>
                </p>
                <p style="margin-bottom: 20px; font-size: 12px; color: #999;">
                    This code will expire in 24 hours.
                </p>
                '''
            
            html_body = f'''
            <html>
                <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f9fafb; padding: 20px;">
                    <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                        <!-- Header -->
                        <div style="background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%); padding: 40px 20px; text-align: center;">
                            <h1 style="margin: 0; color: white; font-size: 24px; font-weight: 600;">AUREX Security Enclave</h1>
                            <p style="margin: 8px 0 0 0; color: rgba(255,255,255,0.9); font-size: 14px;">Email Verification Required</p>
                        </div>
                        
                        <!-- Content -->
                        <div style="padding: 40px 20px;">
                            <p style="margin-top: 0; margin-bottom: 16px; font-size: 16px; color: #1f2937;">
                                Hello <strong>{recipient_name or 'Operator'}</strong>,
                            </p>
                            
                            <p style="margin-bottom: 20px; color: #4b5563; line-height: 1.6;">
                                Thank you for registering with AUREX Enterprise Intelligence Platform. 
                                To complete your registration and activate your account, please verify your email address.
                            </p>
                            
                            {verification_section}
                            
                            <p style="margin-bottom: 20px; font-size: 12px; color: #999;">
                                <strong>Security Note:</strong> If you did not register for this account, please disregard this email.
                            </p>
                        </div>
                        
                        <!-- Footer -->
                        <div style="background-color: #f3f4f6; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280;">
                            <p style="margin: 0;">
                                © 2026 AUREX Cognitive Systems. Zero-Trust Access Ledger.
                            </p>
                        </div>
                    </div>
                </body>
            </html>
            '''
            
            # Create message
            msg = MIMEMultipart('alternative')
            msg['Subject'] = subject
            msg['From'] = EmailConfig.SMTP_FROM_EMAIL
            msg['To'] = recipient_email
            
            # Add plain text fallback
            text_body = f'''
AUREX Security Enclave - Email Verification

Hello {recipient_name or 'Operator'},

Thank you for registering with AUREX. Please verify your email by entering this code:

{verification_code}

This code expires in 24 hours.

Security Note: If you did not register, please disregard this email.

© 2026 AUREX Cognitive Systems
            '''
            
            msg.attach(MIMEText(text_body, 'plain'))
            msg.attach(MIMEText(html_body, 'html'))
            
            # Send email
            with smtplib.SMTP(EmailConfig.SMTP_HOST, EmailConfig.SMTP_PORT) as server:
                if EmailConfig.SMTP_USE_TLS:
                    server.starttls()
                server.login(EmailConfig.SMTP_USER, EmailConfig.SMTP_PASSWORD)
                server.send_message(msg)
            
            logger.info(f'[EMAIL] Verification email sent to {recipient_email}')
            return True, 'Verification email sent successfully'
            
        except Exception as e:
            error_msg = f'Failed to send verification email: {str(e)}'
            logger.error(f'[EMAIL] {error_msg} Recipient: {recipient_email}')
            return False, error_msg
    
    @staticmethod
    def send_account_activated_email(
        recipient_email: str,
        recipient_name: str,
    ) -> Tuple[bool, str]:
        """
        Send account activation confirmation email.
        
        Returns:
            Tuple of (success: bool, message: str)
        """
        if not EmailConfig.is_configured():
            message = 'Email service is not configured.'
            return False, message
        
        try:
            subject = f'🏛️ [AUREX ENCLAVE] Account Activated - Welcome!'
            
            html_body = f'''
            <html>
                <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f9fafb; padding: 20px;">
                    <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                        <div style="background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%); padding: 40px 20px; text-align: center;">
                            <h1 style="margin: 0; color: white; font-size: 24px; font-weight: 600;">AUREX Security Enclave</h1>
                            <p style="margin: 8px 0 0 0; color: rgba(255,255,255,0.9); font-size: 14px;">Account Activated</p>
                        </div>
                        
                        <div style="padding: 40px 20px;">
                            <p style="margin-top: 0; margin-bottom: 16px; font-size: 16px; color: #1f2937;">
                                Hello <strong>{recipient_name or 'Operator'}</strong>,
                            </p>
                            
                            <p style="margin-bottom: 20px; color: #4b5563; line-height: 1.6;">
                                Your AUREX account has been successfully verified and activated. 
                                You can now sign in to access the platform.
                            </p>
                            
                            <p style="margin-bottom: 20px;">
                                <a href="https://aurex.localhost/login" style="display: inline-block; padding: 12px 24px; background-color: #06b6d4; color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">
                                    Sign In to AUREX
                                </a>
                            </p>
                        </div>
                        
                        <div style="background-color: #f3f4f6; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280;">
                            <p style="margin: 0;">
                                © 2026 AUREX Cognitive Systems. Zero-Trust Access Ledger.
                            </p>
                        </div>
                    </div>
                </body>
            </html>
            '''
            
            msg = MIMEMultipart('alternative')
            msg['Subject'] = subject
            msg['From'] = EmailConfig.SMTP_FROM_EMAIL
            msg['To'] = recipient_email
            
            text_body = f'Your AUREX account has been verified and activated. You can now sign in.'
            msg.attach(MIMEText(text_body, 'plain'))
            msg.attach(MIMEText(html_body, 'html'))
            
            with smtplib.SMTP(EmailConfig.SMTP_HOST, EmailConfig.SMTP_PORT) as server:
                if EmailConfig.SMTP_USE_TLS:
                    server.starttls()
                server.login(EmailConfig.SMTP_USER, EmailConfig.SMTP_PASSWORD)
                server.send_message(msg)
            
            logger.info(f'[EMAIL] Account activation email sent to {recipient_email}')
            return True, 'Account activation email sent'
            
        except Exception as e:
            error_msg = f'Failed to send activation email: {str(e)}'
            logger.error(f'[EMAIL] {error_msg} Recipient: {recipient_email}')
            return False, error_msg
