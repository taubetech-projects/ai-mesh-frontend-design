import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { CHAT_ACCESS_COOKIE } from "@/lib/auth/cookies";

export async function GET() {
  const cookieStore = await cookies();
  const access = cookieStore.get(CHAT_ACCESS_COOKIE)?.value;
  if (!access) return NextResponse.json(null, { status: 401 });

  const res = await fetch(
    `${process.env.BACKEND_ORIGIN}/v1/api/chat/users/me`,
    {
      headers: { Authorization: `Bearer ${access}` },
      cache: "no-store",
    }
  );

  if (res.status === 401) return NextResponse.json(null, { status: 401 });
  if (!res.ok) return NextResponse.json(null, { status: 500 });

  return NextResponse.json(await res.json());
}
