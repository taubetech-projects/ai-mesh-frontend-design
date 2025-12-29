import { Button } from "@/shared/components/ui/button";
import { Settings, User, Sparkles, LogOut } from "lucide-react";
import { LanguageSelector } from "@/shared/components/language-selector";
import { ThemeToggle } from "../../../../shared/components/theme-toggle";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { APP_ROUTES } from "@/shared/constants/routingConstants";
import { useChatAuth } from "@/features/chat/auth/ChatAuthProvider";

interface SidebarFooterProps {
  isCollapsed: boolean;
  handleUpgradePlan: () => void;
  handleLogout: () => void;
  t: any;
}

export function SidebarFooter({
  isCollapsed,
  handleUpgradePlan,
  handleLogout,
  t,
}: SidebarFooterProps) {
  const { me, isLoading } = useChatAuth();
  return (
    <div className="p-4 border-t border-sidebar-border space-y-4">
      {/* User Profile Section */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div
            className={`flex items-center ${
              isCollapsed ? "justify-center" : "justify-between gap-2"
            } p-2 rounded-lg hover:bg-sidebar-accent cursor-pointer transition-colors border border-transparent hover:border-sidebar-border`}
          >
            <div className="h-8 w-8 rounded-full bg-sidebar-primary/10 flex items-center justify-center border border-sidebar-border text-sidebar-foreground shrink-0">
              <User className="h-5 w-5" />
            </div>
            {!isCollapsed && (
              <>
                <div className="flex flex-col flex-1 min-w-0 text-left">
                  <span className="text-sm font-medium text-sidebar-foreground truncate">
                    {me?.username || "User"}
                  </span>
                  <span className="text-xs text-muted-foreground truncate">
                    {me?.roles || "Free User"}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleUpgradePlan}
                  onPointerDown={(e) => {
                    e.stopPropagation();
                  }}
                  className="h-6 text-[10px] px-2 rounded-full bg-sidebar-ring/10 text-sidebar-ring border-sidebar-ring/20 hover:bg-sidebar-ring/20"
                >
                  Upgrade
                </Button>
              </>
            )}
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="top" align="start" className="w-60">
          <Link href={APP_ROUTES.PRICING} passHref legacyBehavior>
            <DropdownMenuItem>
              <Sparkles className="mr-2 h-4 w-4" />
              <span>Upgrade Plan</span>
            </DropdownMenuItem>
          </Link>
          <Link href={APP_ROUTES.SETTINGS} passHref legacyBehavior>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>{t.nav.settings}</span>
            </DropdownMenuItem>
          </Link>
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            <div className="flex items-center justify-between w-full">
              <span>Change Theme</span>
              <ThemeToggle />
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            <div className="flex items-center justify-between w-full">
              <span>Language</span>
              <LanguageSelector />
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={handleLogout}
            className="text-red-500 focus:text-red-500"
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Logout</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
