from pydantic import BaseModel, EmailStr
from typing import Optional


class UserCreate(BaseModel):
    first_name: str
    last_name: str
    email: str
    password: str
    user_type: str  # e.g., "student", "instructor", "admin"
    gender: Optional[str] = None


class UserResponse(BaseModel):
    id: int
    first_name: str
    last_name: str
    email: str
    experience_points: int
    user_type: str
    gender: Optional[str] = None

    class Config:
        from_attributes = True
