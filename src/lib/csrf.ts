import { randomBytes } from "crypto";

const CSRF_TOKEN_LENGTH = 32;
const CSRF_COOKIE_NAME = "csrf_token";

/**
 * Generate a cryptographically secure CSRF token
 */
export function generateCsrfToken(): string {
  return randomBytes(CSRF_TOKEN_LENGTH).toString("hex");
}

/**
 * Validate CSRF token from request
 */
export function validateCsrfToken(
  cookieToken: string | undefined,
  headerToken: string | undefined,
): boolean {
  if (!cookieToken || !headerToken) {
    return false;
  }

  // Constant-time comparison to prevent timing attacks
  if (cookieToken.length !== headerToken.length) {
    return false;
  }

  let result = 0;
  for (let i = 0; i < cookieToken.length; i++) {
    result |= cookieToken.charCodeAt(i) ^ headerToken.charCodeAt(i);
  }

  return result === 0;
}

/**
 * Get CSRF token from request cookies
 */
export function getCsrfTokenFromCookie(request: Request): string | undefined {
  const cookieHeader = request.headers.get("cookie");
  if (!cookieHeader) return undefined;

  const cookies = cookieHeader.split(";").map((c) => c.trim());
  const csrfCookie = cookies.find((c) => c.startsWith(`${CSRF_COOKIE_NAME}=`));

  if (!csrfCookie) return undefined;

  return csrfCookie.split("=")[1];
}

/**
 * Get CSRF token from request header
 */
export function getCsrfTokenFromHeader(request: Request): string | undefined {
  return request.headers.get("x-csrf-token") || undefined;
}

/**
 * Set CSRF token cookie in response
 */
export function setCsrfCookie(response: Response, token: string): void {
  const isProduction = process.env.NODE_ENV === "production";

  response.headers.append(
    "Set-Cookie",
    `${CSRF_COOKIE_NAME}=${token}; Path=/; SameSite=Strict; ${isProduction ? "Secure;" : ""} Max-Age=86400`,
  );
}

export { CSRF_COOKIE_NAME };
