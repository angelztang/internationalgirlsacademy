const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export interface ScheduleMeetingRequest {
  user_id: string;
  duration_minutes: number;
}

export interface UserMatch {
  user_id: string;
  first_name: string;
  last_name: string;
  user_type: string;
  experience_points?: number;
  gender?: string;
}

export interface ScheduledSlot {
  availability_id: number;
  user_id: string;
  time_start: string;
  time_end: string;
}

export interface ScheduleMeetingResponse {
  matched_user: UserMatch;
  scheduled_slot: ScheduledSlot;
  message: string;
}

// Schedule a meeting by finding available mentors
export async function scheduleMeeting(
  request: ScheduleMeetingRequest
): Promise<ScheduleMeetingResponse> {
  const response = await fetch(`${API_BASE_URL}/meetings/schedule`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || `Failed to schedule meeting: ${response.statusText}`);
  }

  return response.json();
}
