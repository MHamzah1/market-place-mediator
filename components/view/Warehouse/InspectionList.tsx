"use client";

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/lib/state/store";
import {
  fetchVehicles,
  fetchInspectionsByVehicle,
} from "@/lib/state/slice/warehouse/warehouseSlice";
import Link from "next/link";
import { FiPlus, FiClipboard } from "react-icons/fi";
import { useTheme } from "@/context/ThemeContext";
import { generateUrlWithEncryptedParams } from "@/lib/slug/slug";

const InspectionList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { vehicles, inspections, selectedShowroom, loading } = useSelector(
    (state: RootState) => state.warehouse,
  );
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>("");

  useEffect(() => {
    dispatch(
      fetchVehicles({ showroomId: selectedShowroom?.id, status: "inspecting" }),
    );
  }, [dispatch, selectedShowroom]);

  useEffect(() => {
    if (selectedVehicleId)
      dispatch(fetchInspectionsByVehicle(selectedVehicleId));
  }, [dispatch, selectedVehicleId]);

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1
            className={`text-2xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}
          >
            Inspeksi Kendaraan
          </h1>
          <p
            className={`text-sm mt-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}
          >
            Kelola inspeksi kendaraan warehouse
          </p>
        </div>
        <Link
          href="/warehouse/inspections/create"
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-semibold text-sm shadow-lg hover:shadow-emerald-500/30 transition-all"
        >
          <FiPlus /> Inspeksi Baru
        </Link>
      </div>

      {/* Vehicles awaiting inspection */}
      <div
        className={`${isDark ? "bg-slate-800/50 border-slate-700/50" : "bg-white border-slate-200 shadow-sm"} border rounded-2xl p-6`}
      >
        <h3
          className={`text-lg font-semibold mb-4 flex items-center gap-2 ${isDark ? "text-white" : "text-slate-900"}`}
        >
          <FiClipboard className="text-yellow-400" /> Kendaraan Menunggu
          Inspeksi
        </h3>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500" />
          </div>
        ) : vehicles.length === 0 ? (
          <p
            className={`text-sm ${isDark ? "text-slate-500" : "text-slate-400"}`}
          >
            Tidak ada kendaraan yang menunggu inspeksi
          </p>
        ) : (
          <div className="space-y-2">
            {vehicles.map((v) => (
              <div
                key={v.id}
                className={`flex items-center justify-between p-3 rounded-xl border hover:border-emerald-500/30 transition-colors ${isDark ? "bg-slate-700/30 border-slate-700/50" : "bg-slate-50 border-slate-200"}`}
              >
                <div>
                  <p
                    className={`font-semibold text-sm ${isDark ? "text-white" : "text-slate-900"}`}
                  >
                    {v.brandName} {v.modelName} ({v.year})
                  </p>
                  <p
                    className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}
                  >
                    {v.barcode} • {v.licensePlate}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedVehicleId(v.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${isDark ? "bg-slate-600/50 hover:bg-slate-600 text-slate-300" : "bg-slate-100 hover:bg-slate-200 text-slate-700"}`}
                  >
                    Riwayat
                  </button>
                  <Link
                    href={generateUrlWithEncryptedParams(
                      "/warehouse/inspections/create",
                      { vehicleId: v.id },
                    )}
                    className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 text-xs font-medium transition-colors"
                  >
                    Inspeksi
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Inspection History */}
      {selectedVehicleId && inspections.length > 0 && (
        <div
          className={`${isDark ? "bg-slate-800/50 border-slate-700/50" : "bg-white border-slate-200 shadow-sm"} border rounded-2xl p-6`}
        >
          <h3
            className={`text-lg font-semibold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}
          >
            Riwayat Inspeksi
          </h3>
          <div className="space-y-3">
            {inspections.map((insp) => (
              <div
                key={insp.id}
                className={`${isDark ? "bg-slate-700/30 border-slate-700/50" : "bg-slate-50 border-slate-200"} rounded-xl p-4 border`}
              >
                <div className="flex justify-between">
                  <span
                    className={`text-sm font-semibold capitalize ${isDark ? "text-white" : "text-slate-900"}`}
                  >
                    {insp.inspectionType.replace("_", " ")}
                  </span>
                  <span
                    className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}
                  >
                    {formatDate(insp.inspectedAt)}
                  </span>
                </div>
                <span
                  className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${
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
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default InspectionList;
