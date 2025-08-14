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
import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="min-h-[80vh] items-center bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col justify-center overflow-y-auto">
      {/* Main Content */}
      <div className="flex-1 items-center justify-center flex">
        <div className="max-w-7xl mx-auto items-center justify-center p-6">
          {/* Header Section */}
          <div className="text-center mb-16 items-center justify-center">
            <h1 className="text-5xl md:text-5xl text-center font-bold text-[#001c3b] mb-6">
              Tashqi ishlar varilgi Jahon iqtisodiyoti va diplomatiya
              universiteti huzuridagi
              <br /> diplomatik akademiyaning diplomatik {"lug'ati"}
            </h1>
            <p className="text-xl text-gray-600 text-justify max-w-6xl mx-auto leading-relaxed whitespace-pre-line indent-8">
              Луғат ҳозирги ўзбек тилининг халқаро муносабатларга оид соҳаси –
              сиёсат ва дипломатияда қўлланаётган 1000га яқин термин, сўз
              бирикмаси ва номларни ўз ичига олган. Қўлланма халқаро
              муносабатлар, сиёсатшунослик фанлари ўқиталидиган университетлар,
              институтлар тадқиқотчи ва талабалари, ёш дипломатлар, таржимонлар,
              қолаверса, шу соҳа билан қизиқувчи китобхонларга мўлжалланган.
              {"\n"}
            </p>
            <p className="text-xl text-gray-600 text-justify max-w-6xl mx-auto leading-relaxed whitespace-pre-line indent-8">
              Сўзбоши Ўзбекистон Республикаси Президенти Ш.М.Мирзиёевнинг 2019
              йил 21 октябрдаги “Ўзбек тилининг давлат тили сифатидаги нуфузи ва
              мавқеини тубдан ошириш чора-тадбирлари тўғрисида”ги фармонига
              мувофиқ давлат тили тўғрисидаги қонун ҳужжатларига риоя
              қилинишини, соҳага оид муаммоларни таҳлил этиб, бу борада ягона
              давлат сиёсати амалга оширилишини таъминлаш юзасидан Вазирлар
              Маҳкамасида Давлат тилини ривожлантириш департаменти ташкил этилди
              ва янги сўз ва атамаларни расмий истеъмолга киритиш борасидаги
              ишларни тартибга соладиган Атамалар комиссияси тузилди.
              {"\n"}
            </p>
            <p className="text-xl text-gray-600 text-justify max-w-6xl mx-auto leading-relaxed whitespace-pre-line indent-8">
              Қўлингиздаги “Дипломатик терминлар изоҳли луғати” ҳам шу ушбу
              чора-тадбирларга жавоб тариқасида соҳадаги эҳтиёжни бир мунча
              қондиришга хизмат қилади, деган мақсадда яратилди. Китоб ўзбек
              миллатининг халқаро соҳадаги онги ва сиёсий маданияти юксалишига,
              сиёсий масалалар ва дипломатик жараённи ўзбек тилида ифодалаб
              беришга хизмат қилувчи адабиётлар, жумладан луғатлар яратиш
              соҳасига қўшилган баҳолиқудрат ҳисса бўлади, деб умид қиламиз.
              Ушбу нашрни амалга оширишдан кўзланган яна бир мақсад сиёсат,
              дипломатия, умуман халаро муносабатлар соҳаси мутахассислари, ЖИДУ
              талабалари ва қолаверса, қизиқувчиларга шу соҳадаги терминлар,
              бирикма ва номларни ўрганиш ва ўз фаолиятларида қўллаш имкониятини
              яратиш бўлди.
              {"\n"}
            </p>
            <p className="text-xl text-gray-600 text-justify max-w-6xl mx-auto leading-relaxed whitespace-pre-line indent-8">
              Шу ўринда ҳамма соҳалар каби дипломатия тили ҳам ўз терминлари
              тизимига эга экани, унинг луғат бойлиги дипломатик, тарихий,
              маданий, лингвистик, ҳуқуқий ва бошқа хил иборалардан ташкил
              топганини эслатиб ўтиш лозим.
              {"\n"}
            </p>
            <p className="text-xl text-gray-600 text-justify max-w-6xl mx-auto leading-relaxed whitespace-pre-line indent-8">
              Дипломатия тили учун узун жумлалар, иборалар, кириш сўзлари ва
              боғловчиларнинг кўплиги хос. Дипломатик тил расмий тилдан,
              хусусан, халқаро сиёсат тилидан, журналистика тилидан, маълум
              даражада бадиий-адабий тилдан ҳам анча фарқ қилади.
              {"\n"}
            </p>
            <p className="text-xl text-gray-600 text-justify max-w-6xl mx-auto leading-relaxed whitespace-pre-line indent-8">
              Таъкидлаш жоизки, дипломатик атамалар асосан лотин, инглиз,
              француз тилларида яратилган ёки улар орқали воситачи тиллар
              сифатида кириб келган. Ҳар қандай замонавий тилда дипломатия ва
              сиёсатга тегишли терминлар фаол ривожланмоқда, шунинг учун
              инсоннинг дипломатия ва ташқи алоқалар билан боғлиқ ақлий фаолияти
              натижалари терминларда ифодаланмоқда, деб тахмин қилиш мантиқан
              тўғри.
              {"\n"}
            </p>
            <p className="text-xl text-gray-600 text-justify max-w-6xl mx-auto leading-relaxed whitespace-pre-line indent-8">
              Луғатдаги атамаларни танлашда ўзбек тили мезонларига, тил
              нормаларига риоя қилинди. Луғат ушбу соҳадаги дастлабки изланиш
              сифатида уни тузишда луғатчиликнинг барча анъана ва қоидаларига
              риоя қилишга ҳамда халқаро ҳаётда, сиёсатда қўлланаётган
              дипломатик терминларни имкон қадар тўплашга ҳаракат қилинди.
            </p>
            <div className="w-24 h-1 bg-[#c9a96e] mx-auto mt-6"></div>
          </div>

          {/* Partners Section */}
          <section className="w-full py-16 px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Bizning Hamkorlarimiz
            </h2>

            <div className="flex gap-8 w-full items-center justify-start md:justify-center overflow-x-auto py-4 scrollbar-hide">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 p-4 h-[160px] w-[200px] bg-white rounded-lg shadow flex items-center justify-center cursor-pointer hover:shadow-lg transition"
                  onClick={() =>
                    window.open("https://partner-link.com", "_blank")
                  }
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
          </section>

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
