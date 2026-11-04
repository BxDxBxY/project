"use client";

import React from "react";
import WifiOffIcon from "@mui/icons-material/WifiOff";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import { useLanguage } from "@/lib/LanguageContext";
import { translations } from "@/constants/translations";

/**
 * A single, quiet line about the connection, pinned to the bottom of the
 * viewport.
 *
 * It is deliberately not a modal and never blocks anything: the dictionary
 * keeps its terms in memory, so a visitor who loses signal mid-session can go
 * on reading. The banner only explains why nothing new is arriving.
 */
export const NetworkStatusBanner: React.FC = () => {
  const { online, justReconnected } = useNetworkStatus();
  const { language } = useLanguage();
  const t = translations[language].network;

  if (online && !justReconnected) return null;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-[1400] px-3 pb-3 pointer-events-none"
      role="status"
      aria-live="polite"
    >
      <div
        className={`mx-auto max-w-xl flex items-start gap-3 rounded-xl px-4 py-3 shadow-2xl pointer-events-auto ${
          online
            ? "bg-[#1b5e20] text-white"
            : "bg-[#001c3b] text-white border border-[#c9a96e]/40"
        }`}
      >
        {online ? (
          <CheckCircleIcon fontSize="small" aria-hidden="true" />
        ) : (
          <WifiOffIcon
            fontSize="small"
            aria-hidden="true"
            className="mt-0.5 text-[#c9a96e]"
          />
        )}

        <div className="min-w-0">
          <p className="text-sm font-semibold">
            {online ? t.backOnline : t.offlineTitle}
          </p>
          {!online && (
            <p className="text-xs text-gray-300 leading-relaxed mt-0.5">
              {t.offlineText}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
