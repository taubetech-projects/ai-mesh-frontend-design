"use client";

import { useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { ChatInterface } from "@/components/chat-interface";
import type { ModelProvider } from "@/types/models";

const defaultProviders: ModelProvider[] = [
  {
    id: "openai",
    name: "OpenAI",
    models: [
      { id: "gpt-4", name: "GPT-4", icon: "🤖" },
      { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo", icon: "⚡" },
    ],
  },
  {
    id: "anthropic",
    name: "Anthropic",
    models: [
      { id: "claude-3", name: "Claude 3", icon: "🧠" },
      { id: "claude-2", name: "Claude 2", icon: "💭" },
    ],
  },
  {
    id: "google",
    name: "Google",
    models: [
      { id: "gemini-pro", name: "Gemini Pro", icon: "💎" },
      { id: "palm-2", name: "PaLM 2", icon: "🌴" },
    ],
  },
  {
    id: "deepseek",
    name: "DeepSeek",
    models: [
      { id: "deepseek-chat", name: "DeepSeek Chat", icon: "🔍" },
      { id: "deepseek-coder", name: "DeepSeek Coder", icon: "💻" },
    ],
  },
];

export default function HomePage() {
  const [selectedModels, setSelectedModels] = useState<string[]>([
    "gpt-4",
    "claude-3",
    "gemini-pro",
  ]);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleToggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="flex h-screen bg-background dark">
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={handleToggleSidebar}
      />
      <ChatInterface
        providers={defaultProviders}
        selectedModels={selectedModels}
        setSelectedModels={setSelectedModels}
      />
    </div>
  );
}
