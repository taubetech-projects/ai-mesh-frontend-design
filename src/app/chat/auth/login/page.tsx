"use client";
import { ChatAuthForm } from "@/features/chat/auth/components/ChatAuthForm";
import ChatPublicRoute from "@/features/chat/auth/components/ChatPublicRoute";

// --- Login Page Component ---
export default function SignIn() {
  return (
    <ChatPublicRoute>
      <ChatAuthForm view="login" />
    </ChatPublicRoute>
  );
}
