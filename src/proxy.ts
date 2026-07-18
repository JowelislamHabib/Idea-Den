import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const { pathname } = request.nextUrl;
  const isAuthPage = pathname === "/login" || pathname === "/register";

  // Logged-in users cannot browse /login or /register
  if (isAuthPage) {
    if (session) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  // Auth-gated routes for IdeaDen
  const isProtectedRoute =
    pathname.startsWith("/dashboard") || pathname.startsWith("/generate");
    
  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Admin route protection
  const isAdminRoute = pathname.startsWith("/admin");
  if (isAdminRoute) {
    if (!session) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    const role = session.user?.role;
    if (role !== "admin") {
      // Redirect non-admins to the home page or a not-authorized page
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/dashboard",
    "/generate/:path*",
    "/generate",
    "/admin/:path*",
    "/admin",
    "/login",
    "/register",
  ],
};
