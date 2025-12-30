"use client";
import { PlatformAuthService } from "@/features/platform/auth/api/authApi";
import { ErrorResponse } from "@/features/chat/auth/types/authModels";
import { CHAT_ROUTES } from "@/shared/constants/routingConstants";
import { LockIcon, MailIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useState, Suspense } from "react";

function PlatformResetPasswordFormComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [token, setToken] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const urlToken = searchParams.get("token");
    if (urlToken) {
      setToken(urlToken);
    } else {
      setError(
        "No reset token found. Please request a new password reset link."
      );
    }
  }, [searchParams]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!token) {
      setError("Invalid or missing reset token.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    try {
      await PlatformAuthService.resetPassword({
        token,
        newPassword: password,
      });
      setSuccess(true);
    } catch (err: any) {
      const errorResponse = err.response?.data as ErrorResponse;
      setError(errorResponse.detail || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
        <div className="w-full max-w-md bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-700 text-center">
          <div className="flex justify-center mb-6">
            <LockIcon className="h-16 w-16 text-green-400" />
          </div>
          <h2 className="text-3xl font-bold text-green-400 mb-4">
            Password Reset
          </h2>
          <p className="text-gray-400 mt-2 mb-8">
            Your password has been reset successfully. You can now log in with
            your new password.
          </p>
          <button
            onClick={() => router.push(CHAT_ROUTES.SIGNIN)}
            className="w-full text-lg font-semibold px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 shadow-lg hover:shadow-2xl hover:scale-105 transform transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-purple-300"
          >
            Back to Log In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
      <div className="w-full max-w-md bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-700">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
            Reset Your Password
          </h2>
          <p className="text-gray-400 mt-2">Enter your new password below.</p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <LockIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="password"
              placeholder="New Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none disabled:opacity-50"
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <LockIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="password"
              placeholder="Confirm New Password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isLoading}
              className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none disabled:opacity-50"
            />
          </div>

          {error && <p className="text-center text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={isLoading || !token}
            className="w-full text-lg font-semibold px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 shadow-lg hover:shadow-2xl hover:scale-105 transform transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-purple-300 disabled:bg-gradient-to-r disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed disabled:scale-100 disabled:shadow-lg"
          >
            {isLoading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  // The useSearchParams() hook should be wrapped in a Suspense boundary
  // to handle the initial server-side render where search params are not available.
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PlatformResetPasswordFormComponent />
    </Suspense>
  );
}
