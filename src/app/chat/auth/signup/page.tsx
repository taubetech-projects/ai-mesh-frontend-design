import { ChatAuthForm } from "@/features/chat/auth/components/ChatAuthForm";
import ChatPublicRoute from "@/features/chat/auth/components/ChatPublicRoute";

export default function SignUp() {
  return (
    <ChatPublicRoute>
      <ChatAuthForm view="signup" />
    </ChatPublicRoute>
  );
}
