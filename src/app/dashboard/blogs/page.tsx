import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Card } from "@/components/ui/card";
import { BlogsClient as AdminBlogsClient } from "./AdminBlogsClient";
import UserBlogsClient from "./UserBlogsClient";
import { getTokenServer } from "@/lib/getTokenServer";
import { apiClient } from "@/lib/api/client";

export default async function DashboardBlogsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; visibility?: string }>;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user) {
    redirect("/login");
  }

  const { page, visibility } = await searchParams;
  const currentVisibility = visibility || "all";

  if (session.user.role !== "admin") {
    const token = await getTokenServer();
    let initialBlogs = [];
    
    try {
      const queryParams = new URLSearchParams();
      if (currentVisibility !== "all") queryParams.set("visibility", currentVisibility);
      const res = await apiClient<{ blogs: any[] }>(`/api/blogs/mine?${queryParams.toString()}`, { token });
      initialBlogs = res.blogs || [];
    } catch (err) {
      console.error("Failed to fetch initial blogs", err);
    }
    return <UserBlogsClient initialBlogs={initialBlogs} user={session.user} />;
  }

  const currentPage = Math.max(1, parseInt(page || "1", 10));
  const token = await getTokenServer();

  const data = await apiClient<{
    blogs: any[];
    pagination: { page: number; limit: number; total: number; pages: number };
  }>(`/api/admin/blogs?page=${currentPage}&limit=10&visibility=${currentVisibility}`, {
    token,
  });

  return (
    <div className="container">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold tracking-wide">
          Manage Blogs
        </h1>
        <p className="mt-1 text-muted-foreground">
          View and delete generated blog articles.
        </p>
      </div>

      <Card className="overflow-hidden border-slate-200 dark:border-slate-800 bg-card/50 backdrop-blur-sm shadow-sm rounded-xl">
        <AdminBlogsClient
          blogs={data.blogs}
          page={data.pagination.page}
          totalPages={data.pagination.pages}
          total={data.pagination.total}
        />
      </Card>
    </div>
  );
}
