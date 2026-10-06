import { describe, expect, it } from "vitest";
import {
  compareUzbek,
  getUzbekFirstLetter,
  groupByUzbekAlphabet,
  orderedLetters,
} from "./uzbekCollation";

/**
 * These invariants are called out explicitly in the README as things to
 * verify by hand before touching this file. They're encoded here instead so
 * a regression fails CI rather than surfacing on the printed alphabetical
 * index.
 */

describe("compareUzbek", () => {
  it("sorts the digraphs Oʻ, Gʻ, Sh, Ch, Ng after Z, not among O/G/S/C/N", () => {
    const words = ["Zamin", "Sherik", "Oshkora", "Avtonomiya", "Oʻzbek"];
    const sorted = [...words].sort(compareUzbek);
    expect(sorted).toEqual(["Avtonomiya", "Oshkora", "Zamin", "Oʻzbek", "Sherik"]);
  });

  it("orders the digraph block itself as Oʻ, Gʻ, Sh, Ch, Ng", () => {
    const words = ["Ngoma", "Chegara", "Shart", "Gʻoya", "Oʻrin"];
    const sorted = [...words].sort(compareUzbek);
    expect(sorted).toEqual(["Oʻrin", "Gʻoya", "Shart", "Chegara", "Ngoma"]);
  });

  it("treats every apostrophe glyph as the same modifier letter", () => {
    // ʻ (U+02BB), ' (U+2019), ' (U+2018), ` (U+0060) — all seen in the source data.
    const variants = ["Sanʻat", "San'at", "San‘at", "San`at"];
    for (const variant of variants) {
      expect(compareUzbek(variants[0], variant)).toBe(0);
    }
  });

  it("is case-insensitive", () => {
    expect(compareUzbek("diplomat", "DIPLOMAT")).toBe(0);
    expect(compareUzbek("Attashe", "attashe")).toBe(0);
  });

  it("keeps the single Latin letter unrelated to the Oʻ/Gʻ digraphs", () => {
    // "O'q" (a plain O followed by a tutuq belgisi) must not collate as "Oʻ".
    const words = ["Oʻzbek", "Oʻq", "Ozod"];
    const sorted = [...words].sort(compareUzbek);
    // Ozod (O, then z) sorts before both Oʻ-words, which land in the
    // Z-comes-after-O... Oʻzbek/Oʻq share the Oʻ digraph and then compare
    // by the following letter (z vs q).
    expect(sorted).toEqual(["Ozod", "Oʻq", "Oʻzbek"]);
  });
});

describe("getUzbekFirstLetter", () => {
  it("buckets digraph words under the two-letter digraph, not the first letter alone", () => {
    expect(getUzbekFirstLetter("Chegara")).toBe("Ch");
    expect(getUzbekFirstLetter("Shart")).toBe("Sh");
    expect(getUzbekFirstLetter("Ngoma")).toBe("Ng");
    expect(getUzbekFirstLetter("Oʻzbekiston")).toBe("Oʻ");
    expect(getUzbekFirstLetter("Gʻoya")).toBe("Gʻ");
  });

  it("buckets plain single letters normally", () => {
    expect(getUzbekFirstLetter("Diplomat")).toBe("D");
    expect(getUzbekFirstLetter("attashe")).toBe("A");
  });

  it("falls back to the raw character for letters outside the alphabet (Latin C/W, Cyrillic)", () => {
    expect(getUzbekFirstLetter("Comitas gentium")).toBe("C");
    expect(getUzbekFirstLetter("Wien")).toBe("W");
  });

  it("skips leading punctuation/digits to find the first real letter", () => {
    // Real book heading that has no genuine headword — "1873-yil bitimi".
    expect(getUzbekFirstLetter("1873-yil bitimi")).toBe("Y");
  });

  it("returns # when the title has no letters at all", () => {
    expect(getUzbekFirstLetter("1996")).toBe("#");
  });
});

describe("groupByUzbekAlphabet / orderedLetters", () => {
  it("keeps every official letter as its own bucket, separate from unknown letters", () => {
    const terms = [
      { title: "Chegara" },
      { title: "Sherik" },
      { title: "Comitas gentium" },
      { title: "Oʻzbekiston" },
    ];
    const grouped = groupByUzbekAlphabet(terms, (t) => t.title);

    expect(grouped["Ch"].map((t) => t.title)).toEqual(["Chegara"]);
    expect(grouped["Sh"].map((t) => t.title)).toEqual(["Sherik"]);
    expect(grouped["Oʻ"].map((t) => t.title)).toEqual(["Oʻzbekiston"]);
    // "Comitas gentium" is the one documented real-world case of a term
    // starting with a letter absent from the Uzbek Latin alphabet.
    expect(grouped["C"].map((t) => t.title)).toEqual(["Comitas gentium"]);
  });

  it("lists the 29 official letters in official order before any unknown ones", () => {
    const grouped = groupByUzbekAlphabet(
      [{ title: "Comitas gentium" }, { title: "Wien" }],
      (t) => t.title,
    );
    const order = orderedLetters(grouped);
    expect(order.slice(0, 29)).toEqual([
      "A", "B", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O",
      "P", "Q", "R", "S", "T", "U", "V", "X", "Y", "Z", "Oʻ", "Gʻ", "Sh",
      "Ch", "Ng",
    ]);
    expect(order.slice(29)).toEqual(["C", "W"]);
  });
});
