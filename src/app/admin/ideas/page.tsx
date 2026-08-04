import { MongoClient } from "mongodb";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Card } from "@/components/ui/card";
import { IdeasClient } from "./IdeasClient";

export default async function ManageIdeasPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  
  if (!session || session.user.role !== "admin") {
    redirect("/");
  }

  const client = new MongoClient(process.env.MONGODB_URI as string);
  await client.connect();
  const db = client.db("IdeaDen");

  const rawIdeas = await db.collection("ideas").find().sort({ createdAt: -1 }).toArray();
  const ideas = rawIdeas.map((i) => ({
    ...i,
    _id: i._id.toString(),
    createdAt: i.createdAt ? i.createdAt.toISOString() : null,
  }));

  return (
    <div className="container">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold tracking-wide">Manage Ideas</h1>
        <p className="mt-1 text-muted-foreground">View and delete generated project blueprints.</p>
      </div>
      
      <Card className="overflow-hidden border-slate-200 dark:border-slate-800 bg-card/50 backdrop-blur-sm shadow-sm rounded-xl">
        <IdeasClient ideas={ideas} />
      </Card>
    </div>
  );
}
