"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import { Cookie, X, Settings } from "lucide-react";
import Link from "next/link";

export default function CookieConsent() {
  const { language } = useLanguage();
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true, // Always true, cannot be disabled
    analytics: false,
    functional: false,
  });

  const content = {
    uz: {
      title: "Biz cookie-lardan foydalanamiz",
      description:
        "Veb-saytimiz tajribangizni yaxshilash uchun cookie-lardan foydalanadi. Zaruriy cookie-lar saytning ishlashi uchun kerak, boshqalari esa ixtiyoriy.",
      acceptAll: "Barchasini qabul qilish",
      rejectAll: "Rad etish",
      customize: "Sozlash",
      savePreferences: "Saqlash",
      necessary: "Zaruriy cookie-lar",
      necessaryDesc:
        "Saytning asosiy funksiyalari uchun zarur (o'chirib bo'lmaydi)",
      analytics: "Analitik cookie-lar",
      analyticsDesc:
        "Sayt foydalanishini tahlil qilish uchun (Google Analytics)",
      functional: "Funksional cookie-lar",
      functionalDesc: "Til tanlovi va boshqa sozlamalarni eslab qolish uchun",
      learnMore: "Batafsil",
      settingsTitle: "Cookie sozlamalari",
    },
    ru: {
      title: "Мы используем cookie",
      description:
        "Наш веб-сайт использует cookie для улучшения вашего опыта. Необходимые cookie требуются для работы сайта, остальные являются необязательными.",
      acceptAll: "Принять все",
      rejectAll: "Отклонить",
      customize: "Настроить",
      savePreferences: "Сохранить",
      necessary: "Необходимые cookie",
      necessaryDesc: "Требуются для основных функций сайта (нельзя отключить)",
      analytics: "Аналитические cookie",
      analyticsDesc: "Для анализа использования сайта (Google Analytics)",
      functional: "Функциональные cookie",
      functionalDesc: "Для запоминания выбора языка и других настроек",
      learnMore: "Подробнее",
      settingsTitle: "Настройки cookie",
    },
  };

  const t = content[language];

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      setShowBanner(true);
    } else {
      // Load saved preferences
      try {
        const saved = JSON.parse(consent);
        setPreferences(saved);
        // Initialize analytics if consented
        if (saved.analytics) {
          initializeAnalytics();
        }
      } catch (e) {
        setShowBanner(true);
      }
    }
  }, []);

  const initializeAnalytics = () => {
    // Initialize Google Analytics
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("consent", "update", {
        analytics_storage: "granted",
      });
    }
  };

  const handleAcceptAll = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      functional: true,
    };
    setPreferences(allAccepted);
    localStorage.setItem("cookieConsent", JSON.stringify(allAccepted));
    initializeAnalytics();
    setShowBanner(false);
    setShowSettings(false);
  };

  const handleRejectAll = () => {
    const onlyNecessary = {
      necessary: true,
      analytics: false,
      functional: false,
    };
    setPreferences(onlyNecessary);
    localStorage.setItem("cookieConsent", JSON.stringify(onlyNecessary));
    setShowBanner(false);
    setShowSettings(false);
  };

  const handleSavePreferences = () => {
    localStorage.setItem("cookieConsent", JSON.stringify(preferences));
    if (preferences.analytics) {
      initializeAnalytics();
    }
    setShowBanner(false);
    setShowSettings(false);
  };

  const togglePreference = (key: "analytics" | "functional") => {
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  if (!showBanner) return null;

  return (
    <>
      {/* Cookie Banner */}
      {!showSettings && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t-2 border-[#001c3b] shadow-2xl">
          <div className="max-w-7xl mx-auto p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              {/* Icon and Content */}
              <div className="flex items-start gap-4 flex-1">
                <div className="flex-shrink-0">
                  <Cookie className="w-8 h-8 text-[#001c3b]" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-[#001c3b] mb-2">
                    {t.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">{t.description}</p>
                  <Link
                    href="/cookies"
                    className="text-sm text-[#001c3b] hover:underline font-medium"
                  >
                    {t.learnMore} →
                  </Link>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <button
                  onClick={() => setShowSettings(true)}
                  className="px-6 py-2.5 border-2 border-[#001c3b] text-[#001c3b] rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm flex items-center justify-center gap-2"
                >
                  <Settings className="w-4 h-4" />
                  {t.customize}
                </button>
                <button
                  onClick={handleRejectAll}
                  className="px-6 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
                >
                  {t.rejectAll}
                </button>
                <button
                  onClick={handleAcceptAll}
                  className="px-6 py-2.5 bg-[#001c3b] text-white rounded-lg hover:bg-[#002d5a] transition-colors font-medium text-sm"
                >
                  {t.acceptAll}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cookie Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Settings className="w-6 h-6 text-[#001c3b]" />
                <h2 className="text-2xl font-bold text-[#001c3b]">
                  {t.settingsTitle}
                </h2>
              </div>
              <button
                onClick={() => setShowSettings(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Necessary Cookies */}
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <input
                  type="checkbox"
                  checked={preferences.necessary}
                  disabled
                  className="mt-1 w-5 h-5 rounded border-gray-300"
                />
                <div className="flex-1">
                  <h3 className="font-bold text-[#001c3b] mb-1">
                    {t.necessary}
                  </h3>
                  <p className="text-sm text-gray-600">{t.necessaryDesc}</p>
                </div>
              </div>

              {/* Analytics Cookies */}
              <div className="flex items-start gap-4 p-4 border-2 border-gray-200 rounded-lg hover:border-[#001c3b] transition-colors">
                <input
                  type="checkbox"
                  checked={preferences.analytics}
                  onChange={() => togglePreference("analytics")}
                  className="mt-1 w-5 h-5 rounded border-gray-300 text-[#001c3b] focus:ring-[#001c3b] cursor-pointer"
                />
                <div className="flex-1">
                  <h3 className="font-bold text-[#001c3b] mb-1">
                    {t.analytics}
                  </h3>
                  <p className="text-sm text-gray-600">{t.analyticsDesc}</p>
                </div>
              </div>

              {/* Functional Cookies */}
              <div className="flex items-start gap-4 p-4 border-2 border-gray-200 rounded-lg hover:border-[#001c3b] transition-colors">
                <input
                  type="checkbox"
                  checked={preferences.functional}
                  onChange={() => togglePreference("functional")}
                  className="mt-1 w-5 h-5 rounded border-gray-300 text-[#001c3b] focus:ring-[#001c3b] cursor-pointer"
                />
                <div className="flex-1">
                  <h3 className="font-bold text-[#001c3b] mb-1">
                    {t.functional}
                  </h3>
                  <p className="text-sm text-gray-600">{t.functionalDesc}</p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleRejectAll}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                {t.rejectAll}
              </button>
              <button
                onClick={handleSavePreferences}
                className="flex-1 px-6 py-3 bg-[#001c3b] text-white rounded-lg hover:bg-[#002d5a] transition-colors font-medium"
              >
                {t.savePreferences}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
