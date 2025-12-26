"use client";

import React, { createContext, useContext, useMemo } from "react";
import type { Me } from "@/features/auth/types/authModels";
import { useMeQuery } from "@/features/auth/hooks/useAuthQueries";

type AuthValue = {
  me: Me | null;
  isAuthenticated: boolean;
  hasRole: (role: string) => boolean;
  hasAuthority: (authority: string) => boolean;
  hasAnyAuthority: (authorities: string[]) => boolean;
};

const AuthContext = createContext<AuthValue | undefined>(undefined);

export function AuthProvider({
  initialMe,
  children,
  enabled = true,
}: {
  initialMe: Me | null;
  children: React.ReactNode;
  enabled?: boolean;
}) {
  const { data } = useMeQuery({ enabled });
  const me = (enabled ? data : null) ?? initialMe ?? null;

  const value = useMemo<AuthValue>(() => {
    const roles = me?.roles ?? [];
    const auths = me?.authorities ?? [];
    return {
      me,
      isAuthenticated: !!me,
      hasRole: (r) => roles.includes(r),
      hasAuthority: (a) => auths.includes(a),
      hasAnyAuthority: (arr) => arr.some((x) => auths.includes(x)),
    };
  }, [me]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
