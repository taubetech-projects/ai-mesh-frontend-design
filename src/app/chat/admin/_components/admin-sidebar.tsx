"use client";

import {
  Banknote,
  Bot,
  CreditCard,
  LayoutDashboard,
  Lock,
  Settings,
  ShieldCheck,
  Users,
  VenetianMask,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/shared/components/ui/sidebar";

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/chat/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Models",
    url: "/chat/admin/models",
    icon: Bot,
  },
  {
    title: "Plan Billing",
    url: "/chat/admin/plan-billing-options",
    icon: CreditCard,
  },
  {
    title: "Pricing Plans",
    url: "/chat/admin/pricing-plans",
    icon: Banknote,
  },
  {
    title: "RBAC",
    url: "/chat/admin/rbac",
    icon: ShieldCheck,
  },
  {
    title: "Teams",
    url: "/chat/admin/teams",
    icon: Users,
  },
  {
    title: "Tokens",
    url: "/chat/admin/tokens",
    icon: Lock,
  },
  {
    title: "Users",
    url: "/chat/admin/users",
    icon: VenetianMask,
  },
  {
    title: "Settings",
    url: "/chat/admin/settings",
    icon: Settings,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-1">
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Lock className="size-4" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">Admin Panel</span>
              <span className="truncate text-xs">Management</span>
            </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    tooltip={item.title}
                  >
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
