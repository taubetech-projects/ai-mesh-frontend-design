import { NextRequest, NextResponse } from "next/server";
import { verifyAccessToken } from "@/lib/auth/jwt";
import { ACCESS_COOKIE } from "@/lib/auth/cookies";

const ROLE_ROUTES = [
  { prefix: "/admin", roles: ["ROLE_ADMIN"] },
  { prefix: "/moderator", roles: ["ROLE_ADMIN", "ROLE_MODERATOR"] },
  {
    prefix: "/chat",
    roles: ["ROLE_ADMIN", "ROLE_MODERATOR", "ROLE_FREE_USER", "ROLE_USER"],
  },
];

function hasAnyRole(userRoles: string[] | undefined, allowed: string[]) {
  return !!userRoles?.some((r) => allowed.includes(r));
}

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

  // public routes
  if (
    pathname === "/" ||
    pathname.startsWith("/platform") ||    
    pathname.startsWith("/chat/auth") ||
    pathname.startsWith("/public")
  ) {
    return NextResponse.next();
  }

  const token = req.cookies.get(ACCESS_COOKIE)?.value;
  if (!token) return NextResponse.redirect(new URL("/chat/auth/login", req.url));

  const payload = await verifyAccessToken(token);
  if (!payload) return NextResponse.redirect(new URL("/chat/auth/login", req.url));

  const rule = ROLE_ROUTES.find((r) => pathname.startsWith(r.prefix));
  if (rule && !hasAnyRole(payload.roles, rule.roles)) {
    return NextResponse.redirect(new URL("/403", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
