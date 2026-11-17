import os

os.environ.setdefault("DATABASE_URL", "sqlite+pysqlite:///:memory:")
os.environ.setdefault("JWT_SECRET_KEY", "test-only-signing-secret-with-32-bytes-minimum")
os.environ.setdefault("FRONTEND_ORIGINS", "http://localhost:5173")
os.environ.setdefault("COOKIE_SECURE", "false")
os.environ.setdefault("DEBUG", "true")
os.environ.setdefault("SMTP_HOST", "smtp.test")

import pytest
from fastapi.testclient import TestClient

from app.db import Base, engine
from app.main import app
from app.routers.auth import limiter


@pytest.fixture(autouse=True)
def database():
    limiter._storage.reset()
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)
    limiter._storage.reset()


@pytest.fixture
def client():
    with TestClient(app) as test_client:
        yield test_client
