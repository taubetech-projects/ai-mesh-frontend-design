"use client";

import { Sidebar } from "@/components/sidebar";
import { ChatInterface } from "@/components/chat-interface";

export type RouteSel = { provider: string; model: string };

export default function HomePage() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <ChatInterface />
    </div>
  );
}
