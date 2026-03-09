"use client";

import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/lib/state/store";
import { createListing } from "@/lib/state/slice/marketplace/marketplaceSlice";

import { useRouter } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";
import {
  FiArrowLeft,
  FiX,
  FiCheck,
  FiImage,
  FiMapPin,
  FiPlus,
  FiArrowRight,
  FiUpload,
} from "react-icons/fi";
import { AiOutlineWhatsApp } from "react-icons/ai";
import { BsSpeedometer2, BsFuelPump } from "react-icons/bs";
import {
  TbColorSwatch,
  TbFileDescription,
} from "react-icons/tb";
import toast from "react-hot-toast";
import PaginatedSelectField from "@/components/ui/paginated-select-field";

// Allowed image types
const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];
const MAX_FILE_SIZE_MB = 5;
const MAX_FILES = 10;

const CreateListingPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { createLoading } = useSelector(
    (state: RootState) => state.marketplace,
  );
  const { isLoggedIn, userInfo } = useSelector(
    (state: RootState) => state.auth,
  );

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    variantId: "",
    yearPriceId: "",
    price: "",
    mileage: "",
    fuelType: "bensin",
    color: "",
    locationCity: "",
    locationProvince: "",
    description: "",
    condition: "bekas",
    ownershipStatus: "Tangan Pertama",
    taxStatus: "Pajak Hidup",
    sellerWhatsapp: "",
  });

  // Cascaded select state (same pattern as VehicleRegisterForm)
  const [selectedBrandId, setSelectedBrandId] = useState("");
  const [selectedModelId, setSelectedModelId] = useState("");
  const [displayBrandName, setDisplayBrandName] = useState("");
  const [displayModelName, setDisplayModelName] = useState("");
  const [displayVariantName, setDisplayVariantName] = useState("");
  const [displayYearPrice, setDisplayYearPrice] = useState("");

  // Changed: Store File objects instead of URL strings
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      toast.error("Silakan login terlebih dahulu");
      router.push("/auth/login");
    }
  }, [isLoggedIn, router]);

  useEffect(() => {
    if (userInfo?.whatsappNumber) {
      setFormData((prev) => ({
        ...prev,
        sellerWhatsapp: userInfo.whatsappNumber ?? "",
      }));
    }
  }, [userInfo]);

  // Cleanup preview URLs when component unmounts
  useEffect(() => {
    return () => {
      imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imagePreviews]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Validate file
  const validateFile = (file: File): string | null => {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return `File "${file.name}" tidak valid. Hanya JPG, PNG, dan WEBP yang diperbolehkan.`;
    }
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      return `File "${file.name}" terlalu besar. Maksimal ${MAX_FILE_SIZE_MB}MB.`;
    }
    return null;
  };

  // Handle file selection
  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const newFiles: File[] = [];
    const newPreviews: string[] = [];
    const errors: string[] = [];

    // Check if we already have max files
    if (imageFiles.length >= MAX_FILES) {
      toast.error(`Maksimal ${MAX_FILES} gambar`);
      return;
    }

    const remainingSlots = MAX_FILES - imageFiles.length;
    const filesToProcess = Array.from(files).slice(0, remainingSlots);

    filesToProcess.forEach((file) => {
      const error = validateFile(file);
      if (error) {
        errors.push(error);
      } else {
        newFiles.push(file);
        newPreviews.push(URL.createObjectURL(file));
      }
    });

    if (errors.length > 0) {
      errors.forEach((err) => toast.error(err));
    }

    if (newFiles.length > 0) {
      setImageFiles((prev) => [...prev, ...newFiles]);
      setImagePreviews((prev) => [...prev, ...newPreviews]);
      setErrors((prev) => ({ ...prev, images: "" }));
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Handle drag events
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Handle drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

  // Remove image
  const handleRemoveImage = (index: number) => {
    URL.revokeObjectURL(imagePreviews[index]);
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const validateStep = (currentStep: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!selectedBrandId) newErrors.brandId = "Brand harus dipilih";
      if (!selectedModelId) newErrors.carModelId = "Model harus dipilih";
      if (!formData.variantId) newErrors.variantId = "Varian harus dipilih";
      if (!formData.yearPriceId) newErrors.yearPriceId = "Tahun harga harus dipilih";
      if (!formData.color) newErrors.color = "Warna harus diisi";
    }

    if (currentStep === 2) {
      if (!formData.price) newErrors.price = "Harga harus diisi";
      if (Number(formData.price) < 1000000)
        newErrors.price = "Harga minimal Rp 1.000.000";
      if (!formData.mileage && formData.mileage !== "0")
        newErrors.mileage = "Kilometer harus diisi";
    }

    if (currentStep === 3) {
      if (!formData.locationCity) newErrors.locationCity = "Kota harus diisi";
      if (!formData.locationProvince)
        newErrors.locationProvince = "Provinsi harus diisi";
      if (!formData.description)
        newErrors.description = "Deskripsi harus diisi";
      if (formData.description && formData.description.length < 50) {
        newErrors.description = "Deskripsi minimal 50 karakter";
      }
    }

    if (currentStep === 4) {
      // Validate images - minimum 1 image required
      if (imageFiles.length === 0)
        newErrors.images = "Minimal 1 gambar diperlukan";
      if (!formData.sellerWhatsapp)
        newErrors.sellerWhatsapp = "Nomor WhatsApp harus diisi";
      if (
        formData.sellerWhatsapp &&
        !/^628\d{8,13}$/.test(formData.sellerWhatsapp)
      ) {
        newErrors.sellerWhatsapp = "Format: 628xxxxxxxxxx";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const handlePrevStep = () => {
    setStep(step - 1);
  };

  // ...existing code...

  const handleSubmit = async () => {
    if (!validateStep(4)) return;

    try {
      const payload = {
        variantId: formData.variantId,
        yearPriceId: formData.yearPriceId,
        price: Number(formData.price),
        mileage: Number(formData.mileage),
        fuelType: formData.fuelType,
        color: formData.color,
        locationCity: formData.locationCity,
        locationProvince: formData.locationProvince,
        description: formData.description,
        condition: formData.condition,
        ownershipStatus: formData.ownershipStatus,
        taxStatus: formData.taxStatus,
        images: imageFiles,
        sellerWhatsapp: formData.sellerWhatsapp,
      };

      await dispatch(createListing(payload)).unwrap();
      toast.success("Listing berhasil dibuat!");
      router.push("/marketplace/my-listings");
    } catch (error: unknown) {
      // Error dari unwrap() sudah dalam bentuk string dari rejectWithValue
      console.error("Error creating listing:", error);
      if (typeof error === "string") {
        toast.error(error);
      } else {
        toast.error("Gagal membuat listing");
      }
    }
  };

  // ...existing code...
  const formatPrice = (value: string) => {
    const num = value.replace(/\D/g, "");
    return new Intl.NumberFormat("id-ID").format(Number(num));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const inputClass = `w-full px-4 py-3 rounded-xl border transition-all ${isDarkMode
    ? "bg-slate-800 border-slate-700 text-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
    : "bg-white border-gray-200 text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
    }`;

  const labelClass = `block text-sm font-semibold mb-2 ${isDarkMode ? "text-slate-300" : "text-gray-700"
    }`;

  const errorClass = "text-red-500 text-xs mt-1";

  const steps = [
    { number: 1, title: "Info Mobil" },
    { number: 2, title: "Harga & KM" },
    { number: 3, title: "Lokasi & Deskripsi" },
    { number: 4, title: "Foto & Kontak" },
  ];

  // ...existing code...

  return (
    <div
      className={`min-h-screen ${isDarkMode
        ? "bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800"
        : "bg-gradient-to-b from-gray-50 via-white to-gray-100"
        }`}
    >
      <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className={`flex items-center gap-1.5 sm:gap-2 mb-4 sm:mb-6 text-sm sm:text-base ${isDarkMode
            ? "text-slate-400 hover:text-white"
            : "text-gray-600 hover:text-gray-900"
            } transition-colors`}
        >
          <FiArrowLeft className="text-base sm:text-lg" />
          Kembali
        </button>

        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1
            className={`text-2xl sm:text-3xl md:text-4xl font-bold mb-1.5 sm:mb-2 ${isDarkMode ? "text-white" : "text-gray-900"
              }`}
          >
            Jual Mobil Anda
          </h1>
          <p
            className={`text-sm sm:text-base ${isDarkMode ? "text-slate-400" : "text-gray-600"
              }`}
          >
            Isi detail mobil untuk mulai menjual
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-between mb-6 sm:mb-8 overflow-x-auto pb-2">
          {steps.map((s, index) => (
            <div
              key={s.number}
              className={`flex flex-col items-center ${index < steps.length - 1 ? "flex-1 min-w-0" : "flex-shrink-0"
                }`}
            >
              <div className="flex items-center w-full">
                <div
                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold transition-all text-sm sm:text-base flex-shrink-0 ${step >= s.number
                    ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white"
                    : isDarkMode
                      ? "bg-slate-800 text-slate-500"
                      : "bg-gray-200 text-gray-500"
                    }`}
                >
                  {step > s.number ? (
                    <FiCheck className="text-sm sm:text-base" />
                  ) : (
                    s.number
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 sm:h-1 mx-1 sm:mx-2 ${step > s.number
                      ? "bg-gradient-to-r from-cyan-500 to-blue-600"
                      : isDarkMode
                        ? "bg-slate-800"
                        : "bg-gray-200"
                      }`}
                  />
                )}
              </div>
              <span
                className={`text-[10px] sm:text-xs mt-1.5 sm:mt-2 text-center ${step >= s.number
                  ? isDarkMode
                    ? "text-cyan-400"
                    : "text-blue-600"
                  : isDarkMode
                    ? "text-slate-500"
                    : "text-gray-500"
                  }`}
              >
                {s.title}
              </span>
            </div>
          ))}
        </div>

        {/* Form Card */}
        <div
          className={`rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 ${isDarkMode
            ? "bg-slate-800/50 border border-slate-700"
            : "bg-white shadow-xl border border-gray-100"
            }`}
        >
          {/* Step 1: Car Info */}
          {step === 1 && (
            <div className="space-y-4 sm:space-y-6">
              <h2
                className={`text-xl sm:text-2xl font-bold mb-4 sm:mb-6 ${isDarkMode ? "text-white" : "text-gray-900"
                  }`}
              >
                Informasi Mobil
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {/* Brand (cascaded select) */}
                <div>
                  <PaginatedSelectField
                    label="Merek"
                    value={selectedBrandId}
                    displayValue={displayBrandName}
                    onChange={(_val: string, item: unknown) => {
                      const brand = item as { id: string; name: string };
                      setSelectedBrandId(brand.id);
                      setDisplayBrandName(brand.name);
                      // Reset downstream
                      setSelectedModelId("");
                      setDisplayModelName("");
                      setDisplayVariantName("");
                      setDisplayYearPrice("");
                      setFormData((prev) => ({
                        ...prev,
                        variantId: "",
                        yearPriceId: "",
                      }));
                      if (errors.brandId) {
                        setErrors((prev) => ({ ...prev, brandId: "" }));
                      }
                    }}
                    apiUrl="/brand/paged"
                    getLabel={(item) => (item as { name: string }).name}
                    getValue={(item) => (item as { id: string }).id}
                    placeholder="Pilih merek..."
                    required
                  />
                  {errors.brandId && (
                    <p className={errorClass}>{errors.brandId}</p>
                  )}
                </div>

                {/* Car Model (cascaded select) */}
                <div>
                  <PaginatedSelectField
                    label="Model"
                    value={selectedModelId}
                    displayValue={displayModelName}
                    onChange={(_val: string, item: unknown) => {
                      const model = item as { id: string; modelName: string };
                      setSelectedModelId(model.id);
                      setDisplayModelName(model.modelName);
                      // Reset downstream
                      setDisplayVariantName("");
                      setDisplayYearPrice("");
                      setFormData((prev) => ({
                        ...prev,
                        variantId: "",
                        yearPriceId: "",
                      }));
                      if (errors.carModelId) {
                        setErrors((prev) => ({ ...prev, carModelId: "" }));
                      }
                    }}
                    apiUrl="/CarModels"
                    queryParams={selectedBrandId ? { brandId: selectedBrandId } : {}}
                    getLabel={(item) => (item as { modelName: string }).modelName}
                    getValue={(item) => (item as { id: string }).id}
                    placeholder={selectedBrandId ? "Pilih model..." : "Pilih merek dulu"}
                    disabled={!selectedBrandId}
                    required
                  />
                  {errors.carModelId && (
                    <p className={errorClass}>{errors.carModelId}</p>
                  )}
                </div>

                {/* Variant (cascaded select) */}
                <div>
                  <PaginatedSelectField
                    label="Varian"
                    value={formData.variantId}
                    displayValue={displayVariantName || undefined}
                    onChange={(_val: string, item: unknown) => {
                      const variant = item as {
                        id: string;
                        variantName: string;
                        transmissionType?: string;
                      };
                      const label = `${variant.variantName}${variant.transmissionType ? ` (${variant.transmissionType})` : ""}`;
                      setDisplayVariantName(label);
                      // Reset downstream
                      setDisplayYearPrice("");
                      setFormData((prev) => ({
                        ...prev,
                        variantId: variant.id,
                        yearPriceId: "",
                      }));
                      if (errors.variantId) {
                        setErrors((prev) => ({ ...prev, variantId: "" }));
                      }
                    }}
                    apiUrl="/variants"
                    queryParams={selectedModelId ? { modelId: selectedModelId } : {}}
                    getLabel={(item) => {
                      const v = item as { variantName: string; transmissionType?: string };
                      return `${v.variantName}${v.transmissionType ? ` (${v.transmissionType})` : ""}`;
                    }}
                    getValue={(item) => (item as { id: string }).id}
                    placeholder={selectedModelId ? "Pilih varian..." : "Pilih model dulu"}
                    disabled={!selectedModelId}
                    required
                  />
                  {errors.variantId && (
                    <p className={errorClass}>{errors.variantId}</p>
                  )}
                </div>

                {/* Year Price (cascaded select) */}
                <div>
                  <PaginatedSelectField
                    label="Tahun & Harga Pasar"
                    value={formData.yearPriceId}
                    displayValue={displayYearPrice || undefined}
                    onChange={(_val: string, item: unknown) => {
                      const yp = item as {
                        id: string;
                        year: number;
                        basePrice: string;
                      };
                      setDisplayYearPrice(
                        `${yp.year} — Rp ${Number(yp.basePrice).toLocaleString("id-ID")}`
                      );
                      setFormData((prev) => ({
                        ...prev,
                        yearPriceId: yp.id,
                      }));
                      if (errors.yearPriceId) {
                        setErrors((prev) => ({ ...prev, yearPriceId: "" }));
                      }
                    }}
                    apiUrl="/year-prices"
                    queryParams={formData.variantId ? { variantId: formData.variantId } : {}}
                    getLabel={(item) => {
                      const yp = item as { year: number; basePrice: string };
                      return `${yp.year} — Rp ${Number(yp.basePrice).toLocaleString("id-ID")}`;
                    }}
                    getValue={(item) => (item as { id: string }).id}
                    placeholder={formData.variantId ? "Pilih tahun..." : "Pilih varian dulu"}
                    disabled={!formData.variantId}
                    required
                  />
                  {errors.yearPriceId && (
                    <p className={errorClass}>{errors.yearPriceId}</p>
                  )}
                </div>

                <div>
                  <label className={labelClass}>
                    <TbColorSwatch className="inline mr-2" />
                    Warna
                  </label>
                  <input
                    type="text"
                    name="color"
                    value={formData.color}
                    onChange={handleChange}
                    placeholder="Hitam Metalik"
                    className={inputClass}
                  />
                  {errors.color && <p className={errorClass}>{errors.color}</p>}
                </div>
                <div>
                  <label className={labelClass}>
                    <BsFuelPump className="inline mr-2" />
                    Bahan Bakar
                  </label>
                  <select
                    name="fuelType"
                    value={formData.fuelType}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    <option value="bensin">Bensin</option>
                    <option value="diesel">Diesel</option>
                    <option value="hybrid">Hybrid</option>
                    <option value="electric">Electric</option>
                  </select>
                </div>
              </div>


            </div>
          )}

          {/* Step 2: Price & Mileage */}
          {step === 2 && (
            <div className="space-y-4 sm:space-y-6">
              <h2
                className={`text-xl sm:text-2xl font-bold mb-4 sm:mb-6 ${isDarkMode ? "text-white" : "text-gray-900"
                  }`}
              >
                Harga & Kilometer
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className={labelClass}>Harga (Rp)</label>
                  <input
                    type="text"
                    name="price"
                    value={formData.price ? formatPrice(formData.price) : ""}
                    onChange={(e) => {
                      const raw = e.target.value.replace(/\D/g, "");
                      setFormData((prev) => ({ ...prev, price: raw }));
                    }}
                    placeholder="150.000.000"
                    className={inputClass}
                  />
                  {errors.price && <p className={errorClass}>{errors.price}</p>}
                </div>

                <div>
                  <label className={labelClass}>
                    <BsSpeedometer2 className="inline mr-2" />
                    Kilometer
                  </label>
                  <input
                    type="number"
                    name="mileage"
                    value={formData.mileage}
                    onChange={handleChange}
                    placeholder="50000"
                    className={inputClass}
                  />
                  {errors.mileage && (
                    <p className={errorClass}>{errors.mileage}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                <div>
                  <label className={labelClass}>Kondisi</label>
                  <select
                    name="condition"
                    value={formData.condition}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    <option value="bekas">Bekas</option>
                    <option value="baru">Baru</option>
                  </select>
                </div>

                <div>
                  <label className={labelClass}>Status Kepemilikan</label>
                  <select
                    name="ownershipStatus"
                    value={formData.ownershipStatus}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    <option value="Tangan Pertama">Tangan Pertama</option>
                    <option value="Tangan Kedua">Tangan Kedua</option>
                    <option value="Tangan Ketiga">Tangan Ketiga</option>
                    <option value="Tangan Keempat+">Tangan Keempat+</option>
                  </select>
                </div>

                <div>
                  <label className={labelClass}>Status Pajak</label>
                  <select
                    name="taxStatus"
                    value={formData.taxStatus}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    <option value="Pajak Hidup">Pajak Hidup</option>
                    <option value="Pajak Mati">Pajak Mati</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Location & Description */}
          {step === 3 && (
            <div className="space-y-4 sm:space-y-6">
              <h2
                className={`text-xl sm:text-2xl font-bold mb-4 sm:mb-6 ${isDarkMode ? "text-white" : "text-gray-900"
                  }`}
              >
                Lokasi & Deskripsi
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className={labelClass}>
                    <FiMapPin className="inline mr-2" />
                    Kota
                  </label>
                  <input
                    type="text"
                    name="locationCity"
                    value={formData.locationCity}
                    onChange={handleChange}
                    placeholder="Jakarta Selatan"
                    className={inputClass}
                  />
                  {errors.locationCity && (
                    <p className={errorClass}>{errors.locationCity}</p>
                  )}
                </div>

                <div>
                  <label className={labelClass}>Provinsi</label>
                  <input
                    type="text"
                    name="locationProvince"
                    value={formData.locationProvince}
                    onChange={handleChange}
                    placeholder="DKI Jakarta"
                    className={inputClass}
                  />
                  {errors.locationProvince && (
                    <p className={errorClass}>{errors.locationProvince}</p>
                  )}
                </div>
              </div>

              <div>
                <label className={labelClass}>
                  <TbFileDescription className="inline mr-2" />
                  Deskripsi (min. 50 karakter)
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Jelaskan kondisi mobil, fitur, riwayat servis, dll..."
                  className={inputClass}
                />
                <div className="flex flex-col sm:flex-row justify-between gap-1 mt-1">
                  {errors.description && (
                    <p className={errorClass}>{errors.description}</p>
                  )}
                  <span
                    className={`text-xs ${isDarkMode ? "text-slate-500" : "text-gray-400"
                      }`}
                  >
                    {formData.description.length}/50 karakter minimum
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Images & Contact */}
          {step === 4 && (
            <div className="space-y-4 sm:space-y-6">
              <h2
                className={`text-xl sm:text-2xl font-bold mb-4 sm:mb-6 ${isDarkMode ? "text-white" : "text-gray-900"
                  }`}
              >
                Foto & Kontak
              </h2>

              {/* File Upload Section */}
              <div>
                <label className={labelClass}>
                  <FiImage className="inline mr-2" />
                  Foto Mobil (min. 1, max. {MAX_FILES})
                </label>

                {/* Drag & Drop Zone */}
                <div
                  className={`relative border-2 border-dashed rounded-xl transition-all ${dragActive
                    ? "border-cyan-500 bg-cyan-500/10"
                    : errors.images
                      ? "border-red-400"
                      : isDarkMode
                        ? "border-slate-600 hover:border-slate-500"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept={ALLOWED_IMAGE_TYPES.join(",")}
                    multiple
                    onChange={(e) => handleFileSelect(e.target.files)}
                    className="hidden"
                    id="image-upload"
                  />

                  <label
                    htmlFor="image-upload"
                    className={`flex flex-col items-center justify-center p-6 sm:p-8 cursor-pointer ${imageFiles.length >= MAX_FILES
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                      }`}
                  >
                    <FiUpload
                      className={`text-3xl sm:text-4xl mb-2 sm:mb-3 ${dragActive
                        ? "text-cyan-500"
                        : isDarkMode
                          ? "text-slate-500"
                          : "text-gray-400"
                        }`}
                    />
                    <p
                      className={`text-xs sm:text-sm font-medium mb-1 text-center ${isDarkMode ? "text-slate-300" : "text-gray-700"
                        }`}
                    >
                      {dragActive
                        ? "Lepaskan file di sini"
                        : "Drag & drop gambar atau klik untuk upload"}
                    </p>
                    <p
                      className={`text-[10px] sm:text-xs text-center ${isDarkMode ? "text-slate-500" : "text-gray-500"
                        }`}
                    >
                      JPG, PNG, WEBP (Max {MAX_FILE_SIZE_MB}MB per file)
                    </p>
                  </label>
                </div>

                {errors.images && <p className={errorClass}>{errors.images}</p>}

                {/* Image Preview Grid */}
                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-4 mt-3 sm:mt-4">
                    {imagePreviews.map((preview, idx) => (
                      <div
                        key={idx}
                        className="relative aspect-square rounded-lg sm:rounded-xl overflow-hidden group"
                      >
                        <img
                          src={preview}
                          alt={`Preview ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <div
                          className={`absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center`}
                        >
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            className="p-1.5 sm:p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                          >
                            <FiX className="text-base sm:text-lg" />
                          </button>
                        </div>
                        {idx === 0 && (
                          <span className="absolute bottom-1 sm:bottom-2 left-1 sm:left-2 px-1.5 sm:px-2 py-0.5 sm:py-1 bg-cyan-500 text-white text-[10px] sm:text-xs font-bold rounded">
                            Utama
                          </span>
                        )}
                        {/* File info */}
                        <div
                          className={`absolute top-1 sm:top-2 right-1 sm:right-2 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-[10px] sm:text-xs ${isDarkMode ? "bg-slate-800/80" : "bg-white/80"
                            }`}
                        >
                          {formatFileSize(imageFiles[idx]?.size || 0)}
                        </div>
                      </div>
                    ))}

                    {/* Add More Button */}
                    {imageFiles.length < MAX_FILES && (
                      <label
                        htmlFor="image-upload"
                        className={`aspect-square rounded-lg sm:rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all ${isDarkMode
                          ? "border-slate-600 hover:border-cyan-500 hover:bg-cyan-500/10"
                          : "border-gray-300 hover:border-blue-500 hover:bg-blue-50"
                          }`}
                      >
                        <FiPlus
                          className={`text-xl sm:text-2xl mb-0.5 sm:mb-1 ${isDarkMode ? "text-slate-500" : "text-gray-400"
                            }`}
                        />
                        <span
                          className={`text-[10px] sm:text-xs ${isDarkMode ? "text-slate-500" : "text-gray-500"
                            }`}
                        >
                          Tambah
                        </span>
                      </label>
                    )}
                  </div>
                )}

                <p
                  className={`text-xs sm:text-sm mt-2 sm:mt-3 ${isDarkMode ? "text-slate-500" : "text-gray-500"
                    }`}
                >
                  {imageFiles.length}/{MAX_FILES} gambar dipilih. Foto pertama
                  akan menjadi foto utama.
                </p>
              </div>

              {/* WhatsApp */}
              <div>
                <label className={labelClass}>
                  <AiOutlineWhatsApp className="inline mr-2 text-green-500" />
                  Nomor WhatsApp
                </label>
                <input
                  type="text"
                  name="sellerWhatsapp"
                  value={formData.sellerWhatsapp}
                  onChange={handleChange}
                  placeholder="6281234567890"
                  className={inputClass}
                />
                {errors.sellerWhatsapp && (
                  <p className={errorClass}>{errors.sellerWhatsapp}</p>
                )}
                <p
                  className={`text-xs sm:text-sm mt-2 ${isDarkMode ? "text-slate-500" : "text-gray-500"
                    }`}
                >
                  Format: 628xxxxxxxxxx (tanpa + atau spasi)
                </p>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div
            className={`flex flex-col sm:flex-row justify-between gap-3 sm:gap-0 mt-6 sm:mt-8 pt-4 sm:pt-6 border-t ${isDarkMode ? "border-slate-700" : "border-gray-200"
              }`}
          >
            {step > 1 ? (
              <button
                type="button"
                onClick={handlePrevStep}
                className={`flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-semibold transition-all text-sm sm:text-base ${isDarkMode
                  ? "bg-slate-800 text-white hover:bg-slate-700"
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                  }`}
              >
                <FiArrowLeft className="text-base sm:text-lg" />
                Sebelumnya
              </button>
            ) : (
              <div className="hidden sm:block"></div>
            )}

            {step < 4 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all shadow-lg shadow-cyan-500/25 text-sm sm:text-base order-first sm:order-last"
              >
                Selanjutnya
                <FiArrowRight className="text-base sm:text-lg" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={createLoading}
                className="flex items-center justify-center gap-2 px-6 sm:px-8 py-2.5 sm:py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg shadow-green-500/25 disabled:opacity-50 text-sm sm:text-base order-first sm:order-last"
              >
                {createLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-2 border-white border-t-transparent"></div>
                    Memproses...
                  </>
                ) : (
                  <>
                    <FiCheck className="text-base sm:text-lg" />
                    Publikasikan
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateListingPage;
