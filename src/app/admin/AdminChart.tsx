"use client";

import { Bar, BarChart, CartesianGrid, XAxis, Cell, ResponsiveContainer, Tooltip } from "recharts";

export default function AdminChart({ data }: { data: any[] }) {
  const colors = [
    "#ef4444", // red-500
    "#06b6d4", // cyan-500
    "#10b981", // emerald-500
    "#84cc16", // lime-500
    "#f59e0b", // amber-500
    "#f97316", // orange-500
    "#ec4899", // pink-500
  ];

  return (
    <div className="h-full w-full aspect-auto min-h-[250px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, bottom: 0, left: 10 }}>
          <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.2} />
          <XAxis
            dataKey="day"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
          />
          <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', border: 'none', backgroundColor: '#1e293b', color: '#fff' }} />
          <Bar dataKey="count" radius={8}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
