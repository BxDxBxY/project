"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { fetchTerm } from "@/lib/termsApi";
import { TermDetail } from "@/types";
import { logger } from "@/lib/utils";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

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
          <div
            className="prose prose-sm sm:prose-base max-w-none !text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: term.definition }}
          />
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
                <li key={index} className="text-sm sm:text-base text-gray-700">
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
