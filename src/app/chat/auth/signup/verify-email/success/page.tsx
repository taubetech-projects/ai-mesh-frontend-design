"use client";

import React, { useEffect, useState } from "react";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import { CheckCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { CHAT_ROUTES } from "@/shared/constants/routingConstants";
import { useVerifyEmailMutation } from "@/features/chat/auth/hooks/useAuthQueries";

export default function EmailVerifiedSuccessPage() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);
  const searchParams = useSearchParams();
  const emailToken = searchParams.get("token");
  const verifyEMail = useVerifyEmailMutation();

useEffect(() => {
  if (!emailToken) return;

  verifyEMail.mutateAsync(emailToken);
}, [emailToken]);

useEffect(() => {
  if (!verifyEMail.isSuccess) return;

  const timer = setInterval(() => {
    setCountdown((prev) => {
      if (prev <= 1) {
        clearInterval(timer);
        return 0;
      }
      return prev - 1;
    });
  }, 1000);

  const redirect = setTimeout(() => {
    router.push(CHAT_ROUTES.SIGNIN);
  }, 5000);

  return () => {
    clearInterval(timer);
    clearTimeout(redirect);
  };
}, [verifyEMail.isSuccess, router]);



  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 text-center font-sans">
      <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-2xl max-w-md w-full shadow-xl shadow-indigo-500/10 backdrop-blur-sm animate-in fade-in zoom-in duration-300">
        <div className="flex justify-center mb-6">
          <div className="h-20 w-20 bg-green-500/20 rounded-full flex items-center justify-center border border-green-500/30">
            <CheckCircle className="h-10 w-10 text-green-400" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-white mb-2">
          Email Verified Successfully!
        </h1>
        <p className="text-zinc-400 mb-8">
          Thank you for verifying your email. Your account has been activated
          successfully.
        </p>

        <div className="space-y-4">
          <Link
            href={CHAT_ROUTES.SIGNIN}
            className="block w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition-colors shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2"
          >
            Go to Login <ArrowRight size={18} />
          </Link>

          <p className="text-sm text-zinc-500">
            Redirecting in {countdown} seconds...
          </p>
        </div>
      </div>
    </div>
  );
}
