"use client";
import { AuthForm } from "@/features/chat/auth/components/auth-form";
import ChatPublicRoute from "@/features/chat/auth/components/ChatPublicRoute";

// --- Login Page Component ---
export default function SignIn() {
  return (
    <ChatPublicRoute>
      <AuthForm view="login" />
    </ChatPublicRoute>
  );
}
