"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function NewsletterForm() {
  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="flex gap-3"
    >
      <Input
        type="email"
        placeholder="Enter your email"
        className="h-11 flex-1 bg-background/50 border-border/50"
      />
      <Button type="submit" className="h-11 px-5">
        Subscribe
      </Button>
    </form>
  );
}
