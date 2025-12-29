import { NextRequest, NextResponse } from "next/server";
import { verifyAccessToken } from "@/lib/auth/jwt";

const CHAT_ACCESS_COOKIE = "chat_access_token"; // use your real constant

const CHAT_ROLE_ROUTES = [
  { prefix: "/chat/admin", roles: ["ROLE_ADMIN"] },
  { prefix: "/chat/moderator", roles: ["ROLE_ADMIN", "ROLE_MODERATOR"] },
  {
    prefix: "/chat",
    roles: ["ROLE_ADMIN", "ROLE_MODERATOR", "ROLE_FREE_USER", "ROLE_USER"],
  },
];

function hasAnyRole(userRoles: string[] | undefined, allowed: string[]) {
  return !!userRoles?.some((r) => allowed.includes(r));
}

export async function chatMiddleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // public chat routes
  if (
    pathname === "/chat" ||
    pathname.startsWith("/chat/auth") ||
    pathname.startsWith("/chat/public")
  ) {
    return NextResponse.next();
  }

  const token = req.cookies.get(CHAT_ACCESS_COOKIE)?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/chat/auth/login", req.url));
  }

  const payload = await verifyAccessToken(token);
  if (!payload) {
    return NextResponse.redirect(new URL("/chat/auth/login", req.url));
  }

  const rule = CHAT_ROLE_ROUTES.find((r) => pathname.startsWith(r.prefix));
  if (rule && !hasAnyRole(payload.roles, rule.roles)) {
    return NextResponse.redirect(new URL("/403", req.url));
  }

  return NextResponse.next();
}
