"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import ChatProtectedRoute from "@/features/chat/auth/components/ChatProtectedRoute";
import { HomeChatInterface } from "@/features/chat/components/home-chat-interface";
import { HomeImageGeneration } from "@/features/chat/image-chat/components/home-image-generation";

export type RouteSel = { provider: string; model: string };

function HomeContent() {
  const { activeInterface } = useSelector((state: RootState) => state.ui);

  return (
    <div className="flex h-screen bg-background">
      {/* <Sidebar activeInterface={activeInterface} /> */}
      {activeInterface === "CHAT" ? (
        <HomeChatInterface />
      ) : (
        <HomeImageGeneration />
      )}
    </div>
  );
}

export default function HomePage() {
  return (
    <ChatProtectedRoute>
      <HomeContent />
    </ChatProtectedRoute>
  );
}
