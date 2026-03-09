"use client";

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/state/store";
import {
  createInspection,
  clearError,
  clearSuccess,
} from "@/lib/state/slice/warehouse/warehouseSlice";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { FiArrowLeft, FiSave } from "react-icons/fi";
import Link from "next/link";
import { useTheme } from "@/context/ThemeContext";

const InspectionForm = () => {
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
    inspectionType: "initial" as "initial" | "re_inspection" | "qc",
    overallResult: "accepted_ready" as
      | "accepted_ready"
      | "accepted_repair"
      | "rejected",
    exteriorScore: 7,
    interiorScore: 7,
    engineScore: 7,
    electricalScore: 7,
    chassisScore: 7,
    documentStatus: "complete" as "complete" | "incomplete" | "invalid",
    hasBpkb: true,
    hasStnk: true,
    hasFaktur: false,
    hasKtp: true,
    hasSpareKey: false,
    chassisNumberMatch: true,
    repairNotes: "",
    rejectionReason: "",
  });

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(clearSuccess());
      router.push(
        vehicleId
          ? `/warehouse/vehicles/${vehicleId}`
          : "/warehouse/inspections",
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
      createInspection({
        ...form,
        exteriorScore: Number(form.exteriorScore),
        interiorScore: Number(form.interiorScore),
        engineScore: Number(form.engineScore),
        electricalScore: Number(form.electricalScore),
        chassisScore: Number(form.chassisScore),
      }),
    );
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value, type } = e.target;
    setForm({
      ...form,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href={
            vehicleId
              ? `/warehouse/vehicles/${vehicleId}`
              : "/warehouse/inspections"
          }
          className={`p-2 rounded-xl ${isDark ? "bg-slate-800/50 hover:bg-slate-800 text-slate-400" : "bg-slate-100 hover:bg-slate-200 text-slate-600"}`}
        >
          <FiArrowLeft className="text-xl" />
        </Link>
        <div>
          <h1
            className={`text-2xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}
          >
            Form Inspeksi
          </h1>
          <p
            className={`text-sm mt-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}
          >
            Submit hasil inspeksi kendaraan
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div
          className={`${isDark ? "bg-slate-800/50 border-slate-700/50" : "bg-white border-slate-200 shadow-sm"} border rounded-2xl p-6 space-y-4`}
        >
          <h2
            className={`text-lg font-semibold ${isDark ? "text-white" : "text-slate-900"}`}
          >
            Informasi Inspeksi
          </h2>
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
                onChange={handleChange}
                required
                className={`w-full px-4 py-2.5 ${isDark ? "bg-slate-700/50 border-slate-600/50 text-white" : "bg-white border-slate-300 text-slate-900"} border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50`}
              />
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <SelectField
              label="Tipe Inspeksi"
              name="inspectionType"
              value={form.inspectionType}
              onChange={handleChange}
              options={[
                ["initial", "Initial"],
                ["re_inspection", "Re-Inspection"],
                ["qc", "Quality Control"],
              ]}
            />
            <SelectField
              label="Hasil Keseluruhan"
              name="overallResult"
              value={form.overallResult}
              onChange={handleChange}
              options={[
                ["accepted_ready", "Diterima (Ready)"],
                ["accepted_repair", "Diterima (Perlu Repair)"],
                ["rejected", "Ditolak"],
              ]}
            />
            <SelectField
              label="Status Dokumen"
              name="documentStatus"
              value={form.documentStatus}
              onChange={handleChange}
              options={[
                ["complete", "Lengkap"],
                ["incomplete", "Tidak Lengkap"],
                ["invalid", "Tidak Valid"],
              ]}
            />
          </div>
        </div>

        <div
          className={`${isDark ? "bg-slate-800/50 border-slate-700/50" : "bg-white border-slate-200 shadow-sm"} border rounded-2xl p-6`}
        >
          <h2
            className={`text-lg font-semibold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}
          >
            Skor Penilaian (1-10)
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            {[
              ["Eksterior", "exteriorScore"],
              ["Interior", "interiorScore"],
              ["Mesin", "engineScore"],
              ["Listrik", "electricalScore"],
              ["Chassis", "chassisScore"],
            ].map(([label, name]) => (
              <div key={name}>
                <label
                  className={`block text-xs font-medium mb-1 text-center ${isDark ? "text-slate-400" : "text-slate-600"}`}
                >
                  {label}
                </label>
                <input
                  type="number"
                  name={name}
                  min={1}
                  max={10}
                  value={form[name as keyof typeof form] as number}
                  onChange={handleChange}
                  className={`w-full px-3 py-3 ${isDark ? "bg-slate-700/50 border-slate-600/50 text-white" : "bg-white border-slate-300 text-slate-900"} border rounded-xl text-center text-lg font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/50`}
                />
              </div>
            ))}
          </div>
        </div>

        <div
          className={`${isDark ? "bg-slate-800/50 border-slate-700/50" : "bg-white border-slate-200 shadow-sm"} border rounded-2xl p-6`}
        >
          <h2
            className={`text-lg font-semibold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}
          >
            Checklist Dokumen
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              ["hasBpkb", "BPKB"],
              ["hasStnk", "STNK"],
              ["hasFaktur", "Faktur"],
              ["hasKtp", "KTP"],
              ["hasSpareKey", "Kunci Cadangan"],
              ["chassisNumberMatch", "No. Rangka Sesuai"],
            ].map(([name, label]) => (
              <label
                key={name}
                className={`flex items-center gap-2 p-3 rounded-xl cursor-pointer transition-colors ${isDark ? "bg-slate-700/30 hover:bg-slate-700/50" : "bg-slate-50 hover:bg-slate-100"}`}
              >
                <input
                  type="checkbox"
                  name={name}
                  checked={form[name as keyof typeof form] as boolean}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-emerald-500 focus:ring-emerald-500"
                />
                <span
                  className={`text-sm ${isDark ? "text-slate-300" : "text-slate-700"}`}
                >
                  {label}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div
          className={`${isDark ? "bg-slate-800/50 border-slate-700/50" : "bg-white border-slate-200 shadow-sm"} border rounded-2xl p-6 space-y-4`}
        >
          <div>
            <label
              className={`block text-sm font-medium mb-1.5 ${isDark ? "text-slate-300" : "text-slate-700"}`}
            >
              Catatan Perbaikan
            </label>
            <textarea
              name="repairNotes"
              value={form.repairNotes}
              onChange={handleChange}
              rows={2}
              placeholder="Catatan jika perlu perbaikan"
              className={`w-full px-4 py-2.5 ${isDark ? "bg-slate-700/50 border-slate-600/50 text-white placeholder-slate-500" : "bg-white border-slate-300 text-slate-900 placeholder-slate-400"} border rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500/50`}
            />
          </div>
          {form.overallResult === "rejected" && (
            <div>
              <label
                className={`block text-sm font-medium mb-1.5 ${isDark ? "text-slate-300" : "text-slate-700"}`}
              >
                Alasan Penolakan
              </label>
              <textarea
                name="rejectionReason"
                value={form.rejectionReason}
                onChange={handleChange}
                rows={2}
                placeholder="Wajib diisi jika ditolak"
                required
                className={`w-full px-4 py-2.5 ${isDark ? "bg-slate-700/50 border-slate-600/50 text-white placeholder-slate-500" : "bg-white border-slate-300 text-slate-900 placeholder-slate-400"} border rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500/50`}
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={actionLoading}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-emerald-500/30 transition-all disabled:opacity-50"
        >
          {actionLoading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
          ) : (
            <>
              <FiSave /> Submit Inspeksi
            </>
          )}
        </button>
      </form>
    </div>
  );
};

function SelectField({
  label,
  name,
  value,
  onChange,
  options,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: string[][];
}) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  return (
    <div>
      <label
        className={`block text-sm font-medium mb-1.5 ${isDark ? "text-slate-300" : "text-slate-700"}`}
      >
        {label}
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full px-4 py-2.5 ${isDark ? "bg-slate-700/50 border-slate-600/50 text-white" : "bg-white border-slate-300 text-slate-900"} border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50`}
      >
        {options.map(([val, lbl]) => (
          <option key={val} value={val}>
            {lbl}
          </option>
        ))}
      </select>
    </div>
  );
}

export default InspectionForm;
