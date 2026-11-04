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

  // If no tokens, redirect to login.
  //
  // The destination is built from the proxy headers rather than from
  // `request.url`. Inside middleware `request.url` carries the address this
  // server is bound to (127.0.0.1:3000), not the public hostname, so
  // `new URL("/admin/login", request.url)` sent visitors to
  // https://localhost:3000/admin/login and the admin panel was unreachable
  // through lugat.uwed.uz. Next.js rejects a relative Location with
  // ERR_INVALID_URL, so an absolute one it has to be — just not that one.
  //
  // nginx sets X-Forwarded-Proto and X-Forwarded-Host on every proxied
  // request; Host is the fallback when something reaches this server directly.
  if (!access && !refresh) {
    const forwardedHost = request.headers.get("x-forwarded-host");
    const host = forwardedHost || request.headers.get("host");
    const proto =
      request.headers.get("x-forwarded-proto") ||
      (request.nextUrl.protocol === "https:" ? "https" : "http");

    const target = host
      ? `${proto}://${host}/admin/login`
      : new URL("/admin/login", request.url).toString();

    return NextResponse.redirect(target, 307);
  }

  // Tokens present, allow access to admin routes
  // console.log("Tokens present, proceeding to admin route");
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
