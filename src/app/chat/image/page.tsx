import { ChatInterface } from "@/features/chat/components/chat-interface";
import ProtectedRoute from "@/shared/components/protected-route";

export default function HomePage() {
  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-background">
        <ChatInterface />
      </div>
    </ProtectedRoute>
  );
}
