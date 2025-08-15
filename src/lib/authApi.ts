import { apiClient } from "./apiClient";
import { LoginCredentials, AuthTokens } from "@/types";

export const login = (credentials: LoginCredentials) =>
  apiClient.request<AuthTokens>({ method: "POST", url: "/auth/token/", data: credentials });

export const refreshToken = (refresh: string) =>
  apiClient.request<AuthTokens>({ method: "POST", url: "/auth/token/refresh/", data: { refresh } });

export const verifyToken = (token: string) =>
  apiClient.request<{ detail?: string; code?: string }>({ method: "POST", url: "/auth/token/verify/", data: { token } });
