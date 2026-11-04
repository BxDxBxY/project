import axios, { AxiosInstance, AxiosResponse, AxiosError } from "axios";
import { ApiError, ApiErrorKind } from "@/types";
import { TokenManager } from "./tokenManager";

// On the server (SSR), use BACKEND_URL directly because relative URLs fail in Node.js.
// In the browser, use the same-origin /api proxy.
const API_BASE_URL =
  typeof window === "undefined"
    ? process.env.BACKEND_URL || "http://localhost:8000"
    : process.env.NEXT_PUBLIC_API_URL || "/api";

/**
 * Generous but finite. The old 10s cut off slow mobile connections mid-answer
 * and surfaced as an unexplained failure; the dictionary dump alone is ~140 KB.
 */
const REQUEST_TIMEOUT_MS = 25_000;

/** Retries only ever apply to safe, idempotent reads — never to a POST. */
const RETRYABLE_METHODS = ["GET", "HEAD", "OPTIONS"];
const RETRYABLE_STATUS = [408, 425, 429, 500, 502, 503, 504];
const MAX_RETRIES = 3;

/**
 * Endpoints where a 401 is an *answer*, not an expired session.
 *
 * This is the fix for "the admin login page just reloads". The response
 * interceptor used to send the browser to /admin/login on any 401, including
 * the 401 that POST /auth/token/ returns for a wrong password — so the page
 * reloaded before React could render the error, the form reset, and the user
 * saw nothing at all. These routes must be allowed to reject normally.
 */
const AUTH_ENDPOINTS = [
  "/auth/token",
  "/auth/token/refresh",
  "/auth/token/verify",
];

const isAuthEndpoint = (url?: string): boolean =>
  !!url && AUTH_ENDPOINTS.some((route) => url.includes(route));

const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

/** navigator.onLine is only trustworthy when it says `false`. */
export const isOffline = (): boolean =>
  typeof navigator !== "undefined" && navigator.onLine === false;

/**
 * Classify a failure so the UI can show a sentence a visitor understands
 * instead of "Request failed with status code 500".
 */
const classify = (error: AxiosError): ApiErrorKind => {
  if (isOffline()) return "offline";
  if (error.code === "ECONNABORTED" || error.code === "ETIMEDOUT") {
    return "timeout";
  }
  if (!error.response) return "network";

  const status = error.response.status;
  if (status === 401) return "unauthorized";
  if (status === 403) return "forbidden";
  if (status === 404) return "notFound";
  if (status === 429) return "rateLimited";
  if (status >= 500) return "server";
  return "client";
};

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: { "Content-Type": "application/json" },
      timeout: REQUEST_TIMEOUT_MS,
    });
    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.client.interceptors.request.use(
      (config) => {
        const requiresAuth = ["POST", "PUT", "PATCH", "DELETE"].includes(
          config.method?.toUpperCase() || "",
        );
        const authFreeRoutes = ["/auth/token", "/dictionary/contact"];
        const isAdminGet =
          config.method?.toUpperCase() === "GET" &&
          [
            "/dictionary/contact_admin",
            "/dictionary/create_term",
            "/dictionary/user_list",
          ].some((route) => config.url?.includes(route));

        const isAuthFreeRoute = authFreeRoutes.some((route) =>
          config.url?.includes(route),
        );

        if ((requiresAuth && !isAuthFreeRoute) || isAdminGet) {
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
        const originalRequest = error.config as
          | (typeof error.config & { _authRedirected?: boolean })
          | undefined;

        const status = error.response?.status;
        const url = originalRequest?.url;

        // An expired session: drop the tokens and send the editor back to the
        // login page — but only from inside the panel, and never off the back
        // of a login attempt that was simply refused.
        if (
          status === 401 &&
          !isAuthEndpoint(url) &&
          !originalRequest?._authRedirected &&
          typeof window !== "undefined"
        ) {
          if (originalRequest) originalRequest._authRedirected = true;
          TokenManager.clearTokens();
          const { pathname } = window.location;
          if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
            window.location.href = "/admin/login?session=expired";
          }
        }

        return Promise.reject(error);
      },
    );
  }

  /**
   * One request, with bounded retries for transient read failures.
   *
   * A flaky or slow connection is the normal case on this audience's
   * networks, so a dropped GET is retried with exponential backoff rather
   * than thrown straight at the user. Writes are never replayed.
   */
  async request<T>(config: any): Promise<T> {
    const method = (config.method || "GET").toUpperCase();
    const canRetry = RETRYABLE_METHODS.includes(method);
    let lastError: AxiosError | undefined;

    for (let attempt = 0; attempt <= (canRetry ? MAX_RETRIES : 0); attempt++) {
      try {
        const response = await this.client(config);
        return response.data;
      } catch (error) {
        lastError = error as AxiosError;

        const status = lastError.response?.status;
        const transient =
          !lastError.response || // network failure or timeout
          (status !== undefined && RETRYABLE_STATUS.includes(status));

        const hasAttemptsLeft = attempt < MAX_RETRIES;

        // No point retrying while the device is plainly offline: fail fast so
        // the UI can show the offline notice instead of stalling for 25s × 3.
        if (!canRetry || !transient || !hasAttemptsLeft || isOffline()) {
          break;
        }

        await sleep(400 * 2 ** attempt + Math.random() * 200);
      }
    }

    const axiosError = lastError as AxiosError;
    const data = axiosError?.response?.data as any;

    const apiError: ApiError = {
      message:
        data?.message ||
        data?.detail ||
        (Array.isArray(data?.non_field_errors)
          ? data.non_field_errors[0]
          : undefined) ||
        axiosError?.message ||
        "An error occurred",
      status: axiosError?.response?.status || 0,
      kind: classify(axiosError),
      details: data,
    };
    throw apiError;
  }
}

export const apiClient = new ApiClient();
