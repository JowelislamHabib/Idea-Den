import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getTokenServer } from "@/lib/getTokenServer";
import { CheckCircle2, XCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/ui/motion-wrapper";

export const dynamic = "force-dynamic";

export default async function SuccessPage(props: { searchParams: Promise<{ session_id?: string }> }) {
  const { session_id } = await props.searchParams;

  if (!session_id) {
    return (
      <section className="relative py-24 sm:py-28 overflow-hidden">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 text-center">
          <FadeIn>
            <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-destructive/10 mb-6">
              <XCircle className="size-8 text-destructive" />
            </div>
            <h1 className="font-heading text-3xl font-bold tracking-tight mb-3">
              Invalid Session
            </h1>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              No payment session was found. If you believe this is an error, please contact support.
            </p>
            <Link href="/pricing">
              <Button className="rounded-full">
                Back to Pricing <ArrowRight className="size-4 ml-1" />
              </Button>
            </Link>
          </FadeIn>
        </div>
      </section>
    );
  }

  try {
    const checkoutSession = await stripe.checkout.sessions.retrieve(session_id);

    if (checkoutSession.status === "open") {
      return (
        <section className="relative py-24 sm:py-28 overflow-hidden">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 text-center">
            <FadeIn>
              <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-muted mb-6">
                <XCircle className="size-8 text-muted-foreground" />
              </div>
              <h1 className="font-heading text-3xl font-bold tracking-tight mb-3">
                Payment Not Completed
              </h1>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Your payment session is still open. Please complete the checkout process.
              </p>
              <Link href="/pricing">
                <Button className="rounded-full">
                  Back to Pricing <ArrowRight className="size-4 ml-1" />
                </Button>
              </Link>
            </FadeIn>
          </div>
        </section>
      );
    }

    if (checkoutSession.status === "complete") {
      const subscriptionId = checkoutSession.subscription as string | undefined;
      const customerId = checkoutSession.customer as string | undefined;

      try {
        const token = await getTokenServer();
        const apiBase = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8000";

        await fetch(`${apiBase}/api/users/upgrade`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            sessionId: session_id,
            subscriptionId: subscriptionId || null,
            customerId: customerId || null,
          }),
          cache: "no-store",
        });
      } catch (error) {
        console.error("Failed to upgrade user:", error);
      }

      return (
        <section className="relative py-24 sm:py-28 overflow-hidden">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 text-center">
            <FadeIn>
              <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-500/10 mb-6">
                <CheckCircle2 className="size-8 text-emerald-500" />
              </div>
              <h1 className="font-heading text-3xl font-bold tracking-tight mb-3">
                Payment Successful!
              </h1>
              <p className="text-muted-foreground mb-2 max-w-md mx-auto">
                Welcome to IdeaDen Pro! Your subscription is now active.
              </p>
              <p className="text-sm text-muted-foreground mb-8 max-w-md mx-auto">
                You now have unlimited access to all features. Head to your dashboard to start generating.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link href="/dashboard/subscription">
                  <Button className="rounded-full">
                    Manage Subscription <ArrowRight className="size-4 ml-1" />
                  </Button>
                </Link>
                <Link href="/generate/ideas">
                  <Button variant="outline" className="rounded-full">
                    Start Creating
                  </Button>
                </Link>
              </div>
            </FadeIn>
          </div>
        </section>
      );
    }
  } catch (err) {
    console.error("Error verifying payment:", err);
    return (
      <section className="relative py-24 sm:py-28 overflow-hidden">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 text-center">
          <FadeIn>
            <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-destructive/10 mb-6">
              <XCircle className="size-8 text-destructive" />
            </div>
            <h1 className="font-heading text-3xl font-bold tracking-tight mb-3">
              Error Verifying Payment
            </h1>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              There was an issue verifying your payment. Your account may already be upgraded. Please check your dashboard.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/dashboard/subscription">
                <Button className="rounded-full">
                  View Subscription <ArrowRight className="size-4 ml-1" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button variant="outline" className="rounded-full">
                  Back to Pricing
                </Button>
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    );
  }

  return (
    <section className="relative py-24 sm:py-28 overflow-hidden">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 text-center">
        <FadeIn>
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-muted mb-6">
            <XCircle className="size-8 text-muted-foreground" />
          </div>
          <h1 className="font-heading text-3xl font-bold tracking-tight mb-3">
            Unexpected Error
          </h1>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Something unexpected happened. Please contact support if the issue persists.
          </p>
          <Link href="/pricing">
            <Button className="rounded-full">
              Back to Pricing <ArrowRight className="size-4 ml-1" />
            </Button>
          </Link>
        </FadeIn>
      </div>
    </section>
  );
}
