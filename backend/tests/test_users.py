from sqlalchemy import select

from app.db import SessionLocal
from app.models import User


def signed_in_client(client):
    client.post(
        "/api/v1/auth/register",
        json={
            "full_name": "Asha Student",
            "email": "asha@example.edu",
            "college_id": "STU-001",
            "phone_number": "+919876543210",
            "password": "a-very-safe-passphrase",
        },
    )
    return client


def test_profile_update_and_password_change(client):
    signed_in_client(client)
    token = client.post(
        "/api/v1/auth/login",
        json={"email": "asha@example.edu", "password": "a-very-safe-passphrase"},
    ).json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    updated = client.put(
        "/api/v1/users/me",
        headers=headers,
        json={"full_name": "Asha Newname", "phone_number": "+919876500000"},
    )
    assert updated.status_code == 200
    assert updated.json()["full_name"] == "Asha Newname"
    assert updated.json()["email"] == "asha@example.edu"
    assert updated.json()["college_id"] == "STU-001"

    rejected_role_update = client.put(
        "/api/v1/users/me",
        headers=headers,
        json={"full_name": "Asha", "phone_number": "+919876500000", "role": "canteen_admin"},
    )
    assert rejected_role_update.status_code == 422

    changed = client.patch(
        "/api/v1/users/me/password",
        headers=headers,
        json={
            "current_password": "a-very-safe-passphrase",
            "new_password": "changed-safe-passphrase",
        },
    )
    assert changed.status_code == 200
    assert client.post(
        "/api/v1/auth/login",
        json={"email": "asha@example.edu", "password": "changed-safe-passphrase"},
    ).status_code == 200

    with SessionLocal() as db:
        user = db.scalar(select(User).where(User.email == "asha@example.edu"))
        assert user.role == "student"


def test_profile_and_password_routes_require_authentication(client):
    assert client.get("/api/v1/users/me").status_code == 401
