import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  const res = await fetch(
    `${process.env.BACKEND_ORIGIN}/v1/api/platform/auth/forgot-password`,
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
      { message: text || "Forgot password failed" },
      { status: res.status }
    );
  }

  // your backend returns void → respond with ok
  return NextResponse.json({ ok: true });
}
