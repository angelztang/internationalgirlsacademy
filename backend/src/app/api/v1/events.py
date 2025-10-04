from fastapi import APIRouter, HTTPException, Depends
from typing import List
from supabase import Client
from datetime import datetime

from src.app.core.database import get_supabase
from src.app.domain.schemas import (
    Event,
    CreateEventRequest,
    UpdateEventRequest,
    EventWithRegistrations,
    EventRegistration,
)

router = APIRouter()


@router.get("", response_model=List[Event])
async def get_all_events(db: Client = Depends(get_supabase)):
    """Get all events"""
    response = db.table("events").select("*").execute()

    if not response.data:
        return []

    return response.data


@router.get("/{event_id}", response_model=EventWithRegistrations)
async def get_event(event_id: int, db: Client = Depends(get_supabase)):
    """Get a specific event with registrations"""
    event_response = db.table("events").select("*").eq("event_id", event_id).execute()

    if not event_response.data:
        raise HTTPException(status_code=404, detail="Event not found")

    event = event_response.data[0]

    # Get registrations for this event
    reg_response = (
        db.table("event_registration")
        .select("*, users(*)")
        .eq("event_id", event_id)
        .execute()
    )

    registrations = [
        EventRegistration(
            registration_id=reg["registration_id"],
            user_id=reg["user_id"],
            event_id=reg["event_id"],
        )
        for reg in reg_response.data
    ]

    return EventWithRegistrations(
        event_id=event["event_id"],
        name=event.get("name"),
        start_time=event["start_time"],
        end_time=event["end_time"],
        registrations=registrations,
        total_registrations=len(registrations),
    )


@router.post("", response_model=Event, status_code=201)
async def create_event(request: CreateEventRequest, db: Client = Depends(get_supabase)):
    """Create a new event"""
    if request.end_time <= request.start_time:
        raise HTTPException(
            status_code=400, detail="Event end time must be after start time"
        )

    insert_data = {
        "name": request.name or "Untitled Event",
        "start_time": request.start_time.isoformat(),
        "end_time": request.end_time.isoformat(),
    }

    response = db.table("events").insert(insert_data).execute()

    if not response.data:
        raise HTTPException(status_code=400, detail="Failed to create event")

    return Event(**response.data[0])


@router.put("/{event_id}", response_model=Event)
async def update_event(
    event_id: int,
    request: UpdateEventRequest,
    db: Client = Depends(get_supabase),
):
    """Update an event"""
    event_response = db.table("events").select("*").eq("event_id", event_id).execute()

    if not event_response.data:
        raise HTTPException(status_code=404, detail="Event not found")

    # Build update dict
    update_data = {}
    if request.name is not None:
        update_data["name"] = request.name
    if request.start_time:
        update_data["start_time"] = request.start_time.isoformat()
    if request.end_time:
        update_data["end_time"] = request.end_time.isoformat()

    if not update_data:
        raise HTTPException(status_code=400, detail="No fields to update")

    # Validate times
    current_event = event_response.data[0]

    current_start = (
        datetime.fromisoformat(current_event["start_time"].replace("Z", "+00:00"))
        if isinstance(current_event["start_time"], str)
        else current_event["start_time"]
    )
    current_end = (
        datetime.fromisoformat(current_event["end_time"].replace("Z", "+00:00"))
        if isinstance(current_event["end_time"], str)
        else current_event["end_time"]
    )

    final_start = request.start_time or current_start
    final_end = request.end_time or current_end

    if final_end <= final_start:
        raise HTTPException(
            status_code=400, detail="Event end time must be after start time"
        )

    response = (
        db.table("events").update(update_data).eq("event_id", event_id).execute()
    )

    if not response.data:
        raise HTTPException(status_code=400, detail="Failed to update event")

    return Event(**response.data[0])


@router.delete("/{event_id}", status_code=204)
async def delete_event(event_id: int, db: Client = Depends(get_supabase)):
    """Delete an event and all its registrations"""
    event_response = db.table("events").select("*").eq("event_id", event_id).execute()

    if not event_response.data:
        raise HTTPException(status_code=404, detail="Event not found")

    # Delete registrations first
    db.table("event_registration").delete().eq("event_id", event_id).execute()

    # Delete event
    db.table("events").delete().eq("event_id", event_id).execute()

    return None
