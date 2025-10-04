from fastapi import APIRouter, HTTPException, Depends
from typing import List
from datetime import datetime
from supabase import Client

from src.app.core.database import get_supabase
from src.app.domain.schemas import (
    CreateAvailabilityRequest,
    UpdateAvailabilityRequest,
    AvailabilityResponse,
    AvailabilitySlot
)

router = APIRouter()


@router.get("/{user_id}", response_model=List[AvailabilityResponse])
async def get_user_availability(user_id: str, db: Client = Depends(get_supabase)):
    """Get all availability slots for a user"""
    response = db.table("availabilities").select("*").eq("user_id", user_id).execute()
    
    if not response.data:
        return []
    
    return [AvailabilityResponse(**slot) for slot in response.data]


@router.post("/{user_id}", response_model=AvailabilityResponse, status_code=201)
async def create_availability(
    user_id: str,
    request: CreateAvailabilityRequest,
    db: Client = Depends(get_supabase)
):
    """Create a new availability slot for a user"""
    # Validate that time_end is after time_start
    if request.time_end <= request.time_start:
        raise HTTPException(
            status_code=400,
            detail="End time must be after start time"
        )
    
    # Check for overlapping availability slots
    overlap_response = db.table("availabilities").select("*").eq("user_id", user_id).execute()
    
    for existing_slot in overlap_response.data:
        existing_start = datetime.fromisoformat(existing_slot["time_start"].replace("Z", "+00:00"))
        existing_end = datetime.fromisoformat(existing_slot["time_end"].replace("Z", "+00:00"))
        
        # Check if new slot overlaps with existing one
        if (request.time_start < existing_end and request.time_end > existing_start):
            raise HTTPException(
                status_code=400,
                detail=f"Availability slot conflicts with existing slot from {existing_start} to {existing_end}"
            )
    
    # Create the availability slot
    insert_data = {
        "user_id": user_id,
        "time_start": request.time_start.isoformat(),
        "time_end": request.time_end.isoformat()
    }
    
    response = db.table("availabilities").insert(insert_data).execute()
    
    if not response.data:
        raise HTTPException(status_code=500, detail="Failed to create availability slot")
    
    return AvailabilityResponse(**response.data[0])


@router.put("/{availability_id}", response_model=AvailabilityResponse)
async def update_availability(
    availability_id: int,
    request: UpdateAvailabilityRequest,
    db: Client = Depends(get_supabase)
):
    """Update an existing availability slot"""
    # Validate that time_end is after time_start
    if request.time_end <= request.time_start:
        raise HTTPException(
            status_code=400,
            detail="End time must be after start time"
        )
    
    # Check if availability slot exists
    existing_response = db.table("availabilities").select("*").eq("availability_id", availability_id).execute()
    
    if not existing_response.data:
        raise HTTPException(status_code=404, detail="Availability slot not found")
    
    existing_slot = existing_response.data[0]
    user_id = existing_slot["user_id"]
    
    # Check for overlapping availability slots (excluding the current one)
    overlap_response = db.table("availabilities").select("*").eq("user_id", user_id).neq("availability_id", availability_id).execute()
    
    for other_slot in overlap_response.data:
        other_start = datetime.fromisoformat(other_slot["time_start"].replace("Z", "+00:00"))
        other_end = datetime.fromisoformat(other_slot["time_end"].replace("Z", "+00:00"))
        
        # Check if updated slot overlaps with other slots
        if (request.time_start < other_end and request.time_end > other_start):
            raise HTTPException(
                status_code=400,
                detail=f"Availability slot conflicts with existing slot from {other_start} to {other_end}"
            )
    
    # Update the availability slot
    update_data = {
        "time_start": request.time_start.isoformat(),
        "time_end": request.time_end.isoformat()
    }
    
    response = db.table("availabilities").update(update_data).eq("availability_id", availability_id).execute()
    
    if not response.data:
        raise HTTPException(status_code=500, detail="Failed to update availability slot")
    
    return AvailabilityResponse(**response.data[0])


@router.delete("/{availability_id}")
async def delete_availability(availability_id: int, db: Client = Depends(get_supabase)):
    """Delete an availability slot"""
    # Check if availability slot exists
    existing_response = db.table("availabilities").select("*").eq("availability_id", availability_id).execute()
    
    if not existing_response.data:
        raise HTTPException(status_code=404, detail="Availability slot not found")
    
    # Delete the availability slot
    response = db.table("availabilities").delete().eq("availability_id", availability_id).execute()
    
    return {"message": "Availability slot deleted successfully"}
