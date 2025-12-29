import { AuthForm } from "@/features/chat/auth/components/auth-form";
import ChatPublicRoute from "@/features/chat/auth/components/ChatPublicRoute";

export default function SignUp() {
  return (
    <ChatPublicRoute>
      <AuthForm view="signup" />
    </ChatPublicRoute>
  );
}
