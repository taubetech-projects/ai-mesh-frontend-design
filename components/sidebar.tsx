"use client";

import { Button } from "@/components/ui/button";
import {
  Plus,
  Search,
  Settings,
  Folder,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { LanguageSelector } from "@/components/language-selector";
import { useLanguage } from "@/contexts/language-context";
import { useState } from "react";

interface SidebarProps {
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function Sidebar({}) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleToggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };
  const { t } = useLanguage();

  return (
    <div
      className={`${
        isSidebarCollapsed ? "w-18" : "w-80"
      } h-screen bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300`}
    >
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center justify-between mb-4">
          <div
            className={`flex items-center gap-2 ${
              isSidebarCollapsed ? "justify-center" : ""
            }`}
          >
            <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center">
              <div className="w-5 h-5 bg-white rounded-sm flex items-center justify-center">
                <div className="w-3 h-3 bg-teal-500 rounded-full"></div>
              </div>
            </div>
            {!isSidebarCollapsed && (
              <span className="font-semibold text-sidebar-foreground">
                AI MESH
              </span>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="w-6 h-6 text-sidebar-foreground hover:bg-sidebar-accent"
            onClick={handleToggleSidebar}
          >
            {isSidebarCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </Button>
        </div>

        {!isSidebarCollapsed && (
          <Button className="w-full justify-start gap-2 bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90">
            <Plus className="w-4 h-4" />
            {t.nav.newChat}
          </Button>
        )}

        {isSidebarCollapsed && (
          <Button className="w-full justify-center bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90">
            <Plus className="w-4 h-4" />
          </Button>
        )}

        <Button
          variant="ghost"
          size="icon"
          className={`${
            isSidebarCollapsed ? "w-full" : "mt-2"
          } text-sidebar-foreground hover:bg-sidebar-accent`}
        >
          <Search className="w-4 h-4" />
        </Button>
      </div>

      {/* Projects Section */}
      {!isSidebarCollapsed && (
        <div className="flex-1 p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-sm text-sidebar-foreground">
              <Folder className="w-4 h-4" />
              {t.nav.project}
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="w-5 h-5 text-sidebar-foreground hover:bg-sidebar-accent"
            >
              <Plus className="w-3 h-3" />
            </Button>
          </div>
        </div>
      )}

      {/* History Section */}
      {!isSidebarCollapsed && (
        <div className="flex-1 p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-sm text-sidebar-foreground">
              <Folder className="w-4 h-4" />
              {t.nav.history}
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="w-5 h-5 text-sidebar-foreground hover:bg-sidebar-accent"
            >
              <Plus className="w-3 h-3" />
            </Button>
          </div>

          <div className="text-xs text-muted-foreground mb-2">
            Monday, September 8th
          </div>
          <div className="text-sm text-sidebar-foreground cursor-pointer hover:bg-sidebar-accent p-2 rounded">
            An overview of Bangl...
          </div>
        </div>
      )}

      {/* Bottom Section */}
      <div className="p-4 border-t border-sidebar-border space-y-4">
        {!isSidebarCollapsed && (
          <div className="flex justify-center">
            <LanguageSelector />
          </div>
        )}

        {/* Settings */}
        <Button
          variant="ghost"
          className={`${
            isSidebarCollapsed
              ? "w-full justify-center"
              : "w-full justify-start gap-2"
          } text-sidebar-foreground hover:bg-sidebar-accent`}
        >
          <Settings className="w-4 h-4" />
          {!isSidebarCollapsed && t.nav.settings}
        </Button>
      </div>
    </div>
  );
}
