import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // Get refresh token from httpOnly cookie
    const refreshToken = req.cookies.get("refresh_token")?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { detail: "Refresh token not found" },
        { status: 401 },
      );
    }

    const res = await fetch(`${process.env.BACKEND_URL}/auth/token/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      return NextResponse.json(errorData, { status: res.status });
    }

    const data = await res.json();

    // Set new httpOnly cookies
    const response = NextResponse.json({ success: true }, { status: 200 });

    response.cookies.set("access_token", data.access, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 5, // 5 minutes
    });

    // Update refresh token if provided
    if (data.refresh) {
      response.cookies.set("refresh_token", data.refresh, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });
    }

    return response;
  } catch (error) {
    return NextResponse.json(
      { detail: "Internal server error" },
      { status: 500 },
    );
  }
}
