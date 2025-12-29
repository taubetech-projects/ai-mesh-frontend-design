import { Button } from "@/shared/components/ui/button";
import { Plus, Search, ChevronLeft, ChevronRight } from "lucide-react";

interface SidebarHeaderProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
  onNewChat: () => void;
  activeInterface: string;
  t: any;
}

export function SidebarHeader({
  isCollapsed,
  toggleSidebar,
  onNewChat,
  activeInterface,
  t,
}: SidebarHeaderProps) {
  return (
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
          onClick={toggleSidebar}
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </Button>
      </div>

      {!isCollapsed && (
        <Button
          onClick={onNewChat}
          className={`w-full justify-start gap-2 ${
            activeInterface === "CHAT"
              ? "bg-sidebar-primary"
              : "bg-sidebar-primary"
          } text-sidebar-primary-foreground hover:bg-sidebar-primary/90`}
        >
          <Plus className="w-4 h-4" />
          {t.nav.newChat}
        </Button>
      )}

      {isCollapsed && (
        <Button
          onClick={onNewChat}
          className={`w-full justify-center ${
            activeInterface === "CHAT"
              ? "bg-sidebar-ring"
              : "bg-sidebar-primary"
          } text-sidebar-primary-foreground hover:bg-sidebar-primary/90`}
        >
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
  );
}