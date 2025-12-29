import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  const res = await fetch(
    `${process.env.BACKEND_ORIGIN}/v1/api/chat/auth/signup`,
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    }
  );

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    return NextResponse.json(data ?? { message: "Signup failed" }, {
      status: res.status,
    });
  }

  return NextResponse.json(data);
}
