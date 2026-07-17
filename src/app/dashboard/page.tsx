"use client";

import { useSession } from "@/lib/auth-client";
import { apiClient } from "@/lib/api/client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SlideUp } from "@/components/ui/motion-wrapper";
import { Loader2, FileText, Layers, TrendingUp } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
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

export default function DashboardOverviewPage() {
  const { data: session, isPending: sessionPending } = useSession();
  const userId = session?.user?.id || "";

  const { data, isPending } = useQuery({
    queryKey: ["my-ideas"],
    queryFn: () =>
      apiClient<{ ideas: DashboardIdea[] }>(`/api/ideas/mine?userId=${userId}`),
    enabled: !!userId,
  });

  if (sessionPending || isPending) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const ideas = data?.ideas || [];

  const totalIdeas = ideas.length;

  const stackCount: Record<string, number> = {};
  ideas.forEach((idea) => {
    (idea.techStack || []).forEach((tech) => {
      stackCount[tech] = (stackCount[tech] || 0) + 1;
    });
  });
  const stackData = Object.entries(stackCount)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);

  const dayCount: Record<string, number> = {};
  ideas.forEach((idea) => {
    const date = new Date(idea.createdAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    dayCount[date] = (dayCount[date] || 0) + 1;
  });
  const timelineData = Object.entries(dayCount)
    .map(([date, count]) => ({ date, "project ideas": count }))
    .reverse()
    .slice(-14);

  const domainCount: Record<string, number> = {};
  ideas.forEach((idea) => {
    const domain = idea.domain || "Other";
    domainCount[domain] = (domainCount[domain] || 0) + 1;
  });

  return (
    <>
      <div className="grid gap-6 sm:grid-cols-3 mb-8">
        <SlideUp delay={0.1}>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <FileText className="size-5" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{totalIdeas}</div>
                  <div className="text-sm text-muted-foreground">
                    Total Ideas
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </SlideUp>

        <SlideUp delay={0.15}>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Layers className="size-5" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{stackData.length}</div>
                  <div className="text-sm text-muted-foreground">
                    Unique Technologies
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </SlideUp>

        <SlideUp delay={0.2}>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <TrendingUp className="size-5" />
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    {Object.keys(domainCount).length}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Domains Explored
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </SlideUp>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <SlideUp delay={0.25}>
          <Card>
            <CardHeader>
              <CardTitle>Tech Stack Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              {stackData.length === 0 ? (
                <div className="flex items-center justify-center h-64 text-muted-foreground text-sm">
                  No data yet. Generate some project ideas!
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={stackData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={3}
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                      }
                    >
                      {stackData.map((_entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </SlideUp>

        <SlideUp delay={0.3}>
          <Card>
            <CardHeader>
              <CardTitle>Generation Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              {timelineData.length === 0 ? (
                <div className="flex items-center justify-center h-64 text-muted-foreground text-sm">
                  No data yet. Generate some project ideas!
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={timelineData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="date" fontSize={12} />
                    <YAxis fontSize={12} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="project ideas"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      dot={{ fill: "hsl(var(--primary))" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </SlideUp>
      </div>
    </>
  );
}
