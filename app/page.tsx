"use client";
import "katex/dist/katex.min.css";
import "./globals.css";

import { Provider } from "react-redux";
import { Sidebar } from "@/components/sidebar";
import { ChatInterface } from "@/components/chat-interface";
import store from "../redux/store";

export type RouteSel = { provider: string; model: string };

export default function HomePage() {
  return (
    <div className="flex h-screen bg-background">
      <Provider store={store}>
        <Sidebar />
        <ChatInterface />
      </Provider>
    </div>
  );
}
