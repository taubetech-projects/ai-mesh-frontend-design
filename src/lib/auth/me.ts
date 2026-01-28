import { cookies } from "next/headers";
import { CHAT_ACCESS_COOKIE, PLATFORM_ACCESS_COOKIE } from "@/lib/auth/cookies";

type Scope = "chat" | "platform";

async function fetchMeInternal(scope: Scope) {
  const cookieStore = cookies();

  const access =
    scope === "chat"
      ? cookieStore.get(CHAT_ACCESS_COOKIE)?.value
      : cookieStore.get(PLATFORM_ACCESS_COOKIE)?.value;

  if (!access) return null;

  const url =
    scope === "chat"
      ? `${process.env.BACKEND_ORIGIN}/v1/api/chat/users/me`
      : `${process.env.BACKEND_ORIGIN}/v1/api/platform/users/me`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${access}` },
    cache: "no-store",
  });

  if (!res.ok) return null;

  const text = await res.text();
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

/* =========================
   Public API
   ========================= */

export function fetchChatMe() {
  return fetchMeInternal("chat");
}

export function fetchPlatformMe() {
  return fetchMeInternal("platform");
}
