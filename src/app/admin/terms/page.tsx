"use client";
import React, { useState, useEffect, useMemo } from "react";
// import { useRouter } from "next/navigation";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { SearchBar } from "@/components/dictionary/SearchBar";
import { useDictionary } from "@/hooks/useDictionary";
import { logger } from "@/lib/utils";
import { Modal } from "@/components/ui/Modal";
import {
  createTerm,
  updateTerm,
  deleteTerm,
  // fetchTerms,
  fetchTermEdit,
  fetchAdminTerms,
} from "@/lib/termsApi";
// import { fetchCategories } from "@/lib/categoriesApi";
// import { fetchCountries } from "@/lib/countriesApi";
// import { fetchSources } from "@/lib/sourcesApi";
import {
  TermSummary,
  // Category,
  // Country,
  // Source,
  CreateTermData,
  TermDetailEdit,
} from "@/types";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fab,
  IconButton,
  Snackbar,
  Zoom,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  TableFooter,
  TablePaginationActions,
} from "@mui/material";
import EditorComponent from "@/components/dictionary/EditorComponent";
import AsyncTermSelect from "@/components/dictionary/AsyncTermSelect";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";

// Custom debounce function with cancel method
const debounce = <T extends (...args: any[]) => void>(
  func: T,
  wait: number,
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
  // const router = useRouter();
  const [editTerm, setEditTerm] = useState<TermDetailEdit | null>(null);
  const [createMode, setCreateMode] = useState(false);
  const [viewMode, setViewMode] = useState(false);
  const [deleteTermId, setDeleteTermId] = useState<number | null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [allTerms, setAllTerms] = useState<TermSummary[]>([]);
  // const [allCategories, setAllCategories] = useState<Category[]>([]);
  // const [allCountries, setAllCountries] = useState<Country[]>([]);
  // const [allSources, setAllSources] = useState<Source[]>([]);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [successMsg, setSuccessMsg] = useState<string>(
    "Muvaffaqiyatli bajarildi!",
  );
  const [formData, setFormData] = useState<CreateTermData>({
    title: "",
    definition: "",
    categories: [],
    related_terms: [],
    related_countries: [],
    sources: [],
  });
  // pagination states
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);
  const handleChangeRowsPerPage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  // Debounced setFormData function
  const debouncedSetFormData = useMemo(
    () =>
      debounce((newFormData: CreateTermData) => {
        setFormData(newFormData);
      }, 500),
    [],
  );

  // Clean up debounce on component unmount
  useEffect(() => {
    return () => {
      debouncedSetFormData.cancel();
    };
  }, [debouncedSetFormData]);

  const fetchOptions = async () => {
    try {
      const [termsData] = await Promise.all([fetchAdminTerms()]);
      setAllTerms(termsData);
      // setAllCategories(categoriesData);
      // setAllCountries(countriesData);
      // setAllSources(sourcesData);
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

  const sortedTerms = useMemo(() => {
    const sortedTerms = [...terms].sort((a, b) =>
      a.title.localeCompare(b.title, "uz"),
    );
    const paginatedTerms = sortedTerms.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage,
    );
    return paginatedTerms;
  }, [terms, page, rowsPerPage]);

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
    setDeleteTermId(null);
    setModalError(null);
    setCreateMode(false);
    setEditTerm(null);
    setViewMode(false);

    setFormData({
      title: "",
      definition: "",
      categories: [],
      related_terms: [],
      related_countries: [],
      sources: [],
    });
  };

  const validateFormData = () => {
    const valid = formData.title !== "" && formData.definition !== "";
    return valid;
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateFormData()) return;
    setModalLoading(true);
    setModalError(null);
    try {
      if (createMode) {
        const res = await createTerm(formData);
        if (res) {
          setShowSuccess(true);
          setSuccessMsg("Muvaffaqiyatli yaratildi!");
        }
      } else if (editTerm) {
        const res = await updateTerm(editTerm.id, formData);
        if (res) {
          setShowSuccess(true);
          setSuccessMsg("Muvaffaqiyatli o'zgartirildi!");
        }
      }
      await refreshData();
      closeModals();
    } catch (err: any) {
      setModalError(
        err.details?.title?.[0] || err.message || "Failed to save term",
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
      setShowSuccess(true);
      setSuccessMsg("Muvaffaqiyatli o'chirildi!");
    } catch (err: any) {
      setModalError(err.message || "Failed to delete term");
    } finally {
      setModalLoading(false);
    }
  };

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-200 px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="max-w-sm sm:max-w-md w-full bg-white rounded-xl shadow-lg p-6 sm:p-8 text-center">
          <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4 sm:mb-6">
            <svg
              className="w-6 h-6 sm:w-7 sm:h-7 text-red-600"
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
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3 tracking-tight">
            Xatolik yuz berdi
          </h1>
          <p className="text-sm sm:text-base text-gray-500 mb-4 sm:mb-6">
            {error}
          </p>
          <button
            onClick={handleRefresh}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm sm:text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Qayta urinish
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center gap-6 sm:gap-6">
          <div className="flex flex-col sm:flex-row justify-between items-center w-full gap-2">
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 text-center tracking-tight">
              Admin: Diplomatik Lugʻat
            </h1>
            <Button
              variant="contained"
              color="success"
              size="medium"
              onClick={handleCreate}
              className="!px-4 !py-2 !bg-green-600 !text-white !rounded-lg !text-sm sm:!text-base !font-medium hover:!bg-green-700"
            >
              Yangi termin yaratish
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-2 sm:mb-2 w-full max-w-xl sm:max-w-2xl">
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Terminlarni qidirish..."
              className="flex-1 text-gray-800 text-sm sm:text-base rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={loading}
              trigger={triggerSearch}
            />
          </div>

          <div className="w-full max-w-3xl text-sm sm:text-base text-gray-600 flex justify-between mb-2 sm:mb-6">
            <span>{totalTerms} termin koʻrsatilmoqda</span>
          </div>

          <div className="w-full">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 sm:py-16">
                <LoadingSpinner size="lg" />
                <p className="mt-4 text-sm sm:text-base text-gray-500">
                  Lugʻat yuklanmoqda...
                </p>
              </div>
            ) : (
              <>
                <TableContainer
                  component={Paper}
                  className="shadow-lg rounded-xl overflow-hidden"
                >
                  <Table>
                    <TableHead>
                      <TableRow className="bg-gray-100 !flex  !justify-between ">
                        <TableCell className="font-bold text-gray-900 px-4 py-3 text-sm sm:text-base">
                          Termin Nomi
                        </TableCell>
                        <TableCell className="font-bold text-gray-900 px-4 py-3 w-[140px] !text-center text-sm sm:text-base">
                          Amallar
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {sortedTerms.map((term) => (
                        <TableRow
                          key={term.id}
                          className="hover:bg-blue-50 transition-colors border-b border-gray-200 !flex  !justify-between"
                        >
                          <TableCell className="px-4 py-3 text-sm sm:text-base text-gray-900">
                            {term.title}
                          </TableCell>
                          <TableCell className="px-4 py-3">
                            <Box className="flex gap-2">
                              <IconButton
                                size="small"
                                className="text-blue-600 hover:text-blue-800"
                                onClick={() => handleTermClick(term.id)}
                                title="Ko'rish"
                              >
                                <VisibilityIcon fontSize="small" />
                              </IconButton>
                              <IconButton
                                size="small"
                                className="text-green-600 hover:text-green-800"
                                onClick={() => handleEdit(term.id)}
                                title="Tahrirlash"
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                              <IconButton
                                size="small"
                                className="text-red-600 hover:text-red-800"
                                onClick={() => handleDelete(term.id)}
                                title="O'chirish"
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                    <TableFooter>
                      <TableRow>
                        <TablePagination
                          rowsPerPageOptions={[
                            5,
                            10,
                            25,
                            50,
                            { label: "All", value: -1 },
                          ]}
                          colSpan={4}
                          count={allTerms.length}
                          rowsPerPage={rowsPerPage}
                          page={page}
                          slotProps={{
                            select: {
                              inputProps: {
                                "aria-label": "rows per page",
                              },
                              native: true,
                            },
                          }}
                          onPageChange={handleChangePage}
                          onRowsPerPageChange={handleChangeRowsPerPage}
                          ActionsComponent={TablePaginationActions}
                          showLastButton={true}
                          showFirstButton={true}
                        />
                      </TableRow>
                    </TableFooter>
                  </Table>
                </TableContainer>

                <Dialog
                  open={createMode || viewMode || !!editTerm}
                  fullWidth={true}
                  maxWidth="lg"
                  onClose={closeModals}
                  // sx={{
                  //   "& .MuiDialog-paper": {
                  //     padding: { xs: "16px", sm: "24px" },
                  //     borderRadius: "12px",
                  //   },
                  // }}
                >
                  <DialogTitle
                    sx={{
                      fontSize: { xs: "1rem", sm: "1.25rem", md: "1.5rem" },
                      fontWeight: 600,
                    }}
                  >
                    {createMode
                      ? "Yangi termin yaratish"
                      : viewMode
                        ? "Atama tafsilotlari"
                        : "Atamani tahrirlash"}
                  </DialogTitle>
                  <DialogContent>
                    <form
                      onSubmit={handleFormSubmit}
                      className="space-y-4 sm:space-y-6"
                      id="term-create-form"
                    >
                      <div>
                        <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
                          Termin Nomi
                        </label>
                        <input
                          type="text"
                          value={formData.title}
                          onChange={(e) =>
                            setFormData({ ...formData, title: e.target.value })
                          }
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                          required
                          disabled={viewMode}
                        />
                      </div>
                      <div>
                        <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
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
                      </div>
                      <div className="space-y-4 sm:space-y-6">
                        <AsyncTermSelect
                          value={formData.related_terms}
                          onChange={(ids) =>
                            setFormData({ ...formData, related_terms: ids })
                          }
                          disabled={viewMode}
                        />
                      </div>
                      {modalError && (
                        <div className="text-red-600 text-sm sm:text-base">
                          {modalError}
                        </div>
                      )}
                    </form>
                  </DialogContent>
                  <DialogActions>
                    <Button
                      onClick={closeModals}
                      className="!text-sm sm:!text-base !text-gray-700 !rounded-lg"
                    >
                      Bekor qilish
                    </Button>
                    <Button
                      type="submit"
                      disabled={modalLoading}
                      form="term-create-form"
                      className={`!text-sm sm:!text-base !text-white !bg-blue-600 !rounded-lg !px-4 !py-2 !font-medium hover:!bg-blue-700 ${
                        viewMode ? "!hidden" : "!flex"
                      }`}
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
                  // sx={{
                  //   display: "flex",
                  //   alignItems: "center",
                  //   justifyContent: "center",
                  // }}
                >
                  <div className="bg-white rounded-xl p-6 sm:p-8 max-w-sm sm:max-w-md w-full">
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
                      Atamani oʻchirish
                    </h2>
                    <div className="text-sm sm:text-base text-gray-700 mb-4 sm:mb-6">
                      Ushbu atamani oʻchirishga ishonchingiz komilmi?
                    </div>
                    {modalError && (
                      <div className="text-red-600 text-sm sm:text-base mb-4">
                        {modalError}
                      </div>
                    )}
                    <div className="flex justify-end gap-2 sm:gap-3">
                      <button
                        type="button"
                        onClick={closeModals}
                        className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-200 rounded-lg text-gray-800 text-sm sm:text-base"
                      >
                        Bekor qilish
                      </button>
                      <button
                        type="button"
                        onClick={handleDeleteConfirm}
                        className="px-3 sm:px-4 py-1.5 sm:py-2 bg-red-600 text-white rounded-lg text-sm sm:text-base font-medium hover:bg-red-700"
                        disabled={modalLoading}
                      >
                        {modalLoading ? "Oʻchirilmoqda..." : "Oʻchirish"}
                      </button>
                    </div>
                  </div>
                </Modal>
              </>
            )}
          </div>
          {/* Scroll to Top Button */}
          <Zoom in={showScrollTop}>
            <Fab
              color="primary"
              aria-label="scroll to top"
              onClick={scrollToTop}
              className="!fixed !bottom-6 !right-6 !bg-blue-600 !text-white hover:!bg-blue-700 !shadow-lg"
              sx={{ width: 48, height: 48 }}
            >
              <ArrowUpwardIcon />
            </Fab>
          </Zoom>
          {/* Success Snackbar */}
          <Snackbar
            open={showSuccess}
            autoHideDuration={6000}
            onClose={() => setShowSuccess(false)}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <Alert
              onClose={() => setShowSuccess(false)}
              severity="success"
              sx={{ width: "100%", fontSize: { xs: "0.875rem", sm: "1rem" } }}
            >
              {successMsg || "Muvaffaqiyatli Bajarildi!"}
            </Alert>
          </Snackbar>
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
