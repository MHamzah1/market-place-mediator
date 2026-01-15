"use client";

import React from "react";
import { FiEye, FiUsers, FiTrendingUp, FiCalendar, FiMapPin } from "react-icons/fi";
import { useTheme } from "@/context/ThemeContext";
import { BoostEstimation } from "@/lib/state/slice/boost/boostSlice";
import FeaturedBadge from "./FeaturedBadge";

interface BoostPreviewProps {
  estimation: BoostEstimation;
}

const BoostPreview: React.FC<BoostPreviewProps> = ({ estimation }) => {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatReach = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  const getBadgeFromPriority = (priority: number) => {
    if (priority >= 50) return "Premium";
    if (priority >= 30) return "Unggulan";
    if (priority >= 10) return "Populer";
    return "Featured";
  };

  return (
    <div className={`rounded-2xl overflow-hidden ${isDarkMode ? "bg-slate-900" : "bg-white"} shadow-xl`}>
      {/* Header */}
      <div className={`p-4 ${isDarkMode ? "bg-slate-800" : "bg-gray-50"} border-b ${isDarkMode ? "border-slate-700" : "border-gray-200"}`}>
        <h3 className={`text-lg font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
          Preview Listing Unggulan
        </h3>
        <p className={`text-sm ${isDarkMode ? "text-slate-400" : "text-gray-500"}`}>
          Tampilan listing Anda setelah di-boost
        </p>
      </div>

      {/* Preview Card */}
      <div className="p-6">
        <div className={`rounded-xl overflow-hidden border-2 ${isDarkMode ? "border-cyan-500/30 bg-slate-800" : "border-blue-500/30 bg-blue-50/50"}`}>
          {/* Image Section */}
          <div className="relative h-48">
            {estimation.listing.image ? (
              <img
                src={estimation.listing.image}
                alt={estimation.listing.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className={`w-full h-full flex items-center justify-center ${isDarkMode ? "bg-slate-700" : "bg-gray-200"}`}>
                <span className="text-6xl">🚗</span>
              </div>
            )}
            
            {/* Featured Badge */}
            <div className="absolute top-3 left-3">
              <FeaturedBadge badge={getBadgeFromPriority(estimation.estimation.priorityScore)} size="md" />
            </div>

            {/* View Count Preview */}
            <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2 py-1 bg-black/50 backdrop-blur-sm rounded-lg text-white text-sm">
              <FiEye />
              <span>{estimation.listing.currentViews}</span>
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            <h4 className={`font-bold text-lg ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              {estimation.listing.title}
            </h4>
            
            <div className={`mt-2 text-xl font-bold ${isDarkMode ? "text-cyan-400" : "text-blue-600"}`}>
              {formatPrice(estimation.totalAmount)}
            </div>
          </div>
        </div>

        {/* Estimation Stats */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className={`p-4 rounded-xl ${isDarkMode ? "bg-slate-800" : "bg-gray-50"}`}>
            <div className="flex items-center gap-2 mb-2">
              <FiUsers className={isDarkMode ? "text-cyan-400" : "text-blue-600"} />
              <span className={`text-sm font-semibold ${isDarkMode ? "text-slate-300" : "text-gray-700"}`}>
                Estimasi Jangkauan
              </span>
            </div>
            <div className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              {formatReach(estimation.estimation.reachMin)} - {formatReach(estimation.estimation.reachMax)}
            </div>
            <div className={`text-xs ${isDarkMode ? "text-slate-500" : "text-gray-500"}`}>
              pengguna potensial
            </div>
          </div>

          <div className={`p-4 rounded-xl ${isDarkMode ? "bg-slate-800" : "bg-gray-50"}`}>
            <div className="flex items-center gap-2 mb-2">
              <FiTrendingUp className={isDarkMode ? "text-cyan-400" : "text-blue-600"} />
              <span className={`text-sm font-semibold ${isDarkMode ? "text-slate-300" : "text-gray-700"}`}>
                Priority Score
              </span>
            </div>
            <div className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              {estimation.estimation.priorityScore}
            </div>
            <div className={`text-xs ${isDarkMode ? "text-slate-500" : "text-gray-500"}`}>
              tingkat prioritas
            </div>
          </div>
        </div>

        {/* Duration Info */}
        <div className={`mt-4 p-4 rounded-xl ${isDarkMode ? "bg-gradient-to-r from-cyan-900/30 to-blue-900/30" : "bg-gradient-to-r from-blue-50 to-cyan-50"}`}>
          <div className="flex items-center gap-2 mb-2">
            <FiCalendar className={isDarkMode ? "text-cyan-400" : "text-blue-600"} />
            <span className={`font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              Periode Boost
            </span>
          </div>
          <div className={`text-sm ${isDarkMode ? "text-slate-300" : "text-gray-600"}`}>
            {formatDate(estimation.estimation.startDate)} - {formatDate(estimation.estimation.endDate)}
          </div>
          <div className={`text-xs mt-1 ${isDarkMode ? "text-slate-500" : "text-gray-500"}`}>
            {estimation.package 
              ? `${estimation.package.durationDays} hari`
              : estimation.customConfig 
                ? `${estimation.customConfig.durationDays} hari (custom)`
                : ""
            }
          </div>
        </div>

        {/* Benefits */}
        <div className="mt-6">
          <h4 className={`font-semibold mb-3 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
            Yang Akan Anda Dapatkan:
          </h4>
          <ul className="space-y-2">
            {[
              "Muncul di bagian 'Mobil Unggulan' homepage",
              "Prioritas di hasil pencarian marketplace",
              "Badge eksklusif pada listing Anda",
              "Statistik performa real-time",
            ].map((benefit, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center ${isDarkMode ? "bg-cyan-500/20 text-cyan-400" : "bg-blue-100 text-blue-600"}`}>
                  ✓
                </div>
                <span className={`text-sm ${isDarkMode ? "text-slate-300" : "text-gray-600"}`}>
                  {benefit}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BoostPreview;
