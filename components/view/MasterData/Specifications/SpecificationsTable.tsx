/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { Edit, Trash2, Eye, Plus, Settings, Car } from "lucide-react";
import { format } from "date-fns";
import { AppDispatch, RootState } from "@/lib/state/store";
import DataTable, { Column } from "@/components/feature/table/data-table";
import TableSearch from "@/components/feature/table/table-search";
import { useTheme } from "@/context/ThemeContext";
import {
  Specification,
  clearError,
  clearSuccess,
  deleteSpecification,
  getSpecificationsForTable,
} from "@/lib/state/slice/Specifications/SpecificationsSlice";
import Alert from "@/components/feature/alert/alert";
import { generateEditUrl } from "@/lib/slug/slug";
import ModalDetailSpecification from "./ModalDetailSpecifications";

// Spec Category Options
const SPEC_CATEGORIES = [
  { value: "", label: "Semua Kategori" },
  { value: "engine", label: "Engine" },
  { value: "transmission", label: "Transmission" },
  { value: "fuel", label: "Fuel" },
  { value: "dimension", label: "Dimension" },
  { value: "performance", label: "Performance" },
  { value: "safety", label: "Safety" },
  { value: "comfort", label: "Comfort" },
  { value: "exterior", label: "Exterior" },
  { value: "interior", label: "Interior" },
  { value: "other", label: "Other" },
];

// Get category badge style
const getCategoryBadge = (category: string, isDarkMode: boolean) => {
  const styles: Record<string, string> = {
    engine: "bg-red-500/20 text-red-400 border border-red-500/30",
    transmission:
      "bg-purple-500/20 text-purple-400 border border-purple-500/30",
    fuel: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
    dimension: "bg-blue-500/20 text-blue-400 border border-blue-500/30",
    performance: "bg-orange-500/20 text-orange-400 border border-orange-500/30",
    safety: "bg-green-500/20 text-green-400 border border-green-500/30",
    comfort: "bg-pink-500/20 text-pink-400 border border-pink-500/30",
    exterior: "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30",
    interior: "bg-teal-500/20 text-teal-400 border border-teal-500/30",
  };
  return (
    styles[category] ||
    (isDarkMode
      ? "bg-slate-500/20 text-slate-400 border border-slate-500/30"
      : "bg-slate-200 text-slate-600 border border-slate-300")
  );
};

export default function SpecificationsTable() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { data, loading, error, totalItems, totalPages, currentPage, success } =
    useSelector((state: RootState) => state.Specifications);

  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  // Filter states
  const [filters, setFilters] = useState({
    search: "",
    page: 1,
    perPage: 10,
    sortBy: "createdAt",
    sortDirection: "DESC" as "ASC" | "DESC",
    modelId: "",
    specCategory: "",
  });

  // Modal state
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedSpecId, setSelectedSpecId] = useState<string | null>(null);

  const loadSpecifications = () => {
    const params: any = {
      page: filters.page,
      perPage: filters.perPage,
      sortBy: filters.sortBy,
      sortDirection: filters.sortDirection,
    };

    if (filters.search) params.search = filters.search;
    if (filters.modelId) params.modelId = filters.modelId;
    if (filters.specCategory) params.specCategory = filters.specCategory;

    dispatch(getSpecificationsForTable(params));
  };

  useEffect(() => {
    loadSpecifications();
  }, []);

  useEffect(() => {
    if (success) {
      Alert.toast.success("Operasi berhasil!");
      dispatch(clearSuccess());
      loadSpecifications();
    }
  }, [success]);

  useEffect(() => {
    if (error) {
      Alert.toast.error(error);
      dispatch(clearError());
    }
  }, [error]);

  const handleSearch = () => {
    setFilters((prev) => ({ ...prev, page: 1 }));
    setTimeout(loadSpecifications, 0);
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
    setTimeout(loadSpecifications, 0);
  };

  const handleSort = (field: string) => {
    setFilters((prev) => ({
      ...prev,
      sortBy: field,
      sortDirection:
        prev.sortBy === field && prev.sortDirection === "ASC" ? "DESC" : "ASC",
      page: 1,
    }));
    setTimeout(loadSpecifications, 0);
  };

  const handleReset = () => {
    setFilters({
      search: "",
      page: 1,
      perPage: 10,
      sortBy: "createdAt",
      sortDirection: "DESC",
      modelId: "",
      specCategory: "",
    });
    setTimeout(loadSpecifications, 0);
  };

  // ============================================
  // CRUD Handlers
  // ============================================

  const handleDelete = async (spec: Specification) => {
    const confirmed = await Alert.confirmDelete({
      title: "Hapus Specification?",
      itemName: spec?.specName || "Specification",
    });

    if (confirmed) {
      try {
        Alert.loading("Menghapus specification...");
        await dispatch(deleteSpecification(spec.id)).unwrap();
        Alert.closeLoading();
        await Alert.success("Berhasil!", "Specification berhasil dihapus");
      } catch (err: any) {
        Alert.closeLoading();
        await Alert.error(
          "Gagal!",
          err?.message || "Gagal menghapus specification"
        );
      }
    }
  };

  // Open Modal Detail
  const handleView = (spec: Specification) => {
    setSelectedSpecId(spec.id);
    setIsDetailModalOpen(true);
  };

  // Close Modal Detail
  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedSpecId(null);
  };

  // Navigate to Edit page with encrypted slug
  const handleEdit = (spec: Specification) => {
    const editUrl = generateEditUrl("/MasterData/Specification/Edit", spec.id);
    router.push(editUrl);
  };

  // Navigate to Add page
  const handleCreate = () => {
    router.push("/MasterData/Specification/Add");
  };

  const handleExport = async () => {
    const exportFormat = await Alert.inputSelect(
      "Export Data",
      {
        csv: "CSV",
        excel: "Excel",
        pdf: "PDF",
      },
      "Pilih format..."
    );

    if (exportFormat) {
      Alert.loading(`Mengexport ke ${exportFormat.toUpperCase()}...`);

      setTimeout(() => {
        Alert.closeLoading();
        Alert.success(
          "Berhasil!",
          `Data berhasil diexport ke ${exportFormat.toUpperCase()}`
        );
      }, 1500);
    }
  };

  // ============================================
  // Helper Functions
  // ============================================

  const getStatusBadge = (isActive: boolean) => {
    return isActive
      ? "bg-green-500/20 text-green-400 border border-green-500/30"
      : "bg-orange-500/20 text-orange-400 border border-orange-500/30";
  };

  // ============================================
  // Table Columns
  // ============================================

  const columns: Column<Specification>[] = [
    {
      key: "specName",
      header: "Spesifikasi",
      sortable: true,
      render: (spec) => (
        <div className="flex items-center gap-4">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${
              isDarkMode
                ? "bg-gradient-to-br from-cyan-600 to-blue-700"
                : "bg-gradient-to-br from-cyan-400 to-blue-500"
            } text-white`}
          >
            <Settings size={20} />
          </div>
          <div>
            <p
              className={`font-bold mb-0.5 ${
                isDarkMode ? "text-white" : "text-slate-900"
              }`}
            >
              {spec?.specName || "-"}
            </p>
            <p
              className={`text-sm ${
                isDarkMode ? "text-slate-400" : "text-gray-500"
              }`}
            >
              {spec?.description || "-"}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "modelName",
      header: "Model Mobil",
      render: (spec) => (
        <div className="flex items-center gap-2">
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              isDarkMode
                ? "bg-slate-700 text-slate-300"
                : "bg-slate-200 text-slate-700"
            }`}
          >
            <Car size={16} />
          </div>
          <span
            className={`font-medium ${
              isDarkMode ? "text-slate-300" : "text-slate-700"
            }`}
          >
            {spec?.modelName || "-"}
          </span>
        </div>
      ),
    },
    {
      key: "specCategory",
      header: "Kategori",
      sortable: true,
      render: (spec) => (
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold capitalize ${getCategoryBadge(
            spec?.specCategory || "",
            isDarkMode
          )}`}
        >
          {spec?.specCategory || "-"}
        </span>
      ),
    },
    {
      key: "specValue",
      header: "Nilai",
      render: (spec) => (
        <div>
          <span
            className={`font-semibold ${
              isDarkMode ? "text-cyan-400" : "text-cyan-600"
            }`}
          >
            {spec?.specValue || "-"}
          </span>
          {spec?.specUnit && (
            <span
              className={`ml-1 text-sm ${
                isDarkMode ? "text-slate-400" : "text-slate-500"
              }`}
            >
              {spec.specUnit}
            </span>
          )}
        </div>
      ),
    },
    {
      key: "isActive",
      header: "Status",
      sortable: true,
      render: (spec) => (
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${getStatusBadge(
            spec?.isActive ?? false
          )}`}
        >
          {spec?.isActive ? "Aktif" : "Tidak Aktif"}
        </span>
      ),
    },
    {
      key: "createdAt",
      header: "Tanggal Dibuat",
      sortable: true,
      render: (spec) => (
        <span
          className={`text-sm ${
            isDarkMode ? "text-slate-300" : "text-gray-600"
          }`}
        >
          {spec?.createdAt
            ? format(new Date(spec.createdAt), "dd MMM yyyy")
            : "-"}
        </span>
      ),
    },
  ];

  // ============================================
  // Render
  // ============================================

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-4xl font-black tracking-tight bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2">
              Data Specifications
            </h1>
            <p
              className={`text-lg ${
                isDarkMode ? "text-slate-400" : "text-slate-600"
              }`}
            >
              Kelola spesifikasi mobil yang tersedia
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleExport}
              className={`px-4 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all duration-200 ${
                isDarkMode
                  ? "bg-slate-700 text-slate-300 hover:bg-slate-600"
                  : "bg-slate-200 text-slate-700 hover:bg-slate-300"
              }`}
            >
              Export
            </button>
            <button
              onClick={handleCreate}
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 rounded-xl font-semibold flex items-center gap-2 transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/50 text-white"
            >
              <Plus className="text-xl" />
              Tambah Specification
            </button>
          </div>
        </div>

        {/* Search & Filters */}
        <TableSearch
          searchValue={filters.search}
          onSearchChange={(value) =>
            setFilters((prev) => ({ ...prev, search: value }))
          }
          searchPlaceholder="Cari nama spesifikasi atau nilai..."
          showOrderBy
          orderBy={filters.sortBy}
          onOrderByChange={(field) =>
            setFilters((prev) => ({ ...prev, sortBy: field }))
          }
          orderByOptions={[
            { value: "specName", label: "Nama Spesifikasi" },
            { value: "specCategory", label: "Kategori" },
            { value: "specValue", label: "Nilai" },
            { value: "createdAt", label: "Tanggal Dibuat" },
            { value: "updatedAt", label: "Tanggal Update" },
          ]}
          showSortDirection
          sortDirection={filters.sortDirection}
          onSortDirectionChange={(direction) =>
            setFilters((prev) => ({ ...prev, sortDirection: direction }))
          }
          // Custom category filter
          additionalFilters={
            <div className="flex flex-col gap-1">
              <label
                className={`text-xs font-medium ${
                  isDarkMode ? "text-slate-400" : "text-slate-600"
                }`}
              >
                Kategori
              </label>
              <select
                value={filters.specCategory}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    specCategory: e.target.value,
                  }))
                }
                className={`px-3 py-2 rounded-lg text-sm border transition-all ${
                  isDarkMode
                    ? "bg-slate-800 border-slate-700 text-white"
                    : "bg-white border-slate-300 text-slate-900"
                } focus:outline-none focus:ring-2 focus:ring-cyan-500/50`}
              >
                {SPEC_CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
          }
          onSearch={handleSearch}
          onReset={handleReset}
        />

        {/* Table */}
        <DataTable
          data={data}
          columns={columns}
          loading={loading}
          error={error}
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          pageSize={filters.perPage}
          onPageChange={handlePageChange}
          orderBy={filters.sortBy}
          sortDirection={filters.sortDirection}
          onSort={handleSort}
          actions={(spec) => (
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleView(spec)}
                className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 transition-colors"
                title="Lihat Detail"
              >
                <Eye size={18} />
              </button>
              <button
                onClick={() => handleEdit(spec)}
                className="p-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors"
                title="Edit"
              >
                <Edit size={18} />
              </button>
              <button
                onClick={() => handleDelete(spec)}
                className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                title="Hapus"
              >
                <Trash2 size={18} />
              </button>
            </div>
          )}
        />
      </div>

      {/* Modal Detail Specification */}
      <ModalDetailSpecification
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetailModal}
        specificationId={selectedSpecId}
        onEdit={handleEdit}
      />
    </>
  );
}
