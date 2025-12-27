import { APP_ROUTES } from "@/shared/constants/routingConstants";
import type { UserGrantsView } from "../types/authModels";

/**
 * ❌ Tokens are HttpOnly cookies.
 * Frontend CANNOT read or write them.
 * These functions exist only for compatibility / clarity.
 */

export function getAccessToken(): null {
  return null;
}

export function getRefreshToken(): null {
  return null;
}

export function setTokens(): void {
  // ❌ NO-OP
  // Tokens are set by /api/auth/login via cookies
}

export function clearTokens(): void {
  // ❌ NO-OP
  // Tokens are cleared by /api/auth/logout
}

export function setUserDetails(): void {
  // ❌ NO-OP
  // User comes from /api/auth/me
}

export function getUserDetails(): UserGrantsView | null {
  // ❌ NO-OP
  return null;
}

export function clearUserDetails(): void {
  // ❌ NO-OP
}

/**
 * ❌ Authorization header must NOT be built on frontend.
 * Proxy + cookies handle auth.
 */
export function authHeader(): Record<string, string> {
  return {};
}

/**
 * ❌ Frontend must NOT enforce auth using tokens.
 * Middleware + /me do that.
 */
export function ensureAuthenticatedClient(): never {
  window.location.href = APP_ROUTES.SIGNIN;
  throw new Error("Unauthorized");
}
