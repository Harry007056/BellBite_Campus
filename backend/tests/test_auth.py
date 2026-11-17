from sqlalchemy import select

from app.db import SessionLocal
from app.models import RefreshSession, User
from app.security import hash_password


def register(client, **overrides):
    payload = {
        "full_name": "Asha Student",
        "email": "asha@example.edu",
        "college_id": "STU-001",
        "phone_number": "+919876543210",
        "password": "a-very-safe-passphrase",
        "role": "student",
    }
    payload.update(overrides)
    return client.post("/api/v1/auth/register", json=payload)


def test_registration_and_public_roles(client):
    for role in ("student", "college_staff", "faculty"):
        response = register(
            client,
            email=f"{role}@example.edu",
            college_id=f"ID-{role}",
            role=role,
        )
        assert response.status_code == 201
        assert response.json()["user"]["role"] == role
        assert "password_hash" not in response.json()["user"]

    rejected = register(client, email="admin@example.edu", role="canteen_admin")
    assert rejected.status_code == 422


def test_duplicate_email_and_college_id_are_rejected(client):
    assert register(client).status_code == 201
    assert register(client, college_id="STU-002").status_code == 409
    assert register(client, email="other@example.edu").status_code == 409


def test_login_rejects_bad_password_and_inactive_accounts(client):
    assert register(client).status_code == 201
    failed = client.post(
        "/api/v1/auth/login",
        json={"email": "asha@example.edu", "password": "incorrect-password"},
    )
    assert failed.status_code == 401

    with SessionLocal() as db:
        user = db.scalar(select(User).where(User.email == "asha@example.edu"))
        user.is_active = False
        db.commit()
    unavailable = client.post(
        "/api/v1/auth/login",
        json={"email": "asha@example.edu", "password": "a-very-safe-passphrase"},
    )
    assert unavailable.status_code == 403


def test_refresh_rotates_and_replay_revokes_the_token_family(client):
    registration = register(client)
    assert registration.status_code == 201
    old_access_token = registration.json()["access_token"]
    old_cookie = client.cookies.get("bellbite_refresh")
    rotated = client.post(
        "/api/v1/auth/refresh",
        headers={"X-Requested-With": "XMLHttpRequest"},
    )
    assert rotated.status_code == 200
    rotated_cookie = rotated.cookies.get("bellbite_refresh")
    assert rotated_cookie != old_cookie

    client.cookies.clear()
    client.cookies.set("bellbite_refresh", old_cookie, path="/api/v1/auth")
    replay = client.post(
        "/api/v1/auth/refresh",
        headers={"X-Requested-With": "XMLHttpRequest"},
    )
    assert replay.status_code == 401

    client.cookies.clear()
    client.cookies.set("bellbite_refresh", rotated_cookie, path="/api/v1/auth")
    family_revoked = client.post(
        "/api/v1/auth/refresh",
        headers={"X-Requested-With": "XMLHttpRequest"},
    )
    assert family_revoked.status_code == 401
    assert client.get(
        "/api/v1/auth/me",
        headers={"Authorization": f"Bearer {old_access_token}"},
    ).status_code == 401


def test_logout_revokes_current_access_and_refresh(client):
    registration = register(client)
    access_token = registration.json()["access_token"]
    assert client.post(
        "/api/v1/auth/logout",
        headers={"X-Requested-With": "XMLHttpRequest"},
    ).status_code == 200
    assert client.post(
        "/api/v1/auth/refresh",
        headers={"X-Requested-With": "XMLHttpRequest"},
    ).status_code == 401
    assert client.get(
        "/api/v1/auth/me",
        headers={"Authorization": f"Bearer {access_token}"},
    ).status_code == 401


def test_refresh_requires_non_cross_site_request_header(client):
    assert register(client).status_code == 201
    response = client.post("/api/v1/auth/refresh")
    assert response.status_code == 403


def test_password_reset_token_is_one_time_and_revokes_sessions(client, monkeypatch):
    assert register(client).status_code == 201
    delivered = {}

    def capture_email(email, token):
        delivered["email"] = email
        delivered["token"] = token

    monkeypatch.setattr("app.routers.auth.send_password_reset_email", capture_email)
    response = client.post(
        "/api/v1/auth/forgot-password",
        json={"email": "asha@example.edu"},
    )
    assert response.status_code == 202
    assert "token" not in response.json()
    assert delivered["email"] == "asha@example.edu"

    reset = client.post(
        "/api/v1/auth/reset-password",
        json={"token": delivered["token"], "new_password": "an-even-safer-password"},
    )
    assert reset.status_code == 200
    assert client.post(
        "/api/v1/auth/reset-password",
        json={"token": delivered["token"], "new_password": "another-safe-password"},
    ).status_code == 400
    assert client.post(
        "/api/v1/auth/login",
        json={"email": "asha@example.edu", "password": "an-even-safer-password"},
    ).status_code == 200

    with SessionLocal() as db:
        sessions = list(db.scalars(select(RefreshSession)))
        assert any(session.revoked_at is not None for session in sessions)


def test_admin_endpoint_is_role_protected(client):
    assert register(client).status_code == 201
    access_token = client.post(
        "/api/v1/auth/login",
        json={"email": "asha@example.edu", "password": "a-very-safe-passphrase"},
    ).json()["access_token"]
    response = client.get(
        "/api/v1/admin/users",
        headers={"Authorization": f"Bearer {access_token}"},
    )
    assert response.status_code == 403

    with SessionLocal() as db:
        db.add(
            User(
                full_name="Canteen Admin",
                email="admin@example.edu",
                college_id="ADM-001",
                phone_number="+919999999999",
                password_hash=hash_password("admin-safe-passphrase-123"),
                role="canteen_admin",
                is_active=True,
                is_approved=True,
            )
        )
        db.commit()
    admin_token = client.post(
        "/api/v1/auth/login",
        json={"email": "admin@example.edu", "password": "admin-safe-passphrase-123"},
    ).json()["access_token"]
    assert client.get(
        "/api/v1/admin/users",
        headers={"Authorization": f"Bearer {admin_token}"},
    ).status_code == 200


def test_unapproved_users_cannot_login_or_use_protected_endpoints(client):
    registration = register(client)
    access_token = registration.json()["access_token"]
    with SessionLocal() as db:
        user = db.scalar(select(User).where(User.email == "asha@example.edu"))
        user.is_approved = False
        db.commit()

    assert client.post(
        "/api/v1/auth/login",
        json={"email": "asha@example.edu", "password": "a-very-safe-passphrase"},
    ).status_code == 403
    assert client.get(
        "/api/v1/auth/me",
        headers={"Authorization": f"Bearer {access_token}"},
    ).status_code == 401
