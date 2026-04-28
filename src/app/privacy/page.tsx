"use client";

import React from "react";
import { useLanguage } from "@/lib/LanguageContext";
import { translations } from "@/constants/translations";

export default function PrivacyPage() {
  const { language } = useLanguage();
  const t = translations[language].privacy;

  return (
    <div className="flex-1 flex flex-col pt-20 sm:pt-24 md:pt-28 pb-8 sm:pb-12 md:pb-16 transition-all duration-300 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="bg-white p-8 sm:p-12 rounded-xl shadow-sm border border-gray-100">
          <div className="text-center mb-10">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#001c3b] mb-4">
              {t.title}
            </h1>
            <p className="text-sm text-gray-500">{t.lastUpdated}</p>
            <div className="w-16 h-1 bg-[#c9a96e] mx-auto mt-6"></div>
          </div>

          <div className="space-y-8 text-gray-700 leading-relaxed text-sm sm:text-base">
            <p className="indent-8 text-justify">{t.content1}</p>

            <div>
              <h2 className="text-xl font-semibold text-[#001c3b] mb-3">
                1. {t.content2}
              </h2>
              <p className="indent-8 text-justify">{t.content3}</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-[#001c3b] mb-3">
                2. {t.content4}
              </h2>
              <p className="indent-8 text-justify">{t.content5}</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-[#001c3b] mb-3">
                3. {t.content6}
              </h2>
              <p className="indent-8 text-justify">{t.content7}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
