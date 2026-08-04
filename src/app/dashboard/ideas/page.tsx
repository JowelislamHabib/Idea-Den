import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Card } from "@/components/ui/card";
import { IdeasClient as AdminIdeasClient } from "./AdminIdeasClient";
import UserIdeasClient from "./UserIdeasClient";
import { getTokenServer } from "@/lib/getTokenServer";
import { apiClient } from "@/lib/api/client";

export default async function DashboardIdeasPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; visibility?: string }>;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/");
  }

  if (session.user.role !== "admin") {
    const token = await getTokenServer();
    let initialIdeas = [];
    
    try {
      const ideasData = await apiClient<{ ideas: any[] }>("/api/ideas/mine", { token });
      initialIdeas = ideasData.ideas || [];
    } catch (e) {
      console.error("Error fetching user ideas:", e);
    }
    return <UserIdeasClient initialIdeas={initialIdeas} user={session.user} />;
  }

  const { page, visibility } = await searchParams;
  const currentPage = Math.max(1, parseInt(page || "1", 10));
  const currentVisibility = visibility || "all";
  const token = await getTokenServer();

  const data = await apiClient<{
    ideas: any[];
    pagination: { page: number; limit: number; total: number; pages: number };
  }>(`/api/admin/ideas?page=${currentPage}&limit=10&visibility=${currentVisibility}`, {
    token,
  });

  return (
    <div className="container">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold tracking-wide">
          Manage Ideas
        </h1>
        <p className="mt-1 text-muted-foreground">
          View and delete generated project blueprints.
        </p>
      </div>

      <Card className="overflow-hidden border-slate-200 dark:border-slate-800 bg-card/50 backdrop-blur-sm shadow-sm rounded-xl">
        <AdminIdeasClient
          ideas={data.ideas}
          page={data.pagination.page}
          totalPages={data.pagination.pages}
          total={data.pagination.total}
        />
      </Card>
    </div>
  );
}
