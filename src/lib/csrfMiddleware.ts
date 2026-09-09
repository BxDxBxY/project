import { NextRequest, NextResponse } from "next/server";
import {
  getCsrfTokenFromCookie,
  getCsrfTokenFromHeader,
  validateCsrfToken,
} from "@/lib/csrf";

/**
 * CSRF Protection Middleware
 * Validates CSRF tokens for state-changing requests (POST, PUT, DELETE, PATCH)
 */
export function csrfProtection(
  handler: (req: NextRequest) => Promise<NextResponse>,
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    const method = req.method.toUpperCase();

    // Only check CSRF for state-changing methods
    if (["POST", "PUT", "DELETE", "PATCH"].includes(method)) {
      // Skip CSRF check for login endpoint (chicken-egg problem)
      const pathname = req.nextUrl.pathname;
      if (pathname === "/api/auth/token" || pathname === "/api/csrf") {
        return handler(req);
      }

      const cookieToken = getCsrfTokenFromCookie(req);
      const headerToken = getCsrfTokenFromHeader(req);

      if (!validateCsrfToken(cookieToken, headerToken)) {
        return NextResponse.json(
          { message: "CSRF token validation failed" },
          { status: 403 },
        );
      }
    }

    return handler(req);
  };
}
