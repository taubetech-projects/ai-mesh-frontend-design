import { fetchChatMe } from "@/lib/auth/me";
import { ChatAuthProvider } from "@/features/chat/auth/ChatAuthProvider";

export default async function ChatGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const me = await fetchChatMe();
  return (
    <ChatAuthProvider initialMe={me} enabled>
      {children}
    </ChatAuthProvider>
  );
}
