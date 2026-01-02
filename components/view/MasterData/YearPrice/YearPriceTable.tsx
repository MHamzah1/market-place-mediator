"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { AppDispatch, RootState } from "@/lib/state/store";
import { getAllYearPrices, deleteYearPrice, clearSuccess, clearError } from "@/lib/state/slice/year-price/yearPriceSlice";
import { FiEdit2, FiTrash2, FiPlus } from "react-icons/fi";
import { showAlert } from "@/components/feature/alert/alert";
import { encryptSlug } from "@/lib/slug/slug";
import Swal from "sweetalert2";

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
};

const YearPriceTable = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { data, loading, error, success, totalPages, currentPage } = useSelector(
    (state: RootState) => state.yearPrice
  );

  const [page, setPage] = useState(1);

  const fetchData = useCallback(
    (pageNum: number = 1) => {
      dispatch(getAllYearPrices({ page: pageNum, perPage: 20 }));
    },
    [dispatch]
  );

  useEffect(() => {
    fetchData(page);
  }, [fetchData, page]);

  useEffect(() => {
    if (success) {
      showAlert({ icon: "success", title: "Berhasil", text: "Operasi berhasil dilakukan" });
      dispatch(clearSuccess());
      fetchData(page);
    }
    if (error) {
      showAlert({ icon: "error", title: "Error", text: error });
      dispatch(clearError());
    }
  }, [success, error, dispatch, fetchData, page]);

  const handleEdit = (id: string) => {
    const encryptedSlug = encryptSlug(id);
    router.push(`/MasterData/YearPrice/Edit/${encryptedSlug}`);
  };

  const handleDelete = async (id: string, year: number) => {
    const result = await Swal.fire({
      title: "Hapus Year Price?",
      text: `Apakah Anda yakin ingin menghapus harga tahun ${year}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      dispatch(deleteYearPrice(id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Year Price</h1>
          <p className="text-slate-500 dark:text-slate-400">Kelola harga dasar per variant per tahun</p>
        </div>
        <button
          onClick={() => router.push("/MasterData/YearPrice/Add")}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all shadow-lg"
        >
          <FiPlus className="w-5 h-5" />
          Tambah Year Price
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">Variant</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">Model</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">Tahun</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">Harga Dasar</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((yp) => (
                    <tr key={yp.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="py-3 px-4">
                        <span className="font-medium">{(yp as any).variant?.variantName || "-"}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-slate-600 dark:text-slate-400">
                          {(yp as any).variant?.model?.brand?.name} {(yp as any).variant?.model?.modelName}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-mono bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">{yp.year}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-green-600 dark:text-green-400">
                          {formatCurrency(Number(yp.basePrice))}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          yp.isActive
                            ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                            : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                        }`}>
                          {yp.isActive ? "Aktif" : "Nonaktif"}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEdit(yp.id)}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors dark:hover:bg-blue-900"
                          >
                            <FiEdit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(yp.id, yp.year)}
                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors dark:hover:bg-red-900"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-6">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`px-3 py-1 rounded-lg ${
                      page === pageNum
                        ? "bg-cyan-500 text-white"
                        : "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700"
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default YearPriceTable;
