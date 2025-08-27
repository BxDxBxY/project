// src/middleware.ts
import { NextResponse, NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const access = request.cookies.get("access_token")?.value;
  const refresh = request.cookies.get("refresh_token")?.value;

  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");

  if (!isAdminRoute) return NextResponse.next();

  if (!access && !refresh) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  // Optionally: call backend verify/refresh here
  try {
    const res = await fetch(`${process.env.API_URL}/auth/verify`, {
      method: "POST",
      headers: { Authorization: `Bearer ${access}` },
    });

    if (!res.ok && refresh) {
      const refreshRes = await fetch(`${process.env.API_URL}/auth/refresh`, {
        method: "POST",
        headers: { Authorization: `Bearer ${refresh}` },
      });

      if (refreshRes.ok) {
        const data = await refreshRes.json();
        const response = NextResponse.next();
        response.cookies.set("access_token", data.access, { httpOnly: true });
        return response;
      }
    }
    if (!res.ok) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  } catch (err) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
