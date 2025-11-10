"use client";

import Link from "next/link";
import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { authenticatedApi } from "@/lib/axiosApi";
import { setTokens } from "@/lib/auth";
import { AuthService } from "@/lib/services/AuthService";


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

// --- Login Page Component ---
export const AuthForm = ({ view }: { view: 'login' | 'signup' }) => {
    const isLogin = view === 'login';
    const title = isLogin ? 'Welcome Back' : 'Create Account';
    const buttonText = isLogin ? 'Log In' : 'Sign Up';
    const switchText = isLogin
        ? "Don't have an account?"
        : 'Already have an account?';
    const switchActionText = isLogin ? 'Sign Up' : 'Log In';
    const switchLink = isLogin ? '/signup' : '/login';

    const [identifier, setIdentifier] = useState(""); // For username or email on login
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async () => {
        try {
            console.log("usernameOrEmail:", identifier, "password:", password);
            const response = await AuthService.login({ username, password });
            console.log("Login response:", response);
            if (response && response.accessToken) {
                setTokens(response.accessToken, response.refreshToken);
                router.push("/home");
            } else {
                setError("Login failed: No token received.");
            }
        } catch (err: any) {
            handleAuthError(err);
        }
    };

    const handleSignup = async () => {
        try {
            const response = await AuthService.signup({ username, email, password });
            if (response) {
                // setApiKey(response.accessToken);
                router.push("/login");
            } else {
                setError("Signup failed: No token received.");
            }
        } catch (err: any) {
            handleAuthError(err);
        }
    };

    const handleAuthError = (err: any) => {
        console.error("Authentication error:", err);
        if (err.response && err.response.data && err.response.data.message) {
            setError(err.response.data.message);
        } else if (err.message) {
            setError(err.message);
        } else {
            setError("An unknown error occurred.");
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
                        {isLogin ? 'Sign in to continue to AI Mesh' : 'Get started with us today'}
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

                    {/* {!isLogin && (
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
                    )} */}

                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <LockIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="password"
                            placeholder="Password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                        />
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
                                href="#"
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
                    {switchText}{' '}
                    <Link href={switchLink} className="font-medium text-purple-400 hover:underline">
                        {switchActionText}
                    </Link>
                </p>

                <p className="text-center text-gray-400 mt-4">
                    <Link href="/" className="font-medium text-gray-400 hover:underline">
                        &larr; Back to Home
                    </Link>
                </p>
            </div>
        </div>
    );
};