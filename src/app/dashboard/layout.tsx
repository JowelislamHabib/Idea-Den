"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { AuthRequired } from "@/components/shared/AuthRequired";
import { useSession } from "@/lib/auth-client";
import { Loader2, LayoutDashboard, Lightbulb, PenTool, Plus } from "lucide-react";
import { SlideUp } from "@/components/ui/motion-wrapper";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session, isPending: sessionPending } = useSession();

  if (sessionPending) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center py-16">
        <AuthRequired redirectUrl="/dashboard" />
      </div>
    );
  }

  const tabs = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "My Ideas", href: "/dashboard/ideas", icon: Lightbulb },
    { name: "My Blogs", href: "/dashboard/blogs", icon: PenTool },
  ];

  return (
    <div className="min-h-[60vh] py-12 bg-muted/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SlideUp>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                Dashboard
              </h1>
              <p className="mt-1 text-muted-foreground">
                Manage your profile and generated ideas.
              </p>
            </div>
            <Link href="/generate/ideas" className={buttonVariants({ className: "flex items-center" })}>
                <Plus className="mr-1.5 size-4" /> New Idea
            </Link>
          </div>
        </SlideUp>

        <SlideUp delay={0.05}>
          <div className="border-b mb-8 flex gap-6 overflow-x-auto">
            {tabs.map((tab) => {
              const isActive = pathname === tab.href;
              const Icon = tab.icon;
              return (
                <Link
                  key={tab.name}
                  href={tab.href}
                  className={cn(
                    "flex items-center gap-2 pb-3 font-medium transition-colors border-b-2",
                    isActive
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                  )}
                >
                  <Icon className="size-4" />
                  {tab.name}
                </Link>
              );
            })}
          </div>
        </SlideUp>

        {children}
      </div>
    </div>
  );
}
