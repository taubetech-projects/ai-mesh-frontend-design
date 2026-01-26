"use client";

import React, { createContext, useContext, useMemo } from "react";
import type { Me } from "@/features/chat/auth/types/authModels";
import { useMeQuery } from "@/features/chat/auth/hooks/useAuthQueries";
import { usePathname } from "next/navigation";

type AuthValue = {
  me: Me | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  hasRole: (role: string) => boolean;
  hasAuthority: (authority: string) => boolean;
  hasAnyAuthority: (authorities: string[]) => boolean;
};

const ChatAuthContext = createContext<AuthValue | undefined>(undefined);

export function ChatAuthProvider({
  initialMe,
  children,
  enabled = true,
}: {
  initialMe: Me | null;
  children: React.ReactNode;
  enabled?: boolean;
}) {
  const pathname = usePathname();
  const isAuthRoute = pathname?.startsWith("/chat/auth");
  const shouldFetch = enabled && !isAuthRoute;

  const { data } = useMeQuery({ enabled: shouldFetch });
  const me = (shouldFetch ? data : null) ?? initialMe ?? null;

  const value = useMemo<AuthValue>(() => {
    // console.log("ChatAuthProvider: me", me, "isLoading", !data && shouldFetch);
    const roles = me?.roles ?? [];
    const auths = me?.authorities ?? [];
    return {
      me,
      isLoading: !data && shouldFetch,
      isAuthenticated: !!me,
      hasRole: (r) => roles.includes(r),
      hasAuthority: (a) => auths.includes(a),
      hasAnyAuthority: (arr) => arr.some((x) => auths.includes(x)),
    };
  }, [me, data, shouldFetch]);

  return (
    <ChatAuthContext.Provider value={value}>
      {children}
    </ChatAuthContext.Provider>
  );
}

export function useChatAuth() {
  const ctx = useContext(ChatAuthContext);
  if (!ctx) throw new Error("useChatAuth must be used within ChatAuthProvider");
  return ctx;
}
