"use client";

import { useLanguage } from "@/shared/contexts/language-context";
import "react-json-pretty/themes/monikai.css";

import { ChatAreaJsonResponse } from "./_showJsonResponse";
import { ChatAreaTextResponse } from "./_chat-area-text-response";
import { useSelector } from "react-redux";

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

export function ChatArea({
  activeModel,
  outputFormat,
}: {
  activeModel: string;
  outputFormat: string;
}) {
  const { messages, jsonMessages } = useSelector(
    (store: any) => store.playgroundInterface
  );
  const { t } = useLanguage();
  console.log("Messages from chat area :", messages);

  const modelMessages = messages[activeModel];
  const jsonModelMessages = jsonMessages[activeModel];

  return (
    <div className="flex-1 flex flex-col h-full border-0 border-l border-border">
      {outputFormat === "json" &&
        jsonModelMessages &&
        jsonModelMessages.length > 0 && (
          <ChatAreaJsonResponse activeModel={activeModel} />
        )}
      {outputFormat === "text" && modelMessages && modelMessages.length > 0 && (
        <ChatAreaTextResponse modelMessages={modelMessages} />
      )}
    </div>
  );
}
