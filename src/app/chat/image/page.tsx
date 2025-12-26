import { ChatInterface } from "@/features/chat/components/chat-interface";
import { HomeChatInterface } from "@/features/chat/components/home-chat-interface";
import { HomeImageGeneration } from "@/features/chat/image-chat/components/home-image-generation";
import ProtectedRoute from "@/shared/components/protected-route";

export default function HomePage() {
  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-background">
        <HomeImageGeneration />
      </div>
    </ProtectedRoute>
  );
}
