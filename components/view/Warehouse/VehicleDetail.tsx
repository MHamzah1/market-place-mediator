"use client";

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/lib/state/store";
import {
  fetchVehicleDetail,
  publishVehicle,
  createAdminPayment,
  simulateAdminPayment,
  payAdminFee,
  placeVehicleByZoneType,
  fetchInspectionsByVehicle,
  fetchRepairsByVehicle,
  fetchZonesByShowroom,
  markVehicleReadyAndPlace,
  clearSuccess,
  clearError,
} from "@/lib/state/slice/warehouse/warehouseSlice";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  FiArrowLeft,
  FiClipboard,
  FiTool,
  FiDollarSign,
  FiExternalLink,
  FiCheck,
  FiMapPin,
  FiImage,
  FiChevronLeft,
  FiChevronRight,
  FiX,
  FiUser,
  FiFileText,
  FiCalendar,
} from "react-icons/fi";
import { BsSpeedometer2, BsFuelPump } from "react-icons/bs";
import { TbManualGearbox } from "react-icons/tb";
import { AiOutlineSafety } from "react-icons/ai";
import { useTheme } from "@/context/ThemeContext";
import { generateUrlWithEncryptedParams } from "@/lib/slug/slug";

const statusConfig: Record<string, { label: string; color: string }> = {
  inspecting: {
    label: "Inspeksi",
    color:
      "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border-yellow-500/30",
  },
  registered: {
    label: "Terdaftar",
    color: "bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/30",
  },
  in_warehouse: {
    label: "Di Gudang",
    color:
      "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
  },
  in_repair: {
    label: "Perbaikan",
    color:
      "bg-orange-500/20 text-orange-600 dark:text-orange-400 border-orange-500/30",
  },
  ready: {
    label: "Siap Jual",
    color:
      "bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/30",
  },
  listed: {
    label: "Di Marketplace",
    color:
      "bg-purple-500/20 text-purple-600 dark:text-purple-400 border-purple-500/30",
  },
  sold: {
    label: "Terjual",
    color: "bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border-cyan-500/30",
  },
  rejected: {
    label: "Ditolak",
    color: "bg-red-500/20 text-red-600 dark:text-red-400 border-red-500/30",
  },
};

const VehicleDetail = ({ id }: { id: string }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const {
    selectedVehicle: vehicle,
    selectedShowroom,
    inspections,
    repairs,
    zones,
    loading,
    actionLoading,
    error,
    successMessage,
  } = useSelector((state: RootState) => state.warehouse);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  // Fallback API Image Base URL
  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL_IMAGES || "http://localhost:8080";

  useEffect(() => {
    dispatch(fetchVehicleDetail(id));
    dispatch(fetchInspectionsByVehicle(id));
    dispatch(fetchRepairsByVehicle(id));
  }, [dispatch, id]);

  // Fetch zones for ready zone placement
  useEffect(() => {
    if (selectedShowroom?.id) {
      dispatch(fetchZonesByShowroom(selectedShowroom.id));
    }
  }, [dispatch, selectedShowroom?.id]);

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(clearSuccess());
      dispatch(fetchVehicleDetail(id));
    }
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [successMessage, error, dispatch, id]);

  const formatPrice = (n: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(n);

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  if (loading || !vehicle) {
    return (
      <div className="flex justify-center items-center py-32">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent" />
      </div>
    );
  }

  const sc = statusConfig[vehicle.status] || {
    label: vehicle.status,
    color: "bg-slate-500/20 text-slate-500 dark:text-slate-400",
  };

  const images = vehicle.images || [];
  const getImageUrl = (url: string) =>
    url.startsWith("http") ? url : baseUrl + url;

  return (
    <div className={`space-y-6 max-w-7xl mx-auto px-2 sm:px-4 pb-12`}>
      {/* Dynamic Header Actions depending on vehicle status */}
      <div
        className={`p-4 rounded-2xl border shadow-sm ${isDark ? "bg-slate-800/50 border-slate-700/50" : "bg-white border-slate-200"}`}
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/warehouse/vehicles"
              className={`p-2.5 rounded-xl transition-colors ${
                isDark
                  ? "bg-slate-700/50 hover:bg-slate-600 text-slate-300"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-600"
              }`}
            >
              <FiArrowLeft className="text-xl" />
            </Link>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`px-2.5 py-0.5 rounded-md text-xs font-bold border ${sc.color}`}
                >
                  {sc.label}
                </span>
                <span className="font-mono text-xs px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50">
                  {vehicle.barcode}
                </span>
              </div>
              <h1
                className={`text-xl sm:text-2xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}
              >
                {vehicle.brandName} {vehicle.modelName}{" "}
                <span className="text-emerald-500">{vehicle.year}</span>
              </h1>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 w-full md:w-auto">
            {/* Primary Actions */}
            <div className="flex flex-wrap gap-2">
              {vehicle.status === "inspecting" && (
                <Link
                  href={generateUrlWithEncryptedParams(
                    "/warehouse/inspections/create",
                    { vehicleId: vehicle.id },
                  )}
                  className="flex flex-1 md:flex-none justify-center items-center gap-2 px-5 py-2.5 rounded-xl bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 font-semibold text-sm hover:bg-yellow-500/30 transition-colors border border-yellow-500/30"
                >
                  <FiClipboard /> Mulai Inspeksi
                </Link>
              )}
              {(vehicle.status === "registered" ||
                vehicle.status === "pending_payment") && (
                <button
                  onClick={() => setIsPaymentModalOpen(true)}
                  disabled={actionLoading}
                  className="flex flex-1 md:flex-none justify-center items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold text-sm shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:transform-none"
                >
                  <FiDollarSign /> Bayar Tagihan Admin
                </button>
              )}
              {(vehicle.status === "in_warehouse" ||
                vehicle.status === "in_repair" ||
                vehicle.status === "registered") && (
                <Link
                  href={generateUrlWithEncryptedParams(
                    "/warehouse/repairs/create",
                    { vehicleId: vehicle.id },
                  )}
                  className="flex flex-1 md:flex-none justify-center items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500/20 text-orange-600 dark:text-orange-400 font-semibold text-sm hover:bg-orange-500/30 transition-colors border border-orange-500/30"
                >
                  <FiTool /> Repair Order
                </Link>
              )}
              {vehicle.status === "ready" && (
                <button
                  onClick={() => dispatch(publishVehicle(vehicle.id))}
                  disabled={actionLoading}
                  className="flex flex-1 md:flex-none justify-center items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-sm shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:transform-none"
                >
                  <FiExternalLink /> Publish ke Marketplace
                </button>
              )}
            </div>

            {/* Zone Placement Select */}
            {vehicle.status !== "sold" && vehicle.status !== "listed" && (
              <ZonePlacementSelect
                isDark={isDark}
                actionLoading={actionLoading}
                onMove={(zoneType) =>
                  dispatch(
                    placeVehicleByZoneType({ vehicleId: vehicle.id, zoneType }),
                  )
                }
              />
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Image Gallery & Description */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Image Gallery */}
          <div
            className={`p-4 sm:p-5 rounded-2xl border shadow-sm ${isDark ? "bg-slate-800/50 border-slate-700/50" : "bg-white border-slate-200"}`}
          >
            <div
              className={`relative rounded-xl overflow-hidden cursor-pointer aspect-[16/10] bg-slate-100 dark:bg-slate-900 group`}
              onClick={() => {
                if (images.length > 0) setIsImageModalOpen(true);
              }}
            >
              {images.length > 0 ? (
                <>
                  <img
                    src={getImageUrl(images[currentImageIndex])}
                    alt={`${vehicle.brandName} ${vehicle.modelName}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Badge over image */}
                  <div className="absolute top-4 left-4 flex gap-2">
                    {vehicle.condition && (
                      <span className="px-3 py-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-full text-xs font-bold text-emerald-600 dark:text-emerald-400 capitalize shadow-md">
                        {vehicle.condition}
                      </span>
                    )}
                  </div>
                  {/* Gallery Nav Arrows (if hover or mobile) */}
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentImageIndex((prev) =>
                            prev === 0 ? images.length - 1 : prev - 1,
                          );
                        }}
                        className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-black/40 hover:bg-black/70 text-white rounded-full transition opacity-0 group-hover:opacity-100"
                      >
                        <FiChevronLeft className="text-xl" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentImageIndex((prev) =>
                            prev === images.length - 1 ? 0 : prev + 1,
                          );
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-black/40 hover:bg-black/70 text-white rounded-full transition opacity-0 group-hover:opacity-100"
                      >
                        <FiChevronRight className="text-xl" />
                      </button>
                      <div className="absolute bottom-3 right-3 px-3 py-1 bg-black/60 rounded-full text-white text-xs font-medium backdrop-blur-sm">
                        {currentImageIndex + 1} / {images.length}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
                  <FiImage className="text-6xl mb-4 opacity-50" />
                  <p className="font-medium">Tidak ada foto kendaraan</p>
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-3 mt-4 overflow-x-auto pb-2 custom-scrollbar">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      currentImageIndex === idx
                        ? "border-emerald-500 ring-2 ring-emerald-500/30"
                        : "border-transparent"
                    }`}
                  >
                    <img
                      src={getImageUrl(img)}
                      alt={`Thumbnail ${idx}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Specifications Banner */}
          <div
            className={`grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl border ${isDark ? "bg-slate-800/50 border-slate-700/50" : "bg-white border-slate-200"} shadow-sm`}
          >
            {[
              {
                label: "Kilometer",
                val: `${vehicle.mileage.toLocaleString("id-ID")} km`,
                icon: BsSpeedometer2,
                color: "text-blue-500",
              },
              {
                label: "Transmisi",
                val: vehicle.transmission || "N/A",
                icon: TbManualGearbox,
                color: "text-purple-500",
              },
              {
                label: "Bahan Bakar",
                val: vehicle.fuelType,
                icon: BsFuelPump,
                color: "text-orange-500",
              },
              {
                label: "Tahun",
                val: vehicle.year.toString(),
                icon: FiCalendar,
                color: "text-emerald-500",
              },
            ].map((stat, i) => (
              <div
                key={i}
                className={`flex flex-col items-center justify-center p-3 rounded-xl ${isDark ? "bg-slate-700/30" : "bg-slate-50"}`}
              >
                <stat.icon className={`text-2xl mb-2 ${stat.color}`} />
                <span
                  className={`text-[10px] sm:text-xs font-medium uppercase tracking-wider mb-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}
                >
                  {stat.label}
                </span>
                <span
                  className={`text-sm sm:text-base font-bold capitalize ${isDark ? "text-white" : "text-slate-900"}`}
                >
                  {stat.val}
                </span>
              </div>
            ))}
          </div>

          {/* Detailed Descriptions & Notes */}
          <div
            className={`p-5 sm:p-6 rounded-2xl border shadow-sm ${isDark ? "bg-slate-800/50 border-slate-700/50" : "bg-white border-slate-200"}`}
          >
            <h2
              className={`text-lg font-bold mb-4 flex items-center gap-2 ${isDark ? "text-white" : "text-slate-900"}`}
            >
              <FiFileText className="text-emerald-500" /> Deskripsi Mobil
            </h2>
            <div
              className={`prose prose-sm max-w-none ${isDark ? "prose-invert text-slate-300" : "text-slate-700"} whitespace-pre-wrap leading-relaxed`}
            >
              {vehicle.description || (
                <span className="italic opacity-50">
                  Tidak ada deskripsi yang ditambahkan.
                </span>
              )}
            </div>

            {vehicle.notes && (
              <div
                className={`mt-6 p-4 rounded-xl border ${isDark ? "bg-yellow-500/10 border-yellow-500/20 text-yellow-200" : "bg-yellow-50 border-yellow-200 text-yellow-800"}`}
              >
                <h3 className="font-bold flex items-center gap-2 mb-2">
                  Catatan Internal
                </h3>
                <p className="text-sm">{vehicle.notes}</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Pricing, Seller, Detailed Specs */}
        <div className="space-y-6">
          {/* Price Card */}
          <div
            className={`p-5 sm:p-6 rounded-2xl border shadow-sm ${isDark ? "bg-slate-800/50 border-slate-700/50" : "bg-white border-slate-200"}`}
          >
            <h3
              className={`text-sm font-semibold uppercase tracking-wider mb-2 ${isDark ? "text-slate-400" : "text-slate-500"}`}
            >
              Harga Jual (Asking Price)
            </h3>
            <div className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-600 mb-4">
              {formatPrice(vehicle.askingPrice)}
            </div>
            {(vehicle.locationCity || vehicle.locationProvince) && (
              <div
                className={`flex items-center gap-2 text-sm font-medium ${isDark ? "text-slate-300" : "text-slate-700"}`}
              >
                <FiMapPin className="text-rose-500 text-lg" />
                {vehicle.locationCity && (
                  <span className="capitalize">{vehicle.locationCity}</span>
                )}
                {vehicle.locationCity && vehicle.locationProvince && (
                  <span>, </span>
                )}
                {vehicle.locationProvince && (
                  <span className="capitalize">{vehicle.locationProvince}</span>
                )}
              </div>
            )}
          </div>

          {/* Seller / Supplier Data */}
          <div
            className={`p-5 sm:p-6 rounded-2xl border shadow-sm ${isDark ? "bg-slate-800/50 border-slate-700/50" : "bg-white border-slate-200"}`}
          >
            <h2
              className={`text-lg font-bold mb-4 flex items-center gap-2 ${isDark ? "text-white" : "text-slate-900"}`}
            >
              <FiUser className="text-blue-500" /> Data Pemasok / Penjual
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm py-2 border-b border-slate-100 dark:border-slate-700">
                <span className={isDark ? "text-slate-400" : "text-slate-500"}>
                  Nama
                </span>
                <span
                  className={`font-semibold ${isDark ? "text-white" : "text-slate-900"}`}
                >
                  {vehicle.sellerName}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm py-2 border-b border-slate-100 dark:border-slate-700">
                <span className={isDark ? "text-slate-400" : "text-slate-500"}>
                  Phone / WA
                </span>
                <span
                  className={`font-semibold ${isDark ? "text-white" : "text-slate-900"}`}
                >
                  {vehicle.sellerPhone}{" "}
                  {vehicle.sellerWhatsapp ? ` / ${vehicle.sellerWhatsapp}` : ""}
                </span>
              </div>
              {vehicle.sellerKtp && (
                <div className="flex justify-between items-center text-sm py-2 border-b border-slate-100 dark:border-slate-700">
                  <span
                    className={isDark ? "text-slate-400" : "text-slate-500"}
                  >
                    No KTP
                  </span>
                  <span
                    className={`font-semibold font-mono ${isDark ? "text-slate-300" : "text-slate-700"}`}
                  >
                    {vehicle.sellerKtp}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Legalitas & Kondisi Mobile*/}
          <div
            className={`p-5 sm:p-6 rounded-2xl border shadow-sm ${isDark ? "bg-slate-800/50 border-slate-700/50" : "bg-white border-slate-200"}`}
          >
            <h2
              className={`text-lg font-bold mb-4 flex items-center gap-2 ${isDark ? "text-white" : "text-slate-900"}`}
            >
              <AiOutlineSafety className="text-rose-500 text-xl" /> Legalitas &
              Status
            </h2>
            <div className="space-y-3">
              <InfoRow
                isDark={isDark}
                label="Plat Nomor"
                value={vehicle.licensePlate}
              />
              <InfoRow
                isDark={isDark}
                label="Pajak"
                value={vehicle.taxStatus || "N/A"}
              />
              <InfoRow
                isDark={isDark}
                label="Kepemilikan"
                value={vehicle.ownershipStatus || "N/A"}
              />
              <InfoRow
                isDark={isDark}
                label="Nomor Rangka"
                value={vehicle.chassisNumber}
                mono
              />
              <InfoRow
                isDark={isDark}
                label="Nomor Mesin"
                value={vehicle.engineNumber}
                mono
              />
              <InfoRow isDark={isDark} label="Warna" value={vehicle.color} />
            </div>
          </div>
        </div>
      </div>

      {/* Inspections & Repairs Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        {/* Inspections */}
        <div
          className={`p-5 sm:p-6 rounded-2xl border shadow-sm ${isDark ? "bg-slate-800/50 border-slate-700/50" : "bg-white border-slate-200"}`}
        >
          <div className="flex items-center justify-between mb-5">
            <h3
              className={`text-lg font-bold flex items-center gap-2 ${isDark ? "text-white" : "text-slate-900"}`}
            >
              <FiClipboard className="text-yellow-500" /> Riwayat Inspeksi
            </h3>
            <span className="bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 px-3 py-1 rounded-full text-xs font-bold">
              {inspections.length}
            </span>
          </div>

          {inspections.length === 0 ? (
            <div
              className={`py-10 text-center rounded-xl border border-dashed ${isDark ? "border-slate-700 text-slate-500" : "border-slate-300 text-slate-400"}`}
            >
              <FiClipboard className="mx-auto text-3xl mb-2 opacity-40" />
              <p className="text-sm">Belum ada riwayat inspeksi.</p>
            </div>
          ) : (
            <div className="space-y-5">
              {inspections.map((insp, idx) => {
                const isApproved = insp.status === "approved";
                const isRejected = insp.status === "rejected_by_head";
                const isSubmitted = insp.status === "submitted";
                const totalScore = [
                  insp.exteriorScore,
                  insp.interiorScore,
                  insp.engineScore,
                  insp.electricalScore,
                  insp.chassisScore,
                ]
                  .filter((s) => s != null)
                  .reduce((a, b) => a! + b!, 0);
                const scoreCount = [
                  insp.exteriorScore,
                  insp.interiorScore,
                  insp.engineScore,
                  insp.electricalScore,
                  insp.chassisScore,
                ].filter((s) => s != null).length;
                const avgScore =
                  scoreCount > 0
                    ? Math.round((totalScore! / (scoreCount * 10)) * 100)
                    : null;

                return (
                  <div
                    key={insp.id}
                    className={`rounded-2xl border overflow-hidden shadow-sm transition-all ${
                      isApproved
                        ? isDark
                          ? "border-emerald-500/40 bg-emerald-500/5"
                          : "border-emerald-300 bg-emerald-50/50"
                        : isRejected
                          ? isDark
                            ? "border-red-500/40 bg-red-500/5"
                            : "border-red-300 bg-red-50/50"
                          : isDark
                            ? "border-slate-600/50 bg-slate-700/20"
                            : "border-slate-200 bg-white"
                    }`}
                  >
                    {/* Status Banner */}
                    <div
                      className={`px-4 py-2.5 flex items-center justify-between ${
                        isApproved
                          ? "bg-emerald-500"
                          : isRejected
                            ? "bg-red-500"
                            : isSubmitted
                              ? "bg-blue-500"
                              : "bg-slate-500"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-white text-xs font-bold uppercase tracking-widest">
                          {isApproved
                            ? "✓ Disetujui Kepala Inspeksi"
                            : isRejected
                              ? "✗ Ditolak Kepala Inspeksi"
                              : isSubmitted
                                ? "⏳ Menunggu Review"
                                : "📝 Draft"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-white/80 text-[10px] font-medium">
                          Inspeksi #{inspections.length - idx}
                        </span>
                        {insp.overallResult && (
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/20 text-white`}
                          >
                            {insp.overallResult === "accepted_ready"
                              ? "Siap Jual"
                              : insp.overallResult === "accepted_repair"
                                ? "Perlu Perbaikan"
                                : "Ditolak"}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="p-4 space-y-4">
                      {/* Inspector & Date Row */}
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${isDark ? "bg-slate-700 text-slate-300" : "bg-slate-200 text-slate-600"}`}
                          >
                            <FiUser className="text-xs" />
                          </div>
                          <div>
                            <p
                              className={`text-xs font-semibold ${isDark ? "text-slate-200" : "text-slate-700"}`}
                            >
                              {insp.inspector?.fullName ?? "Inspektor"}
                            </p>
                            <p
                              className={`text-[10px] capitalize ${isDark ? "text-slate-500" : "text-slate-400"}`}
                            >
                              {insp.inspectionType?.replace(/_/g, " ") ?? "-"}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`text-[10px] font-medium ${isDark ? "text-slate-500" : "text-slate-400"}`}
                        >
                          <FiCalendar className="inline mr-1" />
                          {formatDate(insp.inspectedAt)}
                        </span>
                      </div>

                      {/* Score Bar */}
                      {avgScore !== null && (
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span
                              className={`text-[10px] font-semibold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-slate-500"}`}
                            >
                              Skor Rata-rata
                            </span>
                            <span
                              className={`text-sm font-bold ${
                                avgScore >= 75
                                  ? "text-emerald-500"
                                  : avgScore >= 50
                                    ? "text-yellow-500"
                                    : "text-red-500"
                              }`}
                            >
                              {avgScore}%
                            </span>
                          </div>
                          <div
                            className={`h-2 rounded-full overflow-hidden ${isDark ? "bg-slate-700" : "bg-slate-200"}`}
                          >
                            <div
                              className={`h-full rounded-full transition-all ${
                                avgScore >= 75
                                  ? "bg-emerald-500"
                                  : avgScore >= 50
                                    ? "bg-yellow-500"
                                    : "bg-red-500"
                              }`}
                              style={{ width: `${avgScore}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Score Grid */}
                      <div className="grid grid-cols-5 gap-1.5">
                        {[
                          { label: "Eksterior", short: "Eks", score: insp.exteriorScore },
                          { label: "Interior", short: "Int", score: insp.interiorScore },
                          { label: "Mesin", short: "Msn", score: insp.engineScore },
                          { label: "Kelistrikan", short: "Lis", score: insp.electricalScore },
                          { label: "Rangka", short: "Chs", score: insp.chassisScore },
                        ].map((item, i) => (
                          <div
                            key={i}
                            title={item.label}
                            className={`flex flex-col items-center py-2 rounded-xl text-center ${isDark ? "bg-slate-800/70" : "bg-slate-100"}`}
                          >
                            <span
                              className={`text-[9px] font-semibold uppercase ${isDark ? "text-slate-500" : "text-slate-400"}`}
                            >
                              {item.short}
                            </span>
                            <span
                              className={`text-sm font-bold mt-0.5 ${
                                item.score == null
                                  ? isDark
                                    ? "text-slate-600"
                                    : "text-slate-400"
                                  : item.score >= 7
                                    ? "text-emerald-500"
                                    : item.score >= 5
                                      ? "text-yellow-500"
                                      : "text-red-500"
                              }`}
                            >
                              {item.score ?? "—"}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Documents */}
                      <div className="flex flex-wrap gap-1.5">
                        {[
                          { label: "BPKB", has: insp.hasBpkb },
                          { label: "STNK", has: insp.hasStnk },
                          { label: "Faktur", has: insp.hasFaktur },
                          { label: "KTP", has: insp.hasKtp },
                          { label: "Kunci Cadangan", has: insp.hasSpareKey },
                        ].map((doc) => (
                          <span
                            key={doc.label}
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                              doc.has
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                                : isDark
                                  ? "bg-slate-800 text-slate-600 border-slate-700"
                                  : "bg-slate-100 text-slate-400 border-slate-200 line-through"
                            }`}
                          >
                            {doc.has ? "✓" : "✗"} {doc.label}
                          </span>
                        ))}
                      </div>

                      {/* Repair / Rejection notes from inspector */}
                      {insp.repairNotes && (
                        <div
                          className={`flex gap-2 p-3 rounded-xl ${isDark ? "bg-orange-500/10 border border-orange-500/20" : "bg-orange-50 border border-orange-200"}`}
                        >
                          <FiTool className="text-orange-500 shrink-0 mt-0.5 text-sm" />
                          <div>
                            <p className="text-[10px] font-bold uppercase text-orange-500 mb-0.5">
                              Catatan Perbaikan
                            </p>
                            <p
                              className={`text-xs ${isDark ? "text-orange-300" : "text-orange-700"}`}
                            >
                              {insp.repairNotes}
                            </p>
                          </div>
                        </div>
                      )}

                      {insp.rejectionReason && (
                        <div
                          className={`flex gap-2 p-3 rounded-xl ${isDark ? "bg-red-500/10 border border-red-500/20" : "bg-red-50 border border-red-200"}`}
                        >
                          <FiX className="text-red-500 shrink-0 mt-0.5 text-sm" />
                          <div>
                            <p className="text-[10px] font-bold uppercase text-red-500 mb-0.5">
                              Alasan Penolakan (Inspektor)
                            </p>
                            <p
                              className={`text-xs ${isDark ? "text-red-300" : "text-red-700"}`}
                            >
                              {insp.rejectionReason}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* ── Kepala Inspeksi Decision ── */}
                      {(isApproved || isRejected) && (
                        <div
                          className={`rounded-xl border-2 overflow-hidden ${
                            isApproved
                              ? isDark
                                ? "border-emerald-500/50"
                                : "border-emerald-300"
                              : isDark
                                ? "border-red-500/50"
                                : "border-red-300"
                          }`}
                        >
                          {/* Header */}
                          <div
                            className={`flex items-center gap-2 px-3 py-2 ${
                              isApproved
                                ? "bg-emerald-500/15"
                                : "bg-red-500/15"
                            }`}
                          >
                            <div
                              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${isApproved ? "bg-emerald-500" : "bg-red-500"}`}
                            >
                              {isApproved ? "✓" : "✗"}
                            </div>
                            <p
                              className={`text-xs font-bold uppercase tracking-wider ${isApproved ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}
                            >
                              {isApproved
                                ? "Disetujui oleh Kepala Inspeksi"
                                : "Ditolak oleh Kepala Inspeksi"}
                            </p>
                          </div>

                          {/* Body */}
                          <div
                            className={`px-3 py-3 space-y-2 ${isDark ? "bg-slate-800/40" : "bg-white"}`}
                          >
                            {/* Approver info */}
                            {insp.approvedBy && (
                              <div className="flex items-center gap-2">
                                <div
                                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                                    isApproved
                                      ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                                      : "bg-red-500/20 text-red-600 dark:text-red-400"
                                  }`}
                                >
                                  {insp.approvedBy.fullName
                                    .charAt(0)
                                    .toUpperCase()}
                                </div>
                                <div>
                                  <p
                                    className={`text-xs font-semibold ${isDark ? "text-slate-200" : "text-slate-700"}`}
                                  >
                                    {insp.approvedBy.fullName}
                                  </p>
                                  {insp.approvedAt && (
                                    <p
                                      className={`text-[10px] ${isDark ? "text-slate-500" : "text-slate-400"}`}
                                    >
                                      {formatDate(insp.approvedAt)}
                                    </p>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Approval notes */}
                            {insp.approvalNotes && (
                              <div
                                className={`p-2.5 rounded-lg text-xs italic ${
                                  isApproved
                                    ? isDark
                                      ? "bg-emerald-500/10 text-emerald-300"
                                      : "bg-emerald-50 text-emerald-700"
                                    : isDark
                                      ? "bg-red-500/10 text-red-300"
                                      : "bg-red-50 text-red-700"
                                }`}
                              >
                                "{insp.approvalNotes}"
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Waiting for review */}
                      {isSubmitted && (
                        <div
                          className={`flex items-center gap-2 p-3 rounded-xl border ${isDark ? "bg-blue-500/10 border-blue-500/20" : "bg-blue-50 border-blue-200"}`}
                        >
                          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                          <p
                            className={`text-xs font-medium ${isDark ? "text-blue-400" : "text-blue-600"}`}
                          >
                            Menunggu review dari Kepala Inspeksi
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Repairs */}
        <div
          className={`p-5 sm:p-6 rounded-2xl border shadow-sm ${isDark ? "bg-slate-800/50 border-slate-700/50" : "bg-white border-slate-200"}`}
        >
          <div className="flex items-center justify-between mb-5">
            <h3
              className={`text-lg font-bold flex items-center gap-2 ${isDark ? "text-white" : "text-slate-900"}`}
            >
              <FiTool className="text-orange-500" /> Repair Orders
            </h3>
            <span className="bg-orange-500/10 text-orange-600 dark:text-orange-400 px-3 py-1 rounded-full text-xs font-bold">
              {repairs.length}
            </span>
          </div>

          {repairs.length === 0 ? (
            <div
              className={`py-8 text-center rounded-xl border border-dashed ${isDark ? "border-slate-700 text-slate-500" : "border-slate-300 text-slate-400"}`}
            >
              <p>Belum ada perbaikan.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {repairs.map((r) => (
                <div
                  key={r.id}
                  className={`p-4 rounded-xl border flex flex-col gap-2 ${isDark ? "bg-slate-700/30 border-slate-600/50" : "bg-slate-50 border-slate-100"}`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2.5 py-0.5 rounded-md text-[10px] uppercase font-bold tracking-wider ${
                          r.repairType === "light"
                            ? "bg-blue-500/20 text-blue-600 dark:text-blue-400"
                            : "bg-red-500/20 text-red-600 dark:text-red-400"
                        }`}
                      >
                        {r.repairType === "light" ? "Ringan" : "Berat"}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-md text-[10px] uppercase font-bold tracking-wider ${
                          r.status === "completed"
                            ? "bg-green-500/20 text-green-600 dark:text-green-400"
                            : r.status === "in_progress"
                              ? "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400"
                              : r.status === "cancelled"
                                ? "bg-red-500/20 text-red-600 dark:text-red-400"
                                : "bg-slate-500/20 text-slate-500 dark:text-slate-400"
                        }`}
                      >
                        {r.status?.replace(/_/g, " ") ?? "-"}
                      </span>
                    </div>
                    <span
                      className={`text-xs font-medium ${isDark ? "text-slate-400" : "text-slate-500"}`}
                    >
                      {formatDate(r.createdAt)}
                    </span>
                  </div>
                  <p
                    className={`text-sm font-medium ${isDark ? "text-slate-300" : "text-slate-700"}`}
                  >
                    {r.description}
                  </p>
                  <div className="flex gap-4 mt-2">
                    {r.estimatedCost && (
                      <div className="text-xs">
                        <span
                          className={
                            isDark ? "text-slate-500" : "text-slate-400"
                          }
                        >
                          Estimasi:{" "}
                        </span>
                        <span
                          className={`font-semibold ${isDark ? "text-slate-300" : "text-slate-700"}`}
                        >
                          {formatPrice(r.estimatedCost)}
                        </span>
                      </div>
                    )}
                    {r.actualCost && (
                      <div className="text-xs">
                        <span
                          className={
                            isDark ? "text-slate-500" : "text-slate-400"
                          }
                        >
                          Aktual:{" "}
                        </span>
                        <span className="font-semibold text-emerald-500">
                          {formatPrice(r.actualCost)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Image Modal for Fullscreen View */}
      {isImageModalOpen && images.length > 0 && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setIsImageModalOpen(false)}
        >
          <button
            onClick={() => setIsImageModalOpen(false)}
            className="absolute top-4 right-4 p-3 bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors z-50"
          >
            <FiX className="text-2xl" />
          </button>

          {images.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setCurrentImageIndex((prev) =>
                  prev === 0 ? images.length - 1 : prev - 1,
                );
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-4 bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors hidden md:block"
            >
              <FiChevronLeft className="text-3xl" />
            </button>
          )}

          <div className="relative max-w-5xl w-full max-h-[85vh] flex items-center justify-center">
            <img
              src={getImageUrl(images[currentImageIndex])}
              alt="Fullscreen View"
              className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {images.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setCurrentImageIndex((prev) =>
                  prev === images.length - 1 ? 0 : prev + 1,
                );
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-4 bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors hidden md:block"
            >
              <FiChevronRight className="text-3xl" />
            </button>
          )}

          {/* Dots Indicator */}
          {images.length > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 overflow-x-auto max-w-full px-4">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex(idx);
                  }}
                  className={`w-2.5 h-2.5 rounded-full transition-all flex-shrink-0 ${
                    currentImageIndex === idx
                      ? "bg-emerald-500 scale-125"
                      : "bg-white/40 hover:bg-white/60"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ============ ADMIN PAYMENT MODAL ============ */}
      {isPaymentModalOpen && vehicle && (
        <AdminPaymentModal
          vehicle={vehicle}
          isDark={isDark}
          actionLoading={actionLoading}
          onClose={() => setIsPaymentModalOpen(false)}
          onConfirm={(paymentMethod: string) => {
            dispatch(payAdminFee({ vehicleId: vehicle.id, paymentMethod }))
              .unwrap()
              .then(() => {
                setIsPaymentModalOpen(false);
                dispatch(fetchVehicleDetail(id));
              })
              .catch(() => {});
          }}
          formatPrice={formatPrice}
        />
      )}
    </div>
  );
};

// ============================
// ZONE PLACEMENT SELECT
// ============================
const ZONE_OPTIONS = [
  {
    value: "ready",
    label: "Gudang Ready Jual",
    emoji: "🟢",
    desc: "Siap dijual / display",
  },
  {
    value: "light_repair",
    label: "Gudang Repair Ringan",
    emoji: "🟡",
    desc: "Service ringan, detailing",
  },
  {
    value: "heavy_repair",
    label: "Gudang Repair Berat",
    emoji: "🟠",
    desc: "Perbaikan mesin, body",
  },
  {
    value: "holding",
    label: "Gudang Holding",
    emoji: "🔵",
    desc: "Menunggu keputusan",
  },
  {
    value: "showroom_display",
    label: "Display Showroom",
    emoji: "🟣",
    desc: "Pajang di showroom",
  },
];

const ZonePlacementSelect = ({
  isDark,
  actionLoading,
  onMove,
}: {
  isDark: boolean;
  actionLoading: boolean;
  onMove: (zoneType: string) => void;
}) => {
  const [selected, setSelected] = useState("");

  return (
    <div className="flex items-center gap-2 w-full md:w-auto">
      <div className="relative flex-1 md:flex-none md:w-56">
        <FiMapPin
          className={`absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none ${isDark ? "text-slate-500" : "text-slate-400"}`}
          size={14}
        />
        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className={`w-full pl-8 pr-8 py-2 rounded-xl text-sm font-medium appearance-none cursor-pointer border transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/40 ${
            isDark
              ? "bg-slate-800 border-slate-700 text-slate-200 hover:border-slate-600"
              : "bg-white border-slate-200 text-slate-700 hover:border-slate-300"
          } ${!selected ? (isDark ? "text-slate-500" : "text-slate-400") : ""}`}
        >
          <option value="" disabled>
            Pindahkan ke zona...
          </option>
          {ZONE_OPTIONS.map((z) => (
            <option key={z.value} value={z.value}>
              {z.emoji} {z.label}
            </option>
          ))}
        </select>
        <div
          className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none ${isDark ? "text-slate-500" : "text-slate-400"}`}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path
              d="M3 4.5L6 7.5L9 4.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
      <button
        onClick={() => {
          if (selected) {
            onMove(selected);
            setSelected("");
          }
        }}
        disabled={!selected || actionLoading}
        className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
          selected
            ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:-translate-y-0.5"
            : isDark
              ? "bg-slate-800 text-slate-600 cursor-not-allowed"
              : "bg-slate-100 text-slate-400 cursor-not-allowed"
        } disabled:opacity-50 disabled:transform-none disabled:shadow-none`}
      >
        {actionLoading ? (
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <FiMapPin size={14} />
        )}
        Pindahkan
      </button>
    </div>
  );
};

// ============================
// ADMIN PAYMENT MODAL
// ============================
const PAYMENT_METHODS = [
  {
    id: "transfer_bank",
    label: "Transfer Bank",
    icon: "🏦",
    desc: "BCA, Mandiri, BNI, BRI",
  },
  {
    id: "ewallet",
    label: "E-Wallet",
    icon: "📱",
    desc: "GoPay, OVO, DANA, ShopeePay",
  },
  {
    id: "cash",
    label: "Tunai / Cash",
    icon: "💵",
    desc: "Bayar langsung di showroom",
  },
];

const AdminPaymentModal = ({
  vehicle,
  isDark,
  actionLoading,
  onClose,
  onConfirm,
  formatPrice,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  vehicle: any;
  isDark: boolean;
  actionLoading: boolean;
  onClose: () => void;
  onConfirm: (paymentMethod: string) => void;
  formatPrice: (n: number) => string;
}) => {
  const [selectedMethod, setSelectedMethod] = useState("transfer_bank");
  const [agreed, setAgreed] = useState(false);

  const adminFee = 2000000;
  const thumbnail = vehicle.images?.[0];
  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL_IMAGES || "http://localhost:8080";
  const getImageUrl = (url: string) =>
    url?.startsWith("http") ? url : baseUrl + url;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className={`relative w-full max-w-2xl max-h-[90vh] rounded-2xl overflow-hidden shadow-2xl flex flex-col ${
          isDark
            ? "bg-slate-900 border border-slate-700"
            : "bg-white border border-slate-200"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-5 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors"
          >
            <FiX className="text-lg" />
          </button>
          <div className="flex items-center gap-2 mb-1">
            <FiDollarSign className="text-white/70" />
            <span className="text-white/70 text-sm font-medium">
              Pembayaran
            </span>
          </div>
          <h2 className="text-xl font-black text-white">Tagihan Biaya Admin</h2>
          <p className="text-white/60 text-sm mt-0.5">
            Biaya pendaftaran kendaraan ke warehouse
          </p>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 p-6 space-y-5">
          {/* Vehicle Summary Card */}
          <div
            className={`flex gap-4 p-4 rounded-xl border ${isDark ? "bg-slate-800/50 border-slate-700/50" : "bg-slate-50 border-slate-200"}`}
          >
            <div className="w-20 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-slate-200 dark:bg-slate-700">
              {thumbnail ? (
                <img
                  src={getImageUrl(thumbnail)}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400 text-2xl">
                  🚗
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p
                className={`font-bold text-sm truncate ${isDark ? "text-white" : "text-slate-900"}`}
              >
                {vehicle.brandName} {vehicle.modelName} {vehicle.year}
              </p>
              <p
                className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}
              >
                {vehicle.licensePlate} &bull; {vehicle.color} &bull;{" "}
                {vehicle.barcode}
              </p>
              <p className="text-xs font-semibold text-emerald-500 mt-0.5">
                Harga: {formatPrice(vehicle.askingPrice)}
              </p>
            </div>
          </div>

          {/* Rincian Pembayaran */}
          <div>
            <h3
              className={`text-sm font-bold mb-3 flex items-center gap-2 ${isDark ? "text-white" : "text-slate-900"}`}
            >
              <FiFileText className="text-blue-500" /> Rincian Pembayaran
            </h3>
            <div
              className={`rounded-xl border divide-y ${isDark ? "bg-slate-800/30 border-slate-700/50 divide-slate-700/50" : "bg-white border-slate-200 divide-slate-100"}`}
            >
              <div className="flex justify-between items-center px-4 py-3">
                <span
                  className={`text-sm ${isDark ? "text-slate-300" : "text-slate-600"}`}
                >
                  Biaya Admin Warehouse
                </span>
                <span
                  className={`text-sm font-semibold ${isDark ? "text-white" : "text-slate-900"}`}
                >
                  {formatPrice(adminFee)}
                </span>
              </div>
              <div className="flex justify-between items-center px-4 py-3">
                <span
                  className={`text-sm ${isDark ? "text-slate-300" : "text-slate-600"}`}
                >
                  Biaya Registrasi Kendaraan
                </span>
                <span className={`text-sm font-medium text-emerald-500`}>
                  Gratis
                </span>
              </div>
              <div className="flex justify-between items-center px-4 py-3">
                <span
                  className={`text-sm ${isDark ? "text-slate-300" : "text-slate-600"}`}
                >
                  PPN (0%)
                </span>
                <span
                  className={`text-sm font-semibold ${isDark ? "text-white" : "text-slate-900"}`}
                >
                  {formatPrice(0)}
                </span>
              </div>
              <div
                className={`flex justify-between items-center px-4 py-3.5 ${isDark ? "bg-blue-500/10" : "bg-blue-50"}`}
              >
                <span
                  className={`text-sm font-bold ${isDark ? "text-blue-300" : "text-blue-700"}`}
                >
                  Total Pembayaran
                </span>
                <span
                  className={`text-lg font-black ${isDark ? "text-blue-300" : "text-blue-700"}`}
                >
                  {formatPrice(adminFee)}
                </span>
              </div>
            </div>
          </div>

          {/* Metode Pembayaran */}
          <div>
            <h3
              className={`text-sm font-bold mb-3 flex items-center gap-2 ${isDark ? "text-white" : "text-slate-900"}`}
            >
              <FiDollarSign className="text-blue-500" /> Metode Pembayaran
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {PAYMENT_METHODS.map((method) => (
                <button
                  key={method.id}
                  onClick={() => setSelectedMethod(method.id)}
                  className={`p-3 rounded-xl border-2 text-left transition-all ${
                    selectedMethod === method.id
                      ? isDark
                        ? "border-blue-500 bg-blue-500/10 ring-1 ring-blue-500/30"
                        : "border-blue-500 bg-blue-50 ring-1 ring-blue-500/30"
                      : isDark
                        ? "border-slate-700 hover:border-slate-600 bg-slate-800/50"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                  }`}
                >
                  <div className="text-xl mb-1">{method.icon}</div>
                  <p
                    className={`text-xs font-bold ${isDark ? "text-white" : "text-slate-900"}`}
                  >
                    {method.label}
                  </p>
                  <p
                    className={`text-[10px] mt-0.5 ${isDark ? "text-slate-500" : "text-slate-400"}`}
                  >
                    {method.desc}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Agreement Checkbox */}
          <label
            className={`flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-colors ${
              isDark
                ? "bg-slate-800/30 hover:bg-slate-800/60"
                : "bg-slate-50 hover:bg-slate-100"
            }`}
          >
            <input
              type="checkbox"
              checked={agreed}
              onChange={() => setAgreed(!agreed)}
              className="mt-0.5 w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 accent-blue-600"
            />
            <span
              className={`text-xs leading-relaxed ${isDark ? "text-slate-300" : "text-slate-600"}`}
            >
              Saya menyetujui pembayaran biaya admin sebesar{" "}
              <strong className={isDark ? "text-white" : "text-slate-900"}>
                {formatPrice(adminFee)}
              </strong>{" "}
              untuk pendaftaran kendaraan{" "}
              <strong className={isDark ? "text-white" : "text-slate-900"}>
                {vehicle.brandName} {vehicle.modelName} {vehicle.year}
              </strong>{" "}
              ke dalam sistem warehouse.
            </span>
          </label>
        </div>

        {/* Footer */}
        <div
          className={`px-6 py-4 border-t flex items-center justify-between gap-3 ${isDark ? "border-slate-800 bg-slate-900/80" : "border-slate-200 bg-slate-50"}`}
        >
          <button
            onClick={onClose}
            className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors ${
              isDark
                ? "bg-slate-800 hover:bg-slate-700 text-slate-300"
                : "bg-white hover:bg-slate-100 text-slate-600 border border-slate-200"
            }`}
          >
            Batal
          </button>
          <button
            onClick={() => onConfirm(selectedMethod)}
            disabled={!agreed || actionLoading}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-sm shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-0.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
          >
            {actionLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Memproses...
              </>
            ) : (
              <>
                <FiCheck /> Konfirmasi & Bayar {formatPrice(adminFee)}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

function InfoRow({
  label,
  value,
  isDark,
  mono,
}: {
  label: string;
  value: string;
  isDark: boolean;
  mono?: boolean;
}) {
  if (!value) return null;
  return (
    <div className="flex justify-between items-center text-sm py-2 border-b border-slate-100 dark:border-slate-700/50 last:border-0 last:pb-0">
      <span className={isDark ? "text-slate-400" : "text-slate-500"}>
        {label}
      </span>
      <span
        className={`font-semibold capitalize text-right max-w-[60%] break-words ${isDark ? "text-white" : "text-slate-900"} ${mono ? "font-mono uppercase tracking-wider text-xs" : ""}`}
      >
        {value}
      </span>
    </div>
  );
}

export default VehicleDetail;
