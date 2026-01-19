import { NextResponse } from "next/server";
import {
  CHAT_ACCESS_COOKIE,
  CHAT_REFRESH_COOKIE,
  chatCookieOptions,
} from "@/lib/auth/cookies";

export async function POST(req: Request) {
  const body = await req.json();
  const { accessToken, refreshToken } = body;

  const next = NextResponse.json({ success: true });

  if (accessToken) {
    next.cookies.set(CHAT_ACCESS_COOKIE, accessToken, chatCookieOptions());
  }

  if (refreshToken) {
    next.cookies.set(CHAT_REFRESH_COOKIE, refreshToken, chatCookieOptions());
  }

  return next;
}
