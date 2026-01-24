import { User, Sparkles, Settings, HelpCircle, LogOut, ChevronRight, Star } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";

interface ProfileMenuProps {
  trigger: React.ReactNode;
  userName: string;
  userEmail: string;
  onUserInfoClick: () => void;
  onUpgradePlanClick: () => void;
  onPersonalizationClick: () => void;
  onSettingsClick: () => void;
  onHelpClick: () => void;
  onLogoutClick: () => void;
}

export function ProfileMenu({
  trigger,
  userName,
  userEmail,
  onUserInfoClick,
  onUpgradePlanClick,
  onPersonalizationClick,
  onSettingsClick,
  onHelpClick,
  onLogoutClick,
}: ProfileMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent 
        side="top" 
        align="start" 
        className="w-64 bg-sidebar border-sidebar-border"
      >
        {/* Profile Header - Clickable to open user info dialog */}
        <div
          className="px-3 py-3 cursor-pointer hover:bg-sidebar-accent rounded-sm transition-colors"
          onClick={onUserInfoClick}
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center text-white font-semibold shrink-0">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col flex-1 min-w-0">
              <span className="text-sm font-semibold text-sidebar-foreground truncate">
                {userName}
              </span>
              <span className="text-xs text-muted-foreground truncate">
                {userEmail}
              </span>
            </div>
          </div>
        </div>

        <DropdownMenuSeparator className="bg-sidebar-border" />

        {/* Menu Items */}
        <DropdownMenuItem
          onClick={onUpgradePlanClick}
          className="cursor-pointer focus:bg-sidebar-accent focus:text-sidebar-foreground"
        >
          <Sparkles className="mr-3 h-4 w-4" />
          <span>Upgrade plan</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={onPersonalizationClick}
          className="cursor-pointer focus:bg-sidebar-accent focus:text-sidebar-foreground"
        >
          <User className="mr-3 h-4 w-4" />
          <span>Personalization</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={onPersonalizationClick}
          className="cursor-pointer focus:bg-sidebar-accent focus:text-sidebar-foreground"
        >
          <Star className="mr-3 h-4 w-4" />
          <span>Model Preferences</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={onSettingsClick}
          className="cursor-pointer focus:bg-sidebar-accent focus:text-sidebar-foreground"
        >
          <Settings className="mr-3 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={onHelpClick}
          className="cursor-pointer focus:bg-sidebar-accent focus:text-sidebar-foreground"
        >
          <HelpCircle className="mr-3 h-4 w-4" />
          <span>Help</span>
          <ChevronRight className="ml-auto h-4 w-4" />
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-sidebar-border" />

        <DropdownMenuItem
          onClick={onLogoutClick}
          className="cursor-pointer focus:bg-sidebar-accent focus:text-red-500"
        >
          <LogOut className="mr-3 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
