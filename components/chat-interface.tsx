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
      { id: "gpt-5-nano", name: "Gpt-5 Nano", icon: "🤖" },
      { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo", icon: "⚡" },
    ],
  },
  {
    id: "anthropic",
    name: "Anthropic",
    models: [
      { id: "claude-3-5-haiku-latest", name: "Claude 3.5 haiku", icon: "🧠" },
      { id: "claude-3-7-sonnet-latest", name: "Claude Sonnet 3.7", icon: "💭" },
    ],
  },
  {
    id: "google",
    name: "Google",
    models: [
      { id: "gemini-2.5-flash", name: "Gemini 2.5 Flash", icon: "💎" },
      { id: "gemini-2.5-flash-lite", name: "Gemini 2.5 Flash Lite", icon: "💎" }

    ],
  },
  {
    id: "deepseek",
    name: "DeepSeek",
    models: [
      { id: "deepseek-chat", name: "DeepSeek Chat", icon: "🔍" },
      { id: "deepseek-reasoner", name: "DeepSeek Reasoner", icon: "💻" },
    ],
  },
  {
    id: "perplexity",
    name: "Perplexity",
    models: [
      { id: "sonar", name: "Perplexity-Sonar", icon: "🔍" },
    ],
  },
  {
    id: "grok",
    name: "Grok",
    models: [
      { id: "grok-3-mini", name: "Grok-3 Mini", icon: "🔍" },
    ],
  },
];

interface ChatInterfaceProps {
  providers: ModelProvider[];
  selectedModels: string[];
  setSelectedModels: (models: string[]) => void;
}

type AssistantMsg = {
  role: "assistant";
  content: string;
  meta?: {
    provider: string;
    model: string;
    label?: string;
    latency_ms?: number;
  };
};

export function ChatInterface() {
  const [selectedModels, setSelectedModels] = useState<RouteSel[]>([
    { provider: "Google", model: "gemini-2.5-flash-lite" },
    { provider: "DeepSeek", model: "deepseek-chat" },
  ]);
  const [message, setMessage] = useState("");
  const [showModelSelector, setShowModelSelector] = useState(false);

  type UserMsg = { role: "user"; content: string };
  type Message = UserMsg | AssistantMsg;
  const [messages, setMessages] = useState<Record<string, Message[]>>({});

  const { t } = useLanguage();

  // ---- Send / Stream ----
  const onSend = async (userMessage: string) => {

    setMessages(prevMessages => {
      const newMessages = { ...prevMessages };
      for (const selectedModel of selectedModels) {
        const modelId = selectedModel.model;
        const existingMessages = newMessages[modelId] || [];
        newMessages[modelId] = [...existingMessages, { role: "user", content: userMessage }, {
          role: "assistant",
          content: "",
          meta: { provider: selectedModel.provider, model: selectedModel.model },
        },];
      }
      return newMessages;
    });
    console.log("Messages", messages);
    // return ;
    const bodyRoutes = selectedModels.map((model) => ({
      provider: model.provider,
      model: model.model,
    }));
    console.log(bodyRoutes);
    const ac = new AbortController();

    const body = {
      mode: "multi",
      routes: bodyRoutes.length > 0 ? bodyRoutes : null,
      messages: [
        {
          role: "user",
          content: userMessage,
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
        // console.log(e, d); // You can uncomment this for debugging
        if (e === "chat.response.delta") {
          const modelId = d.model;
          const contentChunk = d.delta.text || "";

          if (!modelId || !contentChunk) return;

          setMessages((prevMessages) => {
            const modelMessages = prevMessages[modelId] || [];
            if (modelMessages.length === 0) return prevMessages; // Should not happen

            const updatedMessages = [...modelMessages];
            const lastMessage = updatedMessages[updatedMessages.length - 1];

            // Append the new content chunk to the last message
            lastMessage.content += contentChunk;
            console.log("lastMessage", lastMessage.content,contentChunk);

            return { ...prevMessages, [modelId]: updatedMessages };
          });
        }
        console.log("Messages",messages);
      },
      ac.signal
    ).catch((err) => {
      console.error("SSE error", err);
    });
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      // Handle message sending logic here
      onSend(message);
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
          messages={messages}
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
