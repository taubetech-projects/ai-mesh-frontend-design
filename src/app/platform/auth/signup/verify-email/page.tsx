"use client";

import PublicRoute from "@/shared/components/public-route";
import { PlatformAuthService } from "@/features/platform/auth/api/authApi";
import {
  ErrorResponse,
  ResendEmailRequest,
} from "@/features/chat/auth/types/authModels";
import { MailIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

export default function VerifyEmail() {
  const [emailSent, setEmailSent] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const handleResend = async () => {
    if (!email) return;
    setEmailSent(true);
    try {
      const response = await PlatformAuthService.resendEmail({ email });
      if (response) {
        toast.success("Resend Successfull");
      } else {
        toast.info("Resend Failed : Unkown Error");
      }
    } catch (err: any) {
      const errorResponse = err.response?.data as ErrorResponse;
      toast.error(errorResponse.detail || "Something went wrong");
    }
    setTimeout(() => setEmailSent(false), 3000);
  };

  return (
    <PublicRoute>
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
        <div className="w-full max-w-md bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-700 text-center">
          <div className="flex justify-center mb-6">
            <MailIcon className="h-16 w-16 text-purple-400" />
          </div>

          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 mb-4">
            Check Your Inbox
          </h2>
          <p className="text-gray-400 mt-2 mb-8">
            We've sent a verification link to{" "}
            <strong>{email || "your email address"}</strong>. Please click the
            link to complete your registration.
          </p>

          <button
            onClick={handleResend}
            disabled={emailSent}
            className={`w-full text-lg font-semibold px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 shadow-lg transform transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-purple-300 ${
              emailSent
                ? "opacity-50 cursor-not-allowed"
                : "hover:shadow-2xl hover:scale-105"
            }`}
          >
            {emailSent ? "Email Sent!" : "Resend Email"}
          </button>

          <p className="text-gray-500 text-sm mt-6 mb-4">
            Didn't receive the email? Check your spam folder or try resending.
          </p>

          <p className="text-center text-gray-400 mt-8">
            <button
              onClick={() => router.push("/auth/login")}
              className="font-medium text-purple-400 hover:underline"
            >
              &larr; Back to Log In
            </button>
          </p>
        </div>
      </div>
    </PublicRoute>
  );
}

function handleAuthError(errorResponse: ErrorResponse) {
  throw new Error("Function not implemented.");
}
