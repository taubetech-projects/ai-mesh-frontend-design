import { ChatInterface } from "@/components/chat-interface-3";
import ProtectedRoute from "@/components/protected-route";

export default function HomePage() {
    return (
        <ProtectedRoute>
            <div className="flex h-screen bg-background">
                    <ChatInterface />
            </div>
        </ProtectedRoute>
    );
}