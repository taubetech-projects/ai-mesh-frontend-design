"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CHAT_ROUTES } from "@/shared/constants/routingConstants";
import { useAuth } from "@/shared/contexts/AuthContext";
import { useMeQuery } from "@/features/chat/auth/hooks/useAuthQueries";

export default function PublicRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { me } = useAuth();

  // This tells us if /me is still loading (without changing AuthContext)
  const { isLoading } = useMeQuery({ enabled: true });

  useEffect(() => {
    if (!isLoading && me) {
      router.replace(CHAT_ROUTES.CHAT);
    }
  }, [me, isLoading, router]);

  // While /me is loading, don’t show login/signup to avoid flicker
  if (isLoading) return null;

  // If authenticated, redirect happens
  if (me) return null;

  return children;
}
