"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useSession } from "@/lib/auth-client";
import { apiClient } from "@/lib/api/client";
import { getToken } from "@/lib/api/get-token";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  TrendingUp,
  Lightbulb,
  PenTool,
  PlusCircle,
  FileText,
  User,
  Layers,
  Crown,
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
import { PageLoading } from "@/components/shared/PageLoading";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface DashboardIdea {
  _id: string;
  projectTitle?: string;
  title?: string;
  elevatorPitch?: string;
  domain?: string;
  techStack: string[];
  createdAt: string;
}

interface DashboardBlog {
  _id: string;
  topic?: string;
  title?: string;
  template?: string;
  tone?: string;
  createdAt: string;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-white/20 bg-background/60 backdrop-blur-md p-4 shadow-xl">
        <p className="mb-2 text-sm font-semibold">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-3 text-sm">
            <div
              className="size-3 rounded-full"
              style={{ backgroundColor: entry.color || entry.fill || entry.stroke }}
            />
            <span className="text-muted-foreground capitalize">{entry.name}:</span>
            <span className="font-bold">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function DashboardOverviewPage() {
  const { data: session, isPending: sessionPending } = useSession();
  const userId = session?.user?.id || "";
  const firstName = session?.user?.name?.split(" ")[0] || "User";

  const { data: ideasData, isPending: ideasPending } = useQuery({
    queryKey: ["my-ideas"],
    queryFn: async () => {
      const token = await getToken();
      return apiClient<{ ideas: DashboardIdea[] }>("/api/ideas/mine", { token });
    },
    enabled: !!userId,
  });

  const { data: blogsData, isPending: blogsPending } = useQuery({
    queryKey: ["my-blogs"],
    queryFn: async () => {
      const token = await getToken();
      return apiClient<{ blogs: DashboardBlog[] }>("/api/blogs/mine", { token });
    },
    enabled: !!userId,
  });

  if (sessionPending || ideasPending || blogsPending) {
    return <PageLoading />;
  }

  const ideas = ideasData?.ideas || [];
  const blogs = blogsData?.blogs || [];

  const totalIdeas = ideas.length;
  const totalBlogs = blogs.length;

  const stackCount: Record<string, number> = {};
  ideas.forEach((idea) => {
    (idea.techStack || []).forEach((tech) => {
      stackCount[tech] = (stackCount[tech] || 0) + 1;
    });
  });
  const uniqueTech = Object.keys(stackCount).length;

  const topicCount: Record<string, number> = {};
  blogs.forEach((blog) => {
    const topic = blog.topic || "General";
    topicCount[topic] = (topicCount[topic] || 0) + 1;
  });
  const uniqueTopics = Object.keys(topicCount).length;

  const metrics = [
    {
      title: "Ideas Generated",
      value: totalIdeas,
      description: "Project blueprints",
      icon: Lightbulb,
      trend: { value: 100, direction: "up" as const },
      href: "/dashboard/ideas",
      actionLabel: "View",
    },
    {
      title: "Blogs Published",
      value: totalBlogs,
      description: "SEO articles",
      icon: PenTool,
      trend: { value: 100, direction: "up" as const },
      href: "/dashboard/blogs",
      actionLabel: "View",
    },
    {
      title: "Unique Tech Stack",
      value: uniqueTech,
      description: "Used across ideas",
      icon: Layers,
      trend: { value: 100, direction: "up" as const },
      href: "/dashboard/ideas",
      actionLabel: "Explore",
    },
    {
      title: "Blog Topics",
      value: uniqueTopics,
      description: "Covered across blogs",
      icon: TrendingUp,
      trend: { value: 100, direction: "up" as const },
      href: "/dashboard/blogs",
      actionLabel: "Explore",
    },
  ];

  const recentIdeas = [...ideas].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);
  const recentBlogs = [...blogs].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);

  const dayCount: Record<string, { ideas: number; blogs: number }> = {};
  const allItems = [
    ...ideas.map((i) => ({ ...i, type: "ideas" })),
    ...blogs.map((b) => ({ ...b, type: "blogs" })),
  ];

  allItems.forEach((item) => {
    const date = new Date(item.createdAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    if (!dayCount[date]) {
      dayCount[date] = { ideas: 0, blogs: 0 };
    }
    if (item.type === "ideas") dayCount[date].ideas++;
    if (item.type === "blogs") dayCount[date].blogs++;
  });

  const timelineData = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    timelineData.push({
      date: dateStr,
      ideas: dayCount[dateStr]?.ideas || 0,
      blogs: dayCount[dateStr]?.blogs || 0,
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <Badge variant="outline" className="text-xs font-medium">
            <User className="size-3 mr-1" />
            User
          </Badge>
        </div>
        <p className="text-muted-foreground text-sm">
          Welcome back, {firstName}. Here&apos;s your IdeaDen dashboard.
        </p>
      </div>

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
        <Link href="/dashboard/subscription">
          <Button size="sm" variant="outline" className="gap-1.5">
            <Crown className="size-4" /> Subscription
          </Button>
        </Link>
      </div>

      <Separator />

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
                  className="text-xs text-emerald-600 border-emerald-200 dark:text-emerald-400 dark:border-emerald-900"
                >
                  <TrendingUp className="size-3 mr-1" />
                  +100%
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

      <div className="grid gap-4 lg:grid-cols-1">
        <Card>
          <CardHeader>
            <CardTitle>Generation Timeline (Last 14 Days)</CardTitle>
            <CardDescription>Your activity across ideas and blogs</CardDescription>
          </CardHeader>
          <CardContent>
            {timelineData.every((d) => d.ideas === 0 && d.blogs === 0) ? (
              <div className="flex items-center justify-center h-64 text-muted-foreground text-sm bg-muted/30 rounded-lg">
                No data in the last 14 days. Get building!
              </div>
            ) : (
              <div className="h-[260px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={timelineData}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorIdeas" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={1} />
                        <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0.1} />
                      </linearGradient>
                      <linearGradient id="colorBlogs" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--color-chart-1)" stopOpacity={1} />
                        <stop offset="95%" stopColor="var(--color-chart-1)" stopOpacity={0.1} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="var(--color-border)"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="date"
                      fontSize={12}
                      stroke="var(--color-muted-foreground)"
                      tickMargin={10}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      fontSize={12}
                      stroke="var(--color-muted-foreground)"
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(val) => (Math.floor(val) === val ? val : "")}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="ideas"
                      name="Ideas Generated"
                      stroke="var(--color-primary)"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorIdeas)"
                      activeDot={{ r: 6, strokeWidth: 0, fill: "var(--color-primary)" }}
                    />
                    <Area
                      type="monotone"
                      dataKey="blogs"
                      name="Blogs Generated"
                      stroke="var(--color-chart-1)"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorBlogs)"
                      activeDot={{ r: 6, strokeWidth: 0, fill: "var(--color-chart-1)" }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
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
                          {idea.domain || "General"}
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
                <Lightbulb className="size-10 text-muted-foreground/30 mb-3" />
                <p className="text-sm font-medium">No ideas yet</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Create your first idea to get started.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

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
                <FileText className="size-10 text-muted-foreground/30 mb-3" />
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
