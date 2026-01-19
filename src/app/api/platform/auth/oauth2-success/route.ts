import { NextResponse } from "next/server";
import {
  PLATFORM_ACCESS_COOKIE,
  PLATFORM_REFRESH_COOKIE,
  platformCookieOptions,
} from "@/lib/auth/cookies";

export async function POST(req: Request) {
  const body = await req.json();
  const { accessToken, refreshToken } = body;

  const next = NextResponse.json({ success: true });

  if (accessToken) {
    next.cookies.set(
      PLATFORM_ACCESS_COOKIE,
      accessToken,
      platformCookieOptions()
    );
  }

  if (refreshToken) {
    next.cookies.set(
      PLATFORM_REFRESH_COOKIE,
      refreshToken,
      platformCookieOptions()
    );
  }

  return next;
}
