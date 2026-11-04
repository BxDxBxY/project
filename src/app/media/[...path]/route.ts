import { NextResponse } from "next/server";

/**
 * Serve uploaded term photos under the public domain.
 *
 * The API now returns site-relative photo URLs (/media/images/terms/x.jpg) so
 * that the backend's real address never appears in a page. Something has to
 * answer those paths on lugat.uwed.uz, and this route does it without needing
 * an nginx change: it streams the file from Django.
 *
 * An nginx `location /media/ { alias /home/devlugat/backend/media/; }` is the
 * better answer — it skips Node entirely — and once it exists this route
 * simply stops being reached. See deploy/README.md.
 */

const BACKEND_URL = process.env.BACKEND_URL || "http://127.0.0.1:8000";

/** Uploads live under images/; nothing else is reachable through here. */
const ALLOWED_PREFIX = "images/";

const CONTENT_TYPES: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  gif: "image/gif",
  webp: "image/webp",
  svg: "image/svg+xml",
  avif: "image/avif",
};

export async function GET(
  _request: Request,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path } = await context.params;
  const relative = path.join("/");

  // Refuse traversal and anything outside the uploads tree.
  if (
    relative.includes("..") ||
    relative.includes("\\") ||
    !relative.startsWith(ALLOWED_PREFIX)
  ) {
    return new NextResponse("Not found", { status: 404 });
  }

  const extension = relative.split(".").pop()?.toLowerCase() ?? "";
  const contentType = CONTENT_TYPES[extension];
  if (!contentType) {
    return new NextResponse("Not found", { status: 404 });
  }

  try {
    const upstream = await fetch(
      `${BACKEND_URL}/media/${encodeURI(relative)}`,
      { signal: AbortSignal.timeout(15000) },
    );

    if (!upstream.ok || !upstream.body) {
      return new NextResponse("Not found", { status: 404 });
    }

    return new NextResponse(upstream.body, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        // Uploads are content-addressed by Django's random suffix, so a long
        // cache is safe: a replaced photo gets a different filename.
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
