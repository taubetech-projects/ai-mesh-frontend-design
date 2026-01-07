"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Home,
  Key,
  Box,
  PlayCircle,
  FolderKanban,
  Users,
  Webhook,
  CreditCard,
  Wallet,
  Settings,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/features/platform/lib/utils";
import { PLATFORM_ROUTES } from "@/shared/constants/routingConstants";

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  children?: { title: string; href: string }[];
}

const navItems: NavItem[] = [
  { title: "Dashboard", href: PLATFORM_ROUTES.DASHBOARD, icon: Home },
  { title: "API Keys", href: PLATFORM_ROUTES.API_KEYS, icon: Key },
  { title: "Models", href: PLATFORM_ROUTES.MODELS, icon: Box },
  { title: "Playground", href: PLATFORM_ROUTES.PLAYGROUND, icon: PlayCircle },
  { title: "Projects", href: PLATFORM_ROUTES.PROJECTS, icon: FolderKanban },
  {
    title: "Team",
    href: "/platform/team",
    icon: Users,
    children: [
      { title: "Members", href: PLATFORM_ROUTES.TEAM_MEMBERS },
      { title: "Invites", href: "/platform/team/invites" },
    ],
  },
  { title: "Endpoints", href: PLATFORM_ROUTES.ENDPOINTS, icon: Webhook },
  {
    title: "Billing",
    href: PLATFORM_ROUTES.BILLING,
    icon: CreditCard,
    children: [
      { title: "Overview", href: PLATFORM_ROUTES.BILLING },
      { title: "Invoices", href: "/platform/billing/invoices" },
    ],
  },
  { title: "Wallet", href: PLATFORM_ROUTES.WALLET, icon: Wallet },
  { title: "Settings", href: PLATFORM_ROUTES.SETTINGS, icon: Settings },
];

export function PlatformSidebar() {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const isActive = (href: string) => {
    return pathname === href || pathname?.startsWith(href + "/");
  };

  const toggleExpand = (title: string) => {
    setExpandedItems((prev) =>
      prev.includes(title)
        ? prev.filter((item) => item !== title)
        : [...prev, title]
    );
  };

  const SidebarContent = () => (
    <>
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="text-xs text-muted-foreground uppercase tracking-wider">
            Team
          </div>
          <ChevronDown className="h-3 w-3 text-muted-foreground" />
        </div>
        <div className="font-medium text-foreground mt-1">Personal team</div>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto scrollbar-thin">
        {navItems.map((item) => (
          <div key={item.title}>
            {item.children ? (
              <>
                <button
                  onClick={() => toggleExpand(item.title)}
                  className={cn(
                    "flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground",
                    isActive(item.href)
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </div>
                  {expandedItems.includes(item.title) ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </button>
                {expandedItems.includes(item.title) && (
                  <div className="ml-7 mt-1 space-y-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={() => setIsMobileOpen(false)}
                        className={cn(
                          "flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground",
                          isActive(child.href)
                            ? "bg-muted text-foreground"
                            : "text-muted-foreground"
                        )}
                      >
                        {child.title}
                      </Link>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <Link
                href={item.href}
                onClick={() => setIsMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground",
                  isActive(item.href)
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.title}</span>
              </Link>
            )}
          </div>
        ))}
      </nav>
    </>
  );

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-background border border-border hover:bg-muted transition-colors"
      >
        {isMobileOpen ? (
          <X className="h-5 w-5 text-foreground" />
        ) : (
          <Menu className="h-5 w-5 text-foreground" />
        )}
      </button>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:sticky top-0 left-0 z-40 h-screen w-64 bg-background border-r border-border flex flex-col transition-transform duration-300",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <SidebarContent />
      </aside>
    </>
  );
}
