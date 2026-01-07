"use client";

import Link from "next/link";
import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { ChatAuthService } from "@/features/chat/auth/api/authApi";
import { ErrorResponse } from "@/features/chat/auth/types/authModels";
import { toast } from "sonner";
import { CHAT_ROUTES } from "@/shared/constants/routingConstants";
import { useLoginMutation, useSignupMutation } from "../hooks/useAuthQueries";

// --- SVG Icons ---
const UserIcon = ({ className }: { className: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const LockIcon = ({ className }: { className: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);

const MailIcon = ({ className }: { className: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
    <polyline points="22,6 12,13 2,6"></polyline>
  </svg>
);

const EyeIcon = ({ className }: { className: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);

const EyeOffIcon = ({ className }: { className: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
    <line x1="1" y1="1" x2="23" y2="23"></line>
  </svg>
);

const GoogleIcon = ({ className }: { className: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 48 48"
    className={className}
  >
    <path
      fill="#FFC107"
      d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
    ></path>
    <path
      fill="#FF3D00"
      d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
    ></path>
    <path
      fill="#4CAF50"
      d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
    ></path>
    <path
      fill="#1976D2"
      d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C43.021,36.251,45,30.633,45,24C45,22.659,44.862,21.35,44.611,20.083z"
    ></path>
  </svg>
);

// --- Login Page Component ---
export const ChatAuthForm = ({ view }: { view: "login" | "signup" }) => {
  const isLogin = view === "login";
  const title = isLogin ? "Welcome Back" : "Create Account";
  const buttonText = isLogin ? "Log In" : "Sign Up";
  const switchText = isLogin
    ? "Don't have an account?"
    : "Already have an account?";
  const switchActionText = isLogin ? "Sign Up" : "Log In";
  const switchLink = isLogin ? CHAT_ROUTES.SIGNUP : CHAT_ROUTES.SIGNIN;

  const [identifier, setIdentifier] = useState(""); // For username or email on login
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<React.ReactNode>("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleGoogleSignIn = () => {
    window.location.href = CHAT_ROUTES.GOOGLE_SIGNIN;
  };

  const loginMutation = useLoginMutation();

  const handleLogin = async () => {
    try {
      console.log("usernameOrEmail:", identifier, "password:", password);
      const response = await loginMutation.mutateAsync({
        username,
        password,
      });
      console.log("Login response:", response);
      if (response && response.accessToken) {
        toast.success("Login successful! Welcome to our platform...");
        setTimeout(() => {
          router.push(CHAT_ROUTES.CHAT);
        }, 1000);
      } else {
        setError("Login failed: No token received.");
      }
    } catch (err: any) {
      const errorResponse = err.response?.data as ErrorResponse;
      if (errorResponse.status === 403) {
        setError(
          <>
            {errorResponse.detail}{" "}
            <button
              onClick={() => handleResendVerification(username)}
              className="font-bold underline hover:text-red-200"
            >
              Activate Now
            </button>
          </>
        );
      } else {
        handleAuthError(errorResponse);
      }
    }
  };

  const handleResendVerification = async (email: string) => {
    console.log("Resending verification email for:", email);
    try {
      const response = await ChatAuthService.resendEmail({ email });
      console.log("Resend email response:", response);
      toast.success("Verification email sent successfully!");
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Failed to resend email.");
    }
  };

  const signupMutation = useSignupMutation();

  const handleSignup = async () => {
    try {
      const response = await signupMutation.mutateAsync({
        username,
        email,
        password,
      });
      if (response) {
        toast.info(
          "Signup successful! Please check your email for verification."
        );
        router.push(
          `${CHAT_ROUTES.VERIFY_EMAIL}?email=${encodeURIComponent(
            response.email
          )}`
        );
        // toast.success("Signup successful! Redirecting to login...");
        // setTimeout(() => {
        //     router.push("/login");
        // }, 2000); // 2-second delay before redirecting
      } else {
        setError("Signup failed: No token received.");
      }
    } catch (err: any) {
      const errorResponse = err.response?.data as ErrorResponse;
      handleAuthError(errorResponse);
      // handleAuthError(errorResponse.detail);
    }
  };

  const handleAuthError = (err: ErrorResponse) => {
    console.error("Authentication error:", err);
    if (err.errors && err.errors.length > 0) {
      setError(err.errors.at(0) || "Something went wrong");
    } else {
      if (err.detail) {
        setError(err.detail);
      } else {
        setError("An unknown error occurred.");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (isLogin) {
        await handleLogin();
      } else {
        await handleSignup();
      }
    } catch (err: any) {
      // This is a fallback, but errors should be caught in handleLogin/handleSignup
      handleAuthError(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
      <div className="w-full max-w-md bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-700">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
            {title}
          </h2>
          <p className="text-gray-400 mt-2">
            {isLogin
              ? "Sign in to continue to AI Mesh"
              : "Get started with us today"}
          </p>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-300 text-sm rounded-lg p-3 mb-4 text-center">
            {error}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          {isLogin ? (
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <UserIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Username or Email"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
            </div>
          ) : (
            <>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MailIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  placeholder="Email address"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>
            </>
          )}

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <LockIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-12 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-gray-200"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOffIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {isLogin && (
            <div className="flex items-center justify-between">
              <label className="flex items-center text-sm text-gray-400">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded bg-gray-700 border-gray-600 text-purple-600 focus:ring-purple-500"
                />
                <span className="ml-2">Remember me</span>
              </label>
              <a
                href={CHAT_ROUTES.FORGOT_PASSWORD}
                className="text-sm text-purple-400 hover:underline"
              >
                Forgot password?
              </a>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full text-lg font-semibold px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 shadow-lg hover:shadow-2xl hover:scale-105 transform transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-purple-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              buttonText
            )}
          </button>
        </form>

        <p className="text-center text-gray-400 mt-8">
          {switchText}{" "}
          <Link
            href={switchLink}
            className="font-medium text-purple-400 hover:underline"
          >
            {switchActionText}
          </Link>
        </p>

        <div className="relative flex items-center my-6">
          <div className="flex-grow border-t border-gray-600"></div>
          <span className="flex-shrink mx-4 text-sm text-gray-400">OR</span>
          <div className="flex-grow border-t border-gray-600"></div>
        </div>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center gap-3 px-6 py-3 rounded-lg bg-gray-700 border border-gray-600 hover:bg-gray-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
        >
          <GoogleIcon className="h-6 w-6" />
          <span className="text-base font-medium text-white">
            {isLogin ? "Sign in with Google" : "Sign up with Google"}
          </span>
        </button>

        <p className="text-center text-gray-400 mt-4">
          <Link href="/" className="font-medium text-gray-400 hover:underline">
            &larr; Back to Home
          </Link>
        </p>
      </div>
    </div>
  );
};
