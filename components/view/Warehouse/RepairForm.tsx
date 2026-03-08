"use client";

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/state/store";
import {
  createRepairOrder,
  clearError,
  clearSuccess,
} from "@/lib/state/slice/warehouse/warehouseSlice";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { FiArrowLeft, FiSave } from "react-icons/fi";
import Link from "next/link";
import { useTheme } from "@/context/ThemeContext";

const RepairForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const router = useRouter();
  const searchParams = useSearchParams();
  const vehicleId = searchParams.get("vehicleId") || "";
  const { actionLoading, error, successMessage } = useSelector(
    (state: RootState) => state.warehouse,
  );

  const [form, setForm] = useState({
    warehouseVehicleId: vehicleId,
    repairType: "light" as "light" | "heavy",
    description: "",
    estimatedCost: 0,
  });

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(clearSuccess());
      router.push(
        vehicleId ? `/warehouse/vehicles/${vehicleId}` : "/warehouse/repairs",
      );
    }
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [successMessage, error, dispatch, router, vehicleId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(
      createRepairOrder({
        ...form,
        estimatedCost: Number(form.estimatedCost) || undefined,
      }),
    );
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href={
            vehicleId
              ? `/warehouse/vehicles/${vehicleId}`
              : "/warehouse/repairs"
          }
          className={`p-2 rounded-xl ${isDark ? "bg-slate-800/50 hover:bg-slate-800 text-slate-400" : "bg-slate-100 hover:bg-slate-200 text-slate-600"}`}
        >
          <FiArrowLeft className="text-xl" />
        </Link>
        <div>
          <h1
            className={`text-2xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}
          >
            Buat Repair Order
          </h1>
        </div>
      </div>
      <form
        onSubmit={handleSubmit}
        className={`${isDark ? "bg-slate-800/50 border-slate-700/50" : "bg-white border-slate-200 shadow-sm"} border rounded-2xl p-6 space-y-4`}
      >
        {!vehicleId && (
          <div>
            <label
              className={`block text-sm font-medium mb-1.5 ${isDark ? "text-slate-300" : "text-slate-700"}`}
            >
              Vehicle ID
            </label>
            <input
              type="text"
              name="warehouseVehicleId"
              value={form.warehouseVehicleId}
              onChange={(e) =>
                setForm({ ...form, warehouseVehicleId: e.target.value })
              }
              required
              className={`w-full px-4 py-2.5 ${isDark ? "bg-slate-700/50 border-slate-600/50 text-white" : "bg-white border-slate-300 text-slate-900"} border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50`}
            />
          </div>
        )}
        <div>
          <label
            className={`block text-sm font-medium mb-1.5 ${isDark ? "text-slate-300" : "text-slate-700"}`}
          >
            Jenis Perbaikan
          </label>
          <select
            name="repairType"
            value={form.repairType}
            onChange={(e) =>
              setForm({
                ...form,
                repairType: e.target.value as "light" | "heavy",
              })
            }
            className={`w-full px-4 py-2.5 ${isDark ? "bg-slate-700/50 border-slate-600/50 text-white" : "bg-white border-slate-300 text-slate-900"} border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50`}
          >
            <option value="light">Ringan</option>
            <option value="heavy">Berat</option>
          </select>
        </div>
        <div>
          <label
            className={`block text-sm font-medium mb-1.5 ${isDark ? "text-slate-300" : "text-slate-700"}`}
          >
            Deskripsi Pekerjaan
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={4}
            required
            placeholder="Jelaskan pekerjaan perbaikan yang diperlukan..."
            className={`w-full px-4 py-2.5 ${isDark ? "bg-slate-700/50 border-slate-600/50 text-white placeholder-slate-500" : "bg-white border-slate-300 text-slate-900 placeholder-slate-400"} border rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500/50`}
          />
        </div>
        <div>
          <label
            className={`block text-sm font-medium mb-1.5 ${isDark ? "text-slate-300" : "text-slate-700"}`}
          >
            Estimasi Biaya (Rp)
          </label>
          <input
            type="number"
            value={form.estimatedCost}
            onChange={(e) =>
              setForm({ ...form, estimatedCost: Number(e.target.value) })
            }
            placeholder="0"
            className={`w-full px-4 py-2.5 ${isDark ? "bg-slate-700/50 border-slate-600/50 text-white placeholder-slate-500" : "bg-white border-slate-300 text-slate-900 placeholder-slate-400"} border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50`}
          />
        </div>
        <button
          type="submit"
          disabled={actionLoading}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-semibold shadow-lg transition-all disabled:opacity-50"
        >
          {actionLoading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
          ) : (
            <>
              <FiSave /> Buat Repair Order
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default RepairForm;
