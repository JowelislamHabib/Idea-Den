import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { getTokenServer } from "@/lib/getTokenServer";

export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const token = await getTokenServer();
    const apiBase = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8000";
    const profileRes = await fetch(`${apiBase}/api/users/profile`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      cache: "no-store",
    });

    if (!profileRes.ok) {
      return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
    }

    const profileData = await profileRes.json();
    const user = profileData.user || {};

    let status = user.subscriptionStatus || null;
    let currentPeriodEnd = user.currentPeriodEnd || null;
    let subscriptionId = user.stripeSubscriptionId || null;

    if (subscriptionId) {
      try {
        const raw = await stripe.subscriptions.retrieve(subscriptionId);
        const sub = raw as any;
        const periodEnd = sub.items?.data?.[0]?.current_period_end ?? sub.current_period_end;
        status = sub.status === "active"
          ? sub.cancel_at_period_end ? "cancel_at_period_end" : "active"
          : sub.status;
        if (periodEnd && periodEnd > 1000000000) {
          currentPeriodEnd = new Date(periodEnd * 1000).toISOString();
        }
      } catch {
        // use DB fallback
      }
    }

    return NextResponse.json({
      isPro: user.role === "pro",
      subscriptionId,
      status,
      currentPeriodEnd,
      stripeCustomerId: user.stripeCustomerId || null,
    });
  } catch (err: any) {
    console.error("Subscription fetch error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
