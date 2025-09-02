import { NextResponse, NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const access = request.cookies.get("access_token")?.value;
  const refresh = request.cookies.get("refresh_token")?.value;
  const { pathname } = request.nextUrl;
  const isAdminRoute = pathname.startsWith("/admin");

  // console.log("Middleware triggered for:", pathname);
  // console.log("Access token:", access ? "present" : "missing");
  // console.log("Refresh token:", refresh ? "present" : "missing");

  // Allow non-admin routes and /admin/login without checks
  if (!isAdminRoute || pathname === "/admin/login") {
    return NextResponse.next();
  }

  // If no tokens, redirect to login
  if (!access && !refresh) {
    console.log("No tokens found, redirecting to login");
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  // Tokens present, allow access to admin routes
  // console.log("Tokens present, proceeding to admin route");
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
