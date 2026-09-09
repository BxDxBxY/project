"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";
import { translations } from "@/constants/translations";
import {
  Settings,
  Layout,
  LayoutGrid,
  LayoutTemplate,
  Layers,
} from "lucide-react";
import { PageContainer } from "@/components/ui/PageContainer";

/**
 * Maket variantlarini almashtirish paneli faqat ishlab chiqish rejimida
 * koʻrsatiladi — rasmiy saytda bunday tugma boʻlmasligi kerak.
 */
const isDevelopment = process.env.NODE_ENV === "development";

const linkFocus =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#001c3b] rounded-sm";

export default function HomePage() {
  const { language } = useLanguage();
  const t = translations[language].home;

  const [variant, setVariant] = useState<number>(1);
  const [showSwitcher, setShowSwitcher] = useState(false);

  const subscribeBlock = (
    <p className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed text-justify">
      {t.subscribe}{" "}
      <a
        href="https://t.me/diplugat"
        target="_blank"
        rel="noopener noreferrer"
        className={`text-[#00527a] hover:underline font-medium ${linkFocus}`}
      >
        https://t.me/diplugat
      </a>
    </p>
  );

  // Variant 1: Current Approved (Minimal)
  const renderVariant1 = () => (
    <PageContainer maxWidth="md">
      <div className="flex flex-col items-center md:items-start text-center gap-6 sm:gap-7 w-full">
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-[#001c3b] uppercase leading-snug tracking-tight">
          {t.heroTitle}
        </h1>
        <hr className="w-full border-gray-400 opacity-20" />

        <p className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed text-justify whitespace-pre-line">
          {t.heroPara1}
        </p>
        <p className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed text-justify ">
          {t.heroPara2}
        </p>
        <hr className="w-full border-gray-400 opacity-20" />

        <p className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed text-justify">
          {t.heroPara3}
        </p>
        {subscribeBlock}
      </div>
    </PageContainer>
  );

  // Variant 2: Book Layout
  const renderVariant2 = () => (
    <PageContainer maxWidth="md">
      <div className="text-center space-y-6 sm:space-y-7">
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-[#001c3b] uppercase leading-snug tracking-tight">
          {t.heroTitle}
        </h1>
        <hr className="w-full border-gray-400 opacity-20" />
      </div>

      <div className="mt-6 sm:mt-8 grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 items-start">
        <div className="md:col-span-4 md:order-2 flex justify-center">
          <div className="w-[80%] sm:w-[70%] md:w-full max-w-[360px]">
            <div className="relative aspect-[3/4] rounded-lg overflow-hidden">
              <Image
                src="/book.png"
                alt={t.heroTitle}
                fill
                priority
                className="object-contain"
              />
            </div>
          </div>
        </div>

        <div className="md:col-span-8 md:order-1 space-y-4">
          <p className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed text-justify whitespace-pre-line indent-8">
            {t.heroPara1}
          </p>
          <p className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed text-justify whitespace-pre-line indent-8">
            {t.heroPara2}
          </p>
          <hr className="w-full border-gray-400 opacity-20" />
          <p className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed text-justify whitespace-pre-line indent-8">
            {t.heroPara3}
          </p>
          {subscribeBlock}
        </div>
      </div>
    </PageContainer>
  );

  // Variant 3: Modern Hero
  const renderVariant3 = () => (
    <PageContainer maxWidth="lg">
      <section className="text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold text-[#001c3b] tracking-tight mb-6 uppercase">
          {t.heroTitle}
        </h1>
        <p className="mt-4 max-w-3xl mx-auto text-xl text-gray-700">
          {translations[language].header.subtitle}
        </p>

        <div className="mt-10 flex justify-center gap-4">
          <Link
            href="/dictionary"
            className={`px-8 py-3 bg-[#001c3b] text-white rounded-lg font-semibold hover:bg-[#00325f] transition shadow-lg ${linkFocus}`}
          >
            {t.goToDictionary}
          </Link>
        </div>

        <div className="mt-16 text-left max-w-4xl mx-auto space-y-6 text-gray-700 bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-base sm:text-lg leading-relaxed">{t.heroPara1}</p>
          <p className="text-base sm:text-lg leading-relaxed">{t.heroPara2}</p>
          <p className="text-base sm:text-lg leading-relaxed">{t.heroPara3}</p>
        </div>
      </section>
    </PageContainer>
  );

  // Variant 4: Feature Grid
  const renderVariant4 = () => (
    <PageContainer maxWidth="md">
      <section className="bg-[#001c3b] text-white py-20 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-10">
          <div className="text-center md:text-left flex-1">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-[#e0c48f] uppercase">
              {t.heroTitle}
            </h1>
            <p className="text-lg md:text-xl text-gray-200 leading-relaxed mb-8">
              {translations[language].header.subtitle}
            </p>
            <Link
              href="/dictionary"
              className={`inline-block px-8 py-4 bg-[#c9a96e] text-[#001c3b] font-bold rounded-lg hover:bg-[#e0c48f] transition ${linkFocus}`}
            >
              {t.goToDictionary}
            </Link>
          </div>
          <div className="flex-1 flex justify-center md:justify-end">
            <div className="w-[80%] max-w-[300px] relative aspect-[3/4] rounded-lg overflow-hidden shadow-2xl">
              <Image
                src="/book.png"
                alt={t.heroTitle}
                fill
                priority
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 pt-16">
        <div className="bg-white p-6 sm:p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100 space-y-6">
          <p className="text-gray-700 text-base sm:text-lg leading-relaxed text-justify indent-8">
            {t.heroPara1}
          </p>
          <p className="text-gray-700 text-base sm:text-lg leading-relaxed text-justify indent-8">
            {t.heroPara2}
          </p>
          <p className="text-gray-700 text-base sm:text-lg leading-relaxed text-justify indent-8">
            {t.heroPara3}
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { title: t.featureSearchTitle, text: t.featureSearchText },
          { title: t.featureLanguagesTitle, text: t.featureLanguagesText },
          { title: t.featureDetailsTitle, text: t.featureDetailsText },
        ].map((feature) => (
          <div
            key={feature.title}
            className="bg-white rounded-xl shadow-lg p-8 text-center"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {feature.title}
            </h2>
            <p className="text-gray-700">{feature.text}</p>
          </div>
        ))}
      </section>
    </PageContainer>
  );

  return (
    <div className="relative min-h-screen">
      {variant === 1 && renderVariant1()}
      {variant === 2 && renderVariant2()}
      {variant === 3 && renderVariant3()}
      {variant === 4 && renderVariant4()}

      {/* Maket almashtirgich — faqat lokal ishlab chiqish uchun */}
      {isDevelopment && (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
          {showSwitcher && (
            <div className="bg-white p-3 rounded-2xl shadow-2xl border border-gray-100 flex flex-col gap-2">
              <div className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1 px-2">
                Select Layout (dev only)
              </div>

              {[
                { id: 1, label: "1. Current Minimal", Icon: Layout },
                { id: 2, label: "2. Book Layout", Icon: LayoutTemplate },
                { id: 3, label: "3. Modern Hero", Icon: LayoutGrid },
                { id: 4, label: "4. Feature Grid", Icon: Layers },
              ].map(({ id, label, Icon }) => (
                <button
                  key={id}
                  onClick={() => setVariant(id)}
                  aria-pressed={variant === id}
                  className={`flex items-center gap-3 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                    variant === id
                      ? "bg-blue-50 text-blue-800"
                      : "hover:bg-gray-50 text-gray-700"
                  }`}
                >
                  <Icon className="w-4 h-4" aria-hidden="true" />
                  {label}
                </button>
              ))}
            </div>
          )}

          <button
            onClick={() => setShowSwitcher(!showSwitcher)}
            className="bg-[#001c3b] text-white p-4 rounded-full shadow-xl hover:bg-[#00325f] transition-transform hover:scale-105"
            aria-label="Toggle layout switcher (development only)"
            aria-expanded={showSwitcher}
          >
            <Settings
              className={`w-6 h-6 transition-transform ${showSwitcher ? "rotate-180" : ""}`}
              aria-hidden="true"
            />
          </button>
        </div>
      )}
    </div>
  );
}
