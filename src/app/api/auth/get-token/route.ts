import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const response = await auth.api.getToken({
      headers: await headers(),
    });
    return Response.json({ token: response?.token || null });
  } catch {
    return Response.json({ token: null });
  }
}
