from functools import lru_cache

from pydantic import Field, SecretStr, field_validator, model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    database_url: str
    jwt_secret_key: SecretStr
    frontend_origins: str = "http://localhost:5173"
    cookie_secure: bool = True
    cookie_samesite: str = "strict"
    access_token_minutes: int = Field(default=15, gt=0)
    refresh_token_days: int = Field(default=30, gt=0)
    password_reset_minutes: int = Field(default=30, gt=0)
    debug: bool = False
    smtp_host: str | None = None
    smtp_port: int = Field(default=587, ge=1, le=65535)
    smtp_username: str | None = None
    smtp_password: SecretStr | None = None
    smtp_from_email: str = "no-reply@bellbitecampus.in"
    smtp_use_tls: bool = True
    rate_limit_storage_uri: str = "memory://"

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    @field_validator("jwt_secret_key")
    @classmethod
    def secret_must_be_long_enough(cls, value: SecretStr) -> SecretStr:
        if len(value.get_secret_value().encode()) < 32:
            raise ValueError("JWT_SECRET_KEY must contain at least 32 bytes")
        return value

    @field_validator("cookie_samesite")
    @classmethod
    def validate_cookie_samesite(cls, value: str) -> str:
        normalized = value.lower()
        if normalized not in {"strict", "lax", "none"}:
            raise ValueError("COOKIE_SAMESITE must be strict, lax, or none")
        return normalized

    @field_validator("frontend_origins")
    @classmethod
    def validate_frontend_origins(cls, value: str) -> str:
        origins = [origin.strip().rstrip("/") for origin in value.split(",") if origin.strip()]
        if not origins or any(origin == "*" or not origin.startswith(("http://", "https://")) for origin in origins):
            raise ValueError("FRONTEND_ORIGINS must contain explicit http(s) origins, not a wildcard")
        return ",".join(origins)

    @model_validator(mode="after")
    def secure_cookie_configuration(self) -> "Settings":
        if self.cookie_samesite == "none" and not self.cookie_secure:
            raise ValueError("COOKIE_SECURE must be true when COOKIE_SAMESITE=none")
        if not self.debug and not self.cookie_secure:
            raise ValueError("COOKIE_SECURE must be true when DEBUG=false")
        return self

    @property
    def cors_origins(self) -> list[str]:
        return [origin.strip() for origin in self.frontend_origins.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
