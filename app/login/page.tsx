"use client";
import { AuthForm } from "@/components/auth-form";
import PublicRoute from "@/components/public-route";

// --- Login Page Component ---
export default function SignIn() {
    return (
        <PublicRoute>
            <AuthForm view="login" />
        </PublicRoute>
    );
};