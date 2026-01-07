import { PlatformAuthForm } from "@/features/platform/auth/components/PlatfromAuthForm";
import PlatformPublicRoute from "@/features/platform/auth/components/PlatformPublicRoute";

export default function SignUp() {
  return (
    <PlatformPublicRoute>
      <PlatformAuthForm view="signup" />
    </PlatformPublicRoute>
  );
}
