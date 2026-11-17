from datetime import datetime, timezone
from collections.abc import Callable

import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db import get_db
from app.models import RefreshSession, User
from app.schemas import UserRole
from app.security import decode_access_token


bearer_scheme = HTTPBearer(auto_error=False)


def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
    db: Session = Depends(get_db),
) -> User:
    unauthorized = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Authentication required",
        headers={"WWW-Authenticate": "Bearer"},
    )
    if credentials is None:
        raise unauthorized
    try:
        payload = decode_access_token(credentials.credentials)
        if payload.get("type") != "access":
            raise unauthorized
        user_id = int(payload["sub"])
        session_id = int(payload["sid"])
    except (jwt.InvalidTokenError, KeyError, TypeError, ValueError):
        raise unauthorized from None

    user = db.get(User, user_id)
    if user is None or not user.is_active or not user.is_approved:
        raise unauthorized
    session = db.scalar(
        select(RefreshSession).where(
            RefreshSession.id == session_id,
            RefreshSession.user_id == user_id,
        )
    )
    expires_at = None if session is None else session.expires_at
    if expires_at is not None and expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
    if session is None or session.revoked_at is not None or expires_at is None or expires_at <= datetime.now(timezone.utc):
        raise unauthorized
    return user


def require_roles(*roles: UserRole) -> Callable:
    allowed = {role.value for role in roles}

    def role_dependency(user: User = Depends(get_current_user)) -> User:
        if user.role not in allowed:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Insufficient permissions")
        return user

    return role_dependency
