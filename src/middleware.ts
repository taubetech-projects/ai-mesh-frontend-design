import { NextRequest, NextResponse } from "next/server";
import { chatMiddleware } from "@/middleware/chat";
import { platformMiddleware } from "@/middleware/platform";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // never touch api or next internals
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  // Delegate by area
  if (pathname.startsWith("/chat")) {
    return chatMiddleware(req);
  }

  if (pathname.startsWith("/platform")) {
    return platformMiddleware(req);
  }

  // everything else (public or other areas)
  return NextResponse.next();
}

export const config = {
  matcher: ["/chat/:path*", "/platform/:path*"],
};
