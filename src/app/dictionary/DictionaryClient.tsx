"use client";

import React from "react";
// removed unused Link import
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { PageContainer } from "@/components/ui/PageContainer";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { SearchBar } from "@/components/dictionary/SearchBar";
import { TermCard } from "@/components/dictionary/TermCard";
import {
  AlphabetNav,
  letterAnchorId,
} from "@/components/dictionary/AlphabetNav";
import { ErrorState } from "@/components/ui/ErrorState";
import { useDictionary } from "@/hooks/useDictionary";
import { logger } from "@/lib/utils";
import { useMemo, useState, useEffect } from "react";
import { TermSummary } from "@/types";
import { Button, Fab, Zoom } from "@mui/material";
import {
  compareUzbek,
  groupByUzbekAlphabet,
  orderedLetters,
} from "@/lib/uzbekCollation";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import { useLanguage } from "@/lib/LanguageContext";
import { translations } from "@/constants/translations";

// Assume fetchCountries and fetchSources are defined similarly
// In lib/countriesApi.ts
// export const fetchCountries = () => apiClient.request<Country[]>({ method: "GET", url: "/dictionary/country/" });

// In lib/sourcesApi.ts
// export const fetchSources = () => apiClient.request<Source[]>({ method: "GET", url: "/dictionary/source/" });

// Import them
// import { fetchCountries } from "@/lib/countriesApi";
// import { fetchSources } from "@/lib/sourcesApi";

interface DictionaryClientProps {
  initialTerms: TermSummary[];
}

const DictionaryClient: React.FC<DictionaryClientProps> = ({
  initialTerms,
}) => {
  const {
    terms,
    loading,
    error,
    search,
    setSearch,
    refreshData,
    totalTerms,
    triggerSearch,
  } = useDictionary(initialTerms);
  const { language } = useLanguage();
  const t = translations[language].dictionary;

  const [retrying, setRetrying] = useState(false);

  const handleRefresh = async () => {
    setRetrying(true);
    try {
      await refreshData();
      logger.info("Dictionary data refreshed successfully");
    } catch (error) {
      logger.error("Failed to refresh dictionary data:", error);
    } finally {
      setRetrying(false);
    }
  };

  // Saralash va guruhlash rasmiy oʻzbek alifbosi tartibida (lib/uzbekCollation).
  const groupedTerms = useMemo(() => {
    if (!Array.isArray(terms)) return {};
    const sortedTerms = [...terms].sort((a, b) => compareUzbek(a.title, b.title));
    return groupByUzbekAlphabet(sortedTerms, (term: TermSummary) => term.title);
  }, [terms]);

  const letters = useMemo(() => orderedLetters(groupedTerms), [groupedTerms]);

  // handleTermClick removed as we use Link directly

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

  // A failure only takes over the page when there is nothing to show. If the
  // terms are already in memory — the usual case once the page has loaded —
  // the visitor keeps reading and gets a quiet notice instead.
  if (error && terms.length === 0) {
    return (
      <PageContainer maxWidth="md">
        <div className="flex flex-col items-center gap-6 sm:gap-8">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 text-center tracking-tight">
            {t.title}
          </h1>
          <ErrorState
            error={error}
            title={t.errorMsg}
            onRetry={handleRefresh}
            retrying={retrying}
          />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer maxWidth="md">
      <div className="flex flex-col items-center gap-6 sm:gap-8">
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 text-center tracking-tight">
          {t.title}
        </h1>

        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full max-w-3xl sm:max-w-4xl">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder={t.searchPlaceholder}
            className="flex-1 text-gray-800 text-sm sm:text-base rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={loading}
            trigger={triggerSearch}
            enableAutocomplete={true}
          />
        </div>

        {/* Refresh failed but the cached terms are still usable */}
        {!!error && terms.length > 0 && (
          <p
            role="status"
            className="w-full max-w-4xl text-xs sm:text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2.5"
          >
            {t.offlineNotice}
          </p>
        )}

        {/* LOADING */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 sm:py-16">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-sm sm:text-base text-gray-500">
              {t.loading}
            </p>
          </div>
        ) : terms.length > 0 ? (
          /* HAS RESULTS */
          <>
            {/* Alifbo boʻyicha oʻtish — sarlavhalar ostida yopishib turadi */}
            {!search && <AlphabetNav available={letters} />}

            <div
              className="w-full max-w-4xl text-sm sm:text-base text-gray-700 flex justify-between items-center"
              role="status"
            >
              <span>{totalTerms > 0 && `${totalTerms} ${t.termsShowing}`}</span>
            </div>

            {/*
              Harflar orasidagi masofa 16/24 dan 10/12 ga tushirildi: avval
              ekranning yarmi boʻsh qolardi va roʻyxat uzilib ketganday
              koʻrinardi.
            */}
            <div className="w-full space-y-10 sm:space-y-12">
              {letters.map(
                (letter) =>
                  groupedTerms[letter]?.length > 0 && (
                    <section
                      key={letter}
                      id={letterAnchorId(letter)}
                      className="scroll-mt-[9.5rem] sm:scroll-mt-[11rem] md:scroll-mt-[12rem]"
                      aria-label={`${letter} — ${t.letterHeading}`}
                    >
                      <div className="mb-4 sm:mb-6 px-1 sm:px-2 flex items-baseline gap-3">
                        <h2 className="inline-block text-2xl sm:text-3xl md:text-4xl font-black text-[#001c3b] border-b-4 border-[#c9a96e] pb-1.5">
                          {letter}
                        </h2>
                        <span className="text-xs sm:text-sm text-gray-400 tabular-nums">
                          {groupedTerms[letter].length}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
                        {groupedTerms[letter].map((term) => (
                          <div
                            key={term.id}
                            className="relative group transition cursor-pointer rounded-lg block"
                          >
                            <TermCard term={term} />
                          </div>
                        ))}
                      </div>
                    </section>
                  ),
              )}
            </div>
            {/* Scroll to Top Button */}
            <Zoom in={showScrollTop}>
              <Fab
                color="primary"
                aria-label={t.scrollTop}
                onClick={scrollToTop}
                className="!fixed !bottom-6 !right-6 !bg-[#001c3b] !text-white hover:!bg-[#00325f] !shadow-lg "
                size="small"
              >
                <ArrowUpwardIcon />
              </Fab>
            </Zoom>
          </>
        ) : (
          /* NO RESULTS */
          <div
            className="w-full max-w-3xl text-sm sm:text-base text-gray-700 flex flex-col sm:flex-row items-center justify-between gap-4 mb-4 sm:mb-6"
            role="status"
          >
            <span>{search ? t.noSearchResults : t.noResults}</span>
            <Button
              variant="contained"
              onClick={() => {
                setSearch("");
                triggerSearch("");
              }}
              sx={{
                backgroundColor: "#001c3b",
                textTransform: "none",
                fontWeight: 600,
                "&:hover": { backgroundColor: "#00325f" },
              }}
            >
              {t.showAllTerms}
            </Button>
          </div>
        )}
      </div>
    </PageContainer>
  );
};

const DictionaryClientWithErrorBoundary: React.FC<DictionaryClientProps> = ({
  initialTerms,
}) => {
  return (
    <ErrorBoundary>
      <DictionaryClient initialTerms={initialTerms} />
    </ErrorBoundary>
  );
};

export default DictionaryClientWithErrorBoundary;

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
