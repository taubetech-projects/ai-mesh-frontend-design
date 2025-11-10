"use client"

import { Provider } from "react-redux";
import { Sidebar } from "@/components/sidebar";
import { ChatInterface } from "@/components/chat-interface-3";
import store from "@/redux/store";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAccessToken } from "@/lib/auth";
import ProtectedRoute from "@/components/protected-route";

export type RouteSel = { provider: string; model: string };

export default function HomePage() {
    return (
        <ProtectedRoute>
            <div className="flex h-screen bg-background">
                <Provider store={store}>
                    <Sidebar />
                    <ChatInterface />
                </Provider>
            </div>
        </ProtectedRoute>
    );
}
