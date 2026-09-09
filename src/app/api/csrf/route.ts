import { NextResponse } from "next/server";
import { generateCsrfToken } from "@/lib/csrf";

/**
 * GET /api/csrf - Get CSRF token
 * This endpoint generates and returns a CSRF token
 */
export async function GET() {
  const token = generateCsrfToken();

  const response = NextResponse.json({ csrfToken: token }, { status: 200 });

  // Set CSRF token as httpOnly cookie
  response.cookies.set("csrf_token", token, {
    httpOnly: false, // Must be readable by JavaScript to send in headers
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24, // 24 hours
  });

  return response;
}
