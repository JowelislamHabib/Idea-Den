import { headers } from "next/headers";
import AdminDashboardClient from "./AdminDashboardClient";
import UserDashboardClient from "./UserDashboardClient";
import { auth } from "@/lib/auth";
import { MongoClient } from "mongodb";
import { redirect } from "next/navigation";
import { getTokenServer } from "@/lib/getTokenServer";
import { apiClient } from "@/lib/api/client";

export default async function AdminDashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  
  if (!session) {
    redirect("/");
  }
  
  const user = session?.user;

  if (user.role !== "admin") {
    const token = await getTokenServer();
    let initialIdeas = [];
    let initialBlogs = [];
    
    try {
      const ideasData = await apiClient<{ ideas: any[] }>("/api/ideas/mine", { token });
      initialIdeas = ideasData.ideas || [];
    } catch (e) {
      console.error("Error fetching user ideas:", e);
    }
    
    try {
      const blogsData = await apiClient<{ blogs: any[] }>("/api/blogs/mine", { token });
      initialBlogs = blogsData.blogs || [];
    } catch (e) {
      console.error("Error fetching user blogs:", e);
    }

    return (
      <div className="container">
        <UserDashboardClient user={user} initialIdeas={initialIdeas} initialBlogs={initialBlogs} />
      </div>
    );
  }

  const firstName = user?.name?.split(" ")[0] || "Admin";

  const client = new MongoClient(process.env.MONGODB_URI as string);
  await client.connect();
  const db = client.db("IdeaDen");

  const [users, ideas, blogs] = await Promise.all([
    db.collection("user").find().sort({ createdAt: -1 }).toArray(),
    db.collection("ideas").find().sort({ createdAt: -1 }).toArray(),
    db.collection("blogs").find().sort({ createdAt: -1 }).toArray(),
  ]);

  const totalUsers = users.length;
  const totalIdeas = ideas.length;
  const totalBlogs = blogs.length;
  const totalSubscriptions = users.filter((u) => u.role === "pro").length;

  // Process registrations for the last 7 days
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    d.setHours(0, 0, 0, 0);
    return d;
  });

  const registrationActivity = last7Days.map((date) => {
    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);

    const count = users.filter((u) => {
      if (!u.createdAt) return false;
      const createdAt = new Date(u.createdAt);
      return createdAt >= date && createdAt < nextDay;
    }).length;

    return {
      day: date.toLocaleDateString("en-US", { weekday: "short" }),
      count,
    };
  });

  // Convert ObjectIds to strings for serialization
  const serializedIdeas = ideas.map(idea => ({
    ...idea,
    _id: idea._id.toString(),
    createdAt: idea.createdAt?.toISOString() || null,
  })).slice(0, 5);

  const serializedBlogs = blogs.map(blog => ({
    ...blog,
    _id: blog._id.toString(),
    createdAt: blog.createdAt?.toISOString() || null,
  })).slice(0, 5);

  const recentUsers = users.slice(0, 5).map(u => ({
    ...u,
    _id: u._id.toString(),
    createdAt: u.createdAt?.toISOString() || null,
  }));

  return (
    <div className="container">
      <AdminDashboardClient
        firstName={firstName}
        totalUsers={totalUsers}
        totalIdeas={totalIdeas}
        totalBlogs={totalBlogs}
        totalSubscriptions={totalSubscriptions}
        registrationActivity={registrationActivity}
        recentIdeas={serializedIdeas}
        recentBlogs={serializedBlogs}
        recentUsers={recentUsers}
      />
    </div>
  );
}
