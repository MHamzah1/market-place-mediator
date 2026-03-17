"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { AppDispatch, RootState } from "@/lib/state/store";
import {
  getAllRoleUsers,
  deleteRoleUser,
  clearRoleManagementError,
  clearRoleManagementSuccess,
} from "@/lib/state/slice/role-management/roleManagementSlice";
import { RoleUser } from "@/lib/state/slice/role-management/roleManagementSlice";
import { FiEdit2, FiTrash2, FiPlus } from "react-icons/fi";
import { showAlert } from "@/components/feature/alert/alert";
import { encryptSlug } from "@/lib/slug/slug";
import Swal from "sweetalert2";

const RoleUserTable = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { roleUsers, loading, error, success } = useSelector(
    (state: RootState) => state.roleManagement,
  );
  const [searchQuery, setSearchQuery] = useState("");

  const fetchData = useCallback(
    (search: string = "") => {
      dispatch(getAllRoleUsers(search ? { search } : undefined));
    },
    [dispatch],
  );

  useEffect(() => {
    fetchData(searchQuery);
  }, [fetchData, searchQuery]);

  useEffect(() => {
    if (success) {
      showAlert({ icon: "success", title: "Berhasil", text: "Operasi berhasil dilakukan" });
      dispatch(clearRoleManagementSuccess());
      fetchData(searchQuery);
    }
    if (error) {
      showAlert({ icon: "error", title: "Error", text: error });
      dispatch(clearRoleManagementError());
    }
  }, [success, error, dispatch, fetchData, searchQuery]);

  const handleEdit = (id: string) => {
    router.push(`/MasterData/RoleUser/Edit/${encryptSlug(id)}`);
  };

  const handleDelete = async (item: RoleUser) => {
    const result = await Swal.fire({
      title: "Hapus Role?",
      text: `Apakah Anda yakin ingin menghapus role "${item.name}"? Pastikan tidak ada jabatan yang terkait.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal",
    });
    if (result.isConfirmed) {
      dispatch(deleteRoleUser(item.id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Kategori Role
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Kelola kategori/departemen role pengguna
          </p>
        </div>
        <button
          onClick={() => router.push("/MasterData/RoleUser/Add")}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all shadow-lg"
        >
          <FiPlus className="w-5 h-5" />
          Tambah Role
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-6">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Cari role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full max-w-md px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:bg-slate-800 dark:text-white"
          />
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
                  <th className="text-left py-3 px-4 font-semibold text-slate-600 dark:text-slate-400">Nama Role</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-600 dark:text-slate-400">Deskripsi</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-600 dark:text-slate-400">Jumlah Jabatan</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-600 dark:text-slate-400">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-600 dark:text-slate-400">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {roleUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-slate-400">
                      Belum ada data role
                    </td>
                  </tr>
                ) : (
                  roleUsers.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                    >
                      <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                        {item.name}
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400 max-w-xs truncate">
                        {item.description || "-"}
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium">
                          {item.positions?.length ?? 0} jabatan
                        </span>
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
                            title="Edit"
                          >
                            <FiEdit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(item)}
                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors dark:hover:bg-red-900"
                            title="Hapus"
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

export default RoleUserTable;
