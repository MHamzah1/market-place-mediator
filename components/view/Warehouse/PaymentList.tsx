"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/lib/state/store";
import {
  fetchAllAdminPayments,
  fetchVehicles,
  AdminPaymentWithDetails,
} from "@/lib/state/slice/warehouse/warehouseSlice";
import Link from "next/link";
import {
  FiDollarSign,
  FiChevronLeft,
  FiChevronRight,
  FiCalendar,
  FiUser,
  FiFileText,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiAlertTriangle,
  FiRefreshCw,
  FiCreditCard,
  FiHash,
  FiExternalLink,
} from "react-icons/fi";
import { TbCar } from "react-icons/tb";
import { useTheme } from "@/context/ThemeContext";
import { encryptSlug } from "@/lib/slug/slug";

// ============================
// STATUS CONFIG
// ============================
const paymentStatusConfig: Record<
  string,
  { label: string; color: string; bg: string; icon: React.ElementType }
> = {
  pending: {
    label: "Menunggu",
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-500/10 border-amber-500/30",
    icon: FiClock,
  },
  paid: {
    label: "Lunas",
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-500/10 border-emerald-500/30",
    icon: FiCheckCircle,
  },
  failed: {
    label: "Gagal",
    color: "text-red-600 dark:text-red-400",
    bg: "bg-red-500/10 border-red-500/30",
    icon: FiXCircle,
  },
  expired: {
    label: "Kedaluwarsa",
    color: "text-slate-500 dark:text-slate-400",
    bg: "bg-slate-500/10 border-slate-500/30",
    icon: FiAlertTriangle,
  },
};

const methodLabels: Record<string, { label: string; icon: string }> = {
  transfer_bank: { label: "Transfer Bank", icon: "🏦" },
  ewallet: { label: "E-Wallet", icon: "📱" },
  cash: { label: "Tunai", icon: "💵" },
  simulated: { label: "Simulasi (Dev)", icon: "🧪" },
};

// ============================
// HELPERS
// ============================
const formatPrice = (n: number | string) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(Number(n));

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const formatDateTime = (d: string) =>
  new Date(d).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

// ============================
// MAIN
// ============================
const PaymentList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const { adminPayments, vehicles, selectedShowroom, loading, pagination } =
    useSelector((state: RootState) => state.warehouse);

  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);

  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL_IMAGES || "http://localhost:8080";
  const getImageUrl = (url: string) =>
    url?.startsWith("http") ? url : baseUrl + url;

  const loadPayments = useCallback(() => {
    const params: Record<string, unknown> = {
      page: currentPage,
      perPage: 10,
    };
    if (selectedShowroom?.id) params.showroomId = selectedShowroom.id;
    if (statusFilter !== "all") params.status = statusFilter;
    dispatch(fetchAllAdminPayments(params));
  }, [dispatch, selectedShowroom, statusFilter, currentPage]);

  useEffect(() => {
    loadPayments();
  }, [loadPayments]);

  useEffect(() => {
    if (selectedShowroom?.id) {
      dispatch(
        fetchVehicles({
          showroomId: selectedShowroom.id,
          status: "registered",
        }),
      );
    }
  }, [dispatch, selectedShowroom]);

  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter]);

  const totalPaid = adminPayments.filter(
    (p) => p.paymentStatus === "paid",
  ).length;
  const totalPending = adminPayments.filter(
    (p) => p.paymentStatus === "pending",
  ).length;
  const totalRevenue = adminPayments
    .filter((p) => p.paymentStatus === "paid")
    .reduce((sum, p) => sum + Number(p.amount), 0);
  const pendingVehicles = vehicles.filter((v) => v.status === "registered");

  const filterTabs = [
    { key: "all", label: "Semua", count: pagination.total },
    { key: "paid", label: "Lunas", count: totalPaid },
    { key: "pending", label: "Menunggu", count: totalPending },
    { key: "expired", label: "Expired", count: null },
  ];

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      {/* HEADER */}
      <div>
        <h1
          className={`text-2xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}
        >
          Pembayaran Admin
        </h1>
        <p
          className={`text-sm mt-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}
        >
          Kelola &amp; riwayat pembayaran biaya admin Rp 2.000.000 per kendaraan
        </p>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          isDark={isDark}
          label="Total Transaksi"
          value={String(pagination.total || adminPayments.length)}
          subtitle="pembayaran"
          icon={FiFileText}
          color="blue"
        />
        <SummaryCard
          isDark={isDark}
          label="Sudah Lunas"
          value={String(totalPaid)}
          subtitle="pembayaran"
          icon={FiCheckCircle}
          color="emerald"
        />
        <SummaryCard
          isDark={isDark}
          label="Menunggu Bayar"
          value={String(pendingVehicles.length)}
          subtitle="kendaraan"
          icon={FiClock}
          color="amber"
        />
        <SummaryCard
          isDark={isDark}
          label="Total Pendapatan"
          value={formatPrice(totalRevenue)}
          subtitle="dari biaya admin"
          icon={FiDollarSign}
          color="purple"
        />
      </div>

      {/* PENDING VEHICLES */}
      {pendingVehicles.length > 0 && (
        <div
          className={`rounded-2xl border overflow-hidden ${isDark ? "bg-amber-500/5 border-amber-500/20" : "bg-amber-50 border-amber-200"}`}
        >
          <div
            className={`px-5 py-3 flex items-center gap-2 ${isDark ? "bg-amber-500/10" : "bg-amber-100/50"}`}
          >
            <FiAlertTriangle
              className={isDark ? "text-amber-400" : "text-amber-600"}
            />
            <h3
              className={`text-sm font-bold ${isDark ? "text-amber-300" : "text-amber-800"}`}
            >
              Kendaraan Menunggu Pembayaran ({pendingVehicles.length})
            </h3>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {pendingVehicles.slice(0, 6).map((v) => (
                <Link
                  key={v.id}
                  href={`/warehouse/vehicles/${encryptSlug(v.id)}`}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all hover:-translate-y-0.5 hover:shadow-md ${
                    isDark
                      ? "bg-slate-800/50 border-slate-700/50 hover:border-amber-500/40"
                      : "bg-white border-slate-200 hover:border-amber-400"
                  }`}
                >
                  <div
                    className={`w-12 h-9 rounded-lg overflow-hidden flex-shrink-0 ${isDark ? "bg-slate-700" : "bg-slate-100"}`}
                  >
                    {v.images?.[0] ? (
                      <img
                        src={getImageUrl(v.images[0])}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <TbCar
                          className={
                            isDark ? "text-slate-500" : "text-slate-300"
                          }
                        />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-xs font-bold truncate ${isDark ? "text-white" : "text-slate-900"}`}
                    >
                      {v.brandName} {v.modelName} {v.year}
                    </p>
                    <p
                      className={`text-[10px] ${isDark ? "text-slate-500" : "text-slate-400"}`}
                    >
                      {v.licensePlate} &bull; {v.sellerName}
                    </p>
                  </div>
                  <FiExternalLink
                    className={`flex-shrink-0 text-xs ${isDark ? "text-amber-400" : "text-amber-600"}`}
                  />
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* RIWAYAT PEMBAYARAN */}
      <div
        className={`rounded-2xl border overflow-hidden ${isDark ? "bg-slate-800/50 border-slate-700/50" : "bg-white border-slate-200 shadow-sm"}`}
      >
        {/* Filter Tabs */}
        <div
          className={`px-5 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b ${isDark ? "border-slate-700/50" : "border-slate-200"}`}
        >
          <div className="flex items-center gap-1 overflow-x-auto">
            {filterTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setStatusFilter(tab.key)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                  statusFilter === tab.key
                    ? "bg-blue-600 text-white shadow-sm"
                    : isDark
                      ? "text-slate-400 hover:text-white hover:bg-slate-700"
                      : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                {tab.label}
                {tab.count != null && (
                  <span
                    className={`ml-1.5 px-1.5 py-0.5 rounded-md text-[10px] font-bold ${statusFilter === tab.key ? "bg-white/20" : isDark ? "bg-slate-700" : "bg-slate-200/80"}`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
          <button
            onClick={loadPayments}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${isDark ? "bg-slate-700 hover:bg-slate-600 text-slate-300" : "bg-slate-100 hover:bg-slate-200 text-slate-600"}`}
          >
            <FiRefreshCw className={loading ? "animate-spin" : ""} size={12} />
            Refresh
          </button>
        </div>

        {/* Payment Cards */}
        <div className="p-4">
          {loading && adminPayments.length === 0 ? (
            <div className="flex justify-center items-center py-16">
              <div className="flex flex-col items-center gap-3">
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent" />
                <p
                  className={`text-sm ${isDark ? "text-slate-500" : "text-slate-400"}`}
                >
                  Memuat data pembayaran...
                </p>
              </div>
            </div>
          ) : adminPayments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center ${isDark ? "bg-slate-800" : "bg-slate-100"}`}
              >
                <FiDollarSign
                  className={`text-2xl ${isDark ? "text-slate-600" : "text-slate-300"}`}
                />
              </div>
              <p
                className={`text-sm font-medium ${isDark ? "text-slate-400" : "text-slate-500"}`}
              >
                {statusFilter === "all"
                  ? "Belum ada riwayat pembayaran"
                  : `Tidak ada pembayaran dengan status "${paymentStatusConfig[statusFilter]?.label || statusFilter}"`}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {adminPayments.map((payment) => (
                <PaymentCard
                  key={payment.id}
                  payment={payment}
                  isDark={isDark}
                  getImageUrl={getImageUrl}
                />
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div
            className={`px-5 py-3 flex items-center justify-between border-t ${isDark ? "border-slate-700/50" : "border-slate-200"}`}
          >
            <p
              className={`text-xs ${isDark ? "text-slate-500" : "text-slate-400"}`}
            >
              Halaman {currentPage} dari {pagination.totalPages} &bull;{" "}
              {pagination.total} total
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage <= 1}
                className={`p-1.5 rounded-lg transition-colors disabled:opacity-30 ${isDark ? "hover:bg-slate-700" : "hover:bg-slate-100"}`}
              >
                <FiChevronLeft size={16} />
              </button>
              {Array.from({ length: Math.min(5, pagination.totalPages) }).map(
                (_, i) => {
                  const page = i + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-8 h-8 rounded-lg text-xs font-bold transition-colors ${currentPage === page ? "bg-blue-600 text-white" : isDark ? "text-slate-400 hover:bg-slate-700" : "text-slate-500 hover:bg-slate-100"}`}
                    >
                      {page}
                    </button>
                  );
                },
              )}
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(pagination.totalPages, p + 1))
                }
                disabled={currentPage >= pagination.totalPages}
                className={`p-1.5 rounded-lg transition-colors disabled:opacity-30 ${isDark ? "hover:bg-slate-700" : "hover:bg-slate-100"}`}
              >
                <FiChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ============================
// SUMMARY CARD
// ============================
const SummaryCard = ({
  isDark,
  label,
  value,
  subtitle,
  icon: Icon,
  color,
}: {
  isDark: boolean;
  label: string;
  value: string;
  subtitle: string;
  icon: React.ElementType;
  color: "blue" | "emerald" | "amber" | "purple";
}) => {
  const colors = {
    blue: {
      iconBg: isDark ? "bg-blue-500/15" : "bg-blue-50",
      iconColor: "text-blue-500",
      border: isDark ? "border-blue-500/20" : "border-blue-100",
    },
    emerald: {
      iconBg: isDark ? "bg-emerald-500/15" : "bg-emerald-50",
      iconColor: "text-emerald-500",
      border: isDark ? "border-emerald-500/20" : "border-emerald-100",
    },
    amber: {
      iconBg: isDark ? "bg-amber-500/15" : "bg-amber-50",
      iconColor: "text-amber-500",
      border: isDark ? "border-amber-500/20" : "border-amber-100",
    },
    purple: {
      iconBg: isDark ? "bg-purple-500/15" : "bg-purple-50",
      iconColor: "text-purple-500",
      border: isDark ? "border-purple-500/20" : "border-purple-100",
    },
  };
  const c = colors[color];

  return (
    <div
      className={`p-4 rounded-2xl border ${c.border} ${isDark ? "bg-slate-800/50" : "bg-white shadow-sm"}`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center ${c.iconBg}`}
        >
          <Icon className={`text-lg ${c.iconColor}`} />
        </div>
        <div className="flex-1 min-w-0">
          <p
            className={`text-[11px] font-medium ${isDark ? "text-slate-500" : "text-slate-400"}`}
          >
            {label}
          </p>
          <p
            className={`text-lg font-black truncate ${isDark ? "text-white" : "text-slate-900"}`}
          >
            {value}
          </p>
          <p
            className={`text-[10px] ${isDark ? "text-slate-600" : "text-slate-400"}`}
          >
            {subtitle}
          </p>
        </div>
      </div>
    </div>
  );
};

// ============================
// PAYMENT CARD
// ============================
const PaymentCard = ({
  payment,
  isDark,
  getImageUrl,
}: {
  payment: AdminPaymentWithDetails;
  isDark: boolean;
  getImageUrl: (url: string) => string;
}) => {
  const sc =
    paymentStatusConfig[payment.paymentStatus] || paymentStatusConfig.pending;
  const StatusIcon = sc.icon;
  const method = methodLabels[payment.paymentMethod || ""] || null;
  const v = payment.vehicle;

  return (
    <div
      className={`rounded-xl border overflow-hidden transition-all hover:shadow-md ${isDark ? "bg-slate-800/30 border-slate-700/50" : "bg-white border-slate-200"}`}
    >
      <div className="flex flex-col sm:flex-row">
        {/* Thumbnail */}
        {v && (
          <div className="sm:w-36 flex-shrink-0">
            <div
              className={`h-full min-h-[5rem] sm:min-h-full ${isDark ? "bg-slate-900" : "bg-slate-100"}`}
            >
              {v.images?.[0] ? (
                <img
                  src={getImageUrl(v.images[0])}
                  alt={`${v.brandName} ${v.modelName}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center py-6">
                  <TbCar
                    className={`text-3xl ${isDark ? "text-slate-700" : "text-slate-300"}`}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Info */}
        <div className="flex-1 p-4">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-3">
            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span
                  className={`font-mono text-xs px-2 py-0.5 rounded-md border ${isDark ? "bg-slate-800 border-slate-700 text-blue-400" : "bg-blue-50 border-blue-200 text-blue-700"}`}
                >
                  <FiHash className="inline -mt-0.5 mr-0.5" size={10} />
                  {payment.invoiceNumber}
                </span>
                <span
                  className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold border ${sc.bg} ${sc.color}`}
                >
                  <StatusIcon size={12} />
                  {sc.label}
                </span>
              </div>
              {v && (
                <Link
                  href={`/warehouse/vehicles/${encryptSlug(v.id)}`}
                  className={`text-sm font-bold hover:underline ${isDark ? "text-white" : "text-slate-900"}`}
                >
                  {v.brandName} {v.modelName} {v.year}
                </Link>
              )}
              {v && (
                <p
                  className={`text-xs ${isDark ? "text-slate-500" : "text-slate-400"}`}
                >
                  {v.licensePlate} &bull; {v.color} &bull; {v.barcode}
                </p>
              )}
            </div>
            <div className="text-right flex-shrink-0">
              <p
                className={`text-lg font-black ${payment.paymentStatus === "paid" ? "text-emerald-500" : isDark ? "text-white" : "text-slate-900"}`}
              >
                {formatPrice(payment.amount)}
              </p>
              <p
                className={`text-[10px] font-medium ${isDark ? "text-slate-500" : "text-slate-400"}`}
              >
                {payment.currency}
              </p>
            </div>
          </div>

          <div
            className={`flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}
          >
            <span className="flex items-center gap-1">
              <FiCalendar size={11} />
              {formatDateTime(payment.createdAt)}
            </span>
            {payment.payer && (
              <span className="flex items-center gap-1">
                <FiUser size={11} />
                {payment.payer.fullName}
              </span>
            )}
            {method && (
              <span className="flex items-center gap-1">
                <FiCreditCard size={11} />
                {method.icon} {method.label}
              </span>
            )}
            {payment.paidAt && (
              <span className="flex items-center gap-1 text-emerald-500">
                <FiCheckCircle size={11} />
                Dibayar {formatDateTime(payment.paidAt)}
              </span>
            )}
            {payment.paymentStatus === "pending" && payment.expiresAt && (
              <span className="flex items-center gap-1 text-amber-500">
                <FiClock size={11} />
                Batas: {formatDate(payment.expiresAt)}
              </span>
            )}
            {payment.paymentReference && (
              <span className="flex items-center gap-1 font-mono">
                <FiHash size={11} />
                {payment.paymentReference}
              </span>
            )}
            {v?.sellerName && (
              <span className="flex items-center gap-1">
                <TbCar size={12} />
                Penjual: {v.sellerName}
              </span>
            )}
            {v?.askingPrice && (
              <span className="flex items-center gap-1">
                <FiDollarSign size={11} />
                Harga mobil: {formatPrice(v.askingPrice)}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentList;
