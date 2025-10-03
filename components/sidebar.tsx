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
import { useSidebarReducer } from "@/reducer/sidebar-reducer"; 
import { TOGGLE_SIDEBAR } from "@/reducer/constants";

export function Sidebar() {
  const [{ isCollapsed }, dispatch] = useSidebarReducer();
  const { t } = useLanguage();

  return (
    <div
      className={`${
        isCollapsed ? "w-18" : "w-80"
      } h-screen bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300`}
    >
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center justify-between mb-4">
          <div
            className={`flex items-center gap-2 ${
              isCollapsed ? "justify-center" : ""
            }`}
          >
            <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center">
              <div className="w-5 h-5 bg-white rounded-sm flex items-center justify-center">
                <div className="w-3 h-3 bg-teal-500 rounded-full"></div>
              </div>
            </div>
            {!isCollapsed && (
              <span className="font-semibold text-sidebar-foreground">
                AI MESH
              </span>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="w-6 h-6 text-sidebar-foreground hover:bg-sidebar-accent"
            onClick={() => dispatch({ type: TOGGLE_SIDEBAR })}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </Button>
        </div>

        {!isCollapsed && (
          <Button className="w-full justify-start gap-2 bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90">
            <Plus className="w-4 h-4" />
            {t.nav.newChat}
          </Button>
        )}

        {isCollapsed && (
          <Button className="w-full justify-center bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90">
            <Plus className="w-4 h-4" />
          </Button>
        )}

        <Button
          variant="ghost"
          size="icon"
          className={`${
            isCollapsed ? "w-full" : "mt-2"
          } text-sidebar-foreground hover:bg-sidebar-accent`}
        >
          <Search className="w-4 h-4" />
        </Button>
      </div>

      {/* Projects Section */}
      {!isCollapsed && (
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
      {!isCollapsed && (
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
        {!isCollapsed && (
          <div className="flex justify-center">
            <LanguageSelector />
          </div>
        )}

        {/* Settings */}
        <Button
          variant="ghost"
          className={`${
            isCollapsed
              ? "w-full justify-center"
              : "w-full justify-start gap-2"
          } text-sidebar-foreground hover:bg-sidebar-accent`}
        >
          <Settings className="w-4 h-4" />
          {!isCollapsed && t.nav.settings}
        </Button>
      </div>
    </div>
  );
}
