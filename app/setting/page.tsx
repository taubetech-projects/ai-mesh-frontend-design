"use client";

import { ChevronDownIcon, LogOutIcon, MoonIcon, SunIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "@/contexts/theme-context";
import { LanguageSelector } from "@/components/language-selector";
import { clearTokens } from "@/lib/auth";

const SettingsPage = () => {
    const router = useRouter();
    const { theme, toggleTheme } = useTheme();

    const FormInput = ({ label, id, type = 'text', value, disabled = false }) => (
        <div className="mb-4">
            <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-2">
                {label}
            </label>
            <input
                type={type}
                id={id}
                defaultValue={value}
                disabled={disabled}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            />
        </div>
    );

    const FormSelect = ({ label, id, children }) => (
        <div className="mb-4">
            <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-2">
                {label}
            </label>
            <div className="relative">
                <select
                    id={id}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg appearance-none focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    defaultValue="English"
                >
                    {children}
                </select>
                <ChevronDownIcon className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>
        </div>
    );

    const FormPhoneInput = () => (
        <div className="mb-4">
            <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                Phone
            </label>
            <div className="flex">
                <div className="relative">
                    <select
                        id="country-code"
                        className="w-full pl-4 pr-10 py-3 bg-gray-700 border border-gray-600 rounded-l-lg appearance-none focus:ring-2 focus:ring-purple-500 focus:outline-none"
                        defaultValue="+880"
                    >
                        <option>+880 🇧🇩</option>
                        <option>+1 🇺🇸</option>
                        <option>+44 🇬🇧</option>
                        <option>+91 🇮🇳</option>
                    </select>
                    <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                </div>
                <input
                    type="tel"
                    id="phone"
                    placeholder="e.g. 98765 43210"
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-r-lg border-l-0 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
            </div>
        </div>
    );

    const handleLogout = () => {
        clearTokens();
        router.push('/');
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white pt-16">
            <div className="max-w-4xl mx-auto p-4 sm:p-8">
                <Link
                    href="/home"
                    className="font-medium text-gray-400 hover:underline mb-6 inline-block">
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
                            value="tahsinahmed.iit@gmail.com"
                            disabled
                        />
                        <FormInput
                            label="Full name"
                            id="full-name"
                            type="text"
                            value="Mir Mohammad Tahasin"
                        />
                        <FormPhoneInput />
                        <LanguageSelector />

                        <button
                            type="submit"
                            className="w-full sm:w-auto mt-4 text-lg font-semibold px-10 py-3 rounded-lg bg-gray-200 text-gray-900 shadow-lg hover:bg-white transform transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-gray-300"
                        >
                            Update profile
                        </button>
                    </form>
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
                            aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
                        >
                            {theme === 'light' ? <MoonIcon className="w-5 h-5" /> : <SunIcon className="w-5 h-5" />}
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
    );
};