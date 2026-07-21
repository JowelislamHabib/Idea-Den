import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { auth } from "@/lib/auth";
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
    const stripeCustomerId = profileData.user?.stripeCustomerId;

    if (!stripeCustomerId) {
      return NextResponse.json({ invoices: [] });
    }

    const stripeInvoices = await stripe.invoices.list({
      customer: stripeCustomerId,
      limit: 50,
    });

    const invoices = stripeInvoices.data.map((inv) => ({
      id: inv.id,
      amount: inv.amount_paid / 100,
      currency: inv.currency,
      status: inv.status,
      hostedUrl: inv.hosted_invoice_url,
      pdfUrl: inv.invoice_pdf,
      date: new Date(inv.created * 1000).toISOString(),
      periodStart: new Date(inv.period_start * 1000).toISOString(),
      periodEnd: new Date(inv.period_end * 1000).toISOString(),
    }));

    return NextResponse.json({ invoices });
  } catch (err: any) {
    console.error("Invoices fetch error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
