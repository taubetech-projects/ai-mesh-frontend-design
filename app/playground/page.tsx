"use client";

import { Sidebar } from "@/components/sidebar";
import { ChatInterface } from "./components/_chat-interface";
import { Provider } from "react-redux";
import store from "@/redux/store";
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
