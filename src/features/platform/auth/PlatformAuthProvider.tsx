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

const PlatformAuthContext = createContext<AuthValue | undefined>(undefined);

export function PlatformAuthProvider({
  initialMe,
  children,
  enabled = true,
}: {
  initialMe: Me | null;
  children: React.ReactNode;
  enabled?: boolean;
}) {
  const pathname = usePathname();
  const isAuthRoute = pathname?.startsWith("/platform/auth");
  const shouldFetch = enabled && !isAuthRoute;

  const { data } = useMeQuery({ enabled: shouldFetch });
  const me = (shouldFetch ? data : null) ?? initialMe ?? null;

  const value = useMemo<AuthValue>(() => {
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
  }, [me]);

  return (
    <PlatformAuthContext.Provider value={value}>
      {children}
    </PlatformAuthContext.Provider>
  );
}

export function usePlatformAuth() {
  const ctx = useContext(PlatformAuthContext);
  if (!ctx)
    throw new Error("usePlatformAuth must be used within PlatformAuthProvider");
  return ctx;
}
