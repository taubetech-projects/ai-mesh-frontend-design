"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { setTokens } from "@/features/chat/auth/utils/auth";
import { CHAT_ROUTES } from "@/shared/constants/routingConstants";
import { cookies } from "next/headers";
import {
  ACCESS_COOKIE,
  cookieOptions,
  REFRESH_COOKIE,
} from "@/lib/auth/cookies";
import next from "next";

export default function PlatformOAuthSuccess() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const accessToken = searchParams.get("accessToken");
    const refreshToken = searchParams.get("refreshToken");
    const cookieStore = cookies();

    if (accessToken) {
      cookieStore.set(ACCESS_COOKIE, accessToken, cookieOptions());
      cookieStore.set(REFRESH_COOKIE, refreshToken ?? "", cookieOptions());
      // setTokens(accessToken, refreshToken?.trim() ?? "");
      // Redirect to a protected route, e.g., /home or /dashboard
      router.push(CHAT_ROUTES.CHAT);
    } else {
      // Handle error or redirect to login if no token is present
      router.push(CHAT_ROUTES.SIGNIN);
    }
  }, [router, searchParams]);

  return <div>Logging you in...</div>;
}
