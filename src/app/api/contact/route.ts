import { NextRequest, NextResponse } from "next/server";
import { LRUCache } from "lru-cache";

/**
 * Public contact form endpoint.
 *
 * The browser only ever talks to this same-origin route — the Django address
 * is never exposed (see CLAUDE.md). Everything that must not be trusted to a
 * client happens here: the reCAPTCHA secret, the per-IP rate limit, and the
 * decision about which backend errors are safe to echo back.
 *
 * It lives at /api/contact rather than under the catch-all proxy on purpose:
 * a static segment wins over [...path], so the allowlisted proxy never sees
 * this request and the captcha check cannot be skipped by calling
 * /api/dictionary/contact/ directly — that path is not in ALLOWED_ROUTES.
 */

const BACKEND_URL = process.env.BACKEND_URL || "http://127.0.0.1:8000";
const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY;

const WINDOW_MS = 1000 * 60 * 60;
const MAX_PER_WINDOW = 5;
/**
 * Messages that arrived without a usable captcha token still get through —
 * Google being down, or the site key being the wrong reCAPTCHA version, must
 * not silence the academy's only contact channel — but far fewer of them.
 */
const MAX_UNVERIFIED_PER_WINDOW = 2;

const rateLimitCache = new LRUCache<string, number>({
  max: 1000,
  ttl: WINDOW_MS,
});

const clientIp = (req: NextRequest): string => {
  const forwarded = req.headers.get("x-forwarded-for");
  // nginx appends; the first entry is the original client.
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "unknown";
};

const MESSAGES = {
  rateLimited:
    "Siz juda koʻp soʻrov yubordingiz. Iltimos, bir oz vaqtdan soʻng qayta urinib koʻring.",
  captchaFailed:
    "Spamdan himoya tekshiruvidan oʻtmadi. Iltimos, qayta urinib koʻring.",
  invalidBody: "Soʻrov notoʻgʻri shakllantirilgan.",
  upstream:
    "Xabarni saqlab boʻlmadi. Iltimos, birozdan soʻng qayta urinib koʻring.",
} as const;

export async function POST(req: NextRequest) {
  const ip = clientIp(req);

  const used = rateLimitCache.get(ip) || 0;
  if (used >= MAX_PER_WINDOW) {
    return NextResponse.json({ message: MESSAGES.rateLimited }, { status: 429 });
  }

  let payload: Record<string, unknown>;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ message: MESSAGES.invalidBody }, { status: 400 });
  }

  const { recaptchaToken, ...data } = payload as {
    recaptchaToken?: string;
    [key: string]: unknown;
  };

  // Only enforce the captcha when a real secret is configured; otherwise the
  // form would be unusable on a machine without reCAPTCHA set up.
  const captchaConfigured =
    !!RECAPTCHA_SECRET_KEY && RECAPTCHA_SECRET_KEY !== "dummy_secret";

  let verified = false;

  if (captchaConfigured && recaptchaToken) {
    try {
      const verifyRes = await fetch(
        "https://www.google.com/recaptcha/api/siteverify",
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            secret: RECAPTCHA_SECRET_KEY as string,
            response: recaptchaToken,
            remoteip: ip,
          }).toString(),
          signal: AbortSignal.timeout(8000),
        },
      );
      const verifyData = (await verifyRes.json()) as {
        success?: boolean;
        "error-codes"?: string[];
      };

      if (verifyData.success) {
        verified = true;
      } else {
        // A token that Google actively rejects is the one case worth
        // refusing: it means the client solved nothing.
        console.warn(
          "[contact] reCAPTCHA rejected:",
          verifyData["error-codes"],
        );
        return NextResponse.json(
          { message: MESSAGES.captchaFailed },
          { status: 403 },
        );
      }
    } catch {
      // Google unreachable — treat as unverified rather than as a failure.
      console.warn("[contact] reCAPTCHA verification unreachable");
    }
  }

  // No token at all (script blocked, offline-first load, wrong key version):
  // allowed, but on the stricter budget.
  if (!verified && used >= MAX_UNVERIFIED_PER_WINDOW) {
    return NextResponse.json({ message: MESSAGES.rateLimited }, { status: 429 });
  }

  try {
    const res = await fetch(`${BACKEND_URL}/dictionary/contact/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      cache: "no-store",
      signal: AbortSignal.timeout(15000),
    });

    const body = await res.json().catch(() => null);

    if (!res.ok) {
      // Field-level validation comes straight from the serializer and is
      // written for a person; anything else is replaced with a safe sentence.
      const safe =
        res.status === 400 && body && typeof body === "object"
          ? { message: MESSAGES.upstream, errors: body }
          : { message: MESSAGES.upstream };
      return NextResponse.json(safe, { status: res.status === 400 ? 400 : 502 });
    }

    // Only count messages that were actually stored.
    rateLimitCache.set(ip, used + 1);

    return NextResponse.json(body, { status: 201 });
  } catch (error) {
    console.error("[contact] backend unreachable:", error);
    return NextResponse.json({ message: MESSAGES.upstream }, { status: 503 });
  }
}
