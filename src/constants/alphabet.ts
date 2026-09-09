/**
 * Amaldagi oʻzbek lotin alifbosi — 29 ta harf va tutuq belgisi.
 *
 * Tartib rasmiy alifbo jadvaliga muvofiq: diagraflar (Oʻ, Gʻ, Sh, Ch, ng)
 * Z harfidan keyin keladi, tutuq belgisi esa eng oxirida turadi.
 *
 * ESLATMA: 2026-yil 7-iyulda Qonunchilik palatasi alifboni yangilash
 * (harflar birikmasi oʻrniga Ş, Ç kabi harflar) toʻgʻrisidagi qonun loyihasini
 * qabul qilib, Senatga yubordi. Qonun kuchga kirganda faqat shu roʻyxat va
 * `lib/uzbekCollation.ts` moduli yangilanadi — saralash mantigʻi oʻzgarmaydi.
 */
export const UZBEK_ALPHABET = [
  "A",
  "B",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "X",
  "Y",
  "Z",
  "Oʻ",
  "Gʻ",
  "Sh",
  "Ch",
  "Ng",
];

/** Tutuq belgisi (maʼno, sanʼat) — alifbo jadvalida oxirgi belgi. */
export const TUTUQ_BELGISI = "ʼ";
