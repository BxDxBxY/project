"use client";

import React from "react";
import { useLanguage } from "@/lib/LanguageContext";
import { legalDocs } from "@/constants/legalDocs";
import { LegalDocumentView } from "@/components/legal/LegalDocumentView";
import { CookieSettingsButton } from "@/components/ui/CookieConsent";

export default function CookiesPage() {
  const { language } = useLanguage();

  return (
    <>
      <LegalDocumentView document={legalDocs[language].cookies} />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <CookieSettingsButton className="text-[#00527a] hover:text-[#001c3b]" />
      </div>
    </>
  );
}
