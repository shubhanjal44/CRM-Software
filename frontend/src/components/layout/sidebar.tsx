"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  LayoutDashboard, FlaskConical, Building2, FileText, GitMerge,
  Database, Users, ChevronLeft, ChevronRight, TrendingUp,
  UserCircle, Lock, LogOut, ChevronDown, Landmark, Briefcase,
  UsersRound, X, Menu
} from "lucide-react";
import api from "@/lib/api";
import { clearAuth, getUser } from "@/lib/auth";
import { toast } from "sonner";

const navItems = [
  { title: "Dashboard",           href: "/dashboard",         icon: LayoutDashboard },
  { title: "Research",            href: "/research",          icon: FlaskConical },
  { title: "Companies Portfolio", href: "/companies",         icon: Building2 },
  { title: "Policies",            href: "/policies",          icon: FileText },
  { title: "Pipeline",            href: "/pipeline",          icon: GitMerge },
  { title: "Data Centre",         href: "/data-centre",       icon: Database },
  {
    title: "CRM", icon: Users,
    children: [
      { title: "Investors Profile", href: "/crm/investors",     icon: Landmark },
      { title: "Talent Resources",  href: "/crm/talent",        icon: Briefcase },
      { title: "Intermediaries",    href: "/crm/intermediaries", icon: UsersRound },
      { title: "PE / VC",           href: "/crm/pe-vc",         icon: TrendingUp },
    ],
  },
];

const bottomItems = [
  { title: "Profile",         href: "/profile",          icon: UserCircle },
  { title: "Change Password", href: "/change-password",  icon: Lock },
];

interface SidebarContentProps {
  collapsed: boolean;
  setCollapsed?: (v: boolean) => void;
  onClose?: () => void;
}

function SidebarContent({ collapsed, setCollapsed, onClose }: SidebarContentProps) {
  const pathname = usePathname();
  const router   = useRouter();
  const user     = getUser();
  const [crmOpen, setCrmOpen] = useState(true);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout", {});
    } catch {}
    clearAuth();
    toast.success("Logged out successfully");
    router.push("/login");
  };

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={cn("flex items-center gap-3 p-4 h-16 border-b border-border", collapsed && "justify-center")}>
        <div className="flex-shrink-0 w-8 h-8 rounded-lg gradient-bg flex items-center justify-center shadow-lg shadow-purple-500/30">
          <TrendingUp className="w-4 h-4 text-white" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden flex-1">
            <p className="font-bold text-sm gradient-text tracking-wide">guardianx</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest">CRM Platform</p>
          </div>
        )}
        {onClose && (
          <button onClick={onClose} className="ml-auto p-1 rounded-lg hover:bg-accent transition-colors">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 py-3">
        <nav className="px-2 space-y-0.5">
          {navItems.map((item) => {
            if (item.children) {
              return (
                <div key={item.title}>
                  <button
                    onClick={() => !collapsed && setCrmOpen && setCrmOpen(!crmOpen)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                      "text-muted-foreground hover:text-foreground hover:bg-accent",
                      item.children.some(c => isActive(c.href)) && "text-foreground",
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
                          onClick={onClose}
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
                onClick={onClose}
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
        {/* User info */}
        {!collapsed && user && (
          <div className="px-3 py-2 mb-1 rounded-lg bg-muted/50">
            <p className="text-xs font-semibold truncate">{user.name}</p>
            <p className="text-[10px] text-muted-foreground truncate">{user.email}</p>
          </div>
        )}
        {bottomItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClose}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200",
              "text-muted-foreground hover:text-foreground hover:bg-accent",
              collapsed && "justify-center"
            )}
            title={collapsed ? item.title : undefined}
          >
            <item.icon className="w-4 h-4 flex-shrink-0" />
            {!collapsed && <span>{item.title}</span>}
          </Link>
        ))}
        <button
          onClick={handleLogout}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200",
            "text-destructive hover:bg-destructive/10",
            collapsed && "justify-center"
          )}
          title={collapsed ? "Logout" : undefined}
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
}

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile menu on route change
  const pathname = usePathname();
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  return (
    <>
      {/* Mobile hamburger button — shown in header area */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-card border border-border shadow-md"
        onClick={() => setMobileOpen(true)}
        id="mobile-menu-btn"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={cn(
          "lg:hidden fixed inset-y-0 left-0 z-50 w-72 bg-card border-r border-border transition-transform duration-300",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <SidebarContent collapsed={false} onClose={() => setMobileOpen(false)} />
      </aside>

      {/* Desktop sidebar */}
      <aside
        className={cn(
          "hidden lg:flex flex-col h-screen border-r border-border bg-card transition-all duration-300 ease-in-out flex-shrink-0",
          collapsed ? "w-16" : "w-64"
        )}
      >
        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-[72px] z-10 w-6 h-6 rounded-full border border-border bg-card shadow-md flex items-center justify-center hover:bg-accent transition-colors"
        >
          {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
        </button>
        <SidebarContent collapsed={collapsed} setCollapsed={setCollapsed} />
      </aside>
    </>
  );
}
