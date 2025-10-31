import type { LoginFormData, SignupFormData } from "./validation";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api/v1";

// Helper function to get headers for cookie-based requests
const getHeaders = (): HeadersInit => {
  return {
    "Content-Type": "application/json",
  };
};

// Helper function for cookie-based requests
const fetchWithCredentials = async (url: string, options: RequestInit = {}) => {
  return fetch(url, {
    ...options,
    credentials: "include", // Include cookies in requests
    headers: {
      ...getHeaders(),
      ...options.headers,
    },
  });
};

export interface AuthResponse {
  user: {
    _id: string;
    name: string;
    email: string;
  };
}

export interface LoginResponse {
  message: string;
}

export async function signupUser(
  data: Omit<SignupFormData, "confirmPassword">
): Promise<AuthResponse> {
  const response = await fetchWithCredentials(`${API_BASE_URL}/auth/signup`, {
    method: "POST",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Signup failed");
  }

  return response.json();
}

export async function loginUser(data: LoginFormData): Promise<LoginResponse> {
  const response = await fetchWithCredentials(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Login failed");
  }

  return response.json();
}

export async function logoutUser(): Promise<{ message: string }> {
  const response = await fetchWithCredentials(`${API_BASE_URL}/auth/logout`, {
    method: "POST",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Logout failed");
  }

  return response.json();
}

export async function getCurrentUser(): Promise<{
  user: AuthResponse["user"];
} | null> {
  try {
    const response = await fetchWithCredentials(`${API_BASE_URL}/auth/me`, {
      method: "POST",
    });

    if (!response.ok) {
      return null; // User not authenticated
    }

    return response.json();
  } catch {
    return null; // Network error or not authenticated
  }
}

// Generic function for making authenticated API requests with cookies
export async function authenticatedRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetchWithCredentials(
    `${API_BASE_URL}${endpoint}`,
    options
  );

  if (!response.ok) {
    // If unauthorized, redirect to login
    if (response.status === 401) {
      window.location.href = "/login";
    }

    const error = await response.json();
    throw new Error(error.message || "Request failed");
  }

  return response.json();
}
