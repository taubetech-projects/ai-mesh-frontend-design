import { Sidebar } from "@/components/sidebar";
import { ChatInterface } from "@/components/chat-interface";
export default function PlaygroundPage() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <ChatInterface isPlayground={true} />
    </div>
  );
}
