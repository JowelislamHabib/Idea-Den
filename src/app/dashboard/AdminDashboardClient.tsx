"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Users,
  Lightbulb,
  PenTool,
  Crown,
  PlusCircle,
  FileText,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const AdminChart = dynamic(() => import("./AdminChart"), { ssr: false });

export default function AdminDashboardClient({
  firstName,
  totalUsers,
  totalIdeas,
  totalBlogs,
  totalSubscriptions,
  registrationActivity,
  recentIdeas = [],
  recentBlogs = [],
  recentUsers = [],
}: any) {
  const metrics = [
    {
      title: "Total Users",
      value: typeof totalUsers === "number" ? totalUsers.toLocaleString() : totalUsers,
      description: "Registered members",
      icon: Users,
      trend: { value: 12, direction: "up" as const },
      href: "/dashboard/users",
      actionLabel: "Manage",
    },
    {
      title: "Ideas Generated",
      value: typeof totalIdeas === "number" ? totalIdeas.toLocaleString() : totalIdeas,
      description: "Project blueprints",
      icon: Lightbulb,
      trend: { value: 8, direction: "up" as const },
      href: "/dashboard/ideas",
      actionLabel: "View",
    },
    {
      title: "Blogs Published",
      value: typeof totalBlogs === "number" ? totalBlogs.toLocaleString() : totalBlogs,
      description: "SEO articles",
      icon: PenTool,
      trend: { value: 15, direction: "up" as const },
      href: "/dashboard/blogs",
      actionLabel: "Manage",
    },
    {
      title: "Pro Members",
      value: typeof totalSubscriptions === "number" ? totalSubscriptions.toLocaleString() : totalSubscriptions,
      description: "Active subscribers",
      icon: Crown,
      trend: { value: 5, direction: "up" as const },
      href: "/dashboard/users",
      actionLabel: "View",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Page Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <Badge variant="outline" className="text-xs font-medium border-red-500/50 bg-red-500/10 text-red-600 dark:text-red-400">
            <ShieldCheck className="size-3 mr-1" />
            Admin
          </Badge>
        </div>
        <p className="text-muted-foreground text-sm">
          Welcome back, {firstName}. Here&apos;s what&apos;s happening with IdeaDen.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-2">
        <Link href="/dashboard/ideas">
          <Button size="sm" className="gap-1.5">
            <PlusCircle className="size-4" /> New Idea
          </Button>
        </Link>
        <Link href="/dashboard/blogs">
          <Button size="sm" variant="outline" className="gap-1.5">
            <FileText className="size-4" /> New Blog
          </Button>
        </Link>
        <Link href="/dashboard/users">
          <Button size="sm" variant="outline" className="gap-1.5">
            <Users className="size-4" /> Manage Users
          </Button>
        </Link>
      </div>

      <Separator />

      {/* Metric Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((m, i) => (
          <motion.div
            key={m.title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.06 * i, duration: 0.35 }}
          >
            <Card className="overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardDescription className="min-w-0 truncate pr-2">{m.title}</CardDescription>
                <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <m.icon className="size-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl sm:text-3xl font-bold tabular-nums">{m.value}</div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {m.description}
                </p>
              </CardContent>
              <CardFooter className="flex flex-wrap items-center justify-between gap-2 pt-2">
                <Badge
                  variant="outline"
                  className={`text-xs ${
                    m.trend.direction === "up"
                      ? "text-emerald-600 border-emerald-200 dark:text-emerald-400 dark:border-emerald-900"
                      : "text-red-600 border-red-200 dark:text-red-400 dark:border-red-900"
                  }`}
                >
                  {m.trend.direction === "up" ? (
                    <TrendingUp className="size-3 mr-1" />
                  ) : (
                    <TrendingDown className="size-3 mr-1" />
                  )}
                  {m.trend.value}%
                </Badge>
                <Link
                  href={m.href}
                  className="text-xs font-semibold text-primary hover:underline"
                >
                  {m.actionLabel} <ArrowRight className="size-3 inline ml-0.5" />
                </Link>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Area Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>User Registrations</CardTitle>
            <CardDescription>New sign-ups over the last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[260px]">
              <AdminChart data={registrationActivity} />
            </div>
          </CardContent>
        </Card>

        {/* Recent Users */}
        {recentUsers.length > 0 && (
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="text-sm">Recent Users</CardTitle>
              <CardDescription>Latest registered members</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {recentUsers.map((user: any) => (
                  <div
                    key={user._id}
                    className="flex items-center justify-between rounded-lg border p-2.5 transition-colors hover:bg-primary/10"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary text-[10px] font-bold">
                        {(user.name || "?").charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-xs font-semibold">
                          {user.name || "Unknown"}
                        </p>
                        <p className="truncate text-[10px] text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <span className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-widest shrink-0 ${
                      user.role === "admin"
                        ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                        : user.role === "pro"
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
                        : "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200"
                    }`}>
                      {user.role || "free"}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Recent Ideas & Blogs */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Recent Ideas */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Ideas</CardTitle>
              <CardDescription>Latest project blueprints</CardDescription>
            </div>
            <Link href="/dashboard/ideas">
              <Button variant="outline" size="sm">
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {recentIdeas.length > 0 ? (
              <div className="space-y-2">
                {recentIdeas.map((idea: any) => (
                  <div
                    key={idea._id}
                    className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Lightbulb className="size-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">
                          {idea.projectTitle || idea.title || "Untitled Idea"}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {idea.tagline || "General"}
                        </p>
                      </div>
                    </div>
                    <Link
                      href={`/explore/ideas/${idea._id}`}
                      className="shrink-0 text-xs font-semibold text-primary hover:underline"
                    >
                      View
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <ShieldCheck className="size-10 text-muted-foreground/30 mb-3" />
                <p className="text-sm font-medium">No ideas yet</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Create your first idea to get started.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Blogs */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Blogs</CardTitle>
              <CardDescription>Latest articles published</CardDescription>
            </div>
            <Link href="/dashboard/blogs">
              <Button variant="outline" size="sm">
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {recentBlogs.length > 0 ? (
              <div className="space-y-2">
                {recentBlogs.map((blog: any) => (
                  <div
                    key={blog._id}
                    className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <FileText className="size-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">
                          {blog.title || blog.topic || "Untitled Blog"}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {blog.topic || blog.title || "No topic"}
                        </p>
                      </div>
                    </div>
                    <Link
                      href={`/explore/blogs/${blog._id}`}
                      className="shrink-0 text-xs font-semibold text-primary hover:underline"
                    >
                      View
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <ShieldCheck className="size-10 text-muted-foreground/30 mb-3" />
                <p className="text-sm font-medium">No blogs yet</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Create your first blog to get started.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}