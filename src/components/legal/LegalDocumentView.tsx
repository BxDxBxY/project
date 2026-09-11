"use client";

import React from "react";
import { PageContainer } from "@/components/ui/PageContainer";
import type { LegalDocument } from "@/constants/legalDocs";

/** `split` uchun global, `test` uchun alohida (global regex holatini saqlaydi). */
const URL_SPLIT_PATTERN = /(https?:\/\/[^\s,;]+)/g;
const URL_TEST_PATTERN = /^https?:\/\/[^\s,;]+$/;

/** Matndagi havolalarni bosiladigan qiladi, qolgani oddiy matn boʻlib qoladi. */
const renderText = (text: string): React.ReactNode => {
  const parts = text.split(URL_SPLIT_PATTERN);
  return parts.map((part, index) =>
    URL_TEST_PATTERN.test(part) ? (
      <a
        key={index}
        href={part}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[#00527a] underline underline-offset-2 hover:text-[#001c3b]"
      >
        {part}
      </a>
    ) : (
      <React.Fragment key={index}>{part}</React.Fragment>
    ),
  );
};

const paragraphClass =
  "text-sm sm:text-base md:text-lg text-gray-600 text-justify max-w-6xl mx-auto leading-relaxed whitespace-pre-line mt-4 sm:mt-6";

interface LegalDocumentViewProps {
  document: LegalDocument;
}

/**
 * Huquqiy hujjatlar «Lugʻat haqida» sahifasi bilan bir xil uslubda —
 * keng ustun, oddiy matn, ortiqcha grafik elementlarsiz.
 */
export const LegalDocumentView: React.FC<LegalDocumentViewProps> = ({
  document: doc,
}) => {
  return (
    <PageContainer maxWidth="md">
      <div>
        <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-[#001c3b] mb-4 sm:mb-6 leading-tight text-center">
          {doc.title}
        </h1>
        <p className="text-sm sm:text-base text-gray-500 text-center">
          {doc.effectiveDate}
        </p>

        {doc.intro.map((paragraph, index) => (
          <p key={index} className={paragraphClass}>
            {renderText(paragraph)}
          </p>
        ))}

        {doc.sections.map((section, index) => (
          <section key={index}>
            <h2 className="text-base sm:text-lg md:text-xl font-bold text-[#001c3b] max-w-6xl mx-auto mt-8 sm:mt-10 mb-1">
              {section.title}
            </h2>

            {section.paragraphs?.map((paragraph, pIndex) => (
              <p key={pIndex} className={paragraphClass}>
                {renderText(paragraph)}
              </p>
            ))}

            {section.bullets && (
              <ul className="list-disc pl-6 sm:pl-8 max-w-6xl mx-auto mt-4 sm:mt-6 space-y-2">
                {section.bullets.map((bullet, bIndex) => (
                  <li
                    key={bIndex}
                    className="text-sm sm:text-base md:text-lg text-gray-600 text-justify leading-relaxed"
                  >
                    {renderText(bullet)}
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}

        {doc.footerNote && (
          <p className={paragraphClass}>{renderText(doc.footerNote)}</p>
        )}
      </div>
    </PageContainer>
  );
};

export default LegalDocumentView;
