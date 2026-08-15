import smtplib
import logging
from email.message import EmailMessage
from app.config import settings

logger = logging.getLogger("aurex.email")

class EmailService:
    """
    Service for sending verification codes and authentication alerts via Gmail SMTP.
    """
    
    @classmethod
    def send_verification_email(cls, to_email: str, code: str) -> bool:
        smtp_server = settings.SMTP_SERVER
        smtp_port = settings.SMTP_PORT
        sender_email = settings.SMTP_EMAIL
        sender_password = settings.SMTP_PASSWORD

        if not sender_email or not sender_password:
            logger.warning(f"[EMAIL SERVICE] SMTP_EMAIL or SMTP_PASSWORD missing in .env. Verification code for {to_email}: {code}")
            print(f"\n=======================================================")
            print(f"  [AUREX VERIFICATION EMAIL] To: {to_email}")
            print(f"  VERIFICATION CODE: {code}")
            print(f"  (Add SMTP_EMAIL and SMTP_PASSWORD to .env for Gmail delivery)")
            print(f"=======================================================\n")
            return False

        msg = EmailMessage()
        msg["Subject"] = f"AUREX Verification Code: {code}"
        msg["From"] = f"AUREX Security <{sender_email}>"
        msg["To"] = to_email

        body = f"""
Hello,

Thank you for registering with AUREX Enterprise Intelligence Platform.

Your 6-digit email verification code is:

    ==================================
              {code}
    ==================================

Please enter this verification code on the authentication screen to complete your registration.
This code will expire in 15 minutes.

If you did not initiate this request, please ignore this message.

Best regards,
AUREX Security Team
        """
        msg.set_content(body)

        try:
            with smtplib.SMTP(smtp_server, smtp_port, timeout=12.0) as server:
                server.starttls()
                server.login(sender_email, sender_password)
                server.send_message(msg)
            logger.info(f"[EMAIL SERVICE] Verification email successfully sent via Gmail SMTP to {to_email}")
            print(f"[EMAIL SERVICE] Sent verification code {code} to {to_email}")
            return True
        except Exception as e:
            logger.error(f"[EMAIL SERVICE] Error sending email via SMTP ({smtp_server}:{smtp_port}): {str(e)}")
            print(f"[EMAIL SERVICE] SMTP Delivery error ({e}). Code for {to_email} is {code}")
            return False
