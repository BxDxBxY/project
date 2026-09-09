"use client";

import React from "react";
import Script from "next/script";
import { useConsent } from "@/lib/ConsentContext";

const MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-ZQM6WJ69BC";

/**
 * Google Analytics faqat foydalanuvchi rozilik bergandan keyin yuklanadi.
 * Rozilik boʻlmasa, sahifada Google skriptlari umuman boʻlmaydi.
 */
export const ConsentedAnalytics: React.FC = () => {
  const { analyticsAllowed } = useConsent();

  if (!analyticsAllowed || !MEASUREMENT_ID) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${MEASUREMENT_ID}', {
            allow_google_signals: false,
            allow_ad_personalization_signals: false
          });
        `}
      </Script>
    </>
  );
};

export default ConsentedAnalytics;
