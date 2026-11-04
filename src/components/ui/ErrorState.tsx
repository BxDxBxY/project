"use client";

import React from "react";
import WifiOffIcon from "@mui/icons-material/WifiOff";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useLanguage } from "@/lib/LanguageContext";
import { translations } from "@/constants/translations";
import { apiErrorMessage, isApiError, isRetryable } from "@/lib/apiErrors";

interface ErrorStateProps {
  /** Whatever was caught — an ApiError, an Error, anything. */
  error: unknown;
  /** Shown above the explanation; defaults to a generic heading. */
  title?: string;
  /** When given, a retry button appears for failures worth retrying. */
  onRetry?: () => void | Promise<void>;
  /** True while the retry is in flight. */
  retrying?: boolean;
  className?: string;
}

/**
 * The one place a failed request is drawn.
 *
 * Every page used to invent its own panel, most of them showing the raw axios
 * string. This renders a translated sentence, and only offers a retry when
 * retrying could actually help — a 404 gets no button.
 */
export const ErrorState: React.FC<ErrorStateProps> = ({
  error,
  title,
  onRetry,
  retrying = false,
  className = "",
}) => {
  const { language } = useLanguage();
  const t = translations[language].network;

  const offline = isApiError(error) && error.kind === "offline";
  const message = apiErrorMessage(error, language);
  const showRetry = !!onRetry && (isRetryable(error) || offline);

  return (
    <div
      role="alert"
      className={`w-full max-w-lg mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 text-center ${className}`}
    >
      <div
        className={`flex items-center justify-center w-14 h-14 mx-auto rounded-2xl mb-5 ${
          offline ? "bg-amber-50 text-amber-600" : "bg-red-50 text-red-600"
        }`}
      >
        {offline ? (
          <WifiOffIcon aria-hidden="true" />
        ) : (
          <ReportProblemIcon aria-hidden="true" />
        )}
      </div>

      <h2 className="text-lg sm:text-xl font-bold text-[#001c3b] mb-2">
        {title ?? (offline ? t.offlineTitle : t.unknown)}
      </h2>
      <p className="text-sm text-gray-600 leading-relaxed">{message}</p>

      {showRetry && (
        <button
          type="button"
          onClick={() => onRetry?.()}
          disabled={retrying}
          className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#001c3b] text-white text-sm font-semibold hover:bg-[#00325f] disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#001c3b] transition-colors"
        >
          <RefreshIcon
            fontSize="small"
            aria-hidden="true"
            className={retrying ? "animate-spin" : ""}
          />
          {retrying ? t.retrying : t.retry}
        </button>
      )}
    </div>
  );
};
