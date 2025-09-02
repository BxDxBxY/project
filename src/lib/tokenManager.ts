import Cookies from "js-cookie";

export class TokenManager {
  static getAccessToken(): string | undefined {
    return Cookies.get("access_token");
  }

  static getRefreshToken(): string | undefined {
    return Cookies.get("refresh_token");
  }

  static setTokens(access: string, refresh: string): void {
    Cookies.set("access_token", access, {
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });
    Cookies.set("refresh_token", refresh, {
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });
  }

  static clearTokens(): void {
    Cookies.remove("access_token", { path: "/" });
    Cookies.remove("refresh_token", { path: "/" });
  }
}
