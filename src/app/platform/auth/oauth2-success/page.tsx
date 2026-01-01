"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CHAT_ROUTES } from "@/shared/constants/routingConstants";
// import { cookies } from "next/headers";
import {
  PLATFORM_ACCESS_COOKIE,
  PLATFORM_REFRESH_COOKIE,
  platformCookieOptions,
} from "@/lib/auth/cookies";

export default function PlatformOAuthSuccess() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    /*
    const accessToken = searchParams.get("accessToken");
    const refreshToken = searchParams.get("refreshToken");
    const cookieStore = cookies();

    if (accessToken) {
      cookieStore.set(
        PLATFORM_ACCESS_COOKIE,
        accessToken,
        platformCookieOptions()
      );
      cookieStore.set(
        PLATFORM_REFRESH_COOKIE,
        refreshToken ?? "",
        platformCookieOptions()
      );
      // setTokens(accessToken, refreshToken?.trim() ?? "");
      // Redirect to a protected route, e.g., /home or /dashboard
      router.push(CHAT_ROUTES.CHAT);
    } else {
      // Handle error or redirect to login if no token is present
      router.push(CHAT_ROUTES.SIGNIN);
    }
    */
  }, [router, searchParams]);

  return <div>Logging you in...</div>;
}
