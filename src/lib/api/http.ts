import {
  API_PATHS,
  APPLICATION_JSON,
  BACKEND_BASE_URL,
  CACHE_NO_STORE,
  CONTENT_TYPE,
} from "@/types/constants";
import { authHeader } from "@/features/auth/utils/auth";
export const API_BASE = BACKEND_BASE_URL;

export async function apiFetch(path: string, init: RequestInit = {}) {
  const headers = {
    [CONTENT_TYPE]: APPLICATION_JSON,
    ...(init.headers || {}),
    ...authHeader(),
  };
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers,
    cache: init.cache ?? CACHE_NO_STORE,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.headers.get(CONTENT_TYPE)?.includes(APPLICATION_JSON)
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
    headers: { [CONTENT_TYPE]: APPLICATION_JSON, ...authHeader() },
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
