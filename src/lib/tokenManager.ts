// TokenManager is now deprecated - tokens are managed server-side via httpOnly cookies
// This file is kept for backward compatibility but should not be used for setting tokens

export class TokenManager {
  // These methods can still read cookies (non-httpOnly cookies are readable)
  // but httpOnly cookies set by the server are NOT accessible via JavaScript
  static getAccessToken(): string | undefined {
    // This will return undefined for httpOnly cookies (which is correct)
    if (typeof document !== "undefined") {
      const match = document.cookie.match(/access_token=([^;]+)/);
      return match ? match[1] : undefined;
    }
    return undefined;
  }

  static getRefreshToken(): string | undefined {
    // This will return undefined for httpOnly cookies (which is correct)
    if (typeof document !== "undefined") {
      const match = document.cookie.match(/refresh_token=([^;]+)/);
      return match ? match[1] : undefined;
    }
    return undefined;
  }

  // DEPRECATED: Tokens are now set server-side via API routes
  // This method should not be used anymore
  static setTokens(_access: string, _refresh: string): void {
    console.warn(
      "TokenManager.setTokens is deprecated. Tokens are now managed server-side.",
    );
  }

  // Clear tokens by calling logout endpoint
  static async clearTokens(): Promise<void> {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (error) {
      console.error("Failed to clear tokens:", error);
    }
  }
}
