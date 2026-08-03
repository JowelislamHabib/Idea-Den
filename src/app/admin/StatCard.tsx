import Link from "next/link";
import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: LucideIcon;
  color: "blue" | "emerald" | "orange" | "purple" | "red" | "pink";
  link: {
    href: string;
    text: string;
  };
}

const colorMap = {
  blue: "text-blue-500 bg-blue-500/10",
  emerald: "text-emerald-500 bg-emerald-500/10",
  orange: "text-orange-500 bg-orange-500/10",
  purple: "text-purple-500 bg-purple-500/10",
  red: "text-red-500 bg-red-500/10",
  pink: "text-pink-500 bg-pink-500/10",
};

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  color,
  link,
}: StatCardProps) {
  return (
    <Card className="overflow-hidden border-none shadow-sm dark:bg-slate-900/50">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              {title}
            </p>
            <h2 className="text-3xl font-bold mt-2">{value}</h2>
          </div>
          <div className={`p-3 rounded-xl ${colorMap[color]}`}>
            <Icon className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <p className="text-xs text-muted-foreground">{description}</p>
          <Link
            href={link.href}
            className="text-xs font-semibold hover:underline"
            style={{ color: `var(--${color}-500)` }}
          >
            {link.text} &rarr;
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
