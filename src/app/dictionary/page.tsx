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
import { Button } from "@mui/material";

// Assume fetchCountries and fetchSources are defined similarly
// In lib/countriesApi.ts
// export const fetchCountries = () => apiClient.request<Country[]>({ method: "GET", url: "/dictionary/country/" });

// In lib/sourcesApi.ts
// export const fetchSources = () => apiClient.request<Source[]>({ method: "GET", url: "/dictionary/source/" });

// Import them
// import { fetchCountries } from "@/lib/countriesApi";
// import { fetchSources } from "@/lib/sourcesApi";

// Define the Uzbek alphabet
const UZBEK_ALPHABET = [
  "A",
  "B",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "X",
  "Y",
  "Z",
  "Oʻ",
  "Gʻ",
  "Sh",
  "Ch",
  "Ng",
];

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
    <div className="px-4 sm:px-8 transition-all duration-300 pt-[128px]">
      <div className="flex flex-col items-center gap-6 max-w-6xl mx-auto">
        <h1
          className="text-2xl cursor-pointer sm:text-3xl font-bold text-gray-900 text-center"
          onClick={handleRefresh}
        >
          Diplomatik Lugʻat
        </h1>

        {/* search bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-4 w-full max-w-4xl">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Terminlarni qidirish..."
            className="flex-1 text-gray-800"
            disabled={loading}
            trigger={triggerSearch}
          />
        </div>

        {/* LOADING */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-gray-500">Lugʻat yuklanmoqda...</p>
          </div>
        ) : terms.length > 0 ? (
          /* HAS RESULTS */
          <>
            <div className="w-full max-w-2xl text-sm text-gray-600 flex justify-between mb-4">
              <span>
                {totalTerms > 0 && `${totalTerms} termin koʻrsatilmoqda`}
              </span>
            </div>
            <div className="w-full">
              {UZBEK_ALPHABET.map(
                (letter) =>
                  groupedTerms[letter]?.length > 0 && (
                    <div key={letter} className="mb-8">
                      <div className="mb-4 px-2 sm:px-4">
                        <span className="text-3xl sm:text-[46px] font-extrabold text-zinc-700">
                          {letter}
                        </span>
                        <hr className="mt-1 border-gray-300 opacity-30" />
                      </div>
                      <div className="grid grid-cols-4 gap-2 px-2 sm:px-4">
                        {groupedTerms[letter].map((term) => (
                          <div
                            key={term.id}
                            className="relative group transition cursor-pointer"
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
          </>
        ) : (
          /* NO RESULTS */
          <div className="w-full max-w-2xl text-sm text-gray-600 flex items-center justify-between mb-4">
            <span>Maʼlumot topilmadi</span>
            <Button
              variant="contained"
              onClick={handleRefresh}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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
