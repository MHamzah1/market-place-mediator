"use client";

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/state/store";
import {
  fetchVehicleDetail,
  updateVehicle,
  clearError,
  clearSuccess,
} from "@/lib/state/slice/warehouse/warehouseSlice";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { FiArrowLeft, FiSave } from "react-icons/fi";
import Link from "next/link";
import { useTheme } from "@/context/ThemeContext";
import PaginatedSelectField from "@/components/ui/paginated-select-field";
import { CurrencyInputField, InputField } from "@/components/ui";
import { encryptSlug } from "@/lib/slug/slug";

// ── helper types ──────────────────────────────────────────────
interface BrandItem {
  id: string;
  name: string;
}
interface CarModelItem {
  id: string;
  brandId: string;
  modelName: string;
}
interface VariantItem {
  id: string;
  modelId: string;
  variantName: string;
  transmissionType?: string;
}
interface YearPriceItem {
  id: string;
  variantId: string;
  year: number;
  basePrice: string;
}

interface VehicleEditFormProps {
  id: string;
}

const VehicleEditForm = ({ id }: VehicleEditFormProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const router = useRouter();

  const { actionLoading, error, successMessage, selectedVehicle, loading } =
    useSelector((state: RootState) => state.warehouse);

  const [form, setForm] = useState({
    showroomId: "",
    carModelId: "",
    variantId: "",
    variantName: "",
    yearPriceId: "",
    brandName: "",
    modelName: "",
    year: new Date().getFullYear(),
    color: "",
    licensePlate: "",
    chassisNumber: "",
    engineNumber: "",
    mileage: 0,
    fuelType: "bensin",
    askingPrice: 0,
    sellerName: "",
    sellerPhone: "",
  });

  // display state for cascaded selects
  const [selectedBrandId, setSelectedBrandId] = useState("");
  const [selectedModelId, setSelectedModelId] = useState("");
  const [initialized, setInitialized] = useState(false);

  // Fetch vehicle on mount
  useEffect(() => {
    dispatch(fetchVehicleDetail(id));
  }, [id, dispatch]);

  // Pre-fill form once vehicle is loaded
  useEffect(() => {
    if (selectedVehicle && selectedVehicle.id === id && !initialized) {
      setForm({
        showroomId: selectedVehicle.showroomId ?? "",
        carModelId: selectedVehicle.carModelId ?? "",
        variantId: selectedVehicle.variantId ?? "",
        variantName: "",
        yearPriceId: selectedVehicle.yearPriceId ?? "",
        brandName: selectedVehicle.brandName ?? "",
        modelName: selectedVehicle.modelName ?? "",
        year: selectedVehicle.year ?? new Date().getFullYear(),
        color: selectedVehicle.color ?? "",
        licensePlate: selectedVehicle.licensePlate ?? "",
        chassisNumber: selectedVehicle.chassisNumber ?? "",
        engineNumber: selectedVehicle.engineNumber ?? "",
        mileage: selectedVehicle.mileage ?? 0,
        fuelType: selectedVehicle.fuelType ?? "bensin",
        askingPrice: selectedVehicle.askingPrice ?? 0,
        sellerName: selectedVehicle.sellerName ?? "",
        sellerPhone: selectedVehicle.sellerPhone ?? "",
      });
      // Restore cascade context from existing carModelId
      if (selectedVehicle.carModelId) {
        setSelectedModelId(selectedVehicle.carModelId);
      }
      setInitialized(true);
    }
  }, [selectedVehicle, id, initialized]);

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(clearSuccess());
      router.push(`/warehouse/vehicles/${encryptSlug(id)}`);
    }
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [successMessage, error, dispatch, router, id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(
      updateVehicle({
        id,
        data: {
          showroomId: form.showroomId,
          variantId: form.variantId,
          yearPriceId: form.yearPriceId,
          color: form.color,
          licensePlate: form.licensePlate,
          chassisNumber: form.chassisNumber,
          engineNumber: form.engineNumber,
          mileage: Number(form.mileage),
          fuelType: form.fuelType,
          askingPrice: Number(form.askingPrice),
          sellerName: form.sellerName,
          sellerPhone: form.sellerPhone,
        },
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

  // ── Cascaded select handlers ──────────────────────────────
  const handleBrandChange = (_val: string, item: unknown) => {
    const brand = item as BrandItem;
    setSelectedBrandId(brand.id);
    setSelectedModelId("");
    setForm((f) => ({
      ...f,
      brandName: brand.name,
      carModelId: "",
      modelName: "",
      variantId: "",
      yearPriceId: "",
      year: new Date().getFullYear(),
    }));
  };

  const handleCarModelChange = (_val: string, item: unknown) => {
    const model = item as CarModelItem;
    setSelectedModelId(model.id);
    setForm((f) => ({
      ...f,
      carModelId: model.id,
      modelName: model.modelName,
      variantId: "",
      variantName: "",
      yearPriceId: "",
      year: new Date().getFullYear(),
    }));
  };

  const handleVariantChange = (_val: string, item: unknown) => {
    const variant = item as VariantItem;
    const label = `${variant.variantName}${variant.transmissionType ? ` (${variant.transmissionType})` : ""}`;
    setForm((f) => ({
      ...f,
      variantId: variant.id,
      variantName: label,
      yearPriceId: "",
    }));
  };

  const handleYearPriceChange = (_val: string, item: unknown) => {
    const yp = item as YearPriceItem;
    setForm((f) => ({
      ...f,
      yearPriceId: yp.id,
      year: yp.year,
    }));
  };

  if (loading && !initialized) {
    return (
      <div className="max-w-3xl mx-auto flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-500" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href={`/warehouse/vehicles/${encryptSlug(id)}`}
          className={`p-2 rounded-xl transition-colors ${isDark ? "bg-slate-800/50 hover:bg-slate-800 text-slate-400" : "bg-slate-100 hover:bg-slate-200 text-slate-600"}`}
        >
          <FiArrowLeft className="text-xl" />
        </Link>
        <div>
          <h1
            className={`text-2xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}
          >
            Edit Kendaraan
          </h1>
          <p
            className={`text-sm mt-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}
          >
            Perbarui data kendaraan yang sudah terdaftar
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
            {/* Brand */}
            <PaginatedSelectField
              label="Merek"
              value={selectedBrandId}
              displayValue={form.brandName}
              onChange={handleBrandChange}
              apiUrl="/brand/paged"
              getLabel={(item) => (item as BrandItem).name}
              getValue={(item) => (item as BrandItem).id}
              placeholder="Pilih merek..."
              required
            />

            {/* Car Model */}
            <PaginatedSelectField
              label="Model"
              value={form.carModelId}
              displayValue={form.modelName}
              onChange={handleCarModelChange}
              apiUrl="/CarModels"
              queryParams={selectedBrandId ? { brandId: selectedBrandId } : {}}
              getLabel={(item) => (item as CarModelItem).modelName}
              getValue={(item) => (item as CarModelItem).id}
              placeholder={
                selectedBrandId ? "Pilih model..." : "Pilih merek dulu"
              }
              disabled={!selectedBrandId && !form.carModelId}
              required
            />

            {/* Variant */}
            <PaginatedSelectField
              label="Varian"
              value={form.variantId}
              displayValue={form.variantName || undefined}
              onChange={handleVariantChange}
              apiUrl="/variants"
              queryParams={selectedModelId ? { modelId: selectedModelId } : {}}
              getLabel={(item) => {
                const v = item as VariantItem;
                return `${v.variantName}${v.transmissionType ? ` (${v.transmissionType})` : ""}`;
              }}
              getValue={(item) => (item as VariantItem).id}
              placeholder={
                selectedModelId ? "Pilih varian..." : "Pilih model dulu"
              }
              disabled={!selectedModelId && !form.variantId}
              required
            />

            {/* Year Price */}
            <PaginatedSelectField
              label="Tahun & Harga Dasar"
              value={form.yearPriceId}
              displayValue={
                form.yearPriceId && form.year ? `${form.year}` : undefined
              }
              onChange={handleYearPriceChange}
              apiUrl="/year-prices"
              queryParams={form.variantId ? { variantId: form.variantId } : {}}
              getLabel={(item) => {
                const yp = item as YearPriceItem;
                return `${yp.year} — Rp ${Number(yp.basePrice).toLocaleString("id-ID")}`;
              }}
              getValue={(item) => (item as YearPriceItem).id}
              placeholder={
                form.variantId ? "Pilih tahun..." : "Pilih varian dulu"
              }
              disabled={!form.variantId}
              required
            />

            <InputField
              label="Warna"
              name="color"
              value={form.color}
              onChange={handleChange}
              placeholder="Hitam"
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

            <CurrencyInputField
              label="Harga Jual (Rp)"
              name="askingPrice"
              value={Number(form.askingPrice)}
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
          </div>
        </div>

        <button
          type="submit"
          disabled={actionLoading}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-linear-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-emerald-500/30 transition-all disabled:opacity-50"
        >
          {actionLoading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
          ) : (
            <>
              <FiSave /> Simpan Perubahan
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default VehicleEditForm;
