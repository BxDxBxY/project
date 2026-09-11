"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useConsent } from "@/lib/ConsentContext";
import { useLanguage } from "@/lib/LanguageContext";
import { translations } from "@/constants/translations";

/**
 * Cookie boʻyicha rozilik banneri.
 *
 * Zarur boʻlmagan cookie-fayllar (statistika) foydalanuvchi tanlov qilmaguncha
 * yuklanmaydi — bannerning butun mazmuni shunda.
 */
export const CookieConsent: React.FC = () => {
  const { bannerVisible, acceptAll, acceptNecessaryOnly } = useConsent();
  const pathname = usePathname();
  const { language } = useLanguage();
  const t = translations[language].cookieBanner;
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (bannerVisible) {
      // Skrinrider foydalanuvchisi banner paydo boʻlganini bilishi uchun.
      headingRef.current?.focus();
    }
  }, [bannerVisible]);

  // Admin panel ichki tizim — unda cookie banneri koʻrsatilmaydi.
  if (!bannerVisible || pathname.startsWith("/admin")) return null;

  return (
    <div
      role="dialog"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-description"
      className="fixed bottom-0 left-0 right-0 z-[60] bg-white border-t-4 border-[#c9a96e] shadow-[0_-4px_20px_rgba(0,0,0,0.18)]"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="lg:pr-8">
          <h2
            id="cookie-consent-title"
            ref={headingRef}
            tabIndex={-1}
            className="text-base sm:text-lg font-bold text-[#001c3b] mb-1 outline-none"
          >
            {t.title}
          </h2>
          <p
            id="cookie-consent-description"
            className="text-sm text-gray-700 leading-relaxed"
          >
            {t.description}{" "}
            <Link
              href="/cookies"
              className="text-[#00527a] underline underline-offset-2 hover:text-[#001c3b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#001c3b] rounded-sm"
            >
              {t.policyLink}
            </Link>
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 shrink-0">
          <button
            type="button"
            onClick={acceptNecessaryOnly}
            className="px-5 py-2.5 rounded-lg border-2 border-[#001c3b] text-[#001c3b] text-sm font-semibold hover:bg-[#001c3b] hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#001c3b]"
          >
            {t.necessaryOnly}
          </button>
          <button
            type="button"
            onClick={acceptAll}
            className="px-5 py-2.5 rounded-lg bg-[#001c3b] text-white text-sm font-semibold hover:bg-[#00325f] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c9a96e]"
          >
            {t.acceptAll}
          </button>
        </div>
      </div>
    </div>
  );
};

/** Tanlovni istalgan vaqtda qayta koʻrib chiqish tugmasi. */
export const CookieSettingsButton: React.FC<{ className?: string }> = ({
  className = "",
}) => {
  const { openSettings } = useConsent();
  const { language } = useLanguage();
  const t = translations[language].cookieBanner;

  return (
    <button
      type="button"
      onClick={openSettings}
      className={`text-sm underline underline-offset-2 hover:no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current rounded-sm ${className}`}
    >
      {t.settings}
    </button>
  );
};

export default CookieConsent;
