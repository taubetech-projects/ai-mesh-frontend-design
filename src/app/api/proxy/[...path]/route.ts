import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  ACCESS_COOKIE,
  REFRESH_COOKIE,
  cookieOptions,
} from "@/lib/auth/cookies";

async function refreshAccessToken(refreshToken: string) {
  const res = await fetch(
    `${process.env.BACKEND_ORIGIN}/v1/api/chat/auth/refresh`,
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ refreshToken }),
      cache: "no-store",
    }
  );
  if (!res.ok) return null;
  return (await res.json()) as { accessToken: string; refreshToken?: string };
}

async function forward(req: Request, path: string, accessToken?: string) {
  const url = `${process.env.BACKEND_ORIGIN}/${path}`;
  const headers = new Headers(req.headers);
  headers.delete("host");
  headers.delete("cookie");

  if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`);

  const method = req.method.toUpperCase();
  const hasBody = !["GET", "HEAD"].includes(method);

  return fetch(url, {
    method,
    headers,
    body: hasBody ? await req.arrayBuffer() : undefined,
    cache: "no-store",
  });
}

export async function GET(req: Request, ctx: any) {
  return handler(req, ctx);
}
export async function POST(req: Request, ctx: any) {
  return handler(req, ctx);
}
export async function PUT(req: Request, ctx: any) {
  return handler(req, ctx);
}
export async function PATCH(req: Request, ctx: any) {
  return handler(req, ctx);
}
export async function DELETE(req: Request, ctx: any) {
  return handler(req, ctx);
}

async function handler(req: Request, ctx: { params: { path: string[] } }) {
  const path = ctx.params.path.join("/");

  const cookieStore = await cookies();
  const access = cookieStore.get(ACCESS_COOKIE)?.value;

  // try once
  let backendRes = await forward(req, path, access);

  // refresh once on 401 and retry
  if (backendRes.status === 401) {
    const refresh = cookieStore.get(REFRESH_COOKIE)?.value;
    if (refresh) {
      const refreshed = await refreshAccessToken(refresh);
      if (refreshed?.accessToken) {
        backendRes = await forward(req, path, refreshed.accessToken);

        const buf = await backendRes.arrayBuffer();
        const next = new NextResponse(buf, { status: backendRes.status });

        const ct = backendRes.headers.get("content-type");
        if (ct) next.headers.set("content-type", ct);

        next.cookies.set(ACCESS_COOKIE, refreshed.accessToken, cookieOptions());
        if (refreshed.refreshToken)
          next.cookies.set(
            REFRESH_COOKIE,
            refreshed.refreshToken,
            cookieOptions()
          );

        return next;
      }
    }
  }

  const data = await backendRes.arrayBuffer();
  const next = new NextResponse(data, { status: backendRes.status });

  const ct = backendRes.headers.get("content-type");
  if (ct) next.headers.set("content-type", ct);

  return next;
}
