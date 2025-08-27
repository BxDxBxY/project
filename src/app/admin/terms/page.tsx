"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { SearchBar } from "@/components/dictionary/SearchBar";
import { TermCard } from "@/components/dictionary/TermCard";
import { useDictionary } from "@/hooks/useDictionary";
import { logger } from "@/lib/utils";
import { Modal } from "@/components/ui/Modal";
import {
  fetchTerm,
  createTerm,
  updateTerm,
  deleteTerm,
  fetchTerms,
  fetchTermEdit,
} from "@/lib/termsApi";
import { fetchCategories } from "@/lib/categoriesApi";
import { fetchCountries } from "@/lib/countriesApi";
import { fetchSources } from "@/lib/sourcesApi";
import {
  TermDetail,
  TermSummary,
  Category,
  Country,
  Source,
  CreateTermData,
  TermDetailEdit,
} from "@/types";
import { StarterKit } from "@tiptap/starter-kit";
import { useEditor, EditorContent } from "@tiptap/react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import EditorComponent from "@/components/dictionary/EditorComponent";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import { AsyncTermSelect } from "@/components/dictionary/AsyncTermSelect";
import { SimpleMultiSelect } from "@/components/dictionary/MultiSelect";

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

const AdminTermsPage: React.FC = () => {
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
  const [editTerm, setEditTerm] = useState<TermDetailEdit | null>(null);
  const [createMode, setCreateMode] = useState(false);
  const [deleteTermId, setDeleteTermId] = useState<number | null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [allTerms, setAllTerms] = useState<TermSummary[]>([]);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [allCountries, setAllCountries] = useState<Country[]>([]);
  const [allSources, setAllSources] = useState<Source[]>([]);
  const [formData, setFormData] = useState<CreateTermData>({
    title: "",
    definition: "",
    categories: [],
    related_terms: [],
    related_countries: [],
    sources: [],
  });

  const fetchOptions = async () => {
    try {
      const [termsData, categoriesData, countriesData, sourcesData] =
        await Promise.all([
          fetchTerms(),
          fetchCategories(),
          fetchCountries(),
          fetchSources(),
        ]);
      setAllTerms(termsData);
      setAllCategories(categoriesData);
      setAllCountries(countriesData);
      setAllSources(sourcesData);
    } catch (err) {
      logger.error("Failed to fetch options:", err);
      setModalError("Failed to load options for editing");
    }
  };

  useEffect(() => {
    fetchOptions();
  }, []);

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

  const handleEdit = async (id: number) => {
    try {
      const termDetail = await fetchTermEdit(id);
      setEditTerm(termDetail);
      setFormData({
        title: termDetail.title,
        definition: termDetail.definition,
        categories: termDetail.categories || [],
        related_terms: termDetail.related_terms || [],
        related_countries: termDetail.related_countries || [],
        sources: termDetail.sources || [],
      });
      setCreateMode(false);
      setModalError(null);
    } catch (err) {
      setModalError("Failed to fetch term details");
    }
  };

  const handleCreate = () => {
    setCreateMode(true);
    setFormData({
      title: "",
      definition: "",
      categories: [],
      related_terms: [],
      related_countries: [],
      sources: [],
    });
    setEditTerm(null);
    setModalError(null);
  };

  const handleDelete = (id: number) => setDeleteTermId(id);

  const closeModals = () => {
    setEditTerm(null);
    setCreateMode(false);
    setDeleteTermId(null);
    setModalError(null);
    setFormData({
      title: "",
      definition: "",
      categories: [],
      related_terms: [],
      related_countries: [],
      sources: [],
    });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalLoading(true);
    setModalError(null);
    try {
      if (createMode) {
        await createTerm(formData);
      } else if (editTerm) {
        await updateTerm(editTerm.id, formData);
      }
      await refreshData();
      closeModals();
    } catch (err: any) {
      setModalError(
        err.details?.title?.[0] || err.message || "Failed to save term"
      );
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
            Xatolik yuz berdi
          </h1>
          <p className="text-gray-500 mb-4">{error}</p>
          <button
            onClick={handleRefresh}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Qayta urinish
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mr-auto py-8 px-4 sm:px-8">
      <div className="max-w-[1340px] mx-auto">
        <div className="flex flex-col items-center gap-6">
          <div className="flex justify-between items-center w-full">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center">
              Admin: Diplomatik Lugʻat
            </h1>
            <Button
              variant="contained"
              color="success"
              size="medium"
              onClick={handleCreate}
              className="px-4 py-2 bg-green-600 text-white rounded"
            >
              Yangi termin yaratish
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-4 w-full max-w-2xl">
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Terminlarni qidirish..."
              className="flex-1 text-gray-800"
              disabled={loading}
              trigger={triggerSearch}
            />
          </div>

          <div className="w-full max-w-2xl text-sm text-gray-600 flex justify-between mb-4">
            <span>{totalTerms} termin koʻrsatilmoqda</span>
          </div>

          <div className="w-full">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <LoadingSpinner size="lg" />
                <p className="mt-4 text-gray-500">Lugʻat yuklanmoqda...</p>
              </div>
            ) : (
              <>
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
                        <div className="flex flex-wrap gap-4 px-2 sm:px-4">
                          {groupedTerms[letter].map((term) => (
                            <div
                              key={term.id}
                              className="relative group transition cursor-pointer"
                              onClick={() => handleTermClick(term.id)}
                            >
                              <TermCard term={term} />
                              <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition">
                                <button
                                  className="px-2 py-1 bg-blue-600 text-white rounded text-xs"
                                  onClick={async (e) => {
                                    e.stopPropagation();
                                    await handleEdit(term.id);
                                  }}
                                >
                                  Tahrirlash
                                </button>
                                <button
                                  className="px-2 py-1 bg-red-600 text-white rounded text-xs"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(term.id);
                                  }}
                                >
                                  Oʻchirish
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                )}
                <Dialog
                  open={createMode || !!editTerm}
                  fullWidth={true}
                  maxWidth={"lg"}
                  onClose={closeModals}
                  sx={{
                    color: "#fff",
                    zIndex: (theme) => theme.zIndex.tooltip + 1,
                  }}
                >
                  <DialogTitle>
                    {createMode
                      ? "Yangi termin yaratish"
                      : "Atamani tahrirlash"}
                  </DialogTitle>
                  <DialogContent>
                    <form
                      onSubmit={handleFormSubmit}
                      className="space-y-4 "
                      id="term-create-form"
                    >
                      <div>
                        <label className="block text-sm font-medium">
                          Termin Nomi
                        </label>
                        <input
                          type="text"
                          value={formData.title}
                          onChange={(e) =>
                            setFormData({ ...formData, title: e.target.value })
                          }
                          className="w-full border rounded px-2 py-1"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium">
                          Taʼrif
                        </label>
                        <EditorComponent
                          value={formData.definition}
                          editable={true}
                          onChange={(content) =>
                            setFormData({ ...formData, definition: content })
                          }
                        />
                        {/* <SimpleEditor 
                          value={formData.definition}
                          onChange={(content) =>
                            setFormData({ ...formData, definition: content })
                          }
                        /> */}
                      </div>
                      <div className="space-y-4">
                        <AsyncTermSelect
                          value={formData.related_terms}
                          onChange={(ids) =>
                            setFormData({ ...formData, related_terms: ids })
                          }
                        />

<SimpleMultiSelect
  label="Categories"
  options={allCategories}
  value={formData.categories}
  onChange={(val) => setFormData({ ...formData, categories: val })}
/>

<SimpleMultiSelect
  label="Countries"
  options={allCountries}
  value={formData.related_countries}
  onChange={(val) => setFormData({ ...formData, related_countries: val })}
/>

<SimpleMultiSelect
  label="Sources"
  options={allSources}
  value={formData.sources}
  onChange={(val) => setFormData({ ...formData, sources: val })}
/>
                      </div>
                      {/* <div>
                        <label className="block text-sm font-medium">
                          Related Terms
                        </label>
                        <select
                          multiple
                          value={formData.related_terms.map(String)}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              related_terms: Array.from(
                                e.target.selectedOptions,
                                (option) => Number(option.value)
                              ),
                            })
                          }
                          className="w-full border rounded px-2 py-1"
                        >
                          {allTerms.map((t) => (
                            <option key={t.id} value={t.id}>
                              {t.title}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium">
                          Categories
                        </label>
                        <select
                          multiple
                          value={formData.categories.map(String)}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              categories: Array.from(
                                e.target.selectedOptions,
                                (option) => Number(option.value)
                              ),
                            })
                          }
                          className="w-full border rounded px-2 py-1"
                        >
                          {allCategories.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium">
                          Related Countries
                        </label>
                        <select
                          multiple
                          value={formData.related_countries.map(String)}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              related_countries: Array.from(
                                e.target.selectedOptions,
                                (option) => Number(option.value)
                              ),
                            })
                          }
                          className="w-full border rounded px-2 py-1"
                        >
                          {allCountries.map((country) => (
                            <option key={country.id} value={country.id}>
                              {country.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium">
                          Sources
                        </label>
                        <select
                          multiple
                          value={formData.sources.map(String)}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              sources: Array.from(
                                e.target.selectedOptions,
                                (option) => Number(option.value)
                              ),
                            })
                          }
                          className="w-full border rounded px-2 py-1"
                        >
                          {allSources.map((source) => (
                            <option key={source.id} value={source.id}>
                              {source.title}
                            </option>
                          ))}
                        </select>
                      </div> */}
                      {modalError && (
                        <div className="text-red-600 text-sm">{modalError}</div>
                      )}
                    </form>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={closeModals}>Bekor qilish</Button>
                    <Button
                      type="submit"
                      disabled={modalLoading}
                      form="term-create-form"
                    >
                      {modalLoading
                        ? "Saqlanmoqda..."
                        : createMode
                        ? "Yaratish"
                        : "Saqlash"}
                    </Button>
                  </DialogActions>
                </Dialog>

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
                      className="px-3 py-1 bg-gray-200 rounded text-gray-800"
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
    </div>
  );
};

const AdminTermsPageWithErrorBoundary: React.FC = () => {
  return (
    <ErrorBoundary>
      <AdminTermsPage />
    </ErrorBoundary>
  );
};

export default AdminTermsPageWithErrorBoundary;
