"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { fetchTerm } from "@/lib/termsApi";
import { TermDetail } from "@/types";
import { logger } from "@/lib/utils";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import TiptapViewer from "@/components/dictionary/TipTapViewer";
// Plain CSS for the editor and toolbar
const editorStyles = `
  .editor-container {
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 16px;
    background: #fff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    min-height: 200px;
  }
  .editor-content {
    outline: none;
    min-height: 150px;
    font-size: 16px;
    line-height: 1.5;
  }
  .editor-content h1 { font-size: 2em; margin: 0.5em 0; font-weight: bold; }
  .editor-content h2 { font-size: 1.5em; margin: 0.5em 0; font-weight: bold; }
  .editor-content h3 { font-size: 1.25em; margin: 0.5em 0; font-weight: bold; }
  .editor-content h4 { font-size: 1.1em; margin: 0.5em 0; font-weight: bold; }
  .editor-content h5 { font-size: 1em; margin: 0.5em 0; font-weight: bold; }
  .editor-content h6 { font-size: 0.9em; margin: 0.5em 0; font-weight: bold; }
  .editor-content p { margin: 0.5em 0; }
  .editor-content ul { list-style: disc; margin: 0.5em 0; padding-left: 2em; }
  .editor-content ol { list-style: decimal; margin: 0.5em 0; padding-left: 2em; }
  .editor-content li { margin: 0.25em 0; }
  .editor-content blockquote {
    border-left: 4px solid #d1d5db;
    padding-left: 1em;
    margin: 0.5em 0;
    color: #4b5563;
  }
  .editor-content code {
    background: #f3f4f6;
    padding: 2px 4px;
    border-radius: 4px;
    font-family: monospace;
  }
  .editor-content pre {
    background: #1f2937;
    color: #fff;
    padding: 1em;
    border-radius: 4px;
    font-family: monospace;
    overflow-x: auto;
  }
  .editor-content pre code { background: none; padding: 0; }
  .editor-content img { max-width: 100%; margin: 0.5em 0; }
  .editor-content a { color: #2563eb; text-decoration: underline; }
  .editor-content .task-list-item { display: flex; align-items: center; }
  .editor-content .task-list-item input[type="checkbox"] { margin-right: 0.5em; }
  .toolbar {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 12px;
  }
  .toolbar select, .toolbar button, .toolbar input {
    padding: 6px 12px;
    border: 1px solid #d1d5db;
    border-radius: 4px;
    background: #fff;
    cursor: pointer;
    font-size: 14px;
  }
  .toolbar button.active {
    background: #2563eb;
    color: #fff;
    border-color: #2563eb;
  }
  .toolbar button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  .toolbar input[type="color"] {
    width: 32px;
    height: 32px;
    padding: 0;
    border: none;
  }
  .dialog {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #fff;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    padding: 16px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    max-width: 400px;
    width: 100%;
  }
  .dialog h2 { font-size: 1.25em; margin-bottom: 12px; }
  .dialog input { width: 100%; padding: 8px; margin-bottom: 12px; border: 1px solid #d1d5db; border-radius: 4px; }
  .dialog-actions { display: flex; justify-content: flex-end; gap: 8px; }
`;

interface TermDetailPageProps {
  params: Promise<{ word: string }>;
}

const TermDetailPage: React.FC<TermDetailPageProps> = ({
  params,
}: TermDetailPageProps) => {
  const [term, setTerm] = useState<TermDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { word: termId } = React.use(params);

  useEffect(() => {
    const fetchTermData = async () => {
      setLoading(true);
      try {
        const termIdNum = parseInt(termId as string, 10);
        if (isNaN(termIdNum)) {
          throw new Error("Invalid term ID");
        }
        const [termData] = await Promise.all([fetchTerm(termIdNum)]);
        setTerm(termData);
        setError(null);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load term";
        logger.error("Error loading term:", err);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    fetchTermData();
  }, [termId]);

  if (loading) {
    return (
      <div className="pt-[128px] p-8 flex flex-col items-center justify-center">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-gray-500">Termin yuklanmoqda...</p>
      </div>
    );
  }

  console.log(term?.definition);
  if (error || !term) {
    return (
      <div className="mx-auto pt-[128px] p-8 flex flex-col items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
          <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
            <svg
              className="w-6 h-6 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Termin topilmadi
          </h1>
          <p className="text-gray-500 mb-4">
            {error ||
              "The term you are looking for does not exist in the dictionary."}
          </p>
          <Link
            href="/dictionary"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Lugʻatga qaytish
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{editorStyles}</style>
      <div className="pt-28 sm:pt-32 md:pt-36 pb-8 sm:pb-12 md:pb-16 px-4 sm:px-6 lg:px-8 transition-all duration-300">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col items-center mb-8 sm:mb-10 md:mb-12 text-center">
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 max-w-3xl break-words tracking-tight">
              {term.title}
            </h1>
            <Link
              href="/dictionary"
              className="inline-flex items-center px-4 py-2 text-sm sm:text-base font-medium text-blue-600 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-lg"
            >
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Lugʻatga qaytish
            </Link>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8">
            <div className="mb-6 sm:mb-8">
              <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">
                Manosi
              </h2>
              <div className="viewer-content" contentEditable={false}>
                <TiptapViewer
                  content={term.definition}
                  className="!border-none !shadow-none !drop-shadow-none"
                />
              </div>
            </div>
            {term.categories.length > 0 && (
              <div className="mb-6 sm:mb-8">
                <h2 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 mb-2 sm:mb-3">
                  Kategoriyalar
                </h2>
                <ul className="flex flex-col gap-1 sm:gap-2">
                  {term.categories.map((category, i) => (
                    <li key={i} className="text-sm sm:text-base text-gray-700">
                      {category.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {term.related_terms.length > 0 && (
              <div className="mb-6 sm:mb-8">
                <h2 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 mb-2 sm:mb-3">
                  Boshqa Terminlar
                </h2>
                <ul className="flex flex-wrap gap-2 sm:gap-3">
                  {term.related_terms.map((term, index) => (
                    <li
                      key={index}
                      className="text-sm sm:text-base text-gray-700"
                    >
                      <Link
                        href={`/dictionary/${term?.id}`}
                        className="border-b-2 border-transparent hover:border-blue-600 transition-all duration-200 hover:text-blue-600"
                      >
                        {term.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {term.sources.length > 0 && (
              <div className="mb-6 sm:mb-8">
                <h2 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 mb-2 sm:mb-3">
                  Malumot Mambalari
                </h2>
                <ul className="flex flex-col gap-1 sm:gap-2">
                  {term.sources.map((source, index) => (
                    <li
                      key={index}
                      className="text-sm sm:text-base text-gray-700"
                    >
                      <a
                        href={source.url}
                        className="text-blue-600 hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {source.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default TermDetailPage;

// <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-200">
//   <div>
//     <h3 className="text-lg font-medium text-gray-900 mb-2">
//       Termin haqida {"ma’lumot"}
//     </h3>
//     <dl className="space-y-2">
//       <div>
//         <dt className="text-sm font-medium text-gray-500">Term ID</dt>
//         <dd className="text-sm text-gray-900">{term.id}</dd>
//       </div>
//       <div>
//         <dt className="text-sm font-medium text-gray-500">
//           Category
//         </dt>
//         <dd className="text-sm text-gray-900">
//           {term.category
//             ? `Category ${term.category}`
//             : "No Category"}
//         </dd>
//       </div>
//       <div>
//         <dt className="text-sm font-medium text-gray-500">Created</dt>
//         <dd className="text-sm text-gray-900">
//           {formatDate(term.created_at)}
//         </dd>
//       </div>
//       <div>
//         <dd className="text-sm text-gray-900">
//           <RelatedTerm term={term} terms={terms} />
//         </dd>
//       </div>
//     </dl>
//   </div>

//   {/* Related Data */}
//   <div>
//     <h3 className="text-lg font-medium text-gray-900 mb-2">
//       Related Data
//     </h3>
//     <dl className="space-y-2">
//       <div>
//         <dt className="text-sm font-medium text-gray-500">
//           Related Countries
//         </dt>
//         <dd className="text-sm text-gray-900">
//           {term.related_countries.length > 0
//             ? term.related_countries.join(", ")
//             : "None"}
//         </dd>
//       </div>
//       <div>
//         <dt className="text-sm font-medium text-gray-500">Sources</dt>
//         <dd className="text-sm text-gray-900">
//           {term.sources.length > 0 ? term.sources.join(", ") : "None"}
//         </dd>
//       </div>
//     </dl>
//   </div>
// </div>
