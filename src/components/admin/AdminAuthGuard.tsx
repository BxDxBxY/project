// components/admin/AdminAuthGuard.tsx
"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { TokenManager } from "@/lib/tokenManager";
import { verifyToken, refreshToken } from "@/lib/authApi";
import { useLanguage } from "@/lib/LanguageContext";
import { translations } from "@/constants/translations";
import { ErrorState } from "@/components/ui/ErrorState";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { isApiError } from "@/lib/apiErrors";

type Phase = "checking" | "allowed" | "unreachable";

/**
 * Gate for every /admin route except the login page.
 *
 * The important distinction here is between "your session ended" and "the
 * server could not be reached". The first sends the editor to the login page;
 * the second must not, or a dropped connection silently logs people out and
 * throws away whatever they were editing.
 */
export const AdminAuthGuard: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const router = useRouter();
  const { language } = useLanguage();
  const t = translations[language].admin;

  const [phase, setPhase] = useState<Phase>("checking");
  const [error, setError] = useState<unknown>(null);

  const toLogin = useCallback(() => {
    TokenManager.clearTokens();
    router.replace("/admin/login?session=expired");
  }, [router]);

  const checkAuth = useCallback(async () => {
    setPhase("checking");
    setError(null);

    const access = TokenManager.getAccessToken();
    const refresh = TokenManager.getRefreshToken();

    if (!access && !refresh) {
      TokenManager.clearTokens();
      router.replace("/admin/login");
      return;
    }

    try {
      if (access) {
        const res = await verifyToken(access);
        if (!res.code && !res.detail) {
          setPhase("allowed");
          return;
        }
      }

      if (refresh) {
        const data = await refreshToken(refresh);
        if (data.access) {
          TokenManager.setTokens(data.access, refresh);
          setPhase("allowed");
          return;
        }
      }

      toLogin();
    } catch (err) {
      // Transport failure — the token may well still be valid. Offer a retry
      // instead of destroying the session.
      const transport =
        isApiError(err) &&
        ["offline", "network", "timeout", "server"].includes(err.kind);

      if (transport) {
        setError(err);
        setPhase("unreachable");
        return;
      }

      toLogin();
    }
  }, [router, toLogin]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (phase === "unreachable") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
        <ErrorState error={error} onRetry={checkAuth} />
      </div>
    );
  }

  if (phase === "checking") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 gap-4">
        <LoadingSpinner size="lg" />
        <p className="text-sm text-gray-600">{t.checkingAccess}</p>
      </div>
    );
  }

  return <>{children}</>;
};
