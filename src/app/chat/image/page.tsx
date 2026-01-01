import ChatProtectedRoute from "@/features/chat/auth/components/ChatProtectedRoute";
import { ChatInterface } from "@/features/chat/components/chat-interface";
import { HomeChatInterface } from "@/features/chat/components/home-chat-interface";
import { HomeImageGeneration } from "@/features/chat/image-chat/components/home-image-generation";

export default function HomePage() {
  return (
    <ChatProtectedRoute>
      <div className="flex h-screen bg-background">
        <HomeImageGeneration />
      </div>
    </ChatProtectedRoute>
  );
}
