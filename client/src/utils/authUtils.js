/**
 * Authentication utility functions for the application
 */

/**
 * Logs out the current user by removing stored credentials from localStorage
 * and redirects to the login page
 */
export const handleLogout = () => {
  // Clear user data from localStorage
  localStorage.removeItem("user");

  // Clear any other auth-related data
  localStorage.removeItem("token");
  localStorage.removeItem("userRole");

  // Force page reload to reset application state
  window.location.href = "/login";
};

/**
 * Checks if the user is authenticated
 * @returns {boolean} True if the user is authenticated
 */
export const isAuthenticated = () => {
  const user = localStorage.getItem("user");
  return user !== null;
};

/**
 * Gets the current user information
 * @returns {Object|null} User object or null if not authenticated
 */
export const getCurrentUser = () => {
  const userStr = localStorage.getItem("user");
  if (!userStr) return null;

  try {
    return JSON.parse(userStr);
  } catch (error) {
    console.error("Failed to parse user data", error);
    return null;
  }
};
