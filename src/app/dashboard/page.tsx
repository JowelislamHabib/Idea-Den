"use client";

import { useSession } from "@/lib/auth-client";
import { apiClient } from "@/lib/api/client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SlideUp } from "@/components/ui/motion-wrapper";
import { Loader2, Lightbulb, Layers, TrendingUp, PenTool } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const COLORS = [
  "#0066FF", "#00C49F", "#FFBB28", "#FF8042", "#8884D8",
  "#82CA9D", "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4",
];

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
            <div className="size-3 rounded-full" style={{ backgroundColor: entry.color || entry.fill || entry.stroke }} />
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

  const { data: ideasData, isPending: ideasPending } = useQuery({
    queryKey: ["my-ideas"],
    queryFn: () =>
      apiClient<{ ideas: DashboardIdea[] }>(`/api/ideas/mine?userId=${userId}`),
    enabled: !!userId,
  });

  const { data: blogsData, isPending: blogsPending } = useQuery({
    queryKey: ["my-blogs"],
    queryFn: () =>
      apiClient<{ blogs: DashboardBlog[] }>(`/api/blogs/mine?userId=${userId}`),
    enabled: !!userId,
  });

  if (sessionPending || ideasPending || blogsPending) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
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
  const stackData = Object.entries(stackCount)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);

  const topicCount: Record<string, number> = {};
  blogs.forEach((blog) => {
    const topic = blog.topic || "General";
    topicCount[topic] = (topicCount[topic] || 0) + 1;
  });
  const topicData = Object.entries(topicCount)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);

  const dayCount: Record<string, { ideas: number; blogs: number }> = {};
  const allItems = [...ideas.map(i => ({...i, type: 'ideas'})), ...blogs.map(b => ({...b, type: 'blogs'}))];
  
  allItems.forEach((item) => {
    const date = new Date(item.createdAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    if (!dayCount[date]) {
      dayCount[date] = { ideas: 0, blogs: 0 };
    }
    if (item.type === 'ideas') dayCount[date].ideas++;
    if (item.type === 'blogs') dayCount[date].blogs++;
  });
  
  // Create last 14 days array ensuring missing days are 0
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

  const glassCardClass = "bg-background/40 backdrop-blur-xl border-white/10 shadow-lg relative overflow-hidden";

  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <SlideUp delay={0.1}>
          <Card className={glassCardClass}>
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              <Lightbulb className="size-24" />
            </div>
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center gap-4">
                <div className="flex size-12 items-center justify-center rounded-xl bg-primary/20 text-primary border border-primary/20 backdrop-blur-md">
                  <Lightbulb className="size-6" />
                </div>
                <div>
                  <div className="text-3xl font-extrabold tracking-tight">{totalIdeas}</div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Total Ideas
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </SlideUp>

        <SlideUp delay={0.15}>
          <Card className={glassCardClass}>
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              <PenTool className="size-24" />
            </div>
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center gap-4">
                <div className="flex size-12 items-center justify-center rounded-xl bg-purple-500/20 text-purple-500 border border-purple-500/20 backdrop-blur-md">
                  <PenTool className="size-6" />
                </div>
                <div>
                  <div className="text-3xl font-extrabold tracking-tight">{totalBlogs}</div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Total Blogs
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </SlideUp>

        <SlideUp delay={0.2}>
          <Card className={glassCardClass}>
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              <Layers className="size-24" />
            </div>
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center gap-4">
                <div className="flex size-12 items-center justify-center rounded-xl bg-blue-500/20 text-blue-500 border border-blue-500/20 backdrop-blur-md">
                  <Layers className="size-6" />
                </div>
                <div>
                  <div className="text-3xl font-extrabold tracking-tight">{stackData.length}</div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Unique Tech
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </SlideUp>

        <SlideUp delay={0.25}>
          <Card className={glassCardClass}>
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              <TrendingUp className="size-24" />
            </div>
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center gap-4">
                <div className="flex size-12 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-500 border border-emerald-500/20 backdrop-blur-md">
                  <TrendingUp className="size-6" />
                </div>
                <div>
                  <div className="text-3xl font-extrabold tracking-tight">
                    {topicData.length}
                  </div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Blog Topics
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </SlideUp>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 mb-8">
        <SlideUp delay={0.3}>
          <Card className={glassCardClass}>
            <CardHeader>
              <CardTitle>Tech Stack Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              {stackData.length === 0 ? (
                <div className="flex items-center justify-center h-64 text-muted-foreground text-sm bg-muted/30 rounded-lg">
                  No data yet. Generate some project ideas!
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <defs>
                      {COLORS.map((color, index) => (
                        <linearGradient key={`pie1-${index}`} id={`pie1-gradient-${index}`} x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0%" stopColor={color} stopOpacity={1} />
                          <stop offset="100%" stopColor={color} stopOpacity={0.6} />
                        </linearGradient>
                      ))}
                    </defs>
                    <Pie
                      data={stackData}
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={105}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="var(--background)"
                      strokeWidth={3}
                      label={({ name, percent }) =>
                        `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                      }
                    >
                      {stackData.map((_entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={`url(#pie1-gradient-${index % COLORS.length})`}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </SlideUp>

        <SlideUp delay={0.35}>
          <Card className={glassCardClass}>
            <CardHeader>
              <CardTitle>Blog Topic Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              {topicData.length === 0 ? (
                <div className="flex items-center justify-center h-64 text-muted-foreground text-sm bg-muted/30 rounded-lg">
                  No data yet. Generate some blogs!
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <defs>
                      {COLORS.map((color, index) => (
                        <linearGradient key={`pie2-${index}`} id={`pie2-gradient-${index}`} x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0%" stopColor={color} stopOpacity={1} />
                          <stop offset="100%" stopColor={color} stopOpacity={0.6} />
                        </linearGradient>
                      ))}
                    </defs>
                    <Pie
                      data={topicData}
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={105}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="var(--background)"
                      strokeWidth={3}
                      label={({ name, percent }) =>
                        `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                      }
                    >
                      {topicData.map((_entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={`url(#pie2-gradient-${(index + 5) % COLORS.length})`}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </SlideUp>
      </div>

      <SlideUp delay={0.4}>
        <Card className={glassCardClass}>
          <CardHeader>
            <CardTitle>Generation Timeline (Last 14 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            {timelineData.every(d => d.ideas === 0 && d.blogs === 0) ? (
              <div className="flex items-center justify-center h-64 text-muted-foreground text-sm bg-muted/30 rounded-lg">
                No data in the last 14 days. Get building!
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={timelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorIdeas" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0066FF" stopOpacity={1} />
                      <stop offset="95%" stopColor="#0066FF" stopOpacity={0.1} />
                    </linearGradient>
                    <linearGradient id="colorBlogs" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8884D8" stopOpacity={1} />
                      <stop offset="95%" stopColor="#8884D8" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                  <XAxis 
                    dataKey="date" 
                    fontSize={12} 
                    stroke="rgba(255,255,255,0.5)" 
                    tickMargin={10} 
                    axisLine={false} 
                    tickLine={false} 
                  />
                  <YAxis 
                    fontSize={12} 
                    stroke="rgba(255,255,255,0.5)" 
                    axisLine={false} 
                    tickLine={false}
                    tickFormatter={(val) => Math.floor(val) === val ? val : ""}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="ideas"
                    name="Ideas Generated"
                    stroke="#0066FF"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorIdeas)"
                    activeDot={{ r: 6, strokeWidth: 0, fill: "#0066FF" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="blogs"
                    name="Blogs Generated"
                    stroke="#8884D8"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorBlogs)"
                    activeDot={{ r: 6, strokeWidth: 0, fill: "#8884D8" }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </SlideUp>
    </>
  );
}
