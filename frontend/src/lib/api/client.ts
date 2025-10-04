// Centralized API client with authentication

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

// Get auth token from localStorage
function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;

  const userStr = localStorage.getItem("user");
  if (!userStr) return null;

  try {
    const user = JSON.parse(userStr);
    return user.accessToken || null;
  } catch {
    return null;
  }
}

// Create authenticated headers
function getAuthHeaders(): HeadersInit {
  const token = getAuthToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
}

// Authenticated fetch wrapper
export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const config: RequestInit = {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    console.log("API Response:", response);

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ detail: "Request failed" }));

      // Handle 401 - redirect to login
      if (response.status === 401) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("user");
          window.location.href = "/login";
        }
      }

      throw new Error(
        errorData.detail || `HTTP error! status: ${response.status}`
      );
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return null as T;
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("An unexpected error occurred");
  }
}

// Convenience methods
export const apiClient = {
  get: <T>(endpoint: string) => apiFetch<T>(endpoint, { method: "GET" }),

  post: <T>(endpoint: string, data?: any) =>
    apiFetch<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    }),

  put: <T>(endpoint: string, data?: any) =>
    apiFetch<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    }),

  delete: <T>(endpoint: string) => apiFetch<T>(endpoint, { method: "DELETE" }),
};
