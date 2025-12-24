"use client";

import { Provider, useSelector } from "react-redux";
import { Sidebar } from "@/features/sidebar/components/sidebar";
import { ChatInterface } from "@/features/chat/components/chat-interface"; // Assuming this is your chat interface
import { ImageGenerationInterface } from "../../features/chat/image-chat/components/image-generation-interface"; // New import
import store, { RootState } from "@/lib/store/store";
import ProtectedRoute from "@/shared/components/protected-route";
import { HomeChatInterface } from "@/features/chat/components/home-chat-interface";

export type RouteSel = { provider: string; model: string };

function HomeContent() {
  const { activeInterface } = useSelector((state: RootState) => state.ui);

  return (
    <div className="flex h-screen bg-background">
      {/* <Sidebar activeInterface={activeInterface} /> */}
      {activeInterface === "CHAT" ? (
        <HomeChatInterface />
      ) : (
        <ImageGenerationInterface />
      )}
    </div>
  );
}

export default function HomePage() {
  return (
    <ProtectedRoute>
      <HomeContent />
    </ProtectedRoute>
  );
}
