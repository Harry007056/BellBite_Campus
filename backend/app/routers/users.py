from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import update
from sqlalchemy.orm import Session

from app.db import get_db
from app.dependencies import get_current_user
from app.models import RefreshSession, User
from app.schemas import ChangePasswordRequest, UpdateProfileRequest, UserResponse
from app.security import hash_password, verify_password

router = APIRouter(prefix="/api/v1/users", tags=["users"])


@router.get("/me", response_model=UserResponse)
def get_profile(user: User = Depends(get_current_user)) -> User:
    return user


@router.put("/me", response_model=UserResponse)
def update_profile(
    payload: UpdateProfileRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> User:
    user.full_name = payload.full_name
    user.phone_number = payload.phone_number
    user.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(user)
    return user


@router.patch("/me/password")
def change_password(
    payload: ChangePasswordRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> dict[str, str]:
    if not verify_password(payload.current_password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Current password is incorrect")
    if verify_password(payload.new_password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="New password must be different from the current password",
        )

    now = datetime.now(timezone.utc)
    user.password_hash = hash_password(payload.new_password)
    user.updated_at = now
    db.execute(
        update(RefreshSession)
        .where(
            RefreshSession.user_id == user.id,
            RefreshSession.revoked_at.is_(None),
        )
        .values(revoked_at=now)
    )
    db.commit()
    return {"message": "Password changed. Sign in again on your other devices."}
