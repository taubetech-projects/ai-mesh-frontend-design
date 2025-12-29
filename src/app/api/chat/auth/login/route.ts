import { NextResponse } from "next/server";
import {
  CHAT_ACCESS_COOKIE,
  CHAT_REFRESH_COOKIE,
  chatCookieOptions,
} from "@/lib/auth/cookies";

export async function POST(req: Request) {
  const body = await req.json();
  console.log(body);

  const res = await fetch(
    `${process.env.BACKEND_ORIGIN}/v1/api/chat/auth/login`,
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    }
  );

  if (!res.ok)
    return NextResponse.json(
      { message: "Invalid credentials" },
      { status: 401 }
    );

  const data = await res.json(); // { accessToken, refreshToken, tokenType, user }

  const next = NextResponse.json(data);
  next.cookies.set(CHAT_ACCESS_COOKIE, data.accessToken, chatCookieOptions());
  next.cookies.set(CHAT_REFRESH_COOKIE, data.refreshToken, chatCookieOptions());
  return next;
}
