"use client";
import { AuthService } from "@/features/auth/api/authApi";
import { ErrorResponse } from "@/features/auth/types/authModels";
import { APP_ROUTES } from "@/shared/constants/routingConstants";
import { KeyIcon, MailIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";

export default function ForgotPasswordPage() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    setError("");

    try {
      await AuthService.forgotPassword({ email });
      // This generic message is good practice to avoid revealing which emails are registered.
      setMessage(
        "If an account with this email exists, a password reset link has been sent."
      );
    } catch (err: any) {
      const errorResponse = err.response?.data as ErrorResponse;
      setError(errorResponse.detail || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
      <div className="w-full max-w-md bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-700 text-center">
        <div className="flex justify-center mb-6">
          <KeyIcon className="h-16 w-16 text-purple-400" />
        </div>

        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 mb-4">
          Forgot Password
        </h2>
        <p className="text-gray-400 mt-2 mb-8">
          Enter your email address and we'll send you a link to reset your
          password.
        </p>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MailIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none disabled:opacity-50"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full text-lg font-semibold px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 shadow-lg hover:shadow-2xl hover:scale-105 transform transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-purple-300 disabled:bg-gradient-to-r disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed disabled:scale-100 disabled:shadow-lg"
          >
            {isLoading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        {error && (
          <div className="mt-6 text-center">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {message && (
          <div className="mt-6 text-center">
            <p className="text-green-400 text-sm">{message}</p>
            {/* This button simulates the user clicking the link in their email */}
            <button
              onClick={() => router.push(APP_ROUTES.RESET_PASSWORD)}
              className="mt-4 text-sm font-medium text-purple-400 hover:underline"
            >
              (Simulate clicking email link &rarr;)
            </button>
          </div>
        )}

        <p className="text-center text-gray-400 mt-8">
          <button
            onClick={() => router.push(APP_ROUTES.SIGNIN)}
            className="font-medium text-purple-400 hover:underline"
          >
            &larr; Back to Log In
          </button>
        </p>
      </div>
    </div>
  );
}
