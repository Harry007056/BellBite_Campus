import getpass

from pydantic import EmailStr, TypeAdapter
from sqlalchemy import select

from app.db import SessionLocal
from app.models import User
from app.schemas import UserRole
from app.security import hash_password


def create_admin() -> None:
    full_name = input("Admin full name: ").strip()
    try:
        email = str(TypeAdapter(EmailStr).validate_python(input("Admin email: ").strip())).lower()
    except ValueError as error:
        raise SystemExit("Enter a valid email address.") from error
    college_id = input("College ID: ").strip().upper()
    phone_number = input("Phone number: ").strip()
    password = getpass.getpass("Password (12+ characters): ")
    if not 2 <= len(full_name) <= 120 or not 1 <= len(college_id) <= 80:
        raise SystemExit("Enter a valid name and college ID.")
    if not 7 <= len(phone_number) <= 32:
        raise SystemExit("Enter a valid phone number.")
    if not 12 <= len(password) <= 128:
        raise SystemExit("Password must contain 12 to 128 characters.")

    with SessionLocal() as db:
        if db.scalar(select(User.id).where((User.email == email) | (User.college_id == college_id))):
            raise SystemExit("Email or college ID is already registered.")
        admin = User(
            full_name=full_name,
            email=email,
            college_id=college_id,
            phone_number=phone_number,
            password_hash=hash_password(password),
            role=UserRole.CANTEEN_ADMIN.value,
            is_active=True,
            is_approved=True,
        )
        db.add(admin)
        db.commit()
    print("Canteen admin created.")


if __name__ == "__main__":
    create_admin()
