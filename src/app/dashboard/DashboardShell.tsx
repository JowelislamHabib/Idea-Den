"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Lightbulb, PenTool, LogOut, ExternalLink, Compass, Crown, Sparkles } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/ThemeToggle";
import { authClient } from "@/lib/auth-client";

export function DashboardShell({ user, children }: { user: any; children: React.ReactNode }) {
  const pathname = usePathname();

  const isAdmin = user.role === "admin";

  const adminNavItems = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard, exact: true },
    { name: "Users", href: "/dashboard/users", icon: Users },
    { name: "Ideas", href: "/dashboard/ideas", icon: Lightbulb },
    { name: "Blogs", href: "/dashboard/blogs", icon: PenTool },
  ];

  const userNavItems = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard, exact: true },
    { name: "My Ideas", href: "/dashboard/ideas", icon: Lightbulb },
    { name: "My Blogs", href: "/dashboard/blogs", icon: PenTool },
    { name: "Subscription", href: "/dashboard/subscription", icon: Crown },
  ];

  const navItems = isAdmin ? adminNavItems : userNavItems;

  const current = navItems.find((item) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href)
  );

  const handleLogout = async () => {
    await authClient.signOut();
    window.location.href = "/";
  };

  const initials = (user.name || "U")
    .split(" ")
    .map((n: string) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <TooltipProvider>
      <SidebarProvider defaultOpen>
        <Sidebar collapsible="icon" className="border-r">
          <SidebarHeader>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  size="lg"
                  render={
                    <Link href="/dashboard" className="gap-2.5" />
                  }
                >
                  <div className="relative flex aspect-square size-8 shrink-0 items-center justify-center overflow-hidden rounded-xl ring-1 ring-border bg-background">
                    <Image
                      src="/ideaden-favicon.png"
                      alt="IdeaDen"
                      width={24}
                      height={24}
                      className="size-6 object-contain"
                    />
                  </div>
                  <div className="flex flex-col leading-tight">
                    <span className="font-heading text-base font-bold tracking-tight">
                      IdeaDen
                    </span>
                    <span className="text-xs font-medium text-muted-foreground">
                      {isAdmin ? "Dashboard" : "Dashboard"}
                    </span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>{isAdmin ? "Management" : "Menu"}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navItems.map((item) => {
                    const isActive = item.exact
                      ? pathname === item.href
                      : pathname.startsWith(item.href);
                    return (
                      <SidebarMenuItem key={item.href}>
                        <SidebarMenuButton
                          isActive={isActive}
                          tooltip={item.name}
                          render={<Link href={item.href} />}
                        >
                          <item.icon />
                          <span>{item.name}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarSeparator />

            <SidebarGroup>
              <SidebarGroupLabel className="flex items-center gap-1.5 text-violet-500 dark:text-violet-400">
                <Sparkles size={14} />
                Generate
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      tooltip="Generate Project Idea"
                      render={<Link href="/generate/ideas" />}
                    >
                      <Lightbulb />
                      <span>Project Idea</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      tooltip="Generate Blog Article"
                      render={<Link href="/generate/blogs" />}
                    >
                      <PenTool />
                      <span>Blog Article</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarSeparator />

            <SidebarGroup>
              <SidebarGroupLabel>Discover</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      tooltip="Visit public site"
                      render={<Link href="/" />}
                    >
                      <Compass />
                      <span>Public Site</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      tooltip="Browse ideas"
                      render={<Link href="/explore/ideas" />}
                    >
                      <ExternalLink />
                      <span>Explore Ideas</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="Sign out"
                  className="text-destructive hover:text-destructive"
                  onClick={handleLogout}
                >
                  <LogOut />
                  <span>Sign out</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  size="lg"
                  className="gap-3 data-[active=true]:bg-transparent"
                >
                  <Avatar className="size-8 ring-1 ring-border">
                    <AvatarImage src={user.image || undefined} alt={user.name || "User"} />
                    <AvatarFallback className="bg-muted text-xs font-bold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex min-w-0 flex-col leading-tight">
                    <div className="flex items-center gap-1.5">
                      <span className="truncate text-sm font-semibold">{user.name}</span>
                      {user.role === "pro" && (
                        <span className="inline-flex shrink-0 items-center gap-0.5 rounded-full bg-amber-500/10 px-1.5 py-0.5 text-[9px] font-bold uppercase text-amber-600 dark:text-amber-400">
                          <Crown className="size-2.5" />
                          Pro
                        </span>
                      )}
                      {user.role === "admin" && (
                        <span className="inline-flex shrink-0 items-center rounded-full bg-red-500/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-widest text-red-600 dark:text-red-400">
                          Admin
                        </span>
                      )}
                    </div>
                    <span className="truncate text-xs text-muted-foreground">
                      {user.email}
                    </span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
          <SidebarRail />
        </Sidebar>

        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4">
            <Tooltip>
              <TooltipTrigger render={<SidebarTrigger className="-ml-1" />} />
              <TooltipContent side="right">Toggle sidebar</TooltipContent>
            </Tooltip>
            <Separator orientation="vertical" className="mr-2 h-4" />
            <div className="flex items-center gap-1.5 text-sm">
              <span className="font-medium text-muted-foreground">{isAdmin ? "Admin" : "User"}</span>
              <span className="text-muted-foreground">/</span>
              <span className="font-semibold">{current?.name || "Overview"}</span>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <ThemeToggle />
            </div>
          </header>
          <div className="flex-1 p-4 sm:p-6 lg:p-8">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
