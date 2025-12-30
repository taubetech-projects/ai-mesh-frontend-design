"use client";
import { PlatformAuthForm } from "@/features/platform/auth/components/PlatfromAuthForm";
import PlatformPublicRoute from "@/features/platform/auth/components/PlatformPublicRoute";

// --- Login Page Component ---
export default function SignIn() {
  return (
    <PlatformPublicRoute>
      <PlatformAuthForm view="login" />
    </PlatformPublicRoute>
  );
}
