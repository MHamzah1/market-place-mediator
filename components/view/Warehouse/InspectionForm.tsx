"use client";

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/state/store";
import {
  createInspection,
  fetchVehicles,
  clearError,
  clearSuccess,
} from "@/lib/state/slice/warehouse/warehouseSlice";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import {
  FiArrowLeft,
  FiSave,
  FiSearch,
  FiTruck,
  FiCheck,
} from "react-icons/fi";
import { TbCar } from "react-icons/tb";
import Link from "next/link";
import { useTheme } from "@/context/ThemeContext";
import { decryptQueryParam, encryptSlug } from "@/lib/slug/slug";

const InspectionForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const router = useRouter();
  const searchParams = useSearchParams();
  const vehicleIdFromUrl = decryptQueryParam(searchParams.get("vehicleId"));

  const { vehicles, selectedShowroom, actionLoading, error, successMessage } =
    useSelector((state: RootState) => state.warehouse);

  const [form, setForm] = useState({
    warehouseVehicleId: vehicleIdFromUrl || "",
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

  const [vehicleSearch, setVehicleSearch] = useState("");

  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL_IMAGES || "http://localhost:8080";
  const getImageUrl = (url: string) =>
    url?.startsWith("http") ? url : baseUrl + url;

  // Fetch vehicles from showroom
  useEffect(() => {
    if (selectedShowroom?.id) {
      dispatch(
        fetchVehicles({ showroomId: selectedShowroom.id, perPage: 100 }),
      );
    }
  }, [dispatch, selectedShowroom]);

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(clearSuccess());
      router.push(
        form.warehouseVehicleId
          ? `/warehouse/vehicles/${encryptSlug(form.warehouseVehicleId)}`
          : "/warehouse/inspections",
      );
    }
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [successMessage, error, dispatch, router, form.warehouseVehicleId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.warehouseVehicleId) {
      toast.error("Pilih kendaraan terlebih dahulu");
      return;
    }
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

  // Filter vehicles by search
  const filteredVehicles = vehicles.filter((v) => {
    if (!vehicleSearch) return true;
    const q = vehicleSearch.toLowerCase();
    return (
      v.brandName?.toLowerCase().includes(q) ||
      v.modelName?.toLowerCase().includes(q) ||
      v.licensePlate?.toLowerCase().includes(q) ||
      v.barcode?.toLowerCase().includes(q) ||
      String(v.year).includes(q) ||
      v.color?.toLowerCase().includes(q)
    );
  });

  // Get selected vehicle detail
  const selectedVehicle = vehicles.find(
    (v) => v.id === form.warehouseVehicleId,
  );

  const cardClass = `${isDark ? "bg-slate-800/50 border-slate-700/50" : "bg-white border-slate-200 shadow-sm"} border rounded-2xl p-6`;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href={
            vehicleIdFromUrl
              ? `/warehouse/vehicles/${encryptSlug(vehicleIdFromUrl)}`
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
        {/* ============ PILIH KENDARAAN ============ */}
        <div className={cardClass}>
          <h2
            className={`text-lg font-semibold mb-4 flex items-center gap-2 ${isDark ? "text-white" : "text-slate-900"}`}
          >
            <FiTruck className="text-emerald-500" /> Pilih Kendaraan
          </h2>

          {/* Selected Vehicle Preview */}
          {selectedVehicle && (
            <div
              className={`flex items-center gap-4 p-4 rounded-xl border mb-4 ${
                isDark
                  ? "bg-emerald-500/10 border-emerald-500/30"
                  : "bg-emerald-50 border-emerald-200"
              }`}
            >
              <div
                className={`w-20 h-14 rounded-lg overflow-hidden flex-shrink-0 ${isDark ? "bg-slate-700" : "bg-slate-100"}`}
              >
                {selectedVehicle.images?.[0] ? (
                  <img
                    src={getImageUrl(selectedVehicle.images[0])}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <TbCar
                      className={`text-xl ${isDark ? "text-slate-500" : "text-slate-300"}`}
                    />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className={`font-bold text-sm ${isDark ? "text-emerald-300" : "text-emerald-800"}`}
                >
                  {selectedVehicle.brandName} {selectedVehicle.modelName}{" "}
                  {selectedVehicle.year}
                </p>
                <p
                  className={`text-xs ${isDark ? "text-emerald-400/70" : "text-emerald-600"}`}
                >
                  {selectedVehicle.licensePlate} &bull; {selectedVehicle.color}{" "}
                  &bull; {selectedVehicle.barcode}
                </p>
              </div>
              <FiCheck
                className={`text-xl flex-shrink-0 ${isDark ? "text-emerald-400" : "text-emerald-600"}`}
              />
            </div>
          )}

          {/* Vehicle Search */}
          {!vehicleIdFromUrl && (
            <>
              <div className="relative mb-3">
                <FiSearch
                  className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? "text-slate-500" : "text-slate-400"}`}
                  size={16}
                />
                <input
                  type="text"
                  placeholder="Cari kendaraan (nama, plat, barcode)..."
                  value={vehicleSearch}
                  onChange={(e) => setVehicleSearch(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-emerald-500/40 ${
                    isDark
                      ? "bg-slate-700/50 border-slate-600/50 text-white placeholder-slate-500"
                      : "bg-white border-slate-300 text-slate-900 placeholder-slate-400"
                  }`}
                />
              </div>

              {/* Vehicle List */}
              <div
                className={`rounded-xl border overflow-hidden max-h-64 overflow-y-auto ${isDark ? "border-slate-700/50" : "border-slate-200"}`}
              >
                {filteredVehicles.length === 0 ? (
                  <div
                    className={`flex flex-col items-center justify-center py-8 ${isDark ? "text-slate-500" : "text-slate-400"}`}
                  >
                    <TbCar className="text-3xl mb-2" />
                    <p className="text-sm">
                      {vehicles.length === 0
                        ? "Tidak ada kendaraan di showroom ini"
                        : "Tidak ada hasil pencarian"}
                    </p>
                  </div>
                ) : (
                  filteredVehicles.map((v) => {
                    const isSelected = form.warehouseVehicleId === v.id;
                    return (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() =>
                          setForm({ ...form, warehouseVehicleId: v.id })
                        }
                        className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors border-b last:border-b-0 ${
                          isSelected
                            ? isDark
                              ? "bg-emerald-500/15 border-emerald-500/20"
                              : "bg-emerald-50 border-emerald-100"
                            : isDark
                              ? "hover:bg-slate-800/50 border-slate-700/30"
                              : "hover:bg-slate-50 border-slate-100"
                        }`}
                      >
                        {/* Thumbnail */}
                        <div
                          className={`w-14 h-10 rounded-lg overflow-hidden flex-shrink-0 ${isDark ? "bg-slate-700" : "bg-slate-100"}`}
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
                                className={`${isDark ? "text-slate-600" : "text-slate-300"}`}
                              />
                            </div>
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p
                            className={`text-sm font-semibold truncate ${isDark ? "text-white" : "text-slate-900"}`}
                          >
                            {v.brandName} {v.modelName} {v.year}
                          </p>
                          <p
                            className={`text-xs truncate ${isDark ? "text-slate-500" : "text-slate-400"}`}
                          >
                            {v.licensePlate} &bull; {v.color} &bull; {v.barcode}
                          </p>
                        </div>

                        {/* Status badge */}
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md flex-shrink-0 capitalize ${
                            v.status === "registered"
                              ? "bg-blue-500/10 text-blue-500"
                              : v.status === "in_warehouse"
                                ? "bg-emerald-500/10 text-emerald-500"
                                : v.status === "in_repair"
                                  ? "bg-orange-500/10 text-orange-500"
                                  : "bg-slate-500/10 text-slate-500"
                          }`}
                        >
                          {v.status.replace(/_/g, " ")}
                        </span>

                        {/* Check */}
                        {isSelected && (
                          <FiCheck className="text-emerald-500 flex-shrink-0" />
                        )}
                      </button>
                    );
                  })
                )}
              </div>
              <p
                className={`text-[11px] mt-2 ${isDark ? "text-slate-500" : "text-slate-400"}`}
              >
                Menampilkan {filteredVehicles.length} dari {vehicles.length}{" "}
                kendaraan di {selectedShowroom?.name || "showroom"}
              </p>
            </>
          )}

          {/* Vehicle ID from URL (read-only) */}
          {vehicleIdFromUrl && !selectedVehicle && (
            <div>
              <label
                className={`block text-sm font-medium mb-1.5 ${isDark ? "text-slate-300" : "text-slate-700"}`}
              >
                Vehicle ID
              </label>
              <input
                type="text"
                value={vehicleIdFromUrl}
                readOnly
                className={`w-full px-4 py-2.5 ${isDark ? "bg-slate-700/50 border-slate-600/50 text-slate-400" : "bg-slate-50 border-slate-300 text-slate-500"} border rounded-xl text-sm font-mono`}
              />
            </div>
          )}
        </div>

        {/* ============ INFORMASI INSPEKSI ============ */}
        <div className={`${cardClass} space-y-4`}>
          <h2
            className={`text-lg font-semibold ${isDark ? "text-white" : "text-slate-900"}`}
          >
            Informasi Inspeksi
          </h2>
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

        {/* ============ SKOR PENILAIAN ============ */}
        <div className={cardClass}>
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

        {/* ============ CHECKLIST DOKUMEN ============ */}
        <div className={cardClass}>
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
                  className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-emerald-500 focus:ring-emerald-500 accent-emerald-500"
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

        {/* ============ CATATAN ============ */}
        <div className={`${cardClass} space-y-4`}>
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

        {/* ============ SUBMIT ============ */}
        <button
          type="submit"
          disabled={actionLoading || !form.warehouseVehicleId}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-emerald-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
