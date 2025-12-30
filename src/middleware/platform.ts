import { NextRequest, NextResponse } from "next/server";
import { verifyAccessToken } from "@/lib/auth/jwt";

const PLATFORM_ACCESS_COOKIE = "platform_access_token"; // use your real constant

const PLATFORM_ROLE_ROUTES = [
  { prefix: "/platform/admin", roles: ["ROLE_ADMIN"] },
  { prefix: "/platform/moderator", roles: ["ROLE_ADMIN", "ROLE_MODERATOR"] },
  {
    prefix: "/platform",
    roles: ["ROLE_ADMIN", "ROLE_MODERATOR", "ROLE_FREE_USER", "ROLE_USER"],
  },
];

function hasAnyRole(userRoles: string[] | undefined, allowed: string[]) {
  return !!userRoles?.some((r) => allowed.includes(r));
}

export async function platformMiddleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // public platform routes
  if (
    pathname === "/platform" ||
    pathname.startsWith("/platform/auth") ||
    pathname.startsWith("/platform/public")
  ) {
    return NextResponse.next();
  }

  const token = req.cookies.get(PLATFORM_ACCESS_COOKIE)?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/platform/auth/login", req.url));
  }

  const payload = await verifyAccessToken(token);
  if (!payload) {
    return NextResponse.redirect(new URL("/platform/auth/login", req.url));
  }

  const rule = PLATFORM_ROLE_ROUTES.find((r) => pathname.startsWith(r.prefix));
  if (rule && !hasAnyRole(payload.roles, rule.roles)) {
    return NextResponse.redirect(new URL("/403", req.url));
  }

  return NextResponse.next();
}
