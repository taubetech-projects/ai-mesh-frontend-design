import { AuthForm } from "@/features/chat/auth/components/auth-form";
import PlatformPublicRoute from "@/features/platform/auth/components/PlatformPublicRoute";

export default function SignUp() {
  return (
    <PlatformPublicRoute>
      <AuthForm view="signup" />
    </PlatformPublicRoute>
  );
}
