import { apiClient } from "./apiClient";
import { LoginCredentials } from "@/types";

// Login now returns success status, tokens are set as httpOnly cookies
export const login = async (
  credentials: LoginCredentials,
): Promise<{ success: boolean }> => {
  return apiClient.request<{ success: boolean }>({
    method: "POST",
    url: "/auth/token/",
    data: credentials,
  });
};

// Refresh token is now handled automatically by reading from httpOnly cookie
export const refreshToken = async (): Promise<{ success: boolean }> => {
  return apiClient.request<{ success: boolean }>({
    method: "POST",
    url: "/auth/token/refresh/",
  });
};

export const verifyToken = (token: string) =>
  apiClient.request<{ detail?: string; code?: string }>({
    method: "POST",
    url: "/auth/token/verify/",
    data: { token },
  });

export const logout = async (): Promise<void> => {
  await fetch("/api/auth/logout", { method: "POST" });
};

export const withRetry = async <T>(
  fn: () => Promise<T>,
  retries = 3,
  delay = 1000,
): Promise<T> => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err: any) {
      if (attempt === retries || !err.message.includes("Network Error")) {
        throw err;
      }
      await new Promise((resolve) => setTimeout(resolve, delay * attempt));
    }
  }
  throw new Error("Max retries reached");
};
