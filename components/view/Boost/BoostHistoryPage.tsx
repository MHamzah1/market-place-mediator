"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState, AppDispatch } from "@/lib/state/store";
import {
  fetchMyTransactions,
  fetchTransactionStatistics,
  cancelTransaction,
  clearSelectedTransaction,
  BoostTransaction,
} from "@/lib/state/slice/boost/boostSlice";
import { useTheme } from "@/context/ThemeContext";
import {
  FiArrowLeft,
  FiZap,
  FiClock,
  FiCheck,
  FiX,
  FiRefreshCw,
  FiEye,
  FiBarChart2,
  FiCalendar,
} from "react-icons/fi";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import BoostStatisticsChart from "./BoostStatisticsChart";
import { encryptSlug } from "@/lib/slug/slug";

const BoostHistoryPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  const {
    transactions,
    transactionsLoading,
    transactionsPagination,
    transactionStatistics,
    statisticsLoading,
    error,
  } = useSelector((state: RootState) => state.boost);

  const [selectedTab, setSelectedTab] = useState<string>("all");
  const [viewingStatistics, setViewingStatistics] = useState<string | null>(
    null,
  );

  useEffect(() => {
    if (!isLoggedIn) {
      toast.error("Silakan login terlebih dahulu");
      router.push("/auth/login");
      return;
    }

    dispatch(fetchMyTransactions({}));

    return () => {
      dispatch(clearSelectedTransaction());
    };
  }, [dispatch, isLoggedIn, router]);

  const handleTabChange = (tab: string) => {
    setSelectedTab(tab);
    const params: any = {};
    if (tab !== "all") {
      params.status = tab;
    }
    dispatch(fetchMyTransactions(params));
  };

  const handleViewStatistics = (transactionId: string) => {
    setViewingStatistics(transactionId);
    dispatch(fetchTransactionStatistics(transactionId));
  };

  const handleCancelTransaction = async (transaction: BoostTransaction) => {
    if (transaction.status !== "pending_payment") {
      toast.error("Hanya transaksi pending yang bisa dibatalkan");
      return;
    }

    const result = await Swal.fire({
      title: "Batalkan Transaksi?",
      text: "Anda yakin ingin membatalkan transaksi boost ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Ya, Batalkan!",
      cancelButtonText: "Tidak",
      background: isDarkMode ? "#1e293b" : "#ffffff",
      color: isDarkMode ? "#f1f5f9" : "#1f2937",
    });

    if (result.isConfirmed) {
      try {
        await dispatch(cancelTransaction(transaction.id)).unwrap();
        toast.success("Transaksi berhasil dibatalkan");
        dispatch(fetchMyTransactions({}));
      } catch (err: any) {
        toast.error(err || "Gagal membatalkan transaksi");
      }
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return {
          color: "bg-green-500",
          text: "Aktif",
          icon: FiZap,
        };
      case "pending_payment":
        return {
          color: "bg-yellow-500",
          text: "Menunggu Bayar",
          icon: FiClock,
        };
      case "expired":
        return {
          color: "bg-gray-500",
          text: "Selesai",
          icon: FiCheck,
        };
      case "cancelled":
        return {
          color: "bg-red-500",
          text: "Dibatalkan",
          icon: FiX,
        };
      case "refunded":
        return {
          color: "bg-purple-500",
          text: "Dikembalikan",
          icon: FiRefreshCw,
        };
      default:
        return {
          color: "bg-gray-500",
          text: status,
          icon: FiClock,
        };
    }
  };

  const tabs = [
    { key: "all", label: "Semua" },
    { key: "active", label: "Aktif" },
    { key: "pending_payment", label: "Pending" },
    { key: "expired", label: "Selesai" },
    { key: "cancelled", label: "Dibatalkan" },
  ];

  return (
    <div
      className={`min-h-screen ${isDarkMode ? "bg-slate-950" : "bg-gray-50"}`}
    >
      {/* Header */}
      <div
        className={`${
          isDarkMode
            ? "bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900"
            : "bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800"
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
          <button
            onClick={() => router.push("/marketplace/my-listings")}
            className="flex items-center gap-1.5 sm:gap-2 text-white/80 hover:text-white transition-all mb-4 sm:mb-6 text-sm sm:text-base"
          >
            <FiArrowLeft className="text-base sm:text-lg" />
            <span className="hidden sm:inline">Kembali ke Listing Saya</span>
            <span className="sm:hidden">Kembali</span>
          </button>

          <div className="flex items-center gap-3 sm:gap-4">
            <div className="p-2.5 sm:p-3 md:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-purple-500 to-pink-600">
              <FiBarChart2 className="text-xl sm:text-2xl md:text-3xl text-white" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
                Riwayat Boost
              </h1>
              <p className="text-xs sm:text-sm md:text-base text-blue-100">
                Kelola dan pantau performa boost listing Anda
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        {/* Statistics Modal/View */}
        {viewingStatistics && transactionStatistics && (
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 sm:mb-4 gap-2">
              <h2
                className={`text-lg sm:text-xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}
              >
                Statistik Performa
              </h2>
              <button
                onClick={() => {
                  setViewingStatistics(null);
                  dispatch(clearSelectedTransaction());
                }}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold ${
                  isDarkMode
                    ? "bg-slate-800 text-slate-300 hover:bg-slate-700"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Tutup
              </button>
            </div>
            <BoostStatisticsChart statistics={transactionStatistics} />
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1.5 sm:gap-2 mb-4 sm:mb-6 md:mb-8 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => handleTabChange(tab.key)}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl font-semibold transition-all whitespace-nowrap text-xs sm:text-sm ${
                selectedTab === tab.key
                  ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white"
                  : isDarkMode
                    ? "bg-slate-800 text-slate-300 hover:bg-slate-700"
                    : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Loading */}
        {transactionsLoading && (
          <div className="flex justify-center items-center py-12 sm:py-16 md:py-20">
            <div className="animate-spin rounded-full h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 border-4 border-cyan-500 border-t-transparent"></div>
          </div>
        )}

        {/* Empty State */}
        {!transactionsLoading && transactions.length === 0 && (
          <div
            className={`text-center py-12 sm:py-16 md:py-20 rounded-xl sm:rounded-2xl ${
              isDarkMode ? "bg-slate-900" : "bg-white"
            } shadow-lg sm:shadow-xl`}
          >
            <FiZap
              className={`text-5xl sm:text-6xl md:text-7xl lg:text-8xl mx-auto mb-3 sm:mb-4 md:mb-6 ${
                isDarkMode ? "text-slate-700" : "text-gray-300"
              }`}
            />
            <h3
              className={`text-lg sm:text-xl md:text-2xl font-bold mb-1 sm:mb-2 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Belum ada transaksi boost
            </h3>
            <p
              className={`text-xs sm:text-sm md:text-base ${isDarkMode ? "text-slate-400" : "text-gray-600"}`}
            >
              Mulai boost listing Anda untuk meningkatkan visibilitas
            </p>
            <button
              onClick={() => router.push("/marketplace/my-listings")}
              className="mt-4 sm:mt-5 md:mt-6 px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-lg sm:rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all text-xs sm:text-sm md:text-base"
            >
              Lihat Listing Saya
            </button>
          </div>
        )}

        {/* Transactions List */}
        {!transactionsLoading && transactions.length > 0 && (
          <div className="space-y-3 sm:space-y-4">
            {transactions.map((transaction) => {
              const statusBadge = getStatusBadge(transaction.status);
              const StatusIcon = statusBadge.icon;

              return (
                <div
                  key={transaction.id}
                  className={`rounded-xl sm:rounded-2xl overflow-hidden ${
                    isDarkMode ? "bg-slate-900" : "bg-white"
                  } shadow-lg sm:shadow-xl`}
                >
                  <div className="p-3 sm:p-4 md:p-6">
                    <div className="flex flex-col md:flex-row md:items-center gap-3 sm:gap-4">
                      {/* Listing Info */}
                      <div className="flex items-center gap-3 sm:gap-4 flex-1">
                        {/* Thumbnail */}
                        <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-lg sm:rounded-xl overflow-hidden flex-shrink-0">
                          {transaction.listing?.images?.[0] ? (
                            <img
                              src={transaction.listing.images[0]}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div
                              className={`w-full h-full flex items-center justify-center ${
                                isDarkMode ? "bg-slate-800" : "bg-gray-100"
                              }`}
                            >
                              <span className="text-xl sm:text-2xl">🚗</span>
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3
                            className={`font-bold text-sm sm:text-base md:text-lg truncate ${
                              isDarkMode ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {transaction.listing?.carModel?.brand?.name}{" "}
                            {transaction.listing?.carModel?.modelName}
                          </h3>
                          <div
                            className={`text-xs sm:text-sm ${
                              isDarkMode ? "text-slate-400" : "text-gray-500"
                            }`}
                          >
                            Paket: {transaction.package?.name || "Custom"}
                          </div>
                          <div
                            className={`text-xs sm:text-sm flex items-center gap-1 sm:gap-2 ${
                              isDarkMode ? "text-slate-400" : "text-gray-500"
                            }`}
                          >
                            <FiCalendar className="text-xs sm:text-sm" />
                            <span className="truncate">
                              {formatDate(transaction.createdAt)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Status & Amount */}
                      <div className="flex items-center justify-between md:justify-end gap-3 sm:gap-4 md:gap-6">
                        <div className="text-left md:text-right">
                          <div
                            className={`text-base sm:text-lg md:text-xl font-bold ${
                              isDarkMode ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {formatPrice(transaction.amount)}
                          </div>
                          <span
                            className={`inline-flex items-center gap-1 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold text-white ${statusBadge.color}`}
                          >
                            <StatusIcon className="text-[10px] sm:text-xs" />
                            {statusBadge.text}
                          </span>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-1.5 sm:gap-2">
                          {(transaction.status === "active" ||
                            transaction.status === "expired") && (
                            <button
                              onClick={() =>
                                handleViewStatistics(transaction.id)
                              }
                              className={`p-1.5 sm:p-2 rounded-lg sm:rounded-xl transition-colors ${
                                isDarkMode
                                  ? "bg-slate-800 text-cyan-400 hover:bg-slate-700"
                                  : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                              }`}
                              title="Lihat Statistik"
                            >
                              <FiBarChart2 className="text-sm sm:text-base" />
                            </button>
                          )}

                          <button
                            onClick={() =>
                              router.push(
                                `/marketplace/${encryptSlug(transaction.listingId)}`,
                              )
                            }
                            className={`p-1.5 sm:p-2 rounded-lg sm:rounded-xl transition-colors ${
                              isDarkMode
                                ? "bg-slate-800 text-slate-300 hover:bg-slate-700"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                            title="Lihat Listing"
                          >
                            <FiEye className="text-sm sm:text-base" />
                          </button>

                          {transaction.status === "pending_payment" && (
                            <button
                              onClick={() =>
                                handleCancelTransaction(transaction)
                              }
                              className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors"
                              title="Batalkan"
                            >
                              <FiX className="text-sm sm:text-base" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Period Info for Active */}
                    {transaction.status === "active" &&
                      transaction.startDate &&
                      transaction.endDate && (
                        <div
                          className={`mt-3 sm:mt-4 p-2 sm:p-3 rounded-lg sm:rounded-xl ${
                            isDarkMode ? "bg-slate-800" : "bg-gray-50"
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs sm:text-sm gap-1 sm:gap-0">
                            <span
                              className={
                                isDarkMode ? "text-slate-400" : "text-gray-500"
                              }
                            >
                              Periode: {formatDate(transaction.startDate)} -{" "}
                              {formatDate(transaction.endDate)}
                            </span>
                            <span
                              className={
                                isDarkMode ? "text-cyan-400" : "text-blue-600"
                              }
                            >
                              {transaction.actualReach} impressions
                            </span>
                          </div>
                          {/* Progress Bar */}
                          <div
                            className={`mt-2 h-1.5 sm:h-2 rounded-full ${
                              isDarkMode ? "bg-slate-700" : "bg-gray-200"
                            }`}
                          >
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-600"
                              style={{
                                width: `${Math.min(
                                  (transaction.actualReach /
                                    transaction.estimatedReachMax) *
                                    100,
                                  100,
                                )}%`,
                              }}
                            />
                          </div>
                        </div>
                      )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {!transactionsLoading && transactionsPagination.totalPages > 1 && (
          <div className="flex justify-center gap-1.5 sm:gap-2 mt-6 sm:mt-8 flex-wrap">
            {Array.from(
              { length: Math.min(transactionsPagination.totalPages, 5) },
              (_, i) => i + 1,
            ).map((page) => (
              <button
                key={page}
                onClick={() =>
                  dispatch(
                    fetchMyTransactions({
                      page,
                      status: selectedTab === "all" ? undefined : selectedTab,
                    }),
                  )
                }
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl font-semibold transition-all text-xs sm:text-sm ${
                  transactionsPagination.page === page
                    ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white"
                    : isDarkMode
                      ? "bg-slate-800 text-slate-300 hover:bg-slate-700"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BoostHistoryPage;
