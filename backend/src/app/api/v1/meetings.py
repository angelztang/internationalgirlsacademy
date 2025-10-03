from fastapi import APIRouter, HTTPException, Depends
from datetime import datetime, timedelta
from supabase import Client

from app.core.database import get_supabase
from app.domain.schemas import ScheduleMeetingRequest, ScheduleMeetingResponse, UserMatch, AvailabilitySlot

router = APIRouter()


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
