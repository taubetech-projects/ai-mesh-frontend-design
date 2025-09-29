"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ModelColumns } from "@/components/model-columns";
import { ModelSelector } from "@/components/model-selector";
import type { ModelProvider } from "@/types/models";
import { Send, Mic, Paperclip, Settings } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { RouteSel, streamChat } from "@/lib/chatApi";

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

interface ChatInterfaceProps {
  providers: ModelProvider[];
  selectedModels: string[];
  setSelectedModels: (models: string[]) => void;
}

export function ChatInterface() {
  const [selectedModels, setSelectedModels] = useState<string[]>([
    "gpt-4",
    "claude-3",
    "gemini-pro",
    "gpt-3.5-turbo33",
  ]);
  const [message, setMessage] = useState("");
  const [showModelSelector, setShowModelSelector] = useState(false);
  const { t } = useLanguage();

  // ---- Send / Stream ----
  const onSend = async () => {
    let bodyRoutes: RouteSel[] = [];
    bodyRoutes.push({ provider: "openai", model: "gpt-5-nano" });
    bodyRoutes.push({ provider: "deepseek", model: "deepseek-chat" });

    const ac = new AbortController();

    const body = {
      mode: "multi",
      routes: bodyRoutes.length > 0 ? bodyRoutes : null,
      messages: [
        {
          role: "user",
          content: "Overview of Bangladesh in 5 words",
        },
      ],
      stream: true,
      provider_response: false,
    };

    await streamChat(
      body,
      (evt) => {
        const e = evt.event;
        const d = evt.data || {};
        console.log(e, d);
      },
      ac.signal
    ).catch((err) => {
      console.error("SSE error", err);
    });
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      // Handle message sending logic here
      onSend();
      console.log("Sending message:", message, "to models:", selectedModels);
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full">
      <div className="flex-1 relative h-full" style={{ minHeight: 0 }}>
        <ModelColumns
          providers={defaultProviders}
          selectedModels={selectedModels}
          setSelectedModels={setSelectedModels}
        />
      </div>

      <div className="sticky bottom-0 z-10 p-4 border-t border-border bg-background">
        <div className="max-w-4xl mx-auto">
          {/* Model Selector */}
          {showModelSelector && (
            <div className="mb-4">
              <ModelSelector
                providers={defaultProviders}
                selectedModels={selectedModels}
                setSelectedModels={setSelectedModels}
              />
            </div>
          )}

          {/* Input Field */}
          <div className="relative">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={t.chat.askAnything}
              className="pr-32 py-3 text-base bg-muted border-border text-white placeholder:text-muted-foreground"
            />

            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowModelSelector(!showModelSelector)}
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
              >
                <Settings className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
              >
                <Paperclip className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
              >
                <Mic className="w-4 h-4" />
              </Button>
              <Button
                onClick={handleSendMessage}
                size="icon"
                className="h-8 w-8 bg-teal-500 hover:bg-teal-600 text-white"
                disabled={!message.trim()}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
