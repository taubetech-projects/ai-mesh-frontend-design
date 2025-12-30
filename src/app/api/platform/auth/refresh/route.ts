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
  if (!refreshToken) return NextResponse.json({ ok: false }, { status: 401 });

  const res = await fetch(
    `${process.env.BACKEND_ORIGIN}/v1/api/platform/auth/refresh`,
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ refreshToken }),
      cache: "no-store",
    }
  );

  if (!res.ok) return NextResponse.json({ ok: false }, { status: 401 });

  const data = await res.json(); // { accessToken, refreshToken? }

  const next = NextResponse.json({ ok: true });
  next.cookies.set(
    PLATFORM_ACCESS_COOKIE,
    data.accessToken,
    platformCookieOptions()
  );
  if (data.refreshToken)
    next.cookies.set(
      PLATFORM_REFRESH_COOKIE,
      data.refreshToken,
      platformCookieOptions()
    );
  return next;
}
