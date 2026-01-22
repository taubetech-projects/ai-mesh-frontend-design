"use client";

import { Sidebar } from "@/features/chat/sidebar/components/sidebar";
import { ChatInterface } from "../../../features/platform/playground/components/_chat-interface";
import { Provider } from "react-redux";
import store from "@/lib/store/store";
import { DashboardLayout } from "@/features/platform/components/layouts";
export default function PlaygroundPage() {
  return (
    <DashboardLayout>
      <div className="flex h-screen bg-background">
        <Provider store={store}>
          {/* <Sidebar activeInterface={"CHAT"} /> */}
          <ChatInterface />
        </Provider>
      </div>
    </DashboardLayout>
  );
}
