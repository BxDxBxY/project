import { NextRequest, NextResponse } from "next/server";
const BACKEND_URL = process.env.BACKEND_URL!;

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const res = await fetch(`${BACKEND_URL}/contact/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(json),
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json(
      { message: "Failed to send contact form" },
      { status: 500 },
    );
  }
}
