from fastapi import APIRouter, HTTPException, Depends
from datetime import datetime, timedelta
from supabase import Client
import time
import jwt
import os
from typing import List

from src.app.core.database import get_supabase
from src.app.domain.schemas import (
    ScheduleMeetingRequest, ScheduleMeetingResponse, UserMatch, AvailabilitySlot,
    CreateMeetingRequest, Meeting, MeetingResponse, JoinMeetingRequest, JoinMeetingResponse
)

router = APIRouter()

# Zoom SDK configuration
from src.app.core.config import settings

ZOOM_SDK_KEY = settings.ZOOM_SDK_KEY
ZOOM_SDK_SECRET = settings.ZOOM_SDK_SECRET


@router.post("/schedule", response_model=ScheduleMeetingResponse)
async def schedule_meeting(
    request: ScheduleMeetingRequest,
    db: Client = Depends(get_supabase)
):
    """
    Schedule a meeting by finding a user with overlapping availability.
    Updates the matched user's availability by removing/splitting the used slot.
    """

    # Find available users (excluding the requesting user)
    availability_response = db.table("availabilities").select(
        "*, users(*)"
    ).neq("user_id", request.user_id).execute()

    if not availability_response.data:
        raise HTTPException(status_code=404, detail="No available users found")

    duration_delta = timedelta(minutes=request.duration_minutes)
    matched_slot = None
    matched_user = None

    # Find a slot that can accommodate the requested duration
    for availability in availability_response.data:
        time_start = datetime.fromisoformat(availability["time_start"].replace("Z", "+00:00"))
        time_end = datetime.fromisoformat(availability["time_end"].replace("Z", "+00:00"))
        slot_duration = time_end - time_start

        if slot_duration >= duration_delta:
            matched_slot = availability
            matched_user = availability["users"]
            break

    if not matched_slot:
        raise HTTPException(
            status_code=404,
            detail=f"No availability slots found that can accommodate {request.duration_minutes} minutes"
        )

    # Calculate the new time slots after booking
    original_start = datetime.fromisoformat(matched_slot["time_start"].replace("Z", "+00:00"))
    original_end = datetime.fromisoformat(matched_slot["time_end"].replace("Z", "+00:00"))
    meeting_end = original_start + duration_delta

    # Delete the original slot
    db.table("availabilities").delete().eq("availability_id", matched_slot["availability_id"]).execute()

    # If there's remaining time after the meeting, create a new slot
    if meeting_end < original_end:
        db.table("availabilities").insert({
            "user_id": matched_slot["user_id"],
            "time_start": meeting_end.isoformat(),
            "time_end": original_end.isoformat()
        }).execute()

    # Return the scheduled meeting details
    scheduled_slot = AvailabilitySlot(
        availability_id=matched_slot["availability_id"],
        user_id=matched_slot["user_id"],
        time_start=original_start,
        time_end=meeting_end
    )

    user_match = UserMatch(
        user_id=matched_user["user_id"],
        first_name=matched_user["first_name"],
        last_name=matched_user["last_name"],
        user_type=matched_user["user_type"],
        experience_points=matched_user.get("experience_points"),
        gender=matched_user.get("gender")
    )

    return ScheduleMeetingResponse(
        matched_user=user_match,
        scheduled_slot=scheduled_slot,
        message=f"Meeting scheduled successfully for {request.duration_minutes} minutes"
    )


@router.post("/create", response_model=MeetingResponse)
async def create_meeting(
    request: CreateMeetingRequest,
    user_id: str,
    user_type: str,
    db: Client = Depends(get_supabase)
):
    """
    Create a new meeting. Only volunteers and admins can create meetings.
    """
    # Check if user has permission to create meetings
    if user_type not in ["volunteer", "admin"]:
        raise HTTPException(
            status_code=403,
            detail="Only volunteers and admins can create meetings"
        )
    
    # Calculate end time
    end_time = request.start_time + timedelta(minutes=request.duration_minutes)
    
    # Generate Zoom meeting ID (simple implementation)
    zoom_meeting_id = f"{int(time.time())}{user_id[:8]}"
    
    # Create meeting data
    meeting_data = {
        "title": request.title,
        "description": request.description,
        "meeting_type": request.meeting_type,
        "start_time": request.start_time.isoformat(),
        "end_time": end_time.isoformat(),
        "max_participants": request.max_participants,
        "meeting_password": request.meeting_password,
        "zoom_meeting_id": zoom_meeting_id,
        "zoom_meeting_url": f"https://zoom.us/j/{zoom_meeting_id}",
        "created_by": user_id,
        "status": "scheduled"
    }
    
    # Insert meeting into database
    result = db.table("meetings").insert(meeting_data).execute()
    
    if not result.data:
        raise HTTPException(status_code=500, detail="Failed to create meeting")
    
    meeting = result.data[0]
    
    return MeetingResponse(
        meeting_id=meeting["meeting_id"],
        title=meeting["title"],
        description=meeting["description"],
        meeting_type=meeting["meeting_type"],
        start_time=datetime.fromisoformat(meeting["start_time"].replace("Z", "+00:00")),
        end_time=datetime.fromisoformat(meeting["end_time"].replace("Z", "+00:00")),
        max_participants=meeting["max_participants"],
        meeting_password=meeting["meeting_password"],
        zoom_meeting_id=meeting["zoom_meeting_id"],
        zoom_meeting_url=meeting["zoom_meeting_url"],
        created_by=meeting["created_by"],
        created_at=datetime.fromisoformat(meeting["created_at"].replace("Z", "+00:00")),
        status=meeting["status"],
        can_join=True,
        user_role="host"
    )


@router.get("/", response_model=List[MeetingResponse])
async def get_meetings(
    user_id: str,
    user_type: str,
    db: Client = Depends(get_supabase)
):
    """
    Get all meetings. Users can see all meetings, but role determines permissions.
    """
    # Get all meetings
    result = db.table("meetings").select("*").order("start_time", desc=False).execute()
    
    if not result.data:
        return []
    
    meetings = []
    for meeting in result.data:
        # Determine user role and permissions
        user_role = "participant"
        can_join = True
        
        if meeting["created_by"] == user_id:
            user_role = "host"
        elif user_type in ["volunteer", "admin"] and meeting["meeting_type"] == "live":
            user_role = "presenter"
        
        # Check if meeting can be joined (not ended or cancelled)
        can_join = meeting["status"] in ["scheduled", "live"]
        
        meetings.append(MeetingResponse(
            meeting_id=meeting["meeting_id"],
            title=meeting["title"],
            description=meeting["description"],
            meeting_type=meeting["meeting_type"],
            start_time=datetime.fromisoformat(meeting["start_time"].replace("Z", "+00:00")),
            end_time=datetime.fromisoformat(meeting["end_time"].replace("Z", "+00:00")),
            max_participants=meeting["max_participants"],
            meeting_password=meeting["meeting_password"],
            zoom_meeting_id=meeting["zoom_meeting_id"],
            zoom_meeting_url=meeting["zoom_meeting_url"],
            created_by=meeting["created_by"],
            created_at=datetime.fromisoformat(meeting["created_at"].replace("Z", "+00:00")),
            status=meeting["status"],
            can_join=can_join,
            user_role=user_role
        ))
    
    return meetings


@router.get("/{meeting_id}", response_model=MeetingResponse)
async def get_meeting(
    meeting_id: int,
    user_id: str,
    user_type: str,
    db: Client = Depends(get_supabase)
):
    """
    Get a specific meeting by ID.
    """
    result = db.table("meetings").select("*").eq("meeting_id", meeting_id).execute()
    
    if not result.data:
        raise HTTPException(status_code=404, detail="Meeting not found")
    
    meeting = result.data[0]
    
    # Determine user role and permissions
    user_role = "participant"
    can_join = True
    
    if meeting["created_by"] == user_id:
        user_role = "host"
    elif user_type in ["volunteer", "admin"] and meeting["meeting_type"] == "live":
        user_role = "presenter"
    
    # Check if meeting can be joined
    can_join = meeting["status"] in ["scheduled", "live"]
    
    return MeetingResponse(
        meeting_id=meeting["meeting_id"],
        title=meeting["title"],
        description=meeting["description"],
        meeting_type=meeting["meeting_type"],
        start_time=datetime.fromisoformat(meeting["start_time"].replace("Z", "+00:00")),
        end_time=datetime.fromisoformat(meeting["end_time"].replace("Z", "+00:00")),
        max_participants=meeting["max_participants"],
        meeting_password=meeting["meeting_password"],
        zoom_meeting_id=meeting["zoom_meeting_id"],
        zoom_meeting_url=meeting["zoom_meeting_url"],
        created_by=meeting["created_by"],
        created_at=datetime.fromisoformat(meeting["created_at"].replace("Z", "+00:00")),
        status=meeting["status"],
        can_join=can_join,
        user_role=user_role
    )


@router.post("/{meeting_id}/join", response_model=JoinMeetingResponse)
async def join_meeting(
    meeting_id: int,
    request: JoinMeetingRequest,
    user_id: str,
    user_type: str,
    db: Client = Depends(get_supabase)
):
    """
    Join a meeting and get Zoom credentials.
    """
    # Get meeting details
    result = db.table("meetings").select("*").eq("meeting_id", meeting_id).execute()
    
    if not result.data:
        raise HTTPException(status_code=404, detail="Meeting not found")
    
    meeting = result.data[0]
    
    # Check if meeting can be joined
    if meeting["status"] not in ["scheduled", "live"]:
        raise HTTPException(status_code=400, detail="Meeting is not available for joining")
    
    # Determine user role
    user_role = "participant"
    if meeting["created_by"] == user_id:
        user_role = "host"
    elif user_type in ["volunteer", "admin"] and meeting["meeting_type"] == "live":
        user_role = "presenter"
    
    # Generate Zoom signature
    role = 1 if user_role in ["host", "presenter"] else 0
    
    payload = {
        "sdkKey": ZOOM_SDK_KEY,
        "mn": meeting["zoom_meeting_id"],
        "role": role,
        "iat": int(time.time()),
        "exp": int(time.time()) + 60 * 60,  # 1 hour expiry
        "appKey": ZOOM_SDK_KEY,
        "tokenExp": int(time.time()) + 60 * 60
    }
    
    signature = jwt.encode(payload, ZOOM_SDK_SECRET, algorithm="HS256")
    
    return JoinMeetingResponse(
        meeting_id=meeting_id,
        zoom_meeting_id=meeting["zoom_meeting_id"],
        zoom_meeting_url=meeting["zoom_meeting_url"],
        meeting_password=meeting["meeting_password"],
        user_role=user_role,
        signature=signature,
        sdk_key=ZOOM_SDK_KEY
    )


@router.put("/{meeting_id}/status")
async def update_meeting_status(
    meeting_id: int,
    status: str,
    user_id: str,
    db: Client = Depends(get_supabase)
):
    """
    Update meeting status. Only meeting creator can update status.
    """
    # Check if user is the meeting creator
    result = db.table("meetings").select("created_by").eq("meeting_id", meeting_id).execute()
    
    if not result.data:
        raise HTTPException(status_code=404, detail="Meeting not found")
    
    if result.data[0]["created_by"] != user_id:
        raise HTTPException(status_code=403, detail="Only meeting creator can update status")
    
    # Update status
    db.table("meetings").update({"status": status}).eq("meeting_id", meeting_id).execute()
    
    return {"message": f"Meeting status updated to {status}"}
