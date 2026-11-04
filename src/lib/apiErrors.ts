import { ApiError, ApiErrorKind } from "@/types";
import { translations, type LanguageCode } from "@/constants/translations";

/** Narrow an unknown catch value to the shape apiClient throws. */
export const isApiError = (error: unknown): error is ApiError =>
  typeof error === "object" &&
  error !== null &&
  "kind" in error &&
  "status" in error;

const KIND_TO_KEY: Record<
  ApiErrorKind,
  keyof (typeof translations)["uz"]["network"]
> = {
  offline: "offlineTitle",
  network: "networkError",
  timeout: "timeout",
  unauthorized: "forbidden",
  forbidden: "forbidden",
  notFound: "notFound",
  rateLimited: "rateLimited",
  server: "serverError",
  client: "unknown",
};

/**
 * A sentence a visitor can act on, in their language.
 *
 * The server's own message wins when it is something written for a human —
 * DRF validation errors, for instance. Anything that looks like an axios
 * internal ("Network Error", "timeout of 25000ms exceeded", "Request failed
 * with status code 500") is replaced, because those strings are the reason
 * people saw an English stack-trace fragment on a Uzbek page.
 */
export const apiErrorMessage = (
  error: unknown,
  language: LanguageCode,
): string => {
  const t = translations[language].network;

  if (!isApiError(error)) {
    return t.unknown;
  }

  const generic =
    !error.message ||
    /^Network Error$/i.test(error.message) ||
    /^timeout of /i.test(error.message) ||
    /^Request failed with status code/i.test(error.message) ||
    /^An error occurred$/i.test(error.message) ||
    error.message === "canceled";

  if (!generic && error.kind === "client") {
    return error.message;
  }

  if (error.kind === "offline") {
    return t.offlineText;
  }

  return t[KIND_TO_KEY[error.kind]] ?? t.unknown;
};

/** True when retrying the same call could plausibly succeed. */
export const isRetryable = (error: unknown): boolean =>
  isApiError(error) &&
  ["offline", "network", "timeout", "server", "rateLimited"].includes(
    error.kind,
  );
