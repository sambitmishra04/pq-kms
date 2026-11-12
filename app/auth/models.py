"""
Auth Pydantic models for JWT-based user authentication.
"""
from __future__ import annotations
from typing import Optional
from pydantic import BaseModel, Field


class UserCreate(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    password: str = Field(..., min_length=6)
    full_name: str
    role: str = Field("auditor", description="Role: 'admin', 'doctor', 'auditor'")
    department: Optional[str] = None


class UserLogin(BaseModel):
    username: str
    password: str


class UserOut(BaseModel):
    user_id: str
    username: str
    full_name: str
    role: str
    department: Optional[str]
    is_active: bool


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut


class TokenData(BaseModel):
    user_id: str
    username: str
    role: str
