import axios, { AxiosInstance, AxiosResponse, AxiosError } from "axios";
import { ApiError } from "@/types";

// Environment-based API URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

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
      // withCredentials only for authenticated requests, set per-request
    });
    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.client.interceptors.request.use(
      (config) => {
        // Only send credentials for authenticated routes
        const authRoutes = [
          "/dictionary/contact_admin",
          "/dictionary/create_category",
          "/dictionary/create_term",
          "/dictionary/user_list",
          "/dictionary/user_create",
          "/dictionary/user_update",
          "/dictionary/user_delete",
        ];

        const requiresAuth = authRoutes.some((route) =>
          config.url?.includes(route),
        );

        if (requiresAuth) {
          config.withCredentials = true;
        }

        return config;
      },
      (error) => Promise.reject(error),
    );

    this.client.interceptors.response.use(
      (res: AxiosResponse) => res,
      async (error: AxiosError) => {
        const originalRequest = error.config as any;

        // Handle 401 errors with token refresh
        if (error.response?.status === 401 && !originalRequest._retry) {
          if (this.isRefreshing) {
            // Queue the request while refresh is in progress
            return new Promise((resolve, reject) => {
              this.failedQueue.push({ resolve, reject });
            })
              .then(() => this.client(originalRequest))
              .catch((err) => Promise.reject(err));
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            // Attempt to refresh the token
            await fetch("/api/auth/token/refresh/", {
              method: "POST",
              credentials: "include", // Send httpOnly cookies
            });

            // Process queued requests
            this.failedQueue.forEach(({ resolve }) => {
              resolve(this.client(originalRequest));
            });
            this.failedQueue = [];

            // Retry the original request
            return this.client(originalRequest);
          } catch (refreshError) {
            // Refresh failed - clear queue and redirect to login
            this.failedQueue.forEach(({ reject }) => reject(refreshError));
            this.failedQueue = [];

            if (typeof window !== "undefined") {
              window.location.href = "/admin/login";
            }

            return Promise.reject(refreshError);
          } finally {
            this.isRefreshing = false;
          }
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
