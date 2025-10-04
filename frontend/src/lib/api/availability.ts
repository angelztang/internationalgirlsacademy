const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

export interface AvailabilitySlot {
  availability_id: number;
  user_id: string;
  time_start: string;
  time_end: string;
  created_at: string;
}

export interface CreateAvailabilityRequest {
  time_start: string;
  time_end: string;
}

export interface UpdateAvailabilityRequest {
  time_start: string;
  time_end: string;
}

// Get all availability slots for a user
export async function getUserAvailability(userId: string): Promise<AvailabilitySlot[]> {
  const response = await fetch(`${API_BASE_URL}/availability/${userId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch user availability: ${response.statusText}`);
  }

  return response.json();
}

// Create a new availability slot for a user
export async function createAvailability(
  userId: string, 
  request: CreateAvailabilityRequest
): Promise<AvailabilitySlot> {
  const response = await fetch(`${API_BASE_URL}/availability/${userId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || `Failed to create availability: ${response.statusText}`);
  }

  return response.json();
}

// Update an existing availability slot
export async function updateAvailability(
  availabilityId: number,
  request: UpdateAvailabilityRequest
): Promise<AvailabilitySlot> {
  const response = await fetch(`${API_BASE_URL}/availability/${availabilityId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || `Failed to update availability: ${response.statusText}`);
  }

  return response.json();
}

// Delete an availability slot
export async function deleteAvailability(availabilityId: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/availability/${availabilityId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || `Failed to delete availability: ${response.statusText}`);
  }
}
