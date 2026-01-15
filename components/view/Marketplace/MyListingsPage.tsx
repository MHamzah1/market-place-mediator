"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/lib/state/store";
import {
  fetchMyListings,
  deleteListing,
  updateListing,
} from "@/lib/state/slice/marketplace/marketplaceSlice";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiEye,
  FiMessageCircle,
  FiToggleLeft,
  FiToggleRight,
  FiArrowLeft,
  FiTrendingUp,
  FiBarChart2,
  FiZap,
} from "react-icons/fi";
import { AiOutlineCar, AiOutlineWhatsApp } from "react-icons/ai";
import { BsSpeedometer2 } from "react-icons/bs";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

const MyListingsPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  const { myListings, loading, myListingsPagination, myListingsSummary } = useSelector(
    (state: RootState) => state.marketplace
  );
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);

  const [activeTab, setActiveTab] = useState<"all" | "active" | "inactive">("all");

  useEffect(() => {
    if (!isLoggedIn) {
      toast.error("Silakan login terlebih dahulu");
      router.push("/auth/login");
      return;
    }
    dispatch(fetchMyListings({}));
  }, [dispatch, isLoggedIn, router]);

  const handleTabChange = (tab: "all" | "active" | "inactive") => {
    setActiveTab(tab);
    const params: any = {};
    if (tab === "active") params.isActive = true;
    if (tab === "inactive") params.isActive = false;
    dispatch(fetchMyListings(params));
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      await dispatch(updateListing({ id, data: { isActive: !currentStatus } })).unwrap();
      toast.success(currentStatus ? "Listing dinonaktifkan" : "Listing diaktifkan");
      dispatch(fetchMyListings({}));
    } catch (error: any) {
      toast.error(error || "Gagal mengubah status");
    }
  };

  const handleDelete = async (id: string, title: string) => {
    const result = await Swal.fire({
      title: "Hapus Listing?",
      text: `Anda yakin ingin menghapus "${title}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal",
      background: isDarkMode ? "#1e293b" : "#ffffff",
      color: isDarkMode ? "#f1f5f9" : "#1f2937",
    });

    if (result.isConfirmed) {
      try {
        await dispatch(deleteListing(id)).unwrap();
        toast.success("Listing berhasil dihapus");
      } catch (error: any) {
        toast.error(error || "Gagal menghapus listing");
      }
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

  return (
    <div className={`min-h-screen ${isDarkMode ? "bg-slate-950" : "bg-gray-50"}`}>
      {/* Header */}
      <div
        className={`${
          isDarkMode
            ? "bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900"
            : "bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => router.push("/marketplace")}
              className="flex items-center gap-2 text-white/80 hover:text-white transition-all"
            >
              <FiArrowLeft />
              Kembali ke Marketplace
            </button>
            <div className="flex items-center gap-3">
              <Link
                href="/marketplace/boost/history"
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-sm text-yellow-300 font-semibold rounded-xl hover:from-yellow-500/30 hover:to-orange-500/30 transition-all"
              >
                <FiZap />
                Riwayat Boost
              </Link>
              <Link
                href="/marketplace/create"
                className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm text-white font-semibold rounded-xl hover:bg-white/30 transition-all"
              >
                <FiPlus />
                Jual Mobil
              </Link>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-white mb-2">Listing Saya</h1>
          <p className="text-blue-100">Kelola semua mobil yang Anda jual</p>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {[
              {
                label: "Total Aktif",
                value: myListingsSummary.totalActiveListings,
                icon: AiOutlineCar,
                color: "from-green-500 to-emerald-600",
              },
              {
                label: "Total Nonaktif",
                value: myListingsSummary.totalInactiveListings,
                icon: AiOutlineCar,
                color: "from-orange-500 to-amber-600",
              },
              {
                label: "Total Dilihat",
                value: myListingsSummary.totalViews,
                icon: FiEye,
                color: "from-cyan-500 to-blue-600",
              },
              {
                label: "Total Dihubungi",
                value: myListingsSummary.totalContactClicks,
                icon: FiMessageCircle,
                color: "from-purple-500 to-pink-600",
              },
            ].map((stat, idx) => (
              <div
                key={idx}
                className={`rounded-2xl p-4 bg-white/10 backdrop-blur-sm`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color}`}>
                    <stat.icon className="text-xl text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                    <div className="text-sm text-blue-100">{stat.label}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {[
            { key: "all", label: "Semua" },
            { key: "active", label: "Aktif" },
            { key: "inactive", label: "Nonaktif" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => handleTabChange(tab.key as any)}
              className={`px-6 py-2 rounded-xl font-semibold transition-all ${
                activeTab === tab.key
                  ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25"
                  : isDarkMode
                  ? "bg-slate-800 text-slate-300 hover:bg-slate-700"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-cyan-500 border-t-transparent"></div>
          </div>
        )}

        {/* Empty State */}
        {!loading && myListings.length === 0 && (
          <div
            className={`text-center py-20 rounded-3xl ${
              isDarkMode ? "bg-slate-900" : "bg-white"
            } shadow-xl`}
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
              Belum ada listing
            </h3>
            <p className={isDarkMode ? "text-slate-400" : "text-gray-600"}>
              Mulai jual mobil Anda sekarang
            </p>
            <Link
              href="/marketplace/create"
              className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all"
            >
              <FiPlus />
              Jual Mobil Pertama
            </Link>
          </div>
        )}

        {/* Listings Grid */}
        {!loading && myListings.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myListings.map((listing) => (
              <div
                key={listing.id}
                className={`rounded-2xl overflow-hidden shadow-xl ${
                  isDarkMode ? "bg-slate-900" : "bg-white"
                } ${!listing.isActive ? "opacity-75" : ""}`}
              >
                {/* Image */}
                <div className="relative aspect-[4/3]">
                  <img
                    src={listing.images?.[0] || "https://via.placeholder.com/400x300?text=No+Image"}
                    alt={`${listing.carModel?.brand?.name} ${listing.carModel?.modelName}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

                  {/* Status Badge */}
                  <div className="absolute top-3 left-3">
                    <span
                      className={`px-3 py-1 text-xs font-bold rounded-full ${
                        listing.isActive
                          ? "bg-green-500 text-white"
                          : "bg-gray-500 text-white"
                      }`}
                    >
                      {listing.isActive ? "Aktif" : "Nonaktif"}
                    </span>
                  </div>

                  {/* Stats */}
                  <div className="absolute bottom-3 left-3 right-3 flex justify-between">
                    <div className="flex gap-3">
                      <span className="flex items-center gap-1 text-white text-sm bg-black/50 px-2 py-1 rounded-lg">
                        <FiEye />
                        {listing.viewCount}
                      </span>
                      <span className="flex items-center gap-1 text-white text-sm bg-black/50 px-2 py-1 rounded-lg">
                        <FiMessageCircle />
                        {listing.contactClickCount}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3
                    className={`font-bold text-lg mb-1 ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {listing.carModel?.brand?.name} {listing.carModel?.modelName}
                  </h3>
                  <p className={isDarkMode ? "text-slate-400" : "text-gray-500"}>
                    {listing.year} • {formatMileage(listing.mileage)}
                  </p>

                  <div className="mt-3 mb-4">
                    <div className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600">
                      {formatPrice(listing.price)}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleToggleActive(listing.id, listing.isActive)}
                      className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-semibold transition-all ${
                        listing.isActive
                          ? "bg-orange-500/10 text-orange-500 hover:bg-orange-500/20"
                          : "bg-green-500/10 text-green-500 hover:bg-green-500/20"
                      }`}
                    >
                      {listing.isActive ? (
                        <>
                          <FiToggleRight />
                          Nonaktifkan
                        </>
                      ) : (
                        <>
                          <FiToggleLeft />
                          Aktifkan
                        </>
                      )}
                    </button>

                    {/* Boost Button */}
                    {listing.isActive && (
                      <Link
                        href={`/marketplace/boost?listingId=${listing.id}`}
                        className="p-2 rounded-xl bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-500 hover:from-yellow-500/30 hover:to-orange-500/30 transition-all"
                        title="Boost Listing"
                      >
                        <FiZap />
                      </Link>
                    )}

                    <Link
                      href={`/marketplace/${listing.id}`}
                      className={`p-2 rounded-xl transition-all ${
                        isDarkMode
                          ? "bg-slate-800 text-slate-300 hover:bg-slate-700"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      <FiEye />
                    </Link>

                    <button
                      onClick={() =>
                        handleDelete(
                          listing.id,
                          `${listing.carModel?.brand?.name} ${listing.carModel?.modelName}`
                        )
                      }
                      className="p-2 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-all"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyListingsPage;
