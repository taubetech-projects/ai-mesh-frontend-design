"use client";

import { useLanguage } from "@/contexts/language-context";
import {
  Check,
  Copy,
  ChevronDown,
  ChevronUp,
  ArrowDown,
} from "lucide-react"; // or any icon lib
import { useState } from "react";
import "react-json-pretty/themes/monikai.css";

import { ChatAreaJsonResponse } from "./_showJsonResponse";
import { ChatAreaTextResponse } from "./_chat-area-text-response";






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

type UserMsg = { role: "user"; content: string };
type Message = UserMsg | AssistantMsg;

interface Message2 {
  type: "question" | "answer";
  content: string;
}

interface MessageType {
  role: "user" | "assistant";
  content: string;
}

interface ChatAreaProps {
  activeModel: string;
  messages: Record<string, Message[]>;
  jsonMessages: Record<string, any[]>;
  outputFormat: string;
}




export function ChatArea({ activeModel, messages, jsonMessages, outputFormat }: ChatAreaProps) {
  const { t } = useLanguage();
  console.log("Messages from chat area :", messages);
  const getModelDisplayName = (modelId: string) => {
    const modelNames: Record<string, string> = {
      "gpt-4": "GPT-4",
      "claude-3": "Claude 3",
      "gemini-pro": "Gemini Pro",
      "deepseek-chat": "DeepSeek Chat",
      "gpt-3.5-turbo": "GPT-3.5 Turbo",
      "claude-2": "Claude 2",
      "palm-2": "PaLM 2",
      "deepseek-coder": "DeepSeek Coder",
      "gemini-2.5-flash-lite": "Gemini-2.5 Flash",
    };
    return modelNames[modelId] || modelId;
  };

  const getModelIcon = (modelId: string) => {
    return (
      <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center">
        <div className="w-5 h-5 bg-white rounded-sm flex items-center justify-center">
          <div className="w-3 h-3 bg-teal-500 rounded-full"></div>
        </div>
      </div>
    );
  };

  const modelMessages = messages[activeModel];
  const jsonModelMessages = jsonMessages[activeModel];
  // const modelDisplayName = getModelDisplayName(activeModel);
  return <div className="flex-1 flex flex-col h-full border-0 border-l border-border">
    {(outputFormat === "json" && jsonModelMessages && jsonModelMessages.length > 0) &&
      <ChatAreaJsonResponse jsonModelMessages={jsonModelMessages} />
    }
    {( outputFormat === "text" && modelMessages && modelMessages.length > 0) &&
      <ChatAreaTextResponse modelMessages={modelMessages} />
    }
  </div>

}
