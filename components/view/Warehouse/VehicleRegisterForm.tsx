"use client";

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/state/store";
import {
  registerVehicle,
  clearError,
  clearSuccess,
} from "@/lib/state/slice/warehouse/warehouseSlice";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { FiArrowLeft, FiSave } from "react-icons/fi";
import Link from "next/link";
import { useTheme } from "@/context/ThemeContext";

const VehicleRegisterForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const router = useRouter();
  const { actionLoading, error, successMessage, selectedShowroom } =
    useSelector((state: RootState) => state.warehouse);

  const [form, setForm] = useState({
    showroomId: "",
    brandName: "",
    modelName: "",
    year: new Date().getFullYear(),
    color: "",
    licensePlate: "",
    chassisNumber: "",
    engineNumber: "",
    mileage: 0,
    transmission: "automatic",
    fuelType: "bensin",
    askingPrice: 0,
    sellerName: "",
    sellerPhone: "",
    sellerKtp: "",
    notes: "",
  });

  useEffect(() => {
    if (selectedShowroom)
      setForm((f) => ({ ...f, showroomId: selectedShowroom.id }));
  }, [selectedShowroom]);

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(clearSuccess());
      router.push("/warehouse/vehicles");
    }
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [successMessage, error, dispatch, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(
      registerVehicle({
        ...form,
        year: Number(form.year),
        mileage: Number(form.mileage),
        askingPrice: Number(form.askingPrice),
      }),
    );
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/warehouse/vehicles"
          className={`p-2 rounded-xl transition-colors ${isDark ? "bg-slate-800/50 hover:bg-slate-800 text-slate-400" : "bg-slate-100 hover:bg-slate-200 text-slate-600"}`}
        >
          <FiArrowLeft className="text-xl" />
        </Link>
        <div>
          <h1
            className={`text-2xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}
          >
            Register Kendaraan
          </h1>
          <p
            className={`text-sm mt-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}
          >
            Daftarkan kendaraan baru ke warehouse
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Data Kendaraan */}
        <div
          className={`${isDark ? "bg-slate-800/50 border-slate-700/50" : "bg-white border-slate-200 shadow-sm"} border rounded-2xl p-6`}
        >
          <h2
            className={`text-lg font-semibold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}
          >
            Data Kendaraan
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Merek"
              name="brandName"
              value={form.brandName}
              onChange={handleChange}
              placeholder="Toyota"
              required
            />
            <InputField
              label="Model"
              name="modelName"
              value={form.modelName}
              onChange={handleChange}
              placeholder="Avanza"
              required
            />
            <InputField
              label="Tahun"
              name="year"
              type="number"
              value={form.year}
              onChange={handleChange}
              required
            />
            <InputField
              label="Warna"
              name="color"
              value={form.color}
              onChange={handleChange}
              placeholder="Putih"
              required
            />
            <InputField
              label="Nomor Polisi"
              name="licensePlate"
              value={form.licensePlate}
              onChange={handleChange}
              placeholder="B 1234 ABC"
              required
            />
            <InputField
              label="Nomor Rangka (VIN)"
              name="chassisNumber"
              value={form.chassisNumber}
              onChange={handleChange}
              required
            />
            <InputField
              label="Nomor Mesin"
              name="engineNumber"
              value={form.engineNumber}
              onChange={handleChange}
              required
            />
            <InputField
              label="Kilometer"
              name="mileage"
              type="number"
              value={form.mileage}
              onChange={handleChange}
              required
            />

            <div>
              <label
                className={`block text-sm font-medium mb-1.5 ${isDark ? "text-slate-300" : "text-slate-700"}`}
              >
                Transmisi
              </label>
              <select
                name="transmission"
                value={form.transmission}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 ${isDark ? "bg-slate-700/50 border-slate-600/50 text-white" : "bg-white border-slate-300 text-slate-900"} border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50`}
              >
                <option value="automatic">Automatic</option>
                <option value="manual">Manual</option>
              </select>
            </div>

            <div>
              <label
                className={`block text-sm font-medium mb-1.5 ${isDark ? "text-slate-300" : "text-slate-700"}`}
              >
                Bahan Bakar
              </label>
              <select
                name="fuelType"
                value={form.fuelType}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 ${isDark ? "bg-slate-700/50 border-slate-600/50 text-white" : "bg-white border-slate-300 text-slate-900"} border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50`}
              >
                <option value="bensin">Bensin</option>
                <option value="diesel">Diesel</option>
                <option value="hybrid">Hybrid</option>
                <option value="electric">Electric</option>
              </select>
            </div>

            <InputField
              label="Harga Jual (Rp)"
              name="askingPrice"
              type="number"
              value={form.askingPrice}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Data Penjual */}
        <div
          className={`${isDark ? "bg-slate-800/50 border-slate-700/50" : "bg-white border-slate-200 shadow-sm"} border rounded-2xl p-6`}
        >
          <h2
            className={`text-lg font-semibold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}
          >
            Data Penjual
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Nama Penjual"
              name="sellerName"
              value={form.sellerName}
              onChange={handleChange}
              required
            />
            <InputField
              label="Telepon Penjual"
              name="sellerPhone"
              value={form.sellerPhone}
              onChange={handleChange}
              placeholder="08123456789"
              required
            />
            <InputField
              label="KTP Penjual"
              name="sellerKtp"
              value={form.sellerKtp}
              onChange={handleChange}
              placeholder="Opsional"
            />
          </div>
          <div className="mt-4">
            <label
              className={`block text-sm font-medium mb-1.5 ${isDark ? "text-slate-300" : "text-slate-700"}`}
            >
              Catatan
            </label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows={3}
              placeholder="Catatan tambahan (opsional)"
              className={`w-full px-4 py-2.5 ${isDark ? "bg-slate-700/50 border-slate-600/50 text-white placeholder-slate-500" : "bg-white border-slate-300 text-slate-900 placeholder-slate-400"} border rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500/50`}
            />
          </div>
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
              <FiSave /> Register Kendaraan
            </>
          )}
        </button>
      </form>
    </div>
  );
};

function InputField({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  required,
}: {
  label: string;
  name: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
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
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`w-full px-4 py-2.5 ${isDark ? "bg-slate-700/50 border-slate-600/50 text-white placeholder-slate-500" : "bg-white border-slate-300 text-slate-900 placeholder-slate-400"} border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50`}
      />
    </div>
  );
}

export default VehicleRegisterForm;
