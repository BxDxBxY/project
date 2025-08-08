"use client";
import React, { useEffect, useState } from "react";
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/lib/api";
import { Category } from "@/types";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@mui/material";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editCategory, setEditCategory] = useState<Category | null>(null);
  const [deleteCategoryId, setDeleteCategoryId] = useState<number | null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  // NEW: add category modal
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchCategories();
      setCategories(data);
    } catch (err: any) {
      setError(err.message || "Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (category: Category) => setEditCategory(category);
  const handleDelete = (id: number) => setDeleteCategoryId(id);
  const closeModals = () => {
    setEditCategory(null);
    setDeleteCategoryId(null);
    setAddModalOpen(false);
    setNewCategoryName("");
    setModalError(null);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editCategory) return;
    setModalLoading(true);
    setModalError(null);
    try {
      await updateCategory(editCategory.id, { name: editCategory.name });
      await loadCategories();
      closeModals();
    } catch (err: any) {
      setModalError(err.message || "Failed to update category");
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteCategoryId) return;
    setModalLoading(true);
    setModalError(null);
    try {
      await deleteCategory(deleteCategoryId);
      await loadCategories();
      closeModals();
    } catch (err: any) {
      setModalError(err.message || "Failed to delete category");
    } finally {
      setModalLoading(false);
    }
  };

  const handleAddCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    setModalLoading(true);
    setModalError(null);
    try {
      await createCategory({ name: newCategoryName });
      await loadCategories();
      closeModals();
    } catch (err: any) {
      setModalError(err.message || "Failed to create category");
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Categories</h1>
        <Button
          onClick={() => setAddModalOpen(true)}
          variant="contained"
          color="success"
          size="medium"
        >
          + Kategoriya qo'shish
        </Button>
      </div>

      {loading ? (
        <LoadingSpinner size="lg" />
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : (
        <div className="space-y-4">
          {categories.map((category) => (
            <div
              key={category.id}
              className="p-4 bg-white rounded shadow flex items-center justify-between"
            >
              <div className="font-semibold">{category.name}</div>
              <div className="flex space-x-2 gap-2">
                <Button
                  variant="outlined"
                  color="info"
                  size="small"
                  onClick={() => handleEdit(category)}
                >
                  O‘zgartirish
                </Button>
                <Button
                  size="small"
                  color="error"
                  variant="contained"
                  onClick={() => handleDelete(category.id)}
                >
                  O‘chirish
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      <Modal open={addModalOpen} onClose={closeModals} title="Add Category">
        <form onSubmit={handleAddCategorySubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
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
              className="px-3 cursor-pointer py-1 bg-gray-200 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1 cursor-pointer bg-green-600 text-white rounded"
              disabled={modalLoading}
            >
              {modalLoading ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal open={!!editCategory} onClose={closeModals} title="Edit Category">
        {editCategory && (
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Name</label>
              <input
                type="text"
                value={editCategory.name}
                onChange={(e) =>
                  setEditCategory({ ...editCategory, name: e.target.value })
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
                className="px-3 cursor-pointer py-1 bg-gray-200 rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-1 cursor-pointer bg-blue-600 text-white rounded"
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
        open={!!deleteCategoryId}
        onClose={closeModals}
        title="Delete Category"
      >
        <div className="mb-4">
          Are you sure you want to delete this category?
        </div>
        {modalError && (
          <div className="text-red-600 text-sm mb-2">{modalError}</div>
        )}
        <div className="flex justify-end gap-2">
          <Button
            size="small"
            color="info"
            variant="outlined"
            type="button"
            onClick={closeModals}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleDeleteConfirm}
            disabled={modalLoading}
            size="small"
            color="error"
            variant="contained"
          >
            {modalLoading ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
