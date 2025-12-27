import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  const res = await fetch(
    `${process.env.BACKEND_ORIGIN}/v1/api/chat/auth/reset-password`,
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    }
  );

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    return NextResponse.json(
      { message: text || "Reset password failed" },
      { status: res.status }
    );
  }

  return NextResponse.json({ ok: true });
}
