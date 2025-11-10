"use client"

import { Provider } from "react-redux";
import { Sidebar } from "@/components/sidebar";
import { ChatInterface } from "@/components/chat-interface-3";
import store from "@/redux/store";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAccessToken } from "@/lib/auth";

export type RouteSel = { provider: string; model: string };

export default function HomePage() {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = getAccessToken();
        console.log("Token:", token);
        if (!token) {
            router.push('/login');
        } else {
            setIsAuthenticated(true);
        }
    }, [router]);

    if (!isAuthenticated) {
        // Render a loading state or null while checking authentication
        // to prevent flashing the protected content.
        return null; 
    }

    return (
        <div className="flex h-screen bg-background">
            <Provider store={store}>
                <Sidebar />
                <ChatInterface />
            </Provider>
        </div>
    );
}
