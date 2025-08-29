"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { SearchBar } from "@/components/dictionary/SearchBar";
import { TermCard } from "@/components/dictionary/TermCard";
import { useDictionary } from "@/hooks/useDictionary";
import { logger } from "@/lib/utils";
import { useMemo, useState, useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import { updateTerm, deleteTerm, fetchTerms } from "@/lib/termsApi";
import { TermDetail, TermSummary, Category, Country, Source } from "@/types";
import { fetchTerm } from "@/lib/termsApi";
import { fetchCategories } from "@/lib/categoriesApi";
import { StarterKit } from "@tiptap/starter-kit";
import { useEditor, EditorContent } from "@tiptap/react";
import { Button, Fab, Zoom } from "@mui/material";
import { UZBEK_ALPHABET } from "@/constants/alphabet";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";

// Assume fetchCountries and fetchSources are defined similarly
// In lib/countriesApi.ts
// export const fetchCountries = () => apiClient.request<Country[]>({ method: "GET", url: "/dictionary/country/" });

// In lib/sourcesApi.ts
// export const fetchSources = () => apiClient.request<Source[]>({ method: "GET", url: "/dictionary/source/" });

// Import them
// import { fetchCountries } from "@/lib/countriesApi";
// import { fetchSources } from "@/lib/sourcesApi";

const groupTermsByAlphabet = (
  terms: TermSummary[]
): Record<string, TermSummary[]> => {
  const grouped: Record<string, TermSummary[]> = {};
  UZBEK_ALPHABET.forEach((letter) => {
    grouped[letter] = [];
  });
  terms.forEach((term: TermSummary) => {
    const firstLetter = (term.title[0] || "").toUpperCase();
    let normalizedLetter = firstLetter;
    if (firstLetter === "Oʻ" || firstLetter === "oʻ") normalizedLetter = "Oʻ";
    if (firstLetter === "Gʻ" || firstLetter === "gʻ") normalizedLetter = "Gʻ";
    if (firstLetter === "S" || firstLetter === "s") normalizedLetter = "Sh";
    if (firstLetter === "C" || firstLetter === "c") normalizedLetter = "Ch";
    if (firstLetter === "N" || firstLetter === "n") normalizedLetter = "Ng";
    if (grouped[normalizedLetter]) {
      grouped[normalizedLetter].push(term);
    }
  });
  UZBEK_ALPHABET.forEach((letter) => {
    grouped[letter].sort((a: TermSummary, b: TermSummary) =>
      a.title.localeCompare(b.title, "uz")
    );
  });
  return grouped;
};

const DictionaryPage: React.FC = () => {
  const {
    terms,
    loading,
    error,
    search,
    setSearch,
    refreshData,
    totalTerms,
    triggerSearch,
  } = useDictionary();
  const router = useRouter();

  const handleRefresh = async () => {
    try {
      await refreshData();
      logger.info("Dictionary data refreshed successfully");
    } catch (error) {
      logger.error("Failed to refresh dictionary data:", error);
    }
  };

  const groupedTerms = useMemo(() => {
    const sortedTerms = [...terms].sort((a, b) =>
      a.title.localeCompare(b.title, "uz")
    );
    return groupTermsByAlphabet(sortedTerms);
  }, [terms]);

  const handleTermClick = (id: number) => {
    router.push(`/dictionary/${id}`);
  };

  // const fetchOptions = async () => {
  //   try {
  //     const [termsData, categoriesData, ] = await Promise.all([
  //       fetchTerms(),
  //       fetchCategories(),
  //       // fetchCountries(),
  //       // fetchSources(),
  //     ]);
  //     setAllTerms(termsData);
  //     setAllCategories(categoriesData);
  //     // setAllCountries(countriesData);
  //     // setAllSources(sourcesData);
  //   } catch (err) {
  //     logger.error("Failed to fetch options:", err);
  //   }
  // };

  // useEffect(() => {
  //   if (adminMode) {
  //     fetchOptions();
  //   }
  // }, [adminMode]);

  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (error) {
    return (
      <div className="max-w-8xl mx-auto p-8 pt-[112px]">
        <div className="flex flex-col items-center gap-6">
          <h1
            className="text-3xl cursor-pointer font-bold text-gray-900"
            onClick={handleRefresh}
          >
            Diplomatik Lugʻat
          </h1>
          <div className="max-w-6xl bg-white rounded-lg shadow-lg p-6 text-center">
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
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Lugʻatni yuklash muvaffaqiyatsiz yakunlandi
            </h3>
            <p className="text-sm text-gray-500 mb-4">{error}</p>
            <button
              onClick={handleRefresh}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Qayta urinish
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 pt-28 sm:pt-32 md:pt-36 transition-all duration-300">
      <div className="flex flex-col items-center gap-6 sm:gap-8 max-w-6xl mx-auto">
        <h1
          className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 text-center cursor-pointer tracking-tight"
          onClick={handleRefresh}
        >
          Diplomatik Lugʻat
        </h1>

        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full max-w-3xl sm:max-w-4xl">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Terminlarni qidirish..."
            className="flex-1 text-gray-800 text-sm sm:text-base rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={loading}
            trigger={triggerSearch}
          />
        </div>

        {/* LOADING */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 sm:py-16">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-sm sm:text-base text-gray-500">
              Lugʻat yuklanmoqda...
            </p>
          </div>
        ) : terms.length > 0 ? (
          /* HAS RESULTS */
          <>
            <div className="w-full max-w-3xl text-sm sm:text-base text-gray-600 flex justify-between items-center mb-4 sm:mb-6">
              <span>
                {totalTerms > 0 && `${totalTerms} termin koʻrsatilmoqda`}
              </span>
            </div>
            <div className="w-full">
              {UZBEK_ALPHABET.map(
                (letter) =>
                  groupedTerms[letter]?.length > 0 && (
                    <div key={letter} className="mb-8 sm:mb-10">
                      <div className="mb-4 px-2 sm:px-4">
                        <span className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-zinc-700">
                          {letter}
                        </span>
                        <hr className="mt-2 border-gray-300 opacity-30" />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5  gap-3 sm:gap-4 px-2 sm:px-4">
                        {groupedTerms[letter].map((term) => (
                          <div
                            key={term.id}
                            className="relative group transition cursor-pointer rounded-lg "
                            onClick={() => handleTermClick(term.id)}
                          >
                            <TermCard term={term} />
                          </div>
                        ))}
                      </div>
                    </div>
                  )
              )}
            </div>
            {/* Scroll to Top Button */}
            <Zoom in={showScrollTop}>
              <Fab
                color="primary"
                aria-label="scroll to top"
                onClick={scrollToTop}
                className="!fixed !bottom-6 !right-6 !bg-blue-600 !text-white hover:!bg-blue-700 !shadow-lg "
                size="small"
                // sx={{ width: 48, height: 48 }}
              >
                <ArrowUpwardIcon />
              </Fab>
            </Zoom>
          </>
        ) : (
          /* NO RESULTS */
          <div className="w-full max-w-3xl text-sm sm:text-base text-gray-600 flex flex-col sm:flex-row items-center justify-between gap-4 mb-4 sm:mb-6">
            <span>Maʼlumot topilmadi</span>
            <Button
              variant="contained"
              onClick={handleRefresh}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm sm:text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Terminlarni koʻrsatish
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

const DictionaryPageWithErrorBoundary: React.FC = () => {
  return (
    <ErrorBoundary>
      <DictionaryPage />
    </ErrorBoundary>
  );
};

export default DictionaryPageWithErrorBoundary;

// //
// <Modal open={!!editTerm} onClose={closeModals} title="Atamani tahrirlash">
// {editTerm && (
//   <form onSubmit={handleEditSubmit} className="space-y-4">
//     <div>
//       <label className="block text-sm font-medium">Sarlavha</label>
//       <input
//         type="text"
//         value={editTerm.title}
//         onChange={(e) => setEditTerm({ ...editTerm, title: e.target.value })}
//         className="w-full border rounded px-2 py-1"
//         required
//       />
//     </div>
//     <div>
//       <label className="block text-sm font-medium">Taʼrif</label>
//       {/*
//         Use TipTap editor here
//         Example setup:
//       */}
//       {editTerm.definition && (
//         <TipTapEditor
//           content={editTerm.definition}
//           onUpdate={(content) => setEditTerm({ ...editTerm, definition: content })}
//         />
//       )}
//     </div>
//     <div>
//       <label className="block text-sm font-medium">Related Terms</label>
//       <select
//         multiple
//         value={editTerm.related_terms.map(String)}
//         onChange={(e) =>
//           setEditTerm({
//             ...editTerm,
//             related_terms: Array.from(e.target.selectedOptions, (option) => Number(option.value)),
//           })
//         }
//         className="w-full border rounded px-2 py-1"
//       >
//         {allTerms.map((t) => (
//           <option key={t.id} value={t.id}>
//             {t.title}
//           </option>
//         ))}
//       </select>
//     </div>
//     <div>
//       <label className="block text-sm font-medium">Categories</label>
//       <select
//         multiple
//         value={editTerm.categories.map(String)}
//         onChange={(e) =>
//           setEditTerm({
//             ...editTerm,
//             categories: Array.from(e.target.selectedOptions, (option) => Number(option.value)),
//           })
//         }
//         className="w-full border rounded px-2 py-1"
//       >
//         {allCategories.map((c) => (
//           <option key={c.id} value={c.id}>
//             {c.name}
//           </option>
//         ))}
//       </select>
//     </div>
//     <div>
//       <label className="block text-sm font-medium">Related Countries</label>
//       <select
//         multiple
//         value={editTerm.related_countries.map(String)}
//         onChange={(e) =>
//           setEditTerm({
//             ...editTerm,
//             related_countries: Array.from(e.target.selectedOptions, (option) => Number(option.value)),
//           })
//         }
//         className="w-full border rounded px-2 py-1"
//       >
//         {allCountries.map((country) => (
//           <option key={country.id} value={country.id}>
//             {country.name}
//           </option>
//         ))}
//       </select>
//     </div>
//     <div>
//       <label className="block text-sm font-medium">Sources</label>
//       <select
//         multiple
//         value={editTerm.sources.map(String)}
//         onChange={(e) =>
//           setEditTerm({
//             ...editTerm,
//             sources: Array.from(e.target.selectedOptions, (option) => Number(option.value)),
//           })
//         }
//         className="w-full border rounded px-2 py-1"
//       >
//         {allSources.map((source) => (
//           <option key={source.id} value={source.id}>
//             {source.title}
//           </option>
//         ))}
//       </select>
//     </div>
//     {modalError && <div className="text-red-600 text-sm">{modalError}</div>}
//     <div className="flex justify-end gap-2">
//       <button type="button" onClick={closeModals} className="px-3 py-1 bg-gray-200 rounded">
//         Bekor qilish
//       </button>
//       <button
//         type="submit"
//         className="px-3 py-1 bg-blue-600 text-white rounded"
//         disabled={modalLoading}
//       >
//         {modalLoading ? "Saqlanmoqda..." : "Saqlash"}
//       </button>
//     </div>
//   </form>
// )}
// </Modal>

// <Modal open={!!deleteTermId} onClose={closeModals} title="Atamani oʻchirish">
// <div className="mb-4">Ushbu atamani oʻchirishga ishonchingiz komilmi?</div>
// {modalError && <div className="text-red-600 text-sm mb-2">{modalError}</div>}
// <div className="flex justify-end gap-2">
//   <button type="button" onClick={closeModals} className="px-3 py-1 bg-gray-200 rounded">
//     Bekor qilish
//   </button>
//   <button
//     type="button"
//     onClick={handleDeleteConfirm}
//     className="px-3 py-1 bg-red-600 text-white rounded"
//     disabled={modalLoading}
//   >
//     {modalLoading ? "Oʻchirilmoqda..." : "Oʻchirish"}
//   </button>
// </div>
// </Modal>
