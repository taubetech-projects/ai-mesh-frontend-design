// Minimal API key storage (client-side)
const ACCESS_TOKEN_KEY = "AI_MESH_ACCESS_TOKEN";
const REFRESH_TOKEN_KEY = "AI_MESH_REFRESH_TOKEN";

const defaultApiKey = process.env.NEXT_PUBLIC_DEFAULT_API_KEY || "";

export function getAccessToken(): string {
  if (typeof window === "undefined") {
    return ""; // No user-specific access token on the server
  }
  return localStorage.getItem(ACCESS_TOKEN_KEY) || "";
}

export function getRefreshToken(): string {
  if (typeof window === "undefined") {
    return "";
  }
  return localStorage.getItem(REFRESH_TOKEN_KEY) || "";
}

export function setTokens(accessToken: string, refreshToken: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken.trim());
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken.trim());
  }
}

export function clearTokens() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }
}

export function authHeader(): Record<string, string> {
  const k = getAccessToken();
  return k ? { Authorization: `Bearer ${k}` } : {};
}
