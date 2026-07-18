"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";
import {
  LogOut,
  Menu,
  X,
  User,
  Lightbulb,
  PenTool,
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
            <Link
              href="/"
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname === "/"
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              Home
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 outline-none ${
                  pathname.startsWith("/explore")
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                Explore <ChevronDown size={14} />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <Link href="/explore/ideas" className="cursor-pointer w-full">
                    Ideas
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/explore/blogs" className="cursor-pointer w-full">
                    Blogs
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {user && (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger
                    className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 outline-none ${
                      pathname.startsWith("/generate")
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    Generate <ChevronDown size={14} />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>
                      <Link
                        href="/generate/ideas"
                        className="cursor-pointer w-full"
                      >
                        Project Idea
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link
                        href="/generate/blogs"
                        className="cursor-pointer w-full"
                      >
                        Blog Article
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Link
                  href="/dashboard"
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
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
              href="/about"
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
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
              <div className="w-20 h-9 rounded-lg bg-muted animate-pulse" />
            ) : user ? (
              <div className="flex items-center gap-2">
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
                  <DropdownMenuContent
                    align="end"
                    sideOffset={8}
                    className="w-52"
                  >
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
                        <Link
                          href="/dashboard/ideas"
                          className="flex items-center w-full"
                        >
                          <Lightbulb
                            size={16}
                            className="mr-2.5 text-muted-foreground"
                          />
                          My Ideas
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer">
                        <Link
                          href="/dashboard/blogs"
                          className="flex items-center w-full"
                        >
                          <PenTool
                            size={16}
                            className="mr-2.5 text-muted-foreground"
                          />
                          My Blogs
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer">
                        <Link
                          href="/dashboard"
                          className="flex items-center w-full"
                        >
                          <BarChart3
                            size={16}
                            className="mr-2.5 text-muted-foreground"
                          />
                          Dashboard
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer">
                        <Link
                          href="/profile"
                          className="flex items-center w-full"
                        >
                          <LayoutDashboard
                            size={16}
                            className="mr-2.5 text-muted-foreground"
                          />
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
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-lg font-semibold"
                >
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
        <div className="fixed inset-x-0 top-16 z-50 border-b bg-background shadow-lg md:hidden h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="mx-auto max-w-6xl px-4 py-4 pb-12">
            <nav className="flex flex-col gap-2">
              <Link
                href="/"
                onClick={() => setMobileOpen(false)}
                className={`rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
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
                  className={`block rounded-lg px-8 py-2 text-sm font-medium transition-colors ${
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
                  className={`block rounded-lg px-8 py-2 text-sm font-medium transition-colors ${
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
                    <div className="px-4 py-1.5 text-sm font-bold text-foreground">
                      Generate
                    </div>
                    <Link
                      href="/generate/ideas"
                      onClick={() => setMobileOpen(false)}
                      className={`block rounded-lg px-8 py-2 text-sm font-medium transition-colors ${
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
                      className={`block rounded-lg px-8 py-2 text-sm font-medium transition-colors ${
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
                    className={`mt-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
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
                href="/about"
                onClick={() => setMobileOpen(false)}
                className={`mt-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
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
                      <div className="font-semibold">{user.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {user.email}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="rounded-lg font-semibold text-destructive hover:text-destructive hover:bg-destructive/10 border-transparent"
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
                    className="rounded-lg font-semibold"
                    onClick={() => setMobileOpen(false)}
                  >
                    <Link href={`/register${callbackQuery}`}>Get Started</Link>
                  </Button>
                  <Button
                    variant="outline"
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
