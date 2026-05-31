"use client";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Bell, Search, Sun, Moon, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const breadcrumbMap: Record<string, string[]> = {
  "/dashboard": ["Dashboard"],
  "/research": ["Research"],
  "/companies": ["Companies Portfolio"],
  "/policies": ["Policies"],
  "/pipeline": ["Pipeline"],
  "/data-centre": ["Data Centre"],
  "/crm/investors": ["CRM", "Investors Profile"],
  "/crm/talent": ["CRM", "Talent Resources"],
  "/crm/intermediaries": ["CRM", "Intermediaries"],
  "/crm/pe-vc": ["CRM", "PE / VC"],
  "/profile": ["Profile"],
  "/change-password": ["Change Password"],
};

export function Header() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const breadcrumb = breadcrumbMap[pathname] || ["Dashboard"];

  return (
    <header className="h-16 border-b border-border bg-card/80 backdrop-blur-xl flex items-center gap-4 px-6 sticky top-0 z-30">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-sm flex-1">
        {breadcrumb.map((item, idx) => (
          <span key={item} className="flex items-center gap-1.5">
            {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />}
            <span className={idx === breadcrumb.length - 1 ? "text-foreground font-medium" : "text-muted-foreground"}>
              {item}
            </span>
          </span>
        ))}
      </div>

      {/* Global search */}
      <div className="relative hidden md:flex items-center w-64">
        <Search className="absolute left-3 w-3.5 h-3.5 text-muted-foreground" />
        <Input
          id="global-search"
          placeholder="Search everything..."
          className="pl-9 h-8 text-xs bg-muted border-transparent focus-visible:ring-1"
        />
      </div>

      {/* Notifications */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="relative" id="notifications-btn">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full gradient-bg pulse-dot" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80">
          <DropdownMenuLabel className="flex items-center justify-between">
            Notifications
            <Badge variant="purple" className="text-[10px]">3 new</Badge>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {[
            { title: "Follow-up due: ABC Capital", time: "5 min ago", color: "text-amber-500" },
            { title: "New investor added: John Doe", time: "1 hr ago", color: "text-emerald-500" },
            { title: "Meeting scheduled: XYZ Ltd", time: "2 hrs ago", color: "text-blue-500" },
          ].map((n) => (
            <DropdownMenuItem key={n.title} className="flex flex-col items-start py-2.5 cursor-pointer">
              <div className="flex items-center gap-2 w-full">
                <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${n.color} bg-current`} />
                <span className="text-xs font-medium flex-1">{n.title}</span>
              </div>
              <span className="text-[10px] text-muted-foreground ml-3.5">{n.time}</span>
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-xs text-center text-primary justify-center cursor-pointer">
            View all notifications
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Theme toggle */}
      <Button
        variant="ghost"
        size="icon"
        id="theme-toggle"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      >
        <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span className="sr-only">Toggle theme</span>
      </Button>

      {/* User avatar */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="gap-2 h-9 px-2" id="user-menu">
            <Avatar className="w-7 h-7">
              <AvatarFallback className="text-xs">SA</AvatarFallback>
            </Avatar>
            <div className="hidden md:block text-left">
              <p className="text-xs font-medium leading-none">Super Admin</p>
              <p className="text-[10px] text-muted-foreground">admin@tejindia.com</p>
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Change Password</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-destructive">Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
