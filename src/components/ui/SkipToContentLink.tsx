"use client";

import React from "react";
import { useLanguage } from "@/lib/LanguageContext";
import { translations } from "@/constants/translations";

/**
 * Klaviatura foydalanuvchilari uchun navigatsiyani oʻtkazib yuborish havolasi
 * (WCAG 2.4.1). Faqat fokus olganda koʻrinadi.
 */
export const SkipToContentLink: React.FC = () => {
  const { language } = useLanguage();
  const t = translations[language].header;

  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:bg-white focus:text-[#001c3b] focus:px-4 focus:py-2 focus:rounded-lg focus:shadow-lg focus:outline-2 focus:outline-offset-2 focus:outline-[#001c3b] font-semibold"
    >
      {t.skipToContent}
    </a>
  );
};

export default SkipToContentLink;
