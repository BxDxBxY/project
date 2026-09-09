import type { LanguageCode } from "./translations";
import { ORGANIZATION } from "./organization";

/**
 * Saytning huquqiy hujjatlari.
 *
 * MUHIM: ushbu matnlar huquqiy loyiha (draft) hisoblanadi. Ular sayt real
 * ravishda nima qilayotganiga qarab yozilgan, biroq nashr etishdan oldin
 * Akademiyaning yuridik xizmati tomonidan tasdiqlanishi shart.
 *
 * ВАЖНО: тексты являются юридическим проектом (draft). Они описывают то, что
 * сайт делает фактически, но перед публикацией должны быть согласованы
 * юридической службой Академии.
 */

export interface LegalTable {
  headers: string[];
  rows: string[][];
}

export interface LegalSection {
  title: string;
  paragraphs?: string[];
  bullets?: string[];
  table?: LegalTable;
}

export interface LegalDocument {
  title: string;
  effectiveDate: string;
  intro: string[];
  sections: LegalSection[];
  footerNote?: string;
}

export type LegalDocKey = "privacy" | "terms" | "cookies" | "refund";

const uzOrg = ORGANIZATION.uz;
const ruOrg = ORGANIZATION.ru;

const UZ_EFFECTIVE = "2026-yil 9-sentabr";
const RU_EFFECTIVE = "9 сентября 2026 года";

/* ------------------------------------------------------------------ */
/*  OʻZBEKCHA / УЗБЕКСКИЙ                                              */
/* ------------------------------------------------------------------ */

const uzPrivacy: LegalDocument = {
  title: "Maxfiylik siyosati",
  effectiveDate: `Kuchga kirgan sana: ${UZ_EFFECTIVE}`,
  intro: [
    "Ushbu Maxfiylik siyosati saytda shaxsga oid qanday maʼlumotlar toʻplanishini, ular qanday maqsadda va qanday huquqiy asosda ishlanishini, kimga uzatilishini va foydalanuvchi qanday huquqlarga ega ekanini tushuntiradi.",
    "Siyosat Oʻzbekiston Respublikasining «Shaxsga oid maʼlumotlar toʻgʻrisida» 2019-yil 2-iyuldagi OʻRQ-547-son Qonuni (keyingi oʻzgartirishlar bilan) talablariga muvofiq tuzilgan.",
  ],
  sections: [
    {
      title: "1. Maʼlumotlar operatori",
      paragraphs: [
        "Shaxsga oid maʼlumotlarning egasi va operatori:",
      ],
      bullets: [
        `Toʻliq nomi: ${uzOrg.legalName}`,
        `Manzil: ${uzOrg.address}`,
        `Telefon: ${uzOrg.phone}`,
        `Umumiy masalalar uchun e-pochta: ${uzOrg.email}`,
        `Shaxsga oid maʼlumotlar boʻyicha murojaatlar: ${uzOrg.privacyEmail}`,
        `STIR: ${uzOrg.taxId}`,
        `Shaxsga oid maʼlumotlar bazasining Davlat reyestridagi holati: ${uzOrg.dataRegistryNumber}`,
      ],
    },
    {
      title: "2. Biz qanday maʼlumotlarni toʻplaymiz",
      paragraphs: [
        "Saytdan lugʻat sifatida foydalanish uchun roʻyxatdan oʻtish talab qilinmaydi va shaxsni identifikatsiya qiluvchi maʼlumot soʻralmaydi. Maʼlumotlar faqat quyidagi hollarda toʻplanadi:",
      ],
      bullets: [
        "Aloqa formasi: familiya, ism (siz kiritgan koʻrinishda), e-pochta manzili va murojaat matni. Bu maʼlumotlarni siz ixtiyoriy ravishda taqdim etasiz.",
        "Texnik maʼlumotlar: IP-manzil va soʻrov vaqti — spam va suiisteʼmoldan himoya qilish uchun (bir IP-manzildan soatda beshdan ortiq murojaat yuborilishini cheklash). IP-manzil serverning vaqtinchalik xotirasida saqlanadi va bir soatdan keyin avtomatik oʻchiriladi.",
        "Cookie-fayllar: tanlangan til, cookie boʻyicha rozilik holati. Statistika cookie-fayllari faqat siz rozilik bergan boʻlsangiz ishlatiladi (Cookie-fayllar siyosatiga qarang).",
        "Xizmat xodimlari uchun: administrativ panelga kirish uchun autentifikatsiya tokenlari. Bu maʼlumotlar oddiy foydalanuvchilarga tegishli emas.",
      ],
    },
    {
      title: "3. Ishlov berish maqsadlari va huquqiy asoslari",
      table: {
        headers: ["Maʼlumot", "Maqsad", "Huquqiy asos"],
        rows: [
          [
            "Ism, e-pochta, murojaat matni",
            "Murojaatni koʻrib chiqish va javob berish",
            "Subyektning roziligi (forma yuborilishidan oldin belgilanadigan rozilik belgisi)",
          ],
          [
            "IP-manzil (vaqtinchalik)",
            "Spam, avtomatlashtirilgan hujum va suiisteʼmoldan himoya",
            "Operatorning axborot xavfsizligini taʼminlash boʻyicha qonuniy manfaati",
          ],
          [
            "Til va rozilik cookie-fayllari",
            "Saytning ishlashi va tanlovingizni eslab qolish",
            "Xizmatni taqdim etish uchun zaruriyat",
          ],
          [
            "Statistika cookie-fayllari",
            "Saytdan foydalanish statistikasini umumlashtirilgan holda tahlil qilish",
            "Subyektning roziligi (istalgan vaqtda bekor qilinishi mumkin)",
          ],
        ],
      },
    },
    {
      title: "4. Uchinchi tomon xizmatlari va maʼlumotlarning uzatilishi",
      paragraphs: [
        "Biz shaxsga oid maʼlumotlarni sotmaymiz, ijaraga bermaymiz va reklama maqsadida uchinchi shaxslarga oshkor qilmaymiz. Saytning ishlashi uchun quyidagi provayderlardan foydalaniladi:",
      ],
      bullets: [
        "Google reCAPTCHA — aloqa formasini avtomatlashtirilgan spamdan himoya qilish. Xizmat faqat siz formani toʻldirishni boshlaganingizda yuklanadi.",
        "Google Analytics — umumlashtirilgan tashrif statistikasi. Faqat siz rozilik bergandan keyin yuklanadi.",
        "Hosting va serverni texnik xizmat koʻrsatuvchi provayder — maʼlumotlarni saqlash.",
        "Vakolatli davlat organlari — faqat qonun hujjatlarida belgilangan hollarda va tartibda.",
      ],
    },
    {
      title: "5. Maʼlumotlarning chegaradan tashqariga uzatilishi",
      paragraphs: [
        "Google xizmatlaridan foydalanish natijasida ayrim texnik maʼlumotlar (IP-manzil, brauzer va qurilma haqidagi maʼlumotlar) Oʻzbekiston Respublikasi hududidan tashqariga, jumladan Amerika Qoʻshma Shtatlariga uzatilishi mumkin.",
        "Chegaradan tashqariga uzatish «Shaxsga oid maʼlumotlar toʻgʻrisida»gi Qonun talablariga rioya etilgan holda amalga oshirilishi kerak. Statistika xizmatlari uchun asos — sizning roziligingiz; roziligingizni bermaslik yoki bekor qilish saytdan foydalanish imkoniyatini cheklamaydi.",
      ],
    },
    {
      title: "6. Saqlash muddatlari",
      bullets: [
        "Aloqa formasi orqali yuborilgan murojaatlar — murojaat koʻrib chiqilgach, ish yuritish qoidalarida belgilangan muddat davomida, lekin bir yildan koʻp boʻlmagan muddatda saqlanadi (aniq muddat Akademiyaning ish yuritish tartibi bilan belgilanadi).",
        "IP-manzil — bir soatgacha (spamdan himoya mexanizmi doirasida).",
        "Til va rozilik cookie-fayllari — 12 oygacha.",
        "Statistika cookie-fayllari — Cookie-fayllar siyosatida koʻrsatilgan muddatlarda.",
        "Rozilik bekor qilinganda yoki maqsad yoʻqolganda maʼlumotlar oʻchiriladi yoki anonimlashtiriladi.",
      ],
    },
    {
      title: "7. Subyektning huquqlari",
      paragraphs: [
        "«Shaxsga oid maʼlumotlar toʻgʻrisida»gi Qonunga muvofiq siz quyidagi huquqlarga egasiz:",
      ],
      bullets: [
        "oʻzingizga oid maʼlumotlar ishlanishi haqida bilish va ular bilan tanishish;",
        "notoʻgʻri yoki toʻliq boʻlmagan maʼlumotlarni aniqlashtirish, toʻgʻrilash;",
        "maʼlumotlarni bloklash yoki yoʻq qilishni talab qilish;",
        "berilgan rozilikni istalgan vaqtda bekor qilish;",
        "operatorning harakatlari ustidan vakolatli davlat organiga yoki sudga shikoyat qilish.",
      ],
    },
    {
      title: "8. Huquqlarni amalga oshirish tartibi",
      paragraphs: [
        `Murojaatni yuqorida koʻrsatilgan e-pochta manzili yoki pochta manzili orqali yuborishingiz mumkin. Murojaatda shaxsingizni tasdiqlash uchun zarur maʼlumotlar va talabingiz mohiyati koʻrsatilishi lozim. Javob qonun hujjatlarida belgilangan muddatlarda beriladi.`,
      ],
    },
    {
      title: "9. Maʼlumotlar xavfsizligi",
      paragraphs: [
        "Biz maʼlumotlarni himoya qilish uchun tashkiliy va texnik chora-tadbirlarni qoʻllaymiz: HTTPS/TLS shifrlash, administrativ panelga kirishni cheklash, murojaatlar sonini cheklash, xizmat maʼlumotlariga faqat vakolatli xodimlarning kirishi.",
        "Shu bilan birga, internet orqali maʼlumot uzatishning mutlaq xavfsizligini hech bir tashkilot kafolatlay olmasligini ogohlantiramiz. Biz faqat oqilona va amaliyotda qoʻllanadigan darajadagi himoyani taʼminlashni majburiyat qilib olamiz.",
      ],
    },
    {
      title: "10. Voyaga yetmaganlarning maʼlumotlari",
      paragraphs: [
        "Sayt umumiy auditoriyaga qaratilgan maʼlumot-taʼlim resursi boʻlib, voyaga yetmaganlardan maqsadli ravishda shaxsga oid maʼlumot toʻplamaydi. Agar voyaga yetmagan shaxsga oid maʼlumot qonuniy vakilning roziligisiz yuborilganini aniqlasak, uni oʻchiramiz.",
      ],
    },
    {
      title: "11. Siyosatga oʻzgartirishlar",
      paragraphs: [
        "Siyosat yangilanishi mumkin. Yangi tahrir saytda eʼlon qilingan kundan kuchga kiradi; muhim oʻzgarishlar haqida sayt orqali alohida xabar beriladi. Hujjatning yuqorisida kuchga kirish sanasi koʻrsatiladi.",
      ],
    },
  ],
  footerNote:
    "Ushbu siyosat boʻyicha savollar boʻlsa, yuqorida koʻrsatilgan manzillar orqali murojaat qiling.",
};

const uzTerms: LegalDocument = {
  title: "Foydalanish shartlari",
  effectiveDate: `Kuchga kirgan sana: ${UZ_EFFECTIVE}`,
  intro: [
    "Ushbu shartlar saytdan foydalanish qoidalarini belgilaydi. Saytdan foydalanishni davom ettirish orqali siz shartlarga rozilik bildirasiz. Shartlarga rozi boʻlmasangiz, saytdan foydalanmasligingizni soʻraymiz.",
  ],
  sections: [
    {
      title: "1. Umumiy qoidalar",
      paragraphs: [
        `Sayt ${uzOrg.legalName} tomonidan maʼlumot-taʼlim maqsadida yuritiladi.`,
        "Sayt hozirda sinov (test) tartibida ishlaydi: ayrim maʼlumotlar toʻliq boʻlmasligi yoki tahrir qilinishi mumkin.",
      ],
    },
    {
      title: "2. Resursning maqomi va vazifasi",
      paragraphs: [
        "Saytdagi terminlar, izohlar va sharhlar ilmiy-maʼrifiy xarakterga ega boʻlib, faqat maʼlumot olish va oʻqish maqsadida taqdim etiladi.",
        "Saytdagi materiallar xalqaro huquq normalarining rasmiy talqini, Oʻzbekiston Respublikasi Tashqi ishlar vazirligining rasmiy pozitsiyasi yoki huquqiy maslahat hisoblanmaydi. Rasmiy hujjatlar, shartnomalar va normativ-huquqiy hujjatlar bilan ishlashda birlamchi manbalarga tayanish lozim.",
      ],
    },
    {
      title: "3. Intellektual mulk",
      paragraphs: [
        "Saytdagi materiallar (lugʻat maqolalari, izohlar, tuzilma, dizayn, logotip va grafik elementlar) mualliflik huquqi obyekti boʻlib, Akademiyaga yoki tegishli huquq egalariga tegishli.",
        "Ilmiy va oʻquv maqsadlarida manbaga havola koʻrsatilgan holda oʻrinli hajmda iqtibos keltirishga ruxsat beriladi.",
      ],
      bullets: [
        "Taqiqlanadi: materiallarni tijorat maqsadida qayta nashr etish, sotish yoki tarqatish;",
        "Taqiqlanadi: lugʻat bazasini toʻliq yoki qismlarga boʻlib avtomatlashtirilgan usulda koʻchirish (scraping, massiv yuklab olish);",
        "Taqiqlanadi: mualliflik va manba haqidagi maʼlumotlarni oʻzgartirish yoki olib tashlash.",
      ],
    },
    {
      title: "4. Foydalanuvchining majburiyatlari",
      bullets: [
        "saytning ishlashiga xalaqit beruvchi harakatlar qilmaslik (ortiqcha yuklama, zararli kod, himoya vositalarini chetlab oʻtish);",
        "boshqa shaxslarning huquqlarini buzmaslik, haqoratli yoki qonunga xilof kontent yubormaslik;",
        "aloqa formasidan spam yoki reklama tarqatish uchun foydalanmaslik.",
      ],
    },
    {
      title: "5. Foydalanuvchi murojaatlari",
      paragraphs: [
        "Aloqa formasi orqali yuborilgan taklif va tuzatishlar Akademiya tomonidan lugʻatni takomillashtirish uchun ishlatilishi mumkin. Murojaat yuborish orqali siz yuborgan matndan shu maqsadda foydalanishga rozilik berasiz; bu Akademiyaga sizning shaxsingizni oshkor qilish huquqini bermaydi.",
      ],
    },
    {
      title: "6. Kafolatlardan voz kechish",
      paragraphs: [
        "Materiallar «boricha» (as is) taqdim etiladi. Akademiya maʼlumotlarning mutlaq toʻliqligi, xatolardan xoliligi yoki saytning uzluksiz ishlashini kafolatlamaydi.",
        "Terminlarning talqini vaqt oʻtishi bilan oʻzgarishi mumkin; muhim qarorlar qabul qilishda birlamchi manbalarni tekshirish foydalanuvchining javobgarligida.",
      ],
    },
    {
      title: "7. Javobgarlikni cheklash",
      paragraphs: [
        "Qonun hujjatlarida ruxsat etilgan doirada Akademiya saytdagi maʼlumotlardan foydalanish natijasida yuzaga kelgan bevosita yoki bilvosita zarar uchun javobgar boʻlmaydi.",
        "Bu qoida qonun hujjatlariga muvofiq cheklab boʻlmaydigan javobgarlikni istisno qilmaydi.",
      ],
    },
    {
      title: "8. Tashqi havolalar",
      paragraphs: [
        "Saytda uchinchi tomon resurslariga havolalar boʻlishi mumkin. Akademiya bu resurslarning mazmuni, maxfiylik siyosati yoki xavfsizligi uchun javobgar emas.",
      ],
    },
    {
      title: "9. Xizmatni oʻzgartirish va toʻxtatish",
      paragraphs: [
        "Akademiya saytning funksiyalarini, tarkibini va ishlash tartibini oldindan xabar bermasdan oʻzgartirish, shuningdek xizmat koʻrsatishni vaqtincha toʻxtatish huquqini saqlab qoladi.",
      ],
    },
    {
      title: "10. Qoʻllanadigan huquq va nizolarni hal etish",
      paragraphs: [
        "Ushbu shartlarga Oʻzbekiston Respublikasi qonunchiligi qoʻllanadi. Nizolar avvalo muzokaralar yoʻli bilan hal etiladi; kelishuvga erishilmasa, Oʻzbekiston Respublikasi sudlari tomonidan koʻrib chiqiladi.",
      ],
    },
    {
      title: "11. Shartlarga oʻzgartirishlar",
      paragraphs: [
        "Shartlar yangilanishi mumkin. Yangi tahrir saytda eʼlon qilingan kundan kuchga kiradi. Kuchga kirish sanasi hujjatning yuqorisida koʻrsatiladi.",
      ],
    },
  ],
  footerNote: `Savollar boʻyicha: ${uzOrg.email}`,
};

const uzCookies: LegalDocument = {
  title: "Cookie-fayllar siyosati",
  effectiveDate: `Kuchga kirgan sana: ${UZ_EFFECTIVE}`,
  intro: [
    "Cookie-fayllar — brauzeringiz qurilmangizda saqlaydigan kichik matn fayllari. Ular saytning toʻgʻri ishlashiga va tanlovlaringizni eslab qolishga yordam beradi.",
    "Sayt zarur boʻlmagan cookie-fayllarni faqat siz rozilik bergandan keyin oʻrnatadi. Roziligingizni istalgan vaqtda oʻzgartirishingiz mumkin.",
  ],
  sections: [
    {
      title: "1. Sayt foydalanadigan cookie-fayllar",
      table: {
        headers: ["Nomi", "Turi", "Vazifasi", "Saqlanish muddati", "Kim oʻrnatadi"],
        rows: [
          [
            "language",
            "Zarur",
            "Tanlangan interfeys tilini eslab qolish",
            "12 oy",
            "Sayt",
          ],
          [
            "cookie_consent",
            "Zarur",
            "Cookie boʻyicha tanlovingizni saqlash",
            "12 oy",
            "Sayt",
          ],
          [
            "_ga, _ga_*",
            "Statistika",
            "Umumlashtirilgan tashrif statistikasi (Google Analytics)",
            "24 oygacha",
            "Google",
          ],
          [
            "_GRECAPTCHA",
            "Xavfsizlik",
            "Aloqa formasini spamdan himoya qilish (reCAPTCHA)",
            "6 oygacha",
            "Google",
          ],
          [
            "access_token, refresh_token",
            "Zarur (faqat xodimlar)",
            "Administrativ panelga kirishni tasdiqlash",
            "Sessiya davomida",
            "Sayt",
          ],
        ],
      },
    },
    {
      title: "2. Rozilikni boshqarish",
      bullets: [
        "Saytga birinchi kirganda cookie boʻyicha banner koʻrsatiladi: «Barchasini qabul qilish» yoki «Faqat zarurlari».",
        "Tanlovingizni sahifaning quyi qismidagi «Cookie sozlamalari» havolasi orqali istalgan vaqtda oʻzgartirishingiz mumkin.",
        "Brauzer sozlamalarida cookie-fayllarni oʻchirish yoki bloklash ham mumkin.",
      ],
    },
    {
      title: "3. Rozilik bermasangiz nima boʻladi",
      paragraphs: [
        "Statistika cookie-fayllaridan voz kechish lugʻatdan foydalanishni cheklamaydi: qidiruv, terminlar va barcha sahifalar toʻliq ishlaydi. Zarur cookie-fayllar saytning ishlashi uchun kerak, shuning uchun ular oʻchirilmaydi.",
      ],
    },
    {
      title: "4. Uchinchi tomon xizmatlari",
      paragraphs: [
        "Google Analytics va Google reCAPTCHA — Google LLC xizmatlari. Ushbu xizmatlar oʻz maxfiylik siyosatiga ega:",
      ],
      bullets: [
        "Google maxfiylik siyosati: https://policies.google.com/privacy",
        "Google xizmatlaridan foydalanish shartlari: https://policies.google.com/terms",
      ],
    },
    {
      title: "5. Oʻzgartirishlar",
      paragraphs: [
        "Sayt yangi xizmatlardan foydalanganda ushbu siyosat yangilanadi. Yangilanish sanasi hujjatning yuqorisida koʻrsatiladi.",
      ],
    },
  ],
};

const uzRefund: LegalDocument = {
  title: "Toʻlovlarni qaytarish siyosati",
  effectiveDate: `Kuchga kirgan sana: ${UZ_EFFECTIVE}`,
  intro: [
    "MUHIM: hozirda saytdagi barcha funksiyalar — lugʻatdan foydalanish, qidiruv, terminlarni koʻrish — bepul. Sayt toʻlov qabul qilmaydi, obuna sotmaydi va bank kartasi maʼlumotlarini soʻramaydi. Shu sababli ayni vaqtda qaytarish uchun asos ham yuzaga kelmaydi.",
    "Ushbu hujjat kelgusida pullik xizmatlar (masalan, muassasalar uchun litsenziya, API yoki oʻquv kurslari) joriy etilgan taqdirda qoʻllanadigan qoidalarni oldindan belgilaydi.",
  ],
  sections: [
    {
      title: "1. Qoʻllanish sohasi",
      paragraphs: [
        "Qoidalar faqat Akademiya rasmiy ravishda joriy etgan va saytda oshkor eʼlon qilingan pullik xizmatlarga qoʻllanadi. Pullik xizmat joriy etilganda uning narxi, tarkibi va toʻlov tartibi ommaviy oferta shaklida alohida eʼlon qilinadi.",
      ],
    },
    {
      title: "2. Toʻlovni qaytarish asoslari",
      bullets: [
        "xizmat texnik nosozlik tufayli koʻrsatilmagan yoki qisman koʻrsatilgan boʻlsa;",
        "toʻlov texnik xato tufayli takroriy yoki notoʻgʻri summada amalga oshirilgan boʻlsa;",
        "xizmat eʼlon qilingan tavsifga muvofiq kelmasa;",
        "qonun hujjatlarida belgilangan boshqa hollarda.",
      ],
    },
    {
      title: "3. Raqamli kontent uchun xususiyatlar",
      paragraphs: [
        "Raqamli kontent va elektron xizmatlar (yuklab olinadigan nashrlar, API kalitlari, elektron kurslar) uchun kontentga kirish taqdim etilgan yoki fayl yuklab olingan paytdan boshlab toʻlov faqat xizmat sifati talablarga javob bermagan hollarda qaytariladi. Bu qoida foydalanuvchining qonun hujjatlarida belgilangan huquqlarini cheklamaydi.",
      ],
    },
    {
      title: "4. Murojaat qilish tartibi",
      bullets: [
        `Murojaatni ${uzOrg.email} manziliga yuborish kerak.`,
        "Murojaatda koʻrsatiladi: toʻlovchining ismi, toʻlov sanasi va summasi, toʻlov usuli, toʻlovni tasdiqlovchi hujjat, qaytarish sababi.",
        "Murojaat qabul qilingan kundan boshlab 10 ish kuni ichida koʻrib chiqiladi.",
        "Toʻlov, qoida tariqasida, toʻlov amalga oshirilgan usul orqali qaytariladi.",
      ],
    },
    {
      title: "5. Qaytarish qoʻllanmaydigan hollar",
      bullets: [
        "xizmat toʻliq va sifatli koʻrsatilgan boʻlsa hamda dalillangan nuqson boʻlmasa;",
        "foydalanuvchi tomonidan foydalanish shartlari buzilgan boʻlsa;",
        "murojaat qonun hujjatlarida belgilangan muddat oʻtgach yuborilgan boʻlsa.",
      ],
    },
    {
      title: "6. Nizolarni hal etish",
      paragraphs: [
        "Nizolar Oʻzbekiston Respublikasi qonunchiligi asosida, avvalo muzokaralar yoʻli bilan hal etiladi.",
      ],
    },
  ],
  footerNote:
    "Pullik xizmatlar joriy etilishidan oldin ushbu hujjat yuridik xizmat tomonidan yakuniy tahrirdan oʻtkazilishi shart.",
};

/* ------------------------------------------------------------------ */
/*  RUSCHA / РУССКИЙ                                                   */
/* ------------------------------------------------------------------ */

const ruPrivacy: LegalDocument = {
  title: "Политика конфиденциальности",
  effectiveDate: `Дата вступления в силу: ${RU_EFFECTIVE}`,
  intro: [
    "Настоящая Политика объясняет, какие персональные данные собираются на сайте, с какой целью и на каком правовом основании они обрабатываются, кому передаются и какие права есть у пользователя.",
    "Политика подготовлена в соответствии с требованиями Закона Республики Узбекистан «О персональных данных» от 2 июля 2019 года № ЗРУ-547 (с последующими изменениями).",
  ],
  sections: [
    {
      title: "1. Оператор персональных данных",
      paragraphs: ["Собственник и оператор персональных данных:"],
      bullets: [
        `Полное наименование: ${ruOrg.legalName}`,
        `Адрес: ${ruOrg.address}`,
        `Телефон: ${ruOrg.phone}`,
        `E-mail по общим вопросам: ${ruOrg.email}`,
        `Обращения по персональным данным: ${ruOrg.privacyEmail}`,
        `ИНН: ${ruOrg.taxId}`,
        `Статус регистрации базы персональных данных в Государственном реестре: ${ruOrg.dataRegistryNumber}`,
      ],
    },
    {
      title: "2. Какие данные мы собираем",
      paragraphs: [
        "Для использования словаря регистрация не требуется, и идентифицирующие данные не запрашиваются. Данные собираются только в следующих случаях:",
      ],
      bullets: [
        "Форма обратной связи: фамилия и имя (в том виде, как вы их указали), адрес электронной почты и текст обращения. Эти данные вы предоставляете добровольно.",
        "Технические данные: IP-адрес и время запроса — для защиты от спама и злоупотреблений (ограничение: не более пяти обращений с одного IP-адреса в час). IP-адрес хранится во временной памяти сервера и автоматически удаляется через час.",
        "Cookie-файлы: выбранный язык и статус согласия на cookie. Статистические cookie используются только при вашем согласии (см. Политику использования cookie).",
        "Для сотрудников: токены аутентификации для доступа в административную панель. К обычным пользователям это не относится.",
      ],
    },
    {
      title: "3. Цели и правовые основания обработки",
      table: {
        headers: ["Данные", "Цель", "Правовое основание"],
        rows: [
          [
            "Имя, e-mail, текст обращения",
            "Рассмотрение обращения и ответ на него",
            "Согласие субъекта (отметка согласия перед отправкой формы)",
          ],
          [
            "IP-адрес (временно)",
            "Защита от спама, автоматизированных атак и злоупотреблений",
            "Законный интерес оператора в обеспечении информационной безопасности",
          ],
          [
            "Cookie языка и согласия",
            "Работа сайта и запоминание вашего выбора",
            "Необходимость для предоставления сервиса",
          ],
          [
            "Статистические cookie",
            "Анализ обобщённой статистики использования сайта",
            "Согласие субъекта (может быть отозвано в любое время)",
          ],
        ],
      },
    },
    {
      title: "4. Сторонние сервисы и передача данных",
      paragraphs: [
        "Мы не продаём, не сдаём в аренду и не раскрываем персональные данные третьим лицам в рекламных целях. Для работы сайта используются следующие сервисы:",
      ],
      bullets: [
        "Google reCAPTCHA — защита формы обратной связи от автоматизированного спама. Сервис загружается только когда вы начинаете заполнять форму.",
        "Google Analytics — обобщённая статистика посещений. Загружается только после получения вашего согласия.",
        "Провайдер хостинга и технического обслуживания серверов — хранение данных.",
        "Уполномоченные государственные органы — исключительно в случаях и порядке, установленных законодательством.",
      ],
    },
    {
      title: "5. Трансграничная передача данных",
      paragraphs: [
        "При использовании сервисов Google отдельные технические данные (IP-адрес, сведения о браузере и устройстве) могут передаваться за пределы Республики Узбекистан, в том числе в Соединённые Штаты Америки.",
        "Трансграничная передача должна осуществляться с соблюдением требований Закона «О персональных данных». Основанием для статистических сервисов является ваше согласие; отказ от него или его отзыв не ограничивает возможность пользоваться сайтом.",
      ],
    },
    {
      title: "6. Сроки хранения",
      bullets: [
        "Обращения через форму обратной связи — в течение срока, установленного правилами делопроизводства, но не более одного года после рассмотрения (конкретный срок определяется внутренним порядком Академии).",
        "IP-адрес — до одного часа (в рамках механизма защиты от спама).",
        "Cookie языка и согласия — до 12 месяцев.",
        "Статистические cookie — в сроки, указанные в Политике использования cookie.",
        "При отзыве согласия или достижении цели обработки данные удаляются либо обезличиваются.",
      ],
    },
    {
      title: "7. Права субъекта персональных данных",
      paragraphs: [
        "В соответствии с Законом «О персональных данных» вы имеете право:",
      ],
      bullets: [
        "знать об обработке своих данных и ознакомиться с ними;",
        "требовать уточнения и исправления недостоверных или неполных данных;",
        "требовать блокирования или уничтожения данных;",
        "в любое время отозвать ранее данное согласие;",
        "обжаловать действия оператора в уполномоченный государственный орган или в суд.",
      ],
    },
    {
      title: "8. Порядок реализации прав",
      paragraphs: [
        "Обращение можно направить по указанным выше адресам электронной или обычной почты. В обращении необходимо указать сведения, позволяющие подтвердить вашу личность, и суть требования. Ответ предоставляется в сроки, установленные законодательством.",
      ],
    },
    {
      title: "9. Безопасность данных",
      paragraphs: [
        "Мы применяем организационные и технические меры защиты: шифрование HTTPS/TLS, ограничение доступа к административной панели, ограничение количества обращений, доступ к служебным данным только уполномоченных сотрудников.",
        "При этом обращаем внимание, что абсолютную безопасность передачи данных через интернет не может гарантировать ни одна организация. Мы принимаем на себя обязательство обеспечивать защиту на разумном и применимом на практике уровне.",
      ],
    },
    {
      title: "10. Данные несовершеннолетних",
      paragraphs: [
        "Сайт является информационно-образовательным ресурсом общего назначения и не собирает целенаправленно персональные данные несовершеннолетних. При обнаружении данных несовершеннолетнего, направленных без согласия законного представителя, такие данные удаляются.",
      ],
    },
    {
      title: "11. Изменения Политики",
      paragraphs: [
        "Политика может обновляться. Новая редакция вступает в силу со дня публикации на сайте; о существенных изменениях сообщается отдельно. Дата вступления в силу указывается в начале документа.",
      ],
    },
  ],
  footerNote:
    "По вопросам, связанным с настоящей Политикой, обращайтесь по указанным выше контактам.",
};

const ruTerms: LegalDocument = {
  title: "Условия использования",
  effectiveDate: `Дата вступления в силу: ${RU_EFFECTIVE}`,
  intro: [
    "Настоящие Условия определяют правила использования сайта. Продолжая пользоваться сайтом, вы соглашаетесь с ними. Если вы не согласны с Условиями, просим не использовать сайт.",
  ],
  sections: [
    {
      title: "1. Общие положения",
      paragraphs: [
        `Сайт ведётся ${ruOrg.legalName} в информационно-образовательных целях.`,
        "В настоящее время сайт работает в тестовом режиме: отдельные материалы могут быть неполными или редактироваться.",
      ],
    },
    {
      title: "2. Статус ресурса и его назначение",
      paragraphs: [
        "Термины, толкования и комментарии на сайте имеют научно-просветительский характер и предоставляются исключительно в справочных и образовательных целях.",
        "Материалы сайта не являются официальным толкованием норм международного права, официальной позицией Министерства иностранных дел Республики Узбекистан или юридической консультацией. При работе с официальными документами, договорами и нормативно-правовыми актами следует опираться на первоисточники.",
      ],
    },
    {
      title: "3. Интеллектуальная собственность",
      paragraphs: [
        "Материалы сайта (словарные статьи, толкования, структура, дизайн, логотип и графические элементы) являются объектами авторского права и принадлежат Академии либо соответствующим правообладателям.",
        "Допускается цитирование в разумном объёме в научных и учебных целях с обязательным указанием источника.",
      ],
      bullets: [
        "Запрещается коммерческое переиздание, продажа или распространение материалов;",
        "Запрещается автоматизированное копирование базы словаря полностью или частями (scraping, массовая выгрузка);",
        "Запрещается изменение или удаление сведений об авторстве и источнике.",
      ],
    },
    {
      title: "4. Обязанности пользователя",
      bullets: [
        "не совершать действий, нарушающих работу сайта (избыточная нагрузка, вредоносный код, обход средств защиты);",
        "не нарушать права других лиц, не направлять оскорбительный или противоправный контент;",
        "не использовать форму обратной связи для рассылки спама или рекламы.",
      ],
    },
    {
      title: "5. Обращения пользователей",
      paragraphs: [
        "Предложения и замечания, направленные через форму обратной связи, могут использоваться Академией для совершенствования словаря. Направляя обращение, вы соглашаетесь на использование текста обращения в этих целях; это не даёт Академии права раскрывать вашу личность.",
      ],
    },
    {
      title: "6. Отказ от гарантий",
      paragraphs: [
        "Материалы предоставляются «как есть» (as is). Академия не гарантирует абсолютную полноту материалов, отсутствие ошибок или бесперебойную работу сайта.",
        "Толкование терминов может меняться со временем; проверка первоисточников при принятии значимых решений остаётся ответственностью пользователя.",
      ],
    },
    {
      title: "7. Ограничение ответственности",
      paragraphs: [
        "В пределах, допускаемых законодательством, Академия не несёт ответственности за прямые или косвенные убытки, возникшие в результате использования материалов сайта.",
        "Настоящее положение не исключает ответственность, которая не может быть ограничена в соответствии с законодательством.",
      ],
    },
    {
      title: "8. Внешние ссылки",
      paragraphs: [
        "На сайте могут размещаться ссылки на сторонние ресурсы. Академия не отвечает за их содержание, политику конфиденциальности или безопасность.",
      ],
    },
    {
      title: "9. Изменение и приостановление работы сервиса",
      paragraphs: [
        "Академия сохраняет право изменять функциональность, состав и порядок работы сайта без предварительного уведомления, а также временно приостанавливать его работу.",
      ],
    },
    {
      title: "10. Применимое право и разрешение споров",
      paragraphs: [
        "К настоящим Условиям применяется законодательство Республики Узбекистан. Споры разрешаются прежде всего путём переговоров; при отсутствии согласия — судами Республики Узбекистан.",
      ],
    },
    {
      title: "11. Изменения Условий",
      paragraphs: [
        "Условия могут обновляться. Новая редакция вступает в силу со дня публикации на сайте. Дата вступления в силу указывается в начале документа.",
      ],
    },
  ],
  footerNote: `По вопросам: ${ruOrg.email}`,
};

const ruCookies: LegalDocument = {
  title: "Политика использования cookie",
  effectiveDate: `Дата вступления в силу: ${RU_EFFECTIVE}`,
  intro: [
    "Cookie-файлы — небольшие текстовые файлы, которые браузер сохраняет на вашем устройстве. Они помогают сайту работать корректно и запоминать ваши настройки.",
    "Сайт устанавливает необязательные cookie только после получения вашего согласия. Вы можете изменить своё решение в любое время.",
  ],
  sections: [
    {
      title: "1. Какие cookie использует сайт",
      table: {
        headers: ["Название", "Тип", "Назначение", "Срок хранения", "Кто устанавливает"],
        rows: [
          ["language", "Необходимые", "Запоминание выбранного языка интерфейса", "12 месяцев", "Сайт"],
          ["cookie_consent", "Необходимые", "Хранение вашего выбора по cookie", "12 месяцев", "Сайт"],
          [
            "_ga, _ga_*",
            "Статистические",
            "Обобщённая статистика посещений (Google Analytics)",
            "до 24 месяцев",
            "Google",
          ],
          [
            "_GRECAPTCHA",
            "Безопасность",
            "Защита формы обратной связи от спама (reCAPTCHA)",
            "до 6 месяцев",
            "Google",
          ],
          [
            "access_token, refresh_token",
            "Необходимые (только сотрудники)",
            "Подтверждение доступа в административную панель",
            "На время сессии",
            "Сайт",
          ],
        ],
      },
    },
    {
      title: "2. Управление согласием",
      bullets: [
        "При первом посещении сайта отображается баннер: «Принять все» или «Только необходимые».",
        "Изменить выбор можно в любое время по ссылке «Настройки cookie» в нижней части страницы.",
        "Cookie также можно удалить или заблокировать в настройках браузера.",
      ],
    },
    {
      title: "3. Что будет, если не давать согласие",
      paragraphs: [
        "Отказ от статистических cookie не ограничивает работу словаря: поиск, термины и все страницы функционируют полностью. Необходимые cookie требуются для работы сайта и поэтому не отключаются.",
      ],
    },
    {
      title: "4. Сторонние сервисы",
      paragraphs: [
        "Google Analytics и Google reCAPTCHA — сервисы Google LLC, имеющие собственные политики:",
      ],
      bullets: [
        "Политика конфиденциальности Google: https://policies.google.com/privacy",
        "Условия использования сервисов Google: https://policies.google.com/terms",
      ],
    },
    {
      title: "5. Изменения",
      paragraphs: [
        "При подключении новых сервисов настоящая Политика обновляется. Дата обновления указывается в начале документа.",
      ],
    },
  ],
};

const ruRefund: LegalDocument = {
  title: "Политика возврата средств",
  effectiveDate: `Дата вступления в силу: ${RU_EFFECTIVE}`,
  intro: [
    "ВАЖНО: в настоящее время все функции сайта — доступ к словарю, поиск, просмотр терминов — бесплатны. Сайт не принимает платежи, не продаёт подписки и не запрашивает данные банковских карт. Поэтому в данный момент основания для возврата средств не возникают.",
    "Настоящий документ заранее устанавливает правила, которые будут применяться в случае введения платных услуг (например, институциональных лицензий, доступа к API или образовательных курсов).",
  ],
  sections: [
    {
      title: "1. Сфера применения",
      paragraphs: [
        "Правила применяются только к платным услугам, официально введённым Академией и публично объявленным на сайте. При введении платной услуги её стоимость, состав и порядок оплаты публикуются отдельно в форме публичной оферты.",
      ],
    },
    {
      title: "2. Основания для возврата",
      bullets: [
        "услуга не была оказана или оказана частично из-за технической неисправности;",
        "платёж совершён повторно или в неверной сумме из-за технической ошибки;",
        "услуга не соответствует объявленному описанию;",
        "иные случаи, установленные законодательством.",
      ],
    },
    {
      title: "3. Особенности для цифрового контента",
      paragraphs: [
        "Для цифрового контента и электронных услуг (загружаемые издания, ключи API, электронные курсы) с момента предоставления доступа или загрузки файла возврат производится только при ненадлежащем качестве услуги. Настоящее правило не ограничивает права пользователя, установленные законодательством.",
      ],
    },
    {
      title: "4. Порядок обращения",
      bullets: [
        `Обращение направляется на адрес ${ruOrg.email}.`,
        "В обращении указываются: имя плательщика, дата и сумма платежа, способ оплаты, подтверждающий документ, причина возврата.",
        "Обращение рассматривается в течение 10 рабочих дней со дня получения.",
        "Возврат, как правило, производится тем же способом, которым был совершён платёж.",
      ],
    },
    {
      title: "5. Случаи, когда возврат не производится",
      bullets: [
        "услуга оказана полностью и качественно, обоснованных претензий нет;",
        "пользователем нарушены условия использования;",
        "обращение направлено по истечении срока, установленного законодательством.",
      ],
    },
    {
      title: "6. Разрешение споров",
      paragraphs: [
        "Споры разрешаются на основании законодательства Республики Узбекистан, прежде всего путём переговоров.",
      ],
    },
  ],
  footerNote:
    "До введения платных услуг настоящий документ должен пройти окончательную юридическую проверку.",
};

export const legalDocs: Record<
  LanguageCode,
  Record<LegalDocKey, LegalDocument>
> = {
  uz: {
    privacy: uzPrivacy,
    terms: uzTerms,
    cookies: uzCookies,
    refund: uzRefund,
  },
  ru: {
    privacy: ruPrivacy,
    terms: ruTerms,
    cookies: ruCookies,
    refund: ruRefund,
  },
};
