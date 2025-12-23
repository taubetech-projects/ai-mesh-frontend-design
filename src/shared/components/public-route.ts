"use client";
import { getAccessToken } from "@/features/auth/utils/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { APP_ROUTES } from "../constants/routingConstants";

export default function PublicRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const token = getAccessToken();
    if (token) {
      setIsAuth(true);
      router.replace(APP_ROUTES.CHAT);
    } else {
      setIsAuth(false);
    }
  }, [router]);

  if (isAuth) {
    return null;
  }

  return children;
}
