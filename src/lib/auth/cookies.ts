const isProd = process.env.NODE_ENV === "production";

/* =========================
   Chat cookies
   ========================= */
export const CHAT_ACCESS_COOKIE = "chat_access_token";
export const CHAT_REFRESH_COOKIE = "chat_refresh_token";

export const chatCookieOptions = () => ({
  httpOnly: true,
  secure: isProd, // false on localhost (http)
  sameSite: "lax" as const,
  path: "/", // "/chat", // 👈 scoped to chat
});

/* =========================
   Platform cookies
   ========================= */
export const PLATFORM_ACCESS_COOKIE = "platform_access_token";
export const PLATFORM_REFRESH_COOKIE = "platform_refresh_token";

export const platformCookieOptions = () => ({
  httpOnly: true,
  secure: isProd,
  sameSite: "lax" as const,
  path: "/", // "/platform", // 👈 scoped to platform
});
