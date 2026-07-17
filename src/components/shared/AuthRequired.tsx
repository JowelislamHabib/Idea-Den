"use client";

import { buttonVariants } from "@/components/ui/button";
import { Lock } from "lucide-react";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";

interface AuthRequiredProps {
  title?: string;
  description?: string;
  redirectUrl?: string;
}

export function AuthRequired({
  title = "Authentication Required",
  description = "You need to be logged in to access this page.",
  redirectUrl = "/",
}: AuthRequiredProps) {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center border rounded-lg bg-card max-w-sm mx-auto shadow-sm">
        <div className="h-10 w-10 rounded-full bg-muted animate-pulse mb-3" />
        <div className="h-5 w-40 bg-muted rounded animate-pulse mb-2" />
        <div className="h-4 w-56 bg-muted rounded animate-pulse" />
      </div>
    );
  }

  if (session?.user) return null;

  return (
    <div className="flex flex-col items-center justify-center p-6 text-center border rounded-lg bg-card max-w-sm mx-auto shadow-sm">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted mb-3">
        <Lock className="h-5 w-5 text-muted-foreground" />
      </div>
      <h3 className="text-base font-semibold tracking-tight">{title}</h3>
      <p className="text-sm text-muted-foreground mt-1 mb-5 leading-relaxed">
        {description}
      </p>
      <div className="flex w-full flex-col gap-2">
        <Link href={`/login?redirect=${redirectUrl}`} className={buttonVariants({ className: "w-full h-9" })}>
          Sign in
        </Link>
        <Link href={`/register?redirect=${redirectUrl}`} className={buttonVariants({ variant: "outline", className: "w-full h-9" })}>
          Create account
        </Link>
      </div>
    </div>
  );
}
