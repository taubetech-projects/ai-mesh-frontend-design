"use client";

import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { User } from "lucide-react";

import { CHAT_ROUTES } from "@/shared/constants/routingConstants";
import { useChatAuth } from "@/features/chat/auth/ChatAuthProvider";
import { ProfileMenu } from "./profile-menu";
import { UserInfoDialog } from "./user-info-dialog";
import { SettingsDialog, SettingsTab } from "./settings-dialog";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  const [userInfoDialogOpen, setUserInfoDialogOpen] = useState(false);
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
  const [settingsInitialTab, setSettingsInitialTab] = useState<SettingsTab>("general");

  const userName = me?.username || "User";
  const userEmail = me?.email || "user@example.com";

  const handleUserInfoClick = () => {
    setUserInfoDialogOpen(true);
  };

  const handlePersonalizationClick = () => {
    setSettingsInitialTab("personalization");
    setSettingsDialogOpen(true);
  };
  const handleModelPreferencesClick = () => {
    setSettingsInitialTab("model-preferences");
    setSettingsDialogOpen(true);
  };

  const handleTeamsClick = () => {
    setSettingsInitialTab("teams");
    setSettingsDialogOpen(true);
  };

  const handleSettingsClick = () => {
    setSettingsInitialTab("general");
    setSettingsDialogOpen(true);
  };

  const handleHelpClick = () => {
    // Navigate to help page or open help menu
    router.push("/help");
  };

  const handleUserInfoSave = (data: any) => {
    console.log("User info saved:", data);
    // TODO: Implement API call to save user info
  };

  return (
    <div className="p-4 border-t border-sidebar-border space-y-4">
      {/* User Profile Section */}
      <ProfileMenu
        trigger={
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
                    {userName}
                  </span>
                  <span className="text-xs text-muted-foreground truncate">
                    {me?.roles || "Free"}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUpgradePlan();
                  }}
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
        }
        userName={userName}
        userEmail={userEmail}
        onUserInfoClick={handleUserInfoClick}
        onUpgradePlanClick={handleUpgradePlan}
        onPersonalizationClick={handlePersonalizationClick}
        onModelPreferencesClick={handleModelPreferencesClick}
        onTeamsClick={handleTeamsClick}
        onSettingsClick={handleSettingsClick}
        onHelpClick={handleHelpClick}
        onLogoutClick={handleLogout}
      />

      {/* User Info Dialog */}
      <UserInfoDialog
        open={userInfoDialogOpen}
        onOpenChange={setUserInfoDialogOpen}
        userName={userName}
        userEmail={userEmail}
        onSave={handleUserInfoSave}
      />

      {/* Settings Dialog */}
      <SettingsDialog
        open={settingsDialogOpen}
        onOpenChange={setSettingsDialogOpen}
        initialTab={settingsInitialTab}
      />
    </div>
  );
}
