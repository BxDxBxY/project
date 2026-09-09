"use client";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";
import { translations } from "@/constants/translations";
import { PageContainer } from "@/components/ui/PageContainer";

export default function HomePage() {
  const { language } = useLanguage();
  const t = translations[language].home;
  // Homepage layout: 1 = original/simple, 2 = modern. Change this value to switch.
  const designMode: number = 1;

  return (
    <>
      {/* DESIGN MODE 1: ORIGINAL SIMPLE DESIGN */}
      {designMode === 1 && (
        <div className="transition-all duration-300">
          <section className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-10 flex justify-center items-start">
            <div className="flex flex-col items-center md:items-start text-center gap-6 sm:gap-7 w-full max-w-6xl">
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-[#001c3b] uppercase leading-snug tracking-tight">
                Diplomatik Terminlar Izohli Lug&apos;ati
              </h1>
              <hr className="w-full border-gray-400 opacity-20" />

              <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed text-justify">
                So&apos;nggi paytlarda xalqaro munosabatlar masalalari,
                ya&apos;ni jahon siyosati, diplomatiya, xalqaro iqtisodiy
                munosabatlar, xalqaro huquq sohalariga oid adabiyotlar yaratish
                eng dolzarb vazifalar qatoriga o&apos;tdi. Shu jihatdan, JIDU
                huzuridagi Diplomatik akademiyada shu sohani imkon qadar qamrab
                olgan mukammal lug&apos;at yaratildi, uning kitob va raqamli
                (elektron) shaklini tayyorlanishi bu sohadagi kamchilikni
                bartaraf etadi.
              </p>
              <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed text-justify">
                Markaziy Osiyo mamlakatlarida birinchi ilmiy asoslangan
                lug&apos;atning o&apos;zbek tilida tayyorlanishi va nashr
                etilishi muhim ilmiy ahamiyat kasb etadi. Mazkur loyiha
                natijasida o&apos;zbek diplomatik va xalqaro munosabatlar
                tilining boyishi va jiddiy tadqiqotlar ko&apos;payishiga asos
                bo&apos;ladi.
              </p>
              <hr className="w-full border-gray-400 opacity-20" />

              <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed text-justify">
                Lug&apos;at o&apos;zbek millatining xalqaro sohadagi ongi va
                siyosiy madaniyati yuqorilashiga, siyosiy masalalar va
                diplomatik jarayonni o&apos;zbek tilida ifodalashga xizmat
                qilishi sabab bo&apos;ladigan birinchi entsiklopedik manba
                bo&apos;ladi. Lug&apos;atdan o&apos;rin olgan termin, ibora,
                tushuncha va ma&apos;lumotlarning aksariyati hozirgacha davlat
                tilida nashr etilgan ma&apos;lumotnomalarda mavjud bo&apos;lmay,
                chet tilidagi turli adabiyot, manbalardan tarjima qilib
                kiritildi.
              </p>
              <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed text-justify">
                Telegram kanalimizga obuna bo&apos;ling:{" "}
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
          </section>
        </div>
      )}

      {/* DESIGN MODE 2: MODERN DESIGN */}
      {designMode === 2 && (
        <div>
          <PageContainer maxWidth="lg">
            {/* Hero Section */}
            <section className="text-center py-8 md:py-12">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#001c3b] tracking-tight mb-6 uppercase leading-tight">
                {t.heroTitle}
              </h1>
              <p className="mt-4 max-w-3xl mx-auto text-lg md:text-xl text-gray-600 leading-relaxed">
                Tashqi ishlar vazirligi Jahon iqtisodiyoti va diplomatiya
                universiteti huzuridagi Diplomatik akademiya
              </p>

              <div className="mt-10 flex justify-center gap-4">
                <Link
                  href="/dictionary"
                  className="px-8 py-4 bg-[#001c3b] text-white rounded-xl font-semibold hover:bg-[#003d7a] transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Lug&apos;atga o&apos;tish
                </Link>
              </div>
            </section>

            {/* Stats Section */}
            <section className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <h3 className="text-5xl font-bold text-[#001c3b] mb-2">500+</h3>
                <p className="text-gray-600 font-medium text-lg">
                  Diplomatik terminlar
                </p>
              </div>
              <div className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <h3 className="text-5xl font-bold text-[#1EB53A] mb-2">
                  1-chi
                </h3>
                <p className="text-gray-600 font-medium text-lg">
                  Markaziy Osiyoda
                </p>
              </div>
              <div className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <h3 className="text-5xl font-bold text-[#c9a96e] mb-2">
                  Milliy
                </h3>
                <p className="text-gray-600 font-medium text-lg">
                  O&apos;zbek lug&apos;ati
                </p>
              </div>
            </section>

            {/* Content Section with Book Image */}
            <section className="mt-16 grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
              <div className="md:col-span-4 flex justify-center">
                <div className="w-full max-w-[320px] relative aspect-[3/4] rounded-xl overflow-hidden shadow-2xl border-4 border-white">
                  <Image
                    src="/book.png"
                    alt="Diplomatik Lug’at kitobi"
                    fill
                    priority
                    className="object-contain"
                  />
                </div>
              </div>

              <div className="md:col-span-8 space-y-6">
                <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100">
                  <p className="text-base md:text-lg text-gray-700 leading-relaxed text-justify indent-8">
                    {t.heroPara1}
                  </p>
                </div>
                <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100">
                  <p className="text-base md:text-lg text-gray-700 leading-relaxed text-justify indent-8">
                    {t.heroPara2}
                  </p>
                </div>
                <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100">
                  <p className="text-base md:text-lg text-gray-700 leading-relaxed text-justify indent-8">
                    {t.heroPara3}
                  </p>
                </div>
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100">
                  <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                    {t.subscribe}{" "}
                    <a
                      href="https://t.me/diplugat"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#001c3b] hover:text-[#003d7a] font-semibold underline decoration-2 underline-offset-2 transition-colors"
                    >
                      https://t.me/diplugat
                    </a>
                  </p>
                </div>
              </div>
            </section>

            {/* Features Section */}
            <section className="mt-16 mb-12 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-2xl shadow-md p-8 text-center border border-gray-100 hover:shadow-lg transition-all hover:-translate-y-1">
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mb-6">
                  <svg
                    className="w-8 h-8 text-[#001c3b]"
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
                <p className="text-gray-600 leading-relaxed">
                  Diplomatik atamalarni tez topish uchun qulay qidiruv tizimi
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-md p-8 text-center border border-gray-100 hover:shadow-lg transition-all hover:-translate-y-1">
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center mb-6">
                  <svg
                    className="w-8 h-8 text-green-700"
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
                  Ko&apos;p tilli
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  O&apos;zbek, rus va ingliz tillarida foydalanish imkoniyati
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-md p-8 text-center border border-gray-100 hover:shadow-lg transition-all hover:-translate-y-1">
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-amber-100 to-amber-200 rounded-2xl flex items-center justify-center mb-6">
                  <svg
                    className="w-8 h-8 text-amber-700"
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
                <p className="text-gray-600 leading-relaxed">
                  Har bir atama uchun keng qamrovli va ilmiy tushuntirishlar
                </p>
              </div>
            </section>
          </PageContainer>
        </div>
      )}
    </>
  );
}
