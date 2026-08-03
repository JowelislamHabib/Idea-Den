"use client";

import { motion } from "framer-motion";
import { Activity, MessageSquare, ShieldAlert, ShieldCheck, UserCog, Users } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { StatCard } from "./StatCard";

const AdminChart = dynamic(() => import("./AdminChart"), { ssr: false });
const AdminPieChart = dynamic(() => import("./AdminPieChart"), { ssr: false });

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
};

export default function AdminDashboardClient({ 
  firstName, 
  totalUsers, 
  totalIdeas, 
  totalBlogs, 
  totalSubscriptions, 
  registrationActivity, 
  userRolesData, 
  recentIdeas = []
}: any) {
  return (
    <motion.div 
      variants={containerVariants} 
      initial="hidden" 
      animate="show" 
      className="space-y-8"
    >
      
      {/* Hero Welcome Section */}
      <motion.section variants={itemVariants} className="relative overflow-hidden rounded-3xl bg-slate-900 px-8 py-10 text-white shadow-lg">
        <div className="relative z-10">
          <h1 className="font-heading text-4xl sm:text-5xl font-medium">
            Welcome back, {firstName}.
          </h1>
          <p className="mt-2 text-slate-300 text-lg max-w-2xl">
            System operations are running smoothly. You have {totalIdeas} ideas generated and {totalBlogs} blogs created.
          </p>
        </div>
        <div className="absolute -right-10 -top-24 size-64 rounded-full bg-white/5 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 right-32 size-48 rounded-full bg-red-500/10 blur-2xl pointer-events-none" />
      </motion.section>

      {/* Unified Stats & Action Cards */}
      <motion.section variants={itemVariants} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Users"
          value={totalUsers}
          description="Total registered members"
          icon={Users}
          color="blue"
          link={{ href: "/admin/users", text: "Manage Users" }}
        />

        <StatCard
          title="Ideas"
          value={totalIdeas}
          description="Generated project blueprints"
          icon={Activity}
          color="emerald"
          link={{ href: "/admin/ideas", text: "View Ideas" }}
        />

        <StatCard
          title="Blogs"
          value={totalBlogs}
          description="SEO optimized blogs created"
          icon={MessageSquare}
          color="orange"
          link={{ href: "/admin/blogs", text: "Manage Blogs" }}
        />

        <StatCard
          title="Subscriptions"
          value={totalSubscriptions}
          description="Active pro users"
          icon={UserCog}
          color="purple"
          link={{ href: "/admin/subscriptions", text: "View Subs" }}
        />
      </motion.section>

      {/* Main Content Layout */}
      <motion.section variants={itemVariants} className="grid gap-4 lg:grid-cols-4">
        {/* Bar Chart - Spans 2 columns */}
        <article className="lg:col-span-2 rounded-2xl border bg-card p-6 shadow-sm flex flex-col">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-4">
            New Registrations (Last 7 Days)
          </h2>
          <div className="h-[250px] mt-auto">
            <AdminChart data={registrationActivity} />
          </div>
        </article>

        {/* Users Pie Chart */}
        <article className="rounded-2xl border bg-card p-6 shadow-sm flex flex-col items-center">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-2 text-center">
            Users by Role
          </h2>
          <div className="h-[250px] w-full mt-auto">
            <AdminPieChart data={userRolesData} dataKey="count" nameKey="role" />
          </div>
        </article>
      </motion.section>

      {/* Bottom Section - Recent Ideas */}
      <motion.section variants={itemVariants} className="grid gap-4 lg:grid-cols-2">
        {/* Recent Ideas */}
        <article className="min-w-0 rounded-2xl border bg-card p-6 shadow-sm flex flex-col max-h-[400px] lg:h-[400px]">
          <div className="flex items-center justify-between mb-4 shrink-0">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">
              Recent Ideas Generated
            </h2>
            <Link href="/admin/ideas" className="text-[10px] font-bold uppercase tracking-wider text-red-600 hover:text-red-700 transition-colors">View All</Link>
          </div>
          <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
            {recentIdeas.length > 0 ? (
              recentIdeas.map((idea: any) => (
                <div key={idea._id} className="flex items-center justify-between gap-3 rounded-xl border bg-slate-50/50 p-3 dark:bg-slate-900/20 hover:bg-slate-100/50 dark:hover:bg-slate-800/30 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                      <Activity className="size-4" />
                    </div>
                    <div className="overflow-hidden">
                      <p className="truncate text-sm font-semibold text-foreground">
                        {idea.title || "Untitled Idea"}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {idea.niche || "Unknown Niche"}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex h-full flex-col items-center justify-center rounded-xl border border-dashed p-6 text-center bg-slate-50/50 dark:bg-slate-900/10">
                <ShieldCheck className="size-8 text-emerald-500/50 mb-3" />
                <p className="text-sm font-medium text-foreground">All caught up!</p>
                <p className="text-xs text-muted-foreground mt-1">
                  No ideas generated recently.
                </p>
              </div>
            )}
          </div>
        </article>
      </motion.section>
    </motion.div>
  );
}
