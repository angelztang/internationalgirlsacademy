from fastapi import APIRouter, HTTPException, Depends
from typing import List
from supabase import Client

from app.core.database import get_supabase
from app.domain.schemas import Module, CreateModuleRequest, UpdateModuleProgressRequest, UserModulesResponse

router = APIRouter()


@router.get("/user/{user_id}", response_model=UserModulesResponse)
async def get_user_modules(user_id: int, db: Client = Depends(get_supabase)):
    """Get all modules for a user"""
    response = db.table("modules").select("*").eq("user_id", user_id).execute()

    modules = [Module(**module) for module in response.data]

    return UserModulesResponse(user_id=user_id, modules=modules)


@router.get("/{module_id}", response_model=Module)
async def get_module(module_id: int, db: Client = Depends(get_supabase)):
    """Get a specific module by ID"""
    response = db.table("modules").select("*").eq("module_id", module_id).execute()

    if not response.data:
        raise HTTPException(status_code=404, detail="Module not found")

    return Module(**response.data[0])


@router.post("", response_model=Module, status_code=201)
async def create_module(request: CreateModuleRequest, db: Client = Depends(get_supabase)):
    """Create a new module for a user"""
    # Check if user exists
    user_response = db.table("users").select("user_id").eq("user_id", request.user_id).execute()

    if not user_response.data:
        raise HTTPException(status_code=404, detail="User not found")

    # Create module
    response = db.table("modules").insert({
        "user_id": request.user_id,
        "module_progress": request.module_progress
    }).execute()

    if not response.data:
        raise HTTPException(status_code=400, detail="Failed to create module")

    return Module(**response.data[0])


@router.put("/{module_id}", response_model=Module)
async def update_module_progress(
    module_id: int,
    request: UpdateModuleProgressRequest,
    db: Client = Depends(get_supabase)
):
    """Update module progress"""
    # Check if module exists
    module_response = db.table("modules").select("*").eq("module_id", module_id).execute()

    if not module_response.data:
        raise HTTPException(status_code=404, detail="Module not found")

    # Validate progress is between 0 and 100
    if request.module_progress < 0 or request.module_progress > 100:
        raise HTTPException(status_code=400, detail="Progress must be between 0 and 100")

    # Update progress
    response = db.table("modules").update({
        "module_progress": request.module_progress
    }).eq("module_id", module_id).execute()

    if not response.data:
        raise HTTPException(status_code=400, detail="Failed to update module")

    return Module(**response.data[0])


@router.delete("/{module_id}", status_code=204)
async def delete_module(module_id: int, db: Client = Depends(get_supabase)):
    """Delete a module"""
    # Check if module exists
    module_response = db.table("modules").select("*").eq("module_id", module_id).execute()

    if not module_response.data:
        raise HTTPException(status_code=404, detail="Module not found")

    # Delete module
    db.table("modules").delete().eq("module_id", module_id).execute()

    return None
