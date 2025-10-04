from fastapi import APIRouter, HTTPException, Depends
from typing import List
from supabase import Client

from app.core.database import get_supabase
from app.domain.schemas import Item

router = APIRouter()


@router.get("", response_model=List[Item])
async def get_all_items(db: Client = Depends(get_supabase)):
    """Get all available items"""
    response = db.table("items").select("*").execute()

    if not response.data:
        return []

    return response.data


@router.get("/{item_id}", response_model=Item)
async def get_item(item_id: int, db: Client = Depends(get_supabase)):
    """Get a specific item by ID"""
    response = db.table("items").select("*").eq("item_id", item_id).execute()

    if not response.data:
        raise HTTPException(status_code=404, detail="Item not found")

    return response.data[0]


@router.post("", response_model=Item, status_code=201)
async def create_item(item: Item, db: Client = Depends(get_supabase)):
    """Create a new item (admin only)"""
    response = db.table("items").insert({
        "name": item.name,
        "cost": item.cost
    }).execute()

    if not response.data:
        raise HTTPException(status_code=400, detail="Failed to create item")

    return response.data[0]
