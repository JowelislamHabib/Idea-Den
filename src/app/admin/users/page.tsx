import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Card } from "@/components/ui/card";
import { UsersClient } from "./UsersClient";
import { getTokenServer } from "@/lib/getTokenServer";
import { apiClient } from "@/lib/api/client";

export default async function ManageUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== "admin") {
    redirect("/");
  }

  const { page } = await searchParams;
  const currentPage = Math.max(1, parseInt(page || "1", 10));
  const token = await getTokenServer();

  const data = await apiClient<{
    users: any[];
    pagination: { page: number; limit: number; total: number; pages: number };
  }>(`/api/admin/users?page=${currentPage}&limit=10`, {
    token,
  });

  return (
    <div className="container">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold tracking-wide">
          Manage Users
        </h1>
        <p className="mt-1 text-muted-foreground">
          View all users, manage roles, and delete accounts.
        </p>
      </div>

      <Card className="overflow-hidden border-slate-200 dark:border-slate-800 bg-card/50 backdrop-blur-sm shadow-sm rounded-xl">
        <UsersClient
          users={data.users}
          page={data.pagination.page}
          totalPages={data.pagination.pages}
          total={data.pagination.total}
        />
      </Card>
    </div>
  );
}