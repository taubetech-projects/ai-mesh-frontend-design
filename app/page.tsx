"use client";

import { Sidebar } from "@/components/sidebar";
import { ChatInterface } from "@/components/chat-interface";
import {
  fetchModels,
  fetchProviders,
  streamChat,
  type ChatMsg,
} from "@/lib/chatApi";
import { useEffect } from "react";
import { on } from "events";

export type RouteSel = { provider: string; model: string };

export default function HomePage() {
  useEffect(function () {
    onSend();
  }, []);
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
  return (
    <div className="flex h-screen bg-background dark">
      <Sidebar />
      <ChatInterface />
    </div>
  );
}
