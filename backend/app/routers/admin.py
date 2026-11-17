from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db import get_db
from app.dependencies import require_roles
from app.models import User
from app.schemas import UserResponse, UserRole

router = APIRouter(prefix="/api/v1/admin", tags=["administration"])


@router.get("/users", response_model=list[UserResponse])
def list_users(
    _admin: User = Depends(require_roles(UserRole.CANTEEN_ADMIN)),
    db: Session = Depends(get_db),
) -> list[User]:
    return list(db.scalars(select(User).order_by(User.id)))
