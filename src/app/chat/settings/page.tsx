"use client";

import { LogOutIcon, MoonIcon, SunIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "@/shared/contexts/theme-context";
import { LanguageSelector } from "@/shared/components/language-selector";
import { APP_ROUTES } from "@/shared/constants/routingConstants";
import { useLogoutMutation } from "@/features/chat/auth/hooks/useAuthQueries";
import { ModelPreferences } from "@/features/chat/settings/model-preferences/components/ModelPreferences";
import { PhoneInput } from "@/features/chat/settings/components/PhoneInput";
import { FormInput } from "@/features/chat/settings/components/FormInput";
import { useChatAuth } from "@/features/chat/auth/ChatAuthProvider";
import ChatProtectedRoute from "@/features/chat/auth/components/ChatProtectedRoute";

export default function SettingsPage() {
  const { me, isLoading } = useChatAuth();
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();

  const logoutMutation = useLogoutMutation();

  async function handleLogout() {
    try {
      await logoutMutation.mutateAsync();
      router.push(APP_ROUTES.SIGNIN);
      router.refresh();
    } catch {
      alert("Logout failed. Please try again.");
    }
  }

  return (
    <ChatProtectedRoute>
      <div className="min-h-screen bg-gray-900 text-white pt-16">
        <div className="max-w-4xl mx-auto p-4 sm:p-8">
          <Link
            href={APP_ROUTES.CHAT}
            className="font-medium text-gray-400 hover:underline mb-6 inline-block"
          >
            &larr; Back to Home
          </Link>

          <h1 className="text-4xl font-bold mb-2">Profile Settings</h1>
          <p className="text-lg text-gray-400 mb-10">
            Manage your profile information and AI model preferences.
          </p>

          {/* Profile Information Card */}
          <div className="w-full bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-700 mb-8">
            <h2 className="text-2xl font-semibold mb-2">Profile information</h2>
            <p className="text-gray-400 mb-6">
              Manage your basic profile details.
            </p>

            <form onSubmit={(e) => e.preventDefault()}>
              <FormInput
                label="Email"
                id="email"
                type="email"
                value={me?.email ?? "no email"}
                disabled
              />
              <FormInput
                label="Full name"
                id="full-name"
                type="text"
                value={me?.username ?? "no name"}
              />
              <PhoneInput />
              <LanguageSelector />

              <button
                type="submit"
                className="w-full sm:w-auto mt-4 text-lg font-semibold px-10 py-3 rounded-lg bg-gray-200 text-gray-900 shadow-lg hover:bg-white transform transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-gray-300"
              >
                Update profile
              </button>
            </form>
          </div>
          {/* AI Model Preferences Card */}

          <div className="w-full bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-700 mb-8">
            <ModelPreferences />
          </div>

          {/* Theme Settings Card */}
          <div className="w-full bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-700 mb-8">
            <h2 className="text-2xl font-semibold mb-2">General Settings</h2>
            <p className="text-gray-400 mb-6">
              Adjust your application preferences.
            </p>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">Appearance</h3>
                <p className="text-gray-400 text-sm">
                  Customize how AI Mesh looks for you.
                </p>
              </div>

              <button
                onClick={toggleTheme}
                className="p-2 rounded-full bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors"
                aria-label={
                  theme === "light"
                    ? "Switch to dark mode"
                    : "Switch to light mode"
                }
              >
                {theme === "light" ? (
                  <MoonIcon className="w-5 h-5" />
                ) : (
                  <SunIcon className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Logout Button */}
          <div className="w-full bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-700">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-lg font-medium">Log Out</h3>
                <p className="text-gray-400 text-sm mt-1">
                  You will be returned to the home page.
                </p>
              </div>

              <button
                onClick={handleLogout}
                className="w-full sm:w-auto mt-4 sm:mt-0 flex items-center justify-center gap-2 text-lg font-semibold px-6 py-3 rounded-lg bg-red-600/20 text-red-400 border border-red-600/30 shadow-lg hover:bg-red-600/40 transform transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-red-400/50"
              >
                <LogOutIcon className="w-5 h-5" />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </ChatProtectedRoute>
  );
}
