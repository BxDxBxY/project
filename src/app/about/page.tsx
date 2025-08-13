"use client";

import React from "react";
import {
  GraduationCap,
  Globe,
  Users,
  Award,
  BookOpen,
  Target,
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-[80vh] items-center bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col justify-center overflow-y-auto">
      {/* Main Content */}
      <div className="flex-1 items-center justify-center flex">
        <div className="max-w-7xl mx-auto items-center justify-center p-6">
          {/* Header Section */}
          <div className="text-center mb-16 items-center justify-center">
            <h1 className="text-5xl md:text-5xl font-bold text-[#001c3b] mb-6">
              Jahon iqtisodiyoti va diplomatiya universiteti huzuridagi
              <br /> Diplomatik akademiyaning faoliyati haqida
            </h1>
            <p className="text-xl text-gray-600 text-justify max-w-6xl mx-auto leading-relaxed">
              Oʻzbekiston Respublikasi Prezidentining 2022-yil 23-iyuldagi
              “Jahon iqtisodiyoti va diplomatiya universiteti faoliyatini
              tizimli isloh qilish chora-tadbirlari toʻgʻrisida”gi PQ–330-sonli
              qaroriga asosan 2022-yil sentabr oyidan Jahon iqtisodiyoti va
              diplomatiya universiteti (JIDU) huzurida Diplomatik akademiya oʻz
              faoliyatini boshladi. Davlat rahbari tomonidan belgilab berilgan
              vazifalardan kelib chiqib, nisbatan qisqa vaqt ichida Diplomatik
              akademiyaning tashkiliy-meʼyoriy hujjatlari ishlab chiqildi va
              tasdiqlandi. Jumladan, Dipakademiya shtat jadvali, oʻquv rejalari
              va oʻquv dasturlari, tinglovchilar tayyorgarligini baholash tizimi
              qabul qilindi, Ilmiy kengash tarkibi shakllantirildi. Hozirgi
              kunda Diplomatik akademiya xodimlari shtati (2022-y. shtat jadvali
              boʻyicha) 90 foizga yetkazildi. Xodimlar va Dipakademiya oʻrtasida
              mehnat shartnomalari tuzildi. Boʻlimlar nizomlari ishlab chiqilgan
              va tasdiqlangan. Dipakademiyaning rasmiy veb-sayti ishga
              tushirilgan. 2022-yil 1-noyabr kuni Diplomatik akademiyaning
              ochilish marosimida davlat idoralari vakillari, Oʻzbekistonda
              akkreditatsiyadan oʻtgan qator xorijiy davlatlar diplomatik
              vakolatxonalari rahbarlari ishtirok etdilar. Zahiradagi
              diplomatlarni tizimli tayyorlash boʻyicha Dipakademiyaning
              “Oʻzbekiston Respublikasining tashqi siyosiy va tashqi iqtisodiy
              faoliyati” mavzusidagi birinchi oʻquv kursiga Tashqi ishlar
              vazirligi, Investitsiyalar va tashqi savdo vazirligi, Mudofaa
              vazirligi va Oʻzbekiston Respublikasi Oliy Majlisi Qonunchilik
              palatasi vakillaridan iborat 26 nafar tinglovchi qabul qilindi.
              2022-yil 19-noyabrdan 17-dekabrga qadar Oʻzbekiston Respublikasi
              Prezidenti Administratsiyasi xodimlari uchun “Diplomatik protokol
              va xalqaro muzokaralar” mavzusida maxsus oʻquv kursi tashkil
              etildi. Dipakademiya oʻquv jarayoniga xalqaro munosabatlar
              sohasida chuqur nazariy bilim va katta amaliy tajribaga ega milliy
              va xorijiy mutaxassislar jalb etildi. 2022-yil 27-dekabr kuni
              yuqorida koʻrsatilgan kursni muvaffaqiyatli tamomlagan
              tinglovchilarga Diplomatik akademiya sertifikatlari topshirildi.
            </p>
            <div className="w-24 h-1 bg-[#c9a96e] mx-auto mt-6"></div>
          </div>

          {/* Mission Statement */}
          {/* <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
            <div className="text-center mb-8">
              <Target className="w-12 h-12 text-[#c9a96e] mx-auto mb-4" />
              <h2 className="text-3xl font-semibold text-[#001c3b] mb-4">
                Our Mission
              </h2>
            </div>
            <p className="text-lg text-gray-700 leading-relaxed text-center max-w-4xl mx-auto">
              The Diplomatic Academy is committed to advancing the art and
              science of diplomacy through comprehensive education, research,
              and practical training. We prepare skilled professionals who can
              navigate complex international challenges with wisdom, integrity,
              and cultural sensitivity.
            </p>
          </div> */}

          {/* Core Values */}
          {/* <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <Globe className="w-12 h-12 text-[#c9a96e] mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-[#001c3b] mb-3">
                Global Perspective
              </h3>
              <p className="text-gray-600 leading-relaxed">
                We foster understanding of diverse cultures, political systems,
                and international frameworks to prepare diplomats for the
                complexities of global engagement.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <Users className="w-12 h-12 text-[#c9a96e] mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-[#001c3b] mb-3">
                Collaborative Leadership
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Our programs emphasize the importance of multilateral
                cooperation, consensus-building, and diplomatic solutions to
                international challenges.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <Award className="w-12 h-12 text-[#c9a96e] mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-[#001c3b] mb-3">
                Excellence & Integrity
              </h3>
              <p className="text-gray-600 leading-relaxed">
                We maintain the highest standards of academic rigor and ethical
                conduct, preparing graduates to serve with distinction in
                diplomatic careers.
              </p>
            </div>
          </div> */}

          {/* History & Legacy */}
          {/* <div className="grid lg:grid-cols-2 gap-12 mb-16">
            <div className="bg-[#001c3b] text-white rounded-lg shadow-lg p-8">
              <BookOpen className="w-12 h-12 text-[#c9a96e] mb-6" />
              <h2 className="text-2xl font-semibold mb-4">Our History</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Founded in 1952, the Diplomatic Academy has been at the
                forefront of diplomatic education for over seven decades. Our
                institution was established in response to the growing need for
                professionally trained diplomats in an increasingly
                interconnected world.
              </p>
              <p className="text-gray-300 leading-relaxed">
                Throughout the Cold War, decolonization, and the digital age, we
                have continuously evolved our curriculum to address contemporary
                diplomatic challenges while maintaining our commitment to
                traditional diplomatic values.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8">
              <GraduationCap className="w-12 h-12 text-[#c9a96e] mb-6" />
              <h2 className="text-2xl font-semibold text-[#001c3b] mb-4">
                Our Impact
              </h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-[#001c3b] text-white rounded-full flex items-center justify-center font-bold text-lg">
                    5,000+
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#001c3b]">Graduates</h3>
                    <p className="text-gray-600 text-sm">
                      Serving in diplomatic missions worldwide
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-[#c9a96e] text-white rounded-full flex items-center justify-center font-bold text-lg">
                    120+
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#001c3b]">Countries</h3>
                    <p className="text-gray-600 text-sm">
                      Represented in our alumni network
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-[#001c3b] text-white rounded-full flex items-center justify-center font-bold text-lg">
                    50+
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#001c3b]">
                      Ambassadors
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Currently serving as heads of mission
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div> */}

          {/* Academic Programs */}
          {/* <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
            <h2 className="text-3xl font-semibold text-[#001c3b] text-center mb-8">
              Academic Excellence
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-4">
                <div className="w-16 h-16 bg-[#001c3b] text-white rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="font-bold">MA</span>
                </div>
                <h3 className="font-semibold text-[#001c3b] mb-2">
                  {"Master's"} Programs
                </h3>
                <p className="text-gray-600 text-sm">
                  International Relations, Diplomatic Studies, Global Governance
                </p>
              </div>
              <div className="text-center p-4">
                <div className="w-16 h-16 bg-[#c9a96e] text-white rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="font-bold">PhD</span>
                </div>
                <h3 className="font-semibold text-[#001c3b] mb-2">
                  Doctoral Programs
                </h3>
                <p className="text-gray-600 text-sm">
                  Advanced research in diplomatic history and theory
                </p>
              </div>
              <div className="text-center p-4">
                <div className="w-16 h-16 bg-[#001c3b] text-white rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="font-bold">EX</span>
                </div>
                <h3 className="font-semibold text-[#001c3b] mb-2">
                  Executive Education
                </h3>
                <p className="text-gray-600 text-sm">
                  Professional development for career diplomats
                </p>
              </div>
              <div className="text-center p-4">
                <div className="w-16 h-16 bg-[#c9a96e] text-white rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="font-bold">CE</span>
                </div>
                <h3 className="font-semibold text-[#001c3b] mb-2">
                  Continuing Education
                </h3>
                <p className="text-gray-600 text-sm">
                  Specialized courses and workshops
                </p>
              </div>
            </div>
          </div> */}

          {/* Call to Action */}
          {/* <div className="bg-gradient-to-r from-[#001c3b] to-[#1e3a5f] text-white rounded-lg shadow-lg p-8 text-center">
            <h2 className="text-3xl font-semibold mb-4">Join Our Legacy</h2>
            <p className="text-xl text-gray-300 mb-6 max-w-2xl mx-auto">
              Become part of a distinguished tradition of diplomatic excellence.
              Shape the future of international relations.
            </p>
            <div className="space-x-4">
              <button className="bg-[#c9a96e] hover:bg-[#a8834a] text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200">
                Apply Now
              </button>
              <button className="border-2 border-white text-white hover:bg-white hover:text-[#001c3b] px-8 py-3 rounded-lg font-semibold transition-colors duration-200">
                Learn More
              </button>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}
