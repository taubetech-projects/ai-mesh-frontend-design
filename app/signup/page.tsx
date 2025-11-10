import { AuthForm } from "@/components/auth-form";
import PublicRoute from "@/components/public-route";

export default function SignUp() {
    return (
        <PublicRoute>
            <AuthForm view="signup" />
        </PublicRoute>
    );
}