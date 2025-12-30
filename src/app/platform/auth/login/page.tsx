"use client";
import { PlatformAuthForm } from "@/features/platform/auth/components/auth-form";
import PublicRoute from "@/shared/components/public-route";

// --- Login Page Component ---
export default function SignIn() {
  return (
    <PublicRoute>
      <PlatformAuthForm view="login" />
    </PublicRoute>
  );
}
