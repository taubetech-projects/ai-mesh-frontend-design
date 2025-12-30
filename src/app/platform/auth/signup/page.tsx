import { PlatformAuthForm } from "@/features/platform/auth/components/auth-form";
import PublicRoute from "@/shared/components/public-route";

export default function SignUp() {
  return (
    <PublicRoute>
      <PlatformAuthForm view="signup" />
    </PublicRoute>
  );
}
