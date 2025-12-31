/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ArrowLeft,
  Save,
  Settings,
  FileText,
  Tag,
  Hash,
  ToggleLeft,
  Car,
  Layers,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { AppDispatch, RootState } from "@/lib/state/store";
import {
  getSpecificationById,
  updateSpecification,
  clearSelectedSpecification,
} from "@/lib/state/slice/Specifications/SpecificationsSlice";
import {
  getCarModelsForSelect,
  CarModels,
} from "@/lib/state/slice/car-models/CarModelsSlice";
import Alert from "@/components/feature/alert/alert";
import { cn } from "@/lib/utils";
import { decryptSlug, isValidSlug } from "@/lib/slug/slug";

// Constants
const SPEC_CATEGORIES = [
  { value: "engine", label: "Engine" },
  { value: "transmission", label: "Transmission" },
  { value: "fuel", label: "Fuel" },
  { value: "dimension", label: "Dimension" },
  { value: "performance", label: "Performance" },
  { value: "safety", label: "Safety" },
  { value: "comfort", label: "Comfort" },
  { value: "exterior", label: "Exterior" },
  { value: "interior", label: "Interior" },
  { value: "other", label: "Other" },
];

// Validation Schema
const specificationSchema = z.object({
  modelId: z.string().min(1, "Model mobil wajib dipilih"),
  specName: z
    .string()
    .min(1, "Nama spesifikasi wajib diisi")
    .min(2, "Minimal 2 karakter")
    .max(100, "Maksimal 100 karakter"),
  specCategory: z.string().min(1, "Kategori wajib dipilih"),
  specValue: z
    .string()
    .min(1, "Nilai wajib diisi")
    .max(100, "Maksimal 100 karakter"),
  specUnit: z.string().max(20, "Maksimal 20 karakter").optional(),
  description: z.string().max(500, "Maksimal 500 karakter").optional(),
  isActive: z.boolean(),
});

type SpecificationFormData = z.infer<typeof specificationSchema>;

function getCategoryBadgeStyle(category: string, isDarkMode: boolean) {
  const styles: Record<string, string> = {
    engine: "bg-red-500/20 text-red-400 border border-red-500/30",
    transmission:
      "bg-purple-500/20 text-purple-400 border border-purple-500/30",
    fuel: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
    dimension: "bg-blue-500/20 text-blue-400 border border-blue-500/30",
    performance: "bg-orange-500/20 text-orange-400 border border-orange-500/30",
    safety: "bg-green-500/20 text-green-400 border border-green-500/30",
    comfort: "bg-pink-500/20 text-pink-400 border border-pink-500/30",
    exterior: "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30",
    interior: "bg-teal-500/20 text-teal-400 border border-teal-500/30",
  };
  return (
    styles[category] ||
    (isDarkMode
      ? "bg-slate-500/20 text-slate-400 border border-slate-500/30"
      : "bg-slate-200 text-slate-600 border border-slate-300")
  );
}

export default function EditSpecification() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const params = useParams();
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  const { selectedSpecification, loading, error } = useSelector(
    (state: RootState) => state.Specifications
  );
  const { data: carModels, loading: carModelsLoading } = useSelector(
    (state: RootState) => state.CarModels
  );

  const [specificationId, setSpecificationId] = useState<string | null>(null);
  const [isValidId, setIsValidId] = useState(true);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
    watch,
    setValue,
  } = useForm<SpecificationFormData>({
    resolver: zodResolver(specificationSchema),
    defaultValues: {
      modelId: "",
      specName: "",
      specCategory: "",
      specValue: "",
      specUnit: "",
      description: "",
      isActive: true,
    },
  });

  const watchIsActive = watch("isActive");
  const watchModelId = watch("modelId");
  const watchCategory = watch("specCategory");

  useEffect(() => {
    const slug = params?.slug as string;
    if (!slug || !isValidSlug(slug)) {
      setIsValidId(false);
      setIsInitialLoading(false);
      return;
    }
    const decryptedId = decryptSlug(slug);
    if (!decryptedId) {
      setIsValidId(false);
      setIsInitialLoading(false);
      return;
    }
    setSpecificationId(decryptedId);
    setIsValidId(true);
    dispatch(getCarModelsForSelect({ page: 1, perPage: 100 }));
    dispatch(getSpecificationById(decryptedId)).finally(() =>
      setIsInitialLoading(false)
    );
    return () => {
      dispatch(clearSelectedSpecification());
    };
  }, [params?.slug, dispatch]);

  useEffect(() => {
    if (selectedSpecification) {
      setValue("modelId", selectedSpecification.modelId || "");
      setValue("specName", selectedSpecification.specName || "");
      setValue("specCategory", selectedSpecification.specCategory || "");
      setValue("specValue", selectedSpecification.specValue || "");
      setValue("specUnit", selectedSpecification.specUnit || "");
      setValue("description", selectedSpecification.description || "");
      setValue("isActive", selectedSpecification.isActive ?? true);
    }
  }, [selectedSpecification, setValue]);

  const selectedCarModel = carModels.find(
    (m: CarModels) => m.id === watchModelId
  );

  const onSubmit = async (data: SpecificationFormData) => {
    if (!specificationId) return;
    const confirmed = await Alert.confirmSave(
      "Simpan Perubahan?",
      "Apakah Anda yakin ingin menyimpan perubahan ini?"
    );
    if (!confirmed) return;
    try {
      Alert.loading("Menyimpan perubahan...");
      await dispatch(
        updateSpecification({
          id: specificationId,
          specificationData: {
            ...data,
            specUnit: data.specUnit || null,
            description: data.description || null,
          },
        })
      ).unwrap();
      Alert.closeLoading();
      await Alert.success("Berhasil!", "Specification berhasil diperbarui");
      router.push("/MasterData/Specification/Table");
    } catch (error: any) {
      Alert.closeLoading();
      await Alert.error(
        "Gagal!",
        error?.message || "Gagal memperbarui specification"
      );
    }
  };

  const handleCancel = async () => {
    if (isDirty) {
      const confirmed = await Alert.confirmDiscard();
      if (!confirmed) return;
    }
    router.push("/MasterData/Specification/Table");
  };

  const handleResetForm = async () => {
    const confirmed = await Alert.confirm(
      "Reset Form?",
      "Form akan dikembalikan ke data awal.",
      "Ya, Reset",
      "Batal"
    );
    if (confirmed && selectedSpecification) {
      setValue("modelId", selectedSpecification.modelId || "");
      setValue("specName", selectedSpecification.specName || "");
      setValue("specCategory", selectedSpecification.specCategory || "");
      setValue("specValue", selectedSpecification.specValue || "");
      setValue("specUnit", selectedSpecification.specUnit || "");
      setValue("description", selectedSpecification.description || "");
      setValue("isActive", selectedSpecification.isActive ?? true);
      Alert.toast.info("Form berhasil direset");
    }
  };

  if (isInitialLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-cyan-400" />
        <p className={isDarkMode ? "text-slate-400" : "text-slate-600"}>
          Memuat data specification...
        </p>
      </div>
    );
  }

  if (!isValidId || !specificationId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div
          className={cn(
            "p-4 rounded-full",
            isDarkMode ? "bg-red-500/20" : "bg-red-100"
          )}
        >
          <AlertTriangle className="w-12 h-12 text-red-500" />
        </div>
        <h2
          className={cn(
            "text-xl font-bold",
            isDarkMode ? "text-white" : "text-slate-900"
          )}
        >
          ID Specification Tidak Valid
        </h2>
        <p className={isDarkMode ? "text-slate-400" : "text-slate-600"}>
          Link yang Anda akses tidak valid atau sudah kadaluarsa.
        </p>
        <button
          onClick={() => router.push("/MasterData/Specification/Table")}
          className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 rounded-xl font-semibold text-white"
        >
          Kembali ke Daftar
        </button>
      </div>
    );
  }

  if (error && !selectedSpecification) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div
          className={cn(
            "p-4 rounded-full",
            isDarkMode ? "bg-red-500/20" : "bg-red-100"
          )}
        >
          <AlertTriangle className="w-12 h-12 text-red-500" />
        </div>
        <h2
          className={cn(
            "text-xl font-bold",
            isDarkMode ? "text-white" : "text-slate-900"
          )}
        >
          Gagal Memuat Data
        </h2>
        <p className={isDarkMode ? "text-slate-400" : "text-slate-600"}>
          {error}
        </p>
        <button
          onClick={() => router.push("/MasterData/Specification/Table")}
          className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 rounded-xl font-semibold text-white"
        >
          Kembali ke Daftar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={handleCancel}
            className={cn(
              "p-2 rounded-xl transition-all duration-200",
              isDarkMode
                ? "bg-slate-800 hover:bg-slate-700 text-slate-300"
                : "bg-slate-100 hover:bg-slate-200 text-slate-700"
            )}
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-3xl font-black tracking-tight bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Edit Specification
            </h1>
            <p
              className={cn(
                "text-sm mt-1",
                isDarkMode ? "text-slate-400" : "text-slate-600"
              )}
            >
              {selectedSpecification?.specName || "Specification"}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div
          className={cn(
            "rounded-2xl border backdrop-blur-sm p-6 lg:p-8",
            isDarkMode
              ? "bg-slate-800/50 border-slate-700/50"
              : "bg-white border-slate-200 shadow-lg"
          )}
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h2
                  className={cn(
                    "text-lg font-bold mb-4 flex items-center gap-2",
                    isDarkMode ? "text-white" : "text-slate-900"
                  )}
                >
                  <Settings size={20} className="text-cyan-400" />
                  Informasi Specification
                </h2>
                <div className="space-y-4">
                  {/* Car Model Select */}
                  <div>
                    <label
                      className={cn(
                        "block text-sm font-semibold mb-2",
                        isDarkMode ? "text-slate-300" : "text-slate-700"
                      )}
                    >
                      Model Mobil<span className="text-red-500 ml-1">*</span>
                    </label>
                    <div className="relative">
                      <div
                        className={cn(
                          "absolute left-3 top-1/2 -translate-y-1/2",
                          isDarkMode ? "text-slate-500" : "text-gray-400"
                        )}
                      >
                        <Car size={20} />
                      </div>
                      <select
                        className={cn(
                          "w-full pl-10 pr-4 py-3 rounded-xl border transition-all duration-300 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-500/50",
                          errors.modelId
                            ? "border-red-500 bg-red-500/10"
                            : isDarkMode
                            ? "bg-slate-800/50 border-slate-700/50 text-white"
                            : "bg-white border-slate-300 text-slate-900"
                        )}
                        {...register("modelId")}
                        disabled={carModelsLoading}
                      >
                        <option value="">
                          {carModelsLoading
                            ? "Memuat model..."
                            : "Pilih Model Mobil"}
                        </option>
                        {carModels.map((model: CarModels) => (
                          <option key={model.id} value={model.id}>
                            {model.modelName}{" "}
                            {model.brand?.name ? `(${model.brand.name})` : ""}
                          </option>
                        ))}
                      </select>
                      <div
                        className={cn(
                          "absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none",
                          isDarkMode ? "text-slate-500" : "text-gray-400"
                        )}
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </div>
                    {errors.modelId && (
                      <p className="text-sm text-red-500 mt-1">
                        ⚠ {errors.modelId.message}
                      </p>
                    )}
                  </div>

                  {/* Spec Name */}
                  <div>
                    <label
                      className={cn(
                        "block text-sm font-semibold mb-2",
                        isDarkMode ? "text-slate-300" : "text-slate-700"
                      )}
                    >
                      Nama Spesifikasi
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <div className="relative">
                      <div
                        className={cn(
                          "absolute left-3 top-1/2 -translate-y-1/2",
                          isDarkMode ? "text-slate-500" : "text-gray-400"
                        )}
                      >
                        <Tag size={20} />
                      </div>
                      <input
                        type="text"
                        placeholder="Masukkan nama spesifikasi"
                        className={cn(
                          "w-full pl-10 pr-4 py-3 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-500/50",
                          errors.specName
                            ? "border-red-500 bg-red-500/10"
                            : isDarkMode
                            ? "bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-500"
                            : "bg-white border-slate-300 text-slate-900 placeholder:text-gray-400"
                        )}
                        {...register("specName")}
                      />
                    </div>
                    {errors.specName && (
                      <p className="text-sm text-red-500 mt-1">
                        ⚠ {errors.specName.message}
                      </p>
                    )}
                  </div>

                  {/* Spec Category */}
                  <div>
                    <label
                      className={cn(
                        "block text-sm font-semibold mb-2",
                        isDarkMode ? "text-slate-300" : "text-slate-700"
                      )}
                    >
                      Kategori<span className="text-red-500 ml-1">*</span>
                    </label>
                    <div className="relative">
                      <div
                        className={cn(
                          "absolute left-3 top-1/2 -translate-y-1/2",
                          isDarkMode ? "text-slate-500" : "text-gray-400"
                        )}
                      >
                        <Layers size={20} />
                      </div>
                      <select
                        className={cn(
                          "w-full pl-10 pr-4 py-3 rounded-xl border transition-all duration-300 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-500/50",
                          errors.specCategory
                            ? "border-red-500 bg-red-500/10"
                            : isDarkMode
                            ? "bg-slate-800/50 border-slate-700/50 text-white"
                            : "bg-white border-slate-300 text-slate-900"
                        )}
                        {...register("specCategory")}
                      >
                        <option value="">Pilih Kategori</option>
                        {SPEC_CATEGORIES.map((cat) => (
                          <option key={cat.value} value={cat.value}>
                            {cat.label}
                          </option>
                        ))}
                      </select>
                      <div
                        className={cn(
                          "absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none",
                          isDarkMode ? "text-slate-500" : "text-gray-400"
                        )}
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </div>
                    {errors.specCategory && (
                      <p className="text-sm text-red-500 mt-1">
                        ⚠ {errors.specCategory.message}
                      </p>
                    )}
                  </div>

                  {/* Value & Unit */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        className={cn(
                          "block text-sm font-semibold mb-2",
                          isDarkMode ? "text-slate-300" : "text-slate-700"
                        )}
                      >
                        Nilai Spesifikasi
                        <span className="text-red-500 ml-1">*</span>
                      </label>
                      <div className="relative">
                        <div
                          className={cn(
                            "absolute left-3 top-1/2 -translate-y-1/2",
                            isDarkMode ? "text-slate-500" : "text-gray-400"
                          )}
                        >
                          <Hash size={20} />
                        </div>
                        <input
                          type="text"
                          placeholder="cth: 1500, 200"
                          className={cn(
                            "w-full pl-10 pr-4 py-3 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-500/50",
                            errors.specValue
                              ? "border-red-500 bg-red-500/10"
                              : isDarkMode
                              ? "bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-500"
                              : "bg-white border-slate-300 text-slate-900 placeholder:text-gray-400"
                          )}
                          {...register("specValue")}
                        />
                      </div>
                      {errors.specValue && (
                        <p className="text-sm text-red-500 mt-1">
                          ⚠ {errors.specValue.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label
                        className={cn(
                          "block text-sm font-semibold mb-2",
                          isDarkMode ? "text-slate-300" : "text-slate-700"
                        )}
                      >
                        Satuan (Unit)
                      </label>
                      <input
                        type="text"
                        placeholder="cth: cc, HP, km/l"
                        className={cn(
                          "w-full px-4 py-3 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-500/50",
                          errors.specUnit
                            ? "border-red-500 bg-red-500/10"
                            : isDarkMode
                            ? "bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-500"
                            : "bg-white border-slate-300 text-slate-900 placeholder:text-gray-400"
                        )}
                        {...register("specUnit")}
                      />
                      {errors.specUnit && (
                        <p className="text-sm text-red-500 mt-1">
                          ⚠ {errors.specUnit.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label
                      className={cn(
                        "block text-sm font-semibold mb-2",
                        isDarkMode ? "text-slate-300" : "text-slate-700"
                      )}
                    >
                      Deskripsi
                    </label>
                    <div className="relative">
                      <div
                        className={cn(
                          "absolute left-3 top-3",
                          isDarkMode ? "text-slate-500" : "text-gray-400"
                        )}
                      >
                        <FileText size={20} />
                      </div>
                      <textarea
                        rows={4}
                        placeholder="Masukkan deskripsi spesifikasi"
                        className={cn(
                          "w-full pl-10 pr-4 py-3 rounded-xl border transition-all duration-300 resize-none focus:outline-none focus:ring-2 focus:ring-cyan-500/50",
                          errors.description
                            ? "border-red-500 bg-red-500/10"
                            : isDarkMode
                            ? "bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-500"
                            : "bg-white border-slate-300 text-slate-900 placeholder:text-gray-400"
                        )}
                        {...register("description")}
                      />
                    </div>
                    {errors.description && (
                      <p className="text-sm text-red-500 mt-1">
                        ⚠ {errors.description.message}
                      </p>
                    )}
                  </div>

                  {/* Status */}
                  <div>
                    <label
                      className={cn(
                        "block text-sm font-semibold mb-2",
                        isDarkMode ? "text-slate-300" : "text-slate-700"
                      )}
                    >
                      Status
                    </label>
                    <div
                      className={cn(
                        "flex items-center justify-between p-4 rounded-xl border",
                        isDarkMode
                          ? "bg-slate-800/50 border-slate-700/50"
                          : "bg-slate-50 border-slate-200"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "p-2 rounded-lg",
                            watchIsActive
                              ? "bg-green-500/20 text-green-400"
                              : "bg-orange-500/20 text-orange-400"
                          )}
                        >
                          <ToggleLeft size={20} />
                        </div>
                        <div>
                          <p
                            className={cn(
                              "font-semibold",
                              isDarkMode ? "text-white" : "text-slate-900"
                            )}
                          >
                            {watchIsActive ? "Aktif" : "Tidak Aktif"}
                          </p>
                          <p
                            className={cn(
                              "text-xs",
                              isDarkMode ? "text-slate-400" : "text-slate-500"
                            )}
                          >
                            {watchIsActive
                              ? "Spesifikasi akan ditampilkan"
                              : "Spesifikasi akan disembunyikan"}
                          </p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={watchIsActive}
                          onChange={(e) =>
                            setValue("isActive", e.target.checked)
                          }
                        />
                        <div
                          className={cn(
                            "w-11 h-6 rounded-full peer transition-colors peer-checked:bg-cyan-500",
                            isDarkMode ? "bg-slate-600" : "bg-slate-300",
                            "after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5"
                          )}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Preview */}
            <div>
              <h2
                className={cn(
                  "text-lg font-bold mb-4 flex items-center gap-2",
                  isDarkMode ? "text-white" : "text-slate-900"
                )}
              >
                <Settings size={20} className="text-cyan-400" />
                Preview
              </h2>
              {selectedCarModel && (
                <div
                  className={cn(
                    "p-4 rounded-xl mb-4",
                    isDarkMode ? "bg-slate-800/50" : "bg-slate-100"
                  )}
                >
                  <p
                    className={cn(
                      "text-sm font-medium mb-2",
                      isDarkMode ? "text-slate-400" : "text-slate-600"
                    )}
                  >
                    Model Mobil:
                  </p>
                  <div className="flex items-center gap-3">
                    {selectedCarModel.imageUrl ? (
                      <img
                        src={selectedCarModel.imageUrl}
                        alt={selectedCarModel.modelName}
                        className="w-16 h-12 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-16 h-12 rounded-lg flex items-center justify-center bg-gradient-to-br from-cyan-500 to-blue-600 text-white">
                        <Car size={20} />
                      </div>
                    )}
                    <div>
                      <p
                        className={cn(
                          "font-semibold",
                          isDarkMode ? "text-white" : "text-slate-900"
                        )}
                      >
                        {selectedCarModel.modelName}
                      </p>
                      {selectedCarModel.brand?.name && (
                        <p
                          className={cn(
                            "text-sm",
                            isDarkMode ? "text-slate-400" : "text-slate-600"
                          )}
                        >
                          {selectedCarModel.brand.name}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
              {watchCategory && (
                <div
                  className={cn(
                    "p-4 rounded-xl",
                    isDarkMode ? "bg-slate-800/50" : "bg-slate-100"
                  )}
                >
                  <p
                    className={cn(
                      "text-sm font-medium mb-2",
                      isDarkMode ? "text-slate-400" : "text-slate-600"
                    )}
                  >
                    Kategori:
                  </p>
                  <span
                    className={cn(
                      "inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold capitalize",
                      getCategoryBadgeStyle(watchCategory, isDarkMode)
                    )}
                  >
                    {watchCategory}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 mt-8 border-t border-slate-700/50">
            <button
              type="button"
              onClick={handleResetForm}
              className={cn(
                "px-6 py-3 rounded-xl font-semibold transition-all duration-200",
                isDarkMode
                  ? "bg-slate-700 text-slate-300 hover:bg-slate-600"
                  : "bg-slate-200 text-slate-700 hover:bg-slate-300"
              )}
            >
              Reset Form
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className={cn(
                "px-6 py-3 rounded-xl font-semibold transition-all duration-200",
                isDarkMode
                  ? "bg-slate-700 text-slate-300 hover:bg-slate-600"
                  : "bg-slate-200 text-slate-700 hover:bg-slate-300"
              )}
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting || loading}
              className={cn(
                "px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/50 text-white disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              )}
            >
              {isSubmitting || loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save size={20} />
                  Simpan Perubahan
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
