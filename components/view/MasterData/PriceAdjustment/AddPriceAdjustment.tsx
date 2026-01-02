"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { AppDispatch, RootState } from "@/lib/state/store";
import { createPriceAdjustment, clearSuccess, clearError } from "@/lib/state/slice/price-adjustment/priceAdjustmentSlice";
import { getBrandsForSelect } from "@/lib/state/slice/brand/brandSlice";
import { getCarModelsForSelect } from "@/lib/state/slice/car-models/CarModelsSlice";
import { showAlert } from "@/components/feature/alert/alert";
import { FiSave, FiArrowLeft } from "react-icons/fi";

interface FormData {
  modelId: string;
  category: "transmission" | "ownership" | "color";
  code: string;
  name: string;
  colorHex?: string;
  adjustmentType: "fixed" | "percentage";
  adjustmentValue: number;
  description?: string;
  sortOrder: number;
  isBaseline: boolean;
  isActive: boolean;
}

const AddPriceAdjustment = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { loading, success, error } = useSelector((state: RootState) => state.priceAdjustment);
  const { data: brands } = useSelector((state: RootState) => state.brand);
  const { data: carModels } = useSelector((state: RootState) => state.CarModels);

  const [selectedBrandId, setSelectedBrandId] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormData>({
    defaultValues: {
      category: "transmission",
      adjustmentType: "fixed",
      adjustmentValue: 0,
      sortOrder: 0,
      isBaseline: false,
      isActive: true,
    },
  });

  const selectedCategory = watch("category");

  useEffect(() => {
    dispatch(getBrandsForSelect({ page: 1, perPage: 100 }));
  }, [dispatch]);

  useEffect(() => {
    if (selectedBrandId) {
      dispatch(getCarModelsForSelect({ page: 1, perPage: 100, brandId: selectedBrandId }));
    }
  }, [selectedBrandId, dispatch]);

  useEffect(() => {
    if (success) {
      showAlert({ icon: "success", title: "Berhasil", text: "Price Adjustment berhasil ditambahkan" });
      dispatch(clearSuccess());
      router.push("/MasterData/PriceAdjustment/Table");
    }
    if (error) {
      showAlert({ icon: "error", title: "Error", text: error });
      dispatch(clearError());
    }
  }, [success, error, dispatch, router]);

  const onSubmit = (data: FormData) => {
    const submitData = { ...data };
    if (data.category !== "color") {
      delete submitData.colorHex;
    }
    dispatch(createPriceAdjustment(submitData));
  };

  const categoryOptions = [
    { value: "transmission", label: "Transmisi", description: "Adjustment untuk tipe transmisi (Matic/Manual)" },
    { value: "ownership", label: "Kepemilikan", description: "Adjustment untuk jenis kepemilikan (Personal/PT)" },
    { value: "color", label: "Warna", description: "Adjustment untuk warna mobil" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
        >
          <FiArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Tambah Price Adjustment</h1>
          <p className="text-slate-500 dark:text-slate-400">Tambah faktor penyesuaian harga untuk model</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Brand
              </label>
              <select
                value={selectedBrandId}
                onChange={(e) => setSelectedBrandId(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:bg-slate-800 dark:text-white"
              >
                <option value="">Pilih Brand</option>
                {brands.map((brand) => (
                  <option key={brand.id} value={brand.id}>{brand.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Model Mobil *
              </label>
              <select
                {...register("modelId", { required: "Model wajib dipilih" })}
                disabled={!selectedBrandId}
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:bg-slate-800 dark:text-white disabled:opacity-50"
              >
                <option value="">Pilih Model</option>
                {carModels.map((model) => (
                  <option key={model.id} value={model.id}>{model.modelName}</option>
                ))}
              </select>
              {errors.modelId && (
                <p className="text-red-500 text-sm mt-1">{errors.modelId.message}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Kategori *
              </label>
              <div className="grid md:grid-cols-3 gap-4">
                {categoryOptions.map((cat) => (
                  <label
                    key={cat.value}
                    className={`flex flex-col p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      selectedCategory === cat.value
                        ? "border-cyan-500 bg-cyan-50 dark:bg-cyan-900/20"
                        : "border-slate-200 dark:border-slate-700 hover:border-slate-300"
                    }`}
                  >
                    <input
                      type="radio"
                      {...register("category", { required: "Kategori wajib dipilih" })}
                      value={cat.value}
                      className="sr-only"
                    />
                    <span className="font-semibold text-slate-900 dark:text-white">{cat.label}</span>
                    <span className="text-xs text-slate-500 mt-1">{cat.description}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Kode *
              </label>
              <input
                type="text"
                {...register("code", { required: "Kode wajib diisi" })}
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:bg-slate-800 dark:text-white"
                placeholder="Contoh: matic, manual, personal, hitam"
              />
              {errors.code && (
                <p className="text-red-500 text-sm mt-1">{errors.code.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Nama *
              </label>
              <input
                type="text"
                {...register("name", { required: "Nama wajib diisi" })}
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:bg-slate-800 dark:text-white"
                placeholder="Contoh: Matic (Automatic), Hitam"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
              )}
            </div>

            {selectedCategory === "color" && (
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Warna Hex *
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    {...register("colorHex")}
                    className="w-12 h-10 border border-slate-300 dark:border-slate-700 rounded-lg cursor-pointer"
                  />
                  <input
                    type="text"
                    {...register("colorHex")}
                    className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:bg-slate-800 dark:text-white"
                    placeholder="#000000"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Nilai Adjustment (Rp) *
              </label>
              <input
                type="number"
                {...register("adjustmentValue", { 
                  required: "Nilai adjustment wajib diisi",
                  valueAsNumber: true,
                })}
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:bg-slate-800 dark:text-white"
                placeholder="Contoh: -5000000 (minus untuk pengurangan)"
              />
              <p className="text-xs text-slate-500 mt-1">Gunakan nilai negatif untuk pengurangan harga</p>
              {errors.adjustmentValue && (
                <p className="text-red-500 text-sm mt-1">{errors.adjustmentValue.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Urutan Tampilan
              </label>
              <input
                type="number"
                {...register("sortOrder", { valueAsNumber: true })}
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Deskripsi
              </label>
              <textarea
                {...register("description")}
                rows={2}
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:bg-slate-800 dark:text-white"
                placeholder="Deskripsi adjustment..."
              />
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  {...register("isBaseline")}
                  id="isBaseline"
                  className="w-4 h-4 text-cyan-600 border-slate-300 rounded focus:ring-cyan-500"
                />
                <label htmlFor="isBaseline" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Baseline (Nilai Default)
                </label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  {...register("isActive")}
                  id="isActive"
                  className="w-4 h-4 text-cyan-600 border-slate-300 rounded focus:ring-cyan-500"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Aktif
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-6 border-t border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 border border-slate-300 dark:border-slate-700 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all disabled:opacity-50"
            >
              <FiSave className="w-4 h-4" />
              {loading ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPriceAdjustment;
