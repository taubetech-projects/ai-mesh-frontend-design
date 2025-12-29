"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { setTokens } from "@/features/chat/auth/utils/auth";
import { APP_ROUTES } from "@/shared/constants/routingConstants";

export default function OAuthSuccess() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const accessToken = searchParams.get("accessToken");
    const refreshToken = searchParams.get("refreshToken");

    if (accessToken) {
      setTokens(accessToken, refreshToken?.trim() ?? "");
      // Redirect to a protected route, e.g., /home or /dashboard
      router.push(APP_ROUTES.CHAT);
    } else {
      // Handle error or redirect to login if no token is present
      router.push(APP_ROUTES.SIGNIN);
    }
  }, [router, searchParams]);

  return <div>Logging you in...</div>;
}
