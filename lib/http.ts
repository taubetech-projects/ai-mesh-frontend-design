import { authHeader } from "./auth";
export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8080";

export async function apiFetch(path: string, init: RequestInit = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(init.headers || {}),
    ...authHeader(),
  };
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers,
    cache: init.cache ?? "no-store",
  });
  if (!res.ok) throw new Error(await res.text());
  return res.headers.get("content-type")?.includes("application/json")
    ? res.json()
    : res.text();
}

export async function apiSSE(
  path: string,
  body: any,
  onChunk: (txt: string) => void
) {
  console.log("SSE request", path, body);
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeader() },
    body: JSON.stringify(body),
  });
  const reader = res.body?.getReader();
  const decoder = new TextDecoder();
  while (reader) {
    const { value, done } = await reader.read();
    if (done) break;
    onChunk(decoder.decode(value));
  }
}
