"use client";

import { Pie, PieChart, Cell, ResponsiveContainer, Tooltip } from "recharts";

export default function AdminPieChart({ data, nameKey, dataKey }: { data: any[], nameKey: string, dataKey: string }) {
  return (
    <div className="h-full w-full aspect-auto min-h-[250px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <defs>
            <filter id="glass-shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#000000" floodOpacity="0.1" />
            </filter>
          </defs>
          <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', backgroundColor: '#1e293b', color: '#fff' }} />
          <Pie
            data={data}
            dataKey={dataKey}
            nameKey={nameKey}
            innerRadius={0}
            stroke="none"
            filter="url(#glass-shadow)"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
