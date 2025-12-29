import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  ACCESS_COOKIE,
  REFRESH_COOKIE,
  cookieOptions,
} from "@/lib/auth/cookies";

export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get(REFRESH_COOKIE)?.value;

  if (refreshToken) {
    try {
      await fetch(`${process.env.BACKEND_ORIGIN}/v1/api/chat/auth/logout`, {
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
  res.cookies.set(ACCESS_COOKIE, "", { ...cookieOptions(), maxAge: 0 });
  res.cookies.set(REFRESH_COOKIE, "", { ...cookieOptions(), maxAge: 0 });
  return res;
}
