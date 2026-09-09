"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import { translations } from "@/constants/translations";
import { PageContainer } from "@/components/ui/PageContainer";
import { Shield, ChevronRight, Lock, AlertCircle } from "lucide-react";

export default function PrivacyPage() {
  const { language } = useLanguage();
  const t = (translations[language] as any).privacy;
  const [activeSection, setActiveSection] = useState<string>("section1");

  const sections = [
    { id: "section1", title: t?.content2, content: t?.content3 },
    { id: "section2", title: t?.content4, content: t?.content5 },
    { id: "section3", title: t?.content6, content: t?.content7 },
  ];

  // Scroll spy effect
  useEffect(() => {
    const handleScroll = () => {
      const sectionElements = sections.map((s) => ({
        id: s.id,
        element: document.getElementById(s.id),
      }));

      const current = sectionElements.find((s) => {
        if (!s.element) return false;
        const rect = s.element.getBoundingClientRect();
        return rect.top >= 0 && rect.top <= 300;
      });

      if (current) {
        setActiveSection(current.id);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sections]);

  if (!t) return null;

  return (
    <PageContainer maxWidth="lg">
      <div className="grid lg:grid-cols-4 gap-8">
        {/* Sticky Sidebar - Table of Contents */}
        <aside className="lg:col-span-1">
          <div className="sticky top-24 bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center gap-2 mb-6">
              <Lock className="w-5 h-5 text-[#001c3b]" />
              <h2 className="font-bold text-[#001c3b]">
                {language === "uz" ? "Mundarija" : "Содержание"}
              </h2>
            </div>
            <nav className="space-y-2">
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById(section.id)?.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                    setActiveSection(section.id);
                  }}
                  className={`block text-sm py-2 px-3 rounded-lg transition-colors ${
                    activeSection === section.id
                      ? "bg-[#001c3b] text-white"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {section.title}
                </a>
              ))}
            </nav>

            {/* Notice about comprehensive version */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-start gap-2 text-xs text-gray-500">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <p>
                  {language === "uz"
                    ? "Kengaytirilgan versiya tez orada taqdim etiladi"
                    : "Расширенная версия скоро будет доступна"}
                </p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-lg p-8 md:p-12 border border-gray-100">
            {/* Header */}
            <div className="text-center mb-12 pb-8 border-b border-gray-200">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[#001c3b] rounded-full mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-[#001c3b] mb-3">
                {t.title}
              </h1>
              <p className="text-sm text-gray-500">{t.lastUpdated}</p>
              <div className="w-24 h-1 bg-gradient-to-r from-[#001c3b] to-[#c9a96e] mx-auto mt-6 rounded-full"></div>
            </div>

            {/* Introduction */}
            <div className="mb-12 p-6 bg-blue-50 border-l-4 border-[#001c3b] rounded-r-lg">
              <p className="text-gray-700 leading-relaxed">{t.content1}</p>
            </div>

            {/* Sections */}
            <div className="space-y-12">
              {sections.map((section, index) => (
                <section
                  key={section.id}
                  id={section.id}
                  className="scroll-mt-24"
                >
                  <div className="group">
                    <h2 className="text-2xl font-bold text-[#001c3b] mb-4 flex items-center gap-3">
                      <span className="flex items-center justify-center w-10 h-10 bg-[#001c3b] text-white rounded-lg text-lg font-bold group-hover:scale-110 transition-transform">
                        {index + 1}
                      </span>
                      {section.title}
                    </h2>
                    <div className="h-0.5 w-full bg-gray-100 mb-6 group-hover:bg-[#c9a96e] transition-colors"></div>
                    <div className="text-gray-700 leading-loose text-justify pl-13">
                      {section.content}
                    </div>
                  </div>
                </section>
              ))}
            </div>

            {/* Additional Information */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-bold text-[#001c3b] mb-3 flex items-center gap-2">
                  <ChevronRight className="w-5 h-5" />
                  {language === "uz"
                    ? "Qo'shimcha ma'lumot"
                    : "Дополнительная информация"}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {language === "uz"
                    ? "Ushbu siyosat to'g'risida savollaringiz bo'lsa, biz bilan bog'laning:"
                    : "Если у вас есть вопросы об этой политике, свяжитесь с нами:"}
                </p>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-700">
                    <span className="font-semibold">
                      {language === "uz" ? "Manzil:" : "Адрес:"}
                    </span>{" "}
                    {language === "uz"
                      ? "Mustaqillik shoh ko'chasi, 54, Toshkent, O'zbekiston"
                      : "проспект Мустакиллик, 54, Ташкент, Узбекистан"}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-semibold">
                      {language === "uz" ? "Telefon:" : "Телефон:"}
                    </span>{" "}
                    +998 71 267 82 82
                  </p>
                  <p className="text-gray-700">
                    <span className="font-semibold">
                      {language === "uz" ? "Elektron pochta:" : "Эл. почта:"}
                    </span>{" "}
                    privacy@dip-lugat.uz
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-12 pt-8 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-500">
                © {new Date().getFullYear()}{" "}
                {language === "uz"
                  ? "Diplomatik Akademiya. Barcha huquqlar himoyalangan."
                  : "Дипломатическая Академия. Все права защищены."}
              </p>
            </div>
          </div>
        </main>
      </div>
    </PageContainer>
  );
}
