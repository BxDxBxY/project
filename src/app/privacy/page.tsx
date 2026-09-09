"use client";

import React from "react";
import { useLanguage } from "@/lib/LanguageContext";
import { legalDocs } from "@/constants/legalDocs";
import { LegalDocumentView } from "@/components/legal/LegalDocumentView";

export default function PrivacyPage() {
  const { language } = useLanguage();

  return <LegalDocumentView document={legalDocs[language].privacy} />;
}
