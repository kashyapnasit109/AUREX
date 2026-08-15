import smtplib
import logging
from email.message import EmailMessage
from app.config import settings

logger = logging.getLogger("aurex.email")

class EmailService:
    """
    Service for sending verification codes and authentication alerts via Gmail SMTP.
    Supports dual-transport fallback (Port 587 STARTTLS and Port 465 SSL)
    and automatic whitespace stripping for 16-character Google App Passwords.
    """
    
    @classmethod
    def send_verification_email(cls, to_email: str, code: str) -> bool:
        smtp_server = settings.SMTP_SERVER or "smtp.gmail.com"
        sender_email = settings.SMTP_EMAIL
        sender_password = (settings.SMTP_PASSWORD or "").replace(" ", "").strip()

        if not sender_email or not sender_password:
            logger.warning(f"[EMAIL SERVICE] SMTP_EMAIL or SMTP_PASSWORD missing. Code for {to_email}: {code}")
            print(f"\n=======================================================")
            print(f"  [AUREX VERIFICATION CODE] To: {to_email}")
            print(f"  CODE: {code}")
            print(f"=======================================================\n")
            return False

        msg = EmailMessage()
        msg["Subject"] = f"AUREX Verification Code: {code}"
        msg["From"] = f"AUREX Security <{sender_email}>"
        msg["To"] = to_email

        plain_text = f"""Hello,

Thank you for registering with AUREX Enterprise Intelligence Platform.

Your 6-digit email verification code is: {code}

Please enter this code on the authentication screen to complete your registration.
This code will expire in 15 minutes.

If you did not initiate this request, please ignore this email.

Best regards,
AUREX Security Team
"""
        html_content = f"""<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #05070B; color: #E2E8F0; margin: 0; padding: 20px; }}
    .card {{ max-width: 520px; margin: 0 auto; background: #0B0F19; border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 32px; }}
    .badge {{ display: inline-block; padding: 4px 12px; background: rgba(0,229,255,0.1); border: 1px solid rgba(0,229,255,0.3); border-radius: 20px; color: #00E5FF; font-size: 12px; font-weight: 600; font-family: monospace; }}
    .title {{ font-size: 20px; font-weight: 700; color: #FFFFFF; margin: 16px 0 8px 0; }}
    .code-box {{ background: #020408; border: 1px solid rgba(0,229,255,0.4); border-radius: 12px; padding: 18px; text-align: center; margin: 24px 0; }}
    .code {{ font-family: monospace; font-size: 32px; font-weight: 800; color: #00E5FF; letter-spacing: 6px; }}
    .footer {{ font-size: 11px; color: #64748B; margin-top: 24px; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 16px; }}
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">AUREX INTELLIGENCE SECURITY</div>
    <div class="title">Verify Your Email Address</div>
    <p style="font-size: 13px; color: #94A3B8; line-height: 1.6;">
      Enter the 6-digit verification code below on the AUREX registration screen to activate your account:
    </p>
    <div class="code-box">
      <div class="code">{code}</div>
    </div>
    <p style="font-size: 12px; color: #94A3B8;">
      ⏳ This security code expires in <strong>15 minutes</strong>.
    </p>
    <div class="footer">
      This is an automated security verification message from AUREX Global Commerce & Quantitative Systems. If you did not request this, please disregard.
    </div>
  </div>
</body>
</html>
"""
        msg.set_content(plain_text)
        msg.add_alternative(html_content, subtype="html")

        # Attempt 1: Port 587 (STARTTLS)
        try:
            with smtplib.SMTP(smtp_server, 587, timeout=10.0) as server:
                server.starttls()
                server.login(sender_email, sender_password)
                server.send_message(msg)
            logger.info(f"[EMAIL SERVICE] Verification email sent to {to_email} via Port 587 TLS")
            print(f"[EMAIL SERVICE] [SUCCESS] Verification email sent to {to_email} via Port 587")
            return True
        except Exception as e587:
            logger.warning(f"[EMAIL SERVICE] Port 587 TLS attempt failed ({e587}). Falling back to Port 465 SSL...")

        # Attempt 2: Port 465 (SSL Fallback)
        try:
            with smtplib.SMTP_SSL(smtp_server, 465, timeout=10.0) as server_ssl:
                server_ssl.login(sender_email, sender_password)
                server_ssl.send_message(msg)
            logger.info(f"[EMAIL SERVICE] Verification email sent to {to_email} via Port 465 SSL")
            print(f"[EMAIL SERVICE] [SUCCESS] Verification email sent to {to_email} via Port 465 SSL")
            return True
        except Exception as e465:
            logger.error(f"[EMAIL SERVICE] Both Port 587 and 465 failed: {e465}")
            print(f"[EMAIL SERVICE] [FAILED] Failed to send email to {to_email}: {e465}. Code is: {code}")
            return False

