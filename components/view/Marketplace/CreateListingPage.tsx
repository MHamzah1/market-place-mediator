"use client";

import React, { useEffect, useState } from "react";
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
} from "react-icons/fi";
import { AiOutlineCar, AiOutlineWhatsApp } from "react-icons/ai";
import { BsSpeedometer2, BsFuelPump } from "react-icons/bs";
import {
  TbManualGearbox,
  TbColorSwatch,
  TbFileDescription,
} from "react-icons/tb";
import toast from "react-hot-toast";
import { getCarModelsWithFilters } from "@/lib/state/slice/car-models/CarModelsSlice";
import { getBrandsWithFilters } from "@/lib/state/slice/brand/brandSlice";

const CreateListingPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  const { createLoading } = useSelector(
    (state: RootState) => state.marketplace
  );
  const { data: brands } = useSelector((state: RootState) => state.brand);
  const { data: carModels } = useSelector(
    (state: RootState) => state.CarModels
  );
  const { isLoggedIn, userInfo } = useSelector(
    (state: RootState) => state.auth
  );

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    carModelId: "",
    brandId: "",
    year: new Date().getFullYear(),
    price: "",
    mileage: "",
    transmission: "automatic",
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

  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!isLoggedIn) {
      toast.error("Silakan login terlebih dahulu");
      router.push("/auth/login");
    }
  }, [isLoggedIn, router]);

  useEffect(() => {
    dispatch(getBrandsWithFilters({ perPage: 100 }));
  }, [dispatch]);

  useEffect(() => {
    if (formData.brandId) {
      dispatch(
        getCarModelsWithFilters({ brandId: formData.brandId, perPage: 100 })
      );
    }
  }, [dispatch, formData.brandId]);

  useEffect(() => {
    if (userInfo?.whatsappNumber) {
      setFormData((prev) => ({
        ...prev,
        sellerWhatsapp: userInfo.whatsappNumber ?? "",
      }));
    }
  }, [userInfo]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleAddImageUrl = () => {
    if (newImageUrl && imageUrls.length < 10) {
      try {
        new URL(newImageUrl);
        setImageUrls([...imageUrls, newImageUrl]);
        setNewImageUrl("");
        setErrors((prev) => ({ ...prev, images: "" }));
      } catch {
        toast.error("URL gambar tidak valid");
      }
    }
  };

  const handleRemoveImage = (index: number) => {
    setImageUrls(imageUrls.filter((_, i) => i !== index));
  };

  const validateStep = (currentStep: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!formData.brandId) newErrors.brandId = "Brand harus dipilih";
      if (!formData.carModelId) newErrors.carModelId = "Model harus dipilih";
      if (!formData.year) newErrors.year = "Tahun harus diisi";
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
      // if (imageUrls.length === 0)
      //   newErrors.images = "Minimal 1 gambar diperlukan";
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

  const handleSubmit = async () => {
    if (!validateStep(4)) return;

    try {
      const payload = {
        carModelId: formData.carModelId,
        year: Number(formData.year),
        price: Number(formData.price),
        mileage: Number(formData.mileage),
        transmission: formData.transmission,
        fuelType: formData.fuelType,
        color: formData.color,
        locationCity: formData.locationCity,
        locationProvince: formData.locationProvince,
        description: formData.description,
        condition: formData.condition,
        ownershipStatus: formData.ownershipStatus,
        taxStatus: formData.taxStatus,
        images: imageUrls,
        sellerWhatsapp: formData.sellerWhatsapp,
      };

      await dispatch(createListing(payload)).unwrap();
      toast.success("Listing berhasil dibuat!");
      router.push("/marketplace/my-listings");
    } catch (error: any) {
      toast.error(error || "Gagal membuat listing");
    }
  };

  const formatPrice = (value: string) => {
    const num = value.replace(/\D/g, "");
    return new Intl.NumberFormat("id-ID").format(Number(num));
  };

  const inputClass = `w-full px-4 py-3 rounded-xl border transition-all ${
    isDarkMode
      ? "bg-slate-800 border-slate-700 text-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
      : "bg-white border-gray-200 text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
  }`;

  const labelClass = `block text-sm font-semibold mb-2 ${
    isDarkMode ? "text-slate-300" : "text-gray-700"
  }`;

  const errorClass = "text-red-500 text-xs mt-1";

  const steps = [
    { num: 1, title: "Info Mobil", icon: AiOutlineCar },
    { num: 2, title: "Harga & Kondisi", icon: BsSpeedometer2 },
    { num: 3, title: "Lokasi & Deskripsi", icon: FiMapPin },
    { num: 4, title: "Foto & Kontak", icon: FiImage },
  ];

  return (
    <div
      className={`min-h-screen ${isDarkMode ? "bg-slate-950" : "bg-gray-50"}`}
    >
      {/* Header */}
      <div
        className={`sticky top-0 z-40 ${
          isDarkMode
            ? "bg-slate-900/95 backdrop-blur-xl"
            : "bg-white/95 backdrop-blur-xl"
        } shadow-lg`}
      >
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className={`flex items-center gap-2 font-semibold ${
                isDarkMode
                  ? "text-slate-300 hover:text-white"
                  : "text-gray-700 hover:text-gray-900"
              }`}
            >
              <FiArrowLeft className="text-xl" />
              Kembali
            </button>
            <h1
              className={`text-xl font-bold ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Jual Mobil
            </h1>
            <div className="w-24"></div>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          {steps.map((s, idx) => (
            <React.Fragment key={s.num}>
              <div className="flex flex-col items-center">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                    step >= s.num
                      ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30"
                      : isDarkMode
                      ? "bg-slate-800 text-slate-500"
                      : "bg-gray-200 text-gray-400"
                  }`}
                >
                  {step > s.num ? (
                    <FiCheck className="text-xl" />
                  ) : (
                    <s.icon className="text-xl" />
                  )}
                </div>
                <span
                  className={`text-xs mt-2 font-medium ${
                    step >= s.num
                      ? isDarkMode
                        ? "text-cyan-400"
                        : "text-blue-600"
                      : isDarkMode
                      ? "text-slate-500"
                      : "text-gray-400"
                  }`}
                >
                  {s.title}
                </span>
              </div>
              {idx < steps.length - 1 && (
                <div
                  className={`flex-1 h-1 mx-2 rounded ${
                    step > s.num
                      ? "bg-gradient-to-r from-cyan-500 to-blue-600"
                      : isDarkMode
                      ? "bg-slate-800"
                      : "bg-gray-200"
                  }`}
                ></div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Form Card */}
        <div
          className={`rounded-3xl shadow-2xl overflow-hidden ${
            isDarkMode ? "bg-slate-900" : "bg-white"
          }`}
        >
          <div className="p-8">
            {/* Step 1: Car Info */}
            {step === 1 && (
              <div className="space-y-6">
                <h2
                  className={`text-2xl font-bold mb-6 ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Informasi Mobil
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={labelClass}>
                      <AiOutlineCar className="inline mr-2" />
                      Brand
                    </label>
                    <select
                      name="brandId"
                      value={formData.brandId}
                      onChange={handleChange}
                      className={inputClass}
                    >
                      <option value="">Pilih Brand</option>
                      {brands?.map((brand: any) => (
                        <option key={brand.id} value={brand.id}>
                          {brand.name}
                        </option>
                      ))}
                    </select>
                    {errors.brandId && (
                      <p className={errorClass}>{errors.brandId}</p>
                    )}
                  </div>

                  <div>
                    <label className={labelClass}>
                      <AiOutlineCar className="inline mr-2" />
                      Model
                    </label>
                    <select
                      name="carModelId"
                      value={formData.carModelId}
                      onChange={handleChange}
                      className={inputClass}
                      disabled={!formData.brandId}
                    >
                      <option value="">Pilih Model</option>
                      {carModels?.map((model: any) => (
                        <option key={model.id} value={model.id}>
                          {model.modelName}
                        </option>
                      ))}
                    </select>
                    {errors.carModelId && (
                      <p className={errorClass}>{errors.carModelId}</p>
                    )}
                  </div>

                  <div>
                    <label className={labelClass}>Tahun</label>
                    <select
                      name="year"
                      value={formData.year}
                      onChange={handleChange}
                      className={inputClass}
                    >
                      {Array.from(
                        { length: 36 },
                        (_, i) => new Date().getFullYear() - i
                      ).map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                    {errors.year && <p className={errorClass}>{errors.year}</p>}
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
                      placeholder="Contoh: Hitam Metalik"
                      className={inputClass}
                    />
                    {errors.color && (
                      <p className={errorClass}>{errors.color}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Price & Condition */}
            {step === 2 && (
              <div className="space-y-6">
                <h2
                  className={`text-2xl font-bold mb-6 ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Harga & Kondisi
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={labelClass}>Harga (Rp)</label>
                    <input
                      type="text"
                      name="price"
                      value={formData.price ? formatPrice(formData.price) : ""}
                      onChange={(e) => {
                        const raw = e.target.value.replace(/\D/g, "");
                        setFormData({ ...formData, price: raw });
                      }}
                      placeholder="150.000.000"
                      className={inputClass}
                    />
                    {errors.price && (
                      <p className={errorClass}>{errors.price}</p>
                    )}
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

                  <div>
                    <label className={labelClass}>
                      <TbManualGearbox className="inline mr-2" />
                      Transmisi
                    </label>
                    <select
                      name="transmission"
                      value={formData.transmission}
                      onChange={handleChange}
                      className={inputClass}
                    >
                      <option value="automatic">Automatic</option>
                      <option value="manual">Manual</option>
                    </select>
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
                    <label className={labelClass}>Kepemilikan</label>
                    <select
                      name="ownershipStatus"
                      value={formData.ownershipStatus}
                      onChange={handleChange}
                      className={inputClass}
                    >
                      <option value="Tangan Pertama">Tangan Pertama</option>
                      <option value="Tangan Kedua">Tangan Kedua</option>
                      <option value="Tangan Ketiga">Tangan Ketiga</option>
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
              <div className="space-y-6">
                <h2
                  className={`text-2xl font-bold mb-6 ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Lokasi & Deskripsi
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  <div className="flex justify-between mt-1">
                    {errors.description && (
                      <p className={errorClass}>{errors.description}</p>
                    )}
                    <span
                      className={`text-xs ${
                        isDarkMode ? "text-slate-500" : "text-gray-400"
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
              <div className="space-y-6">
                <h2
                  className={`text-2xl font-bold mb-6 ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Foto & Kontak
                </h2>

                {/* Image Upload */}
                <div>
                  <label className={labelClass}>
                    <FiImage className="inline mr-2" />
                    Foto Mobil (min. 1, max. 10)
                  </label>

                  <div className="flex gap-3 mb-4">
                    <input
                      type="text"
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      placeholder="Masukkan URL gambar"
                      className={`flex-1 ${inputClass}`}
                    />
                    <button
                      type="button"
                      onClick={handleAddImageUrl}
                      disabled={imageUrls.length >= 10}
                      className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl hover:from-cyan-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FiPlus className="text-xl" />
                    </button>
                  </div>
                  {errors.images && (
                    <p className={errorClass}>{errors.images}</p>
                  )}

                  {/* Image Preview Grid */}
                  {imageUrls.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                      {imageUrls.map((url, idx) => (
                        <div
                          key={idx}
                          className="relative aspect-square rounded-xl overflow-hidden group"
                        >
                          <img
                            src={url}
                            alt={`Preview ${idx + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "https://via.placeholder.com/200?text=Error";
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all"
                          >
                            <FiX />
                          </button>
                          {idx === 0 && (
                            <span className="absolute bottom-2 left-2 px-2 py-1 bg-cyan-500 text-white text-xs font-bold rounded">
                              Utama
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  <p
                    className={`text-sm mt-2 ${
                      isDarkMode ? "text-slate-500" : "text-gray-500"
                    }`}
                  >
                    Upload foto berkualitas tinggi untuk menarik pembeli. Foto
                    pertama akan menjadi foto utama.
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
                    className={`text-sm mt-2 ${
                      isDarkMode ? "text-slate-500" : "text-gray-500"
                    }`}
                  >
                    Format: 628xxxxxxxxxx (tanpa + atau spasi)
                  </p>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-slate-800">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                    isDarkMode
                      ? "bg-slate-800 text-white hover:bg-slate-700"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                  }`}
                >
                  <FiArrowLeft />
                  Sebelumnya
                </button>
              ) : (
                <div></div>
              )}

              {step < 4 ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all shadow-lg shadow-cyan-500/25"
                >
                  Selanjutnya
                  <FiArrowRight />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={createLoading}
                  className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg shadow-green-500/25 disabled:opacity-50"
                >
                  {createLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      Memproses...
                    </>
                  ) : (
                    <>
                      <FiCheck />
                      Publikasikan
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateListingPage;
