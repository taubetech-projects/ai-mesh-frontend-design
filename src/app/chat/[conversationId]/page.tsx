"use client";
import { ChatInterface } from "@/features/chat/components/chat-interface";
import { ImageGenerationInterface } from "@/features/chat/image-chat/components/image-generation-interface";
import store, { RootState } from "@/lib/store/store";
import ProtectedRoute from "@/shared/components/protected-route";
import { useSelector, Provider } from "react-redux";

// app/chat/[conversationId]/page.tsx
interface ChatPageProps {
  params: {
    conversationId: string;
  };
}

// export default async function ChatPage({ params }: ChatPageProps) {
//   const { conversationId } = params;

//   // Example: fetch conversation
//   // const conversation = await getConversation(conversationId);

//   return (
//     <div>
//       <h2>Conversation ID: {conversationId}</h2>

//       {/* Render messages here */}
//       {/* conversation.messages.map(...) */}
//     </div>
//   );
// }

function HomeContent2() {
  const { activeInterface } = useSelector((state: RootState) => state.ui);

  return (
    <div className="flex h-screen bg-background">
      {/* <Sidebar activeInterface={activeInterface} /> */}
      {activeInterface === "CHAT" ? (
        <ChatInterface />
      ) : (
        <ImageGenerationInterface />
      )}
    </div>
  );
}

export default function ChatPage() {
  return (
    <ProtectedRoute>
      <Provider store={store}>
        <HomeContent2 />
      </Provider>
    </ProtectedRoute>
  );
}
