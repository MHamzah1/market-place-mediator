/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { Edit, Trash2, Eye, Plus, Car } from "lucide-react";
import { format } from "date-fns";
import { AppDispatch, RootState } from "@/lib/state/store";
import DataTable, { Column } from "@/components/feature/table/data-table";
import TableSearch from "@/components/feature/table/table-search";
import { useTheme } from "@/context/ThemeContext";

import Alert from "@/components/feature/alert/alert";
import { generateEditUrl } from "@/lib/slug/slug";
import {
  getCarModelsForTable,
  clearError,
  clearSuccess,
  CarModels,
  deleteCarModels,
} from "@/lib/state/slice/car-models/CarModelsSlice";
import ModalDetailCarModel from "./ModalDetailCarModels";

// Format currency to Indonesian Rupiah
const formatCurrency = (value: string | number) => {
  const numValue = typeof value === "string" ? parseFloat(value) : value;
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numValue);
};

export default function CarModelsTable() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { data, loading, error, totalItems, totalPages, currentPage, success } =
    useSelector((state: RootState) => state.CarModels);

  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  // Filter states
  const [filters, setFilters] = useState({
    search: "",
    page: 1,
    perPage: 10,
    orderBy: "createdAt",
    sortDirection: "DESC" as "ASC" | "DESC",
    isActive: null as boolean | null,
    startDate: "",
    endDate: "",
    periode: "",
  });

  // Modal state
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedCarModelId, setSelectedCarModelId] = useState<string | null>(
    null
  );

  const loadCarModels = () => {
    const params: any = {
      page: filters.page,
      perPage: filters.perPage,
      orderBy: filters.orderBy,
      sortDirection: filters.sortDirection,
    };

    if (filters.search) params.search = filters.search;
    if (filters.isActive !== null) params.isActive = filters.isActive;
    if (filters.startDate) params.startDate = filters.startDate;
    if (filters.endDate) params.endDate = filters.endDate;
    if (filters.periode) params.periode = filters.periode;

    dispatch(getCarModelsForTable(params));
  };

  useEffect(() => {
    loadCarModels();
  }, []);

  useEffect(() => {
    if (success) {
      Alert.toast.success("Operasi berhasil!");
      dispatch(clearSuccess());
      loadCarModels();
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
    setTimeout(loadCarModels, 0);
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
    setTimeout(loadCarModels, 0);
  };

  const handleSort = (field: string) => {
    setFilters((prev) => ({
      ...prev,
      orderBy: field,
      sortDirection:
        prev.orderBy === field && prev.sortDirection === "ASC" ? "DESC" : "ASC",
      page: 1,
    }));
    setTimeout(loadCarModels, 0);
  };

  const handleReset = () => {
    setFilters({
      search: "",
      page: 1,
      perPage: 10,
      orderBy: "createdAt",
      sortDirection: "DESC",
      isActive: null,
      startDate: "",
      endDate: "",
      periode: "",
    });
    setTimeout(loadCarModels, 0);
  };

  // ============================================
  // CRUD Handlers
  // ============================================

  const handleDelete = async (carModel: CarModels) => {
    const confirmed = await Alert.confirmDelete({
      title: "Hapus Car Model?",
      itemName: carModel?.modelName || "Car Model",
    });

    if (confirmed) {
      try {
        Alert.loading("Menghapus car model...");
        await dispatch(deleteCarModels(carModel.id)).unwrap();
        Alert.closeLoading();
        await Alert.success("Berhasil!", "Car Model berhasil dihapus");
      } catch (err: any) {
        Alert.closeLoading();
        await Alert.error(
          "Gagal!",
          err?.message || "Gagal menghapus car model"
        );
      }
    }
  };

  // Open Modal Detail
  const handleView = (carModel: CarModels) => {
    setSelectedCarModelId(carModel.id);
    setIsDetailModalOpen(true);
  };

  // Close Modal Detail
  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedCarModelId(null);
  };

  // Navigate to Edit page with encrypted slug
  const handleEdit = (carModel: CarModels) => {
    const editUrl = generateEditUrl("/MasterData/CarModel/Edit", carModel.id);
    router.push(editUrl);
  };

  // Navigate to Add page
  const handleCreate = () => {
    router.push("/MasterData/CarModel/Add");
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

  const columns: Column<CarModels>[] = [
    {
      key: "modelName",
      header: "Model Mobil",
      sortable: true,
      render: (carModel) => (
        <div className="flex items-center gap-4">
          {carModel?.imageUrl ? (
            <img
              src={carModel.imageUrl}
              alt={carModel?.modelName || "Car"}
              className="w-16 h-12 rounded-xl object-cover group-hover:scale-110 transition-transform"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          ) : (
            <div
              className={`w-16 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${
                isDarkMode
                  ? "bg-gradient-to-br from-cyan-600 to-blue-700"
                  : "bg-gradient-to-br from-cyan-400 to-blue-500"
              } text-white`}
            >
              <Car size={24} />
            </div>
          )}
          <div>
            <p
              className={`font-bold mb-0.5 ${
                isDarkMode ? "text-white" : "text-slate-900"
              }`}
            >
              {carModel?.modelName || "-"}
            </p>
            <p
              className={`text-sm max-w-xs truncate ${
                isDarkMode ? "text-slate-400" : "text-gray-500"
              }`}
            >
              {carModel?.description || "-"}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "brand",
      header: "Brand",
      render: (carModel) => (
        <div className="flex items-center gap-2">
          {carModel?.brand?.logo ? (
            <img
              src={carModel.brand.logo}
              alt={carModel?.brand?.name || "Brand"}
              className="w-8 h-8 rounded-lg object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          ) : (
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                isDarkMode
                  ? "bg-slate-700 text-slate-300"
                  : "bg-slate-200 text-slate-700"
              }`}
            >
              {carModel?.brand?.name?.charAt(0)?.toUpperCase() || "B"}
            </div>
          )}
          <span
            className={`font-medium ${
              isDarkMode ? "text-slate-300" : "text-slate-700"
            }`}
          >
            {carModel?.brand?.name || "-"}
          </span>
        </div>
      ),
    },
    {
      key: "basePrice",
      header: "Harga Dasar",
      sortable: true,
      render: (carModel) => (
        <span
          className={`font-semibold ${
            isDarkMode ? "text-cyan-400" : "text-cyan-600"
          }`}
        >
          {carModel?.basePrice ? formatCurrency(carModel.basePrice) : "-"}
        </span>
      ),
    },
    {
      key: "isActive",
      header: "Status",
      sortable: true,
      render: (carModel) => (
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${getStatusBadge(
            carModel?.isActive ?? false
          )}`}
        >
          {carModel?.isActive ? "Aktif" : "Tidak Aktif"}
        </span>
      ),
    },
    {
      key: "createdAt",
      header: "Tanggal Dibuat",
      sortable: true,
      render: (carModel) => (
        <span
          className={`text-sm ${
            isDarkMode ? "text-slate-300" : "text-gray-600"
          }`}
        >
          {carModel?.createdAt
            ? format(new Date(carModel.createdAt), "dd MMM yyyy")
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
              Data Car Models
            </h1>
            <p
              className={`text-lg ${
                isDarkMode ? "text-slate-400" : "text-slate-600"
              }`}
            >
              Kelola semua model mobil yang tersedia
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
              Tambah Car Model
            </button>
          </div>
        </div>

        {/* Search & Filters */}
        <TableSearch
          searchValue={filters.search}
          onSearchChange={(value) =>
            setFilters((prev) => ({ ...prev, search: value }))
          }
          searchPlaceholder="Cari nama model atau brand..."
          showDateRange
          startDate={filters.startDate}
          endDate={filters.endDate}
          onStartDateChange={(date) =>
            setFilters((prev) => ({ ...prev, startDate: date }))
          }
          onEndDateChange={(date) =>
            setFilters((prev) => ({ ...prev, endDate: date }))
          }
          showPeriod
          period={filters.periode}
          onPeriodChange={(periode) =>
            setFilters((prev) => ({ ...prev, periode }))
          }
          showOrderBy
          orderBy={filters.orderBy}
          onOrderByChange={(field) =>
            setFilters((prev) => ({ ...prev, orderBy: field }))
          }
          orderByOptions={[
            { value: "modelName", label: "Nama Model" },
            { value: "basePrice", label: "Harga" },
            { value: "createdAt", label: "Tanggal Dibuat" },
            { value: "updatedAt", label: "Tanggal Update" },
          ]}
          showSortDirection
          sortDirection={filters.sortDirection}
          onSortDirectionChange={(direction) =>
            setFilters((prev) => ({ ...prev, sortDirection: direction }))
          }
          showActiveFilter
          isActive={filters.isActive}
          onIsActiveChange={(isActive) =>
            setFilters((prev) => ({ ...prev, isActive }))
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
          orderBy={filters.orderBy}
          sortDirection={filters.sortDirection}
          onSort={handleSort}
          actions={(carModel) => (
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleView(carModel)}
                className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 transition-colors"
                title="Lihat Detail"
              >
                <Eye size={18} />
              </button>
              <button
                onClick={() => handleEdit(carModel)}
                className="p-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors"
                title="Edit"
              >
                <Edit size={18} />
              </button>
              <button
                onClick={() => handleDelete(carModel)}
                className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                title="Hapus"
              >
                <Trash2 size={18} />
              </button>
            </div>
          )}
        />
      </div>

      {/* Modal Detail Car Model */}
      <ModalDetailCarModel
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetailModal}
        carModelId={selectedCarModelId}
        onEdit={handleEdit}
      />
    </>
  );
}
