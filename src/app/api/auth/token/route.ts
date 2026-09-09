import { NextResponse } from "next/server";
import { loginRateLimiter, getClientIp } from "@/lib/rateLimit";
import { loginSchema, validateSchema } from "@/lib/validations";

export async function POST(req: Request) {
  try {
    // Rate limiting
    const ip = getClientIp(req);
    const rateLimitResult = loginRateLimiter.check(ip);

    if (!rateLimitResult.success) {
      const resetDate = new Date(rateLimitResult.reset);
      return NextResponse.json(
        {
          detail: "Too many login attempts. Please try again later.",
          retryAfter: Math.ceil((rateLimitResult.reset - Date.now()) / 1000),
        },
        {
          status: 429,
          headers: {
            "Retry-After": Math.ceil(
              (rateLimitResult.reset - Date.now()) / 1000,
            ).toString(),
            "X-RateLimit-Limit": "5",
            "X-RateLimit-Remaining": rateLimitResult.remaining.toString(),
            "X-RateLimit-Reset": resetDate.toISOString(),
          },
        },
      );
    }

    const body = await req.json();

    // Input validation
    const validation = validateSchema(loginSchema, body);
    if (!validation.success) {
      return NextResponse.json(
        {
          detail: "Validation failed",
          errors: validation.errors,
        },
        { status: 400 },
      );
    }

    const res = await fetch(`${process.env.BACKEND_URL}/auth/token/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validation.data),
    });

    if (!res.ok) {
      const errorData = await res.json();
      return NextResponse.json(errorData, { status: res.status });
    }

    const data = await res.json();

    // Set httpOnly cookies for security - prevents XSS attacks
    const response = NextResponse.json({ success: true }, { status: 200 });

    response.cookies.set("access_token", data.access, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 5, // 5 minutes
    });

    response.cookies.set("refresh_token", data.refresh, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { detail: "Internal server error" },
      { status: 500 },
    );
  }
}
