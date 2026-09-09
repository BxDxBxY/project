import type { LanguageCode } from "./translations";

/**
 * Rasmiy tashkilot rekvizitlari.
 *
 * DIQQAT: `TODO_` bilan boshlanadigan qiymatlar huquqiy boʻlim tomonidan
 * tasdiqlanishi shart. Ular saytda koʻrinadigan qilib qoldirilgan, chunki
 * notoʻgʻri rekvizit koʻrsatishdan koʻra, toʻldirilmagani koʻrinib turgani
 * xavfsizroq.
 *
 * ВНИМАНИЕ: значения, начинающиеся с `TODO_`, должны быть подтверждены
 * юридической службой. Они намеренно видимы на сайте — отсутствующий
 * реквизит безопаснее недостоверного.
 */
export const TODO_MARK = "TODO";

export interface OrganizationDetails {
  /** Toʻliq rasmiy nomi / Полное официальное наименование */
  legalName: string;
  /** Qisqa nomi / Краткое наименование */
  shortName: string;
  /** Tashkiliy tobelik / Ведомственная принадлежность */
  affiliation: string;
  address: string;
  phone: string;
  email: string;
  /** Shaxsga oid maʼlumotlar boʻyicha murojaat manzili */
  privacyEmail: string;
  /** STIR / ИНН */
  taxId: string;
  /** Shaxsga oid maʼlumotlar bazasining Davlat reyestridagi raqami */
  dataRegistryNumber: string;
  website: string;
}

export const ORGANIZATION: Record<LanguageCode, OrganizationDetails> = {
  uz: {
    legalName:
      "Oʻzbekiston Respublikasi Tashqi ishlar vazirligi Jahon iqtisodiyoti va diplomatiya universiteti huzuridagi Diplomatik akademiya",
    shortName: "Diplomatik akademiya",
    affiliation:
      "Oʻzbekiston Respublikasi Tashqi ishlar vazirligi tizimidagi taʼlim muassasasi",
    address:
      "100007, Oʻzbekiston Respublikasi, Toshkent shahri, Mustaqillik shoh koʻchasi, 54",
    phone: "+998 71 267-07-06 (232)",
    email: "info@da-uwed.uz",
    privacyEmail: `${TODO_MARK}: shaxsga oid maʼlumotlar boʻyicha murojaatlar uchun rasmiy e-pochta manzilini koʻrsating`,
    taxId: `${TODO_MARK}: STIR (INN) raqamini koʻrsating`,
    dataRegistryNumber: `${TODO_MARK}: shaxsga oid maʼlumotlar bazasining Davlat reyestridagi roʻyxatdan oʻtish raqami yoki "roʻyxatdan oʻtkazilmoqda" deb koʻrsating`,
    website: `${TODO_MARK}: saytning rasmiy domenini koʻrsating`,
  },
  ru: {
    legalName:
      "Дипломатическая академия при Университете мировой экономики и дипломатии Министерства иностранных дел Республики Узбекистан",
    shortName: "Дипломатическая академия",
    affiliation:
      "Образовательное учреждение в системе Министерства иностранных дел Республики Узбекистан",
    address:
      "100007, Республика Узбекистан, город Ташкент, проспект Мустакиллик, 54",
    phone: "+998 71 267-07-06 (232)",
    email: "info@da-uwed.uz",
    privacyEmail: `${TODO_MARK}: укажите официальный e-mail для обращений по персональным данным`,
    taxId: `${TODO_MARK}: укажите ИНН (СТИР)`,
    dataRegistryNumber: `${TODO_MARK}: укажите номер регистрации базы персональных данных в Государственном реестре либо статус «на регистрации»`,
    website: `${TODO_MARK}: укажите официальный домен сайта`,
  },
};

/** Rekvizit toʻldirilmagan yoki yoʻqligini tekshiradi. */
export const isPlaceholder = (value: string): boolean =>
  value.startsWith(TODO_MARK);
