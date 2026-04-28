import { NextRequest, NextResponse } from "next/server";
import { LRUCache } from "lru-cache";

const BACKEND_URL = process.env.BACKEND_URL!;
const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY;

// Rate limiting cache: 5 requests per IP per hour
const rateLimitCache = new LRUCache<string, number>({
  max: 500, // max 500 IPs
  ttl: 1000 * 60 * 60, // 1 hour
});

export async function POST(req: NextRequest) {
  try {
    const ip =
      req.headers.get("x-forwarded-for") ||
      req.headers.get("x-real-ip") ||
      "127.0.0.1";

    // Check rate limit
    const currentCount = rateLimitCache.get(ip) || 0;
    if (currentCount >= 5) {
      return NextResponse.json(
        {
          message:
            "Siz juda ko'p so'rov yubordingiz. Iltimos, keyinroq qayta urinib ko'ring.",
        },
        { status: 429 },
      );
    }

    const json = await req.json();
    const { recaptchaToken, ...data } = json;

    // Verify reCAPTCHA
    if (RECAPTCHA_SECRET_KEY && RECAPTCHA_SECRET_KEY !== "dummy_secret") {
      if (!recaptchaToken) {
        return NextResponse.json(
          { message: "reCAPTCHA token missing" },
          { status: 400 },
        );
      }

      const verifyRes = await fetch(
        "https://www.google.com/recaptcha/api/siteverify",
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: `secret=${RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`,
        },
      );
      const verifyData = await verifyRes.json();
      if (!verifyData.success) {
        return NextResponse.json(
          { message: "reCAPTCHA verification failed. Bot suspected." },
          { status: 403 },
        );
      }
    }

    // Increment rate limit count
    rateLimitCache.set(ip, currentCount + 1);

    // Forward to backend
    const res = await fetch(`${BACKEND_URL}/contact/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error("Backend failed to save contact");
    }

    const resData = await res.json();
    return NextResponse.json(resData, { status: res.status });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json(
      { message: "Failed to send contact form" },
      { status: 500 },
    );
  }
}
