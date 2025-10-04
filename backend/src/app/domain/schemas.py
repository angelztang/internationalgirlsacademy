from datetime import datetime
from pydantic import BaseModel
from typing import Optional, List


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
    experience_points: Optional[int] = None
    gender: Optional[str] = None


class ScheduleMeetingResponse(BaseModel):
    matched_user: UserMatch
    scheduled_slot: AvailabilitySlot
    message: str


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
    user_id: int
    module_progress: float


class CreateModuleRequest(BaseModel):
    user_id: int
    module_progress: float = 0.0


class UpdateModuleProgressRequest(BaseModel):
    module_progress: float


class UserModulesResponse(BaseModel):
    user_id: int
    modules: List[Module]


# Event schemas
class Event(BaseModel):
    event_id: int
    start_time: datetime
    end_time: datetime


class CreateEventRequest(BaseModel):
    start_time: datetime
    end_time: datetime


class UpdateEventRequest(BaseModel):
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None


class EventRegistration(BaseModel):
    registration_id: int
    user_id: int
    event_id: int
    event: Optional[Event] = None
    user: Optional[UserMatch] = None


class RegisterForEventRequest(BaseModel):
    user_id: int


class EventWithRegistrations(BaseModel):
    event_id: int
    start_time: datetime
    end_time: datetime
    registrations: List[EventRegistration]
    total_registrations: int


class UserEventsResponse(BaseModel):
    user_id: int
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


class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserProfileResponse
