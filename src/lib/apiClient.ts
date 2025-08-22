import axios, { AxiosInstance, AxiosResponse, AxiosError } from "axios";
import { ApiError, AuthTokens, LoginCredentials } from "@/types";
import { TokenManager } from "./tokenManager";

// Environment-based API URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

interface ErrorResponse {
  code?: string;
  message?: string;
}

// class TokenManager {
//   private static getStorage(): Storage | null {
//     return typeof window !== "undefined" ? window.localStorage : null;
//   }
//   static getAccessToken() { return this.getStorage()?.getItem("accessToken") || null; }
//   static getRefreshToken() { return this.getStorage()?.getItem("refreshToken") || null; }
//   static setTokens(access: string, refresh: string) {
//     const s = this.getStorage(); if (s) { s.setItem("accessToken", access); s.setItem("refreshToken", refresh); }
//   }
//   static clearTokens() {
//     const s = this.getStorage(); if (s) { s.removeItem("accessToken"); s.removeItem("refreshToken"); }
//   }
// }

class ApiClient {
  private client: AxiosInstance;
  private isRefreshing = false;
  private failedQueue: Array<{
    resolve: (value: any) => void;
    reject: (error: any) => void;
  }> = [];

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: { "Content-Type": "application/json" },
      timeout: 10000,
    });
    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.client.interceptors.request.use(
      (config) => {
        const requiresAuth = ["POST", "PUT", "DELETE"].includes(
          config.method?.toUpperCase() || ""
        );
        const authFreeRoutes = ["/auth/token"];

        const isAuthFreeRoute = authFreeRoutes.some((route) =>
          config.url?.includes(route)
        );

        if (requiresAuth && !isAuthFreeRoute) {
          const token = TokenManager.getAccessToken();
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    this.client.interceptors.response.use(
      (res: AxiosResponse) => res,
      async (error: AxiosError) => {
        const originalRequest = error.config as any;

        if (error.response?.status === 401 && !originalRequest._retry) {
          TokenManager.clearTokens();
          if (typeof window !== "undefined")
            window.location.href = "/admin/login";
        }

        return Promise.reject(error);
      }
    );
  }

  async request<T>(config: any): Promise<T> {
    try {
      const response = await this.client(config);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      const apiError: ApiError = {
        message:
          (axiosError.response?.data as any)?.message ||
          axiosError.message ||
          "An error occurred",
        status: axiosError.response?.status || 500,
        details: axiosError.response?.data,
      };
      throw apiError;
    }
  }
}

export const apiClient = new ApiClient();
// export { TokenManager };
