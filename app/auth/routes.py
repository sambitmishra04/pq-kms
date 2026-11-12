"""
Auth routes: login, me, register-user (admin only).
"""
from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from app.auth.models import UserCreate, UserLogin, UserOut, TokenResponse
from app.auth.service import authenticate_user, create_access_token, create_user, decode_token
from app.database.db import get_db

auth_router = APIRouter(prefix="/api/auth", tags=["auth"])
security = HTTPBearer(auto_error=False)


def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    if not credentials:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")
    try:
        payload = decode_token(credentials.credentials)
        db = get_db()
        user = db.get_user_by_id(payload["sub"])
        if not user or not user["is_active"]:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found or inactive")
        return user
    except Exception:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token")


def require_admin_jwt(current_user: dict = Depends(get_current_user)) -> dict:
    if current_user["role"] != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin role required")
    return current_user


def require_admin_or_auditor(current_user: dict = Depends(get_current_user)) -> dict:
    if current_user["role"] not in ("admin", "auditor"):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin or Auditor role required")
    return current_user


@auth_router.post("/login", response_model=TokenResponse)
def login(req: UserLogin):
    user = authenticate_user(req.username, req.password)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    token = create_access_token(user["user_id"], user["username"], user["role"])
    return TokenResponse(
        access_token=token,
        user=UserOut(
            user_id=user["user_id"],
            username=user["username"],
            full_name=user["full_name"],
            role=user["role"],
            department=user["department"],
            is_active=bool(user["is_active"]),
        ),
    )


@auth_router.get("/me", response_model=UserOut)
def get_me(current_user: dict = Depends(get_current_user)):
    return UserOut(
        user_id=current_user["user_id"],
        username=current_user["username"],
        full_name=current_user["full_name"],
        role=current_user["role"],
        department=current_user.get("department"),
        is_active=bool(current_user["is_active"]),
    )


@auth_router.post("/users", response_model=UserOut)
def register_user(req: UserCreate, _: dict = Depends(require_admin_jwt)):
    db = get_db()
    existing = db.get_user_by_username(req.username)
    if existing:
        raise HTTPException(status_code=400, detail="Username already exists")
    if req.role not in ("admin", "doctor", "auditor"):
        raise HTTPException(status_code=400, detail="Role must be admin, doctor, or auditor")
    user = create_user(req.username, req.password, req.full_name, req.role, req.department)
    return UserOut(
        user_id=user["user_id"],
        username=user["username"],
        full_name=user["full_name"],
        role=user["role"],
        department=user.get("department"),
        is_active=bool(user["is_active"]),
    )


@auth_router.get("/users", response_model=list[UserOut])
def list_users(_: dict = Depends(require_admin_jwt)):
    db = get_db()
    users = db.get_all_users()
    return [
        UserOut(
            user_id=u["user_id"],
            username=u["username"],
            full_name=u["full_name"],
            role=u["role"],
            department=u.get("department"),
            is_active=bool(u["is_active"]),
        )
        for u in users
    ]
