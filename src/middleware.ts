import { NextResponse, NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const access = request.cookies.get("access_token")?.value;
  const refresh = request.cookies.get("refresh_token")?.value;
  const { pathname } = request.nextUrl;
  const isAdminRoute = pathname.startsWith("/admin");

  // Allow non-admin routes and /admin/login without checks
  if (!isAdminRoute || pathname === "/admin/login") {
    return NextResponse.next();
  }

  // If no access token, try to refresh or redirect to login
  if (!access) {
    if (refresh) {
      // Attempt to refresh the token
      try {
        const refreshRes = await fetch(
          new URL("/api/auth/token/refresh/", request.url),
          {
            method: "POST",
            headers: {
              Cookie: `refresh_token=${refresh}`,
            },
          },
        );

        if (refreshRes.ok) {
          // Token refreshed successfully, forward the new cookies
          const response = NextResponse.next();

          // Copy the new cookies from refresh response
          const setCookieHeader = refreshRes.headers.get("set-cookie");
          if (setCookieHeader) {
            response.headers.set("set-cookie", setCookieHeader);
          }

          return response;
        }
      } catch (error) {
        // Refresh failed, redirect to login
      }
    }

    // No valid tokens, redirect to login
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  // Verify the access token is valid
  try {
    const verifyRes = await fetch(
      `${process.env.BACKEND_URL}/auth/token/verify/`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: access }),
      },
    );

    if (!verifyRes.ok) {
      // Token invalid, try to refresh
      if (refresh) {
        try {
          const refreshRes = await fetch(
            new URL("/api/auth/token/refresh/", request.url),
            {
              method: "POST",
              headers: {
                Cookie: `refresh_token=${refresh}`,
              },
            },
          );

          if (refreshRes.ok) {
            const response = NextResponse.next();
            const setCookieHeader = refreshRes.headers.get("set-cookie");
            if (setCookieHeader) {
              response.headers.set("set-cookie", setCookieHeader);
            }
            return response;
          }
        } catch (error) {
          // Refresh failed
        }
      }

      // Cannot refresh, redirect to login
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  } catch (error) {
    // Verification failed, redirect to login
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  // Token is valid, allow access
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
