// API utility file to integrate Shop with backend API
import { apiClient } from './client';

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
  return apiClient.get<Item[]>('/items');
}

// Get user's inventory
export async function getUserInventory(userId: string): Promise<UserItem[]> {
  const data = await apiClient.get<{ items: UserItem[] }>(`/users/${userId}/items`);
  return data.items;
}

// Purchase an item
export async function purchaseItem(userId: string, request: PurchaseRequest): Promise<PurchaseResponse> {
  return apiClient.post<PurchaseResponse>(`/users/${userId}/items/purchase`, request);
}

// Equip/unequip an item
export async function equipItem(userId: string, itemId: number, equipped: boolean): Promise<void> {
  await apiClient.put<void>(`/users/${userId}/items/${itemId}/equip`, { equipped });
}