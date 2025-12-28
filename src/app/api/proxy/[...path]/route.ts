import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  ACCESS_COOKIE,
  REFRESH_COOKIE,
  cookieOptions,
} from "@/lib/auth/cookies";

export const runtime = "nodejs"; // ✅ important for streaming
export const dynamic = "force-dynamic"; // ✅ prevent caching/buffering

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

function isSSE(res: Response) {
  return (res.headers.get("content-type") || "").includes("text/event-stream");
}

function buildHeaders(from: Response) {
  const h = new Headers();
  const ct = from.headers.get("content-type");
  if (ct) h.set("content-type", ct);

  // ✅ required-ish for many proxies to not buffer SSE
  if (ct?.includes("text/event-stream")) {
    h.set("cache-control", "no-cache, no-transform");
    h.set("connection", "keep-alive");
  }
  return h;
}

async function forward(req: Request, path: string, accessToken?: string) {
  const url = `${process.env.BACKEND_ORIGIN}/${path}`;

  const headers = new Headers(req.headers);
  headers.delete("host");
  headers.delete("cookie");

  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  const method = req.method.toUpperCase();
  const hasBody = !["GET", "HEAD"].includes(method);

  return fetch(url, {
    method,
    headers,
    body: hasBody ? await req.arrayBuffer() : undefined,
    cache: "no-store",
  });
}

async function handler(req: Request, ctx: { params: { path: string[] } }) {
  const path = ctx.params.path.join("/");
  const cookieStore = cookies();

  const access = cookieStore.get(ACCESS_COOKIE)?.value;
  let backendRes = await forward(req, path, access);

  // If 401: refresh once (only possible if refresh cookie exists)
  if (backendRes.status === 401) {
    const refresh = cookieStore.get(REFRESH_COOKIE)?.value;
    if (refresh) {
      const refreshed = await refreshAccessToken(refresh);
      if (refreshed?.accessToken) {
        backendRes = await forward(req, path, refreshed.accessToken);

        const headers = buildHeaders(backendRes);

        // ✅ stream response directly (no buffering)
        if (isSSE(backendRes) && backendRes.body) {
          const next = new NextResponse(backendRes.body, {
            status: backendRes.status,
            headers,
          });
          next.cookies.set(
            ACCESS_COOKIE,
            refreshed.accessToken,
            cookieOptions()
          );
          if (refreshed.refreshToken) {
            next.cookies.set(
              REFRESH_COOKIE,
              refreshed.refreshToken,
              cookieOptions()
            );
          }
          return next;
        }

        // non-stream: buffer
        const buf = await backendRes.arrayBuffer();
        const next = new NextResponse(buf, {
          status: backendRes.status,
          headers,
        });
        next.cookies.set(ACCESS_COOKIE, refreshed.accessToken, cookieOptions());
        if (refreshed.refreshToken) {
          next.cookies.set(
            REFRESH_COOKIE,
            refreshed.refreshToken,
            cookieOptions()
          );
        }
        return next;
      }
    }
  }

  const headers = buildHeaders(backendRes);

  // ✅ stream response directly (no buffering)
  if (isSSE(backendRes) && backendRes.body) {
    return new NextResponse(backendRes.body, {
      status: backendRes.status,
      headers,
    });
  }

  // non-stream: buffer
  const buf = await backendRes.arrayBuffer();
  return new NextResponse(buf, { status: backendRes.status, headers });
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
