"use client";
import { AuthForm } from "@/features/chat/auth/components/auth-form";
import PublicRoute from "@/shared/components/public-route";

// --- Login Page Component ---
export default function SignIn() {
  return (
    <PublicRoute>
      <AuthForm view="login" />
    </PublicRoute>
  );
}
