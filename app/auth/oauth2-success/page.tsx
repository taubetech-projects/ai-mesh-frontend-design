"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { setTokens } from "@/lib/auth";

export default function OAuthSuccess() {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const accessToken = searchParams.get("accessToken");
        const refreshToken = searchParams.get("refreshToken");

        if (accessToken) {
            setTokens(accessToken, refreshToken);
            // Redirect to a protected route, e.g., /home or /dashboard
            router.push("/home");
        } else {
            // Handle error or redirect to login if no token is present
            router.push("/auth/login");
        }
    }, [router, searchParams]);

    return <div>Logging you in...</div>;
}
