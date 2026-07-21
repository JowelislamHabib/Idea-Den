import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { auth } from "@/lib/auth";
import { getTokenServer } from "@/lib/getTokenServer";

export async function POST() {
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
    const stripeCustomerId = profileData.user?.stripeCustomerId;

    if (!stripeCustomerId) {
      return NextResponse.json({ error: "No subscription found" }, { status: 400 });
    }

    const headersList = await headers();
    const origin = headersList.get("origin") || "http://localhost:3000";

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: `${origin}/dashboard/subscription`,
    });

    return NextResponse.json({ url: portalSession.url });
  } catch (err: any) {
    console.error("Stripe portal error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
