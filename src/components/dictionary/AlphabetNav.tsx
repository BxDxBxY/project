"use client";

import React from "react";
import { UZBEK_ALPHABET } from "@/constants/alphabet";
import { useLanguage } from "@/lib/LanguageContext";
import { translations } from "@/constants/translations";

/**
 * Anchor id for a letter section.
 *
 * The alphabet contains Oʻ, Gʻ and the digraphs Sh/Ch/Ng, so the letter
 * itself is not usable as a fragment. Index into the official table instead:
 * stable, ASCII, and it survives the pending alphabet reform (only
 * constants/alphabet.ts would change).
 */
export const letterAnchorId = (letter: string): string => {
  const index = UZBEK_ALPHABET.indexOf(letter);
  return index >= 0 ? `harf-${index}` : `harf-x-${letter.charCodeAt(0)}`;
};

interface AlphabetNavProps {
  /** Letters that actually have terms behind them. */
  available: string[];
  className?: string;
}

/**
 * Jump bar across the official Uzbek alphabet.
 *
 * Letters with no terms stay visible but inert — a gap in the row would make
 * the dictionary look broken rather than complete. On a phone the row scrolls
 * sideways instead of wrapping into four cramped lines.
 */
export const AlphabetNav: React.FC<AlphabetNavProps> = ({
  available,
  className = "",
}) => {
  const { language } = useLanguage();
  const t = translations[language].dictionary;

  const availableSet = React.useMemo(() => new Set(available), [available]);

  if (available.length === 0) return null;

  return (
    <nav
      aria-label={t.alphabetNavLabel}
      /*
        Sticks directly under the header. Those offsets are the header's own
        height — py-4 (32px) plus the logo, which is 60/64/80px across the
        breakpoints — so the bar never slides under it or leaves a gap.
        z-30 keeps it below the header's z-50.
      */
      className={`w-full sticky top-[92px] sm:top-[96px] md:top-[112px] z-30 ${className}`}
    >
      <div className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl shadow-sm px-2 py-2">
        <ul className="flex items-center gap-1 overflow-x-auto scrollbar-thin">
          {UZBEK_ALPHABET.map((letter) => {
            const enabled = availableSet.has(letter);

            if (!enabled) {
              return (
                <li key={letter}>
                  <span
                    aria-hidden="true"
                    title={t.noTermsForLetter}
                    className="inline-flex items-center justify-center min-w-[2rem] h-8 px-1.5 rounded-lg text-sm font-semibold text-gray-300 select-none"
                  >
                    {letter}
                  </span>
                </li>
              );
            }

            return (
              <li key={letter}>
                <a
                  href={`#${letterAnchorId(letter)}`}
                  aria-label={`${letter} — ${t.jumpToLetter}`}
                  className="inline-flex items-center justify-center min-w-[2rem] h-8 px-1.5 rounded-lg text-sm font-bold text-[#001c3b] hover:bg-[#001c3b] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#001c3b] transition-colors"
                >
                  {letter}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};
