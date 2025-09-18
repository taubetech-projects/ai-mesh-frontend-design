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

interface ChatInterfaceProps {
  providers: ModelProvider[];
  selectedModels: string[];
  setSelectedModels: (models: string[]) => void;
}

export function ChatInterface({
  providers,
  selectedModels,
  setSelectedModels,
}: ChatInterfaceProps) {
  const [message, setMessage] = useState("");
  const [showModelSelector, setShowModelSelector] = useState(false);
  const { t } = useLanguage();

  const handleSendMessage = () => {
    if (message.trim()) {
      // Handle message sending logic here
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
          providers={providers}
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
                providers={providers}
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
