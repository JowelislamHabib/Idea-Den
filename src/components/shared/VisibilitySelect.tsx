"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function VisibilitySelect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  return (
    <Select 
      value={searchParams.get("visibility") || "all"} 
      onValueChange={(val: string | null) => {
        if (!val) return;
        const params = new URLSearchParams(searchParams.toString());
        if (val === "all") params.delete("visibility");
        else params.set("visibility", val);
        params.set("page", "1");
        router.push(`${pathname}?${params.toString()}`);
      }}
    >
      <SelectTrigger className="w-[140px] h-9 capitalize">
        <SelectValue placeholder="Visibility" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all" className="capitalize">All Visibility</SelectItem>
        <SelectItem value="public" className="capitalize">Public</SelectItem>
        <SelectItem value="private" className="capitalize">Private</SelectItem>
      </SelectContent>
    </Select>
  );
}
