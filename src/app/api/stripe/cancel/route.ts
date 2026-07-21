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

    let data;
    try {
      data = await res.json();
    } catch {
      data = { error: `Backend returned ${res.status}: ${res.statusText}` };
    }
    return NextResponse.json(data, { status: res.ok ? 200 : data.error ? 400 : res.status });
  } catch (err: any) {
    console.error("Cancel subscription error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
