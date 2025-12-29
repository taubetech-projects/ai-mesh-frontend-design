import { AuthForm } from "@/features/chat/auth/components/auth-form";
import PublicRoute from "@/shared/components/public-route";

export default function SignUp() {
  return (
    <PublicRoute>
      <AuthForm view="signup" />
    </PublicRoute>
  );
}
