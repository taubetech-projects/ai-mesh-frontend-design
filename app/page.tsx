"use client";

import { Sidebar } from "@/components/sidebar";
import { ChatInterface } from "@/components/chat-interface";

export default function HomePage() {
  return (
    <div className="flex h-screen bg-background dark">
      <Sidebar />
      <ChatInterface />
    </div>
  );
}
