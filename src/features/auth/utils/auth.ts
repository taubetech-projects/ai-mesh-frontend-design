import {
  ACCESS_TOKEN_KEY,
  EMPTY_STRING,
  REFRESH_TOKEN_KEY,
  UNDEFINED,
} from "@/shared/constants/constants";

const defaultApiKey = process.env.NEXT_PUBLIC_DEFAULT_API_KEY || "";

export function getAccessToken(): string {
  if (typeof window === UNDEFINED) {
    return EMPTY_STRING; // No user-specific access token on the server
  }
  return localStorage.getItem(ACCESS_TOKEN_KEY) || "";
}

export function getRefreshToken(): string {
  if (typeof window === UNDEFINED) {
    return EMPTY_STRING;
  }
  return localStorage.getItem(REFRESH_TOKEN_KEY) || "";
}

export function setTokens(accessToken: string, refreshToken: string) {
  if (typeof window !== UNDEFINED) {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken.trim());
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken.trim());
  }
}

export function clearTokens() {
  if (typeof window !== UNDEFINED) {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }
}

export function authHeader(): Record<string, string> {
  const k = getAccessToken();
  return k ? { Authorization: `Bearer ${k}` } : {};
}

export function ensureAuthenticatedClient() {
  const token = getAccessToken();
  if (!token) {
    clearTokens();
    window.location.href = "/login";
    throw new Error("Unauthorized access — no token found.");
  }
}
