"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PLATFORM_ROUTES } from "@/shared/constants/routingConstants";
import { useMyTeams } from "@/features/platform/team/team.queries";
import { Loader2 } from "lucide-react";

export default function PlatformOAuthSuccess() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    data: teams,
    refetch: refetchTeams,
    isFetching: isFetchingTeams,
  } = useMyTeams({
    enabled: false,
  });

  useEffect(() => {
    const run = async () => {
      const accessToken = searchParams.get("accessToken");
      const refreshToken = searchParams.get("refreshToken");

      if (!accessToken) {
        router.replace(PLATFORM_ROUTES.SIGNIN);
        return;
      }

      try {
        await fetch("/api/platform/auth/oauth2-success", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            accessToken,
            refreshToken: refreshToken ?? "",
          }),
        });

        const result = await refetchTeams();
        const teams = result.data;

        if (!teams || teams.length === 0) {
          router.replace(PLATFORM_ROUTES.ONBOARDING);
        } else {
          router.replace(PLATFORM_ROUTES.DASHBOARD);
        }
      } catch (error) {
        router.replace(PLATFORM_ROUTES.SIGNIN);
      }
    };

    run();
  }, [router, searchParams, refetchTeams]);

  return <Loader2 className="animate-spin" size={20} />;
}
