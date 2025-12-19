"use client";

import { Sidebar } from "@/features/sidebar/components/sidebar";
import { ChatInterface } from "../../features/playground/components/_chat-interface";
import { Provider } from "react-redux";
import store from "@/lib/store/store";
export default function PlaygroundPage() {
  return (
    <div className="flex h-screen bg-background">
      <Provider store={store}>
        <Sidebar />
        <ChatInterface />
      </Provider>
    </div>
  );
}
