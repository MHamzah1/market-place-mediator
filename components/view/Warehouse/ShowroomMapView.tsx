"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/lib/state/store";
import {
  fetchShowroomView,
  fetchShowroomViewVehicle,
  markVehicleReadyAndPlace,
  publishVehicle,
  clearSuccess,
  clearError,
  clearShowroomViewVehicle,
  ShowroomViewVehicle,
  ShowroomViewVehicleDetail,
  ShowroomViewAction,
} from "@/lib/state/slice/warehouse/warehouseSlice";
import toast from "react-hot-toast";
import { useTheme } from "@/context/ThemeContext";
import { generateUrlWithEncryptedParams } from "@/lib/slug/slug";
import Link from "next/link";
import {
  FiSearch,
  FiX,
  FiMapPin,
  FiCalendar,
  FiUser,
  FiFileText,
  FiChevronLeft,
  FiChevronRight,
  FiEye,
  FiTool,
  FiClipboard,
  FiDollarSign,
  FiCheck,
  FiExternalLink,
  FiBarChart2,
  FiTag,
  FiRefreshCw,
  FiImage,
  FiMaximize2,
  FiMinimize2,
} from "react-icons/fi";
import { BsSpeedometer2, BsFuelPump, BsBuilding } from "react-icons/bs";
import { TbManualGearbox, TbCar } from "react-icons/tb";

// ============================
// CONFIGS
// ============================
const statusConfig: Record<
  string,
  { label: string; color: string; bg: string; dot: string }
> = {
  inspecting: {
    label: "Inspeksi",
    color: "text-yellow-600 dark:text-yellow-400",
    bg: "bg-yellow-500/10 border-yellow-500/30",
    dot: "bg-yellow-500",
  },
  registered: {
    label: "Terdaftar",
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-500/10 border-blue-500/30",
    dot: "bg-blue-500",
  },
  pending_payment: {
    label: "Menunggu Bayar",
    color: "text-indigo-600 dark:text-indigo-400",
    bg: "bg-indigo-500/10 border-indigo-500/30",
    dot: "bg-indigo-500",
  },
  in_warehouse: {
    label: "Di Gudang",
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-500/10 border-emerald-500/30",
    dot: "bg-emerald-500",
  },
  in_repair: {
    label: "Perbaikan",
    color: "text-orange-600 dark:text-orange-400",
    bg: "bg-orange-500/10 border-orange-500/30",
    dot: "bg-orange-500",
  },
  ready: {
    label: "Siap Jual",
    color: "text-green-600 dark:text-green-400",
    bg: "bg-green-500/10 border-green-500/30",
    dot: "bg-green-500",
  },
  listed: {
    label: "Di Marketplace",
    color: "text-purple-600 dark:text-purple-400",
    bg: "bg-purple-500/10 border-purple-500/30",
    dot: "bg-purple-500",
  },
  sold: {
    label: "Terjual",
    color: "text-cyan-600 dark:text-cyan-400",
    bg: "bg-cyan-500/10 border-cyan-500/30",
    dot: "bg-cyan-500",
  },
  rejected: {
    label: "Ditolak",
    color: "text-red-600 dark:text-red-400",
    bg: "bg-red-500/10 border-red-500/30",
    dot: "bg-red-500",
  },
};

const zoneTypeConfig: Record<
  string,
  {
    label: string;
    gradient: string;
    border: string;
    headerBg: string;
    iconColor: string;
    accentLight: string;
    accentDark: string;
  }
> = {
  ready: {
    label: "Ready / Siap Jual",
    gradient: "from-green-500/10 to-emerald-500/5",
    border: "border-green-500/40",
    headerBg: "bg-green-500",
    iconColor: "text-green-500",
    accentLight: "bg-green-50",
    accentDark: "bg-green-900/20",
  },
  light_repair: {
    label: "Repair Ringan",
    gradient: "from-yellow-500/10 to-amber-500/5",
    border: "border-yellow-500/40",
    headerBg: "bg-yellow-500",
    iconColor: "text-yellow-500",
    accentLight: "bg-yellow-50",
    accentDark: "bg-yellow-900/20",
  },
  heavy_repair: {
    label: "Repair Berat",
    gradient: "from-orange-500/10 to-red-500/5",
    border: "border-orange-500/40",
    headerBg: "bg-orange-500",
    iconColor: "text-orange-500",
    accentLight: "bg-orange-50",
    accentDark: "bg-orange-900/20",
  },
  holding: {
    label: "Holding Area",
    gradient: "from-blue-500/10 to-indigo-500/5",
    border: "border-blue-500/40",
    headerBg: "bg-blue-500",
    iconColor: "text-blue-500",
    accentLight: "bg-blue-50",
    accentDark: "bg-blue-900/20",
  },
  showroom_display: {
    label: "Display Showroom",
    gradient: "from-purple-500/10 to-pink-500/5",
    border: "border-purple-500/40",
    headerBg: "bg-purple-500",
    iconColor: "text-purple-500",
    accentLight: "bg-purple-50",
    accentDark: "bg-purple-900/20",
  },
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

const formatMileage = (m: number) =>
  new Intl.NumberFormat("id-ID").format(m) + " km";

// ============================
// MAIN COMPONENT
// ============================
const ShowroomMapView = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const {
    selectedShowroom,
    showroomView,
    showroomViewVehicleDetail,
    showroomViewLoading,
    actionLoading,
    error,
    successMessage,
  } = useSelector((state: RootState) => state.warehouse);

  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(
    null,
  );
  const [imageIndex, setImageIndex] = useState(0);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [expandedZones, setExpandedZones] = useState<Set<string>>(new Set());

  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL_IMAGES || "http://localhost:8080";

  // Load data
  const loadData = useCallback(() => {
    if (!selectedShowroom?.id) return;
    dispatch(
      fetchShowroomView({
        showroomId: selectedShowroom.id,
        params: {
          page: 1,
          perPage: 200,
          ...(search ? { search } : {}),
          sortBy: "createdAt",
          sortDirection: "DESC",
        },
      }),
    );
  }, [dispatch, selectedShowroom, search]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(clearSuccess());
      loadData();
      if (selectedVehicleId) {
        dispatch(fetchShowroomViewVehicle(selectedVehicleId));
      }
    }
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [successMessage, error, dispatch, loadData, selectedVehicleId]);

  const openVehicleDetail = (vehicleId: string) => {
    setSelectedVehicleId(vehicleId);
    setImageIndex(0);
    dispatch(fetchShowroomViewVehicle(vehicleId));
  };

  const closeVehicleDetail = () => {
    setSelectedVehicleId(null);
    dispatch(clearShowroomViewVehicle());
  };

  const toggleZoneExpand = (zoneId: string) => {
    setExpandedZones((prev) => {
      const next = new Set(prev);
      if (next.has(zoneId)) next.delete(zoneId);
      else next.add(zoneId);
      return next;
    });
  };

  const vehicles = showroomView?.vehicles || [];
  const zones = showroomView?.zones || [];
  const showroom = showroomView?.showroom;

  // Group vehicles by zone
  const vehiclesByZone = new Map<string, ShowroomViewVehicle[]>();
  const unassignedVehicles: ShowroomViewVehicle[] = [];
  vehicles.forEach((v) => {
    if (v.currentZone) {
      const arr = vehiclesByZone.get(v.currentZone.id) || [];
      arr.push(v);
      vehiclesByZone.set(v.currentZone.id, arr);
    } else {
      unassignedVehicles.push(v);
    }
  });

  if (!selectedShowroom) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <BsBuilding className="text-6xl text-slate-400" />
        <p
          className={`text-lg font-medium ${isDark ? "text-slate-400" : "text-slate-500"}`}
        >
          Pilih showroom terlebih dahulu dari sidebar
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-[1800px] mx-auto">
      {/* ============ HEADER ============ */}
      <div
        className={`rounded-2xl border overflow-hidden ${isDark ? "bg-slate-800/50 border-slate-700/50" : "bg-white border-slate-200"}`}
      >
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-5">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <FiMapPin className="text-white/80" />
                <span className="text-white/70 text-sm font-medium">
                  Floor Map View
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-white">
                {showroom?.name || selectedShowroom.name}
              </h1>
              <p className="text-white/70 text-sm mt-1">
                {showroom?.city || selectedShowroom.city},{" "}
                {showroom?.province || selectedShowroom.province} &bull;{" "}
                {vehicles.length} kendaraan di {zones.length} zona
              </p>
            </div>
            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Cari kendaraan..."
                  className="pl-9 pr-8 py-2 rounded-xl bg-white/20 text-white placeholder-white/50 text-sm border border-white/20 focus:border-white/40 outline-none backdrop-blur-sm w-56"
                />
                {searchInput && (
                  <button
                    onClick={() => setSearchInput("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
                  >
                    <FiX className="text-sm" />
                  </button>
                )}
              </div>
              <button
                onClick={loadData}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-medium text-sm transition-colors backdrop-blur-sm"
              >
                <FiRefreshCw
                  className={showroomViewLoading ? "animate-spin" : ""}
                />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div
          className={`px-6 py-3 flex flex-wrap items-center gap-4 ${isDark ? "bg-slate-800/30" : "bg-slate-50"}`}
        >
          <span
            className={`text-xs font-semibold ${isDark ? "text-slate-500" : "text-slate-400"}`}
          >
            ZONA:
          </span>
          {Object.entries(zoneTypeConfig).map(([type, cfg]) => (
            <div key={type} className="flex items-center gap-1.5">
              <span className={`w-3 h-3 rounded-sm ${cfg.headerBg}`} />
              <span
                className={`text-xs font-medium ${isDark ? "text-slate-400" : "text-slate-500"}`}
              >
                {cfg.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ============ LOADING ============ */}
      {showroomViewLoading && vehicles.length === 0 && (
        <div className="flex items-center justify-center py-24">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent" />
            <p
              className={`text-sm font-medium ${isDark ? "text-slate-400" : "text-slate-500"}`}
            >
              Memuat peta showroom...
            </p>
          </div>
        </div>
      )}

      {/* ============ FLOOR MAP ============ */}
      {!showroomViewLoading || vehicles.length > 0 ? (
        <div className="space-y-5">
          {/* Zone Areas */}
          {zones.map((zone) => {
            const cfg = zoneTypeConfig[zone.type] || zoneTypeConfig.holding;
            const zoneVehicles = vehiclesByZone.get(zone.id) || [];
            const pct =
              zone.capacity > 0
                ? Math.round((zone.currentCount / zone.capacity) * 100)
                : 0;
            const isExpanded = expandedZones.has(zone.id);
            const displayVehicles = isExpanded
              ? zoneVehicles
              : zoneVehicles.slice(0, 12);

            return (
              <div
                key={zone.id}
                className={`rounded-2xl border-2 overflow-hidden transition-all ${cfg.border} ${isDark ? "bg-slate-900/50" : "bg-white"}`}
              >
                {/* Zone Header */}
                <div
                  className={`${cfg.headerBg} px-5 py-3 flex items-center justify-between`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                      <FiMapPin className="text-white text-sm" />
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-sm">
                        {zone.name}
                      </h3>
                      <p className="text-white/70 text-xs">
                        {zone.code} &bull; {cfg.label}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {/* Capacity Bar */}
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 rounded-full bg-white/20 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${pct >= 90 ? "bg-red-300" : "bg-white/70"}`}
                          style={{ width: `${Math.min(pct, 100)}%` }}
                        />
                      </div>
                      <span className="text-white/90 text-xs font-bold">
                        {zone.currentCount}/{zone.capacity}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Zone Floor — Parking Grid */}
                <div className={`p-4 bg-gradient-to-br ${cfg.gradient}`}>
                  {zoneVehicles.length === 0 ? (
                    <div
                      className={`flex flex-col items-center justify-center py-10 rounded-xl border-2 border-dashed ${isDark ? "border-slate-700 text-slate-600" : "border-slate-200 text-slate-400"}`}
                    >
                      <TbCar className="text-4xl mb-2 opacity-40" />
                      <p className="text-sm font-medium">Zona kosong</p>
                      <p className="text-xs opacity-70">
                        Belum ada kendaraan di zona ini
                      </p>
                    </div>
                  ) : (
                    <>
                      {/* Parking Slots Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
                        {displayVehicles.map((vehicle) => (
                          <ParkingSlot
                            key={vehicle.id}
                            vehicle={vehicle}
                            isDark={isDark}
                            baseUrl={baseUrl}
                            onClick={() => openVehicleDetail(vehicle.id)}
                          />
                        ))}

                        {/* Empty Parking Slots */}
                        {Array.from({
                          length: Math.max(
                            0,
                            Math.min(
                              zone.capacity - zoneVehicles.length,
                              isExpanded
                                ? zone.capacity - zoneVehicles.length
                                : Math.min(
                                    4,
                                    zone.capacity - zoneVehicles.length,
                                  ),
                            ),
                          ),
                        }).map((_, i) => (
                          <div
                            key={`empty-${i}`}
                            className={`rounded-xl border-2 border-dashed aspect-[4/3] flex items-center justify-center ${isDark ? "border-slate-700/50" : "border-slate-200/80"}`}
                          >
                            <TbCar
                              className={`text-2xl ${isDark ? "text-slate-700" : "text-slate-200"}`}
                            />
                          </div>
                        ))}
                      </div>

                      {/* Show more / less */}
                      {zoneVehicles.length > 12 && (
                        <button
                          onClick={() => toggleZoneExpand(zone.id)}
                          className={`mt-3 flex items-center gap-1.5 mx-auto px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                            isDark
                              ? "bg-slate-800 text-slate-400 hover:text-white"
                              : "bg-white text-slate-500 hover:text-slate-700"
                          } border ${isDark ? "border-slate-700" : "border-slate-200"}`}
                        >
                          {isExpanded ? (
                            <>
                              <FiMinimize2 /> Tampilkan Lebih Sedikit
                            </>
                          ) : (
                            <>
                              <FiMaximize2 /> Lihat Semua ({zoneVehicles.length}
                              )
                            </>
                          )}
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })}

          {/* Unassigned Vehicles */}
          {unassignedVehicles.length > 0 && (
            <div
              className={`rounded-2xl border-2 border-dashed overflow-hidden ${isDark ? "border-slate-600" : "border-slate-300"}`}
            >
              <div
                className={`px-5 py-3 flex items-center justify-between ${isDark ? "bg-slate-800" : "bg-slate-100"}`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${isDark ? "bg-slate-700" : "bg-slate-200"}`}
                  >
                    <FiMapPin
                      className={`text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}
                    />
                  </div>
                  <div>
                    <h3
                      className={`font-bold text-sm ${isDark ? "text-slate-300" : "text-slate-700"}`}
                    >
                      Belum Ditempakan
                    </h3>
                    <p
                      className={`text-xs ${isDark ? "text-slate-500" : "text-slate-400"}`}
                    >
                      Kendaraan belum ditempatkan di zona manapun
                    </p>
                  </div>
                </div>
                <span
                  className={`text-xs font-bold px-2.5 py-1 rounded-lg ${isDark ? "bg-slate-700 text-slate-400" : "bg-white text-slate-500"}`}
                >
                  {unassignedVehicles.length} unit
                </span>
              </div>
              <div
                className={`p-4 ${isDark ? "bg-slate-800/30" : "bg-slate-50/50"}`}
              >
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
                  {unassignedVehicles.map((vehicle) => (
                    <ParkingSlot
                      key={vehicle.id}
                      vehicle={vehicle}
                      isDark={isDark}
                      baseUrl={baseUrl}
                      onClick={() => openVehicleDetail(vehicle.id)}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* No zones and no vehicles */}
          {zones.length === 0 &&
            vehicles.length === 0 &&
            !showroomViewLoading && (
              <div className="flex flex-col items-center justify-center py-24 gap-4">
                <FiMapPin className="text-5xl text-slate-400" />
                <p
                  className={`text-lg font-medium ${isDark ? "text-slate-400" : "text-slate-500"}`}
                >
                  Belum ada zona atau kendaraan
                </p>
                <p
                  className={`text-sm ${isDark ? "text-slate-500" : "text-slate-400"}`}
                >
                  Buat zona terlebih dahulu untuk memulai
                </p>
              </div>
            )}
        </div>
      ) : null}

      {/* ============ VEHICLE DETAIL MODAL ============ */}
      {selectedVehicleId && (
        <VehicleDetailModal
          detail={showroomViewVehicleDetail}
          loading={showroomViewLoading}
          actionLoading={actionLoading}
          isDark={isDark}
          baseUrl={baseUrl}
          imageIndex={imageIndex}
          setImageIndex={setImageIndex}
          zones={zones}
          onClose={closeVehicleDetail}
          dispatch={dispatch}
        />
      )}
    </div>
  );
};

// ============================
// PARKING SLOT - Vehicle Card on Map
// ============================
const ParkingSlot = ({
  vehicle,
  isDark,
  baseUrl,
  onClick,
}: {
  vehicle: ShowroomViewVehicle;
  isDark: boolean;
  baseUrl: string;
  onClick: () => void;
}) => {
  const sc = statusConfig[vehicle.status] || {
    label: vehicle.status,
    dot: "bg-slate-400",
  };
  const getImageUrl = (url: string) =>
    url?.startsWith("http") ? url : baseUrl + url;

  const thumbnail = vehicle.thumbnail || vehicle.images?.[0];

  return (
    <button
      onClick={onClick}
      className={`group relative rounded-xl overflow-hidden border transition-all hover:shadow-lg hover:-translate-y-0.5 cursor-pointer text-left ${
        isDark
          ? "bg-slate-800 border-slate-700 hover:border-emerald-500/50"
          : "bg-white border-slate-200 hover:border-emerald-500/50"
      }`}
    >
      {/* Thumbnail */}
      <div className="aspect-[4/3] relative overflow-hidden bg-slate-100 dark:bg-slate-900">
        {thumbnail ? (
          <img
            src={getImageUrl(thumbnail)}
            alt={`${vehicle.brandName} ${vehicle.modelName}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <TbCar
              className={`text-3xl ${isDark ? "text-slate-700" : "text-slate-300"}`}
            />
          </div>
        )}

        {/* Status Dot */}
        <div className="absolute top-1.5 right-1.5">
          <span
            className={`block w-2.5 h-2.5 rounded-full ${sc.dot} ring-2 ring-white dark:ring-slate-900`}
            title={sc.label}
          />
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
          <FiEye className="text-white text-xl opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>

      {/* Info */}
      <div className="p-2">
        <p
          className={`text-[10px] font-bold truncate ${isDark ? "text-slate-200" : "text-slate-800"}`}
        >
          {vehicle.brandName} {vehicle.modelName}
        </p>
        <p
          className={`text-[9px] truncate ${isDark ? "text-slate-500" : "text-slate-400"}`}
        >
          {vehicle.year} &bull; {vehicle.color}
        </p>
        <p className="text-[9px] font-bold text-emerald-500 truncate">
          {formatPrice(vehicle.askingPrice)}
        </p>
      </div>

      {/* License Plate Ribbon */}
      <div
        className={`absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded text-[8px] font-bold ${
          isDark ? "bg-black/60 text-white" : "bg-white/90 text-slate-700"
        } backdrop-blur-sm`}
      >
        {vehicle.licensePlate}
      </div>
    </button>
  );
};

// ============================
// VEHICLE DETAIL MODAL
// ============================
const VehicleDetailModal = ({
  detail,
  loading,
  actionLoading,
  isDark,
  baseUrl,
  imageIndex,
  setImageIndex,
  zones,
  onClose,
  dispatch,
}: {
  detail: ShowroomViewVehicleDetail | null;
  loading: boolean;
  actionLoading: boolean;
  isDark: boolean;
  baseUrl: string;
  imageIndex: number;
  setImageIndex: (i: number) => void;
  zones: Array<{
    id: string;
    code: string;
    name: string;
    type: string;
    capacity: number;
    currentCount: number;
  }>;
  onClose: () => void;
  dispatch: AppDispatch;
}) => {
  const [activeTab, setActiveTab] = useState<
    "info" | "inspection" | "repair" | "history"
  >("info");
  const getImageUrl = (url: string) =>
    url?.startsWith("http") ? url : baseUrl + url;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className={`relative w-full max-w-5xl max-h-[92vh] rounded-2xl overflow-hidden shadow-2xl flex flex-col ${
          isDark
            ? "bg-slate-900 border border-slate-700"
            : "bg-white border border-slate-200"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 z-10 w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
            isDark
              ? "bg-slate-800 hover:bg-slate-700 text-slate-400"
              : "bg-slate-100 hover:bg-slate-200 text-slate-500"
          }`}
        >
          <FiX className="text-xl" />
        </button>

        {/* Loading */}
        {loading && !detail && (
          <div className="flex items-center justify-center py-32">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent" />
          </div>
        )}

        {detail && (
          <div className="overflow-y-auto flex-1">
            {/* Hero */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              {/* Image Gallery */}
              <div className="relative bg-slate-100 dark:bg-slate-950">
                {detail.vehicle.images && detail.vehicle.images.length > 0 ? (
                  <>
                    <div className="aspect-[16/11] overflow-hidden">
                      <img
                        src={getImageUrl(detail.vehicle.images[imageIndex])}
                        alt={`${detail.vehicle.brandName} ${detail.vehicle.modelName}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {detail.vehicle.images.length > 1 && (
                      <div className="flex gap-2 p-3 overflow-x-auto">
                        {detail.vehicle.images.map((img, i) => (
                          <button
                            key={i}
                            onClick={() => setImageIndex(i)}
                            className={`w-16 h-12 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${
                              i === imageIndex
                                ? "border-emerald-500 shadow-lg"
                                : "border-transparent opacity-60 hover:opacity-100"
                            }`}
                          >
                            <img
                              src={getImageUrl(img)}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    )}
                    {detail.vehicle.images.length > 1 && (
                      <>
                        <button
                          onClick={() =>
                            setImageIndex(
                              imageIndex > 0
                                ? imageIndex - 1
                                : detail.vehicle.images!.length - 1,
                            )
                          }
                          className="absolute left-3 top-1/3 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
                        >
                          <FiChevronLeft />
                        </button>
                        <button
                          onClick={() =>
                            setImageIndex(
                              imageIndex < detail.vehicle.images!.length - 1
                                ? imageIndex + 1
                                : 0,
                            )
                          }
                          className="absolute right-3 top-1/3 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
                        >
                          <FiChevronRight />
                        </button>
                      </>
                    )}
                  </>
                ) : (
                  <div className="aspect-[16/11] flex items-center justify-center">
                    <FiImage className="text-6xl text-slate-400" />
                  </div>
                )}
              </div>

              {/* Vehicle Info */}
              <div className="p-6 flex flex-col">
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  {(() => {
                    const sc = statusConfig[detail.vehicle.status] || {
                      label: detail.vehicle.status,
                      color: "text-slate-500",
                      bg: "bg-slate-100 border-slate-300",
                      dot: "bg-slate-400",
                    };
                    return (
                      <span
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold border ${sc.bg} ${sc.color}`}
                      >
                        <span className={`w-2 h-2 rounded-full ${sc.dot}`} />{" "}
                        {sc.label}
                      </span>
                    );
                  })()}
                  <span
                    className={`font-mono text-xs px-2.5 py-1 rounded-lg border ${isDark ? "bg-slate-800 border-slate-700 text-slate-400" : "bg-slate-50 border-slate-200 text-slate-500"}`}
                  >
                    {detail.vehicle.barcode}
                  </span>
                </div>

                <h2
                  className={`text-2xl font-black mb-1 ${isDark ? "text-white" : "text-slate-900"}`}
                >
                  {detail.vehicle.brandName} {detail.vehicle.modelName}
                </h2>
                <p
                  className={`text-lg ${isDark ? "text-emerald-400" : "text-emerald-600"}`}
                >
                  {detail.vehicle.year} &bull; {detail.vehicle.color}
                </p>

                <div className="mt-4 mb-4">
                  <p
                    className={`text-sm ${isDark ? "text-slate-500" : "text-slate-400"}`}
                  >
                    Harga Permintaan
                  </p>
                  <p
                    className={`text-3xl font-black ${isDark ? "text-white" : "text-slate-900"}`}
                  >
                    {formatPrice(detail.vehicle.askingPrice)}
                  </p>
                </div>

                <div
                  className={`grid grid-cols-2 gap-3 p-4 rounded-xl mb-4 ${isDark ? "bg-slate-800/50" : "bg-slate-50"}`}
                >
                  <div className="flex items-center gap-2">
                    <BsSpeedometer2 className="text-emerald-500" />
                    <div>
                      <p
                        className={`text-[10px] ${isDark ? "text-slate-500" : "text-slate-400"}`}
                      >
                        Kilometer
                      </p>
                      <p
                        className={`text-sm font-bold ${isDark ? "text-white" : "text-slate-900"}`}
                      >
                        {formatMileage(detail.vehicle.mileage)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <TbManualGearbox className="text-emerald-500" />
                    <div>
                      <p
                        className={`text-[10px] ${isDark ? "text-slate-500" : "text-slate-400"}`}
                      >
                        Transmisi
                      </p>
                      <p
                        className={`text-sm font-bold ${isDark ? "text-white" : "text-slate-900"}`}
                      >
                        {detail.vehicle.transmission === "matic"
                          ? "Matic"
                          : "Manual"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <BsFuelPump className="text-emerald-500" />
                    <div>
                      <p
                        className={`text-[10px] ${isDark ? "text-slate-500" : "text-slate-400"}`}
                      >
                        Bahan Bakar
                      </p>
                      <p
                        className={`text-sm font-bold ${isDark ? "text-white" : "text-slate-900"}`}
                      >
                        {detail.vehicle.fuelType}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiCalendar className="text-emerald-500" />
                    <div>
                      <p
                        className={`text-[10px] ${isDark ? "text-slate-500" : "text-slate-400"}`}
                      >
                        Tahun
                      </p>
                      <p
                        className={`text-sm font-bold ${isDark ? "text-white" : "text-slate-900"}`}
                      >
                        {detail.vehicle.year}
                      </p>
                    </div>
                  </div>
                </div>

                {detail.currentZone && (
                  <div
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg mb-4 ${isDark ? "bg-emerald-500/10 border border-emerald-500/20" : "bg-emerald-50 border border-emerald-200"}`}
                  >
                    <FiMapPin className="text-emerald-500" />
                    <span
                      className={`text-sm font-medium ${isDark ? "text-emerald-400" : "text-emerald-700"}`}
                    >
                      Zona: {detail.currentZone.name} ({detail.currentZone.code}
                      )
                    </span>
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-wrap gap-2 mt-auto">
                  {detail.actions.map((action) => (
                    <ActionButton
                      key={action.key}
                      action={action}
                      vehicle={detail.vehicle}
                      actionLoading={actionLoading}
                    />
                  ))}
                  {(detail.vehicle.status === "in_warehouse" ||
                    detail.vehicle.status === "in_repair") && (
                    <>
                      <Link
                        href={generateUrlWithEncryptedParams(
                          "/warehouse/repairs/create",
                          { vehicleId: detail.vehicle.id },
                        )}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-500/15 text-orange-600 dark:text-orange-400 font-semibold text-sm hover:bg-orange-500/25 transition-colors border border-orange-500/30"
                      >
                        <FiTool /> Repair
                      </Link>
                      <button
                        onClick={() => {
                          const readyZone = zones.find(
                            (z) => z.type === "ready",
                          );
                          if (readyZone) {
                            dispatch(
                              markVehicleReadyAndPlace({
                                vehicleId: detail.vehicle.id,
                                zoneId: readyZone.id,
                              }),
                            );
                          } else {
                            toast.error("Zona ready belum tersedia.");
                          }
                        }}
                        disabled={actionLoading}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500/15 text-green-600 dark:text-green-400 font-semibold text-sm hover:bg-green-500/25 transition-colors border border-green-500/30 disabled:opacity-50"
                      >
                        <FiCheck /> Sudah Siap Jual
                      </button>
                    </>
                  )}
                  {detail.vehicle.status === "ready" && (
                    <button
                      onClick={() =>
                        dispatch(publishVehicle(detail.vehicle.id))
                      }
                      disabled={actionLoading}
                      className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-sm shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:-translate-y-0.5 transition-all disabled:opacity-50"
                    >
                      <FiExternalLink /> Publish Marketplace
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div
              className={`border-t ${isDark ? "border-slate-800" : "border-slate-200"}`}
            >
              <div className="flex overflow-x-auto">
                {[
                  { key: "info", label: "Informasi", icon: FiFileText },
                  { key: "inspection", label: "Inspeksi", icon: FiClipboard },
                  { key: "repair", label: "Perbaikan", icon: FiTool },
                  { key: "history", label: "Riwayat", icon: FiBarChart2 },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key as typeof activeTab)}
                    className={`flex items-center gap-2 px-5 py-3.5 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
                      activeTab === tab.key
                        ? "border-emerald-500 text-emerald-600 dark:text-emerald-400"
                        : `border-transparent ${isDark ? "text-slate-500 hover:text-slate-300" : "text-slate-400 hover:text-slate-600"}`
                    }`}
                  >
                    <tab.icon /> {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === "info" && (
                <InfoTab detail={detail} isDark={isDark} />
              )}
              {activeTab === "inspection" && (
                <InspectionTab
                  inspections={detail.inspections}
                  isDark={isDark}
                />
              )}
              {activeTab === "repair" && (
                <RepairTab repairs={detail.repairs} isDark={isDark} />
              )}
              {activeTab === "history" && (
                <HistoryTab detail={detail} isDark={isDark} />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ============================
// ACTION BUTTON
// ============================
const ActionButton = ({
  action,
  vehicle,
  actionLoading,
}: {
  action: ShowroomViewAction;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  vehicle: any;
  actionLoading: boolean;
}) => {
  const buttonStyles: Record<string, string> = {
    submit_inspection:
      "bg-yellow-500/15 text-yellow-600 dark:text-yellow-400 border-yellow-500/30 hover:bg-yellow-500/25",
    view_listing:
      "bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30 hover:bg-purple-500/25",
    create_payment:
      "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30 hover:bg-blue-500/25",
    create_repair:
      "bg-orange-500/15 text-orange-600 dark:text-orange-400 border-orange-500/30 hover:bg-orange-500/25",
  };
  const icons: Record<string, React.ReactNode> = {
    submit_inspection: <FiClipboard />,
    view_listing: <FiEye />,
    create_payment: <FiDollarSign />,
    create_repair: <FiTool />,
  };
  const style =
    buttonStyles[action.key] ||
    "bg-slate-500/15 text-slate-600 dark:text-slate-400 border-slate-500/30 hover:bg-slate-500/25";

  if (action.key === "submit_inspection") {
    return (
      <Link
        href={generateUrlWithEncryptedParams("/warehouse/inspections/create", {
          vehicleId: vehicle.id,
        })}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-colors border ${style}`}
      >
        {icons[action.key]} {action.label}
      </Link>
    );
  }
  if (action.key === "view_listing" && vehicle.listingId) {
    return (
      <Link
        href={`/marketplace/${vehicle.listingId}`}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-colors border ${style}`}
      >
        {icons[action.key]} {action.label}
      </Link>
    );
  }
  return (
    <button
      disabled={actionLoading}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-colors border disabled:opacity-50 ${style}`}
    >
      {icons[action.key] || <FiEye />} {action.label}
    </button>
  );
};

// ============================
// INFO TAB
// ============================
const InfoTab = ({
  detail,
  isDark,
}: {
  detail: ShowroomViewVehicleDetail;
  isDark: boolean;
}) => {
  const v = detail.vehicle;
  const cardClass = `rounded-xl border p-4 ${isDark ? "bg-slate-800/50 border-slate-700/50" : "bg-slate-50 border-slate-200"}`;
  const labelClass = `text-xs font-medium ${isDark ? "text-slate-500" : "text-slate-400"}`;
  const valueClass = `text-sm font-semibold ${isDark ? "text-white" : "text-slate-900"}`;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className={cardClass}>
        <h4
          className={`flex items-center gap-2 text-sm font-bold mb-4 ${isDark ? "text-emerald-400" : "text-emerald-600"}`}
        >
          <FiTag /> Detail Kendaraan
        </h4>
        <div className="space-y-3">
          {[
            { label: "Plat Nomor", value: v.licensePlate },
            { label: "No. Rangka", value: v.chassisNumber },
            { label: "No. Mesin", value: v.engineNumber },
            { label: "Kondisi", value: v.condition },
            { label: "Kepemilikan", value: v.ownershipStatus },
            { label: "Pajak", value: v.taxStatus },
            { label: "Warna", value: v.color },
          ].map((item) => (
            <div key={item.label} className="flex justify-between items-center">
              <span className={labelClass}>{item.label}</span>
              <span className={valueClass}>{item.value || "-"}</span>
            </div>
          ))}
        </div>
      </div>

      <div className={cardClass}>
        <h4
          className={`flex items-center gap-2 text-sm font-bold mb-4 ${isDark ? "text-emerald-400" : "text-emerald-600"}`}
        >
          <FiUser /> Informasi Penjual
        </h4>
        <div className="space-y-3">
          {[
            { label: "Nama", value: v.sellerName },
            { label: "Telepon", value: v.sellerPhone },
            { label: "WhatsApp", value: v.sellerWhatsapp },
            { label: "KTP", value: v.sellerKtp },
            {
              label: "Lokasi",
              value:
                v.locationCity && v.locationProvince
                  ? `${v.locationCity}, ${v.locationProvince}`
                  : "-",
            },
          ].map((item) => (
            <div key={item.label} className="flex justify-between items-center">
              <span className={labelClass}>{item.label}</span>
              <span className={valueClass}>{item.value || "-"}</span>
            </div>
          ))}
        </div>
      </div>

      {v.description && (
        <div className={`${cardClass} md:col-span-2`}>
          <h4
            className={`flex items-center gap-2 text-sm font-bold mb-3 ${isDark ? "text-emerald-400" : "text-emerald-600"}`}
          >
            <FiFileText /> Deskripsi
          </h4>
          <p
            className={`text-sm whitespace-pre-line ${isDark ? "text-slate-300" : "text-slate-600"}`}
          >
            {v.description}
          </p>
        </div>
      )}

      {v.notes && (
        <div className={`${cardClass} md:col-span-2`}>
          <h4
            className={`flex items-center gap-2 text-sm font-bold mb-3 ${isDark ? "text-yellow-400" : "text-yellow-600"}`}
          >
            <FiFileText /> Catatan Internal
          </h4>
          <p
            className={`text-sm whitespace-pre-line ${isDark ? "text-slate-300" : "text-slate-600"}`}
          >
            {v.notes}
          </p>
        </div>
      )}

      {v.variant && (
        <div className={cardClass}>
          <h4
            className={`flex items-center gap-2 text-sm font-bold mb-4 ${isDark ? "text-emerald-400" : "text-emerald-600"}`}
          >
            <FiBarChart2 /> Referensi Harga
          </h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className={labelClass}>Varian</span>
              <span className={valueClass}>{v.variant.variantName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className={labelClass}>Kode Varian</span>
              <span className={valueClass}>{v.variant.variantCode}</span>
            </div>
            {v.yearPrice && (
              <div className="flex justify-between items-center">
                <span className={labelClass}>Harga Pasaran</span>
                <span className={valueClass}>
                  {formatPrice(v.yearPrice.basePrice)}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {v.showroom && (
        <div className={cardClass}>
          <h4
            className={`flex items-center gap-2 text-sm font-bold mb-4 ${isDark ? "text-emerald-400" : "text-emerald-600"}`}
          >
            <BsBuilding /> Showroom
          </h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className={labelClass}>Nama</span>
              <span className={valueClass}>{v.showroom.name}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className={labelClass}>Kode</span>
              <span className={valueClass}>{v.showroom.code}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className={labelClass}>Lokasi</span>
              <span className={valueClass}>
                {v.showroom.city}, {v.showroom.province}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================
// INSPECTION TAB
// ============================
const InspectionTab = ({
  inspections,
  isDark,
}: {
  inspections: Array<{
    id: string;
    inspectionType?: string;
    overallResult?: string;
    documentStatus?: string;
    exteriorScore?: number;
    interiorScore?: number;
    engineScore?: number;
    electricalScore?: number;
    chassisScore?: number;
    hasBpkb?: boolean;
    hasStnk?: boolean;
    hasFaktur?: boolean;
    hasKtp?: boolean;
    hasSpareKey?: boolean;
    repairNotes?: string;
    rejectionReason?: string;
    inspectedAt?: string;
    createdAt?: string;
  }>;
  isDark: boolean;
}) => {
  if (!inspections || inspections.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-2">
        <FiClipboard
          className={`text-4xl ${isDark ? "text-slate-600" : "text-slate-300"}`}
        />
        <p
          className={`text-sm ${isDark ? "text-slate-500" : "text-slate-400"}`}
        >
          Belum ada data inspeksi
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {inspections.map((insp) => (
        <div
          key={insp.id}
          className={`rounded-xl border p-5 ${isDark ? "bg-slate-800/50 border-slate-700/50" : "bg-slate-50 border-slate-200"}`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span
                className={`px-2.5 py-0.5 rounded-lg text-xs font-bold ${
                  insp.overallResult === "pass"
                    ? "bg-green-500/15 text-green-600 dark:text-green-400"
                    : insp.overallResult === "fail"
                      ? "bg-red-500/15 text-red-600 dark:text-red-400"
                      : "bg-yellow-500/15 text-yellow-600 dark:text-yellow-400"
                }`}
              >
                {insp.overallResult === "pass"
                  ? "Lulus"
                  : insp.overallResult === "fail"
                    ? "Gagal"
                    : insp.overallResult || "Pending"}
              </span>
              <span
                className={`text-xs ${isDark ? "text-slate-500" : "text-slate-400"}`}
              >
                {insp.inspectionType}
              </span>
            </div>
            <span
              className={`text-xs ${isDark ? "text-slate-500" : "text-slate-400"}`}
            >
              {insp.inspectedAt
                ? formatDate(insp.inspectedAt)
                : insp.createdAt
                  ? formatDate(insp.createdAt)
                  : "-"}
            </span>
          </div>

          {/* Scores */}
          <div className="grid grid-cols-5 gap-3">
            {[
              { label: "Eksterior", score: insp.exteriorScore },
              { label: "Interior", score: insp.interiorScore },
              { label: "Mesin", score: insp.engineScore },
              { label: "Kelistrikan", score: insp.electricalScore },
              { label: "Sasis", score: insp.chassisScore },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p
                  className={`text-[10px] ${isDark ? "text-slate-500" : "text-slate-400"}`}
                >
                  {s.label}
                </p>
                <p
                  className={`text-lg font-black ${
                    (s.score ?? 0) >= 80
                      ? "text-green-500"
                      : (s.score ?? 0) >= 60
                        ? "text-yellow-500"
                        : "text-red-500"
                  }`}
                >
                  {s.score ?? "-"}
                </p>
              </div>
            ))}
          </div>

          {/* Documents */}
          <div className="mt-4 flex flex-wrap gap-2">
            {[
              { label: "BPKB", has: insp.hasBpkb },
              { label: "STNK", has: insp.hasStnk },
              { label: "Faktur", has: insp.hasFaktur },
              { label: "KTP", has: insp.hasKtp },
              { label: "Kunci Cadangan", has: insp.hasSpareKey },
            ].map((doc) => (
              <span
                key={doc.label}
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${
                  doc.has
                    ? "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20"
                    : `${isDark ? "bg-slate-700/50 text-slate-500 border-slate-600" : "bg-slate-100 text-slate-400 border-slate-200"}`
                }`}
              >
                {doc.has ? "✓" : "✗"} {doc.label}
              </span>
            ))}
          </div>

          {insp.repairNotes && (
            <p
              className={`mt-3 text-xs p-2 rounded-lg ${isDark ? "bg-yellow-900/20 text-yellow-400" : "bg-yellow-50 text-yellow-700"}`}
            >
              Catatan: {insp.repairNotes}
            </p>
          )}
          {insp.rejectionReason && (
            <p
              className={`mt-2 text-xs p-2 rounded-lg ${isDark ? "bg-red-900/20 text-red-400" : "bg-red-50 text-red-700"}`}
            >
              Alasan Ditolak: {insp.rejectionReason}
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

// ============================
// REPAIR TAB
// ============================
const RepairTab = ({
  repairs,
  isDark,
}: {
  repairs: Array<{
    id: string;
    repairType?: string;
    status?: string;
    totalCost?: number;
    description?: string;
    diagnosisNotes?: string;
    startedAt?: string;
    completedAt?: string;
    createdAt?: string;
    items?: Array<{
      id: string;
      itemName: string;
      itemType: string;
      quantity: number;
      unitPrice: number;
      totalPrice: number;
    }>;
  }>;
  isDark: boolean;
}) => {
  if (!repairs || repairs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-2">
        <FiTool
          className={`text-4xl ${isDark ? "text-slate-600" : "text-slate-300"}`}
        />
        <p
          className={`text-sm ${isDark ? "text-slate-500" : "text-slate-400"}`}
        >
          Belum ada data perbaikan
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {repairs.map((repair) => (
        <div
          key={repair.id}
          className={`rounded-xl border p-5 ${isDark ? "bg-slate-800/50 border-slate-700/50" : "bg-slate-50 border-slate-200"}`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span
                className={`px-2.5 py-0.5 rounded-lg text-xs font-bold ${
                  repair.status === "completed"
                    ? "bg-green-500/15 text-green-600 dark:text-green-400"
                    : repair.status === "in_progress"
                      ? "bg-blue-500/15 text-blue-600 dark:text-blue-400"
                      : "bg-yellow-500/15 text-yellow-600 dark:text-yellow-400"
                }`}
              >
                {repair.status === "completed"
                  ? "Selesai"
                  : repair.status === "in_progress"
                    ? "Sedang Dikerjakan"
                    : repair.status || "Pending"}
              </span>
              <span
                className={`text-xs ${isDark ? "text-slate-500" : "text-slate-400"}`}
              >
                {repair.repairType === "light" ? "Ringan" : "Berat"}
              </span>
            </div>
            {repair.totalCost != null && (
              <span className="text-sm font-bold text-emerald-500">
                {formatPrice(repair.totalCost)}
              </span>
            )}
          </div>

          {repair.description && (
            <p
              className={`text-sm mb-2 ${isDark ? "text-slate-300" : "text-slate-600"}`}
            >
              {repair.description}
            </p>
          )}
          {repair.diagnosisNotes && (
            <p
              className={`text-xs p-2 rounded-lg mb-2 ${isDark ? "bg-blue-900/20 text-blue-400" : "bg-blue-50 text-blue-700"}`}
            >
              Diagnosis: {repair.diagnosisNotes}
            </p>
          )}

          {repair.items && repair.items.length > 0 && (
            <div className="mt-3">
              <p
                className={`text-xs font-semibold mb-2 ${isDark ? "text-slate-400" : "text-slate-500"}`}
              >
                Item Perbaikan:
              </p>
              <div className="space-y-1">
                {repair.items.map((item) => (
                  <div
                    key={item.id}
                    className={`flex items-center justify-between text-xs px-3 py-1.5 rounded-lg ${isDark ? "bg-slate-700/50" : "bg-white"}`}
                  >
                    <span
                      className={isDark ? "text-slate-300" : "text-slate-600"}
                    >
                      {item.itemName} x{item.quantity}
                    </span>
                    <span className="font-semibold text-emerald-500">
                      {formatPrice(item.totalPrice)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div
            className={`flex gap-4 mt-3 text-[10px] ${isDark ? "text-slate-500" : "text-slate-400"}`}
          >
            {repair.startedAt && (
              <span>Mulai: {formatDate(repair.startedAt)}</span>
            )}
            {repair.completedAt && (
              <span>Selesai: {formatDate(repair.completedAt)}</span>
            )}
            {repair.createdAt && (
              <span>Dibuat: {formatDate(repair.createdAt)}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

// ============================
// HISTORY TAB
// ============================
const HistoryTab = ({
  detail,
  isDark,
}: {
  detail: ShowroomViewVehicleDetail;
  isDark: boolean;
}) => {
  const allEvents: Array<{
    type: string;
    date: string;
    label: string;
    description: string;
  }> = [];

  // Placements
  detail.placementHistory?.forEach((p) => {
    allEvents.push({
      type: "placement",
      date: p.placedAt,
      label: "Penempatan Zona",
      description: `Ditempatkan di zona ${p.zone?.name || "unknown"} (${p.zone?.code || "-"})`,
    });
  });

  // Stock Logs
  detail.stockLogs?.forEach((s) => {
    allEvents.push({
      type: "stock",
      date: s.createdAt,
      label:
        s.action === "vehicle_in"
          ? "Stok Masuk"
          : s.action === "vehicle_out"
            ? "Stok Keluar"
            : s.action === "zone_transfer"
              ? "Transfer Zona"
              : "Perubahan Status",
      description: s.notes || s.action,
    });
  });

  // Sort descending
  allEvents.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  if (allEvents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-2">
        <FiBarChart2
          className={`text-4xl ${isDark ? "text-slate-600" : "text-slate-300"}`}
        />
        <p
          className={`text-sm ${isDark ? "text-slate-500" : "text-slate-400"}`}
        >
          Belum ada riwayat
        </p>
      </div>
    );
  }

  const typeColors: Record<string, string> = {
    placement: "border-emerald-500 bg-emerald-500",
    stock: "border-blue-500 bg-blue-500",
  };

  return (
    <div className="relative">
      <div
        className={`absolute left-4 top-0 bottom-0 w-0.5 ${isDark ? "bg-slate-700" : "bg-slate-200"}`}
      />
      <div className="space-y-4">
        {allEvents.map((event, i) => (
          <div key={i} className="relative pl-10">
            <div
              className={`absolute left-3 top-2 w-3 h-3 rounded-full border-2 ${typeColors[event.type] || "border-slate-400 bg-slate-400"}`}
            />
            <div
              className={`rounded-xl border p-4 ${isDark ? "bg-slate-800/50 border-slate-700/50" : "bg-slate-50 border-slate-200"}`}
            >
              <div className="flex items-center justify-between mb-1">
                <span
                  className={`text-xs font-bold ${isDark ? "text-white" : "text-slate-800"}`}
                >
                  {event.label}
                </span>
                <span
                  className={`text-[10px] ${isDark ? "text-slate-500" : "text-slate-400"}`}
                >
                  {formatDate(event.date)}
                </span>
              </div>
              <p
                className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}
              >
                {event.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShowroomMapView;
