"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { AppDispatch, RootState } from "@/lib/state/store";
import {
  getAllRolePositions,
  getAllRoleUsers,
  deleteRolePosition,
  clearRoleManagementError,
  clearRoleManagementSuccess,
} from "@/lib/state/slice/role-management/roleManagementSlice";
import { RolePosition } from "@/lib/state/slice/role-management/roleManagementSlice";
import { FiEdit2, FiTrash2, FiPlus } from "react-icons/fi";
import { showAlert } from "@/components/feature/alert/alert";
import { encryptSlug } from "@/lib/slug/slug";
import Swal from "sweetalert2";

const RolePositionTable = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { rolePositions, roleUsers, loading, error, success } = useSelector(
    (state: RootState) => state.roleManagement,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRoleUserId, setFilterRoleUserId] = useState("");

  const fetchData = useCallback(() => {
    dispatch(
      getAllRolePositions(
        filterRoleUserId || searchQuery
          ? { roleUserId: filterRoleUserId || undefined, search: searchQuery || undefined }
          : undefined,
      ),
    );
  }, [dispatch, filterRoleUserId, searchQuery]);

  useEffect(() => {
    dispatch(getAllRoleUsers());
  }, [dispatch]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (success) {
      showAlert({ icon: "success", title: "Berhasil", text: "Operasi berhasil dilakukan" });
      dispatch(clearRoleManagementSuccess());
      fetchData();
    }
    if (error) {
      showAlert({ icon: "error", title: "Error", text: error });
      dispatch(clearRoleManagementError());
    }
  }, [success, error, dispatch, fetchData]);

  const handleEdit = (id: string) => {
    router.push(`/MasterData/RolePosition/Edit/${encryptSlug(id)}`);
  };

  const handleDelete = async (item: RolePosition) => {
    const result = await Swal.fire({
      title: "Hapus Jabatan?",
      text: `Apakah Anda yakin ingin menghapus jabatan "${item.name}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal",
    });
    if (result.isConfirmed) {
      dispatch(deleteRolePosition(item.id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Jabatan (Role Position)
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Kelola jabatan dalam setiap kategori role
          </p>
        </div>
        <button
          onClick={() => router.push("/MasterData/RolePosition/Add")}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all shadow-lg"
        >
          <FiPlus className="w-5 h-5" />
          Tambah Jabatan
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-6">
        <div className="flex gap-3 mb-4 flex-wrap">
          <input
            type="text"
            placeholder="Cari jabatan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 min-w-48 px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:bg-slate-800 dark:text-white"
          />
          <select
            value={filterRoleUserId}
            onChange={(e) => setFilterRoleUserId(e.target.value)}
            className="px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:bg-slate-800 dark:text-white"
          >
            <option value="">Semua Role</option>
            {roleUsers.map((ru) => (
              <option key={ru.id} value={ru.id}>
                {ru.name}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-cyan-500" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left py-3 px-4 font-semibold text-slate-600 dark:text-slate-400">Nama Jabatan</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-600 dark:text-slate-400">Kategori Role</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-600 dark:text-slate-400">Deskripsi</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-600 dark:text-slate-400">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-600 dark:text-slate-400">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {rolePositions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-slate-400">
                      Belum ada data jabatan
                    </td>
                  </tr>
                ) : (
                  rolePositions.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                    >
                      <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                        {item.name}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full text-xs font-medium">
                          {item.roleUser?.name ?? "-"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400 max-w-xs truncate">
                        {item.description || "-"}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            item.isActive
                              ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                              : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                          }`}
                        >
                          {item.isActive ? "Aktif" : "Nonaktif"}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEdit(item.id)}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors dark:hover:bg-blue-900"
                          >
                            <FiEdit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(item)}
                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors dark:hover:bg-red-900"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default RolePositionTable;
