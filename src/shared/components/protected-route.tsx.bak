"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CHAT_ROUTES } from "@/shared/constants/routingConstants";
import { useAuth } from "@/shared/contexts/AuthContext";
import { useMeQuery } from "@/features/chat/auth/hooks/useAuthQueries";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { me } = useAuth();

  // ensures we know whether /me is still loading
  const { isLoading, isError } = useMeQuery({ enabled: true });

  useEffect(() => {
    // once /me finishes and no user => redirect to signin
    if (!isLoading && (!me || isError)) {
      router.replace(CHAT_ROUTES.SIGNIN);
    }
  }, [me, isLoading, isError, router]);

  // while checking auth, render nothing (or a spinner)
  if (isLoading) return null;

  // if not authenticated, redirect will happen
  if (!me) return null;

  return <>{children}</>;
}
