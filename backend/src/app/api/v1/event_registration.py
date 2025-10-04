from fastapi import APIRouter, HTTPException, Depends
from supabase import Client

from app.core.database import get_supabase
from app.domain.schemas import (
    EventRegistration,
    RegisterForEventRequest,
    UserEventsResponse,
    Event,
)

router = APIRouter()


@router.get("/{user_id}/events", response_model=UserEventsResponse)
async def get_user_events(user_id: int, db: Client = Depends(get_supabase)):
    """Get all events a user is registered for"""
    response = db.table("event_registration").select(
        "*, events(*)"
    ).eq("user_id", user_id).execute()

    registrations = []
    for reg in response.data:
        event_data = reg.get("events")
        registration = EventRegistration(
            registration_id=reg["registration_id"],
            user_id=reg["user_id"],
            event_id=reg["event_id"],
            event=Event(**event_data) if event_data else None
        )
        registrations.append(registration)

    return UserEventsResponse(user_id=user_id, events=registrations)


@router.post("/events/{event_id}/register", response_model=EventRegistration, status_code=201)
async def register_for_event(
    event_id: int,
    request: RegisterForEventRequest,
    db: Client = Depends(get_supabase)
):
    """Register a user for an event"""
    # Check if event exists
    event_response = db.table("events").select("*").eq("event_id", event_id).execute()

    if not event_response.data:
        raise HTTPException(status_code=404, detail="Event not found")

    # Check if user exists
    user_response = db.table("users").select("user_id").eq("user_id", request.user_id).execute()

    if not user_response.data:
        raise HTTPException(status_code=404, detail="User not found")

    # Check if user is already registered
    existing_reg = db.table("event_registration").select("*").eq(
        "user_id", request.user_id
    ).eq("event_id", event_id).execute()

    if existing_reg.data:
        raise HTTPException(
            status_code=400,
            detail="User is already registered for this event"
        )

    # Create registration
    response = db.table("event_registration").insert({
        "user_id": request.user_id,
        "event_id": event_id
    }).execute()

    if not response.data:
        raise HTTPException(status_code=400, detail="Failed to register for event")

    return EventRegistration(**response.data[0])


@router.delete("/events/{event_id}/register/{user_id}", status_code=204)
async def unregister_from_event(
    event_id: int,
    user_id: int,
    db: Client = Depends(get_supabase)
):
    """Unregister a user from an event"""
    # Check if registration exists
    reg_response = db.table("event_registration").select("*").eq(
        "user_id", user_id
    ).eq("event_id", event_id).execute()

    if not reg_response.data:
        raise HTTPException(
            status_code=404,
            detail="Registration not found"
        )

    # Delete registration
    db.table("event_registration").delete().eq(
        "user_id", user_id
    ).eq("event_id", event_id).execute()

    return None


@router.get("/events/{event_id}/registrations", response_model=list[EventRegistration])
async def get_event_registrations(event_id: int, db: Client = Depends(get_supabase)):
    """Get all registrations for a specific event"""
    # Check if event exists
    event_response = db.table("events").select("*").eq("event_id", event_id).execute()

    if not event_response.data:
        raise HTTPException(status_code=404, detail="Event not found")

    # Get registrations
    response = db.table("event_registration").select(
        "*, users(*)"
    ).eq("event_id", event_id).execute()

    registrations = []
    for reg in response.data:
        registration = EventRegistration(
            registration_id=reg["registration_id"],
            user_id=reg["user_id"],
            event_id=reg["event_id"]
        )
        registrations.append(registration)

    return registrations
