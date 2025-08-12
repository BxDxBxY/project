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
import { updateTerm, deleteTerm } from "@/lib/api";

const ALPHABET = Array.from({ length: 26 }, (_, i) =>
  String.fromCharCode(65 + i)
);

const groupTermsByAlphabet = (terms: Term[]): Record<string, Term[]> => {
  const grouped: Record<string, Term[]> = {};
  ALPHABET.forEach((letter) => {
    grouped[letter] = [];
  });
  terms.forEach((term: Term) => {
    const firstLetter = (term.title[0] || "").toUpperCase();
    if (grouped[firstLetter]) {
      grouped[firstLetter].push(term);
    }
  });
  // Sort each group alphabetically
  ALPHABET.forEach((letter) => {
    grouped[letter].sort((a: Term, b: Term) => a.title.localeCompare(b.title));
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
      // Only send fields valid for UpdateTermData
      await updateTerm(editTerm.id, {
        title: editTerm.title,
        definition: editTerm.definition,
        // photo: undefined, // Not handled in modal
        // category: editTerm.category, // Not handled in modal
        // related_terms: editTerm.related_terms, // Not handled in modal
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-200 p-8">
        <div className="flex flex-col items-center gap-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Diplomatic Dictionary
          </h1>
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
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Failed to Load Dictionary
            </h3>
            <p className="text-sm text-gray-500 mb-4">{error}</p>
            <button
              onClick={handleRefresh}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-200 p-8">
      <div className="flex flex-col items-center gap-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Diplomatic Dictionary
        </h1>

        {/* Language Selector */}
        {/* <LanguageSelector
          currentLanguage={language}
          onLanguageChange={setLanguage}
          disabled={loading}
        /> */}

        {/* Search and Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-4 w-full max-w-2xl">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search terms..."
            className="flex-1"
            disabled={loading}
          />
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            disabled={loading}
            className="w-full sm:w-48"
          />
        </div>

        {/* Statistics */}
        <div className="w-full max-w-2xl">
          <div className="flex justify-between items-center mb-4 text-sm text-gray-600">
            <span>
              Showing {filteredTerms.length} of {totalTerms} terms
            </span>
            <span>{totalCategories} categories available</span>
          </div>
        </div>

        {/* Content Area */}
        <div className="w-full max-w-6xl">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <LoadingSpinner size="lg" />
              <p className="mt-4 text-gray-500">Loading dictionary...</p>
            </div>
          ) : (
            <>
              {ALPHABET.map((letter) => (
                <div key={letter} className="mb-8">
                  <div className="mb-4">
                    <span className="text-2xl font-extrabold text-blue-800">
                      {letter}
                    </span>
                  </div>
                  {groupedTerms[letter].length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {groupedTerms[letter].map((term) => (
                        <div key={term.id} className="relative group">
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
                                Edit
                              </button>
                              <button
                                className="px-2 py-1 bg-red-600 text-white rounded text-xs"
                                onClick={() => handleDelete(term.id)}
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-gray-400 italic text-center py-2">
                      No terms
                    </div>
                  )}
                </div>
              ))}
              {/* Edit Modal */}
              <Modal open={!!editTerm} onClose={closeModals} title="Edit Term">
                {editTerm && (
                  <form onSubmit={handleEditSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium">Title</label>
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
                        Definition
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
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-3 py-1 bg-blue-600 text-white rounded"
                        disabled={modalLoading}
                      >
                        {modalLoading ? "Saving..." : "Save"}
                      </button>
                    </div>
                  </form>
                )}
              </Modal>
              {/* Delete Modal */}
              <Modal
                open={!!deleteTermId}
                onClose={closeModals}
                title="Delete Term"
              >
                <div className="mb-4">
                  Are you sure you want to delete this term?
                </div>
                {modalError && (
                  <div className="text-red-600 text-sm mb-2">{modalError}</div>
                )}
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={closeModals}
                    className="px-3 py-1 bg-gray-200 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleDeleteConfirm}
                    className="px-3 py-1 bg-red-600 text-white rounded"
                    disabled={modalLoading}
                  >
                    {modalLoading ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </Modal>
            </>
          )}
        </div>
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
