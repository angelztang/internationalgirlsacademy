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
    experience_points: Optional[float] = None
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
    remaining_experience_points: float


class EquipItemRequest(BaseModel):
    equipped: bool


class UserInventoryResponse(BaseModel):
    user_id: int
    items: List[UserItem]
