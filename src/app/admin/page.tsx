import { headers } from "next/headers";
import AdminDashboardClient from "./AdminDashboardClient";
import { auth } from "@/lib/auth"; // You might need to check how to get server session for Better Auth.

export default async function AdminDashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  
  const user = session?.user;
  const firstName = user?.name?.split(" ")[0] || "Admin";

  // Mocking data since backend endpoints don't exist yet
  const users = [
    { _id: "1", role: "admin", createdAt: new Date() },
    { _id: "2", role: "free", createdAt: new Date() },
    { _id: "3", role: "pro", createdAt: new Date() },
  ];
  const ideas = [
    { _id: "1", title: "AI Fitness App", niche: "Health", createdAt: new Date() },
    { _id: "2", title: "SaaS Starter Kit", niche: "Developer Tools", createdAt: new Date() },
  ];
  const blogs = [
    { _id: "1", title: "How to build SaaS", createdAt: new Date() },
  ];

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

  const userRolesData = [
    { role: "Admin", count: users.filter(u => u.role === "admin").length, color: "#ef4444" },
    { role: "Pro", count: users.filter(u => u.role === "pro").length, color: "#10b981" },
    { role: "Free", count: users.filter(u => u.role === "free" || !u.role).length, color: "#a855f7" },
  ];

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 pt-20">
      <AdminDashboardClient
        firstName={firstName}
        totalUsers={totalUsers}
        totalIdeas={totalIdeas}
        totalBlogs={totalBlogs}
        totalSubscriptions={totalSubscriptions}
        registrationActivity={registrationActivity}
        userRolesData={userRolesData}
        recentIdeas={ideas}
      />
    </div>
  );
}
