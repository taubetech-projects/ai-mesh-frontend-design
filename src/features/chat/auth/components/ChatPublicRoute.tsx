"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { APP_ROUTES } from "@/shared/constants/routingConstants";
import { useChatAuth } from "@/features/chat/auth/ChatAuthProvider";
import { useMeQuery as useChatMeQuery } from "@/features/chat/auth/hooks/useAuthQueries";

export default function ChatPublicRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { me, isLoading } = useChatAuth();

  // Only relevant on chat auth pages; still safe

  useEffect(() => {
    if (!isLoading && me) {
      router.replace(APP_ROUTES.CHAT); // e.g. "/chat"
    }
  }, [me, isLoading, router]);

  if (isLoading) return null;
  if (me) return null;

  return children;
}
