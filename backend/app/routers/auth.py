import logging
import smtplib
from datetime import datetime, timedelta, timezone

import jwt
from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from fastapi.concurrency import run_in_threadpool
from fastapi.responses import JSONResponse
from sqlalchemy import select, update
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from slowapi import Limiter
from slowapi.util import get_remote_address

from app.config import get_settings
from app.dependencies import get_current_user
from app.db import get_db
from app.mailer import MailConfigurationError, send_password_reset_email
from app.models import PasswordResetToken, RefreshSession, User
from app.schemas import (
    AuthResponse,
    ForgotPasswordRequest,
    LoginRequest,
    MessageResponse,
    RegisterRequest,
    ResetPasswordRequest,
    UserResponse,
)
from app.security import (
    create_access_token,
    hash_password,
    hash_token,
    new_opaque_token,
    verify_password,
)

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/v1/auth", tags=["authentication"])
limiter = Limiter(
    key_func=get_remote_address,
    storage_uri=get_settings().rate_limit_storage_uri,
)
REFRESH_COOKIE = "bellbite_refresh"
REFRESH_COOKIE_PATH = "/api/v1/auth"
RESET_MESSAGE = "If an account exists for that email, a password reset email will be sent."


def _utc(value: datetime) -> datetime:
    return value.replace(tzinfo=timezone.utc) if value.tzinfo is None else value


def _require_cookie_request(request: Request) -> None:
    if request.headers.get("x-requested-with") != "XMLHttpRequest":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Invalid cookie-authenticated request")


def _set_refresh_cookie(response: Response, raw_token: str) -> None:
    settings = get_settings()
    response.set_cookie(
        key=REFRESH_COOKIE,
        value=raw_token,
        max_age=settings.refresh_token_days * 24 * 60 * 60,
        httponly=True,
        secure=settings.cookie_secure,
        samesite=settings.cookie_samesite,
        path=REFRESH_COOKIE_PATH,
    )


def _clear_refresh_cookie(response: Response) -> None:
    settings = get_settings()
    response.delete_cookie(
        key=REFRESH_COOKIE,
        path=REFRESH_COOKIE_PATH,
        secure=settings.cookie_secure,
        httponly=True,
        samesite=settings.cookie_samesite,
    )


def _invalid_refresh_response(detail: str) -> JSONResponse:
    response = JSONResponse(
        status_code=status.HTTP_401_UNAUTHORIZED,
        content={"detail": detail},
    )
    _clear_refresh_cookie(response)
    return response


def _new_refresh_session(
    db: Session,
    user: User,
    previous_session_id: int | None = None,
    token_family_id: str | None = None,
) -> tuple[str, RefreshSession]:
    settings = get_settings()
    raw_token = new_opaque_token()
    session = RefreshSession(
        user_id=user.id,
        token_hash=hash_token(raw_token),
        token_family_id=token_family_id or new_opaque_token(),
        expires_at=datetime.now(timezone.utc) + timedelta(days=settings.refresh_token_days),
    )
    db.add(session)
    db.flush()
    if previous_session_id is not None:
        db.execute(
            update(RefreshSession)
            .where(RefreshSession.id == previous_session_id)
            .values(replaced_by_id=session.id)
        )
    return raw_token, session


def _auth_response(db: Session, user: User, response: Response) -> AuthResponse:
    refresh_token, session = _new_refresh_session(db, user)
    access_token, lifetime = create_access_token(user, session.id)
    db.commit()
    _set_refresh_cookie(response, refresh_token)
    return AuthResponse(
        access_token=access_token,
        expires_in=lifetime,
        user=UserResponse.model_validate(user),
    )


@router.post("/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
def register(payload: RegisterRequest, response: Response, db: Session = Depends(get_db)) -> AuthResponse:
    if db.scalar(select(User.id).where(User.email == payload.email)):
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email is already registered")
    if db.scalar(select(User.id).where(User.college_id == payload.college_id)):
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="College ID is already registered")

    user = User(
        full_name=payload.full_name,
        email=payload.email,
        college_id=payload.college_id,
        phone_number=payload.phone_number,
        password_hash=hash_password(payload.password),
        role=payload.role.value,
        is_active=True,
        is_approved=True,
    )
    db.add(user)
    try:
        db.flush()
        result = _auth_response(db, user, response)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email or college ID is already registered") from None
    return result


@router.post("/login", response_model=AuthResponse)
@limiter.limit("5/minute")
def login(
    request: Request,
    payload: LoginRequest,
    response: Response,
    db: Session = Depends(get_db),
) -> AuthResponse:
    user = db.scalar(select(User).where(User.email == payload.email))
    if user is None or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")
    if not user.is_active or not user.is_approved:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Account is inactive or awaiting approval")
    return _auth_response(db, user, response)


@router.post("/refresh", response_model=AuthResponse)
def refresh(
    request: Request,
    response: Response,
    db: Session = Depends(get_db),
) -> AuthResponse | JSONResponse:
    _require_cookie_request(request)
    raw_token = request.cookies.get(REFRESH_COOKIE)
    if not raw_token:
        return _invalid_refresh_response("Refresh session is unavailable")

    stored = db.scalar(
        select(RefreshSession)
        .where(RefreshSession.token_hash == hash_token(raw_token))
        .with_for_update()
    )
    now = datetime.now(timezone.utc)
    if stored is None or stored.revoked_at is not None or _utc(stored.expires_at) <= now:
        if stored is not None and stored.revoked_at is not None and stored.replaced_by_id is not None:
            db.execute(
                update(RefreshSession)
                .where(
                    RefreshSession.token_family_id == stored.token_family_id,
                    RefreshSession.revoked_at.is_(None),
                )
                .values(revoked_at=now)
            )
            db.commit()
        return _invalid_refresh_response("Refresh session is invalid or expired")

    user = db.get(User, stored.user_id)
    if user is None or not user.is_active or not user.is_approved:
        stored.revoked_at = now
        db.commit()
        return _invalid_refresh_response("Account is unavailable")

    stored.revoked_at = now
    next_token, new_session = _new_refresh_session(
        db,
        user,
        previous_session_id=stored.id,
        token_family_id=stored.token_family_id,
    )
    access_token, lifetime = create_access_token(user, new_session.id)
    db.commit()
    _set_refresh_cookie(response, next_token)
    return AuthResponse(
        access_token=access_token,
        expires_in=lifetime,
        user=UserResponse.model_validate(user),
    )


@router.post("/logout", response_model=MessageResponse)
def logout(request: Request, response: Response, db: Session = Depends(get_db)) -> MessageResponse:
    _require_cookie_request(request)
    raw_token = request.cookies.get(REFRESH_COOKIE)
    if raw_token:
        stored = db.scalar(
            select(RefreshSession)
            .where(RefreshSession.token_hash == hash_token(raw_token))
            .with_for_update()
        )
        if stored is not None and stored.revoked_at is None:
            stored.revoked_at = datetime.now(timezone.utc)
            db.commit()
    _clear_refresh_cookie(response)
    return MessageResponse(message="Signed out")


@router.get("/me", response_model=UserResponse)
def get_authenticated_user(user: User = Depends(get_current_user)) -> User:
    return user


@router.post("/forgot-password", response_model=MessageResponse, status_code=status.HTTP_202_ACCEPTED)
@limiter.limit("3/hour")
async def forgot_password(
    request: Request,
    payload: ForgotPasswordRequest,
    db: Session = Depends(get_db),
) -> MessageResponse:
    settings = get_settings()
    if not settings.smtp_host:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="Password-reset email is not configured")

    user = db.scalar(select(User).where(User.email == str(payload.email).lower()))
    if user is None or not user.is_active:
        return MessageResponse(message=RESET_MESSAGE)

    now = datetime.now(timezone.utc)
    raw_token = new_opaque_token()
    token = PasswordResetToken(
        user_id=user.id,
        token_hash=hash_token(raw_token),
        expires_at=now + timedelta(minutes=settings.password_reset_minutes),
    )
    db.execute(
        update(PasswordResetToken)
        .where(
            PasswordResetToken.user_id == user.id,
            PasswordResetToken.used_at.is_(None),
        )
        .values(used_at=now)
    )
    db.add(token)
    try:
        await run_in_threadpool(send_password_reset_email, user.email, raw_token)
    except (MailConfigurationError, smtplib.SMTPException, OSError) as error:
        db.rollback()
        logger.error("Password reset email delivery failed", exc_info=error)
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="Password reset email could not be sent") from None
    db.commit()
    return MessageResponse(message=RESET_MESSAGE)


@router.post("/reset-password", response_model=MessageResponse)
@limiter.limit("5/hour")
def reset_password(
    request: Request,
    payload: ResetPasswordRequest,
    db: Session = Depends(get_db),
) -> MessageResponse:
    token = db.scalar(
        select(PasswordResetToken)
        .where(PasswordResetToken.token_hash == hash_token(payload.token))
        .with_for_update()
    )
    now = datetime.now(timezone.utc)
    if token is None or token.used_at is not None or _utc(token.expires_at) <= now:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Reset token is invalid or expired")

    user = db.get(User, token.user_id)
    if user is None or not user.is_active:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Reset token is invalid or expired")
    user.password_hash = hash_password(payload.new_password)
    token.used_at = now
    db.execute(
        update(RefreshSession)
        .where(RefreshSession.user_id == user.id, RefreshSession.revoked_at.is_(None))
        .values(revoked_at=now)
    )
    db.commit()
    return MessageResponse(message="Password reset successfully. Please sign in again.")
