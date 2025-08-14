"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import XIcon from "@mui/icons-material/X";
import { HeaderDefault } from "@/components/dictionary/HeaderDefault";

export default function HomePage() {
  return (
    <div className=" min-h-full  transition-all duration-300 bg-gradient-to-br from-gray-50 to-gray-100 ">
      {/* Hero Section */}
      {/* If you want to bring back the image, it will stack on mobile */}
      <section className="max-w-[1920px] mx-auto container flex justify-center items-start pt-[50px] h-full px-4">
        <div className="flex flex-col py-[50px]  items-start  justify-center text-center gap-4">
          <p className="text-2xl md:text-3xl text-justify font-bold text-gray-700 uppercase leading-snug">
            Diplomatik Terminlar Izohli {"Lug‘ati"}
          </p>
          <hr className="w-full opacity-20" />

          <p className="max-w-6xl  whitespace-pre-line text-justify   md:text-lg text-gray-600 leading-relaxed">
            Zamonaviy davr mutaxassislar o‘rtasida hamkorlikning yangi
            shakllarini izlash, ma’lumotni taqdim etish, olish va tarqatishning
            ilg‘or usullarini talab etadi. Shu munosabat bilan O‘zbekiston
            Respublikasi Tashqi ishlar vazirligi huzuridagi Jahon iqtisodiyoti
            va diplomatiya universitetining Diplomatik akademiyasi maxsus loyiha
            — “Diplomatik Terminlar Izohli Lug‘ati”ni taqdim etadi.
          </p>
          <p className="max-w-6xl  whitespace-pre-line text-justify   md:text-lg text-gray-600 leading-relaxed">
            Ushbu noyob elektron axborot resursida nafaqat xalqaro munosabatlar
            sohasida, balki yuridik, siyosiy, iqtisodiy va boshqa yo‘nalishlarda
            qo‘llaniladigan eng to‘liq va tizimlashtirilgan terminlar bazasi
            jamlangan.
          </p>
          <hr className="w-full opacity-20" />

          <p className="max-w-6xl  whitespace-pre-line text-justify   md:text-lg text-gray-600 leading-relaxed">
            Loyiha doirasida Telegram-kanal ishga tushirilgan bo‘lib, unda
            zamonaviy xalqaro diplomatik kun tartibidagi yangi va dolzarb
            terminlar har kuni e’lon qilinadi. Hamkasblar, talabalar,
            aspirantlar, o‘qituvchilar, olimlar va bitiruvchilarni lug‘atni
            boyitish jarayonida faol ishtirok etishga chorlaymiz. Yangi
            terminlar bo‘yicha fikr va takliflaringiz mamnuniyat bilan qabul
            qilinadi.
          </p>
          <p className="max-w-6xl  whitespace-pre-line text-justify   md:text-lg text-gray-600 leading-relaxed">
            Telegram kanalimizga obuna bo‘ling:{" "}
            <a
              href="https://t.me/Newdictionary"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              https://t.me/Newdictionary
            </a>
          </p>
        </div>
      </section>

      {/* <section className="max-w-[1920px] mx-auto min-h-[80vh] flex flex-col items-center justify-center px-4 text-center gap-8">
      <p className="text-3xl md:text-5xl font-bold text-gray-700 uppercase leading-snug">
        Tashqi ishlar vazirligi <br />
        Jahon iqtisodiyoti va diplomatiya universiteti huzuridagi <br />
        Diplomatik akademiyaning Diplomatik {"Lug'ati"}
      </p>
  
      <div className="flex justify-center">
        <Image
          src="/diplomatic-academy.jpg"
          alt="Diplomatik Akademiya"
          width={600}
          height={400}
          className="object-cover rounded-lg shadow-lg"
        />
      </div>
    </section> */}

      {/* <hr className="border-gray-200" /> */}

      {/* Partners Section */}
      {/* <section className="w-full py-16 px-4">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
        Bizning Hamkorlarimiz
      </h2>
  
      <div className="flex gap-8 w-full items-center justify-start md:justify-center overflow-x-auto py-4 scrollbar-hide">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="flex-shrink-0 p-4 h-[160px] w-[200px] bg-white rounded-lg shadow flex items-center justify-center cursor-pointer hover:shadow-lg transition"
            onClick={() => window.open("https://partner-link.com", "_blank")}
          >
            <Image
              src={`/partner-${i + 1}.png`}
              alt={`Hamkor ${i + 1}`}
              width={150}
              height={75}
              className="object-contain"
            />
          </div>
        ))}
      </div>
    </section> */}
    </div>
  );
}

// <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col items-center justify-center p-8">
//   {/* Logo & Title */}
//   <div className="max-w-5xl mx-auto text-center">
//     <div className="flex justify-center mb-4">
//       <Image
//         src="/logo.png" // 🔹 Dip Academy logo URL goes here
//         alt="Diplomatik Akademiya Logotipi"
//         width={120}
//         height={120}
//         className="rounded-full shadow-lg"
//       />
//     </div>

//     <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
//       Diplomatik Lug‘at
//     </h1>

//     <p className="text-lg md:text-xl text-gray-700 mb-6 leading-relaxed">
//       Jahon iqtisodiyoti va diplomatiya universiteti huzuridagi Diplomatik
//       akademiyaning faoliyati haqida
//     </p>

//     <p className="text-base text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
//       Oʻzbekiston Respublikasi Prezidentining 2022-yil 23-iyuldagi “Jahon
//       iqtisodiyoti va diplomatiya universiteti faoliyatini tizimli isloh
//       qilish chora-tadbirlari toʻgʻrisida”gi PQ–330-sonli qaroriga asosan
//       2022-yil sentabr oyidan Jahon iqtisodiyoti va diplomatiya universiteti
//       (JIDU) huzurida Diplomatik akademiya oʻz faoliyatini boshladi.
//     </p>

//     {/* Buttons */}
//     <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
//       <Link
//         href="/dictionary"
//         className="inline-flex items-center px-8 py-3 text-lg font-medium rounded-md text-white bg-blue-700 hover:bg-blue-800 shadow transition-colors duration-200"
//       >
//         Lug‘atni ko‘rish
//       </Link>

//       <Link
//         href="/about"
//         className="inline-flex items-center px-8 py-3 border border-gray-300 text-lg font-medium rounded-md text-gray-700 bg-white hover:bg-gray-100 shadow-sm transition-colors duration-200"
//       >
//         Batafsil ma’lumot
//       </Link>
//     </div>
//   </div>

//   {/* Features Section */}
//   <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
//     <div className="bg-white rounded-lg shadow-lg p-6 text-center">
//       <div className="flex items-center justify-center w-14 h-14 mx-auto bg-blue-100 rounded-full mb-4">
//         <svg
//           className="w-7 h-7 text-blue-700"
//           fill="none"
//           stroke="currentColor"
//           viewBox="0 0 24 24"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth={2}
//             d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
//           />
//         </svg>
//       </div>
//       <h3 className="text-lg font-semibold text-gray-900 mb-2">
//         Tezkor qidiruv
//       </h3>
//       <p className="text-gray-600 text-sm">
//         Diplomatik atamalarni tez topish uchun qulay qidiruv tizimi.
//       </p>
//     </div>

//     <div className="bg-white rounded-lg shadow-lg p-6 text-center">
//       <div className="flex items-center justify-center w-14 h-14 mx-auto bg-green-100 rounded-full mb-4">
//         <svg
//           className="w-7 h-7 text-green-700"
//           fill="none"
//           stroke="currentColor"
//           viewBox="0 0 24 24"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth={2}
//             d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
//           />
//         </svg>
//       </div>
//       <h3 className="text-lg font-semibold text-gray-900 mb-2">
//         Ko‘p tilli qo‘llab-quvvatlash
//       </h3>
//       <p className="text-gray-600 text-sm">
//         Ingliz, o‘zbek va rus tillarida foydalanish imkoniyati.
//       </p>
//     </div>

//     <div className="bg-white rounded-lg shadow-lg p-6 text-center">
//       <div className="flex items-center justify-center w-14 h-14 mx-auto bg-purple-100 rounded-full mb-4">
//         <svg
//           className="w-7 h-7 text-purple-700"
//           fill="none"
//           stroke="currentColor"
//           viewBox="0 0 24 24"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth={2}
//             d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
//           />
//         </svg>
//       </div>
//       <h3 className="text-lg font-semibold text-gray-900 mb-2">
//         Batafsil izohlar
//       </h3>
//       <p className="text-gray-600 text-sm">
//         Har bir diplomatik atama uchun keng qamrovli tushuntirishlar.
//       </p>
//     </div>
//   </div>

//   {/* Partners Section */}
//   <div className="w-full max-w-6xl mt-20">
//     <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
//       Bizning hamkorlarimiz
//     </h2>
//     <div className="flex gap-8 overflow-x-auto py-4 px-2 scrollbar-hide">
//       {/* Example partner logos */}
//       {[...Array(6)].map((_, i) => (
//         <div
//           key={i}
//           className="flex-shrink-0 w-40 h-24 bg-white rounded-lg shadow flex items-center justify-center"
//         >
//           <Image
//             src="" // Partner logo URL
//             alt={`Hamkor ${i + 1}`}
//             width={100}
//             height={50}
//           />
//         </div>
//       ))}
//     </div>
//   </div>
// </div>

("");
// export default function HomePage() {
//   return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-200 flex flex-col items-center justify-center p-8">
//         <div className="max-w-4xl mx-auto text-center">
//           <h1 className="text-5xl font-bold text-gray-900 mb-6">
//             Diplomatic Dictionary
//           </h1>

//           <p className="text-xl text-gray-700 mb-8 leading-relaxed">
//             A comprehensive resource for diplomatic terms, concepts, and terminology
//             used in international relations and foreign affairs.
//           </p>

//           <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
//             <Link
//               href="/dictionary"
//               className="inline-flex items-center px-8 py-3 border border-transparent text-lg font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
//             >
//               Browse Dictionary
//             </Link>

//             <Link
//               href="/about"
//               className="inline-flex items-center px-8 py-3 border border-gray-300 text-lg font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
//             >
//               Learn More
//             </Link>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
//             <div className="bg-white rounded-lg shadow-lg p-6">
//               <div className="flex items-center justify-center w-12 h-12 mx-auto bg-blue-100 rounded-full mb-4">
//                 <svg
//                   className="w-6 h-6 text-blue-600"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
//                   />
//                 </svg>
//               </div>
//               <h3 className="text-lg font-semibold text-gray-900 mb-2">
//                 Comprehensive Search
//               </h3>
//               <p className="text-gray-600">
//                 Find diplomatic terms quickly with our advanced search and filtering capabilities.
//               </p>
//             </div>

//             <div className="bg-white rounded-lg shadow-lg p-6">
//               <div className="flex items-center justify-center w-12 h-12 mx-auto bg-green-100 rounded-full mb-4">
//                 <svg
//                   className="w-6 h-6 text-green-600"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
//                   />
//                 </svg>
//               </div>
//               <h3 className="text-lg font-semibold text-gray-900 mb-2">
//                 Multi-Language Support
//               </h3>
//               <p className="text-gray-600">
//                 Access terms in multiple languages including English, Uzbek, and Russian.
//               </p>
//             </div>

//             <div className="bg-white rounded-lg shadow-lg p-6">
//               <div className="flex items-center justify-center w-12 h-12 mx-auto bg-purple-100 rounded-full mb-4">
//                 <svg
//                   className="w-6 h-6 text-purple-600"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
//                   />
//                 </svg>
//               </div>
//               <h3 className="text-lg font-semibold text-gray-900 mb-2">
//                 Detailed Definitions
//               </h3>
//               <p className="text-gray-600">
//                 Get comprehensive explanations and context for each diplomatic term.
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//   );
// }
