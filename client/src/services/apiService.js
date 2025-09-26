// API base configuration

import { API_BASE_URL } from "../constants";

// Default headers for API requests
const defaultHeaders = {
  "Content-Type": "application/json",
};

// Import cookie utilities
import { getAuthToken as getCookieAuthToken } from "../utils/cookieUtils";

// Get auth token from cookie
const getAuthToken = () => {
  return getCookieAuthToken();
};

// Create authorized headers
const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    ...defaultHeaders,
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// Generic API request function
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;

  const config = {
    headers: getAuthHeaders(),
    ...options,
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    // Handle empty responses
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await response.json();
    }

    return await response.text();
  } catch (error) {
    console.error("API request failed:", error);
    throw error;
  }
};

// API methods
export const apiService = {
  // GET request
  get: (endpoint, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    return apiRequest(url);
  },

  // POST request
  post: (endpoint, data) => {
    return apiRequest(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // PUT request
  put: (endpoint, data) => {
    return apiRequest(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  // PATCH request
  patch: (endpoint, data) => {
    return apiRequest(endpoint, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  // DELETE request
  delete: (endpoint) => {
    return apiRequest(endpoint, {
      method: "DELETE",
    });
  },

  // Upload file
  upload: (endpoint, formData) => {
    const token = getAuthToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    return apiRequest(endpoint, {
      method: "POST",
      body: formData,
      headers, // Don't set Content-Type for FormData
    });
  },
};

// Specific API endpoints
export const authAPI = {
  login: (credentials) => apiService.post("/api/login", credentials),
  register: (userData) => apiService.post("/auth/register", userData),
  logout: () => apiService.post("/auth/logout"),
  refreshToken: () => apiService.post("/auth/refresh"),
  forgotPassword: (email) =>
    apiService.post("/auth/forgot-password", { email }),
  resetPassword: (data) => apiService.post("/auth/reset-password", data),
};

export const userAPI = {
  getProfile: () => apiService.get("/user/profile"),
  updateProfile: (data) => apiService.patch("/user/profile", data),
  changePassword: (data) => apiService.post("/user/change-password", data),
  uploadAvatar: (formData) => apiService.upload("/user/avatar", formData),
};

export default apiService;
