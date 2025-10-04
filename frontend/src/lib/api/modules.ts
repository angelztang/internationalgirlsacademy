const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ||
  'http://localhost:8000/api/v1';

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
  export async function getUserModules(userId: string): 
  Promise<UserModulesResponse> {
    const response = await fetch(`${API_BASE_URL}/modules/user/${userId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch user modules');
    }
    return response.json();
  }

  // Get a specific module by ID
  export async function getModule(moduleId: number): Promise<Module> {
    const response = await fetch(`${API_BASE_URL}/modules/${moduleId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch module');
    }
    return response.json();
  }

  // Create a new module for a user
  export async function createModule(request: CreateModuleRequest): 
  Promise<Module> {
    const response = await fetch(`${API_BASE_URL}/modules`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to create module');
    }

    return response.json();
  }

  // Update module progress
  export async function updateModuleProgress(
    moduleId: number,
    progress: number
  ): Promise<Module> {
    const response = await fetch(`${API_BASE_URL}/modules/${moduleId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ progress: progress }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to update module progress');
    }

    return response.json();
  }

  // Delete a module
  export async function deleteModule(moduleId: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/modules/${moduleId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete module');
    }
  }