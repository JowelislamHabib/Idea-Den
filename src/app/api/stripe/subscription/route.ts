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
        const sub: any = await stripe.subscriptions.retrieve(subscriptionId);
        status = sub.status === "active"
          ? sub.cancel_at_period_end ? "cancel_at_period_end" : "active"
          : sub.status;
        currentPeriodEnd = new Date(sub.current_period_end * 1000).toISOString();
      } catch {
        // Stripe fetch failed — use DB values as fallback
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
