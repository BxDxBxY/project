"use client";

import React from "react";
import { useLanguage } from "@/lib/LanguageContext";
import { translations } from "@/constants/translations";

export default function TermsPage() {
  const { language } = useLanguage();
  // Using privacy terms as placeholders per request, though we can define a terms section in the dictionary later if you want custom terms.
  // For now we'll use privacy structure but with generalized language to meet the "simple info" request.
  const t = translations[language].privacy;

  const isUzbek = language === "uz";

  return (
    <div className="flex-1 flex flex-col pt-20 sm:pt-24 md:pt-28 pb-8 sm:pb-12 md:pb-16 transition-all duration-300 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="bg-white p-8 sm:p-12 rounded-xl shadow-sm border border-gray-100">
          <div className="text-center mb-10">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#001c3b] mb-4">
              {isUzbek ? "Foydalanish shartlari" : "Условия использования"}
            </h1>
            <p className="text-sm text-gray-500">{t.lastUpdated}</p>
            <div className="w-16 h-1 bg-[#c9a96e] mx-auto mt-6"></div>
          </div>

          <div className="space-y-8 text-gray-700 leading-relaxed text-sm sm:text-base">
            <p className="indent-8 text-justify">
              {isUzbek
                ? "Ushbu foydalanish shartlari Diplomatik Akademiya saytidan foydalanish tartibini belgilaydi. Saytdan foydalanish orqali siz ushbu shartlarga rozilik bildirasiz."
                : "Данные условия использования определяют порядок использования сайта Дипломатической Академии. Используя сайт, вы соглашаетесь с этими условиями."}
            </p>

            <div>
              <h2 className="text-xl font-semibold text-[#001c3b] mb-3">
                1. {isUzbek ? "Umumiy qoidalar" : "Общие положения"}
              </h2>
              <p className="indent-8 text-justify">
                {isUzbek
                  ? "Veb-saytdagi barcha ma'lumotlar, shu jumladan lug'at atamalari faqat ta'lim va ma'lumot olish maqsadida taqdim etiladi. Foydalanuvchilar platformadan qonuniy maqsadlarda foydalanishlari shart."
                  : "Вся информация на веб-сайте, включая словарные термины, предоставляется исключительно в образовательных и информационных целях. Пользователи должны использовать платформу в законных целях."}
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-[#001c3b] mb-3">
                2.{" "}
                {isUzbek
                  ? "Intellektual mulk"
                  : "Интеллектуальная собственность"}
              </h2>
              <p className="indent-8 text-justify">
                {isUzbek
                  ? "Saytdagi barcha materiallar, jumladan matnlar, dizayn va atamalar Diplomatik Akademiyaning intellektual mulki hisoblanadi. Ulardan ruxsatsiz tijorat maqsadida foydalanish taqiqlanadi."
                  : "Все материалы на сайте, включая тексты, дизайн и термины, являются интеллектуальной собственностью Дипломатической Академии. Их несанкционированное использование в коммерческих целях запрещено."}
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-[#001c3b] mb-3">
                3. {isUzbek ? "O'zgartirishlar kiritish" : "Внесение изменений"}
              </h2>
              <p className="indent-8 text-justify">
                {isUzbek
                  ? "Diplomatik Akademiya ushbu shartlarni istalgan vaqtda oldindan ogohlantirmasdan o'zgartirish huquqini o'zida saqlab qoladi. O'zgartirishlar saytda e'lon qilingan vaqtdan boshlab kuchga kiradi."
                  : "Дипломатическая Академия оставляет за собой право вносить изменения в настоящие условия в любое время без предварительного уведомления. Изменения вступают в силу с момента публикации на сайте."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
