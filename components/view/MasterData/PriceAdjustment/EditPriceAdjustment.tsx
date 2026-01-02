"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { AppDispatch, RootState } from "@/lib/state/store";
import { getPriceAdjustmentById, updatePriceAdjustment, clearSuccess, clearError, clearSelectedAdjustment } from "@/lib/state/slice/price-adjustment/priceAdjustmentSlice";
import { showAlert } from "@/components/feature/alert/alert";
import { FiSave, FiArrowLeft } from "react-icons/fi";
import { decryptSlug } from "@/lib/slug/slug";

interface FormData {
  name: string;
  colorHex?: string;
  adjustmentValue: number;
  description?: string;
  sortOrder: number;
  isBaseline: boolean;
  isActive: boolean;
}

const EditPriceAdjustment = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const params = useParams();
  const id = decryptSlug(params.slug as string);

  const { selectedAdjustment, loading, success, error } = useSelector((state: RootState) => state.priceAdjustment);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormData>();

  useEffect(() => {
    if (id) {
      dispatch(getPriceAdjustmentById(id));
    }
    return () => {
      dispatch(clearSelectedAdjustment());
    };
  }, [dispatch, id]);

  useEffect(() => {
    if (selectedAdjustment) {
      setValue("name", selectedAdjustment.name);
      setValue("colorHex", selectedAdjustment.colorHex || "");
      setValue("adjustmentValue", selectedAdjustment.adjustmentValue);
      setValue("description", selectedAdjustment.description || "");
      setValue("sortOrder", selectedAdjustment.sortOrder);
      setValue("isBaseline", selectedAdjustment.isBaseline);
      setValue("isActive", selectedAdjustment.isActive);
    }
  }, [selectedAdjustment, setValue]);

  useEffect(() => {
    if (success) {
      showAlert({ icon: "success", title: "Berhasil", text: "Price Adjustment berhasil diupdate" });
      dispatch(clearSuccess());
      router.push("/MasterData/PriceAdjustment/Table");
    }
    if (error) {
      showAlert({ icon: "error", title: "Error", text: error });
      dispatch(clearError());
    }
  }, [success, error, dispatch, router]);

  const onSubmit = (data: FormData) => {
    if (id) {
      dispatch(updatePriceAdjustment({ id, adjustmentData: data }));
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      transmission: "Transmisi",
      ownership: "Kepemilikan",
      color: "Warna",
    };
    return labels[category] || category;
  };

  if (!selectedAdjustment && loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

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
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Edit Price Adjustment</h1>
          <p className="text-slate-500 dark:text-slate-400">Edit faktor penyesuaian harga</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-6">
        {selectedAdjustment && (
          <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Informasi Adjustment</h3>
            <div className="grid md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-slate-500">Model:</span>
                <p className="font-medium">{selectedAdjustment.brandName} {selectedAdjustment.modelName}</p>
              </div>
              <div>
                <span className="text-slate-500">Kategori:</span>
                <p className="font-medium">{getCategoryLabel(selectedAdjustment.category)}</p>
              </div>
              <div>
                <span className="text-slate-500">Kode:</span>
                <p className="font-medium font-mono">{selectedAdjustment.code}</p>
              </div>
              {selectedAdjustment.category === "color" && selectedAdjustment.colorHex && (
                <div>
                  <span className="text-slate-500">Warna:</span>
                  <div className="flex items-center gap-2 mt-1">
                    <div
                      className="w-6 h-6 rounded-full border border-slate-300"
                      style={{ backgroundColor: selectedAdjustment.colorHex }}
                    />
                    <span className="font-mono text-xs">{selectedAdjustment.colorHex}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Nama *
              </label>
              <input
                type="text"
                {...register("name", { required: "Nama wajib diisi" })}
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:bg-slate-800 dark:text-white"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
              )}
            </div>

            {selectedAdjustment?.category === "color" && (
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Warna Hex
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

export default EditPriceAdjustment;
