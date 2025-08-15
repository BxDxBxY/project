"use client";

import React from "react";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { SearchBar } from "@/components/dictionary/SearchBar";
import { CategoryFilter } from "@/components/dictionary/CategoryFilter";
import { LanguageSelector } from "@/components/dictionary/LanguageSelector";
import { TermCard } from "@/components/dictionary/TermCard";
import { useDictionary } from "@/hooks/useDictionary";
import { logger } from "@/lib/utils";
import { useMemo } from "react";
import { Term } from "@/types";
import { Modal } from "@/components/ui/Modal";
// import { updateTerm, deleteTerm } from "@/lib/api";
import { HeaderDefault } from "@/components/dictionary/HeaderDefault";
import { updateTerm, deleteTerm } from "@/lib/termsApi";

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

const groupTermsByAlphabet = (terms: Term[]): Record<string, Term[]> => {
  const grouped: Record<string, Term[]> = {};
  UZBEK_ALPHABET.forEach((letter) => {
    grouped[letter] = [];
  });
  terms.forEach((term: Term) => {
    // Normalize the first letter for case-insensitive grouping
    const firstLetter = (term.title[0] || "").toUpperCase();
    // Handle special Uzbek letters (case-insensitive)
    let normalizedLetter = firstLetter;
    if (firstLetter === "Oʻ" || firstLetter === "oʻ") normalizedLetter = "Oʻ";
    if (firstLetter === "Gʻ" || firstLetter === "gʻ") normalizedLetter = "Gʻ";
    if (firstLetter === "S" || firstLetter === "s") normalizedLetter = "Sh"; // Adjust if 'Sh' terms start with 'S'
    if (firstLetter === "C" || firstLetter === "c") normalizedLetter = "Ch"; // Adjust if 'Ch' terms start with 'C'
    if (firstLetter === "N" || firstLetter === "n") normalizedLetter = "Ng"; // Adjust if 'Ng' terms start with 'N'
    if (grouped[normalizedLetter]) {
      grouped[normalizedLetter].push(term);
    }
  });
  // Sort each group alphabetically
  UZBEK_ALPHABET.forEach((letter) => {
    grouped[letter].sort((a: Term, b: Term) =>
      a.title.localeCompare(b.title, "uz")
    );
  });
  return grouped;
};

const isAdminRoute = () =>
  typeof window !== "undefined" &&
  window.location.pathname.startsWith("/admin");

const DictionaryPage: React.FC = () => {
  const {
    terms,
    categories,
    loading,
    error,
    search,
    selectedCategory,
    language,
    filteredTerms,
    totalTerms,
    totalCategories,
    setSearch,
    setSelectedCategory,
    setLanguage,
    refreshData,
  } = useDictionary();

  const [editTerm, setEditTerm] = React.useState<Term | null>(null);
  const [deleteTermId, setDeleteTermId] = React.useState<number | null>(null);
  const [modalLoading, setModalLoading] = React.useState(false);
  const [modalError, setModalError] = React.useState<string | null>(null);
  const adminMode = isAdminRoute();

  const handleRefresh = async () => {
    try {
      await refreshData();
      logger.info("Dictionary data refreshed successfully");
    } catch (error) {
      logger.error("Failed to refresh dictionary data:", error);
    }
  };

  const groupedTerms = useMemo(
    () => groupTermsByAlphabet(filteredTerms),
    [filteredTerms]
  );

  const handleEdit = (term: Term) => setEditTerm(term);
  const handleDelete = (id: number) => setDeleteTermId(id);
  const closeModals = () => {
    setEditTerm(null);
    setDeleteTermId(null);
    setModalError(null);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTerm) return;
    setModalLoading(true);
    setModalError(null);
    try {
      await updateTerm(editTerm.id, {
        title: editTerm.title,
        definition: editTerm.definition,
      });
      await refreshData();
      closeModals();
    } catch (err: any) {
      setModalError(err.message || "Failed to update term");
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTermId) return;
    setModalLoading(true);
    setModalError(null);
    try {
      await deleteTerm(deleteTermId);
      await refreshData();
      closeModals();
    } catch (err: any) {
      setModalError(err.message || "Failed to delete term");
    } finally {
      setModalLoading(false);
    }
  };

  if (error) {
    return (
      <div className=" bg-gradient-to-br max-w-6xl from-blue-50 to-blue-200 p-8">
        <div className="flex flex-col items-center gap-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Diplomatik {"Lugʻat"}
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
              {"Lugʻatni"} yuklash muvaffaqiyatsiz yakunlandi
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
    <>
      <div className=" px-4 sm:px-8 py-8 transition-all duration-300">
        <div className="flex flex-col items-center gap-6 max-w-6xl mx-auto">
          {/* Title */}
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center">
            Diplomatik {"Lugʻat"}
          </h1>

          {/* Search and Filter Controls */}
          <div className="flex flex-col sm:flex-row gap-4 mb-4 w-full max-w-2xl">
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Terminlarni qidirish..."
              className="flex-1 text-gray-800"
              disabled={loading}
            />
            {/* CategoryFilter can be added back here if needed */}
          </div>

          {/* Statistics */}
          <div className="w-full max-w-2xl text-sm text-gray-600 flex justify-between mb-4">
            <span>
              {filteredTerms.length} / {totalTerms} termin {"koʻrsatilmoqda"}
            </span>
            {/* <span>{totalCategories} kategoriyalar mavjud</span> */}
          </div>

          {/* Content Area */}
          <div className="w-full">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <LoadingSpinner size="lg" />
                <p className="mt-4 text-gray-500">{"Lugʻat"} yuklanmoqda...</p>
              </div>
            ) : (
              <>
                {UZBEK_ALPHABET.map(
                  (letter) =>
                    groupedTerms[letter]?.length > 0 && (
                      <div key={letter} className="mb-8">
                        {/* Letter Header */}
                        <div className="mb-4 px-2 sm:px-4">
                          <span className="text-3xl sm:text-[46px] font-extrabold text-zinc-700">
                            {letter}
                          </span>
                          <hr className="mt-1 border-gray-300 opacity-30" />
                        </div>

                        {/* Terms Grid */}
                        <div className="flex flex-wrap gap-4 px-2 sm:px-4">
                          {groupedTerms[letter].map((term) => (
                            <div
                              key={term.id}
                              className="relative group transition"
                            >
                              <TermCard
                                categories={categories}
                                term={term}
                                language={language}
                              />
                              {adminMode && (
                                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition">
                                  <button
                                    className="px-2 py-1 bg-blue-600 text-white rounded text-xs"
                                    onClick={() => handleEdit(term)}
                                  >
                                    Tahrirlash
                                  </button>
                                  <button
                                    className="px-2 py-1 bg-red-600 text-white rounded text-xs"
                                    onClick={() => handleDelete(term.id)}
                                  >
                                    Oʻchirish
                                  </button>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                )}

                {/* Edit Modal */}
                <Modal
                  open={!!editTerm}
                  onClose={closeModals}
                  title="Atamani tahrirlash"
                >
                  {editTerm && (
                    <form onSubmit={handleEditSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium">
                          Sarlavha
                        </label>
                        <input
                          type="text"
                          value={editTerm.title}
                          onChange={(e) =>
                            setEditTerm({ ...editTerm, title: e.target.value })
                          }
                          className="w-full border rounded px-2 py-1"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium">
                          {"Taʼrif"}
                        </label>
                        <textarea
                          value={editTerm.definition}
                          onChange={(e) =>
                            setEditTerm({
                              ...editTerm,
                              definition: e.target.value,
                            })
                          }
                          className="w-full border rounded px-2 py-1"
                          required
                        />
                      </div>
                      {modalError && (
                        <div className="text-red-600 text-sm">{modalError}</div>
                      )}
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={closeModals}
                          className="px-3 py-1 bg-gray-200 rounded"
                        >
                          Bekor qilish
                        </button>
                        <button
                          type="submit"
                          className="px-3 py-1 bg-blue-600 text-white rounded"
                          disabled={modalLoading}
                        >
                          {modalLoading ? "Saqlanmoqda..." : "Saqlash"}
                        </button>
                      </div>
                    </form>
                  )}
                </Modal>

                {/* Delete Modal */}
                <Modal
                  open={!!deleteTermId}
                  onClose={closeModals}
                  title="Atamani oʻchirish"
                >
                  <div className="mb-4">
                    Ushbu atamani oʻchirishga ishonchingiz komilmi?
                  </div>
                  {modalError && (
                    <div className="text-red-600 text-sm mb-2">
                      {modalError}
                    </div>
                  )}
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={closeModals}
                      className="px-3 py-1 bg-gray-200 rounded"
                    >
                      Bekor qilish
                    </button>
                    <button
                      type="button"
                      onClick={handleDeleteConfirm}
                      className="px-3 py-1 bg-red-600 text-white rounded"
                      disabled={modalLoading}
                    >
                      {modalLoading ? "Oʻchirilmoqda..." : "Oʻchirish"}
                    </button>
                  </div>
                </Modal>
              </>
            )}
          </div>
        </div>
      </div>
    </>
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
