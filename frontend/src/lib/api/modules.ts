import { apiClient } from './client';

export interface Module {
  module_id: number;
  user_id: string; // UUID
  progress: number;
}

export interface CreateModuleRequest {
  user_id: string; // UUID
  progress: number;
}

export interface UpdateModuleProgressRequest {
  progress: number;
}

export interface UserModulesResponse {
  user_id: string; // UUID
  modules: Module[];
}

// Get all modules for a specific user
export async function getUserModules(userId: string): Promise<UserModulesResponse> {
  return apiClient.get<UserModulesResponse>(`/modules/user/${userId}`);
}

// Get a specific module by ID
export async function getModule(moduleId: number): Promise<Module> {
  return apiClient.get<Module>(`/modules/${moduleId}`);
}

// Create a new module for a user
export async function createModule(request: CreateModuleRequest): Promise<Module> {
  return apiClient.post<Module>('/modules', request);
}

// Update module progress
export async function updateModuleProgress(
  moduleId: number,
  progress: number
): Promise<Module> {
  return apiClient.put<Module>(`/modules/${moduleId}`, { progress });
}

// Delete a module
export async function deleteModule(moduleId: number, userId: string): Promise<void> {
  return apiClient.delete<void>(`/modules/${moduleId}/${userId}`);
}