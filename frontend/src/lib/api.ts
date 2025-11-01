import type { LoginFormData, SignupFormData } from "./validation";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api/v1";

// Helper function to get headers for cookie-based requests
const getHeaders = (): HeadersInit => {
  return {
    "Content-Type": "application/json",
  };
};

// Track ongoing refresh token request to prevent multiple simultaneous refreshes
let refreshTokenPromise: Promise<void> | null = null;

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

// Refresh access token using refresh token
async function refreshAccessToken(): Promise<void> {
  // If a refresh is already in progress, wait for it
  if (refreshTokenPromise) {
    return refreshTokenPromise;
  }

  refreshTokenPromise = (async () => {
    try {
      const response = await fetchWithCredentials(
        `${API_BASE_URL}/auth/refresh`,
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        // Refresh token expired or invalid, user needs to login again
        throw new Error("Refresh token expired");
      }

      // Token refreshed successfully, cookie is automatically set
      await response.json();
    } catch (error) {
      // Clear the refresh promise on error so we can retry
      refreshTokenPromise = null;
      throw error;
    } finally {
      // Clear the refresh promise after a short delay to allow any pending requests to proceed
      setTimeout(() => {
        refreshTokenPromise = null;
      }, 1000);
    }
  })();

  return refreshTokenPromise;
}

export interface AuthResponse {
  message?: string;
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
  // Use authenticatedRequest to get automatic token refresh if needed
  return authenticatedRequest<{ message: string }>("/auth/logout", {
    method: "POST",
  });
}

export async function getCurrentUser(): Promise<{
  user: AuthResponse["user"];
} | null> {
  try {
    let response = await fetchWithCredentials(`${API_BASE_URL}/auth/me`, {
      method: "GET",
    });

    // If 401, try to refresh token and retry
    if (response.status === 401) {
      try {
        await refreshAccessToken();
        // Retry after refresh
        response = await fetchWithCredentials(`${API_BASE_URL}/auth/me`, {
          method: "GET",
        });
      } catch {
        // Refresh failed, user needs to login
        return null;
      }
    }

    if (!response.ok) {
      return null; // User not authenticated
    }

    return response.json();
  } catch {
    return null; // Network error or not authenticated
  }
}

// Generic function for making authenticated API requests with cookies
// Automatically handles token refresh on 401 errors
export async function authenticatedRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  retryCount = 0
): Promise<T> {
  const response = await fetchWithCredentials(
    `${API_BASE_URL}${endpoint}`,
    options
  );

  if (!response.ok) {
    // If unauthorized (401), try to refresh the token
    if (response.status === 401 && retryCount === 0) {
      try {
        // Attempt to refresh the access token
        await refreshAccessToken();

        // Retry the original request once after refresh
        return authenticatedRequest<T>(endpoint, options, retryCount + 1);
      } catch {
        // Refresh failed, user needs to login again
        // Redirect to login page
        window.location.href = "/login";
        throw new Error("Session expired. Please login again.");
      }
    }

    // If still 401 after retry, or other error status
    if (response.status === 401) {
      window.location.href = "/login";
      throw new Error("Unauthorized. Please login again.");
    }

    const error = await response.json();
    throw new Error(error.message || "Request failed");
  }

  return response.json();
}
