"use client";

/**
 * Redirect to login
 */
export const loginRedirect = () => {
  window.location.href = "/api/auth/login";
};

/**
 * Logout the user
 */
export const logout = () => {
  window.location.href = "/api/auth/logout";
};

/**
 * Check if running on client-side
 */
export const isClient = () => {
  return typeof window !== "undefined";
};

/**
 * Parse JWT token on client side
 */
export const parseJwt = (token: string) => {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (e) {
    return null;
  }
};
