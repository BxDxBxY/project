"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Term } from "@/types";
import { fetchTerm, fetchTerms } from "@/lib/api";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { LanguageSelector } from "@/components/dictionary/LanguageSelector";
import {
  getTermTranslation,
  getTermDescription,
  formatDate,
  formatDateTime,
} from "@/lib/utils";
import { logger } from "@/lib/utils";
import RelatedTerm from "@/components/dictionary/RelatedTerm";

interface TermDetailPageProps {
  params: Promise<{ word: string }>;
}

const TermDetailPage: React.FC<TermDetailPageProps> = ({ params }) => {
  const [term, setTerm] = useState<Term | null>(null);
  const [terms, setTerms] = useState<Term[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguage] = useState("en");
  const resolvedParams = useParams();
  const termId = resolvedParams?.word as string;

  useEffect(() => {
    const loadTerm = async () => {
      if (!termId) {
        setError("Term ID is required");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const termData = await fetchTerm(parseInt(termId, 10));
        const terms = await fetchTerms();
        setTerms(terms);
        setTerm(termData);
        logger.info(`Loaded term: ${termData.title}`);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load term";
        setError(errorMessage);
        logger.error("Error loading term:", err);
      } finally {
        setLoading(false);
      }
    };

    loadTerm();
  }, [termId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-200 p-8 flex flex-col items-center justify-center">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-gray-500">Loading term details...</p>
      </div>
    );
  }

  if (error || !term) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-200 p-8 flex flex-col items-center justify-center">
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
            Term Not Found
          </h1>
          <p className="text-gray-500 mb-4">
            {error ||
              "The term you are looking for does not exist in the dictionary."}
          </p>
          <Link
            href="/dictionary"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Back to Dictionary
          </Link>
        </div>
      </div>
    );
  }

  const translatedTitle = getTermTranslation(term, language);
  const translatedDescription = getTermDescription(term, language);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-200 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 text-center">
            {translatedTitle}
          </h1>

          {/* Language Selector */}
          <LanguageSelector
            currentLanguage={language}
            onLanguageChange={setLanguage}
            className="mb-6"
          />

          {/* Back Button */}
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
            Back to Dictionary
          </Link>
        </div>

        {/* Term Details */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Definition */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Definition
            </h2>
            <div className="prose max-w-none">
              <p className="text-lg text-gray-700 leading-relaxed">
                {translatedDescription}
              </p>
            </div>
          </div>

          {/* Photo if available */}
          {term.photo && (
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Photo
              </h2>
              <div className="flex justify-center">
                <img
                  src={term.photo}
                  alt={term.title}
                  className="max-w-full h-auto rounded-lg shadow-md"
                />
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-200">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Term Information
              </h3>
              <dl className="space-y-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Term ID</dt>
                  <dd className="text-sm text-gray-900">{term.id}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Category
                  </dt>
                  <dd className="text-sm text-gray-900">
                    {term.category
                      ? `Category ${term.category}`
                      : "No Category"}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Created</dt>
                  <dd className="text-sm text-gray-900">
                    {formatDate(term.created_at)}
                  </dd>
                </div>
                <div>
                  
                  <dd className="text-sm text-gray-900">
                    <RelatedTerm term={term} terms={terms} />
                  </dd>
                </div>
              </dl>
            </div>

            {/* Related Data */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Related Data
              </h3>
              <dl className="space-y-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Related Countries
                  </dt>
                  <dd className="text-sm text-gray-900">
                    {term.related_countries.length > 0
                      ? term.related_countries.join(", ")
                      : "None"}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Sources</dt>
                  <dd className="text-sm text-gray-900">
                    {term.sources.length > 0 ? term.sources.join(", ") : "None"}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermDetailPage;
