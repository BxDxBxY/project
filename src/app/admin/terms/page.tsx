"use client";
import React, { useEffect, useState } from "react";
import {
  fetchTerms,
  createTerm,
  updateTerm,
  deleteTerm,
  fetchCategories,
} from "@/lib/api";
import { Term, CreateTermData, UpdateTermData, Category } from "@/types";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Modal,
  Box,
  Typography,
} from "@mui/material";

export default function AdminTermsPage() {
  const [terms, setTerms] = useState<Term[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal states
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingTerm, setEditingTerm] = useState<Term | null>(null); // For editing
  const [formData, setFormData] = useState<CreateTermData>({
    title: "",
    definition: "",
    category: [],
    related_terms: [],
    photo: null,
  });

  // Categories
  const [categories, setCategories] = useState<Category[]>([]);
  const [deletingTermId, setDeletingTermId] = useState<number | null>(null); // For delete confirmation

  useEffect(() => {
    loadTerms();
    fetchCategoryList();
  }, []);

  // Load terms
  const loadTerms = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchTerms();
      setTerms(data);
    } catch (err: any) {
      setError(err.message || "Failed to load terms");
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories
  const fetchCategoryList = async () => {
    setLoading(true);
    setError(null);
    try {
      const categoryData = await fetchCategories();
      setCategories(categoryData);
    } catch (err: any) {
      setError(err.message || "Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  // Handle create term
  const handleCreateTerm = async () => {
    setLoading(true);
    setError(null);
    try {
      const newTerm = await createTerm(formData);
      setTerms([...terms, newTerm]);
      setShowModal(false);
      resetForm();
    } catch (err: any) {
      setError("Failed to create term");
    } finally {
      setLoading(false);
    }
  };

  // Handle update term
  const handleUpdateTerm = async () => {
    if (!editingTerm) return;
    setLoading(true);
    setError(null);
    try {
      const updatedTerm = await updateTerm(
        editingTerm.id,
        formData as UpdateTermData
      );
      setTerms(
        terms.map((term) => (term.id === editingTerm.id ? updatedTerm : term))
      );
      setShowModal(false);
      resetForm();
    } catch (err: any) {
      setError("Failed to update term");
    } finally {
      setLoading(false);
    }
  };

  // Handle delete term
  const handleDeleteTerm = async () => {
    if (deletingTermId === null) return;
    setLoading(true);
    setError(null);
    try {
      await deleteTerm(deletingTermId);
      setTerms(terms.filter((term) => term.id !== deletingTermId));
      setDeletingTermId(null); // Reset deleting state
    } catch (err: any) {
      setError("Failed to delete term");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      definition: "",
      category: [],
      related_terms: [],
      photo: null,
    });
    setEditingTerm(null);
  };

  const handleOpenModal = (term?: Term) => {
    if (term) {
      setEditingTerm(term);
      setFormData({
        title: term.title,
        definition: term.definition,
        category: Array.from(term.category),
        related_terms: term.related_terms,
        photo: null,
      });
    } else {
      resetForm();
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    resetForm();
    setShowModal(false);
  };

  // Handle delete confirmation
  const handleOpenDeleteModal = (termId: number) => {
    setDeletingTermId(termId);
  };

  const handleCloseDeleteModal = () => {
    setDeletingTermId(null);
  };

  return (
    <div>
      <div className="mb-2 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Terminlarni Boshqarish</h1>
        <Button
          variant="contained"
          color="success"
          size="medium"
          onClick={() => handleOpenModal()}
          className="mb-4 px-4 py-2 bg-green-600 text-white rounded"
        >
          Yangi termin yaratish
        </Button>
      </div>

      {loading ? (
        <LoadingSpinner size="lg" />
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : (
        <div className="space-y-4">
          {terms.map((term) => (
            <div
              key={term.id}
              className="p-4 bg-white rounded shadow flex items-center justify-between"
            >
              <div>
                <div className="font-semibold">{term.title}</div>
                <div className="text-sm text-gray-500">{term.definition}</div>
              </div>
              <div className="flex space-x-2 gap-2">
                <Button
                  size="small"
                  color="info"
                  variant="outlined"
                  onClick={() => handleOpenModal(term)}
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded"
                >
                  O'zgartirish
                </Button>
                <Button
                  size="small"
                  color="error"
                  variant="contained"
                  onClick={() => handleOpenDeleteModal(term.id)}
                >
                  Ochirish
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Term Modal */}
      {showModal && (
        <Modal
          open={showModal}
          className="fixed inset-0 flex items-center justify-center z-50 "
        >
          <div className="bg-white p-6 rounded shadow-lg max-w-lg w-full">
            <h2 className="text-xl font-bold mb-4">
              {editingTerm ? "Edit Term" : "Create New Term"}
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (editingTerm) {
                  handleUpdateTerm();
                } else {
                  handleCreateTerm();
                }
              }}
            >
              <div className="mb-4">
                <label htmlFor="title" className="block">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="definition" className="block">
                  Definition
                </label>
                <textarea
                  id="definition"
                  name="definition"
                  value={formData.definition}
                  onChange={(e) =>
                    setFormData({ ...formData, definition: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 min-h-[50px] max-h-[200px] rounded overflow-y-scroll"
                  required
                />
              </div>
              <div className="mb-4">
                <FormControl fullWidth>
                  <InputLabel id="category-label">Category</InputLabel>
                  <Select
                    labelId="category-label"
                    id="category"
                    value={formData.category}
                    onChange={(e: any) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    label="Category"
                  >
                    {categories.map((category) => (
                      <MenuItem key={category.id} value={category.id}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
              {/* <div className="mb-4">
                <label htmlFor="related_terms" className="block">
                  Related Terms (IDs)
                </label>
                <input
                  type="text"
                  id="related_terms"
                  name="related_terms[]"
                  value={
                    formData.related_terms && formData.related_terms.join(", ")
                  }
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      related_terms: e.target.value
                        .split(",")
                        .map((id) => parseInt(id.trim())),
                    })
                  }
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div> */}
              <div className="mb-4">
                <label htmlFor="photo" className="block">
                  Upload Photo
                </label>
                <input
                  type="file"
                  id="photo"
                  name="photo"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      photo: e.target.files ? e.target.files[0] : null,
                    })
                  }
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  size="small"
                  color="info"
                  variant="outlined"
                  onClick={handleCloseModal}
                  className="px-4 py-2 bg-gray-400 text-white rounded"
                >
                  Cancel
                </Button>
                <Button
                  size="small"
                  color="success"
                  variant="contained"
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  {editingTerm ? "Update Term" : "Create Term"}
                </Button>
              </div>
            </form>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        open={deletingTermId !== null}
        onClose={handleCloseDeleteModal}
        aria-labelledby="delete-modal-title"
        aria-describedby="delete-modal-description"
      >
        <Box className="bg-white p-6 rounded shadow-lg max-w-sm w-full mx-auto mt-20">
          <Typography id="delete-modal-title" variant="h6" component="h2">
            Confirm Deletion
          </Typography>
          <Typography id="delete-modal-description" className="my-4">
            Haqiqatan ham bu shartni oʻchirib tashlamoqchimisiz? Bunday harakat
            bo'lishi mumkin emas bekor qilindi.
          </Typography>
          <div className="flex justify-end gap-2">
            <Button
              variant="outlined"
              onClick={handleCloseDeleteModal}
              color="secondary"
              size="small"
            >
              Bekor qilish
            </Button>
            <Button
              size="small"
              variant="contained"
              onClick={handleDeleteTerm}
              color="error"
            >
              Tasdiqlash
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
