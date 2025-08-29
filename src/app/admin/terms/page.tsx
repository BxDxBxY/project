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
  TermSummary,
  Category,
  Country,
  Source,
  CreateTermData,
  TermDetailEdit,
} from "@/types";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import EditorComponent from "@/components/dictionary/EditorComponent";
import AsyncTermSelect from "@/components/dictionary/AsyncTermSelect";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

// Custom debounce function with cancel method
const debounce = <T extends (...args: any[]) => void>(
  func: T,
  wait: number
) => {
  let timeout: NodeJS.Timeout | null = null;

  const debounced = (...args: Parameters<T>) => {
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      func(...args);
      timeout = null;
    }, wait);
  };

  debounced.cancel = () => {
    if (timeout !== null) {
      clearTimeout(timeout);
      timeout = null;
    }
  };

  return debounced as T & { cancel: () => void };
};

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
  const [viewMode, setViewMode] = useState(false);
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

  // Debounced setFormData function
  const debouncedSetFormData = useMemo(
    () =>
      debounce((newFormData: CreateTermData) => {
        setFormData(newFormData);
      }, 500),
    []
  );

  // Clean up debounce on component unmount
  useEffect(() => {
    return () => {
      debouncedSetFormData.cancel();
    };
  }, [debouncedSetFormData]);

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

  const handleTermClick = async (id: number) => {
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
      setViewMode(true); // 👈 open in view mode
      setCreateMode(false);
      setModalError(null);
    } catch (err) {
      setModalError("Failed to fetch term details");
    }
  };

  const handleEdit = async (id: number) => {
    try {
      const termDetail = await fetchTermEdit(id);
      setViewMode(false);
      setEditTerm(termDetail);
      setFormData({
        title: termDetail.title,
        definition: termDetail.definition,
        categories: termDetail.categories || [],
        related_terms: termDetail.related_terms || [],
        related_countries: termDetail.related_countries || [],
        sources: termDetail.sources || [],
      });
      console.log(termDetail.related_terms, "123");
      setCreateMode(false);
      setModalError(null);
    } catch (err) {
      setModalError("Failed to fetch term details");
    }
  };

  const handleCreate = () => {
    setCreateMode(true);
    setViewMode(false);
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
                        <div className="grid grid-cols-4  px-2 sm:px-4">
                          {groupedTerms[letter].map((term) => (
                            <Box
                              key={term.id}
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                cursor: "pointer",
                                // backgroundColor: "#fff",
                                borderRadius: "4px",
                                overflow: "hidden",
                                "&:hover .actions": { opacity: 1 },
                              }}
                              onClick={() => handleTermClick(term.id)}
                            >
                              <Box sx={{ flexGrow: 1, padding: "8px" }}>
                                <TermCard adminPanel={true} term={term} />
                              </Box>
                              <Box
                                className="actions"
                                sx={{
                                  width: "60px",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyItems: "left",
                                  opacity: 0,
                                  transition: "opacity 0.2s",
                                  backgroundColor: "inherit",
                                }}
                              >
                                <IconButton
                                  size="small"
                                  sx={{
                                    flex: 1,
                                    color: "#1976d2",
                                    "&:hover": { backgroundColor: "#e0e0e0" },
                                  }}
                                  onClick={async (e) => {
                                    e.stopPropagation();
                                    await handleEdit(term.id);
                                  }}
                                  title="Tahrirlash"
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                                <IconButton
                                  size="small"
                                  sx={{
                                    flex: 1,
                                    color: "#d32f2f",
                                    "&:hover": { backgroundColor: "#e0e0e0" },
                                  }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(term.id);
                                  }}
                                  title="Oʻchirish"
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Box>
                            </Box>
                          ))}
                        </div>
                      </div>
                    )
                )}
                <Dialog
                  open={createMode || createMode || !!editTerm}
                  fullWidth={true}
                  maxWidth={"lg"}
                  onClose={closeModals}
                  sx={{
                    color: "#fff",
                    // zIndex: (theme) => theme.zIndex.tooltip + 1,
                  }}
                >
                  <DialogTitle>
                    {createMode
                      ? "Yangi termin yaratish"
                      : viewMode
                      ? "Atama tafsilotlari" // 👈 different title for view
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
                          disabled={viewMode}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium">
                          Taʼrif
                        </label>
                        <EditorComponent
                          value={formData.definition}
                          editable={!viewMode}
                          disabled={viewMode}
                          onChange={(content) =>
                            debouncedSetFormData({
                              ...formData,
                              definition: content,
                            })
                          }
                        />
                        {/* <SimpleEditor 
                          // value={formData.definition}
                          // onChange={(content) =>
                          //   setFormData({ ...formData, definition: content })
                          // }
                        /> */}
                      </div>
                      <div className="space-y-4">
                        <AsyncTermSelect
                          value={formData.related_terms} // Array of selected term IDs
                          onChange={(ids) =>
                            setFormData({ ...formData, related_terms: ids })
                          }
                          disabled={viewMode}
                        />

                        {/* <SimpleMultiSelect
                          label="Categories"
                          options={allCategories}
                          value={formData.categories}
                          onChange={(val) =>
                            setFormData({ ...formData, categories: val })
                          }
                        />

                        <SimpleMultiSelect
                          label="Countries"
                          options={allCountries}
                          value={formData.related_countries}
                          onChange={(val) =>
                            setFormData({ ...formData, related_countries: val })
                          }
                        />

                        <SimpleMultiSelect
                          label="Sources"
                          options={allSources}
                          value={formData.sources}
                          onChange={(val) =>
                            setFormData({ ...formData, sources: val })
                          }
                        /> */}
                      </div>
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
                      className={`${viewMode ? "!hidden" : "flex"}`}
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
