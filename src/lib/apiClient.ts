import axios, { AxiosInstance, AxiosResponse, AxiosError } from "axios";
import { ApiError } from "@/types";
import { TokenManager } from "./tokenManager";

// On the server (SSR), use BACKEND_URL directly because relative URLs fail in Node.js.
// In the browser, use the same-origin /api proxy.
const API_BASE_URL =
  typeof window === "undefined"
    ? process.env.BACKEND_URL || "http://localhost:8000"
    : process.env.NEXT_PUBLIC_API_URL || "/api";

class ApiClient {
  private client: AxiosInstance;

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
          config.method?.toUpperCase() || "",
        );
        const authFreeRoutes = ["/auth/token", "/dictionary/contact"];
        const isContactAdminGet =
          config.method?.toUpperCase() === "GET" &&
          config.url?.includes("/dictionary/contact_admin");
        const isTerminsAdminGet =
          config.method?.toUpperCase() === "GET" &&
          config.url?.includes("/dictionary/create_term");

        const isAuthFreeRoute = authFreeRoutes.some((route) => {
          return config.url?.includes(route);
        });

        if (
          (requiresAuth && !isAuthFreeRoute) ||
          isContactAdminGet ||
          isTerminsAdminGet
        ) {
          const token = TokenManager.getAccessToken();
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }

        return config;
      },
      (error) => Promise.reject(error),
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
      },
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
          (axiosError.response?.data as any)?.detail ||
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
