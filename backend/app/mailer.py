import smtplib
from email.message import EmailMessage
from urllib.parse import urlencode

from app.config import get_settings


class MailConfigurationError(RuntimeError):
    pass


def send_password_reset_email(email: str, reset_token: str) -> None:
    settings = get_settings()
    if not settings.smtp_host:
        raise MailConfigurationError("SMTP_HOST is not configured")

    message = EmailMessage()
    message["Subject"] = "Reset your BellBite Campus password"
    message["From"] = settings.smtp_from_email
    message["To"] = email
    reset_link = f"{settings.cors_origins[0]}/reset-password?{urlencode({'token': reset_token})}"
    message.set_content(
        "Use this one-time link to reset your BellBite Campus password. "
        "It expires shortly:\n\n"
        f"{reset_link}\n"
    )

    with smtplib.SMTP(settings.smtp_host, settings.smtp_port, timeout=10) as smtp:
        if settings.smtp_use_tls:
            smtp.starttls()
        if settings.smtp_username and settings.smtp_password:
            smtp.login(settings.smtp_username, settings.smtp_password.get_secret_value())
        smtp.send_message(message)
