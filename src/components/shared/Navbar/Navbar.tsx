"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";
import {
  LogOut,
  Menu,
  X,
  User,
  Plus,
  FileText,
  LayoutDashboard,
  BarChart3,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient, useSession } from "@/lib/auth-client";
import Image from "next/image";
import { ThemeToggle } from "@/components/ThemeToggle";

const publicLinks = [
  { label: "Home", href: "/" },
  { label: "Explore", href: "/explore" },
  { label: "About", href: "/about" },
];

const protectedLinks = [
  { label: "Generate", href: "/ideas/generate" },
  { label: "Dashboard", href: "/dashboard" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPath = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;
  const isAuthPage = pathname === "/login" || pathname === "/register";
  const callbackQuery = isAuthPage
    ? ""
    : `?redirect=${encodeURIComponent(currentPath)}`;
  const { data: session, isPending } = useSession();
  const user = session?.user;

  const handleLogout = async () => {
    await authClient.signOut();
  };

  const navLinks = user
    ? [...publicLinks, ...protectedLinks]
    : publicLinks;

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 font-bold text-lg tracking-tight"
          >
            <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/70 text-primary-foreground text-sm font-black shadow-sm">
              ID
            </div>
            <span className="hidden sm:block">IdeaDen</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            {isPending ? (
              <div className="w-20 h-9 rounded-lg bg-muted animate-pulse" />
            ) : user ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/ideas/generate"
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/90 transition-colors"
                >
                  <Plus className="size-4" />
                  New Idea
                </Link>
                <Link
                  href="/blogs/generate"
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1.5 text-sm font-semibold text-primary hover:bg-primary/20 transition-colors"
                >
                  <Plus className="size-4" />
                  New Blog
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center gap-2 rounded-lg border border-border/60 px-3 py-2 text-sm font-medium hover:bg-muted transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring">
                    {user.image ? (
                      <Image
                        src={user.image}
                        alt={user.name || ""}
                        width={24}
                        height={24}
                        className="size-6 rounded-full object-cover"
                      />
                    ) : (
                      <div className="size-6 rounded-full bg-primary/10 flex items-center justify-center">
                        <User size={14} className="text-primary" />
                      </div>
                    )}
                    <span className="hidden lg:inline max-w-[120px] truncate">
                      {user.name}
                    </span>
                    <ChevronDown size={14} className="text-muted-foreground" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" sideOffset={8} className="w-52">
                    <DropdownMenuGroup>
                      <DropdownMenuLabel className="font-normal p-3">
                        <div className="text-sm font-semibold">{user.name}</div>
                        <div className="text-xs text-muted-foreground truncate">
                          {user.email}
                        </div>
                      </DropdownMenuLabel>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem className="cursor-pointer">
                        <Link href="/dashboard/ideas" className="flex items-center w-full">
                          <FileText size={16} className="mr-2.5 text-muted-foreground" />
                          My Ideas
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer">
                        <Link href="/dashboard" className="flex items-center w-full">
                          <BarChart3 size={16} className="mr-2.5 text-muted-foreground" />
                          Dashboard
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer">
                        <Link href="/profile" className="flex items-center w-full">
                          <LayoutDashboard size={16} className="mr-2.5 text-muted-foreground" />
                          Profile
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="cursor-pointer text-destructive focus:text-destructive"
                    >
                      <LogOut size={16} className="mr-2.5" />
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="rounded-lg font-semibold">
                  <Link href={`/login${callbackQuery}`}>Sign in</Link>
                </Button>
                <Button size="sm" className="rounded-lg font-semibold">
                  <Link href={`/register${callbackQuery}`}>Get Started</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden flex items-center gap-1">
            <ThemeToggle />
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 -mr-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="fixed inset-x-0 top-16 z-50 border-b bg-background shadow-lg md:hidden">
          <div className="mx-auto max-w-6xl px-4 py-4">
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => {
                const isActive =
                  pathname === link.href ||
                  (link.href !== "/" && pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-4 pt-4 border-t border-border/40">
              {user ? (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3 px-4 py-2">
                    <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <User size={16} className="text-primary" />
                    </div>
                    <div className="text-sm">
                      <div className="font-semibold">{user.name}</div>
                      <div className="text-xs text-muted-foreground">{user.email}</div>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    className="rounded-lg font-semibold"
                    onClick={() => setMobileOpen(false)}
                  >
                    <Link href="/ideas/generate" className="flex items-center">
                      <Plus className="size-4 mr-1.5" />
                      New Idea
                    </Link>
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="rounded-lg font-semibold text-primary"
                    onClick={() => setMobileOpen(false)}
                  >
                    <Link href="/blogs/generate" className="flex items-center">
                      <Plus className="size-4 mr-1.5" />
                      New Blog
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-lg font-semibold text-destructive hover:text-destructive"
                    onClick={() => {
                      handleLogout();
                      setMobileOpen(false);
                    }}
                  >
                    <LogOut size={16} className="mr-2" />
                    Sign out
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <Button
                    size="sm"
                    className="rounded-lg font-semibold"
                    onClick={() => setMobileOpen(false)}
                  >
                    <Link href={`/register${callbackQuery}`}>Get Started</Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-lg font-semibold"
                    onClick={() => setMobileOpen(false)}
                  >
                    <Link href={`/login${callbackQuery}`}>Sign in</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
