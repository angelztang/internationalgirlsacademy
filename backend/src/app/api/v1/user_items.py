from fastapi import APIRouter, HTTPException, Depends
from datetime import datetime
from supabase import Client

from app.core.database import get_supabase
from app.domain.schemas import (
    PurchaseItemRequest,
    PurchaseItemResponse,
    UserInventoryResponse,
    EquipItemRequest,
    Item,
    UserItem
)

router = APIRouter()


@router.get("/{user_id}/items", response_model=UserInventoryResponse)
async def get_user_inventory(user_id: int, db: Client = Depends(get_supabase)):
    """Get all items owned by a user"""
    response = db.table("user_items").select(
        "*, items(*)"
    ).eq("user_id", user_id).execute()

    user_items = []
    for item_data in response.data:
        user_item = UserItem(
            user_id=item_data["user_id"],
            item_id=item_data["item_id"],
            quantity=item_data["quantity"],
            acquired_at=datetime.fromisoformat(item_data["acquired_at"].replace("Z", "+00:00")),
            equipped=item_data["equipped"],
            item=Item(**item_data["items"]) if item_data.get("items") else None
        )
        user_items.append(user_item)

    return UserInventoryResponse(user_id=user_id, items=user_items)


@router.post("/{user_id}/items/purchase", response_model=PurchaseItemResponse)
async def purchase_item(
    user_id: int,
    request: PurchaseItemRequest,
    db: Client = Depends(get_supabase)
):
    """Purchase an item for a user"""
    # Get the item details
    item_response = db.table("items").select("*").eq("item_id", request.item_id).execute()

    if not item_response.data:
        raise HTTPException(status_code=404, detail="Item not found")

    item = item_response.data[0]
    total_cost = item["cost"] * request.quantity

    # Get user's current experience points
    user_response = db.table("users").select("experience_points").eq("user_id", user_id).execute()

    if not user_response.data:
        raise HTTPException(status_code=404, detail="User not found")

    user_exp = user_response.data[0]["experience_points"] or 0

    # Check if user has enough experience points
    if user_exp < total_cost:
        raise HTTPException(
            status_code=400,
            detail=f"Insufficient experience points. Need {total_cost}, have {user_exp}"
        )

    # Deduct experience points
    new_exp = user_exp - total_cost
    db.table("users").update({"experience_points": new_exp}).eq("user_id", user_id).execute()

    # Check if user already owns this item
    existing_item = db.table("user_items").select("*").eq(
        "user_id", user_id
    ).eq("item_id", request.item_id).execute()

    if existing_item.data:
        # Update quantity
        new_quantity = existing_item.data[0]["quantity"] + request.quantity
        db.table("user_items").update({
            "quantity": new_quantity
        }).eq("user_id", user_id).eq("item_id", request.item_id).execute()
    else:
        # Create new user_item entry
        db.table("user_items").insert({
            "user_id": user_id,
            "item_id": request.item_id,
            "quantity": request.quantity,
            "acquired_at": datetime.utcnow().isoformat(),
            "equipped": False
        }).execute()

    return PurchaseItemResponse(
        message=f"Successfully purchased {request.quantity}x {item['name']}",
        item=Item(**item),
        quantity=request.quantity,
        total_cost=total_cost,
        remaining_experience_points=new_exp
    )


@router.put("/{user_id}/items/{item_id}/equip")
async def equip_item(
    user_id: int,
    item_id: int,
    request: EquipItemRequest,
    db: Client = Depends(get_supabase)
):
    """Equip or unequip an item"""
    # Check if user owns the item
    user_item = db.table("user_items").select("*").eq(
        "user_id", user_id
    ).eq("item_id", item_id).execute()

    if not user_item.data:
        raise HTTPException(status_code=404, detail="User does not own this item")

    # Update equipped status
    db.table("user_items").update({
        "equipped": request.equipped
    }).eq("user_id", user_id).eq("item_id", item_id).execute()

    action = "equipped" if request.equipped else "unequipped"
    return {"message": f"Item {action} successfully"}
