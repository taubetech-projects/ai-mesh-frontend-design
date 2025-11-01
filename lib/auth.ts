// Minimal API key storage (client-side)
const KEY = "AI_MESH_API_KEY";

export function getApiKey(): string {
  if (typeof window === "undefined")
    return (
      process.env.NEXT_PUBLIC_DEFAULT_API_KEY ||
      "amk_live_dev_1f3b2c9a.$2a$12$d6rQGxp8lQo1TyhdR4Qq7uPb4knRJhLKF47pea4j0ilI/TS1HarHS"
    );
  return localStorage.getItem(KEY) || "";
}

export function setApiKey(v: string) {
  if (typeof window !== "undefined") localStorage.setItem(KEY, v.trim());
}

export function authHeader(): Record<string, string> {
  const k = getApiKey();
  return k ? { Authorization: `Bearer ${k}` } : {};
}
