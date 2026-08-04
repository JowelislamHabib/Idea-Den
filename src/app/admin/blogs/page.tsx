import { MongoClient } from "mongodb";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Card } from "@/components/ui/card";
import { BlogsClient } from "./BlogsClient";

export default async function ManageBlogsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  
  if (!session || session.user.role !== "admin") {
    redirect("/");
  }

  const client = new MongoClient(process.env.MONGODB_URI as string);
  await client.connect();
  const db = client.db("IdeaDen");

  const rawBlogs = await db.collection("blogs").find().sort({ createdAt: -1 }).toArray();
  const blogs = rawBlogs.map((b) => ({
    ...b,
    _id: b._id.toString(),
    createdAt: b.createdAt ? b.createdAt.toISOString() : null,
  }));

  return (
    <div className="container">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold tracking-wide">Manage Blogs</h1>
        <p className="mt-1 text-muted-foreground">View and delete generated blog posts.</p>
      </div>
      
      <Card className="overflow-hidden border-slate-200 dark:border-slate-800 bg-card/50 backdrop-blur-sm shadow-sm rounded-xl">
        <BlogsClient blogs={blogs} />
      </Card>
    </div>
  );
}
