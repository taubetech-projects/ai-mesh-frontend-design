"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useChatAuth } from "@/features/chat/auth/ChatAuthProvider";
import { CHAT_ROUTES } from "@/shared/constants/routingConstants";

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
      router.replace(CHAT_ROUTES.CHAT); // e.g. "/chat"
    }
  }, [me, isLoading, router]);

  if (isLoading) return null;
  if (me) return null;

  return children;
}
