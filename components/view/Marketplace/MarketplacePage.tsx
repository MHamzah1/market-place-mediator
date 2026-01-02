"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/lib/state/store";
import {
  fetchListings,
  setFilters,
  clearFilters,
} from "@/lib/state/slice/marketplace/marketplaceSlice";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";
import {
  FiSearch,
  FiFilter,
  FiMapPin,
  FiCalendar,
  FiDollarSign,
  FiTruck,
  FiDroplet,
  FiPlus,
  FiGrid,
  FiList,
  FiHeart,
  FiEye,
  FiChevronDown,
  FiX,
  FiRefreshCw,
} from "react-icons/fi";
import {
  AiOutlineCar,
  AiOutlineClockCircle,
  AiOutlineSafety,
  AiOutlineWhatsApp,
} from "react-icons/ai";
import { BsSpeedometer2, BsFuelPump } from "react-icons/bs";
import { TbManualGearbox } from "react-icons/tb";
import { getBrandsWithFilters } from "@/lib/state/slice/brand/brandSlice";

const MarketplacePage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  const { listings, loading, pagination, filters } = useSelector(
    (state: RootState) => state.marketplace
  );
  const { data: brands } = useSelector((state: RootState) => state.brand);
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [localFilters, setLocalFilters] = useState({
    brandId: "",
    minPrice: "",
    maxPrice: "",
    yearMin: "",
    yearMax: "",
    transmission: "",
    fuelType: "",
    condition: "",
    sortBy: "newest",
  });

  // Fetch data on mount
  useEffect(() => {
    dispatch(fetchListings({ isActive: true }));
    dispatch(getBrandsWithFilters({ perPage: 100 }));
  }, [dispatch]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== filters.search) {
        handleApplyFilters();
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleApplyFilters = useCallback(() => {
    const params: any = { isActive: true };
    if (searchTerm) params.search = searchTerm;
    if (localFilters.brandId) params.brandId = localFilters.brandId;
    if (localFilters.minPrice) params.minPrice = Number(localFilters.minPrice);
    if (localFilters.maxPrice) params.maxPrice = Number(localFilters.maxPrice);
    if (localFilters.yearMin) params.yearMin = Number(localFilters.yearMin);
    if (localFilters.yearMax) params.yearMax = Number(localFilters.yearMax);
    if (localFilters.transmission)
      params.transmission = localFilters.transmission;
    if (localFilters.fuelType) params.fuelType = localFilters.fuelType;
    if (localFilters.condition) params.condition = localFilters.condition;
    if (localFilters.sortBy) params.sortBy = localFilters.sortBy;

    dispatch(fetchListings(params));
  }, [dispatch, searchTerm, localFilters]);

  const handleResetFilters = () => {
    setSearchTerm("");
    setLocalFilters({
      brandId: "",
      minPrice: "",
      maxPrice: "",
      yearMin: "",
      yearMax: "",
      transmission: "",
      fuelType: "",
      condition: "",
      sortBy: "newest",
    });
    dispatch(clearFilters());
    dispatch(fetchListings({ isActive: true }));
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
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "Baru saja";
    if (diffInSeconds < 3600)
      return `${Math.floor(diffInSeconds / 60)} menit lalu`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)} jam lalu`;
    if (diffInSeconds < 604800)
      return `${Math.floor(diffInSeconds / 86400)} hari lalu`;
    return date.toLocaleDateString("id-ID");
  };

  return (
    <div
      className={`min-h-screen ${isDarkMode ? "bg-slate-950" : "bg-gray-50"}`}
    >
      {/* Hero Section */}
      <div
        className={`relative overflow-hidden ${
          isDarkMode
            ? "bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900"
            : "bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800"
        }`}
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('/pattern.svg')] bg-repeat"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
              <AiOutlineCar className="inline-block mr-3 text-5xl" />
              Marketplace Mobil
            </h1>
            <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
              Temukan mobil impian Anda dari ribuan pilihan. Jual atau beli
              mobil dengan mudah dan aman.
            </p>

            {/* Search Bar */}
            <div className="max-w-3xl mx-auto">
              <div
                className={`flex items-center rounded-2xl overflow-hidden shadow-2xl ${
                  isDarkMode ? "bg-slate-800" : "bg-white"
                }`}
              >
                <div className="flex-1 flex items-center px-6 py-4">
                  <FiSearch
                    className={`text-xl ${
                      isDarkMode ? "text-slate-400" : "text-gray-400"
                    }`}
                  />
                  <input
                    type="text"
                    placeholder="Cari mobil, merk, atau model..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`w-full ml-4 text-lg outline-none ${
                      isDarkMode
                        ? "bg-transparent text-white placeholder-slate-500"
                        : "bg-transparent text-gray-800 placeholder-gray-400"
                    }`}
                  />
                </div>
                <button
                  onClick={handleApplyFilters}
                  className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-lg hover:from-cyan-600 hover:to-blue-700 transition-all"
                >
                  Cari
                </button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="flex justify-center gap-8 mt-8 text-white">
              <div className="text-center">
                <div className="text-3xl font-bold">
                  {pagination.totalRecords}+
                </div>
                <div className="text-sm text-blue-200">Mobil Tersedia</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">{brands?.length || 0}+</div>
                <div className="text-sm text-blue-200">Brand</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">100%</div>
                <div className="text-sm text-blue-200">Terpercaya</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex gap-8">
          {/* Sidebar Filters - Desktop */}
          <div
            className={`hidden lg:block w-72 flex-shrink-0 ${
              showFilters ? "" : "hidden"
            }`}
          >
            <div
              className={`sticky top-24 rounded-2xl shadow-xl overflow-hidden ${
                isDarkMode ? "bg-slate-900" : "bg-white"
              }`}
            >
              {/* Filter Header */}
              <div
                className={`px-6 py-4 border-b ${
                  isDarkMode ? "border-slate-800" : "border-gray-100"
                }`}
              >
                <div className="flex items-center justify-between">
                  <h3
                    className={`font-bold text-lg ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    <FiFilter className="inline mr-2" />
                    Filter
                  </h3>
                  <button
                    onClick={handleResetFilters}
                    className="text-sm text-cyan-500 hover:text-cyan-600 flex items-center gap-1"
                  >
                    <FiRefreshCw className="text-sm" />
                    Reset
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Brand Filter */}
                <div>
                  <label
                    className={`block text-sm font-semibold mb-2 ${
                      isDarkMode ? "text-slate-300" : "text-gray-700"
                    }`}
                  >
                    <AiOutlineCar className="inline mr-2" />
                    Brand
                  </label>
                  <select
                    value={localFilters.brandId}
                    onChange={(e) =>
                      setLocalFilters({
                        ...localFilters,
                        brandId: e.target.value,
                      })
                    }
                    className={`w-full px-4 py-3 rounded-xl border transition-all ${
                      isDarkMode
                        ? "bg-slate-800 border-slate-700 text-white focus:border-cyan-500"
                        : "bg-gray-50 border-gray-200 text-gray-800 focus:border-blue-500"
                    }`}
                  >
                    <option value="">Semua Brand</option>
                    {brands?.map((brand: any) => (
                      <option key={brand.id} value={brand.id}>
                        {brand.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <label
                    className={`block text-sm font-semibold mb-2 ${
                      isDarkMode ? "text-slate-300" : "text-gray-700"
                    }`}
                  >
                    <FiDollarSign className="inline mr-2" />
                    Rentang Harga
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="number"
                      placeholder="Min"
                      value={localFilters.minPrice}
                      onChange={(e) =>
                        setLocalFilters({
                          ...localFilters,
                          minPrice: e.target.value,
                        })
                      }
                      className={`w-full px-3 py-2 rounded-xl border text-sm ${
                        isDarkMode
                          ? "bg-slate-800 border-slate-700 text-white"
                          : "bg-gray-50 border-gray-200 text-gray-800"
                      }`}
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={localFilters.maxPrice}
                      onChange={(e) =>
                        setLocalFilters({
                          ...localFilters,
                          maxPrice: e.target.value,
                        })
                      }
                      className={`w-full px-3 py-2 rounded-xl border text-sm ${
                        isDarkMode
                          ? "bg-slate-800 border-slate-700 text-white"
                          : "bg-gray-50 border-gray-200 text-gray-800"
                      }`}
                    />
                  </div>
                </div>

                {/* Year Range */}
                <div>
                  <label
                    className={`block text-sm font-semibold mb-2 ${
                      isDarkMode ? "text-slate-300" : "text-gray-700"
                    }`}
                  >
                    <FiCalendar className="inline mr-2" />
                    Tahun
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="number"
                      placeholder="Min"
                      value={localFilters.yearMin}
                      onChange={(e) =>
                        setLocalFilters({
                          ...localFilters,
                          yearMin: e.target.value,
                        })
                      }
                      className={`w-full px-3 py-2 rounded-xl border text-sm ${
                        isDarkMode
                          ? "bg-slate-800 border-slate-700 text-white"
                          : "bg-gray-50 border-gray-200 text-gray-800"
                      }`}
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={localFilters.yearMax}
                      onChange={(e) =>
                        setLocalFilters({
                          ...localFilters,
                          yearMax: e.target.value,
                        })
                      }
                      className={`w-full px-3 py-2 rounded-xl border text-sm ${
                        isDarkMode
                          ? "bg-slate-800 border-slate-700 text-white"
                          : "bg-gray-50 border-gray-200 text-gray-800"
                      }`}
                    />
                  </div>
                </div>

                {/* Transmission */}
                <div>
                  <label
                    className={`block text-sm font-semibold mb-2 ${
                      isDarkMode ? "text-slate-300" : "text-gray-700"
                    }`}
                  >
                    <TbManualGearbox className="inline mr-2" />
                    Transmisi
                  </label>
                  <select
                    value={localFilters.transmission}
                    onChange={(e) =>
                      setLocalFilters({
                        ...localFilters,
                        transmission: e.target.value,
                      })
                    }
                    className={`w-full px-4 py-3 rounded-xl border ${
                      isDarkMode
                        ? "bg-slate-800 border-slate-700 text-white"
                        : "bg-gray-50 border-gray-200 text-gray-800"
                    }`}
                  >
                    <option value="">Semua</option>
                    <option value="automatic">Automatic</option>
                    <option value="manual">Manual</option>
                  </select>
                </div>

                {/* Fuel Type */}
                <div>
                  <label
                    className={`block text-sm font-semibold mb-2 ${
                      isDarkMode ? "text-slate-300" : "text-gray-700"
                    }`}
                  >
                    <BsFuelPump className="inline mr-2" />
                    Bahan Bakar
                  </label>
                  <select
                    value={localFilters.fuelType}
                    onChange={(e) =>
                      setLocalFilters({
                        ...localFilters,
                        fuelType: e.target.value,
                      })
                    }
                    className={`w-full px-4 py-3 rounded-xl border ${
                      isDarkMode
                        ? "bg-slate-800 border-slate-700 text-white"
                        : "bg-gray-50 border-gray-200 text-gray-800"
                    }`}
                  >
                    <option value="">Semua</option>
                    <option value="bensin">Bensin</option>
                    <option value="diesel">Diesel</option>
                    <option value="hybrid">Hybrid</option>
                    <option value="electric">Electric</option>
                  </select>
                </div>

                {/* Condition */}
                <div>
                  <label
                    className={`block text-sm font-semibold mb-2 ${
                      isDarkMode ? "text-slate-300" : "text-gray-700"
                    }`}
                  >
                    <AiOutlineSafety className="inline mr-2" />
                    Kondisi
                  </label>
                  <select
                    value={localFilters.condition}
                    onChange={(e) =>
                      setLocalFilters({
                        ...localFilters,
                        condition: e.target.value,
                      })
                    }
                    className={`w-full px-4 py-3 rounded-xl border ${
                      isDarkMode
                        ? "bg-slate-800 border-slate-700 text-white"
                        : "bg-gray-50 border-gray-200 text-gray-800"
                    }`}
                  >
                    <option value="">Semua</option>
                    <option value="baru">Baru</option>
                    <option value="bekas">Bekas</option>
                  </select>
                </div>

                {/* Apply Button */}
                <button
                  onClick={handleApplyFilters}
                  className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all shadow-lg shadow-cyan-500/25"
                >
                  Terapkan Filter
                </button>
              </div>
            </div>
          </div>

          {/* Main Listings Area */}
          <div className="flex-1">
            {/* Toolbar */}
            <div
              className={`flex items-center justify-between mb-6 p-4 rounded-2xl ${
                isDarkMode ? "bg-slate-900" : "bg-white"
              } shadow-lg`}
            >
              <div className="flex items-center gap-4">
                <span
                  className={`text-sm ${
                    isDarkMode ? "text-slate-400" : "text-gray-600"
                  }`}
                >
                  Menampilkan <strong>{listings.length}</strong> dari{" "}
                  <strong>{pagination.totalRecords}</strong> mobil
                </span>
              </div>

              <div className="flex items-center gap-4">
                {/* Sort */}
                <select
                  value={localFilters.sortBy}
                  onChange={(e) => {
                    setLocalFilters({
                      ...localFilters,
                      sortBy: e.target.value,
                    });
                    setTimeout(handleApplyFilters, 100);
                  }}
                  className={`px-4 py-2 rounded-xl border text-sm ${
                    isDarkMode
                      ? "bg-slate-800 border-slate-700 text-white"
                      : "bg-gray-50 border-gray-200 text-gray-800"
                  }`}
                >
                  <option value="newest">Terbaru</option>
                  <option value="oldest">Terlama</option>
                  <option value="price_asc">Harga Terendah</option>
                  <option value="price_desc">Harga Tertinggi</option>
                  <option value="mileage">KM Terendah</option>
                </select>

                {/* View Mode */}
                <div
                  className={`flex rounded-xl overflow-hidden border ${
                    isDarkMode ? "border-slate-700" : "border-gray-200"
                  }`}
                >
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 ${
                      viewMode === "grid"
                        ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white"
                        : isDarkMode
                        ? "bg-slate-800 text-slate-400"
                        : "bg-gray-50 text-gray-600"
                    }`}
                  >
                    <FiGrid />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 ${
                      viewMode === "list"
                        ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white"
                        : isDarkMode
                        ? "bg-slate-800 text-slate-400"
                        : "bg-gray-50 text-gray-600"
                    }`}
                  >
                    <FiList />
                  </button>
                </div>

                {/* Create Listing Button */}
                {isLoggedIn && (
                  <Link
                    href="/marketplace/create"
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg shadow-green-500/25"
                  >
                    <FiPlus />
                    Jual Mobil
                  </Link>
                )}
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-cyan-500 border-t-transparent"></div>
              </div>
            )}

            {/* Empty State */}
            {!loading && listings.length === 0 && (
              <div
                className={`text-center py-20 rounded-2xl ${
                  isDarkMode ? "bg-slate-900" : "bg-white"
                }`}
              >
                <AiOutlineCar
                  className={`text-8xl mx-auto mb-6 ${
                    isDarkMode ? "text-slate-700" : "text-gray-300"
                  }`}
                />
                <h3
                  className={`text-2xl font-bold mb-2 ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Tidak ada mobil ditemukan
                </h3>
                <p
                  className={`${
                    isDarkMode ? "text-slate-400" : "text-gray-600"
                  }`}
                >
                  Coba ubah filter pencarian Anda
                </p>
                <button
                  onClick={handleResetFilters}
                  className="mt-6 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl"
                >
                  Reset Filter
                </button>
              </div>
            )}

            {/* Grid View */}
            {!loading && listings.length > 0 && viewMode === "grid" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {listings.map((listing) => (
                  <Link
                    key={listing.id}
                    href={`/marketplace/${listing.id}`}
                    className={`group rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 ${
                      isDarkMode ? "bg-slate-900" : "bg-white"
                    }`}
                  >
                    {/* Image */}
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img
                        src={listing.images?.[0] || "/placeholder-car.jpg"}
                        alt={`${listing.carModel?.brand?.name} ${listing.carModel?.modelName}`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://via.placeholder.com/400x300?text=No+Image";
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                      {/* Badges */}
                      <div className="absolute top-3 left-3 flex gap-2">
                        <span className="px-3 py-1 bg-cyan-500 text-white text-xs font-bold rounded-full">
                          {listing.condition === "baru" ? "Baru" : "Bekas"}
                        </span>
                        {listing.ownershipStatus && (
                          <span className="px-3 py-1 bg-purple-500 text-white text-xs font-bold rounded-full">
                            {listing.ownershipStatus}
                          </span>
                        )}
                      </div>

                      {/* Favorite Button */}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          // Handle favorite
                        }}
                        className="absolute top-3 right-3 p-2 bg-white/90 rounded-full hover:bg-white transition-all"
                      >
                        <FiHeart className="text-gray-600 hover:text-red-500" />
                      </button>

                      {/* Price Badge */}
                      <div className="absolute bottom-3 left-3">
                        <div className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-xl shadow-lg">
                          {formatPrice(listing.price)}
                        </div>
                      </div>

                      {/* Views */}
                      <div className="absolute bottom-3 right-3 flex items-center gap-1 text-white text-sm bg-black/50 px-2 py-1 rounded-lg">
                        <FiEye />
                        {listing.viewCount}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      {/* Title */}
                      <h3
                        className={`font-bold text-lg mb-1 truncate ${
                          isDarkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {listing.carModel?.brand?.name}{" "}
                        {listing.carModel?.modelName}
                      </h3>
                      <p
                        className={`text-sm mb-3 ${
                          isDarkMode ? "text-slate-400" : "text-gray-500"
                        }`}
                      >
                        {listing.year} • {listing.color}
                      </p>

                      {/* Specs */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span
                          className={`flex items-center gap-1 text-xs px-2 py-1 rounded-lg ${
                            isDarkMode
                              ? "bg-slate-800 text-slate-300"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          <BsSpeedometer2 />
                          {formatMileage(listing.mileage)}
                        </span>
                        <span
                          className={`flex items-center gap-1 text-xs px-2 py-1 rounded-lg ${
                            isDarkMode
                              ? "bg-slate-800 text-slate-300"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          <TbManualGearbox />
                          {listing.transmission === "automatic" ? "AT" : "MT"}
                        </span>
                        <span
                          className={`flex items-center gap-1 text-xs px-2 py-1 rounded-lg ${
                            isDarkMode
                              ? "bg-slate-800 text-slate-300"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          <BsFuelPump />
                          {listing.fuelType}
                        </span>
                      </div>

                      {/* Location & Time */}
                      <div className="flex items-center justify-between text-xs">
                        <span
                          className={`flex items-center gap-1 ${
                            isDarkMode ? "text-slate-400" : "text-gray-500"
                          }`}
                        >
                          <FiMapPin />
                          {listing.locationCity}
                        </span>
                        <span
                          className={`flex items-center gap-1 ${
                            isDarkMode ? "text-slate-500" : "text-gray-400"
                          }`}
                        >
                          <AiOutlineClockCircle />
                          {getTimeAgo(listing.createdAt)}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* List View */}
            {!loading && listings.length > 0 && viewMode === "list" && (
              <div className="space-y-4">
                {listings.map((listing) => (
                  <Link
                    key={listing.id}
                    href={`/marketplace/${listing.id}`}
                    className={`group flex gap-6 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 ${
                      isDarkMode ? "bg-slate-900" : "bg-white"
                    }`}
                  >
                    {/* Image */}
                    <div className="relative w-72 flex-shrink-0">
                      <img
                        src={listing.images?.[0] || "/placeholder-car.jpg"}
                        alt={`${listing.carModel?.brand?.name} ${listing.carModel?.modelName}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://via.placeholder.com/400x300?text=No+Image";
                        }}
                      />
                      <div className="absolute top-3 left-3 flex gap-2">
                        <span className="px-3 py-1 bg-cyan-500 text-white text-xs font-bold rounded-full">
                          {listing.condition === "baru" ? "Baru" : "Bekas"}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3
                            className={`font-bold text-xl mb-1 ${
                              isDarkMode ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {listing.carModel?.brand?.name}{" "}
                            {listing.carModel?.modelName}
                          </h3>
                          <p
                            className={`text-sm ${
                              isDarkMode ? "text-slate-400" : "text-gray-500"
                            }`}
                          >
                            {listing.year} • {listing.color} •{" "}
                            {listing.ownershipStatus || "N/A"}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600">
                            {formatPrice(listing.price)}
                          </div>
                          <p
                            className={`text-xs ${
                              isDarkMode ? "text-slate-500" : "text-gray-400"
                            }`}
                          >
                            {listing.taxStatus || "Status pajak tidak tersedia"}
                          </p>
                        </div>
                      </div>

                      {/* Specs Grid */}
                      <div className="grid grid-cols-4 gap-4 mb-4">
                        <div
                          className={`text-center p-3 rounded-xl ${
                            isDarkMode ? "bg-slate-800" : "bg-gray-50"
                          }`}
                        >
                          <BsSpeedometer2
                            className={`text-xl mx-auto mb-1 ${
                              isDarkMode ? "text-cyan-400" : "text-blue-500"
                            }`}
                          />
                          <div
                            className={`text-sm font-semibold ${
                              isDarkMode ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {formatMileage(listing.mileage)}
                          </div>
                          <div
                            className={`text-xs ${
                              isDarkMode ? "text-slate-500" : "text-gray-500"
                            }`}
                          >
                            Kilometer
                          </div>
                        </div>
                        <div
                          className={`text-center p-3 rounded-xl ${
                            isDarkMode ? "bg-slate-800" : "bg-gray-50"
                          }`}
                        >
                          <TbManualGearbox
                            className={`text-xl mx-auto mb-1 ${
                              isDarkMode ? "text-cyan-400" : "text-blue-500"
                            }`}
                          />
                          <div
                            className={`text-sm font-semibold ${
                              isDarkMode ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {listing.transmission === "automatic"
                              ? "Automatic"
                              : "Manual"}
                          </div>
                          <div
                            className={`text-xs ${
                              isDarkMode ? "text-slate-500" : "text-gray-500"
                            }`}
                          >
                            Transmisi
                          </div>
                        </div>
                        <div
                          className={`text-center p-3 rounded-xl ${
                            isDarkMode ? "bg-slate-800" : "bg-gray-50"
                          }`}
                        >
                          <BsFuelPump
                            className={`text-xl mx-auto mb-1 ${
                              isDarkMode ? "text-cyan-400" : "text-blue-500"
                            }`}
                          />
                          <div
                            className={`text-sm font-semibold capitalize ${
                              isDarkMode ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {listing.fuelType}
                          </div>
                          <div
                            className={`text-xs ${
                              isDarkMode ? "text-slate-500" : "text-gray-500"
                            }`}
                          >
                            Bahan Bakar
                          </div>
                        </div>
                        <div
                          className={`text-center p-3 rounded-xl ${
                            isDarkMode ? "bg-slate-800" : "bg-gray-50"
                          }`}
                        >
                          <FiEye
                            className={`text-xl mx-auto mb-1 ${
                              isDarkMode ? "text-cyan-400" : "text-blue-500"
                            }`}
                          />
                          <div
                            className={`text-sm font-semibold ${
                              isDarkMode ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {listing.viewCount}
                          </div>
                          <div
                            className={`text-xs ${
                              isDarkMode ? "text-slate-500" : "text-gray-500"
                            }`}
                          >
                            Dilihat
                          </div>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between">
                        <div
                          className={`flex items-center gap-4 text-sm ${
                            isDarkMode ? "text-slate-400" : "text-gray-500"
                          }`}
                        >
                          <span className="flex items-center gap-1">
                            <FiMapPin />
                            {listing.locationCity}, {listing.locationProvince}
                          </span>
                          <span className="flex items-center gap-1">
                            <AiOutlineClockCircle />
                            {getTimeAgo(listing.createdAt)}
                          </span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                          }}
                          className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-600 transition-all"
                        >
                          <AiOutlineWhatsApp className="text-lg" />
                          Hubungi
                        </button>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Pagination */}
            {!loading && pagination.totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                {Array.from(
                  { length: Math.min(pagination.totalPages, 5) },
                  (_, i) => i + 1
                ).map((page) => (
                  <button
                    key={page}
                    onClick={() => {
                      dispatch(fetchListings({ ...filters, page }));
                    }}
                    className={`w-10 h-10 rounded-xl font-semibold transition-all ${
                      pagination.page === page
                        ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white"
                        : isDarkMode
                        ? "bg-slate-800 text-slate-300 hover:bg-slate-700"
                        : "bg-white text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating Create Button - Mobile */}
      {isLoggedIn && (
        <Link
          href="/marketplace/create"
          className="fixed bottom-6 right-6 lg:hidden flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full shadow-2xl shadow-green-500/40 hover:scale-110 transition-transform z-50"
        >
          <FiPlus className="text-2xl" />
        </Link>
      )}
    </div>
  );
};

export default MarketplacePage;
