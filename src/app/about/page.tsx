"use client";

import React from "react";
import { useLanguage } from "@/lib/LanguageContext";
import { translations } from "@/constants/translations";
import { PageContainer } from "@/components/ui/PageContainer";

export default function AboutPage() {
  const { language } = useLanguage();
  const t = translations[language].about;

  return (
    <PageContainer maxWidth="md">
      <div>
        {/* Header Section */}
        <div className="text-center mb-10 sm:mb-12 md:mb-16">
          <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-[#001c3b] mb-4 sm:mb-6 leading-tight">
            {t.title}
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 text-justify max-w-6xl mx-auto leading-relaxed whitespace-pre-line indent-8">
            {t.para1}
          </p>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 text-justify max-w-6xl mx-auto leading-relaxed whitespace-pre-line indent-8 mt-4 sm:mt-6">
            {t.para2}
          </p>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 text-justify max-w-6xl mx-auto leading-relaxed whitespace-pre-line indent-8 mt-4 sm:mt-6">
            {t.para3}
          </p>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 text-justify max-w-6xl mx-auto leading-relaxed whitespace-pre-line indent-8 mt-4 sm:mt-6">
            {t.para4}
          </p>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 text-justify max-w-6xl mx-auto leading-relaxed whitespace-pre-line indent-8 mt-4 sm:mt-6">
            {t.para5}
          </p>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 text-justify max-w-6xl mx-auto leading-relaxed whitespace-pre-line indent-8 mt-4 sm:mt-6">
            {t.para6}
          </p>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 text-justify max-w-6xl mx-auto leading-relaxed whitespace-pre-line indent-8 mt-4 sm:mt-6">
            {t.para7}
          </p>
          <div className="w-16 sm:w-20 md:w-24 h-1 bg-[#c9a96e] mx-auto mt-6 sm:mt-8"></div>
        </div>
      </div>
    </PageContainer>
  );
}

// {/* Partners Section */}
// {/* <section className="w-full py-16 px-4">
//   <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
//     Bizning Hamkorlarimiz
//   </h2>

//   <div className="flex gap-8 w-full items-center justify-start md:justify-center overflow-x-auto py-4 scrollbar-hide">
//     {[...Array(4)].map((_, i) => (
//       <div
//         key={i}
//         className="flex-shrink-0 p-4 h-[160px] w-[200px] bg-white rounded-lg shadow flex items-center justify-center cursor-pointer hover:shadow-lg transition"
//         onClick={() =>
//           window.open("https://partner-link.com", "_blank")
//         }
//       >
//         <Image
//           src={`/partner-${i + 1}.png`}
//           alt={`Hamkor ${i + 1}`}
//           width={150}
//           height={75}
//           className="object-contain"
//         />
//       </div>
//     ))}
//   </div>
// </section> */}

// {/* Mission Statement */}
// {/* <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
//   <div className="text-center mb-8">
//     <Target className="w-12 h-12 text-[#c9a96e] mx-auto mb-4" />
//     <h2 className="text-3xl font-semibold text-[#001c3b] mb-4">
//       Our Mission
//     </h2>
//   </div>
//   <p className="text-lg text-gray-700 leading-relaxed text-center max-w-4xl mx-auto">
//     The Diplomatic Academy is committed to advancing the art and
//     science of diplomacy through comprehensive education, research,
//     and practical training. We prepare skilled professionals who can
//     navigate complex international challenges with wisdom, integrity,
//     and cultural sensitivity.
//   </p>
// </div> */}

// {/* Core Values */}
// {/* <div className="grid md:grid-cols-3 gap-8 mb-16">
//   <div className="bg-white rounded-lg shadow-lg p-6 text-center">
//     <Globe className="w-12 h-12 text-[#c9a96e] mx-auto mb-4" />
//     <h3 className="text-xl font-semibold text-[#001c3b] mb-3">
//       Global Perspective
//     </h3>
//     <p className="text-gray-600 leading-relaxed">
//       We foster understanding of diverse cultures, political systems,
//       and international frameworks to prepare diplomats for the
//       complexities of global engagement.
//     </p>
//   </div>

//   <div className="bg-white rounded-lg shadow-lg p-6 text-center">
//     <Users className="w-12 h-12 text-[#c9a96e] mx-auto mb-4" />
//     <h3 className="text-xl font-semibold text-[#001c3b] mb-3">
//       Collaborative Leadership
//     </h3>
//     <p className="text-gray-600 leading-relaxed">
//       Our programs emphasize the importance of multilateral
//       cooperation, consensus-building, and diplomatic solutions to
//       international challenges.
//     </p>
//   </div>

//   <div className="bg-white rounded-lg shadow-lg p-6 text-center">
//     <Award className="w-12 h-12 text-[#c9a96e] mx-auto mb-4" />
//     <h3 className="text-xl font-semibold text-[#001c3b] mb-3">
//       Excellence & Integrity
//     </h3>
//     <p className="text-gray-600 leading-relaxed">
//       We maintain the highest standards of academic rigor and ethical
//       conduct, preparing graduates to serve with distinction in
//       diplomatic careers.
//     </p>
//   </div>
// </div> */}

// {/* History & Legacy */}
// {/* <div className="grid lg:grid-cols-2 gap-12 mb-16">
//   <div className="bg-[#001c3b] text-white rounded-lg shadow-lg p-8">
//     <BookOpen className="w-12 h-12 text-[#c9a96e] mb-6" />
//     <h2 className="text-2xl font-semibold mb-4">Our History</h2>
//     <p className="text-gray-300 leading-relaxed mb-4">
//       Founded in 1952, the Diplomatic Academy has been at the
//       forefront of diplomatic education for over seven decades. Our
//       institution was established in response to the growing need for
//       professionally trained diplomats in an increasingly
//       interconnected world.
//     </p>
//     <p className="text-gray-300 leading-relaxed">
//       Throughout the Cold War, decolonization, and the digital age, we
//       have continuously evolved our curriculum to address contemporary
//       diplomatic challenges while maintaining our commitment to
//       traditional diplomatic values.
//     </p>
//   </div>

//   <div className="bg-white rounded-lg shadow-lg p-8">
//     <GraduationCap className="w-12 h-12 text-[#c9a96e] mb-6" />
//     <h2 className="text-2xl font-semibold text-[#001c3b] mb-4">
//       Our Impact
//     </h2>
//     <div className="space-y-4">
//       <div className="flex items-center space-x-4">
//         <div className="w-16 h-16 bg-[#001c3b] text-white rounded-full flex items-center justify-center font-bold text-lg">
//           5,000+
//         </div>
//         <div>
//           <h3 className="font-semibold text-[#001c3b]">Graduates</h3>
//           <p className="text-gray-600 text-sm">
//             Serving in diplomatic missions worldwide
//           </p>
//         </div>
//       </div>
//       <div className="flex items-center space-x-4">
//         <div className="w-16 h-16 bg-[#c9a96e] text-white rounded-full flex items-center justify-center font-bold text-lg">
//           120+
//         </div>
//         <div>
//           <h3 className="font-semibold text-[#001c3b]">Countries</h3>
//           <p className="text-gray-600 text-sm">
//             Represented in our alumni network
//           </p>
//         </div>
//       </div>
//       <div className="flex items-center space-x-4">
//         <div className="w-16 h-16 bg-[#001c3b] text-white rounded-full flex items-center justify-center font-bold text-lg">
//           50+
//         </div>
//         <div>
//           <h3 className="font-semibold text-[#001c3b]">
//             Ambassadors
//           </h3>
//           <p className="text-gray-600 text-sm">
//             Currently serving as heads of mission
//           </p>
//         </div>
//       </div>
//     </div>
//   </div>
// </div> */}

// {/* Academic Programs */}
// {/* <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
//   <h2 className="text-3xl font-semibold text-[#001c3b] text-center mb-8">
//     Academic Excellence
//   </h2>
//   <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
//     <div className="text-center p-4">
//       <div className="w-16 h-16 bg-[#001c3b] text-white rounded-full flex items-center justify-center mx-auto mb-3">
//         <span className="font-bold">MA</span>
//       </div>
//       <h3 className="font-semibold text-[#001c3b] mb-2">
//         {"Master's"} Programs
//       </h3>
//       <p className="text-gray-600 text-sm">
//         International Relations, Diplomatic Studies, Global Governance
//       </p>
//     </div>
//     <div className="text-center p-4">
//       <div className="w-16 h-16 bg-[#c9a96e] text-white rounded-full flex items-center justify-center mx-auto mb-3">
//         <span className="font-bold">PhD</span>
//       </div>
//       <h3 className="font-semibold text-[#001c3b] mb-2">
//         Doctoral Programs
//       </h3>
//       <p className="text-gray-600 text-sm">
//         Advanced research in diplomatic history and theory
//       </p>
//     </div>
//     <div className="text-center p-4">
//       <div className="w-16 h-16 bg-[#001c3b] text-white rounded-full flex items-center justify-center mx-auto mb-3">
//         <span className="font-bold">EX</span>
//       </div>
//       <h3 className="font-semibold text-[#001c3b] mb-2">
//         Executive Education
//       </h3>
//       <p className="text-gray-600 text-sm">
//         Professional development for career diplomats
//       </p>
//     </div>
//     <div className="text-center p-4">
//       <div className="w-16 h-16 bg-[#c9a96e] text-white rounded-full flex items-center justify-center mx-auto mb-3">
//         <span className="font-bold">CE</span>
//       </div>
//       <h3 className="font-semibold text-[#001c3b] mb-2">
//         Continuing Education
//       </h3>
//       <p className="text-gray-600 text-sm">
//         Specialized courses and workshops
//       </p>
//     </div>
//   </div>
// </div> */}

// {/* Call to Action */}
// {/* <div className="bg-gradient-to-r from-[#001c3b] to-[#1e3a5f] text-white rounded-lg shadow-lg p-8 text-center">
//   <h2 className="text-3xl font-semibold mb-4">Join Our Legacy</h2>
//   <p className="text-xl text-gray-300 mb-6 max-w-2xl mx-auto">
//     Become part of a distinguished tradition of diplomatic excellence.
//     Shape the future of international relations.
//   </p>
//   <div className="space-x-4">
//     <button className="bg-[#c9a96e] hover:bg-[#a8834a] text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200">
//       Apply Now
//     </button>
//     <button className="border-2 border-white text-white hover:bg-white hover:text-[#001c3b] px-8 py-3 rounded-lg font-semibold transition-colors duration-200">
//       Learn More
//     </button>
//   </div>
// </div> */}
