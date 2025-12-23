// src/components/ProtectedRoute.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAccessToken } from "@/features/auth/utils/auth";
import { APP_ROUTES } from "../constants/routingConstants";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      router.replace(APP_ROUTES.SIGNIN);
    } else {
      setIsAuth(true);
    }
  }, [router]);

  if (!isAuth) {
    return null; // or show a loader while checking
  }

  return <>{children}</>;
}
