"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  LogOut,
  Menu,
  X,
  User,
  Lightbulb,
  PenTool,
  BarChart3,
  ChevronDown,
  Sparkles,
  Crown,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
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

  const { data: proData } = useQuery({
    queryKey: ["nav-pro-status"],
    queryFn: async () => {
      const res = await fetch("/api/stripe/subscription");
      if (!res.ok) return { isPro: false };
      return res.json() as Promise<{ isPro: boolean }>;
    },
    enabled: !!user,
    refetchInterval: 60000,
  });
  const isPro = proData?.isPro || false;

  const handleLogout = async () => {
    await authClient.signOut();
    window.location.href = "/";
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 outline-none">
            <Image
              src="/ideaden-black.png"
              alt="IdeaDen"
              width={150}
              height={32}
              className="h-7 w-auto dark:hidden"
            />
            <Image
              src="/ideaden-white.png"
              alt="IdeaDen"
              width={150}
              height={32}
              className="h-7 w-auto hidden dark:block"
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/"
              className={`px-3.5 py-2 rounded-full text-sm font-medium transition-colors ${
                pathname === "/"
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              Home
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger
                className={`px-3.5 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-1 outline-none ${
                  pathname.startsWith("/explore")
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                Explore <ChevronDown size={14} />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="w-40 p-2 flex flex-col gap-1"
              >
                <DropdownMenuItem
                  className="cursor-pointer"
                  render={<Link href="/explore/ideas" className="w-full" />}
                >
                  Ideas
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  render={<Link href="/explore/blogs" className="w-full" />}
                >
                  Blogs
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {user && (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger
                    className={`group px-3.5 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-1.5 outline-none ${
                      pathname.startsWith("/generate")
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    <Sparkles
                      size={14}
                      className={
                        pathname.startsWith("/generate")
                          ? "text-primary"
                          : "text-amber-600"
                      }
                    />
                    Generate
                    <ChevronDown
                      size={14}
                      className={`transition-transform duration-200 group-data-[state=open]:rotate-180 opacity-70`}
                    />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="start"
                    className="w-48 p-2 flex flex-col gap-1"
                  >
                    <DropdownMenuItem
                      className="cursor-pointer"
                      render={
                        <Link href="/generate/ideas" className="w-full" />
                      }
                    >
                      Project Idea
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="cursor-pointer"
                      render={
                        <Link href="/generate/blogs" className="w-full" />
                      }
                    >
                      Blog Article
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Link
                  href="/dashboard"
                  className={`px-3.5 py-2 rounded-full text-sm font-medium transition-colors ${
                    pathname.startsWith("/dashboard")
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  Dashboard
                </Link>
              </>
            )}

            <Link
              href="/pricing"
              className={`px-3.5 py-2 rounded-full text-sm font-medium transition-colors ${
                pathname === "/pricing"
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              Pricing
            </Link>
            <Link
              href="/about"
              className={`px-3.5 py-2 rounded-full text-sm font-medium transition-colors ${
                pathname === "/about"
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              About
            </Link>
          </nav>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            {isPending ? (
              <div className="w-20 h-9 rounded-full bg-muted animate-pulse" />
            ) : user ? (
              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center gap-2 rounded-full border border-border/60 px-3 py-2 text-sm font-medium hover:bg-muted transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring">
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
                    {isPro && (
                      <span className="hidden lg:inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-600 dark:text-amber-400 ml-1">
                        <Crown className="size-3" />
                        Pro
                      </span>
                    )}
                    <ChevronDown size={14} className="text-muted-foreground" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    sideOffset={8}
                    className="w-52"
                  >
                    <DropdownMenuGroup>
                      <DropdownMenuLabel className="font-normal p-3">
                        <div className="text-sm font-semibold flex items-center gap-2">
                          {user.name}
                          {isPro && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-600 dark:text-amber-400">
                              <Crown className="size-3" />
                              Pro
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground truncate">
                          {user.email}
                        </div>
                      </DropdownMenuLabel>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup className="flex flex-col gap-1">
                      <DropdownMenuItem
                        className="cursor-pointer"
                        render={
                          <Link
                            href="/dashboard/ideas"
                            className="flex items-center w-full"
                          />
                        }
                      >
                        <Lightbulb
                          size={16}
                          className="mr-2.5 text-muted-foreground"
                        />
                        My Ideas
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="cursor-pointer"
                        render={
                          <Link
                            href="/dashboard/blogs"
                            className="flex items-center w-full"
                          />
                        }
                      >
                        <PenTool
                          size={16}
                          className="mr-2.5 text-muted-foreground"
                        />
                        My Blogs
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="cursor-pointer"
                        render={
                          <Link
                            href="/dashboard"
                            className="flex items-center w-full"
                          />
                        }
                      >
                        <BarChart3
                          size={16}
                          className="mr-2.5 text-muted-foreground"
                        />
                        Dashboard
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
                <Link
                  href={`/login${callbackQuery}`}
                  className={`${buttonVariants({ variant: "ghost", size: "sm" })} rounded-full font-semibold`}
                >
                  Sign in
                </Link>
                <Link
                  href={`/register${callbackQuery}`}
                  className={`${buttonVariants({ size: "sm" })} rounded-full font-semibold`}
                >
                  Get Started
                </Link>
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
        <div className="fixed inset-x-0 top-16 z-50 border-b bg-background shadow-lg md:hidden h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="mx-auto max-w-7xl px-4 py-4 pb-12">
            <nav className="flex flex-col gap-2">
              <Link
                href="/"
                onClick={() => setMobileOpen(false)}
                className={`rounded-full px-4 py-2.5 text-sm font-medium transition-colors ${
                  pathname === "/"
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                Home
              </Link>

              <div className="space-y-1">
                <div className="px-4 py-1.5 text-sm font-bold text-foreground">
                  Explore
                </div>
                <Link
                  href="/explore/ideas"
                  onClick={() => setMobileOpen(false)}
                  className={`block rounded-full px-8 py-2 text-sm font-medium transition-colors ${
                    pathname === "/explore"
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  Ideas
                </Link>
                <Link
                  href="/explore/blogs"
                  onClick={() => setMobileOpen(false)}
                  className={`block rounded-full px-8 py-2 text-sm font-medium transition-colors ${
                    pathname === "/explore/blogs"
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  Blogs
                </Link>
              </div>

              {user && (
                <>
                  <div className="space-y-1 mt-2">
                    <div className="px-4 py-1.5 text-sm font-bold text-foreground flex items-center gap-2">
                      <Sparkles size={16} className="text-violet-500" />
                      Generate
                    </div>
                    <Link
                      href="/generate/ideas"
                      onClick={() => setMobileOpen(false)}
                      className={`block rounded-full px-8 py-2 text-sm font-medium transition-colors ${
                        pathname === "/ideas/generate"
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      Project Idea
                    </Link>
                    <Link
                      href="/generate/blogs"
                      onClick={() => setMobileOpen(false)}
                      className={`block rounded-full px-8 py-2 text-sm font-medium transition-colors ${
                        pathname === "/blogs/generate"
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      Blog Article
                    </Link>
                  </div>

                  <Link
                    href="/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className={`mt-2 rounded-full px-4 py-2.5 text-sm font-medium transition-colors ${
                      pathname.startsWith("/dashboard")
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    Dashboard
                  </Link>
                </>
              )}

              <Link
                href="/pricing"
                onClick={() => setMobileOpen(false)}
                className={`rounded-full px-4 py-2.5 text-sm font-medium transition-colors ${
                  pathname === "/pricing"
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                Pricing
              </Link>
              <Link
                href="/about"
                onClick={() => setMobileOpen(false)}
                className={`rounded-full px-4 py-2.5 text-sm font-medium transition-colors ${
                  pathname === "/about"
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                About
              </Link>
            </nav>

            <div className="mt-6 pt-6 border-t border-border/40">
              {user ? (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3 px-4 py-2 mb-2">
                    <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <User size={16} className="text-primary" />
                    </div>
                    <div className="text-sm">
                      <div className="font-semibold flex items-center gap-2">
                        {user.name}
                        {isPro && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-600 dark:text-amber-400">
                            <Crown className="size-3" />
                            Pro
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {user.email}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="rounded-full font-semibold text-destructive hover:text-destructive hover:bg-destructive/10 border-transparent"
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
                  <Link
                    href={`/register${callbackQuery}`}
                    onClick={() => setMobileOpen(false)}
                    className={`${buttonVariants()} rounded-full font-semibold`}
                  >
                    Get Started
                  </Link>
                  <Link
                    href={`/login${callbackQuery}`}
                    onClick={() => setMobileOpen(false)}
                    className={`${buttonVariants({ variant: "outline" })} rounded-full font-semibold`}
                  >
                    Sign in
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
