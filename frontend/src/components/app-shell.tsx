import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { ReactNode, useEffect, useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Truck,
  Users,
  Radio,
  Wrench,
  Receipt,
  UserCircle,
  LogOut,
  Bell,
  Moon,
  Sun,
} from "lucide-react";

import { useMyRoles, useProfile, hasRole } from "@/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { useQuery, useQueryClient } from "@tanstack/react-query";

type NavItem = { title: string; url: string; icon: any; roles?: string[] };

const NAV: NavItem[] = [
  { title: "Dashboard", url: "/app/dashboard", icon: LayoutDashboard },
  { title: "Dispatch", url: "/app/dispatch", icon: Radio },
  { title: "Vehicles", url: "/app/vehicles", icon: Truck },
  { title: "Drivers", url: "/app/drivers", icon: Users },
  { title: "Maintenance", url: "/app/maintenance", icon: Wrench },
  { title: "Expenses", url: "/app/expenses", icon: Receipt },
  { title: "My Trips", url: "/app/my-trips", icon: UserCircle, roles: ["driver"] },
];

function InnerSidebar() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const { data: roles } = useMyRoles();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  const items = NAV.filter((n) => {
    if (!n.roles) return true;
    return n.roles.some((r) => hasRole(roles, r as any));
  });

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-2">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground">
            <Truck className="h-5 w-5" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <div className="truncate font-display text-sm font-bold">TransitOps</div>
              <div className="text-[10px] text-muted-foreground">Command Center</div>
            </div>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Operations</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const active = path === item.url || path.startsWith(item.url + "/");
                return (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton asChild isActive={active} tooltip={item.title}>
                      <Link to={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="px-2 py-2 text-[10px] text-muted-foreground">v1.0 · TransitOps ERP</div>
      </SidebarFooter>
    </Sidebar>
  );
}

function useAlertCount() {
  return useQuery({
    queryKey: ["alerts-count"],
    queryFn: async () => {
      // Mock alert count for UI prototype
      return 2;
    },
    refetchInterval: 60000,
  });
}

function TopBar({
  theme,
  setTheme,
}: {
  theme: "dark" | "light";
  setTheme: (theme: "dark" | "light") => void;
}) {
  const navigate = useNavigate();
  const { data: profile } = useProfile();
  const { data: roles } = useMyRoles();
  const qc = useQueryClient();
  const { data: alerts = 0 } = useAlertCount();

  const signOut = async () => {
    await qc.cancelQueries();
    qc.clear();
    // Mock sign out delay
    await new Promise((r) => setTimeout(r, 400));
    toast.success("Signed out");
    navigate({ to: "/auth", replace: true });
  };

  const initials = (profile?.full_name || "U")
    .split(" ")
    .map((s: string) => s[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const roleLabel = roles?.[0]?.replace(/^\w/, (c) => c.toUpperCase()) ?? "User";

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur">
      <SidebarTrigger />
      <div className="min-w-0 flex-1" />
      <Button
        variant="ghost"
        size="icon"
        className="relative"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      >
        {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </Button>
      <Button variant="ghost" size="icon" className="relative">
        <Bell className="h-4 w-4" />
        {alerts > 0 && (
          <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-destructive px-1 text-[9px] font-bold text-destructive-foreground">
            {alerts}
          </span>
        )}
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2 rounded-md p-1 hover:bg-accent/20">
            <Avatar className="h-8 w-8">
              {profile?.avatar_url && <AvatarImage src={profile.avatar_url} />}
              <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="hidden text-left sm:block">
              <div className="text-xs font-semibold leading-tight">
                {profile?.full_name ?? "User"}
              </div>
              <Badge variant="outline" className="h-4 px-1 text-[9px] uppercase">
                {roleLabel}
              </Badge>
            </div>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="text-xs text-muted-foreground">
            Signed in as
          </DropdownMenuLabel>
          <DropdownMenuLabel className="pt-0 text-sm">
            {profile?.full_name ?? "User"}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            {theme === "dark" ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}
            {theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={signOut} className="text-destructive">
            <LogOut className="mr-2 h-4 w-4" />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const storedTheme = window.localStorage.getItem("transitops-theme") as "dark" | "light" | null;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialTheme = storedTheme ?? (prefersDark ? "dark" : "light");
    setTheme(initialTheme);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    root.style.colorScheme = theme;
    window.localStorage.setItem("transitops-theme", theme);
  }, [theme]);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <InnerSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <TopBar theme={theme} setTheme={setTheme} />
          <main className="min-w-0 flex-1">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
