/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { Edit, Trash2, Eye, Plus } from "lucide-react";
import { format } from "date-fns";
import { AppDispatch, RootState } from "@/lib/state/store";
import DataTable, { Column } from "@/components/feature/table/data-table";
import TableSearch from "@/components/feature/table/table-search";
import { useTheme } from "@/context/ThemeContext";
import {
  Users,
  clearError,
  clearSuccess,
  deleteUsers,
  getUsersForTable,
} from "@/lib/state/slice/user/userSlice";
import Alert from "@/components/feature/alert/alert";
import { generateEditUrl } from "@/lib/slug/slug";
import ModalDetailUser from "./ModalDetailUser";

export default function UsersTable() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { data, loading, error, totalItems, totalPages, currentPage, success } =
    useSelector((state: RootState) => state.Users);

  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  // Filter states
  const [filters, setFilters] = useState({
    search: "",
    page: 1,
    perPage: 10,
    orderBy: "createdAt",
    sortDirection: "DESC" as "ASC" | "DESC",
    role: "",
    startDate: "",
    endDate: "",
  });

  // Modal state
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | number | null>(
    null
  );

  const loadUsers = () => {
    const params: any = {
      page: filters.page,
      perPage: filters.perPage,
      orderBy: filters.orderBy,
      sortDirection: filters.sortDirection,
    };

    if (filters.search) params.search = filters.search;
    if (filters.role) params.role = filters.role;
    if (filters.startDate) params.startDate = filters.startDate;
    if (filters.endDate) params.endDate = filters.endDate;

    dispatch(getUsersForTable(params));
  };

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    if (success) {
      Alert.toast.success("Operasi berhasil!");
      dispatch(clearSuccess());
      loadUsers();
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
    setTimeout(loadUsers, 0);
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
    setTimeout(loadUsers, 0);
  };

  const handleSort = (field: string) => {
    setFilters((prev) => ({
      ...prev,
      orderBy: field,
      sortDirection:
        prev.orderBy === field && prev.sortDirection === "ASC" ? "DESC" : "ASC",
      page: 1,
    }));
    setTimeout(loadUsers, 0);
  };

  const handleReset = () => {
    setFilters({
      search: "",
      page: 1,
      perPage: 10,
      orderBy: "createdAt",
      sortDirection: "DESC",
      role: "",
      startDate: "",
      endDate: "",
    });
    setTimeout(loadUsers, 0);
  };

  // ============================================
  // CRUD Handlers
  // ============================================

  const handleDelete = async (user: Users) => {
    const confirmed = await Alert.confirmDelete({
      title: "Hapus User?",
      itemName: user.fullName || user.email,
    });

    if (confirmed) {
      try {
        Alert.loading("Menghapus user...");
        await dispatch(deleteUsers(String(user.id))).unwrap();
        Alert.closeLoading();
        await Alert.success("Berhasil!", "User berhasil dihapus");
      } catch (err: any) {
        Alert.closeLoading();
        await Alert.error("Gagal!", err?.message || "Gagal menghapus user");
      }
    }
  };

  // Open Modal Detail
  const handleView = (user: Users) => {
    setSelectedUserId(user.id);
    setIsDetailModalOpen(true);
  };

  // Close Modal Detail
  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedUserId(null);
  };

  // Navigate to Edit page with encrypted slug
  const handleEdit = (user: Users) => {
    const editUrl = generateEditUrl("/MasterData/User/Edit", user.id);
    router.push(editUrl);
  };

  // Navigate to Add page
  const handleCreate = () => {
    router.push("/MasterData/User/Add");
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

      // Simulasi export
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

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-purple-500/20 text-purple-400 border border-purple-500/30";
      case "salesman":
        return "bg-blue-500/20 text-blue-400 border border-blue-500/30";
      case "customer":
      default:
        return "bg-green-500/20 text-green-400 border border-green-500/30";
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // ============================================
  // Table Columns
  // ============================================

  const columns: Column<Users>[] = [
    {
      key: "fullName",
      header: "User",
      sortable: true,
      render: (user) => (
        <div className="flex items-center gap-4">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold transition-transform group-hover:scale-110 ${
              isDarkMode
                ? "bg-gradient-to-br from-cyan-600 to-blue-700"
                : "bg-gradient-to-br from-cyan-400 to-blue-500"
            } text-white`}
          >
            {getInitials(user.fullName || "U")}
          </div>
          <div>
            <p
              className={`font-bold mb-0.5 ${
                isDarkMode ? "text-white" : "text-slate-900"
              }`}
            >
              {user.fullName || "-"}
            </p>
            <p
              className={`text-sm ${
                isDarkMode ? "text-slate-400" : "text-gray-500"
              }`}
            >
              {user.email || "-"}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "phoneNumber",
      header: "No. Telepon",
      render: (user) => (
        <div>
          <p className={isDarkMode ? "text-slate-300" : "text-gray-700"}>
            {user.phoneNumber || "-"}
          </p>
          {user.whatsappNumber && (
            <p
              className={`text-sm ${
                isDarkMode ? "text-slate-400" : "text-gray-500"
              }`}
            >
              WA: {user.whatsappNumber}
            </p>
          )}
        </div>
      ),
    },
    {
      key: "location",
      header: "Lokasi",
      render: (user) => (
        <p
          className={`max-w-xs truncate ${
            isDarkMode ? "text-slate-400" : "text-gray-600"
          }`}
        >
          {user.location || "-"}
        </p>
      ),
    },
    {
      key: "role",
      header: "Role",
      sortable: true,
      render: (user) => (
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold capitalize ${getRoleBadgeColor(
            user.role || "customer"
          )}`}
        >
          {user.role || "customer"}
        </span>
      ),
    },
    {
      key: "createdAt",
      header: "Tanggal Dibuat",
      sortable: true,
      render: (user) => (
        <span
          className={`text-sm ${
            isDarkMode ? "text-slate-300" : "text-gray-600"
          }`}
        >
          {user.createdAt
            ? format(new Date(user.createdAt), "dd MMM yyyy")
            : "-"}
        </span>
      ),
    },
    {
      key: "updatedAt",
      header: "Terakhir Diupdate",
      sortable: true,
      render: (user) => (
        <span
          className={`text-sm ${
            isDarkMode ? "text-slate-300" : "text-gray-600"
          }`}
        >
          {user.updatedAt
            ? format(new Date(user.updatedAt), "dd MMM yyyy")
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
              Data Users
            </h1>
            <p
              className={`text-lg ${
                isDarkMode ? "text-slate-400" : "text-slate-600"
              }`}
            >
              Kelola semua pengguna yang terdaftar
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
              Tambah User
            </button>
          </div>
        </div>

        {/* Search & Filters */}
        <TableSearch
          searchValue={filters.search}
          onSearchChange={(value) =>
            setFilters((prev) => ({ ...prev, search: value }))
          }
          searchPlaceholder="Cari nama atau email..."
          showDateRange
          startDate={filters.startDate}
          endDate={filters.endDate}
          onStartDateChange={(date) =>
            setFilters((prev) => ({ ...prev, startDate: date }))
          }
          onEndDateChange={(date) =>
            setFilters((prev) => ({ ...prev, endDate: date }))
          }
          showOrderBy
          orderBy={filters.orderBy}
          onOrderByChange={(field: string) =>
            setFilters((prev) => ({ ...prev, orderBy: field }))
          }
          orderByOptions={[
            { value: "fullName", label: "Nama" },
            { value: "email", label: "Email" },
            { value: "role", label: "Role" },
            { value: "createdAt", label: "Tanggal Dibuat" },
            { value: "updatedAt", label: "Tanggal Update" },
          ]}
          showSortDirection
          sortDirection={filters.sortDirection}
          onSortDirectionChange={(direction) =>
            setFilters((prev) => ({ ...prev, sortDirection: direction }))
          }
          showRoleFilter
          role={filters.role}
          onRoleChange={(role) => setFilters((prev) => ({ ...prev, role }))}
          roleOptions={[
            { value: "", label: "Semua Role" },
            { value: "admin", label: "Admin" },
            { value: "salesman", label: "Salesman" },
            { value: "customer", label: "Customer" },
          ]}
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
          actions={(user) => (
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleView(user)}
                className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 transition-colors"
                title="Lihat Detail"
              >
                <Eye size={18} />
              </button>
              <button
                onClick={() => handleEdit(user)}
                className="p-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors"
                title="Edit"
              >
                <Edit size={18} />
              </button>
              <button
                onClick={() => handleDelete(user)}
                className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                title="Hapus"
              >
                <Trash2 size={18} />
              </button>
            </div>
          )}
        />
      </div>

      {/* Modal Detail User */}
      <ModalDetailUser
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetailModal}
        userId={selectedUserId}
        onEdit={handleEdit}
      />
    </>
  );
}
