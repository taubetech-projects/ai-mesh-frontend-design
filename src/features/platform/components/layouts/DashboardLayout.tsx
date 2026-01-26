import { ReactNode } from "react";
import { PlatformSidebar } from "./AppSideBar";
import { TopBar } from "./TopBar";

interface DashboardLayoutProps {
  children: ReactNode;
  needTopBar?: boolean;
}

export function DashboardLayout({ children, needTopBar = true }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen flex w-full bg-background">
      <PlatformSidebar />
      <div className="flex-1 flex flex-col min-h-screen">
        {needTopBar && <TopBar />}
        <main className="flex-1 p-6 lg:p-8 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
