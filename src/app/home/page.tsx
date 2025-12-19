"use client";

import { Provider, useSelector } from "react-redux";
import { Sidebar } from "@/shared/components/sidebar";
import { ChatInterface } from "@/features/chat/components/chat-interface-3"; // Assuming this is your chat interface
import { ImageGenerationInterface } from "../../features/chat/image-chat/components/image-generation-interface"; // New import
import store, { RootState } from "@/redux/store";
import ProtectedRoute from "@/shared/components/protected-route";

export type RouteSel = { provider: string; model: string };

function HomeContent() {
  const { activeInterface } = useSelector((state: RootState) => state.ui);

  return (
    <div className="flex h-screen bg-background">
      <Sidebar activeInterface={activeInterface} />
      {activeInterface === "CHAT" ? (
        <ChatInterface />
      ) : (
        <ImageGenerationInterface />
      )}
    </div>
  );
}

export default function HomePage() {
  return (
    <ProtectedRoute>
      <Provider store={store}>
        <HomeContent />
      </Provider>
    </ProtectedRoute>
  );
}
