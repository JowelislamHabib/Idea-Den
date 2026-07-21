"use client";

import { useSession } from "@/lib/auth-client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SlideUp } from "@/components/ui/motion-wrapper";
import { Crown, Loader2, ExternalLink, Receipt, ArrowRight } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface SubscriptionData {
  subscriptionId: string | null;
  status: string | null;
  currentPeriodEnd: string | null;
  isPro: boolean;
  stripeCustomerId: string | null;
}

interface Invoice {
  id: string;
  amount: number;
  currency: string;
  status: string | null;
  hostedUrl: string | null;
  pdfUrl: string | null;
  date: string;
}

export default function SubscriptionPage() {
  const { data: session } = useSession();

  const { data: sub, isPending: subLoading } = useQuery({
    queryKey: ["subscription"],
    queryFn: async () => {
      const res = await fetch("/api/stripe/subscription");
      if (!res.ok) throw new Error("Failed to fetch subscription");
      return res.json() as Promise<SubscriptionData>;
    },
    enabled: !!session?.user,
  });

  const { data: invData, isPending: invLoading } = useQuery({
    queryKey: ["invoices"],
    queryFn: async () => {
      const res = await fetch("/api/stripe/invoices");
      if (!res.ok) throw new Error("Failed to fetch invoices");
      return res.json() as Promise<{ invoices: Invoice[] }>;
    },
    enabled: !!session?.user && (sub?.isPro || false),
  });

  const handlePortal = async () => {
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error(data.error || "Failed to open portal");
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  const glassCardClass = "bg-background/40 backdrop-blur-xl border-white/10 shadow-lg";

  if (subLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const isPro = sub?.isPro || false;
  const invoices = invData?.invoices || [];

  return (
    <>
      <SlideUp>
        <Card className={glassCardClass}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="size-5 text-amber-500" />
              Current Plan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-2xl font-bold">
                    {isPro ? "Pro" : "Free"}
                  </span>
                  {isPro ? (
                    <Badge
                      className={
                        sub?.status === "cancel_at_period_end"
                          ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30"
                          : sub?.status === "past_due"
                            ? "bg-destructive/15 text-destructive border-destructive/30"
                            : "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                      }
                    >
                      {sub?.status === "cancel_at_period_end"
                        ? "Cancels at period end"
                        : sub?.status === "past_due"
                          ? "Past Due"
                          : sub?.status === "canceled"
                            ? "Canceled"
                            : "Active"}
                    </Badge>
                  ) : (
                    <Badge variant="secondary">Current</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {isPro
                    ? sub?.status === "cancel_at_period_end"
                      ? sub?.currentPeriodEnd
                        ? `Access until ${new Date(sub.currentPeriodEnd).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`
                        : "Cancels at end of billing period"
                      : sub?.currentPeriodEnd
                        ? `Renews on ${new Date(sub.currentPeriodEnd).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`
                        : "Unlimited access to all features"
                    : "3 ideas/day, 3 blogs/day, public content only"}
                </p>
              </div>
              <div className="flex gap-2">
                {isPro ? (
                  <Button
                    variant="outline"
                    className="rounded-full"
                    onClick={handlePortal}
                  >
                    <ExternalLink className="size-4 mr-1.5" />
                    Manage Subscription
                  </Button>
                ) : (
                  <Link href="/pricing">
                    <Button className="rounded-full">
                      Upgrade to Pro <ArrowRight className="size-4 ml-1" />
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </SlideUp>

      <SlideUp delay={0.1} className="mt-6">
        <Card className={glassCardClass}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Receipt className="size-5" />
              Payment History
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!isPro ? null : invLoading ? (
              <div className="flex items-center justify-center h-32">
                <Loader2 className="size-5 animate-spin text-muted-foreground" />
              </div>
            ) : invoices.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground text-sm">
                {isPro
                  ? "No invoices yet. Your first invoice will appear after your first billing cycle."
                  : "Payment history will appear here after upgrading to Pro."}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/40">
                      <th className="text-left pb-3 font-medium text-muted-foreground">Date</th>
                      <th className="text-left pb-3 font-medium text-muted-foreground">Amount</th>
                      <th className="text-left pb-3 font-medium text-muted-foreground">Status</th>
                      <th className="text-right pb-3 font-medium text-muted-foreground">Invoice</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.map((inv) => (
                      <tr key={inv.id} className="border-b border-border/20">
                        <td className="py-3">{new Date(inv.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</td>
                        <td className="py-3">${inv.amount.toFixed(2)}</td>
                        <td className="py-3">
                          <Badge
                            variant="outline"
                            className={
                              inv.status === "paid"
                                ? "text-emerald-500 border-emerald-500/30"
                                : "text-muted-foreground"
                            }
                          >
                            {inv.status === "paid" ? "Paid" : inv.status || "Unknown"}
                          </Badge>
                        </td>
                        <td className="py-3 text-right">
                          {inv.hostedUrl && (
                            <a
                              href={inv.hostedUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline inline-flex items-center gap-1"
                            >
                              View <ExternalLink className="size-3" />
                            </a>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </SlideUp>
    </>
  );
}
