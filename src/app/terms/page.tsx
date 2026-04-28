"use client";

import React from "react";
import { useLanguage } from "@/lib/LanguageContext";
import { translations } from "@/constants/translations";
import { PageContainer } from "@/components/ui/PageContainer";

export default function TermsPage() {
  const { language } = useLanguage();
  const t = (translations[language] as any).terms;

  if (!t) return null;

  return (
    <PageContainer maxWidth="sm">
      <div className="bg-white p-8 sm:p-12 md:p-16 rounded-2xl shadow-xl border border-gray-100">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#001c3b] mb-4 tracking-tight">
            {t.title}
          </h1>
          <p className="text-sm font-medium text-gray-400 uppercase tracking-widest">
            {t.lastUpdated}
          </p>
          <div className="w-24 h-1.5 bg-gradient-to-r from-[#0099B5] to-[#c9a96e] mx-auto mt-8 rounded-full"></div>
        </div>

        <div className="space-y-12 text-gray-700 leading-relaxed text-sm sm:text-base">
          <p className="text-lg text-gray-600 italic border-l-4 border-[#c9a96e] pl-6 py-2 bg-gray-50 rounded-r-lg">
            {t.section1Content}
          </p>

          <div className="group">
            <h2 className="text-2xl font-bold text-[#001c3b] mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-[#001c3b] text-white flex items-center justify-center text-sm font-black">
                1
              </span>
              {t.section1Title}
            </h2>
            <div className="h-0.5 w-full bg-gray-100 mb-6 group-hover:bg-[#0099B5]/30 transition-colors"></div>
            <p className="text-justify leading-loose opacity-90">
              {t.section1Content}
            </p>
          </div>

          <div className="group">
            <h2 className="text-2xl font-bold text-[#001c3b] mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-[#001c3b] text-white flex items-center justify-center text-sm font-black">
                2
              </span>
              {t.section2Title}
            </h2>
            <div className="h-0.5 w-full bg-gray-100 mb-6 group-hover:bg-[#0099B5]/30 transition-colors"></div>
            <p className="text-justify leading-loose opacity-90">
              {t.section2Content}
            </p>
          </div>

          <div className="group">
            <h2 className="text-2xl font-bold text-[#001c3b] mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-[#001c3b] text-white flex items-center justify-center text-sm font-black">
                3
              </span>
              {t.section3Title}
            </h2>
            <div className="h-0.5 w-full bg-gray-100 mb-6 group-hover:bg-[#0099B5]/30 transition-colors"></div>
            <p className="text-justify leading-loose opacity-90">
              {t.section3Content}
            </p>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-gray-100 text-center">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} Diplomatic Academy. All rights
            reserved.
          </p>
        </div>
      </div>
    </PageContainer>
  );
}
