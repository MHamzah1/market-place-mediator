"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/lib/state/store";
import {
  fetchListingDetail,
  getWhatsAppLink,
  clearSelectedListing,
} from "@/lib/state/slice/marketplace/marketplaceSlice";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useTheme } from "@/context/ThemeContext";
import {
  FiArrowLeft,
  FiShare2,
  FiHeart,
  FiMapPin,
  FiCalendar,
  FiEye,
  FiMessageCircle,
  FiPhone,
  FiChevronLeft,
  FiChevronRight,
  FiCheck,
  FiX,
  FiUser,
  FiClock,
  FiShield,
} from "react-icons/fi";
import {
  AiOutlineCar,
  AiOutlineWhatsApp,
  AiOutlineSafety,
  AiOutlineClockCircle,
} from "react-icons/ai";
import { BsSpeedometer2, BsFuelPump, BsGear } from "react-icons/bs";
import {
  TbManualGearbox,
  TbColorSwatch,
  TbFileDescription,
} from "react-icons/tb";
import { HiOutlineDocumentText } from "react-icons/hi";
import toast from "react-hot-toast";

const ListingDetailPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const params = useParams();
  const router = useRouter();
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  const { selectedListing, detailLoading, whatsappLink } = useSelector(
    (state: RootState) => state.marketplace,
  );
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);

  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL_IMAGES ||
    "http://192.168.2.100:8080/uploads/";

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (params.id) {
      dispatch(fetchListingDetail(params.id as string));
    }

    return () => {
      dispatch(clearSelectedListing());
    };
  }, [dispatch, params.id]);

  const handleWhatsApp = async () => {
    if (!params.id) return;

    try {
      const result = await dispatch(
        getWhatsAppLink(params.id as string),
      ).unwrap();
      window.open(result.whatsappUrl, "_blank");
    } catch (error) {
      toast.error("Gagal membuka WhatsApp");
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${selectedListing?.carModel?.brand?.name} ${selectedListing?.carModel?.modelName}`,
          text: `Lihat mobil ini: ${selectedListing?.carModel?.brand?.name} ${selectedListing?.carModel?.modelName} ${selectedListing?.year}`,
          url: window.location.href,
        });
      } catch (error) {
        console.log("Share cancelled");
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link berhasil disalin!");
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatMileage = (mileage: number) => {
    return new Intl.NumberFormat("id-ID").format(mileage) + " km";
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24),
    );
    if (diffInDays === 0) return "Hari ini";
    if (diffInDays === 1) return "Kemarin";
    if (diffInDays < 7) return `${diffInDays} hari lalu`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} minggu lalu`;
    return date.toLocaleDateString("id-ID");
  };

  if (detailLoading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          isDarkMode ? "bg-slate-950" : "bg-gray-50"
        }`}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-cyan-500 border-t-transparent mx-auto mb-4"></div>
          <p className={isDarkMode ? "text-slate-400" : "text-gray-600"}>
            Memuat detail...
          </p>
        </div>
      </div>
    );
  }

  if (!selectedListing) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          isDarkMode ? "bg-slate-950" : "bg-gray-50"
        }`}
      >
        <div className="text-center">
          <AiOutlineCar
            className={`text-8xl mx-auto mb-4 ${
              isDarkMode ? "text-slate-700" : "text-gray-300"
            }`}
          />
          <h2
            className={`text-2xl font-bold mb-2 ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Listing tidak ditemukan
          </h2>
          <Link
            href="/marketplace"
            className="inline-flex items-center gap-2 text-cyan-500 hover:text-cyan-600"
          >
            <FiArrowLeft />
            Kembali ke Marketplace
          </Link>
        </div>
      </div>
    );
  }

  const listing = selectedListing;
  const images = listing.images || [];

  // ...existing code...
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
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className={`flex items-center gap-1.5 sm:gap-2 font-semibold text-sm sm:text-base ${
                isDarkMode
                  ? "text-slate-300 hover:text-white"
                  : "text-gray-700 hover:text-gray-900"
              }`}
            >
              <FiArrowLeft className="text-lg sm:text-xl" />
              <span className="hidden sm:inline">Kembali</span>
            </button>

            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className={`p-2 sm:p-3 rounded-xl transition-all ${
                  isFavorite
                    ? "bg-red-500 text-white"
                    : isDarkMode
                      ? "bg-slate-800 text-slate-300 hover:bg-slate-700"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <FiHeart
                  className={`text-base sm:text-lg ${isFavorite ? "fill-current" : ""}`}
                />
              </button>
              <button
                onClick={handleShare}
                className={`p-2 sm:p-3 rounded-xl ${
                  isDarkMode
                    ? "bg-slate-800 text-slate-300 hover:bg-slate-700"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <FiShare2 className="text-base sm:text-lg" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Left Column - Images & Details */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Image Gallery */}
            <div
              className={`rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl sm:shadow-2xl ${
                isDarkMode ? "bg-slate-900" : "bg-white"
              }`}
            >
              {/* Main Image */}
              <div
                className="relative aspect-[16/10] cursor-pointer"
                onClick={() => setIsImageModalOpen(true)}
              >
                <img
                  src={`${baseUrl}${images[currentImageIndex]}`}
                  alt={`${listing.carModel?.brand?.name} ${listing.carModel?.modelName}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>

                {/* Navigation Arrows */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentImageIndex((prev) =>
                          prev === 0 ? images.length - 1 : prev - 1,
                        );
                      }}
                      className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 bg-black/50 rounded-full text-white hover:bg-black/70 transition-all"
                    >
                      <FiChevronLeft className="text-lg sm:text-2xl" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentImageIndex((prev) =>
                          prev === images.length - 1 ? 0 : prev + 1,
                        );
                      }}
                      className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 bg-black/50 rounded-full text-white hover:bg-black/70 transition-all"
                    >
                      <FiChevronRight className="text-lg sm:text-2xl" />
                    </button>
                  </>
                )}

                {/* Image Counter */}
                <div className="absolute bottom-2 sm:bottom-4 right-2 sm:right-4 px-2.5 sm:px-4 py-1 sm:py-2 bg-black/60 rounded-full text-white text-xs sm:text-sm font-medium">
                  {currentImageIndex + 1} / {images.length || 1}
                </div>

                {/* Badges */}
                <div className="absolute top-2 sm:top-4 left-2 sm:left-4 flex gap-1.5 sm:gap-2 flex-wrap">
                  <span className="px-2.5 sm:px-4 py-1 sm:py-2 bg-cyan-500 text-white text-[10px] sm:text-sm font-bold rounded-full shadow-lg">
                    {listing.condition === "baru" ? "Baru" : "Bekas"}
                  </span>
                  {listing.ownershipStatus && (
                    <span className="px-2.5 sm:px-4 py-1 sm:py-2 bg-purple-500 text-white text-[10px] sm:text-sm font-bold rounded-full shadow-lg">
                      {listing.ownershipStatus}
                    </span>
                  )}
                </div>
              </div>
              {/* Thumbnail Gallery */}
              {images.length > 1 && (
                <div className="p-2.5 sm:p-4 flex gap-2 sm:gap-3 overflow-x-auto">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`flex-shrink-0 w-14 h-14 sm:w-20 sm:h-20 rounded-lg sm:rounded-xl overflow-hidden border-2 transition-all ${
                        currentImageIndex === idx
                          ? "border-cyan-500 ring-2 ring-cyan-500/30"
                          : isDarkMode
                            ? "border-slate-700 hover:border-slate-600"
                            : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <img
                        src={`${baseUrl}${img}`}
                        alt={`Thumbnail ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Car Title & Basic Info */}
            <div
              className={`rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg sm:shadow-xl ${
                isDarkMode ? "bg-slate-900" : "bg-white"
              }`}
            >
              <div className="flex flex-col sm:flex-row items-start justify-between mb-3 sm:mb-4 gap-3">
                <div className="flex-1">
                  <h1
                    className={`text-xl sm:text-2xl lg:text-3xl font-bold mb-1.5 sm:mb-2 ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {listing.carModel?.brand?.name}{" "}
                    {listing.carModel?.modelName}
                  </h1>
                  <p
                    className={`text-sm sm:text-base lg:text-lg ${
                      isDarkMode ? "text-slate-400" : "text-gray-600"
                    }`}
                  >
                    {listing.year} • {listing.color}
                  </p>
                </div>
                <div className="text-left sm:text-right w-full sm:w-auto">
                  <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600">
                    {formatPrice(listing.price)}
                  </div>
                </div>
              </div>

              {/* Stats Bar */}
              <div
                className={`flex flex-wrap items-center gap-3 sm:gap-6 py-3 sm:py-4 border-t border-b ${
                  isDarkMode ? "border-slate-800" : "border-gray-100"
                }`}
              >
                <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
                  <FiEye
                    className={`text-sm sm:text-base ${isDarkMode ? "text-cyan-400" : "text-blue-500"}`}
                  />
                  <span
                    className={isDarkMode ? "text-slate-300" : "text-gray-700"}
                  >
                    <strong>{listing.viewCount}</strong> dilihat
                  </span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
                  <FiMessageCircle
                    className={`text-sm sm:text-base ${isDarkMode ? "text-cyan-400" : "text-blue-500"}`}
                  />
                  <span
                    className={isDarkMode ? "text-slate-300" : "text-gray-700"}
                  >
                    <strong>{listing.contactClickCount}</strong> dihubungi
                  </span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
                  <AiOutlineClockCircle
                    className={`text-sm sm:text-base ${isDarkMode ? "text-cyan-400" : "text-blue-500"}`}
                  />
                  <span
                    className={isDarkMode ? "text-slate-300" : "text-gray-700"}
                  >
                    {getTimeAgo(listing.createdAt)}
                  </span>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-center gap-1.5 sm:gap-2 mt-3 sm:mt-4 text-xs sm:text-sm">
                <FiMapPin
                  className={`text-sm sm:text-base ${isDarkMode ? "text-cyan-400" : "text-blue-500"}`}
                />
                <span
                  className={isDarkMode ? "text-slate-300" : "text-gray-700"}
                >
                  {listing.locationCity}, {listing.locationProvince}
                </span>
              </div>
            </div>

            {/* Specifications */}
            <div
              className={`rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg sm:shadow-xl ${
                isDarkMode ? "bg-slate-900" : "bg-white"
              }`}
            >
              <h2
                className={`text-base sm:text-lg lg:text-xl font-bold mb-4 sm:mb-6 flex items-center gap-2 ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                <BsGear className="text-lg sm:text-xl text-cyan-500" />
                Spesifikasi
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4">
                {[
                  {
                    icon: BsSpeedometer2,
                    label: "Kilometer",
                    value: formatMileage(listing.mileage),
                  },
                  {
                    icon: TbManualGearbox,
                    label: "Transmisi",
                    value:
                      listing.transmission === "automatic"
                        ? "Automatic"
                        : "Manual",
                  },
                  {
                    icon: BsFuelPump,
                    label: "Bahan Bakar",
                    value:
                      listing.fuelType.charAt(0).toUpperCase() +
                      listing.fuelType.slice(1),
                  },
                  {
                    icon: FiCalendar,
                    label: "Tahun",
                    value: listing.year.toString(),
                  },
                  { icon: TbColorSwatch, label: "Warna", value: listing.color },
                  {
                    icon: AiOutlineSafety,
                    label: "Kondisi",
                    value: listing.condition === "baru" ? "Baru" : "Bekas",
                  },
                  {
                    icon: HiOutlineDocumentText,
                    label: "Pajak",
                    value: listing.taxStatus || "N/A",
                  },
                  {
                    icon: FiUser,
                    label: "Kepemilikan",
                    value: listing.ownershipStatus || "N/A",
                  },
                ].map((spec, idx) => (
                  <div
                    key={idx}
                    className={`p-2.5 sm:p-4 rounded-xl sm:rounded-2xl text-center ${
                      isDarkMode ? "bg-slate-800/50" : "bg-gray-50"
                    }`}
                  >
                    <spec.icon
                      className={`text-lg sm:text-xl lg:text-2xl mx-auto mb-1 sm:mb-2 ${
                        isDarkMode ? "text-cyan-400" : "text-blue-500"
                      }`}
                    />
                    <div
                      className={`text-[10px] sm:text-xs lg:text-sm ${
                        isDarkMode ? "text-slate-500" : "text-gray-500"
                      }`}
                    >
                      {spec.label}
                    </div>
                    <div
                      className={`font-bold text-xs sm:text-sm lg:text-base ${
                        isDarkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {spec.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div
              className={`rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg sm:shadow-xl ${
                isDarkMode ? "bg-slate-900" : "bg-white"
              }`}
            >
              <h2
                className={`text-base sm:text-lg lg:text-xl font-bold mb-3 sm:mb-4 flex items-center gap-2 ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                <TbFileDescription className="text-lg sm:text-xl text-cyan-500" />
                Deskripsi
              </h2>
              <p
                className={`whitespace-pre-line leading-relaxed text-xs sm:text-sm lg:text-base ${
                  isDarkMode ? "text-slate-300" : "text-gray-700"
                }`}
              >
                {listing.description}
              </p>
            </div>
          </div>

          {/* Right Column - Seller Info & Actions */}
          <div className="space-y-4 sm:space-y-6">
            {/* Sticky Container */}
            <div className="lg:sticky lg:top-24 space-y-4 sm:space-y-6">
              {/* Seller Card */}
              <div
                className={`rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg sm:shadow-xl ${
                  isDarkMode ? "bg-slate-900" : "bg-white"
                }`}
              >
                <h2
                  className={`text-base sm:text-lg font-bold mb-3 sm:mb-4 ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Informasi Penjual
                </h2>

                <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl sm:rounded-2xl flex items-center justify-center text-white text-lg sm:text-2xl font-bold shadow-lg shadow-cyan-500/30">
                    {listing.seller?.fullName?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <div>
                    <div
                      className={`font-bold text-sm sm:text-base lg:text-lg ${
                        isDarkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {listing.seller?.fullName || "Penjual"}
                    </div>
                    <div
                      className={`text-xs sm:text-sm ${
                        isDarkMode ? "text-slate-400" : "text-gray-500"
                      }`}
                    >
                      {listing.seller?.location || listing.locationCity}
                    </div>
                  </div>
                </div>

                <div className="space-y-2.5 sm:space-y-3">
                  {/* WhatsApp Button */}
                  <button
                    onClick={handleWhatsApp}
                    className="w-full flex items-center justify-center gap-2 sm:gap-3 py-3 sm:py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl sm:rounded-2xl hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg shadow-green-500/30 text-sm sm:text-base"
                  >
                    <AiOutlineWhatsApp className="text-xl sm:text-2xl" />
                    Hubungi via WhatsApp
                  </button>

                  {/* Phone Button */}
                  <button
                    onClick={() => {
                      window.location.href = `tel:${listing.sellerWhatsapp}`;
                    }}
                    className={`w-full flex items-center justify-center gap-2 sm:gap-3 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold transition-all text-sm sm:text-base ${
                      isDarkMode
                        ? "bg-slate-800 text-white hover:bg-slate-700"
                        : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                    }`}
                  >
                    <FiPhone className="text-lg sm:text-xl" />
                    Telepon
                  </button>
                </div>
              </div>

              {/* Safety Tips */}
              <div
                className={`rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg sm:shadow-xl ${
                  isDarkMode ? "bg-slate-900" : "bg-white"
                }`}
              >
                <h3
                  className={`font-bold mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  <FiShield className="text-base sm:text-lg text-cyan-500" />
                  Tips Keamanan
                </h3>
                <ul
                  className={`space-y-2 sm:space-y-3 text-xs sm:text-sm ${
                    isDarkMode ? "text-slate-400" : "text-gray-600"
                  }`}
                >
                  <li className="flex items-start gap-1.5 sm:gap-2">
                    <FiCheck className="text-green-500 mt-0.5 flex-shrink-0 text-xs sm:text-sm" />
                    Selalu cek kondisi mobil secara langsung
                  </li>
                  <li className="flex items-start gap-1.5 sm:gap-2">
                    <FiCheck className="text-green-500 mt-0.5 flex-shrink-0 text-xs sm:text-sm" />
                    Verifikasi dokumen kendaraan (STNK, BPKB)
                  </li>
                  <li className="flex items-start gap-1.5 sm:gap-2">
                    <FiCheck className="text-green-500 mt-0.5 flex-shrink-0 text-xs sm:text-sm" />
                    Gunakan jasa inspeksi independen
                  </li>
                  <li className="flex items-start gap-1.5 sm:gap-2">
                    <FiCheck className="text-green-500 mt-0.5 flex-shrink-0 text-xs sm:text-sm" />
                    Bertemu di tempat yang aman
                  </li>
                </ul>
              </div>

              {/* Report */}
              <button
                className={`w-full py-2.5 sm:py-3 text-xs sm:text-sm font-medium rounded-lg sm:rounded-xl transition-all ${
                  isDarkMode
                    ? "text-slate-500 hover:text-red-400 hover:bg-red-500/10"
                    : "text-gray-500 hover:text-red-500 hover:bg-red-50"
                }`}
              >
                Laporkan Listing Ini
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {isImageModalOpen && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
          onClick={() => setIsImageModalOpen(false)}
        >
          <button
            onClick={() => setIsImageModalOpen(false)}
            className="absolute top-3 sm:top-4 right-3 sm:right-4 p-2 sm:p-3 bg-white/10 rounded-full text-white hover:bg-white/20"
          >
            <FiX className="text-xl sm:text-2xl" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setCurrentImageIndex((prev) =>
                prev === 0 ? images.length - 1 : prev - 1,
              );
            }}
            className="absolute left-2 sm:left-4 p-2.5 sm:p-4 bg-white/10 rounded-full text-white hover:bg-white/20"
          >
            <FiChevronLeft className="text-2xl sm:text-3xl" />
          </button>

          <img
            src={`${baseUrl}${images[currentImageIndex]}`}
            alt=""
            className="max-w-full max-h-[90vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          <button
            onClick={(e) => {
              e.stopPropagation();
              setCurrentImageIndex((prev) =>
                prev === images.length - 1 ? 0 : prev + 1,
              );
            }}
            className="absolute right-2 sm:right-4 p-2.5 sm:p-4 bg-white/10 rounded-full text-white hover:bg-white/20"
          >
            <FiChevronRight className="text-2xl sm:text-3xl" />
          </button>

          <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 sm:gap-2">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImageIndex(idx);
                }}
                className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all ${
                  currentImageIndex === idx ? "bg-white" : "bg-white/40"
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ListingDetailPage;
