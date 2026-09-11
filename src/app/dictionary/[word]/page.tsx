"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { fetchTerm } from "@/lib/termsApi";
import { TermDetail } from "@/types";
import { logger, formatDateTime } from "@/lib/utils";
import InfoIcon from "@mui/icons-material/Info";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import LanguageIcon from "@mui/icons-material/Language";
import CategoryIcon from "@mui/icons-material/Category";
import PublicIcon from "@mui/icons-material/Public";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import TiptapViewer from "@/components/dictionary/TipTapViewer";
import {
  Settings,
  Layout,
  LayoutGrid,
  LayoutTemplate,
  Layers,
} from "lucide-react";
import { PageContainer } from "@/components/ui/PageContainer";

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
`;

interface TermDetailPageProps {
  params: Promise<{ word: string }>;
}

const getFlagEmoji = (isoCode?: string) => {
  if (!isoCode || isoCode.length !== 2) return "🌍";
  const codePoints = isoCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
};

const TermDetailPage: React.FC<TermDetailPageProps> = ({
  params,
}: TermDetailPageProps) => {
  const [term, setTerm] = useState<TermDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [layoutMode, setLayoutMode] = useState<1 | 2 | 3 | 4>(2); // Layout switcher (default to 2)
  const [showSwitcher, setShowSwitcher] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "about" | "countries" | "terms" | "sources"
  >("about");

  const { word: termId } = React.use(params);
  const router = useRouter();

  const handleBack = () => {
    if (window.history.length > 2) {
      router.back();
    } else {
      router.push("/dictionary");
    }
  };

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
      <div className="pt-[128px] p-8 flex flex-col items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-gray-500 font-medium">Termin yuklanmoqda...</p>
      </div>
    );
  }

  if (error || !term) {
    return (
      <div className="mx-auto pt-[128px] p-8 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-red-50">
          <div className="flex items-center justify-center w-16 h-16 mx-auto bg-red-100 rounded-full mb-6 text-red-600">
            <InfoIcon fontSize="large" />
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900 mb-2">
            Termin topilmadi
          </h1>
          <p className="text-gray-500 mb-8 leading-relaxed">
            {error ||
              "The term you are looking for does not exist in the dictionary."}
          </p>
          <button
            onClick={handleBack}
            className="inline-flex items-center px-6 py-3 font-semibold rounded-xl text-white bg-blue-600 hover:bg-blue-700 transition shadow-lg shadow-blue-200"
          >
            Lugʻatga qaytish
          </button>
        </div>
      </div>
    );
  }

  const hasExtraInfo =
    (Array.isArray(term.categories) && term.categories.length > 0) ||
    (Array.isArray(term.related_countries) &&
      term.related_countries.length > 0) ||
    (Array.isArray(term.related_terms) && term.related_terms.length > 0) ||
    (Array.isArray(term.sources) && term.sources.length > 0);

  // --- REUSABLE BLOCKS FOR LAYOUTS ---
  const MetadataGrid = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mt-6 md:mt-8">
      <div className="space-y-8">
        {term.categories?.length > 0 && (
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center uppercase tracking-wider">
              <CategoryIcon className="mr-2 text-blue-600" fontSize="small" />{" "}
              Kategoriyalar
            </h3>
            <div className="flex flex-wrap gap-2">
              {term.categories.map((c, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 bg-blue-50 text-blue-700 text-sm font-semibold rounded-lg border border-blue-100"
                >
                  {c.name}
                </span>
              ))}
            </div>
          </div>
        )}
        {term.related_countries?.length > 0 && (
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center uppercase tracking-wider">
              <PublicIcon className="mr-2 text-blue-600" fontSize="small" />{" "}
              Aloqador Davlatlar
            </h3>
            <div className="flex flex-col gap-2">
              {term.related_countries.map((country, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-2 bg-gray-50 border border-gray-100 rounded-lg w-full max-w-xs transition hover:bg-gray-100"
                >
                  <span className="text-xl leading-none">
                    {getFlagEmoji(country.iso_code)}
                  </span>
                  <span className="text-gray-900 text-sm font-medium">
                    {country.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="space-y-8">
        {term.related_terms?.length > 0 && (
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center uppercase tracking-wider">
              <InfoIcon className="mr-2 text-blue-600" fontSize="small" />{" "}
              O&apos;xshash Terminlar
            </h3>
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              {term.related_terms.map((rt, i) => (
                <Link
                  key={i}
                  href={`/dictionary/${rt.id}`}
                  className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline transition-colors flex items-center"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-300 mr-2"></span>
                  {rt.title}
                </Link>
              ))}
            </div>
          </div>
        )}
        {term.sources?.length > 0 && (
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center uppercase tracking-wider">
              <MenuBookIcon className="mr-2 text-blue-600" fontSize="small" />{" "}
              Manbalar
            </h3>
            <ul className="flex flex-col gap-2">
              {term.sources.map((s, i) => (
                <li key={i}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-blue-600 hover:underline flex items-center gap-2 group"
                  >
                    <LanguageIcon
                      fontSize="inherit"
                      className="text-blue-400 group-hover:text-blue-600 transition-colors"
                    />
                    <span className="line-clamp-1 break-all">{s.title}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );

  const TimestampsLine = () => (
    <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-400 font-medium">
      <span>Yaratildi: {formatDateTime(term.created_at).formattedDate}</span>
      {term.updated_at && (
        <>
          <span className="hidden sm:inline text-gray-300">•</span>
          <span>
            Tahrirlandi: {formatDateTime(term.updated_at).formattedDate}
          </span>
        </>
      )}
    </div>
  );

  // --- LAYOUT RENDERS ---

  return (
    <>
      <style>{editorStyles}</style>

      {/* Maket almashtirgich — faqat ishlab chiqish rejimida */}
      {process.env.NODE_ENV === "development" && (
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        {showSwitcher && (
          <div className="bg-white p-3 rounded-2xl shadow-2xl border border-gray-100 flex flex-col gap-2 transition-all animate-in slide-in-from-bottom-5">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 px-2">
              Select Layout
            </div>

            <button
              onClick={() => setLayoutMode(1)}
              className={`flex items-center gap-3 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                layoutMode === 1
                  ? "bg-blue-50 text-blue-700"
                  : "hover:bg-gray-50 text-gray-700"
              }`}
            >
              <Layout className="w-4 h-4" />
              1. Hero Banner
            </button>

            <button
              onClick={() => setLayoutMode(2)}
              className={`flex items-center gap-3 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                layoutMode === 2
                  ? "bg-blue-50 text-blue-700"
                  : "hover:bg-gray-50 text-gray-700"
              }`}
            >
              <LayoutTemplate className="w-4 h-4" />
              2. Interactive Tabs
            </button>

            <button
              onClick={() => setLayoutMode(3)}
              className={`flex items-center gap-3 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                layoutMode === 3
                  ? "bg-blue-50 text-blue-700"
                  : "hover:bg-gray-50 text-gray-700"
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              3. Sticky Editorial
            </button>

            <button
              onClick={() => setLayoutMode(4)}
              className={`flex items-center gap-3 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                layoutMode === 4
                  ? "bg-blue-50 text-blue-700"
                  : "hover:bg-gray-50 text-gray-700"
              }`}
            >
              <Layers className="w-4 h-4" />
              4. Minimalist
            </button>
          </div>
        )}

        <button
          onClick={() => setShowSwitcher(!showSwitcher)}
          className="bg-[#001c3b] text-white p-4 rounded-full shadow-xl hover:bg-blue-900 transition-transform hover:scale-105"
          aria-label="Toggle Layout Switcher"
        >
          <Settings
            className={`w-6 h-6 transition-transform ${showSwitcher ? "rotate-180" : ""}`}
            aria-hidden="true"
          />
        </button>
      </div>
      )}

      <div className="transition-all duration-500">
        {/* LAYOUT 1: HERO BANNER */}
        {layoutMode === 1 && (
          <div>
            <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white py-16 sm:py-24 px-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 opacity-10">
                <svg width="400" height="400" fill="none" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M12 2L2 22h20L12 2z" />
                </svg>
              </div>
              <div className="max-w-4xl mx-auto relative z-10">
                <button
                  onClick={handleBack}
                  className="text-blue-200 hover:text-white mb-8 flex items-center text-sm font-medium transition"
                >
                  <ArrowBackIcon className="mr-2" fontSize="small" /> Lugʻatga
                  qaytish
                </button>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
                  {term.title}
                </h1>
                <TimestampsLine />
              </div>
            </div>
            <div className="max-w-4xl mx-auto px-4 py-12">
              <div className="prose max-w-none text-gray-800 text-lg leading-relaxed mb-12">
                <TiptapViewer
                  content={term.definition}
                  className="!border-none !shadow-none !drop-shadow-none"
                />
              </div>
              {hasExtraInfo && (
                <>
                  <hr className="border-gray-200" />
                  <MetadataGrid />
                </>
              )}
            </div>
          </div>
        )}

        {/* LAYOUT 2: ELEGANT DICTIONARY ENTRY */}
        {layoutMode === 2 && (
          <PageContainer maxWidth="sm">
            <button
              onClick={handleBack}
              className="text-gray-600 hover:text-[#001c3b] mb-5 sm:mb-8 flex items-center text-sm font-semibold transition bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-full w-fit shadow-sm"
            >
              <ArrowBackIcon className="mr-2" fontSize="small" /> Orqaga
            </button>

            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-8 relative">
              {/* Decorative top bar */}
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#0099B5] via-[#c9a96e] to-[#1EB53A]"></div>

              <div className="p-5 sm:p-8 md:p-12">
                <div className="border-b border-gray-100 pb-4 sm:pb-6 mb-5 sm:mb-8">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#001c3b] mb-4 tracking-tight leading-tight">
                    {term.title}
                  </h1>
                  <TimestampsLine />
                </div>

                <div className="prose prose-lg sm:prose-xl max-w-none text-gray-800 leading-loose">
                  <TiptapViewer
                    content={term.definition}
                    className="!border-none !shadow-none !drop-shadow-none"
                  />
                </div>
              </div>
            </div>

            {hasExtraInfo && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="flex overflow-x-auto border-b border-gray-100 bg-gray-50/50 scrollbar-hide">
                  {[
                    {
                      id: "about",
                      label: "Ma'lumot",
                      icon: InfoIcon,
                      show:
                        term.categories?.length > 0 ||
                        term.related_countries?.length > 0,
                    },
                    {
                      id: "terms",
                      label: "O'xshash Terminlar",
                      icon: CategoryIcon,
                      show: term.related_terms?.length > 0,
                    },
                    {
                      id: "sources",
                      label: "Manbalar",
                      icon: MenuBookIcon,
                      show: term.sources?.length > 0,
                    },
                  ]
                    .filter((t) => t.show)
                    .map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center px-4 sm:px-8 py-3 sm:py-5 font-bold text-sm sm:text-base transition-all whitespace-nowrap ${activeTab === tab.id ? "bg-white text-[#001c3b] border-b-2 border-[#001c3b]" : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"}`}
                      >
                        <tab.icon
                          fontSize="small"
                          className="mr-2 opacity-80"
                        />{" "}
                        {tab.label}
                      </button>
                    ))}
                </div>
                <div className="p-5 sm:p-8 min-h-[160px] sm:min-h-[200px]">
                  {activeTab === "about" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                      {term.categories?.length > 0 && (
                        <div>
                          <h4 className="text-sm font-bold text-gray-400 mb-2 uppercase">
                            Kategoriyalar
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {term.categories.map((c, i) => (
                              <span
                                key={i}
                                className="px-3 py-1 bg-gray-100 rounded-lg text-sm"
                              >
                                {c.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {term.related_countries?.length > 0 && (
                        <div>
                          <h4 className="text-sm font-bold text-gray-400 mb-2 uppercase">
                            Davlatlar
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {term.related_countries.map((c, i) => (
                              <span
                                key={i}
                                className="px-3 py-1 bg-gray-100 rounded-lg text-sm flex items-center gap-2"
                              >
                                {getFlagEmoji(c.iso_code)} {c.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  {activeTab === "terms" && (
                    <div className="flex flex-col gap-3">
                      {term.related_terms.map((rt, i) => (
                        <Link
                          key={i}
                          href={`/dictionary/${rt.id}`}
                          className="text-blue-600 font-medium hover:underline p-3 border border-gray-100 rounded-lg hover:border-blue-200 bg-gray-50 hover:bg-blue-50 transition"
                        >
                          {rt.title}
                        </Link>
                      ))}
                    </div>
                  )}
                  {activeTab === "sources" && (
                    <div className="flex flex-col gap-3">
                      {term.sources.map((s, i) => (
                        <a
                          key={i}
                          href={s.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-700 hover:text-blue-600 font-medium hover:underline p-3 border border-gray-100 rounded-lg hover:border-blue-200 bg-gray-50 hover:bg-blue-50 transition flex items-center"
                        >
                          <LanguageIcon className="mr-3 text-gray-400" />{" "}
                          {s.title}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </PageContainer>
        )}

        {/* LAYOUT 3: STICKY EDITORIAL (POLISHED) */}
        {layoutMode === 3 && (
          <PageContainer
            maxWidth="lg"
            className="flex flex-col lg:flex-row gap-10 lg:gap-16"
          >
            {/* Left Column Component (Main Text) */}
            <div className="flex-1 lg:max-w-4xl">
              <button
                onClick={handleBack}
                className="text-blue-600 bg-blue-50 hover:bg-blue-100 mb-8 flex items-center text-sm font-bold tracking-wide uppercase transition px-4 py-2 rounded-full cursor-pointer w-fit"
              >
                <ArrowBackIcon className="mr-2" fontSize="small" /> Lugʻatga
                qaytish
              </button>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-8 leading-tight tracking-tight">
                {term.title}
              </h1>
              <div className="w-20 h-1.5 bg-blue-600 rounded-full mb-10"></div>
              <div className="prose prose-lg sm:prose-xl max-w-none text-slate-700 leading-relaxed viewer-content bg-white p-6 sm:p-10 rounded-3xl shadow-sm border border-slate-100">
                <TiptapViewer
                  content={term.definition}
                  className="!border-none !shadow-none !drop-shadow-none"
                />
              </div>
            </div>

            {/* Right Column Component (Sticky Sidebar) */}
            {hasExtraInfo && (
              <div className="lg:w-[400px] flex-shrink-0">
                <div className="sticky top-28 flex flex-col gap-6">
                  {/* Meta Information Card */}
                  <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 border-t-4 border-t-blue-600">
                    <h4 className="text-xs font-black text-slate-400 mb-4 uppercase tracking-widest">
                      Ma’lumot
                    </h4>

                    <div className="space-y-6">
                      {/* Dates */}
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-500">Yaratildi</span>
                          <span className="font-semibold text-slate-900">
                            {formatDateTime(term.created_at).formattedDate}
                          </span>
                        </div>
                        {term.updated_at && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-500">Tahrirlandi</span>
                            <span className="font-semibold text-slate-900">
                              {formatDateTime(term.updated_at).formattedDate}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Categories */}
                      {term.categories?.length > 0 && (
                        <div className="pt-6 border-t border-slate-100">
                          <h4 className="text-xs font-bold text-slate-900 mb-3 uppercase tracking-widest flex items-center">
                            <CategoryIcon
                              className="mr-2 text-blue-500"
                              fontSize="small"
                            />{" "}
                            Kategoriyalar
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {term.categories.map((c, i) => (
                              <span
                                key={i}
                                className="text-sm font-bold text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100"
                              >
                                {c.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Related Countries (MISSING FIX) */}
                      {term.related_countries?.length > 0 && (
                        <div className="pt-6 border-t border-slate-100">
                          <h4 className="text-xs font-bold text-slate-900 mb-3 uppercase tracking-widest flex items-center">
                            <PublicIcon
                              className="mr-2 text-emerald-500"
                              fontSize="small"
                            />{" "}
                            Aloqador Davlatlar
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {term.related_countries.map((c, i) => (
                              <span
                                key={i}
                                className="text-sm font-semibold text-slate-700 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 flex items-center gap-2"
                              >
                                <span>{getFlagEmoji(c.iso_code)}</span>
                                {c.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Related Terms / Sources Cards */}
                  {term.related_terms?.length > 0 && (
                    <div className="bg-slate-50 p-6 sm:p-8 rounded-3xl border border-slate-100">
                      <h4 className="text-xs font-bold text-slate-900 mb-4 uppercase tracking-widest flex items-center">
                        <InfoIcon
                          className="mr-2 text-indigo-500"
                          fontSize="small"
                        />{" "}
                        O&apos;xshash Terminlar
                      </h4>
                      <div className="flex flex-col gap-2">
                        {term.related_terms.map((rt, i) => (
                          <Link
                            key={i}
                            href={`/dictionary/${rt.id}`}
                            className="group flex items-center justify-between p-3 bg-white rounded-xl shadow-sm border border-slate-100 hover:border-indigo-200 hover:shadow-md transition-all"
                          >
                            <span className="text-sm font-semibold text-slate-700 group-hover:text-indigo-600 line-clamp-1">
                              {rt.title}
                            </span>
                            <KeyboardArrowRightIcon
                              fontSize="small"
                              className="text-slate-400 group-hover:text-indigo-500"
                            />
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {term.sources?.length > 0 && (
                    <div className="bg-slate-50 p-6 sm:p-8 rounded-3xl border border-slate-100">
                      <h4 className="text-xs font-bold text-slate-900 mb-4 uppercase tracking-widest flex items-center">
                        <MenuBookIcon
                          className="mr-2 text-slate-500"
                          fontSize="small"
                        />{" "}
                        Manbalar
                      </h4>
                      <ul className="space-y-3">
                        {term.sources.map((s, i) => (
                          <li key={i}>
                            <a
                              href={s.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-start text-sm font-medium text-slate-600 hover:text-blue-600 transition group p-2 rounded-lg hover:bg-white"
                            >
                              <LanguageIcon
                                fontSize="small"
                                className="mr-2 mt-0.5 text-slate-400 group-hover:text-blue-500 shrink-0"
                              />
                              <span className="line-clamp-2 leading-relaxed">
                                {s.title}
                              </span>
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </PageContainer>
        )}

        {/* LAYOUT 4: MINIMALIST (ORIGINAL) */}
        {layoutMode === 4 && (
          <PageContainer maxWidth="sm">
            <div className="flex flex-col items-center mb-8 sm:mb-10 md:mb-12 text-center">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#001c3b] mb-4 sm:mb-6 max-w-3xl break-words tracking-tight leading-snug">
                {term.title}
              </h1>
              <button
                onClick={handleBack}
                className="inline-flex items-center px-4 py-2 text-sm sm:text-base font-medium text-blue-600 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-lg transition-all"
              >
                <ArrowBackIcon className="mr-2" fontSize="small" /> Lugʻatga
                qaytish
              </button>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 md:p-10 border border-gray-100">
              <div
                className="prose max-w-none text-gray-800 viewer-content"
                contentEditable={false}
              >
                <TiptapViewer
                  content={term.definition}
                  className="!border-none !shadow-none !drop-shadow-none"
                />
              </div>

              <div
                className={`mt-8 ${hasExtraInfo ? "pb-8 border-b border-gray-100" : ""}`}
              >
                <TimestampsLine />
              </div>

              {hasExtraInfo && <MetadataGrid />}
            </div>
          </PageContainer>
        )}
      </div>
    </>
  );
};

export default TermDetailPage;
