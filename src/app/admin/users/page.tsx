import { MongoClient } from "mongodb";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Card } from "@/components/ui/card";
import { UsersClient } from "./UsersClient";

export default async function ManageUsersPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  
  if (!session || session.user.role !== "admin") {
    redirect("/");
  }

  const client = new MongoClient(process.env.MONGODB_URI as string);
  await client.connect();
  const db = client.db("IdeaDen");

  const rawUsers = await db.collection("user").find().sort({ createdAt: -1 }).toArray();
  const users = rawUsers.map((u) => ({
    ...u,
    _id: u._id.toString(),
    createdAt: u.createdAt ? u.createdAt.toISOString() : null,
  }));

  return (
    <div className="container">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold tracking-wide">Manage Users</h1>
        <p className="mt-1 text-muted-foreground">View all users, manage roles, and delete accounts.</p>
      </div>
      
      <Card className="overflow-hidden border-slate-200 dark:border-slate-800 bg-card/50 backdrop-blur-sm shadow-sm rounded-xl">
        <UsersClient users={users} />
      </Card>
    </div>
  );
}
