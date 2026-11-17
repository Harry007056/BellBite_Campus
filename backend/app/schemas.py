from enum import StrEnum

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator


class UserRole(StrEnum):
    STUDENT = "student"
    COLLEGE_STAFF = "college_staff"
    FACULTY = "faculty"
    CANTEEN_ADMIN = "canteen_admin"


class PublicRegistrationRole(StrEnum):
    STUDENT = "student"
    COLLEGE_STAFF = "college_staff"
    FACULTY = "faculty"


class RequestModel(BaseModel):
    model_config = ConfigDict(extra="forbid")


class RegisterRequest(RequestModel):
    full_name: str = Field(min_length=2, max_length=120)
    email: EmailStr
    college_id: str = Field(min_length=1, max_length=80)
    phone_number: str = Field(min_length=7, max_length=32)
    password: str = Field(min_length=12, max_length=128)
    role: PublicRegistrationRole = PublicRegistrationRole.STUDENT

    @field_validator("full_name", "college_id", "phone_number")
    @classmethod
    def strip_required_text(cls, value: str) -> str:
        normalized = value.strip()
        if not normalized:
            raise ValueError("This field cannot be blank")
        return normalized

    @field_validator("email")
    @classmethod
    def normalize_email(cls, value: EmailStr) -> str:
        return str(value).strip().lower()

    @field_validator("college_id")
    @classmethod
    def normalize_college_id(cls, value: str) -> str:
        return value.strip().upper()


class LoginRequest(RequestModel):
    email: EmailStr
    password: str = Field(min_length=1, max_length=128)

    @field_validator("email")
    @classmethod
    def normalize_email(cls, value: EmailStr) -> str:
        return str(value).strip().lower()


class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True, extra="forbid")

    id: int
    full_name: str
    email: EmailStr
    college_id: str
    phone_number: str
    role: UserRole
    is_active: bool
    is_approved: bool


class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int
    user: UserResponse


class UpdateProfileRequest(RequestModel):
    full_name: str = Field(min_length=2, max_length=120)
    phone_number: str = Field(min_length=7, max_length=32)

    @field_validator("full_name", "phone_number")
    @classmethod
    def strip_required_text(cls, value: str) -> str:
        normalized = value.strip()
        if not normalized:
            raise ValueError("This field cannot be blank")
        return normalized


class ChangePasswordRequest(RequestModel):
    current_password: str = Field(min_length=1, max_length=128)
    new_password: str = Field(min_length=12, max_length=128)


class ForgotPasswordRequest(RequestModel):
    email: EmailStr

    @field_validator("email")
    @classmethod
    def normalize_email(cls, value: EmailStr) -> str:
        return str(value).strip().lower()


class ResetPasswordRequest(RequestModel):
    token: str = Field(min_length=32, max_length=256)
    new_password: str = Field(min_length=12, max_length=128)


class MessageResponse(BaseModel):
    message: str
