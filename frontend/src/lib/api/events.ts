import { apiClient } from './client';

export interface Event {
  event_id: number;
  name?: string;
  start_time: string;
  end_time: string;
}

export interface EventRegistration {
  registration_id: number;
  user_id: string;
  event_id: number;
  event?: Event;
}

export interface UserEventsResponse {
  user_id: string;
  events: EventRegistration[];
}

// Get all events
export async function getAllEvents(): Promise<Event[]> {
  return apiClient.get<Event[]>('/events');
}

// Get specific event
export async function getEvent(eventId: number): Promise<Event> {
  return apiClient.get<Event>(`/events/${eventId}`);
}

// Get user's registered events
export async function getUserEvents(userId: string): Promise<UserEventsResponse> {
  return apiClient.get<UserEventsResponse>(`/users/${userId}/events`);
}

// Register for an event
export async function registerForEvent(eventId: number, userId: string): Promise<EventRegistration> {
  return apiClient.post<EventRegistration>(`/users/events/${eventId}/register`, {
    user_id: userId
  });
}

// Unregister from an event
export async function unregisterFromEvent(eventId: number, userId: string): Promise<void> {
  await apiClient.delete<void>(`/users/events/${eventId}/register/${userId}`);
}

// Get event registrations (admin/organizer)
export async function getEventRegistrations(eventId: number): Promise<EventRegistration[]> {
  return apiClient.get<EventRegistration[]>(`/users/events/${eventId}/registrations`);
}
