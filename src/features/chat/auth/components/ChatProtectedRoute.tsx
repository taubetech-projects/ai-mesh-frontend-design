"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useChatAuth } from "@/features/chat/auth/ChatAuthProvider";

export default function ChatProtectedRoute({
  children,
  redirectTo = "/chat/auth/login",
}: {
  children: React.ReactNode;
  redirectTo?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { me, isLoading } = useChatAuth();

  useEffect(() => {
    if (!isLoading && !me) {
      // optional: add next param for return-after-login
      const next = pathname ? `?next=${encodeURIComponent(pathname)}` : "";
      router.replace(`${redirectTo}${next}`);
    }
  }, [me, isLoading, router, redirectTo, pathname]);

  if (isLoading) return null;
  if (!me) return null;

  return <>{children}</>;
}
