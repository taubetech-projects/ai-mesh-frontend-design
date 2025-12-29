"use client";

import { Provider, useSelector } from "react-redux";
import store, { RootState } from "@/lib/store/store";
import ProtectedRoute from "@/shared/components/protected-route";
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
    <ProtectedRoute>
      <HomeContent />
    </ProtectedRoute>
  );
}
