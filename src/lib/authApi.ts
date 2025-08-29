import { apiClient } from "./apiClient";
import { LoginCredentials, AuthTokens } from "@/types";

export const login = (credentials: LoginCredentials) =>
  apiClient.request<AuthTokens>({ method: "POST", url: "/auth/token/", data: credentials });

export const refreshToken = (refresh: string) =>
  apiClient.request<AuthTokens>({ method: "POST", url: "/auth/token/refresh/", data: { refresh } });

export const verifyToken = (token: string) =>
  apiClient.request<{ detail?: string; code?: string }>({ method: "POST", url: "/auth/token/verify/", data: { token } });

export const withRetry = async <T>(fn: () => Promise<T>, retries = 3, delay = 1000): Promise<T> => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err: any) {
      if (attempt === retries || !err.message.includes("Network Error")) {
        throw err;
      }
      console.log(`Retry ${attempt}/${retries} for API call`);
      await new Promise((resolve) => setTimeout(resolve, delay * attempt));
    }
  }
  throw new Error("Max retries reached");
};