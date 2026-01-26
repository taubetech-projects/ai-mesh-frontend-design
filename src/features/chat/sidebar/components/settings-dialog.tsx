"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Label } from "@/shared/components/ui/label";
import { Switch } from "@/shared/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { X, Settings, Bell, User, Grid3x3, Database, Shield, Users, UserCircle, Star, UsersRound, Coins } from "lucide-react";
import { cn } from "@/lib/utils/utils";
import { ModelPreferences } from "../../settings/model-preferences/components/ModelPreferences";
import { TeamManagement } from "../../teams/components/TeamManagement";
import { useTeamPermissions } from "../../teams/hooks/use-team-permissions";
import { TokenSharingDashboard } from "../../token-sharing/components/TokenSharingDashboard";
import { useTokenSharingPermission } from "../../token-sharing/hooks/use-token-sharing-permission";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialTab?: SettingsTab;
}

export type SettingsTab =
  | "general"
  | "notifications"
  | "personalization"
  | "model-preferences"
  | "teams"
  | "token-sharing"
  | "apps"
  | "data-controls"
  | "security"
  | "parental-controls"
  | "account";

const allTabs = [
  { id: "general" as const, label: "General", icon: Settings, requiresPermission: false },
  { id: "notifications" as const, label: "Notifications", icon: Bell, requiresPermission: false },
  { id: "personalization" as const, label: "Personalization", icon: User, requiresPermission: false },
  { id: "model-preferences" as const, label: "Model Preferences", icon: Star, requiresPermission: false },
  { id: "teams" as const, label: "Teams", icon: UsersRound, requiresPermission: true },
  { id: "token-sharing" as const, label: "Token Sharing", icon: Coins, requiresPermission: true },
  { id: "apps" as const, label: "Apps", icon: Grid3x3, requiresPermission: false },
  { id: "data-controls" as const, label: "Data controls", icon: Database, requiresPermission: false },
  { id: "security" as const, label: "Security", icon: Shield, requiresPermission: false },
  { id: "parental-controls" as const, label: "Parental controls", icon: Users, requiresPermission: false },
  { id: "account" as const, label: "Account", icon: UserCircle, requiresPermission: false },
];

export function SettingsDialog({
  open,
  onOpenChange,
  initialTab = "general",
}: SettingsDialogProps) {
  const { canViewTeams } = useTeamPermissions();
  const { canRead: canViewTokenSharing } = useTokenSharingPermission();
  const [activeTab, setActiveTab] = useState<SettingsTab>(initialTab);
  const [appearance, setAppearance] = useState("system");
  const [accentColor, setAccentColor] = useState("default");
  const [language, setLanguage] = useState("auto-detect");
  const [spokenLanguage, setSpokenLanguage] = useState("auto-detect");
  const [voice, setVoice] = useState("cove");
  const [separateVoice, setSeparateVoice] = useState(false);

  console.log("Token Sharing Permission", canViewTokenSharing);

  // Filter tabs based on permissions
  const tabs = allTabs.filter(tab => {
    if (tab.id === "teams") return canViewTeams;
    if (tab.id === "token-sharing") return canViewTokenSharing;
    return true;
  });

  // Update active tab when initialTab or open changes
  useEffect(() => {
    if (open) {
      setActiveTab(initialTab);
    }
  }, [open, initialTab]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="w-[55vw] min-w-[500px] max-w-6xl min-h-[600px] max-h-[85vh] p-0 gap-0 bg-background border-border overflow-hidden flex flex-col"
        aria-describedby="settings-description"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-border flex flex-row items-center justify-between">
          <h2 id="settings-title" className="text-xl font-semibold">
            {tabs.find((t) => t.id === activeTab)?.label}
          </h2>
        </div>
        <p id="settings-description" className="sr-only">
          Configure your application settings across different categories
        </p>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar Navigation */}
          <div className="w-56 border-r border-border bg-sidebar p-3 overflow-y-auto">
            <nav className="space-y-1" aria-label="Settings navigation" role="navigation">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    aria-label={`${tab.label} settings`}
                    aria-current={activeTab === tab.id ? "page" : undefined}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors",
                      activeTab === tab.id
                        ? "bg-sidebar-accent text-sidebar-foreground font-medium"
                        : "text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-6 min-h-0">
            {activeTab === "teams" && <TeamManagement />}
            {activeTab === "token-sharing" && <TokenSharingDashboard />}
            {activeTab === "general" && <GeneralSettings 
              appearance={appearance}
              setAppearance={setAppearance}
              accentColor={accentColor}
              setAccentColor={setAccentColor}
              language={language}
              setLanguage={setLanguage}
              spokenLanguage={spokenLanguage}
              setSpokenLanguage={setSpokenLanguage}
              voice={voice}
              setVoice={setVoice}
              separateVoice={separateVoice}
              setSeparateVoice={setSeparateVoice}
            />}
            {activeTab === "notifications" && <NotificationsSettings />}
            {activeTab === "personalization" && <PersonalizationSettings />}
            {activeTab === "model-preferences" && <ModelPreferences />}
            {activeTab === "apps" && <AppsSettings />}
            {activeTab === "data-controls" && <DataControlsSettings />}
            {activeTab === "security" && <SecuritySettings />}
            {activeTab === "parental-controls" && <ParentalControlsSettings />}
            {activeTab === "account" && <AccountSettings />}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// General Tab Component
function GeneralSettings({
  appearance,
  setAppearance,
  accentColor,
  setAccentColor,
  language,
  setLanguage,
  spokenLanguage,
  setSpokenLanguage,
  voice,
  setVoice,
  separateVoice,
  setSeparateVoice,
}: any) {
  return (
    <div className="space-y-6 max-w-2xl">
      {/* Appearance */}
      <div className="flex items-center justify-between">
        <Label htmlFor="appearance-select" className="text-base font-normal">
          Appearance
        </Label>
        <Select value={appearance} onValueChange={setAppearance}>
          <SelectTrigger id="appearance-select" className="w-[180px]" aria-label="Select appearance theme">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="system">System</SelectItem>
            <SelectItem value="light">Light</SelectItem>
            <SelectItem value="dark">Dark</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Accent Color */}
      <div className="flex items-center justify-between">
        <Label htmlFor="accent-color-select" className="text-base font-normal">
          Accent color
        </Label>
        <Select value={accentColor} onValueChange={setAccentColor}>
          <SelectTrigger id="accent-color-select" className="w-[180px]" aria-label="Select accent color">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-gray-500" />
                Default
              </div>
            </SelectItem>
            <SelectItem value="blue">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-blue-500" />
                Blue
              </div>
            </SelectItem>
            <SelectItem value="purple">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-purple-500" />
                Purple
              </div>
            </SelectItem>
            <SelectItem value="green">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-green-500" />
                Green
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Language */}
      <div className="flex items-center justify-between">
        <Label htmlFor="language-select" className="text-base font-normal">
          Language
        </Label>
        <Select value={language} onValueChange={setLanguage}>
          <SelectTrigger id="language-select" className="w-[180px]" aria-label="Select interface language">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="auto-detect">Auto-detect</SelectItem>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="es">Spanish</SelectItem>
            <SelectItem value="fr">French</SelectItem>
            <SelectItem value="de">German</SelectItem>
            <SelectItem value="zh">Chinese</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Spoken Language */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="spoken-language-select" className="text-base font-normal">
            Spoken language
          </Label>
          <Select value={spokenLanguage} onValueChange={setSpokenLanguage}>
            <SelectTrigger id="spoken-language-select" className="w-[180px]" aria-label="Select spoken language for voice interactions">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="auto-detect">Auto-detect</SelectItem>
              <SelectItem value="en-us">English (US)</SelectItem>
              <SelectItem value="en-gb">English (UK)</SelectItem>
              <SelectItem value="es">Spanish</SelectItem>
              <SelectItem value="fr">French</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <p className="text-xs text-muted-foreground">
          For best results, select the language you mainly speak. If it's not listed, it may
          still be supported via auto-detection.
        </p>
      </div>

      {/* Voice */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="voice-select" className="text-base font-normal">
            Voice
          </Label>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" aria-label="Play voice sample">
              ▶ Play
            </Button>
            <Select value={voice} onValueChange={setVoice}>
              <SelectTrigger id="voice-select" className="w-[120px]" aria-label="Select voice option">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cove">Cove</SelectItem>
                <SelectItem value="breeze">Breeze</SelectItem>
                <SelectItem value="ember">Ember</SelectItem>
                <SelectItem value="juniper">Juniper</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Separate Voice Toggle */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div className="space-y-1">
            <Label htmlFor="separate-voice" className="text-base font-normal">
              Separate Voice
            </Label>
            <p className="text-xs text-muted-foreground max-w-md">
              Keep ChatGPT Voice in a separate full screen, without real time transcripts and
              visuals.
            </p>
          </div>
          <Switch
            id="separate-voice"
            checked={separateVoice}
            onCheckedChange={setSeparateVoice}
          />
        </div>
      </div>
    </div>
  );
}

// Placeholder Components for other tabs
function NotificationsSettings() {
  return (
    <div className="space-y-4">
      <p className="text-muted-foreground">
        Configure your notification preferences here.
      </p>
    </div>
  );
}

function PersonalizationSettings() {
  return (
    <div className="space-y-4">
      <p className="text-muted-foreground">
        Customize your AI experience and preferences.
      </p>
    </div>
  );
}

function AppsSettings() {
  return (
    <div className="space-y-4">
      <p className="text-muted-foreground">Manage connected applications and integrations.</p>
    </div>
  );
}

function DataControlsSettings() {
  return (
    <div className="space-y-4">
      <p className="text-muted-foreground">
        Control how your data is used and stored.
      </p>
    </div>
  );
}

function SecuritySettings() {
  return (
    <div className="space-y-4">
      <p className="text-muted-foreground">
        Manage your security settings and privacy options.
      </p>
    </div>
  );
}

function ParentalControlsSettings() {
  return (
    <div className="space-y-4">
      <p className="text-muted-foreground">Set up parental controls and content filters.</p>
    </div>
  );
}

function AccountSettings() {
  return (
    <div className="space-y-4">
      <p className="text-muted-foreground">
        Manage your account settings and preferences.
      </p>
    </div>
  );
}
