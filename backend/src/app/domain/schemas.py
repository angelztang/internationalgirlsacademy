from datetime import datetime
from pydantic import BaseModel
from typing import Optional


class ScheduleMeetingRequest(BaseModel):
    user_id: int
    duration_minutes: int


class AvailabilitySlot(BaseModel):
    availability_id: int
    user_id: int
    time_start: datetime
    time_end: datetime


class UserMatch(BaseModel):
    user_id: int
    first_name: str
    last_name: str
    user_type: str
    experience_points: Optional[float] = None
    gender: Optional[str] = None


class ScheduleMeetingResponse(BaseModel):
    matched_user: UserMatch
    scheduled_slot: AvailabilitySlot
    message: str
