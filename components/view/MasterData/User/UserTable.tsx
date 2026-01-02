"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { AppDispatch, RootState } from "@/lib/state/store";
import {
  getAllUsers,
  deleteUsers,
  clearSuccess,
  clearError,
} from "@/lib/state/slice/user/userSlice";
import { Users } from "@/lib/state/slice/user/userSlice";
import { FiEdit2, FiTrash2, FiPlus, FiEye } from "react-icons/fi";
import { showAlert } from "@/components/feature/alert/alert";
import { encryptSlug } from "@/lib/slug/slug";
import Swal from "sweetalert2";
import DataTable, { Column } from "@/components/feature/table/data-table";

const UserTable = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { data, loading, error, success, totalPages, totalItems, currentPage } =
    useSelector((state: RootState) => state.Users);

  const [searchQuery, setSearchQuery] = useState("");

  const fetchData = useCallback(
    (page: number = 1, search: string = "") => {
      dispatch(getAllUsers({ page, perPage: 10, search }));
    },
    [dispatch]
  );

  useEffect(() => {
    fetchData(1, searchQuery);
  }, [fetchData, searchQuery]);

  useEffect(() => {
    if (success) {
      showAlert({
        icon: "success",
        title: "Berhasil",
        text: "Operasi berhasil dilakukan",
      });
      dispatch(clearSuccess());
      fetchData(currentPage, searchQuery);
    }
    if (error) {
      showAlert({ icon: "error", title: "Error", text: error });
      dispatch(clearError());
    }
  }, [success, error, dispatch, fetchData, currentPage, searchQuery]);

  const handleEdit = (id: string) => {
    const encryptedSlug = encryptSlug(id);
    router.push(`/MasterData/User/Edit/${encryptedSlug}`);
  };

  const handleDelete = async (id: string, name: string) => {
    const result = await Swal.fire({
      title: "Hapus User?",
      text: `Apakah Anda yakin ingin menghapus user "${name}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      dispatch(deleteUsers(id));
    }
  };

  const getInitials = (name: string | null | undefined) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role?.toLowerCase()) {
      case "admin":
        return "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300";
      case "customer":
        return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300";
      case "salesman":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300";
      default:
        return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
    }
  };

  const columns: Column<Users>[] = [
    {
      key: "name",
      header: "User",
      render: (item: Users) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-semibold text-sm">
            {getInitials(item.name)}
          </div>
          <div>
            <p className="font-semibold text-slate-900 dark:text-white">
              {item.name || "-"}
            </p>
            <p className="text-xs text-slate-500">{item.email || "-"}</p>
          </div>
        </div>
      ),
    },
    {
      key: "phone",
      header: "No. Telepon",
      render: (item: Users) => (
        <div>
          <p className="font-medium">{item.phone || "-"}</p>
          {item.whatsapp && (
            <p className="text-xs text-green-600">WA: {item.whatsapp}</p>
          )}
        </div>
      ),
    },
    {
      key: "location",
      header: "Lokasi",
      render: (item: Users) => (
        <span className="text-slate-600 dark:text-slate-400">
          {item.location || "-"}
        </span>
      ),
    },
    {
      key: "role",
      header: "Role",
      render: (item: Users) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(
            item.role ?? ""
          )}`}
        >
          {item.role || "-"}
        </span>
      ),
    },
    {
      key: "createdAt",
      header: "Tanggal Dibuat",
      render: (item: Users) => (
        <span className="text-sm text-slate-600 dark:text-slate-400">
          {item.createdAt
            ? new Date(item.createdAt).toLocaleDateString("id-ID", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
            : "-"}
        </span>
      ),
    },
  ];

  const renderActions = (item: Users) => (
    <div className="flex items-center gap-2">
      <button
        onClick={() => handleEdit(String(item.id))}
        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors dark:hover:bg-blue-900"
        title="Edit"
      >
        <FiEdit2 className="w-4 h-4" />
      </button>
      <button
        onClick={() => handleDelete(String(item.id), item.name || "User")}
        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors dark:hover:bg-red-900"
        title="Hapus"
      >
        <FiTrash2 className="w-4 h-4" />
      </button>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Data Users
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Kelola semua pengguna yang terdaftar
          </p>
        </div>
        <button
          onClick={() => router.push("/MasterData/User/Add")}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all shadow-lg"
        >
          <FiPlus className="w-5 h-5" />
          Tambah User
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-6">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Cari user..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full max-w-md px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:bg-slate-800 dark:text-white"
          />
        </div>

        <DataTable
          columns={columns}
          data={data}
          loading={loading}
          error={error}
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems || data.length}
          pageSize={10}
          onPageChange={(page) => fetchData(page, searchQuery)}
          actions={renderActions}
          emptyMessage="Tidak ada data user"
        />
      </div>
    </div>
  );
};

export default UserTable;
