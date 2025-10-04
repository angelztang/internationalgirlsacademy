from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from supabase import Client
from typing import Optional

from app.core.database import get_supabase

security = HTTPBearer()

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Client = Depends(get_supabase)
) -> dict:
    """
    Verify JWT token and return current user profile.

    Usage:
        @router.get("/protected")
        async def protected_route(current_user: dict = Depends(get_current_user)):
            user_id = current_user["user_id"]
            ...
    """
    token = credentials.credentials

    try:
        # Verify token with Supabase Auth
        user_response = db.auth.get_user(token)

        if not user_response.user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )

        # Get user profile from database
        user_profile = db.table("users").select("*").eq(
            "user_id", user_response.user.id
        ).execute()

        if not user_profile.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User profile not found"
            )

        return user_profile.data[0]

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

async def get_current_user_optional(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(HTTPBearer(auto_error=False)),
    db: Client = Depends(get_supabase)
) -> Optional[dict]:
    """
    Optional auth - returns user if authenticated, None if not.
    Use for endpoints that work differently for authenticated users.
    """
    if not credentials:
        return None

    try:
        token = credentials.credentials
        user_response = db.auth.get_user(token)

        if not user_response.user:
            return None

        user_profile = db.table("users").select("*").eq(
            "user_id", user_response.user.id
        ).execute()

        if not user_profile.data:
            return None

        return user_profile.data[0]
    except Exception:
        return None

def require_role(allowed_roles: list[str]):
    """
    Dependency to check if user has required role.

    Usage:
        @router.get("/admin-only")
        async def admin_route(
            current_user: dict = Depends(get_current_user),
            _: None = Depends(require_role(["admin"]))
        ):
            ...
    """
    async def check_role(current_user: dict = Depends(get_current_user)):
        if current_user["user_type"] not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access denied. Required role: {', '.join(allowed_roles)}"
            )
    return check_role
