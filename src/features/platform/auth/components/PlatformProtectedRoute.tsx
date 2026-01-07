"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { usePlatformAuth } from "@/features/platform/auth/PlatformAuthProvider";

export default function PlatformProtectedRoute({
  children,
  redirectTo = "/platform/auth/login",
}: {
  children: React.ReactNode;
  redirectTo?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { me, isLoading } = usePlatformAuth();

  useEffect(() => {
    if (!isLoading && !me) {
      const next = pathname ? `?next=${encodeURIComponent(pathname)}` : "";
      router.replace(`${redirectTo}${next}`);
    }
  }, [me, isLoading, router, redirectTo, pathname]);

  if (isLoading) return null;
  if (!me) return null;

  return <>{children}</>;
}
