import { UZBEK_ALPHABET, TUTUQ_BELGISI } from "@/constants/alphabet";

/**
 * Oʻzbek lotin alifbosi boʻyicha saralash.
 *
 * Nima uchun kerak: `String.prototype.localeCompare(..., "uz")` brauzer va
 * Node.js da amalda standart (lotin/ingliz) tartibiga tushib qoladi. Natijada
 * "Ch", "Sh", "Ng" bilan boshlanadigan soʻzlar C, S, N harflari orasiga
 * tushadi, "Oʻ" va "Gʻ" esa apostrof eʼtiborga olinmagani uchun O va G bilan
 * aralashib ketadi. Rasmiy alifbo tartibida esa bu harflar Z dan keyin keladi.
 *
 * Ushbu modul alifboni maʼlumot sifatida ishlatadi: alifbo oʻzgarsa
 * (masalan, islohot qabul qilinsa), faqat `constants/alphabet.ts` yangilanadi.
 */

/** Amalda uchraydigan barcha apostrof koʻrinishlari bitta belgiga keltiriladi. */
const APOSTROPHE_VARIANTS = /['’‘`´ʻʼʹ′]/g;
const APOSTROPHE = "ʼ";

/** Saralashda eʼtiborga olinmaydigan belgilar (boʻshliq, defis, qavs va h.k.). */
const IGNORED_CHARACTERS = /[\s\-–—.,;:!?()[\]{}«»"“”/\\]/;

const lowerAlphabet = UZBEK_ALPHABET.map((letter) =>
  letter.toLowerCase().replace(APOSTROPHE_VARIANTS, APOSTROPHE),
);

const LETTER_WEIGHT = new Map<string, number>(
  lowerAlphabet.map((letter, index) => [letter, index]),
);

const DIGRAPHS = lowerAlphabet.filter((letter) => letter.length === 2);

/** Tutuq belgisi alifboda oxirgi oʻrinda turadi. */
const TUTUQ_WEIGHT = UZBEK_ALPHABET.length;

/** Alifboga kirmaydigan belgilar (raqamlar, kirill, C, W va h.k.) oxiriga. */
const UNKNOWN_BASE = TUTUQ_WEIGHT + 1;

const normalize = (value: string): string =>
  value.replace(APOSTROPHE_VARIANTS, APOSTROPHE).toLowerCase().trim();

/**
 * Satrni alifbo "ogʻirliklari" ketma-ketligiga aylantiradi.
 * Diagraflar (Oʻ, Gʻ, Sh, Ch, Ng) bitta harf sifatida qaraladi.
 */
const toWeights = (value: string): number[] => {
  const source = normalize(value);
  const weights: number[] = [];
  let index = 0;

  while (index < source.length) {
    const pair = source.slice(index, index + 2);
    const digraph = DIGRAPHS.find((letter) => letter === pair);
    if (digraph) {
      weights.push(LETTER_WEIGHT.get(digraph)!);
      index += 2;
      continue;
    }

    const char = source[index];

    if (char === APOSTROPHE) {
      // Oʻ/Gʻ tarkibida boʻlmagan apostrof — tutuq belgisi (maʼno, sanʼat).
      weights.push(TUTUQ_WEIGHT);
      index += 1;
      continue;
    }

    if (IGNORED_CHARACTERS.test(char)) {
      index += 1;
      continue;
    }

    const weight = LETTER_WEIGHT.get(char);
    weights.push(
      weight !== undefined ? weight : UNKNOWN_BASE + (char.codePointAt(0) ?? 0),
    );
    index += 1;
  }

  return weights;
};

/**
 * Ikki terminni oʻzbek alifbosi tartibida solishtiradi.
 * `Array.prototype.sort` uchun moʻljallangan.
 */
export const compareUzbek = (a: string, b: string): number => {
  const weightsA = toWeights(a);
  const weightsB = toWeights(b);
  const length = Math.min(weightsA.length, weightsB.length);

  for (let i = 0; i < length; i += 1) {
    if (weightsA[i] !== weightsB[i]) {
      return weightsA[i] - weightsB[i];
    }
  }

  if (weightsA.length !== weightsB.length) {
    return weightsA.length - weightsB.length;
  }

  // Harflar ketma-ketligi bir xil (masalan, apostrofning turli koʻrinishlari
  // yoki boʻshliq farqi) — terminlar teng deb hisoblanadi. `Array.sort`
  // barqaror boʻlgani uchun ularning oʻzaro tartibi oʻzgarmaydi.
  return 0;
};

/**
 * Termin qaysi alifbo harfi guruhiga tegishli ekanini aniqlaydi.
 * Alifboga kirmaydigan belgilar uchun harfning oʻzi (kirill, C, W) yoki "#".
 */
export const getUzbekFirstLetter = (title: string): string => {
  const source = normalize(title).replace(/^[^\p{L}]+/u, "");
  if (!source) return "#";

  const pair = source.slice(0, 2);
  const digraphIndex = lowerAlphabet.indexOf(pair);
  if (digraphIndex !== -1 && pair.length === 2) {
    return UZBEK_ALPHABET[digraphIndex];
  }

  const first = source[0];
  const singleIndex = lowerAlphabet.indexOf(first);
  if (singleIndex !== -1) {
    return UZBEK_ALPHABET[singleIndex];
  }

  return first.toUpperCase();
};

/** Terminlarni alifbo boʻyicha guruhlaydi va har bir guruhni saralaydi. */
export const groupByUzbekAlphabet = <T>(
  items: T[],
  getTitle: (item: T) => string,
): Record<string, T[]> => {
  const grouped: Record<string, T[]> = {};

  UZBEK_ALPHABET.forEach((letter) => {
    grouped[letter] = [];
  });

  items.forEach((item) => {
    const letter = getUzbekFirstLetter(getTitle(item));
    if (!grouped[letter]) grouped[letter] = [];
    grouped[letter].push(item);
  });

  Object.keys(grouped).forEach((letter) => {
    grouped[letter].sort((a, b) => compareUzbek(getTitle(a), getTitle(b)));
  });

  return grouped;
};

/** Guruh sarlavhalarining alifbo tartibi (notanish harflar oxirida). */
export const orderedLetters = (grouped: Record<string, unknown>): string[] => [
  ...UZBEK_ALPHABET,
  ...Object.keys(grouped)
    .filter((letter) => !UZBEK_ALPHABET.includes(letter))
    .sort(compareUzbek),
];

export { UZBEK_ALPHABET, TUTUQ_BELGISI };
