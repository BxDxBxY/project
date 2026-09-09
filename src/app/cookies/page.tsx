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
      <div className="flex justify-center pb-12 px-4">
        <CookieSettingsButton />
      </div>
    </>
  );
}
