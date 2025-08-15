export class TokenManager {
  private static getStorage(): Storage | null {
    if (typeof window !== "undefined") {
      return window.localStorage;
    }
    return null;
  }

  static getAccessToken(): string | null {
    return this.getStorage()?.getItem("accessToken") || null;
  }

  static getRefreshToken(): string | null {
    return this.getStorage()?.getItem("refreshToken") || null;
  }

  static setTokens(access: string, refresh: string): void {
    const storage = this.getStorage();
    if (storage) {
      storage.setItem("accessToken", access);
      storage.setItem("refreshToken", refresh);
    }
  }

  static clearTokens(): void {
    const storage = this.getStorage();
    if (storage) {
      storage.removeItem("accessToken");
      storage.removeItem("refreshToken");
    }
  }
}
