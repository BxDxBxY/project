import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000";

// Allowlist of safe routes that can be proxied
const ALLOWED_ROUTES = [
  "/auth/token",
  "/auth/token/refresh",
  "/auth/token/verify",
  "/dictionary/category",
  "/dictionary/term",
  "/dictionary/term_detailed",
  "/dictionary/search_term",
  "/dictionary/contact",
  "/dictionary/contact_admin",
  "/dictionary/create_category",
  "/dictionary/create_term",
  "/dictionary/term_photo",
  "/dictionary/user_list",
  "/dictionary/user_create",
  "/dictionary/user_update",
  "/dictionary/user_delete",
];

// Routes that require authentication
const AUTH_REQUIRED_ROUTES = [
  "/dictionary/contact_admin",
  "/dictionary/create_category",
  "/dictionary/create_term",
  "/dictionary/user_list",
  "/dictionary/user_create",
  "/dictionary/user_update",
  "/dictionary/user_delete",
];

// Sensitive headers that should not be forwarded
const BLOCKED_HEADERS = [
  "cookie",
  "authorization",
  "x-forwarded-for",
  "x-real-ip",
  "x-forwarded-proto",
  "x-forwarded-host",
];

export async function GET(req: NextRequest) {
  return proxyRequest(req);
}

export async function POST(req: NextRequest) {
  return proxyRequest(req);
}

export async function PUT(req: NextRequest) {
  return proxyRequest(req);
}

export async function PATCH(req: NextRequest) {
  return proxyRequest(req);
}

export async function DELETE(req: NextRequest) {
  return proxyRequest(req);
}

async function proxyRequest(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  // Extract the path after /api
  const apiPath = pathname.replace(/^\/api/, "");
  const targetUrl = `${BACKEND_URL}${apiPath}${search}`;

  // Normalize path for checking (remove trailing slash and IDs)
  const normalizedPath = apiPath.replace(/\/\d+\/?$/, "").replace(/\/$/, "");

  // Check if route is in allowlist
  const isAllowed = ALLOWED_ROUTES.some((route) => {
    return normalizedPath === route || normalizedPath.startsWith(route + "/");
  });

  if (!isAllowed) {
    return NextResponse.json({ message: "Route not allowed" }, { status: 403 });
  }

  // Check authentication for protected routes
  const requiresAuth = AUTH_REQUIRED_ROUTES.some((route) => {
    return normalizedPath === route || normalizedPath.startsWith(route + "/");
  });

  if (requiresAuth) {
    const accessToken = req.cookies.get("access_token")?.value;
    if (!accessToken) {
      return NextResponse.json(
        { message: "Authentication required" },
        { status: 401 },
      );
    }
  }

  try {
    // Filter headers - only forward safe headers
    const headers = new Headers();
    req.headers.forEach((value, key) => {
      if (!BLOCKED_HEADERS.includes(key.toLowerCase())) {
        headers.set(key, value);
      }
    });

    // Add authentication if available
    const accessToken = req.cookies.get("access_token")?.value;
    if (accessToken) {
      headers.set("Authorization", `Bearer ${accessToken}`);
    }

    // Remove host header to avoid conflicts
    headers.delete("host");

    const fetchOptions: RequestInit = {
      method: req.method,
      headers: headers,
      // Only include body for non-GET/HEAD requests
      body:
        req.method !== "GET" && req.method !== "HEAD"
          ? await req.blob()
          : undefined,
      cache: "no-store",
    };

    const res = await fetch(targetUrl, fetchOptions);
    const data = await res.blob();

    return new NextResponse(data, {
      status: res.status,
      headers: {
        "Content-Type": res.headers.get("Content-Type") || "application/json",
      },
    });
  } catch (error) {
    return NextResponse.json({ message: "Proxy error" }, { status: 500 });
  }
}
