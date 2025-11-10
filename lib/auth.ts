// Minimal API key storage (client-side)
const KEY = "AI_MESH_API_KEY";

const defaultApiKey = process.env.NEXT_PUBLIC_DEFAULT_API_KEY || "";

export function getApiKey(): string {
  // On the server, always use the default key.
  if (typeof window === "undefined") {
    return defaultApiKey;
  }
  // On the client, use the key from local storage, or fall back to the default.
  return localStorage.getItem(KEY) || defaultApiKey;
}

export function setApiKey(v: string) {
  if (typeof window !== "undefined") localStorage.setItem(KEY, v.trim());
}

export function authHeader(): Record<string, string> {
  const k = getApiKey();
  return k ? { Authorization: `Bearer ${k}` } : {};
}
