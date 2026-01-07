import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  PLATFORM_ACCESS_COOKIE,
  PLATFORM_REFRESH_COOKIE,
  platformCookieOptions,
} from "@/lib/auth/cookies";

export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get(PLATFORM_REFRESH_COOKIE)?.value;

  if (refreshToken) {
    try {
      await fetch(`${process.env.BACKEND_ORIGIN}/v1/api/platform/auth/logout`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ refreshToken }),
        cache: "no-store",
      });
    } catch {
      // ignore
    }
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(PLATFORM_ACCESS_COOKIE, "", {
    ...platformCookieOptions(),
    maxAge: 0,
  });
  res.cookies.set(PLATFORM_REFRESH_COOKIE, "", {
    ...platformCookieOptions(),
    maxAge: 0,
  });
  return res;
}
