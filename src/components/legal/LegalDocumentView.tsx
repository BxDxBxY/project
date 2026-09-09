"use client";

import React from "react";
import { PageContainer } from "@/components/ui/PageContainer";
import type { LegalDocument } from "@/constants/legalDocs";
import { TODO_MARK } from "@/constants/organization";

/** `split` uchun global, `test` uchun alohida (global regex holatini saqlaydi). */
const URL_SPLIT_PATTERN = /(https?:\/\/[^\s,;]+)/g;
const URL_TEST_PATTERN = /^https?:\/\/[^\s,;]+$/;

/**
 * Matnni oʻqiladigan boʻlaklarga ajratadi: havolalar bosiladigan boʻladi,
 * toʻldirilmagan rekvizitlar esa koʻzga tashlanadigan qilib belgilanadi.
 */
const renderText = (text: string): React.ReactNode => {
  if (text.includes(TODO_MARK)) {
    return (
      <mark className="bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded font-medium">
        {text}
      </mark>
    );
  }

  const parts = text.split(URL_SPLIT_PATTERN);
  return parts.map((part, index) =>
    URL_TEST_PATTERN.test(part) ? (
      <a
        key={index}
        href={part}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[#00527a] underline underline-offset-2 hover:text-[#001c3b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#001c3b]"
      >
        {part}
      </a>
    ) : (
      <React.Fragment key={index}>{part}</React.Fragment>
    ),
  );
};

interface LegalDocumentViewProps {
  document: LegalDocument;
}

export const LegalDocumentView: React.FC<LegalDocumentViewProps> = ({
  document: doc,
}) => {
  return (
    <PageContainer maxWidth="sm">
      <article className="bg-white p-6 sm:p-10 md:p-14 rounded-2xl shadow-lg border border-gray-200">
        <header className="mb-10 text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#001c3b] mb-3 tracking-tight">
            {doc.title}
          </h1>
          <p className="text-sm font-medium text-gray-600">
            {doc.effectiveDate}
          </p>
          <div
            className="w-24 h-1 bg-[#c9a96e] mx-auto mt-6 rounded-full"
            aria-hidden="true"
          />
        </header>

        <div className="space-y-6 text-gray-800 leading-relaxed text-sm sm:text-base">
          {doc.intro.map((paragraph, index) => (
            <p
              key={index}
              className="border-l-4 border-[#0099B5] bg-gray-50 pl-5 py-3 rounded-r-lg"
            >
              {renderText(paragraph)}
            </p>
          ))}
        </div>

        <div className="mt-10 space-y-10">
          {doc.sections.map((section, index) => (
            <section key={index} aria-labelledby={`legal-section-${index}`}>
              <h2
                id={`legal-section-${index}`}
                className="text-lg sm:text-xl font-bold text-[#001c3b] mb-3"
              >
                {section.title}
              </h2>
              <div className="h-px w-full bg-gray-200 mb-4" aria-hidden="true" />

              {section.paragraphs?.map((paragraph, pIndex) => (
                <p
                  key={pIndex}
                  className="text-sm sm:text-base text-gray-800 leading-relaxed mb-3"
                >
                  {renderText(paragraph)}
                </p>
              ))}

              {section.bullets && (
                <ul className="list-disc pl-6 space-y-2 text-sm sm:text-base text-gray-800">
                  {section.bullets.map((bullet, bIndex) => (
                    <li key={bIndex} className="leading-relaxed">
                      {renderText(bullet)}
                    </li>
                  ))}
                </ul>
              )}

              {section.table && (
                <div className="overflow-x-auto mt-4 rounded-lg border border-gray-200">
                  <table className="w-full text-left text-xs sm:text-sm border-collapse">
                    <thead className="bg-gray-100">
                      <tr>
                        {section.table.headers.map((header, hIndex) => (
                          <th
                            key={hIndex}
                            scope="col"
                            className="px-3 py-2 font-semibold text-[#001c3b] border-b border-gray-200"
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {section.table.rows.map((row, rIndex) => (
                        <tr key={rIndex} className="even:bg-gray-50">
                          {row.map((cell, cIndex) => (
                            <td
                              key={cIndex}
                              className="px-3 py-2 align-top border-b border-gray-100 text-gray-800"
                            >
                              {renderText(cell)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          ))}
        </div>

        {doc.footerNote && (
          <footer className="mt-12 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-700">{renderText(doc.footerNote)}</p>
          </footer>
        )}
      </article>
    </PageContainer>
  );
};

export default LegalDocumentView;
