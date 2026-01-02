"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { AppDispatch, RootState } from "@/lib/state/store";
import {
  getSpecificationsForSelect,
  deleteSpecifications,
  clearSuccess,
  clearError,
} from "@/lib/state/slice/Specifications/SpecificationsSlice";
import { Specifications } from "@/lib/state/slice/Specifications/SpecificationsSlice";
import { FiEdit2, FiTrash2, FiPlus } from "react-icons/fi";
import { showAlert } from "@/components/feature/alert/alert";
import { encryptSlug } from "@/lib/slug/slug";
import Swal from "sweetalert2";
import DataTable, { Column } from "@/components/feature/table/data-table";

const SpecificationsTable = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { data, loading, error, success, totalPages, totalItems, currentPage } =
    useSelector((state: RootState) => state.Specifications);

  const [searchQuery, setSearchQuery] = useState("");

  const fetchData = useCallback(
    (page: number = 1, search: string = "") => {
      dispatch(getSpecificationsForSelect({ page, perPage: 10, search }));
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
    router.push(`/MasterData/Specification/Edit/${encryptedSlug}`);
  };

  const handleDelete = async (id: string, name: string) => {
    const result = await Swal.fire({
      title: "Hapus Specification?",
      text: `Apakah Anda yakin ingin menghapus spesifikasi "${name}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      dispatch(deleteSpecifications(id));
    }
  };

  const getTransmissionBadge = (transmission: string) => {
    switch (transmission?.toLowerCase()) {
      case "automatic":
      case "matic":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300";
      case "manual":
        return "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300";
      case "cvt":
        return "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300";
      default:
        return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
    }
  };

  const getFuelBadge = (fuel: string) => {
    switch (fuel?.toLowerCase()) {
      case "bensin":
      case "petrol":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300";
      case "diesel":
        return "bg-slate-700 text-white dark:bg-slate-600 dark:text-slate-100";
      case "electric":
      case "listrik":
        return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300";
      case "hybrid":
        return "bg-cyan-100 text-cyan-700 dark:bg-cyan-900 dark:text-cyan-300";
      default:
        return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
    }
  };

  const columns: Column<Specifications>[] = [
    {
      key: "specCode",
      header: "Kode",
      render: (item: Specifications) => (
        <span className="font-mono text-sm bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
          {item.specCode || "-"}
        </span>
      ),
    },
    {
      key: "specName",
      header: "Nama Spesifikasi",
      render: (item: Specifications) => (
        <div>
          <p className="font-semibold text-slate-900 dark:text-white">{item.specName}</p>
          <p className="text-xs text-slate-500">{item.modelName || "-"}</p>
        </div>
      ),
    },
    {
      key: "engineCapacity",
      header: "Kapasitas Mesin",
      render: (item: Specifications) => (
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
          {item.engineCapacity ? `${item.engineCapacity} cc` : "-"}
        </span>
      ),
    },
    {
      key: "transmission",
      header: "Transmisi",
      render: (item: Specifications) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTransmissionBadge(item.transmission || "")}`}>
          {item.transmission || "-"}
        </span>
      ),
    },
    {
      key: "fuelType",
      header: "Bahan Bakar",
      render: (item: Specifications) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getFuelBadge(item.fuelType || "")}`}>
          {item.fuelType || "-"}
        </span>
      ),
    },
    {
      key: "isActive",
      header: "Status",
      render: (item: Specifications) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            item.isActive
              ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
              : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
          }`}
        >
          {item.isActive ? "Aktif" : "Nonaktif"}
        </span>
      ),
    },
  ];

  const renderActions = (item: Specifications) => (
    <div className="flex items-center gap-2">
      <button
        onClick={() => handleEdit(item.id)}
        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors dark:hover:bg-blue-900"
        title="Edit"
      >
        <FiEdit2 className="w-4 h-4" />
      </button>
      <button
        onClick={() => handleDelete(item.id, item.specName)}
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
            Data Specification
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Kelola semua spesifikasi mobil yang tersedia
          </p>
        </div>
        <button
          onClick={() => router.push("/MasterData/Specification/Add")}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all shadow-lg"
        >
          <FiPlus className="w-5 h-5" />
          Tambah Specification
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-6">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Cari spesifikasi..."
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
          emptyMessage="Tidak ada data specification"
        />
      </div>
    </div>
  );
};

export default SpecificationsTable;
