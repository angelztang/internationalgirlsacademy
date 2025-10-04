from datetime import datetime
from pydantic import BaseModel
from typing import Optional, List


class ScheduleMeetingRequest(BaseModel):
    user_id: str  # Changed to UUID
    duration_minutes: int


class AvailabilitySlot(BaseModel):
    availability_id: int
    user_id: str  # Changed to UUID
    time_start: datetime
    time_end: datetime


class UserMatch(BaseModel):
    user_id: str  # Changed to UUID
    first_name: str
    last_name: str
    user_type: str
    experience_points: Optional[int] = None
    gender: Optional[str] = None


class ScheduleMeetingResponse(BaseModel):
    matched_user: UserMatch
    scheduled_slot: AvailabilitySlot
    message: str


# New meeting schemas for live meetings
class CreateMeetingRequest(BaseModel):
    title: str
    description: Optional[str] = None
    meeting_type: str  # "live" or "normal"
    start_time: datetime
    duration_minutes: int
    max_participants: Optional[int] = None
    meeting_password: Optional[str] = None


class Meeting(BaseModel):
    meeting_id: int
    title: str
    description: Optional[str] = None
    meeting_type: str
    start_time: datetime
    end_time: datetime
    max_participants: Optional[int] = None
    meeting_password: Optional[str] = None
    zoom_meeting_id: Optional[str] = None
    zoom_meeting_url: Optional[str] = None
    created_by: str  # UUID
    created_at: datetime
    status: str  # "scheduled", "live", "ended", "cancelled"


class MeetingResponse(BaseModel):
    meeting_id: int
    title: str
    description: Optional[str] = None
    meeting_type: str
    start_time: datetime
    end_time: datetime
    max_participants: Optional[int] = None
    meeting_password: Optional[str] = None
    zoom_meeting_id: Optional[str] = None
    zoom_meeting_url: Optional[str] = None
    created_by: str
    created_at: datetime
    status: str
    can_join: bool = False
    user_role: str = "participant"  # "host", "presenter", "participant"


class JoinMeetingRequest(BaseModel):
    meeting_id: int
    user_name: str


class JoinMeetingResponse(BaseModel):
    meeting_id: int
    zoom_meeting_id: str
    zoom_meeting_url: Optional[str] = None
    meeting_password: Optional[str] = None
    user_role: str
    signature: str
    sdk_key: str


# Item schemas
class Item(BaseModel):
    item_id: int
    name: str
    cost: int


class UserItem(BaseModel):
    user_id: int
    item_id: int
    quantity: int
    acquired_at: datetime
    equipped: bool
    item: Optional[Item] = None


class PurchaseItemRequest(BaseModel):
    item_id: int
    quantity: int = 1


class PurchaseItemResponse(BaseModel):
    message: str
    item: Item
    quantity: int
    total_cost: int
    remaining_experience_points: int


class EquipItemRequest(BaseModel):
    equipped: bool


class UserInventoryResponse(BaseModel):
    user_id: int
    items: List[UserItem]


# Module schemas
class Module(BaseModel):
    module_id: int
    user_id: str  # UUID from Supabase
    progress: float  # Changed from module_progress to match DB schema


class CreateModuleRequest(BaseModel):
    user_id: str  # UUID from Supabase
    progress: float = 0.0  # Changed from module_progress


class UpdateModuleProgressRequest(BaseModel):
    progress: float  # Changed from module_progress


class UserModulesResponse(BaseModel):
    user_id: str  # UUID from Supabase
    modules: List[Module]


# Event schemas
class Event(BaseModel):
    event_id: int
    name: Optional[str] = None
    start_time: datetime
    end_time: datetime


class CreateEventRequest(BaseModel):
    name: Optional[str] = None  # ← keep this if you want name to be optional
    start_time: datetime
    end_time: datetime



class UpdateEventRequest(BaseModel):
    name: Optional[str] = None  # ← keep this if you want name to be optional
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None


class EventRegistration(BaseModel):
    registration_id: int
    user_id: str  # UUID
    event_id: int
    event: Optional[Event] = None
    user: Optional[UserMatch] = None


class RegisterForEventRequest(BaseModel):
    user_id: str  # UUID


class EventWithRegistrations(BaseModel):
    event_id: int
    name: Optional[str] = None
    start_time: datetime
    end_time: datetime
    registrations: List[EventRegistration]
    total_registrations: int


class UserEventsResponse(BaseModel):
    user_id: str  # UUID
    events: List[EventRegistration]


# Auth schemas
class UserRegisterRequest(BaseModel):
    email: str
    password: str
    first_name: str
    last_name: str
    user_type: str  # student, volunteer, admin
    gender: Optional[str] = None


class UserLoginRequest(BaseModel):
    email: str
    password: str


class UserProfileResponse(BaseModel):
    user_id: str
    email: str
    first_name: str
    last_name: str
    user_type: str
    gender: Optional[str] = None
    experience_points: int = 0
    profile_picture_url: Optional[str] = None


class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserProfileResponse
