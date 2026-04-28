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

export default function HomePage() {
  const { language } = useLanguage();
  const t = translations[language].home;

  const [variant, setVariant] = useState<number>(1);
  const [showSwitcher, setShowSwitcher] = useState(false);

  // Variant 1: Current Approved (Minimal)
  const renderVariant1 = () => (
    <PageContainer maxWidth="md">
      <div className="flex flex-col items-center md:items-start text-center gap-6 sm:gap-7 w-full">
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-[#001c3b] uppercase leading-snug tracking-tight">
          {t.heroTitle}
        </h1>
        <hr className="w-full border-gray-400 opacity-20" />

        <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed text-justify whitespace-pre-line">
          {t.heroPara1}
        </p>
        <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed text-justify ">
          {t.heroPara2}
        </p>
        <hr className="w-full border-gray-400 opacity-20" />

        <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed text-justify">
          {t.heroPara3}
        </p>
        <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed text-justify">
          {t.subscribe}{" "}
          <a
            href="https://t.me/diplugat"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline font-medium"
          >
            https://t.me/diplugat
          </a>
        </p>
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
                alt="Diplomatik Lug‘at kitobi"
                fill
                priority
                className="object-contain"
              />
            </div>
          </div>
        </div>

        <div className="md:col-span-8 md:order-1 space-y-4">
          <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed text-justify whitespace-pre-line indent-8">
            {t.heroPara1}
          </p>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed text-justify whitespace-pre-line indent-8">
            {t.heroPara2}
          </p>
          <hr className="w-full border-gray-400 opacity-20" />
          <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed text-justify whitespace-pre-line indent-8">
            {t.heroPara3}
          </p>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed text-justify">
            {t.subscribe}{" "}
            <a
              href="https://t.me/diplugat"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline font-medium"
            >
              https://t.me/diplugat
            </a>
          </p>
        </div>
      </div>
    </PageContainer>
  );

  // Variant 3: Modern Hero with Stats
  const renderVariant3 = () => (
    <PageContainer maxWidth="lg">
      <section className="text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold text-[#001c3b] tracking-tight mb-6 uppercase">
          {t.heroTitle}
        </h1>
        <p className="mt-4 max-w-3xl mx-auto text-xl text-gray-600">
          Tashqi ishlar vazirligi Jahon iqtisodiyoti va diplomatiya universiteti
          huzuridagi Diplomatik akademiya.
        </p>

        <div className="mt-10 flex justify-center gap-4">
          <Link
            href="/dictionary"
            className="px-8 py-3 bg-[#001c3b] text-white rounded-lg font-semibold hover:bg-blue-900 transition shadow-lg"
          >
            Lug&apos;atga o&apos;tish
          </Link>
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-4xl font-bold text-[#c9a96e]">500+</h3>
            <p className="mt-2 text-gray-600 font-medium">
              Diplomatik Terminlar
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-4xl font-bold text-[#1EB53A]">1-chi</h3>
            <p className="mt-2 text-gray-600 font-medium">Markaziy Osiyoda</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-4xl font-bold text-[#0099B5]">Milliy</h3>
            <p className="mt-2 text-gray-600 font-medium">
              O&apos;zbek Lug&apos;ati
            </p>
          </div>
        </div>

        <div className="mt-16 text-left max-w-4xl mx-auto space-y-6 text-gray-600 bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-base sm:text-lg leading-relaxed">{t.heroPara1}</p>
          <p className="text-base sm:text-lg leading-relaxed">{t.heroPara2}</p>
          <p className="text-base sm:text-lg leading-relaxed">{t.heroPara3}</p>
        </div>
      </section>
    </PageContainer>
  );

  // Variant 4: Feature Grid & Partners Focus
  const renderVariant4 = () => (
    <PageContainer maxWidth="md">
      <section className="bg-[#001c3b] text-white py-20 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-10">
          <div className="text-center md:text-left flex-1">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-[#c9a96e] uppercase">
              {t.heroTitle}
            </h1>
            <p className="text-lg md:text-xl text-gray-300 leading-relaxed mb-8">
              Markaziy Osiyo mamlakatlarida birinchi ilmiy asoslangan
              lug&apos;atning o&apos;zbek tilida tayyorlanishi.
            </p>
            <Link
              href="/dictionary"
              className="inline-block px-8 py-4 bg-[#c9a96e] text-[#001c3b] font-bold rounded-lg hover:bg-yellow-600 transition"
            >
              Lug&apos;atdan izlash
            </Link>
          </div>
          <div className="flex-1 flex justify-center md:justify-end">
            <div className="w-[80%] max-w-[300px] relative aspect-[3/4] rounded-lg overflow-hidden shadow-2xl transform rotate-3 hover:rotate-0 transition duration-500">
              <Image
                src="/book.png"
                alt="Diplomatik Lug‘at kitobi"
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
        <div className="bg-white rounded-xl shadow-lg p-8 text-center transform hover:-translate-y-1 transition duration-300">
          <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-6">
            <svg
              className="w-8 h-8 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Tezkor qidiruv
          </h3>
          <p className="text-gray-600">
            Diplomatik atamalarni tez topish uchun qulay qidiruv tizimi.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 text-center transform hover:-translate-y-1 transition duration-300">
          <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-6">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Ko&apos;p tilli qo&apos;llab-quvvatlash
          </h3>
          <p className="text-gray-600">
            Ingliz, o&apos;zbek va rus tillarida foydalanish imkoniyati.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 text-center transform hover:-translate-y-1 transition duration-300">
          <div className="w-16 h-16 mx-auto bg-purple-100 rounded-full flex items-center justify-center mb-6">
            <svg
              className="w-8 h-8 text-purple-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Batafsil izohlar
          </h3>
          <p className="text-gray-600">
            Har bir diplomatik atama uchun keng qamrovli tushuntirishlar.
          </p>
        </div>
      </section>
    </PageContainer>
  );

  return (
    <div className="relative min-h-screen">
      {variant === 1 && renderVariant1()}
      {variant === 2 && renderVariant2()}
      {variant === 3 && renderVariant3()}
      {variant === 4 && renderVariant4()}

      {/* Floating Layout Switcher */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        {showSwitcher && (
          <div className="bg-white p-3 rounded-2xl shadow-2xl border border-gray-100 flex flex-col gap-2 transition-all animate-in slide-in-from-bottom-5">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 px-2">
              Select Layout
            </div>

            <button
              onClick={() => setVariant(1)}
              className={`flex items-center gap-3 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                variant === 1
                  ? "bg-blue-50 text-blue-700"
                  : "hover:bg-gray-50 text-gray-700"
              }`}
            >
              <Layout className="w-4 h-4" />
              1. Current Minimal
            </button>

            <button
              onClick={() => setVariant(2)}
              className={`flex items-center gap-3 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                variant === 2
                  ? "bg-blue-50 text-blue-700"
                  : "hover:bg-gray-50 text-gray-700"
              }`}
            >
              <LayoutTemplate className="w-4 h-4" />
              2. Book Layout
            </button>

            <button
              onClick={() => setVariant(3)}
              className={`flex items-center gap-3 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                variant === 3
                  ? "bg-blue-50 text-blue-700"
                  : "hover:bg-gray-50 text-gray-700"
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              3. Modern Hero
            </button>

            <button
              onClick={() => setVariant(4)}
              className={`flex items-center gap-3 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                variant === 4
                  ? "bg-blue-50 text-blue-700"
                  : "hover:bg-gray-50 text-gray-700"
              }`}
            >
              <Layers className="w-4 h-4" />
              4. Feature Grid
            </button>
          </div>
        )}

        <button
          onClick={() => setShowSwitcher(!showSwitcher)}
          className="bg-[#001c3b] text-white p-4 rounded-full shadow-xl hover:bg-blue-900 transition-transform hover:scale-105"
          aria-label="Toggle Layout Switcher"
        >
          <Settings
            className={`w-6 h-6 transition-transform ${showSwitcher ? "rotate-180" : ""}`}
          />
        </button>
      </div>
    </div>
  );
}
