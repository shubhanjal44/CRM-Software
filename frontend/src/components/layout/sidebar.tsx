"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  LayoutDashboard, FlaskConical, Building2, FileText, GitMerge,
  Database, Users, ChevronLeft, ChevronRight, TrendingUp,
  UserCircle, Lock, LogOut, ChevronDown, Landmark, Briefcase, UsersRound
} from "lucide-react";

const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Research",
    href: "/research",
    icon: FlaskConical,
  },
  {
    title: "Companies Portfolio",
    href: "/companies",
    icon: Building2,
  },
  {
    title: "Policies",
    href: "/policies",
    icon: FileText,
  },
  {
    title: "Pipeline",
    href: "/pipeline",
    icon: GitMerge,
  },
  {
    title: "Data Centre",
    href: "/data-centre",
    icon: Database,
  },
  {
    title: "CRM",
    icon: Users,
    children: [
      { title: "Investors Profile", href: "/crm/investors", icon: Landmark },
      { title: "Talent Resources", href: "/crm/talent", icon: Briefcase },
      { title: "Intermediaries", href: "/crm/intermediaries", icon: UsersRound },
      { title: "PE / VC", href: "/crm/pe-vc", icon: TrendingUp },
    ],
  },
];

const bottomItems = [
  { title: "Profile", href: "/profile", icon: UserCircle },
  { title: "Change Password", href: "/change-password", icon: Lock },
  { title: "Logout", href: "/logout", icon: LogOut },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [crmOpen, setCrmOpen] = useState(true);
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <aside
      className={cn(
        "relative flex flex-col h-screen border-r border-border bg-card transition-all duration-300 ease-in-out",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className={cn("flex items-center gap-3 p-4 h-16 border-b border-border", collapsed && "justify-center")}>
        <div className="flex-shrink-0 w-8 h-8 rounded-lg gradient-bg flex items-center justify-center shadow-lg shadow-purple-500/30">
          <TrendingUp className="w-4 h-4 text-white" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <p className="font-bold text-sm gradient-text tracking-wide">TEJ India</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest">CRM Platform</p>
          </div>
        )}
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-[72px] z-10 w-6 h-6 rounded-full border border-border bg-card shadow-md flex items-center justify-center hover:bg-accent transition-colors"
      >
        {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
      </button>

      {/* Navigation */}
      <ScrollArea className="flex-1 py-3">
        <nav className="px-2 space-y-0.5">
          {navItems.map((item) => {
            if (item.children) {
              return (
                <div key={item.title}>
                  <button
                    onClick={() => !collapsed && setCrmOpen(!crmOpen)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                      "text-muted-foreground hover:text-foreground hover:bg-accent",
                      (item.children.some(c => isActive(c.href))) && "text-foreground",
                      collapsed && "justify-center"
                    )}
                  >
                    <item.icon className={cn("w-4 h-4 flex-shrink-0", item.children.some(c => isActive(c.href)) && "text-primary")} />
                    {!collapsed && (
                      <>
                        <span className="flex-1 text-left">{item.title}</span>
                        <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", crmOpen && "rotate-180")} />
                      </>
                    )}
                  </button>
                  {!collapsed && crmOpen && (
                    <div className="ml-4 mt-0.5 space-y-0.5 border-l border-border pl-3">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={cn(
                            "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all duration-200",
                            isActive(child.href)
                              ? "bg-primary/10 text-primary font-medium"
                              : "text-muted-foreground hover:text-foreground hover:bg-accent"
                          )}
                        >
                          <child.icon className="w-3.5 h-3.5 flex-shrink-0" />
                          <span>{child.title}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href!}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive(item.href!)
                    ? "bg-primary/10 text-primary shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent",
                  collapsed && "justify-center"
                )}
                title={collapsed ? item.title : undefined}
              >
                <item.icon className={cn("w-4 h-4 flex-shrink-0", isActive(item.href!) && "text-primary")} />
                {!collapsed && <span>{item.title}</span>}
                {!collapsed && isActive(item.href!) && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full gradient-bg" />
                )}
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      {/* Bottom items */}
      <div className="p-2 border-t border-border space-y-0.5">
        {bottomItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200",
              item.title === "Logout"
                ? "text-destructive hover:bg-destructive/10"
                : "text-muted-foreground hover:text-foreground hover:bg-accent",
              collapsed && "justify-center"
            )}
            title={collapsed ? item.title : undefined}
          >
            <item.icon className="w-4 h-4 flex-shrink-0" />
            {!collapsed && <span>{item.title}</span>}
          </Link>
        ))}
      </div>
    </aside>
  );
}
