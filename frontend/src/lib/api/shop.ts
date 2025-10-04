// API utility file to integrate Shop with backend API 

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ||
  'http://localhost:8000/api/v1';

  export interface Item {
    item_id: number;
    name: string;
    cost: number;
  }

  export interface UserItem {
    user_id: string; // UUID
    item_id: number;
    quantity: number;
    acquired_at: string;
    equipped: boolean;
    item?: Item;
  }

  export interface PurchaseRequest {
    item_id: number;
    quantity: number;
  }

  export interface PurchaseResponse {
    message: string;
    item: Item;
    quantity: number;
    total_cost: number;
    remaining_experience_points: number;
  }

  // Fetch all available shop items
  export async function getAllItems(): Promise<Item[]> {
    const response = await fetch(`${API_BASE_URL}/items`);
    if (!response.ok) {
      throw new Error('Failed to fetch items');
    }
    return response.json();
  }

  // Get user's inventory
  export async function getUserInventory(userId: string): Promise<UserItem[]> 
  {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/items`);
    if (!response.ok) {
      throw new Error('Failed to fetch user inventory');
    }
    const data = await response.json();
    return data.items;
  }

  // Purchase an item
  export async function purchaseItem(userId: string, request: 
  PurchaseRequest): Promise<PurchaseResponse> {
    const response = await
  fetch(`${API_BASE_URL}/users/${userId}/items/purchase`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to purchase item');
    }

    return response.json();
  }

  // Equip/unequip an item
  export async function equipItem(userId: string, itemId: number, equipped: 
  boolean): Promise<void> {
    const response = await
  fetch(`${API_BASE_URL}/users/${userId}/items/${itemId}/equip`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ equipped }),
    });

    if (!response.ok) {
      throw new Error('Failed to equip item');
    }
  }