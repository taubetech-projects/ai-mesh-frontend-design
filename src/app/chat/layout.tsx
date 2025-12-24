// app/chat/layout.tsx

import { Sidebar } from "@/features/sidebar/components/sidebar";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar activeInterface="CHAT"/>
      <main style={{ flex: 1 }}>{children}</main>
    </div>
  );
}
