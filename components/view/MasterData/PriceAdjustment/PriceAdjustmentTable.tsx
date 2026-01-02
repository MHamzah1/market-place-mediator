"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { AppDispatch, RootState } from "@/lib/state/store";
import { getAllPriceAdjustments, deletePriceAdjustment, clearSuccess, clearError } from "@/lib/state/slice/price-adjustment/priceAdjustmentSlice";
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

const PriceAdjustmentTable = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { data, loading, error, success, totalPages, currentPage } = useSelector(
    (state: RootState) => state.priceAdjustment
  );

  const [page, setPage] = useState(1);

  const fetchData = useCallback(
    (pageNum: number = 1) => {
      dispatch(getAllPriceAdjustments({ page: pageNum, perPage: 20 }));
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
    router.push(`/MasterData/PriceAdjustment/Edit/${encryptedSlug}`);
  };

  const handleDelete = async (id: string, name: string) => {
    const result = await Swal.fire({
      title: "Hapus Price Adjustment?",
      text: `Apakah Anda yakin ingin menghapus "${name}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      dispatch(deletePriceAdjustment(id));
    }
  };

  const getCategoryBadge = (category: string) => {
    const colors: Record<string, string> = {
      transmission: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
      ownership: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
      color: "bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300",
    };
    return colors[category] || "bg-slate-100 text-slate-700";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Price Adjustment</h1>
          <p className="text-slate-500 dark:text-slate-400">Kelola faktor penyesuaian harga per model</p>
        </div>
        <button
          onClick={() => router.push("/MasterData/PriceAdjustment/Add")}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all shadow-lg"
        >
          <FiPlus className="w-5 h-5" />
          Tambah Adjustment
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
                    <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">Model</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">Kategori</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">Kode</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">Nama</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">Adjustment</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">Baseline</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((pa) => (
                    <tr key={pa.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="py-3 px-4">
                        <div>
                          <span className="font-medium">{pa.modelName}</span>
                          <p className="text-xs text-slate-500">{pa.brandName}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryBadge(pa.category)}`}>
                          {pa.category}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          {pa.category === "color" && pa.colorHex && (
                            <div
                              className="w-4 h-4 rounded-full border border-slate-300"
                              style={{ backgroundColor: pa.colorHex }}
                            />
                          )}
                          <span className="font-mono text-sm">{pa.code}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">{pa.name}</td>
                      <td className="py-3 px-4">
                        <span className={`font-semibold ${
                          pa.adjustmentValue > 0 ? "text-green-600" : pa.adjustmentValue < 0 ? "text-red-600" : "text-slate-500"
                        }`}>
                          {pa.adjustmentValue > 0 ? "+" : ""}{formatCurrency(pa.adjustmentValue)}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {pa.isBaseline ? (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                            Baseline
                          </span>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEdit(pa.id)}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors dark:hover:bg-blue-900"
                          >
                            <FiEdit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(pa.id, pa.name)}
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

export default PriceAdjustmentTable;
