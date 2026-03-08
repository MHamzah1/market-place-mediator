"use client";

import React, { useEffect, use } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/lib/state/store";
import {
  fetchVehicleDetail,
  updateVehicleStatus,
  publishVehicle,
  createAdminPayment,
  fetchInspectionsByVehicle,
  fetchRepairsByVehicle,
  clearSuccess,
  clearError,
  VehicleStatus,
} from "@/lib/state/slice/warehouse/warehouseSlice";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  FiArrowLeft,
  FiTruck,
  FiClipboard,
  FiTool,
  FiDollarSign,
  FiExternalLink,
  FiCheck,
} from "react-icons/fi";
import { useTheme } from "@/context/ThemeContext";

const statusConfig: Record<string, { label: string; color: string }> = {
  inspecting: {
    label: "Inspeksi",
    color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  },
  registered: {
    label: "Terdaftar",
    color: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  },
  in_warehouse: {
    label: "Di Gudang",
    color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  },
  in_repair: {
    label: "Perbaikan",
    color: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  },
  ready: {
    label: "Siap Jual",
    color: "bg-green-500/20 text-green-400 border-green-500/30",
  },
  listed: {
    label: "Di Marketplace",
    color: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  },
  sold: {
    label: "Terjual",
    color: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  },
  rejected: {
    label: "Ditolak",
    color: "bg-red-500/20 text-red-400 border-red-500/30",
  },
};

const VehicleDetail = ({
  paramsPromise,
}: {
  paramsPromise: Promise<{ id: string }>;
}) => {
  const params = use(paramsPromise);
  const dispatch = useDispatch<AppDispatch>();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const {
    selectedVehicle: vehicle,
    inspections,
    repairs,
    loading,
    actionLoading,
    error,
    successMessage,
  } = useSelector((state: RootState) => state.warehouse);

  useEffect(() => {
    dispatch(fetchVehicleDetail(params.id));
    dispatch(fetchInspectionsByVehicle(params.id));
    dispatch(fetchRepairsByVehicle(params.id));
  }, [dispatch, params.id]);

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(clearSuccess());
      dispatch(fetchVehicleDetail(params.id));
    }
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [successMessage, error, dispatch, params.id]);

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
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-500" />
      </div>
    );
  }

  const sc = statusConfig[vehicle.status] || {
    label: vehicle.status,
    color: "bg-slate-500/20 text-slate-400",
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-start gap-3">
        <Link
          href="/warehouse/vehicles"
          className={`p-2 rounded-xl transition-colors mt-1 ${isDark ? "bg-slate-800/50 hover:bg-slate-800 text-slate-400" : "bg-slate-100 hover:bg-slate-200 text-slate-600"}`}
        >
          <FiArrowLeft className="text-xl" />
        </Link>
        <div className="flex-1">
          <h1
            className={`text-2xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}
          >
            {vehicle.brandName} {vehicle.modelName}
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="font-mono text-emerald-400 text-sm bg-emerald-500/10 px-2 py-0.5 rounded">
              {vehicle.barcode}
            </span>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${sc.color}`}
            >
              {sc.label}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons based on status */}
      <div className="flex flex-wrap gap-2">
        {vehicle.status === "inspecting" && (
          <Link
            href={`/warehouse/inspections/create?vehicleId=${vehicle.id}`}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-yellow-500/20 text-yellow-400 font-medium text-sm hover:bg-yellow-500/30 transition-colors border border-yellow-500/30"
          >
            <FiClipboard /> Submit Inspeksi
          </Link>
        )}
        {vehicle.status === "registered" && (
          <button
            onClick={() => dispatch(createAdminPayment(vehicle.id))}
            disabled={actionLoading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500/20 text-blue-400 font-medium text-sm hover:bg-blue-500/30 transition-colors border border-blue-500/30 disabled:opacity-50"
          >
            <FiDollarSign /> Bayar Admin Rp 2jt
          </button>
        )}
        {(vehicle.status === "in_warehouse" ||
          vehicle.status === "in_repair") && (
          <>
            <Link
              href={`/warehouse/repairs/create?vehicleId=${vehicle.id}`}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-500/20 text-orange-400 font-medium text-sm hover:bg-orange-500/30 transition-colors border border-orange-500/30"
            >
              <FiTool /> Buat Repair Order
            </Link>
            <button
              onClick={() =>
                dispatch(
                  updateVehicleStatus({ id: vehicle.id, status: "ready" }),
                )
              }
              disabled={actionLoading}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500/20 text-green-400 font-medium text-sm hover:bg-green-500/30 transition-colors border border-green-500/30 disabled:opacity-50"
            >
              <FiCheck /> Tandai Ready
            </button>
          </>
        )}
        {vehicle.status === "ready" && (
          <button
            onClick={() => dispatch(publishVehicle(vehicle.id))}
            disabled={actionLoading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold text-sm shadow-lg hover:shadow-emerald-500/30 transition-all disabled:opacity-50"
          >
            <FiExternalLink /> Publish ke Marketplace
          </button>
        )}
      </div>

      {/* Vehicle Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InfoCard
          title="Data Kendaraan"
          items={[
            ["Merek", vehicle.brandName],
            ["Model", vehicle.modelName],
            ["Tahun", vehicle.year],
            ["Warna", vehicle.color],
            ["Nopol", vehicle.licensePlate],
            ["Transmisi", vehicle.transmission],
            ["BBM", vehicle.fuelType],
            ["Kilometer", `${vehicle.mileage.toLocaleString("id-ID")} km`],
            ["No. Rangka", vehicle.chassisNumber],
            ["No. Mesin", vehicle.engineNumber],
          ]}
        />
        <InfoCard
          title="Data Penjual & Harga"
          items={[
            ["Penjual", vehicle.sellerName],
            ["Telepon", vehicle.sellerPhone],
            ["KTP", vehicle.sellerKtp || "-"],
            ["Harga", formatPrice(vehicle.askingPrice)],
            ["Terdaftar", formatDate(vehicle.createdAt)],
            ["Update Terakhir", formatDate(vehicle.updatedAt)],
            ...(vehicle.notes
              ? [["Catatan", vehicle.notes] as [string, string]]
              : []),
          ]}
        />
      </div>

      {/* Inspections */}
      <div
        className={`${isDark ? "bg-slate-800/50 border-slate-700/50" : "bg-white border-slate-200 shadow-sm"} border rounded-2xl p-6`}
      >
        <h3
          className={`text-lg font-semibold mb-4 flex items-center gap-2 ${isDark ? "text-white" : "text-slate-900"}`}
        >
          <FiClipboard className="text-yellow-400" /> Riwayat Inspeksi (
          {inspections.length})
        </h3>
        {inspections.length === 0 ? (
          <p
            className={`text-sm ${isDark ? "text-slate-500" : "text-slate-400"}`}
          >
            Belum ada inspeksi
          </p>
        ) : (
          <div className="space-y-3">
            {inspections.map((insp) => (
              <div
                key={insp.id}
                className={`${isDark ? "bg-slate-700/30 border-slate-700/50" : "bg-slate-50 border-slate-200"} rounded-xl p-4 border`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span
                      className={`text-sm font-semibold capitalize ${isDark ? "text-white" : "text-slate-900"}`}
                    >
                      {insp.inspectionType.replace("_", " ")}
                    </span>
                    <span
                      className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${
                        insp.overallResult === "accepted_ready"
                          ? "bg-green-500/20 text-green-400"
                          : insp.overallResult === "accepted_repair"
                            ? "bg-orange-500/20 text-orange-400"
                            : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {insp.overallResult.replace("_", " ")}
                    </span>
                  </div>
                  <span
                    className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}
                  >
                    {formatDate(insp.inspectedAt)}
                  </span>
                </div>
                <div className="grid grid-cols-5 gap-2 text-center text-xs">
                  {[
                    ["Eksterior", insp.exteriorScore],
                    ["Interior", insp.interiorScore],
                    ["Mesin", insp.engineScore],
                    ["Listrik", insp.electricalScore],
                    ["Chassis", insp.chassisScore],
                  ].map(([label, score]) => (
                    <div
                      key={label as string}
                      className={`rounded-lg p-2 ${isDark ? "bg-slate-700/50" : "bg-slate-100"}`}
                    >
                      <p
                        className={`${isDark ? "text-slate-400" : "text-slate-500"}`}
                      >
                        {label as string}
                      </p>
                      <p
                        className={`font-bold text-lg ${isDark ? "text-white" : "text-slate-900"}`}
                      >
                        {score ?? "-"}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="mt-2 flex flex-wrap gap-2 text-xs">
                  {insp.hasBpkb && (
                    <span className="px-2 py-0.5 rounded bg-green-500/20 text-green-400">
                      BPKB
                    </span>
                  )}
                  {insp.hasStnk && (
                    <span className="px-2 py-0.5 rounded bg-green-500/20 text-green-400">
                      STNK
                    </span>
                  )}
                  {insp.hasFaktur && (
                    <span className="px-2 py-0.5 rounded bg-green-500/20 text-green-400">
                      Faktur
                    </span>
                  )}
                  {insp.hasKtp && (
                    <span className="px-2 py-0.5 rounded bg-green-500/20 text-green-400">
                      KTP
                    </span>
                  )}
                  {insp.hasSpareKey && (
                    <span className="px-2 py-0.5 rounded bg-green-500/20 text-green-400">
                      Kunci Cadangan
                    </span>
                  )}
                </div>
                {insp.repairNotes && (
                  <p className="text-sm text-orange-300 mt-2">
                    Perbaikan: {insp.repairNotes}
                  </p>
                )}
                {insp.rejectionReason && (
                  <p className="text-sm text-red-300 mt-2">
                    Alasan Tolak: {insp.rejectionReason}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Repairs */}
      <div
        className={`${isDark ? "bg-slate-800/50 border-slate-700/50" : "bg-white border-slate-200 shadow-sm"} border rounded-2xl p-6`}
      >
        <h3
          className={`text-lg font-semibold mb-4 flex items-center gap-2 ${isDark ? "text-white" : "text-slate-900"}`}
        >
          <FiTool className="text-orange-400" /> Repair Orders ({repairs.length}
          )
        </h3>
        {repairs.length === 0 ? (
          <p
            className={`text-sm ${isDark ? "text-slate-500" : "text-slate-400"}`}
          >
            Belum ada repair order
          </p>
        ) : (
          <div className="space-y-3">
            {repairs.map((r) => (
              <div
                key={r.id}
                className={`${isDark ? "bg-slate-700/30 border-slate-700/50" : "bg-slate-50 border-slate-200"} rounded-xl p-4 border`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        r.repairType === "light"
                          ? "bg-blue-500/20 text-blue-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {r.repairType === "light" ? "Ringan" : "Berat"}
                    </span>
                    <span
                      className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${
                        r.status === "completed"
                          ? "bg-green-500/20 text-green-400"
                          : r.status === "in_progress"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : r.status === "cancelled"
                              ? "bg-red-500/20 text-red-400"
                              : "bg-slate-500/20 text-slate-400"
                      }`}
                    >
                      {r.status}
                    </span>
                  </div>
                  <span
                    className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}
                  >
                    {formatDate(r.createdAt)}
                  </span>
                </div>
                <p
                  className={`text-sm mt-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}
                >
                  {r.description}
                </p>
                {r.estimatedCost && (
                  <p
                    className={`text-xs mt-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}
                  >
                    Estimasi: {formatPrice(r.estimatedCost)}
                  </p>
                )}
                {r.actualCost && (
                  <p className="text-xs text-emerald-400 mt-1">
                    Aktual: {formatPrice(r.actualCost)}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

function InfoCard({
  title,
  items,
}: {
  title: string;
  items: [string, string | number][];
}) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  return (
    <div
      className={`${isDark ? "bg-slate-800/50 border-slate-700/50" : "bg-white border-slate-200 shadow-sm"} border rounded-2xl p-5`}
    >
      <h3
        className={`text-base font-semibold mb-3 ${isDark ? "text-white" : "text-slate-900"}`}
      >
        {title}
      </h3>
      <div className="space-y-2">
        {items.map(([label, value]) => (
          <div key={label} className="flex justify-between text-sm">
            <span className={`${isDark ? "text-slate-400" : "text-slate-500"}`}>
              {label}
            </span>
            <span
              className={`font-medium text-right max-w-[60%] break-all ${isDark ? "text-white" : "text-slate-900"}`}
            >
              {value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default VehicleDetail;
