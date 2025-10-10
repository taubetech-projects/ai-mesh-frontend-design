import { Sidebar } from "@/components/sidebar";
import { ChatInterface } from "./components/_chat-interface";
export default function PlaygroundPage() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <ChatInterface />
    </div>
  );
}
