"use client";
import React from "react"; // useEffect, useState
// import {
// fetchUsers,
// createUser,
// updateUser,
// deleteUser
// } from '@/lib/api';
// import { User, CreateUserData } from "@/types";
// import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
// import { Modal } from "@/components/ui/Modal";
// import { createUser, deleteUser, fetchUsers, updateUser } from "@/lib/usersApi";

export default function AdminUsersPage() {
  // const [users, setUsers] = useState<User[]>([]);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState<string | null>(null);
  // const [editUser, setEditUser] = useState<User | null>(null);
  // const [deleteUserId, setDeleteUserId] = useState<number | null>(null);
  // const [modalLoading, setModalLoading] = useState(false);
  // const [modalError, setModalError] = useState<string | null>(null);

  // useEffect(() => {
  //   loadUsers();
  // }, []);

  // const loadUsers = async () => {
  //   setLoading(true);
  //   setError(null);
  //   try {
  //     const data = await fetchUsers();
  //     setUsers(data);
  //   } catch (err: any) {
  //     setError(err.message || "Failed to load users");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const handleEdit = (user: User) => setEditUser(user);
  // const handleDelete = (id: number) => setDeleteUserId(id);
  // const closeModals = () => {
  //   setEditUser(null);
  //   setDeleteUserId(null);
  //   setModalError(null);
  // };

  // const handleEditSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (!editUser) return;
  //   setModalLoading(true);
  //   setModalError(null);
  //   try {
  //     await updateUser(editUser.id, {
  //       username: editUser.username,
  //       first_name: editUser.first_name,
  //       last_name: editUser.last_name,
  //       // phone_number: editUser.phone_number, // Add if available in User type
  //       // password: '', // Not handled in modal
  //     });
  //     await loadUsers();
  //     closeModals();
  //   } catch (err: any) {
  //     setModalError(err.message || 'Failed to update user');
  //   } finally {
  //   setModalLoading(false);
  //   }
  // };

  // const handleDeleteConfirm = async () => {
  //   if (!deleteUserId) return;
  //   setModalLoading(true);
  //   setModalError(null);
  //   try {
  //     await deleteUser(deleteUserId);
  //     await loadUsers();
  //     closeModals();
  //   } catch (err: any) {
  //     setModalError(err.message || "Failed to delete user");
  //   } finally {
  //     setModalLoading(false);
  //   }
  // };

  return <>This Page is under development</>;
}
// <div>
//   <h1 className="text-2xl font-bold mb-6">Manage Users</h1>
//   {loading ? (
//     <LoadingSpinner size="lg" />
//   ) : error ? (
//     <div className="text-red-600">{error}</div>
//   ) : (
//     <div className="space-y-4">
//       {users.map(user => (
//         <div key={user.id} className="p-4 bg-white rounded shadow flex items-center justify-between">
//           <div>
//             <div className="font-semibold">{user.username}</div>
//             <div className="text-sm text-gray-500">{user.first_name} {user.last_name}</div>
//           </div>
//           <div className="flex space-x-2">
//             <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded" onClick={() => handleEdit(user)}>Edit</button>
//             <button className="px-3 py-1 bg-red-100 text-red-700 rounded" onClick={() => handleDelete(user.id)}>Delete</button>
//           </div>
//         </div>
//       ))}
//     </div>
//   )}
//   {/* Edit Modal */}
//   <Modal open={!!editUser} onClose={closeModals} title="Edit User">
//     {editUser && (
//       <form onSubmit={handleEditSubmit} className="space-y-4">
//         <div>
//           <label className="block text-sm font-medium">Username</label>
//           <input
//             type="text"
//             value={editUser.username}
//             onChange={e => setEditUser({ ...editUser, username: e.target.value })}
//             className="w-full border rounded px-2 py-1"
//             required
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium">First Name</label>
//           <input
//             type="text"
//             value={editUser.first_name}
//             onChange={e => setEditUser({ ...editUser, first_name: e.target.value })}
//             className="w-full border rounded px-2 py-1"
//             required
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium">Last Name</label>
//           <input
//             type="text"
//             value={editUser.last_name}
//             onChange={e => setEditUser({ ...editUser, last_name: e.target.value })}
//             className="w-full border rounded px-2 py-1"
//             required
//           />
//         </div>
//         {modalError && <div className="text-red-600 text-sm">{modalError}</div>}
//         <div className="flex justify-end gap-2">
//           <button type="button" onClick={closeModals} className="px-3 py-1 bg-gray-200 rounded">Cancel</button>
//           <button type="submit" className="px-3 py-1 bg-blue-600 text-white rounded" disabled={modalLoading}>
//             {modalLoading ? 'Saving...' : 'Save'}
//           </button>
//         </div>
//       </form>
//     )}
//   </Modal>
//   {/* Delete Modal */}
//   <Modal open={!!deleteUserId} onClose={closeModals} title="Delete User">
//     <div className="mb-4">Are you sure you want to delete this user?</div>
//     {modalError && <div className="text-red-600 text-sm mb-2">{modalError}</div>}
//     <div className="flex justify-end gap-2">
//       <button type="button" onClick={closeModals} className="px-3 py-1 bg-gray-200 rounded">Cancel</button>
//       <button type="button" onClick={handleDeleteConfirm} className="px-3 py-1 bg-red-600 text-white rounded" disabled={modalLoading}>
//         {modalLoading ? 'Deleting...' : 'Delete'}
//       </button>
//     </div>
//   </Modal>
// </div>
