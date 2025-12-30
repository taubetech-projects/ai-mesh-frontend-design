"use client";
import { AuthForm } from "@/features/platform/auth/components/PlatfromAuthForm";
import PlatformPublicRoute from "@/features/platform/auth/components/PlatformPublicRoute";

// --- Login Page Component ---
export default function SignIn() {
  return (
    <PlatformPublicRoute>
      <AuthForm view="login" />
    </PlatformPublicRoute>
  );
}
