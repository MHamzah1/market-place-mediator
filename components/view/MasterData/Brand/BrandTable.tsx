/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "@/components/ui/button";
import { Edit, Trash2, Eye, Plus } from "lucide-react";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { AppDispatch, RootState } from "@/lib/state/store";
import DataTable, { Column } from "@/components/feature/table/data-table";
import {
  Brand,
  clearError,
  clearSuccess,
  deleteBrand,
  getBrandsForTable,
} from "@/lib/state/slice/brand/brandSlice";
import TableSearch from "@/components/feature/table/table-search";
import { useTheme } from "@/context/ThemeContext";

export default function BrandTable() {
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading, error, totalItems, totalPages, currentPage, success } =
    useSelector((state: RootState) => state.brand);

  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  // Filter states
  const [filters, setFilters] = useState({
    search: "",
    page: 1,
    perPage: 10,
    orderBy: "name",
    sortDirection: "DESC" as "ASC" | "DESC",
    isActive: null as boolean | null,
    startDate: "",
    endDate: "",
    periode: "",
  });

  const loadBrands = () => {
    const params: any = {
      page: filters.page,
      perPage: filters.perPage,
      orderBy: filters.orderBy,
      sortDirection: filters.sortDirection,
    };

    if (filters.search) {
      params.search = filters.search;
    }

    if (filters.isActive !== null) {
      params.isActive = filters.isActive;
    }

    if (filters.startDate) {
      params.startDate = filters.startDate;
    }

    if (filters.endDate) {
      params.endDate = filters.endDate;
    }

    if (filters.periode) {
      params.periode = filters.periode;
    }

    dispatch(getBrandsForTable(params));
  };

  // Load data on mount and filter changes
  useEffect(() => {
    loadBrands();
  }, []);

  // Handle success/error messages
  useEffect(() => {
    if (success) {
      toast.success("Operasi berhasil!");
      dispatch(clearSuccess());
      loadBrands();
    }
  }, [success]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error]);

  const handleSearch = () => {
    setFilters((prev) => ({ ...prev, page: 1 }));
    setTimeout(loadBrands, 0);
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
    setTimeout(loadBrands, 0);
  };

  const handleSort = (field: string) => {
    setFilters((prev) => ({
      ...prev,
      orderBy: field,
      sortDirection:
        prev.orderBy === field && prev.sortDirection === "ASC" ? "DESC" : "ASC",
      page: 1,
    }));
    setTimeout(loadBrands, 0);
  };

  const handleReset = () => {
    setFilters({
      search: "",
      page: 1,
      perPage: 10,
      orderBy: "name",
      sortDirection: "DESC",
      isActive: null,
      startDate: "",
      endDate: "",
      periode: "",
    });
    setTimeout(loadBrands, 0);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus brand ini?")) {
      try {
        await dispatch(deleteBrand(id)).unwrap();
        toast.success("Brand berhasil dihapus");
      } catch (error) {
        toast.error("Gagal menghapus brand");
      }
    }
  };

  const handleView = (brand: Brand) => {
    console.log("View brand:", brand);
    // Navigate to detail page or open modal
  };

  const handleEdit = (brand: Brand) => {
    console.log("Edit brand:", brand);
    // Navigate to edit page or open modal
  };

  const handleCreate = () => {
    console.log("Create new brand");
    // Navigate to create page or open modal
  };

  // Table columns definition
  const columns: Column<Brand>[] = [
    {
      key: "name",
      header: "Nama Brand",
      sortable: true,
      render: (brand) => (
        <div className="flex items-center gap-4">
          {brand.logo ? (
            <img
              src={brand.logo}
              alt={brand.name}
              className="w-16 h-16 rounded-xl object-cover group-hover:scale-110 transition-transform"
            />
          ) : (
            <div
              className={`w-16 h-16 rounded-xl flex items-center justify-center text-2xl transition-transform group-hover:scale-110 ${
                isDarkMode
                  ? "bg-gradient-to-br from-slate-700 to-slate-800"
                  : "bg-gradient-to-br from-slate-100 to-slate-200"
              }`}
            >
              {brand.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <p
              className={`font-bold mb-1 ${
                isDarkMode ? "text-white" : "text-slate-900"
              }`}
            >
              {brand.name}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "description",
      header: "Deskripsi",
      render: (brand) => (
        <p
          className={`max-w-xs truncate ${
            isDarkMode ? "text-slate-400" : "text-gray-600"
          }`}
        >
          {brand.description}
        </p>
      ),
    },
    {
      key: "isActive",
      header: "Status",
      sortable: true,
      render: (brand) => (
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
            brand.isActive
              ? "bg-green-500/20 text-green-400 border border-green-500/30"
              : "bg-orange-500/20 text-orange-400 border border-orange-500/30"
          }`}
        >
          {brand.isActive ? "Aktif" : "Tidak Aktif"}
        </span>
      ),
    },
    {
      key: "createdAt",
      header: "Tanggal Dibuat",
      sortable: true,
      render: (brand) => (
        <span
          className={`text-sm ${
            isDarkMode ? "text-slate-300" : "text-gray-600"
          }`}
        >
          {format(new Date(brand.createdAt), "dd MMM yyyy")}
        </span>
      ),
    },
    {
      key: "updatedAt",
      header: "Terakhir Diupdate",
      sortable: true,
      render: (brand) => (
        <span
          className={`text-sm ${
            isDarkMode ? "text-slate-300" : "text-gray-600"
          }`}
        >
          {format(new Date(brand.updatedAt), "dd MMM yyyy")}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2">
            Data Brand
          </h1>
          <p
            className={`text-lg ${
              isDarkMode ? "text-slate-400" : "text-slate-600"
            }`}
          >
            Kelola semua brand yang tersedia
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 rounded-xl font-semibold flex items-center gap-2 transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/50 text-white"
        >
          <Plus className="text-xl" />
          Tambah Brand
        </button>
      </div>

      {/* Search & Filters */}
      <TableSearch
        searchValue={filters.search}
        onSearchChange={(value) =>
          setFilters((prev) => ({ ...prev, search: value }))
        }
        searchPlaceholder="Cari nama brand..."
        // Date Range
        showDateRange
        startDate={filters.startDate}
        endDate={filters.endDate}
        onStartDateChange={(date) =>
          setFilters((prev) => ({ ...prev, startDate: date }))
        }
        onEndDateChange={(date) =>
          setFilters((prev) => ({ ...prev, endDate: date }))
        }
        // Period
        showPeriod
        period={filters.periode}
        onPeriodChange={(periode: string) =>
          setFilters((prev) => ({ ...prev, periode }))
        }
        // Order By
        showOrderBy
        orderBy={filters.orderBy}
        onOrderByChange={(field: string) =>
          setFilters((prev) => ({ ...prev, orderBy: field }))
        }
        orderByOptions={[
          { value: "name", label: "Nama" },
          { value: "createdAt", label: "Tanggal Dibuat" },
          { value: "updatedAt", label: "Tanggal Update" },
        ]}
        // Sort Direction
        showSortDirection
        sortDirection={filters.sortDirection}
        onSortDirectionChange={(direction) =>
          setFilters((prev) => ({ ...prev, sortDirection: direction }))
        }
        // Active Filter
        showActiveFilter
        isActive={filters.isActive}
        onIsActiveChange={(isActive) =>
          setFilters((prev) => ({ ...prev, isActive }))
        }
        // Actions
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
        actions={(brand) => (
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleView(brand)}
              className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 transition-colors"
              title="Lihat Detail"
            >
              <Eye size={18} />
            </button>
            <button
              onClick={() => handleEdit(brand)}
              className="p-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors"
              title="Edit"
            >
              <Edit size={18} />
            </button>
            <button
              onClick={() => handleDelete(brand.id)}
              className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
              title="Hapus"
            >
              <Trash2 size={18} />
            </button>
          </div>
        )}
      />
    </div>
  );
}
