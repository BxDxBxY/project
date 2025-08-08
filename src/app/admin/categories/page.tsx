"use client";
import React, { useEffect, useState } from 'react';
import { fetchCategories, createCategory, updateCategory, deleteCategory } from '@/lib/api';
import { Category } from '@/types';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Modal } from '@/components/ui/Modal';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editCategory, setEditCategory] = useState<Category | null>(null);
  const [deleteCategoryId, setDeleteCategoryId] = useState<number | null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

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
      setError(err.message || 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (category: Category) => setEditCategory(category);
  const handleDelete = (id: number) => setDeleteCategoryId(id);
  const closeModals = () => {
    setEditCategory(null);
    setDeleteCategoryId(null);
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
      setModalError(err.message || 'Failed to update category');
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
      setModalError(err.message || 'Failed to delete category');
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Manage Categories</h1>
      {loading ? (
        <LoadingSpinner size="lg" />
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : (
        <div className="space-y-4">
          {categories.map(category => (
            <div key={category.id} className="p-4 bg-white rounded shadow flex items-center justify-between">
              <div className="font-semibold">{category.name}</div>
              <div className="flex space-x-2">
                <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded" onClick={() => handleEdit(category)}>Edit</button>
                <button className="px-3 py-1 bg-red-100 text-red-700 rounded" onClick={() => handleDelete(category.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Edit Modal */}
      <Modal open={!!editCategory} onClose={closeModals} title="Edit Category">
        {editCategory && (
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Name</label>
              <input
                type="text"
                value={editCategory.name}
                onChange={e => setEditCategory({ ...editCategory, name: e.target.value })}
                className="w-full border rounded px-2 py-1"
                required
              />
            </div>
            {modalError && <div className="text-red-600 text-sm">{modalError}</div>}
            <div className="flex justify-end gap-2">
              <button type="button" onClick={closeModals} className="px-3 py-1 bg-gray-200 rounded">Cancel</button>
              <button type="submit" className="px-3 py-1 bg-blue-600 text-white rounded" disabled={modalLoading}>
                {modalLoading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </form>
        )}
      </Modal>
      {/* Delete Modal */}
      <Modal open={!!deleteCategoryId} onClose={closeModals} title="Delete Category">
        <div className="mb-4">Are you sure you want to delete this category?</div>
        {modalError && <div className="text-red-600 text-sm mb-2">{modalError}</div>}
        <div className="flex justify-end gap-2">
          <button type="button" onClick={closeModals} className="px-3 py-1 bg-gray-200 rounded">Cancel</button>
          <button type="button" onClick={handleDeleteConfirm} className="px-3 py-1 bg-red-600 text-white rounded" disabled={modalLoading}>
            {modalLoading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </Modal>
    </div>
  );
}