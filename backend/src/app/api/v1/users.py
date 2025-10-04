from fastapi import APIRouter, HTTPException, Depends
from typing import List
from supabase import Client

from app.core.database import get_supabase
from app.domain.schemas import (
    UserRegisterRequest,
    UserLoginRequest,
    AuthResponse,
    UserProfileResponse
)

router = APIRouter()

@router.get("", response_model=List[UserProfileResponse])
async def get_all_users(db: Client = Depends(get_supabase)):
    """Get all users (for organizer dashboard)"""
    response = db.table("users").select("*").execute()

    users = []
    for user_data in response.data:
        users.append(UserProfileResponse(
            user_id=user_data["user_id"],
            email=user_data["email"],
            first_name=user_data["first_name"],
            last_name=user_data["last_name"],
            user_type=user_data["user_type"],
            gender=user_data.get("gender"),
            experience_points=int(user_data.get("experience_points", 0))
        ))

    return users

@router.post("/register", response_model=AuthResponse, status_code=201)
async def register_user(
    request: UserRegisterRequest,
    db: Client = Depends(get_supabase)
):
    """Register a new user with Supabase Auth"""
    try:
        # Register user with Supabase Auth
        auth_response = db.auth.sign_up({
            "email": request.email,
            "password": request.password,
            "options": {
                "data": {
                    "first_name": request.first_name,
                    "last_name": request.last_name,
                    "user_type": request.user_type,
                    "gender": request.gender
                }
            }
        })

        if not auth_response.user:
            raise HTTPException(status_code=400, detail="Registration failed")

        # Insert user profile into users table
        user_data = {
            "user_id": auth_response.user.id,
            "email": request.email,
            "first_name": request.first_name,
            "last_name": request.last_name,
            "user_type": request.user_type,
            "gender": request.gender,
            "experience_points": 0
        }

        db.table("users").insert(user_data).execute()

        # Return auth response
        return AuthResponse(
            access_token=auth_response.session.access_token if auth_response.session else "",
            user=UserProfileResponse(
                user_id=auth_response.user.id,
                email=auth_response.user.email or request.email,
                first_name=request.first_name,
                last_name=request.last_name,
                user_type=request.user_type,
                gender=request.gender,
                experience_points=0
            )
        )

    except Exception as e:
        if "User already registered" in str(e) or "already exists" in str(e).lower():
            raise HTTPException(
                status_code=400,
                detail="User with this email already exists"
            )
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/login", response_model=AuthResponse)
async def login_user(
    request: UserLoginRequest,
    db: Client = Depends(get_supabase)
):
    """Login user with Supabase Auth"""
    try:
        # Authenticate with Supabase
        auth_response = db.auth.sign_in_with_password({
            "email": request.email,
            "password": request.password
        })

        if not auth_response.user or not auth_response.session:
            raise HTTPException(
                status_code=401,
                detail="Invalid email or password"
            )

        # Get user profile from users table
        user_profile = db.table("users").select("*").eq(
            "user_id", auth_response.user.id
        ).execute()

        if not user_profile.data:
            raise HTTPException(
                status_code=404,
                detail="User profile not found"
            )

        profile = user_profile.data[0]

        return AuthResponse(
            access_token=auth_response.session.access_token,
            user=UserProfileResponse(
                user_id=profile["user_id"],
                email=profile["email"],
                first_name=profile["first_name"],
                last_name=profile["last_name"],
                user_type=profile["user_type"],
                gender=profile.get("gender"),
                experience_points=int(profile.get("experience_points", 0))
            )
        )

    except HTTPException:
        raise
    except Exception as e:
        if "Invalid login credentials" in str(e):
            raise HTTPException(
                status_code=401,
                detail="Invalid email or password"
            )
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/me", response_model=UserProfileResponse)
async def get_current_user(
    token: str,
    db: Client = Depends(get_supabase)
):
    """Get current user profile using JWT token"""
    try:
        # Verify token and get user
        user_response = db.auth.get_user(token)

        if not user_response.user:
            raise HTTPException(
                status_code=401,
                detail="Invalid or expired token"
            )

        # Get user profile
        user_profile = db.table("users").select("*").eq(
            "user_id", user_response.user.id
        ).execute()

        if not user_profile.data:
            raise HTTPException(
                status_code=404,
                detail="User profile not found"
            )

        profile = user_profile.data[0]

        return UserProfileResponse(
            user_id=profile["user_id"],
            email=profile["email"],
            first_name=profile["first_name"],
            last_name=profile["last_name"],
            user_type=profile["user_type"],
            gender=profile.get("gender"),
            experience_points=int(profile.get("experience_points", 0))
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token"
        )

@router.put("/{user_id}", response_model=UserProfileResponse)
async def update_user_profile(
    user_id: str,
    first_name: str = None,
    last_name: str = None,
    gender: str = None,
    bio: str = None,
    db: Client = Depends(get_supabase)
):
    """Update user profile"""
    try:
        update_data = {}
        if first_name is not None:
            update_data["first_name"] = first_name
        if last_name is not None:
            update_data["last_name"] = last_name
        if gender is not None:
            update_data["gender"] = gender
        if bio is not None:
            update_data["bio"] = bio

        if not update_data:
            raise HTTPException(status_code=400, detail="No fields to update")

        # Update user profile
        response = db.table("users").update(update_data).eq(
            "user_id", user_id
        ).execute()

        if not response.data:
            raise HTTPException(status_code=404, detail="User not found")

        profile = response.data[0]

        return UserProfileResponse(
            user_id=profile["user_id"],
            email=profile["email"],
            first_name=profile["first_name"],
            last_name=profile["last_name"],
            user_type=profile["user_type"],
            gender=profile.get("gender"),
            experience_points=int(profile.get("experience_points", 0))
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )
