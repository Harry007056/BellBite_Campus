import hashlib
import secrets
from datetime import datetime, timedelta, timezone

import jwt
from argon2 import PasswordHasher
from argon2.exceptions import InvalidHashError, VerifyMismatchError

from app.config import get_settings
from app.models import User


password_hasher = PasswordHasher()


def hash_password(password: str) -> str:
    return password_hasher.hash(password)


def verify_password(password: str, password_hash: str) -> bool:
    try:
        return password_hasher.verify(password_hash, password)
    except (VerifyMismatchError, InvalidHashError):
        return False


def new_opaque_token() -> str:
    return secrets.token_urlsafe(48)


def hash_token(token: str) -> str:
    return hashlib.sha256(token.encode("utf-8")).hexdigest()


def create_access_token(user: User, session_id: int) -> tuple[str, int]:
    settings = get_settings()
    now = datetime.now(timezone.utc)
    lifetime = settings.access_token_minutes * 60
    token = jwt.encode(
        {
            "sub": str(user.id),
            "role": user.role,
            "type": "access",
            "sid": session_id,
            "iat": now,
            "exp": now + timedelta(seconds=lifetime),
            "iss": "bellbite-campus",
        },
        settings.jwt_secret_key.get_secret_value(),
        algorithm="HS256",
    )
    return token, lifetime


def decode_access_token(token: str) -> dict:
    return jwt.decode(
        token,
        get_settings().jwt_secret_key.get_secret_value(),
        algorithms=["HS256"],
        issuer="bellbite-campus",
        options={"require": ["sub", "exp", "iat", "iss", "type", "sid"]},
    )
