"use client";

import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Globe, Lock, Crown } from "lucide-react";

interface VisibilityToggleProps {
  visibility: "public" | "private";
  onChange: (v: "public" | "private") => void;
  isPro: boolean;
}

export function VisibilityToggle({ visibility, onChange, isPro }: VisibilityToggleProps) {
  return (
    <div className="flex flex-col gap-3 mt-2">
      <div className="flex items-center gap-2">
        <Label className="font-semibold flex items-center gap-2 text-base">
          <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold shadow-sm">
            {isPro ? "7" : <Crown className="size-3.5" />}
          </div>
          Visibility
        </Label>
        {!isPro && (
          <Badge variant="outline" className="text-xs border-amber-500/40 text-amber-600 dark:text-amber-400 gap-1">
            <Crown className="size-3" />
            Pro
          </Badge>
        )}
      </div>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => isPro && onChange("public")}
          disabled={!isPro}
          className={`flex-1 flex items-center gap-2 rounded-3xl border px-4 py-3 text-sm font-medium transition-all ${
            visibility === "public" && isPro
              ? "border-primary bg-primary/10 text-primary"
              : "border-border bg-background text-muted-foreground hover:bg-muted/50"
          } ${!isPro ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
        >
          <Globe className="size-4" />
          <div className="text-left">
            <div className="font-medium">Public</div>
            <div className="text-xs text-muted-foreground">Visible to everyone</div>
          </div>
        </button>
        <button
          type="button"
          onClick={() => isPro && onChange("private")}
          disabled={!isPro}
          className={`flex-1 flex items-center gap-2 rounded-3xl border px-4 py-3 text-sm font-medium transition-all ${
            visibility === "private" && isPro
              ? "border-primary bg-primary/10 text-primary"
              : "border-border bg-background text-muted-foreground hover:bg-muted/50"
          } ${!isPro ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
        >
          <Lock className="size-4" />
          <div className="text-left">
            <div className="font-medium">Private</div>
            <div className="text-xs text-muted-foreground">Only you can see</div>
          </div>
        </button>
      </div>
      {!isPro && (
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          <Crown className="size-3 text-amber-500" />
          Upgrade to Pro to set content visibility
        </p>
      )}
    </div>
  );
}
