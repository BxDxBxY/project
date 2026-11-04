"use client";

import React, { useEffect } from "react";
import { PageContainer } from "@/components/ui/PageContainer";
import { ErrorState } from "@/components/ui/ErrorState";
import { useLanguage } from "@/lib/LanguageContext";
import { translations } from "@/constants/translations";

/**
 * Route-level boundary for /dictionary.
 *
 * Keeps the header, footer and navigation on screen: a broken term list is
 * no reason to drop the visitor out of the site entirely.
 */
export default function DictionaryError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { language } = useLanguage();
  const t = translations[language].dictionary;

  useEffect(() => {
    console.error("Dictionary route error:", error);
  }, [error]);

  return (
    <PageContainer maxWidth="md">
      <div className="py-8">
        <ErrorState error={error} title={t.errorMsg} onRetry={reset} />
      </div>
    </PageContainer>
  );
}
