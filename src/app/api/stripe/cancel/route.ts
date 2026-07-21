import { NextResponse } from "next/server";
import { getTokenServer } from "@/lib/getTokenServer";

export async function POST() {
  try {
    const token = await getTokenServer();
    const apiBase = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8000";

    const res = await fetch(`${apiBase}/api/stripe/cancel`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      cache: "no-store",
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.ok ? 200 : 400 });
  } catch (err: any) {
    console.error("Cancel subscription error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
