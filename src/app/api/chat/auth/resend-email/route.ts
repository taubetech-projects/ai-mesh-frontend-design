import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email");
  if (!email) {
    return NextResponse.json({ message: "Missing email" }, { status: 400 });
  }

  const res = await fetch(
    `${
      process.env.BACKEND_ORIGIN
    }/v1/api/auth/resend-email?email=${encodeURIComponent(email)}`,
    { method: "POST", cache: "no-store" }
  );

  const data = await res.text().catch(() => "");

  if (!res.ok) {
    return NextResponse.json(
      { message: data || "Resend email failed" },
      { status: res.status }
    );
  }

  // if backend returns string, keep it
  return NextResponse.json(data || "OK");
}
