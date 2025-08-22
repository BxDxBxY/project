"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { fetchTerm, fetchTerms } from "@/lib/termsApi";
import { fetchCategories } from "@/lib/categoriesApi";
import { fetchCountries } from "@/lib/countriesApi";
import { fetchSources } from "@/lib/sourcesApi";
import { TermDetail, TermSummary, Category, Country, Source } from "@/types";
import { logger } from "@/lib/utils";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

interface TermDetailPageProps {
  params: { word: string };
}

const TermDetailPage: React.FC<TermDetailPageProps> = ({ params }) => {
  const [term, setTerm] = useState<TermDetail | null>(null);
  const [allTerms, setAllTerms] = useState<TermSummary[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [sources, setSources] = useState<Source[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { word: termId } = useParams();

  useEffect(() => {
    const fetchTermData = async () => {
      setLoading(true);
      try {
        const termIdNum = parseInt(termId as string, 10);
        if (isNaN(termIdNum)) {
          throw new Error("Invalid term ID");
        }
        const [
          termData,
          termsData,
          categoriesData,
          countriesData,
          sourcesData,
        ] = await Promise.all([
          fetchTerm(termIdNum),
          fetchTerms(),
          fetchCategories(),
          fetchCountries(),
          fetchSources(),
        ]);
        setTerm(termData);
        setAllTerms(termsData);
        setCategories(categoriesData);
        setCountries(countriesData);
        setSources(sourcesData);
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

  const getRelatedTermTitles = (ids: number[]) =>
    allTerms.filter((t) => ids.includes(t.id)).map((t) => t.title);
  const getCategoryNames = (ids: number[]) =>
    categories.filter((c) => ids.includes(c.id)).map((c) => c.name);
  const getCountryNames = (ids: number[]) =>
    countries.filter((c) => ids.includes(c.id)).map((c) => c.name);
  const getSourceNames = (ids: number[]) =>
    sources.filter((s) => ids.includes(s.id)).map((s) => s.title);

  return (
    <div className="pt-[128px] pb-8 px-4 sm:px-8">
      <div className="max-w-[1340px] mx-auto">
        <div className="flex flex-col items-center mb-8 text-center">
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-4 max-w-[800px] break-words">
            {term.title}
          </h1>
          <Link
            href="/dictionary"
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg
              className="w-4 h-4 mr-2"
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

        <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
          <div className="mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">
              Manosi
            </h2>
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: term.definition }}
            />
          </div>
          {term.categories.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">
                Kategoriyalar
              </h2>
              <ul className="list-disc pl-5">
                {getCategoryNames(term.categories).map((name, index) => (
                  <li key={index} className="text-base text-gray-700">
                    {name}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {term.related_terms.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">
                Related Terms
              </h2>
              <ul className="list-disc pl-5">
                {getRelatedTermTitles(term.related_terms).map(
                  (title, index) => (
                    <li key={index} className="text-base text-gray-700">
                      {title}
                    </li>
                  )
                )}
              </ul>
            </div>
          )}
          {term.related_countries.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">
                Related Countries
              </h2>
              <ul className="list-disc pl-5">
                {getCountryNames(term.related_countries).map((name, index) => (
                  <li key={index} className="text-base text-gray-700">
                    {name}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {term.sources.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">
                Sources
              </h2>
              <ul className="list-disc pl-5">
                {getSourceNames(term.sources).map((name, index) => (
                  <li key={index} className="text-base text-gray-700">
                    {name}
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
