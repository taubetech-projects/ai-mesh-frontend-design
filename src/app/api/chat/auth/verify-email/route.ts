import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (!token) {
    return NextResponse.json({ message: "Missing token" }, { status: 400 });
  }

  const res = await fetch(
    `${
      process.env.BACKEND_ORIGIN
    }/v1/api/chat/auth/verify-email?token=${encodeURIComponent(token)}`,
    { method: "POST", cache: "no-store" }
  );

  const data = await res.text().catch(() => "");

  if (!res.ok) {
    return NextResponse.json(
      { message: data || "Email verification failed" },
      { status: res.status }
    );
  }

  // if backend returns string, keep it
  return NextResponse.json(data || "Email verified successfully");
}
