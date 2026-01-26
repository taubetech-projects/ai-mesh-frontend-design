"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CHAT_ROUTES } from "@/shared/constants/routingConstants";
import { Loader2 } from "lucide-react";

export default function ChatOAuthSuccess() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const accessToken = searchParams.get("accessToken");
    const refreshToken = searchParams.get("refreshToken");

    if (accessToken) {
      // Call the API route to set cookies securely
      fetch("/api/chat/auth/oauth2-success", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessToken, refreshToken: refreshToken ?? "" }),
      })
        .then(() => {
          router.replace(CHAT_ROUTES.CHAT);
        })
        .catch(() => {
          router.replace(CHAT_ROUTES.SIGNIN);
        });
    } else {
      // Handle error or redirect to login if no token is present
      router.replace(CHAT_ROUTES.SIGNIN);
    }
  }, [router, searchParams]);

  return <Loader2 className="animate-spin" size={20} />;;
}
