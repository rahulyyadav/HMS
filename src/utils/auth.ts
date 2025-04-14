import { cookies } from "next/headers";

/**
 * Check if the user is authenticated
 */
export const isAuthenticated = () => {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("access_token");
  return !!accessToken;
};

/**
 * Get the user info from cookies
 */
export const getUserInfo = () => {
  const cookieStore = cookies();
  const userInfoCookie = cookieStore.get("user_info");

  if (!userInfoCookie?.value) {
    return null;
  }

  try {
    return JSON.parse(userInfoCookie.value);
  } catch (error) {
    console.error("Failed to parse user info:", error);
    return null;
  }
};

/**
 * Get the access token from cookies
 */
export const getAccessToken = () => {
  const cookieStore = cookies();
  return cookieStore.get("access_token")?.value;
};

/**
 * Check if the access token is valid and not expired
 */
export const isTokenValid = (token: string) => {
  if (!token) return false;

  try {
    // Decode the JWT token
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );

    const payload = JSON.parse(jsonPayload);

    // Check if the token is expired
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp > currentTime;
  } catch (error) {
    console.error("Failed to validate token:", error);
    return false;
  }
};
