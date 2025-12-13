/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-const */
import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Loader2,
} from "lucide-react";

export interface Column<T> {
  key: string;
  header: string;
  sortable?: boolean;
  render?: (item: T, index: number) => ReactNode;
  className?: string;
  headerClassName?: string;
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  error?: string | null;

  // Pagination
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize?: number;
  onPageChange: (page: number) => void;

  // Sorting
  orderBy?: string;
  sortDirection?: "ASC" | "DESC";
  onSort?: (field: string) => void;

  // Styling
  className?: string;
  emptyMessage?: string;

  // Actions
  actions?: (item: T, index: number) => ReactNode;
}

export default function DataTable<T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  error = null,
  currentPage,
  totalPages,
  totalItems,
  pageSize = 10,
  onPageChange,
  orderBy,
  sortDirection,
  onSort,
  className,
  emptyMessage = "Tidak ada data tersedia",
  actions,
}: DataTableProps<T>) {
  const getSortIcon = (columnKey: string) => {
    if (orderBy !== columnKey) {
      return <ArrowUpDown size={16} className="text-gray-400" />;
    }
    return sortDirection === "ASC" ? (
      <ArrowUp size={16} className="text-blue-600" />
    ) : (
      <ArrowDown size={16} className="text-blue-600" />
    );
  };

  const handleSort = (columnKey: string) => {
    if (onSort) {
      onSort(columnKey);
    }
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisible = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);

    if (endPage - startPage < maxVisible - 1) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          disabled={loading}
          className={cn(
            "min-w-[40px] h-10 px-3 text-sm font-medium rounded-lg transition-colors",
            "focus:outline-none focus:ring-2 focus:ring-blue-500",
            i === currentPage
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300",
            loading && "opacity-50 cursor-not-allowed"
          )}
        >
          {i}
        </button>
      );
    }

    return buttons;
  };

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className={cn("w-full", className)}>
      {/* Table Container */}
      <div className="relative bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {columns.map((column, index) => (
                  <th
                    key={column.key}
                    className={cn(
                      "px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider",
                      column.headerClassName
                    )}
                  >
                    {column.sortable && onSort ? (
                      <button
                        onClick={() => handleSort(column.key)}
                        disabled={loading}
                        className="flex items-center gap-2 hover:text-blue-600 transition-colors disabled:cursor-not-allowed"
                      >
                        {column.header}
                        {getSortIcon(column.key)}
                      </button>
                    ) : (
                      column.header
                    )}
                  </th>
                ))}
                {actions && (
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Aksi
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {loading ? (
                <tr>
                  <td
                    colSpan={columns.length + (actions ? 1 : 0)}
                    className="px-6 py-12 text-center"
                  >
                    <div className="flex flex-col items-center justify-center gap-3">
                      <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                      <p className="text-sm text-gray-500">Memuat data...</p>
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td
                    colSpan={columns.length + (actions ? 1 : 0)}
                    className="px-6 py-12 text-center"
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <p className="text-sm text-red-600">{error}</p>
                    </div>
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length + (actions ? 1 : 0)}
                    className="px-6 py-12 text-center"
                  >
                    <p className="text-sm text-gray-500">{emptyMessage}</p>
                  </td>
                </tr>
              ) : (
                data.map((item, rowIndex) => (
                  <tr
                    key={rowIndex}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    {columns.map((column) => (
                      <td
                        key={column.key}
                        className={cn(
                          "px-6 py-4 text-sm text-gray-900",
                          column.className
                        )}
                      >
                        {column.render
                          ? column.render(item, rowIndex)
                          : item[column.key]}
                      </td>
                    ))}
                    {actions && (
                      <td className="px-6 py-4 text-sm">
                        {actions(item, rowIndex)}
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && !error && data.length > 0 && (
          <div className="bg-white border-t border-gray-200 px-6 py-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Info */}
              <div className="text-sm text-gray-700">
                Menampilkan <span className="font-medium">{startItem}</span> -{" "}
                <span className="font-medium">{endItem}</span> dari{" "}
                <span className="font-medium">{totalItems}</span> data
              </div>

              {/* Pagination Controls */}
              <div className="flex items-center gap-2">
                {/* First Page */}
                <button
                  onClick={() => onPageChange(1)}
                  disabled={currentPage === 1 || loading}
                  className={cn(
                    "p-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 transition-colors",
                    "focus:outline-none focus:ring-2 focus:ring-blue-500",
                    "disabled:opacity-50 disabled:cursor-not-allowed"
                  )}
                  title="Halaman pertama"
                >
                  <ChevronsLeft size={18} />
                </button>

                {/* Previous Page */}
                <button
                  onClick={() => onPageChange(currentPage - 1)}
                  disabled={currentPage === 1 || loading}
                  className={cn(
                    "p-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 transition-colors",
                    "focus:outline-none focus:ring-2 focus:ring-blue-500",
                    "disabled:opacity-50 disabled:cursor-not-allowed"
                  )}
                  title="Halaman sebelumnya"
                >
                  <ChevronLeft size={18} />
                </button>

                {/* Page Numbers */}
                <div className="hidden sm:flex items-center gap-2">
                  {renderPaginationButtons()}
                </div>

                {/* Mobile: Current Page Info */}
                <div className="sm:hidden px-4 py-2 text-sm font-medium text-gray-700">
                  {currentPage} / {totalPages}
                </div>

                {/* Next Page */}
                <button
                  onClick={() => onPageChange(currentPage + 1)}
                  disabled={currentPage === totalPages || loading}
                  className={cn(
                    "p-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 transition-colors",
                    "focus:outline-none focus:ring-2 focus:ring-blue-500",
                    "disabled:opacity-50 disabled:cursor-not-allowed"
                  )}
                  title="Halaman selanjutnya"
                >
                  <ChevronRight size={18} />
                </button>

                {/* Last Page */}
                <button
                  onClick={() => onPageChange(totalPages)}
                  disabled={currentPage === totalPages || loading}
                  className={cn(
                    "p-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 transition-colors",
                    "focus:outline-none focus:ring-2 focus:ring-blue-500",
                    "disabled:opacity-50 disabled:cursor-not-allowed"
                  )}
                  title="Halaman terakhir"
                >
                  <ChevronsRight size={18} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
