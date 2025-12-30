"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { APP_ROUTES } from "@/shared/constants/routingConstants";
import { usePlatformAuth } from "@/features/platform/auth/PlatformAuthProvider";
import { useMeQuery as usePlatformMeQuery } from "@/features/platform/auth/hooks/useAuthQueries";

export default function PlatformPublicRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { me } = usePlatformAuth();

  const { isLoading } = usePlatformMeQuery({ enabled: true });

  useEffect(() => {
    if (!isLoading && me) {
      router.replace(APP_ROUTES.PLATFORM); // e.g. "/platform"
    }
  }, [me, isLoading, router]);

  if (isLoading) return null;
  if (me) return null;

  return children;
}
