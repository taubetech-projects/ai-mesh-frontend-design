import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
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
import { cn } from "@/lib/utils";

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  children?: { title: string; href: string }[];
}

const navItems: NavItem[] = [
  { title: "Dashboard", href: "/dashboard", icon: Home },
  { title: "API Keys", href: "/api-keys", icon: Key },
  { title: "Models", href: "/models", icon: Box },
  { title: "Playground", href: "/playground", icon: PlayCircle },
  { title: "Projects", href: "/projects", icon: FolderKanban },
  { 
    title: "Team", 
    href: "/team", 
    icon: Users,
    children: [
      { title: "Members", href: "/team/members" },
      { title: "Invites", href: "/team/invites" },
    ]
  },
  { title: "Endpoints", href: "/endpoints", icon: Webhook },
  { 
    title: "Billing", 
    href: "/billing", 
    icon: CreditCard,
    children: [
      { title: "Overview", href: "/billing" },
      { title: "Invoices", href: "/billing/invoices" },
    ]
  },
  { title: "Wallet", href: "/wallet", icon: Wallet },
  { title: "Settings", href: "/settings", icon: Settings },
];

export function AppSidebar() {
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const isActive = (href: string) => {
    return location.pathname === href || location.pathname.startsWith(href + "/");
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
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <div className="text-xs text-muted-foreground uppercase tracking-wider">Team</div>
          <ChevronDown className="h-3 w-3 text-muted-foreground" />
        </div>
        <div className="font-medium text-sidebar-accent-foreground mt-1">Personal team</div>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto scrollbar-thin">
        {navItems.map((item) => (
          <div key={item.title}>
            {item.children ? (
              <>
                <button
                  onClick={() => toggleExpand(item.title)}
                  className={cn(
                    "sidebar-item w-full justify-between",
                    isActive(item.href) && "active"
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
                        to={child.href}
                        onClick={() => setIsMobileOpen(false)}
                        className={cn(
                          "sidebar-item text-sm",
                          isActive(child.href) && "active"
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
                to={item.href}
                onClick={() => setIsMobileOpen(false)}
                className={cn(
                  "sidebar-item",
                  isActive(item.href) && "active"
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
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-sidebar hover:bg-sidebar-accent transition-colors"
      >
        {isMobileOpen ? (
          <X className="h-5 w-5 text-sidebar-foreground" />
        ) : (
          <Menu className="h-5 w-5 text-sidebar-foreground" />
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
          "fixed lg:sticky top-0 left-0 z-40 h-screen w-64 bg-sidebar border-r border-sidebar-border flex flex-col transition-transform duration-300",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <SidebarContent />
      </aside>
    </>
  );
}
