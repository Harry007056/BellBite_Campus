# BellBite Campus

BellBite Campus is a campus food-ordering application. The repository contains a React/TypeScript/Vite frontend and a FastAPI authentication and user-management API.

## Frontend

Install dependencies and run the existing frontend:

```powershell
npm install
npm run dev
```

By default, the frontend calls `http://localhost:8000/api/v1`. To use another API origin, create a frontend `.env.local` with `VITE_API_BASE_URL=https://your-api.example/api/v1`, then restart Vite.

The access token is short-lived and held in tab-scoped `sessionStorage`. Refresh tokens are only sent as HttpOnly cookies; they are rotated on use and never exposed to JavaScript. Public routes remain available when signed out. Orders/profile routes require authentication, and `/admin` is restricted to canteen administrators.

## Backend setup

Requirements: Python 3.11+, PostgreSQL, and (for multi-worker production deployments) Redis.

1. Create a PostgreSQL database and user, then open a terminal in `backend`.
2. Create and activate a virtual environment, install dependencies, and configure the environment:

   ```powershell
   py -m venv .venv
   .\.venv\Scripts\Activate.ps1
   python -m pip install -r requirements.txt
   Copy-Item .env.example .env
   python -c "import secrets; print(secrets.token_urlsafe(48))"
   ```

   Set `DATABASE_URL`, replace `JWT_SECRET_KEY` with the generated value, and configure the SMTP values in `.env`. Keep `.env` private and use `COOKIE_SECURE=true` with HTTPS in production. Add every frontend origin explicitly to `FRONTEND_ORIGINS`.

3. Apply the additive schema migration and start the API:

   ```powershell
   alembic upgrade head
   uvicorn app.main:app --reload
   ```

   The API health check is at `http://localhost:8000/health`. Interactive API documentation is enabled only when `DEBUG=true`.

4. Create canteen administrator accounts from a trusted server shell after migrations:

   ```powershell
   python -m app.cli
   ```

   This prompts for account details and a password; there is no public admin-registration endpoint. Do not expose server or database credentials to frontend users.

The first migration adds the user, refresh-session, and password-reset-token tables; it does not drop or rewrite existing tables. Back up the database before applying production migrations.

## Authentication and user API

All routes are prefixed with `/api/v1`.

| Method | Route | Purpose |
|---|---|---|
| POST | `/auth/register` | Public registration for student, college staff, or faculty |
| POST | `/auth/login` | Verify credentials and issue access/refresh tokens |
| POST | `/auth/refresh` | Rotate the HttpOnly refresh session |
| POST | `/auth/logout` | Revoke the current refresh session |
| POST | `/auth/forgot-password` | Send a time-limited reset link through configured SMTP |
| POST | `/auth/reset-password` | Consume a one-time reset token and revoke sessions |
| GET | `/auth/me`, `/users/me` | Get the authenticated user's profile |
| PUT | `/users/me` | Update full name and phone number |
| PATCH | `/users/me/password` | Change password and revoke refresh sessions |
| GET | `/admin/users` | Canteen-admin-only account directory |

Public registration cannot set `canteen_admin`; unknown fields such as `role` on profile updates are rejected. Email and college ID are normalized and unique. Passwords are Argon2-hashed. Inactive and unapproved accounts cannot log in or call protected endpoints. The API reads roles from the database, not client-supplied JWT role claims.

Configure SMTP (`SMTP_HOST`, `SMTP_PORT`, `SMTP_FROM_EMAIL`, optional credentials) to enable password reset. Reset tokens are never returned by the API. Configure a shared Redis `RATE_LIMIT_STORAGE_URI` for multi-worker or multi-instance production deployments; the in-memory limiter is suitable only for local/single-process use.

## Tests

Frontend production build:

```powershell
npm run build
```

Backend tests use an isolated in-memory SQLite database and stub email delivery; they do not require PostgreSQL or a live SMTP server:

```powershell
cd backend
python -m pip install -r requirements.txt
python -m pytest
```

The API deployment itself uses PostgreSQL through `DATABASE_URL`.
