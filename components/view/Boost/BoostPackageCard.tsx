"use client";

import React from "react";
import { FiCheck, FiTrendingUp, FiUsers, FiClock, FiStar } from "react-icons/fi";
import { useTheme } from "@/context/ThemeContext";
import { BoostPackage } from "@/lib/state/slice/boost/boostSlice";

interface BoostPackageCardProps {
  packageData: BoostPackage;
  isSelected: boolean;
  onSelect: (pkg: BoostPackage) => void;
  isPopular?: boolean;
}

const BoostPackageCard: React.FC<BoostPackageCardProps> = ({
  packageData,
  isSelected,
  onSelect,
  isPopular = false,
}) => {
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

  const formatReach = (min: number, max: number) => {
    const formatNumber = (num: number) => {
      if (num >= 1000) {
        return (num / 1000).toFixed(0) + "K";
      }
      return num.toString();
    };
    return `${formatNumber(min)} - ${formatNumber(max)}`;
  };

  const getPackageColor = () => {
    switch (packageData.name.toLowerCase()) {
      case "basic":
        return {
          gradient: "from-gray-500 to-gray-600",
          ring: "ring-gray-500",
          bg: isDarkMode ? "bg-gray-900" : "bg-gray-50",
        };
      case "standard":
        return {
          gradient: "from-blue-500 to-blue-600",
          ring: "ring-blue-500",
          bg: isDarkMode ? "bg-blue-900/20" : "bg-blue-50",
        };
      case "premium":
        return {
          gradient: "from-purple-500 to-purple-600",
          ring: "ring-purple-500",
          bg: isDarkMode ? "bg-purple-900/20" : "bg-purple-50",
        };
      case "pro":
        return {
          gradient: "from-orange-500 to-orange-600",
          ring: "ring-orange-500",
          bg: isDarkMode ? "bg-orange-900/20" : "bg-orange-50",
        };
      case "ultimate":
        return {
          gradient: "from-yellow-500 to-amber-600",
          ring: "ring-yellow-500",
          bg: isDarkMode ? "bg-yellow-900/20" : "bg-yellow-50",
        };
      default:
        return {
          gradient: "from-cyan-500 to-blue-600",
          ring: "ring-cyan-500",
          bg: isDarkMode ? "bg-cyan-900/20" : "bg-cyan-50",
        };
    }
  };

  const colors = getPackageColor();

  return (
    <div
      onClick={() => onSelect(packageData)}
      className={`
        relative rounded-2xl p-6 cursor-pointer transition-all duration-300
        ${isSelected 
          ? `ring-2 ${colors.ring} ${colors.bg} scale-105 shadow-xl` 
          : isDarkMode 
            ? "bg-slate-900 hover:bg-slate-800" 
            : "bg-white hover:bg-gray-50"
        }
        ${isDarkMode ? "border border-slate-800" : "border border-gray-200"}
        hover:shadow-xl
      `}
    >
      {/* Popular Badge */}
      {isPopular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-yellow-500 to-orange-600 text-white text-xs font-bold rounded-full shadow-lg">
            <FiStar />
            Populer
          </span>
        </div>
      )}

      {/* Selected Check */}
      {isSelected && (
        <div className={`absolute top-4 right-4 w-6 h-6 rounded-full bg-gradient-to-r ${colors.gradient} flex items-center justify-center`}>
          <FiCheck className="text-white text-sm" />
        </div>
      )}

      {/* Package Name */}
      <div className="text-center mb-4">
        <h3 className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
          {packageData.name}
        </h3>
      </div>

      {/* Price */}
      <div className="text-center mb-6">
        <div className={`text-3xl font-black bg-gradient-to-r ${colors.gradient} bg-clip-text text-transparent`}>
          {formatPrice(packageData.price)}
        </div>
        <div className={`text-sm ${isDarkMode ? "text-slate-400" : "text-gray-500"}`}>
          untuk {packageData.durationDays} hari
        </div>
      </div>

      {/* Features */}
      <div className="space-y-3">
        <div className={`flex items-center gap-3 p-3 rounded-xl ${isDarkMode ? "bg-slate-800" : "bg-gray-100"}`}>
          <div className={`p-2 rounded-lg bg-gradient-to-r ${colors.gradient}`}>
            <FiUsers className="text-white" />
          </div>
          <div>
            <div className={`text-sm font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              Estimasi Jangkauan
            </div>
            <div className={`text-xs ${isDarkMode ? "text-slate-400" : "text-gray-500"}`}>
              {formatReach(packageData.estimatedReachMin, packageData.estimatedReachMax)} pengguna
            </div>
          </div>
        </div>

        <div className={`flex items-center gap-3 p-3 rounded-xl ${isDarkMode ? "bg-slate-800" : "bg-gray-100"}`}>
          <div className={`p-2 rounded-lg bg-gradient-to-r ${colors.gradient}`}>
            <FiClock className="text-white" />
          </div>
          <div>
            <div className={`text-sm font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              Durasi Boost
            </div>
            <div className={`text-xs ${isDarkMode ? "text-slate-400" : "text-gray-500"}`}>
              {packageData.durationDays} hari aktif
            </div>
          </div>
        </div>

        <div className={`flex items-center gap-3 p-3 rounded-xl ${isDarkMode ? "bg-slate-800" : "bg-gray-100"}`}>
          <div className={`p-2 rounded-lg bg-gradient-to-r ${colors.gradient}`}>
            <FiTrendingUp className="text-white" />
          </div>
          <div>
            <div className={`text-sm font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              Priority Score
            </div>
            <div className={`text-xs ${isDarkMode ? "text-slate-400" : "text-gray-500"}`}>
              Level {packageData.priorityScore}
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      {packageData.description && (
        <div className={`mt-4 text-sm text-center ${isDarkMode ? "text-slate-400" : "text-gray-500"}`}>
          {packageData.description}
        </div>
      )}

      {/* Select Button */}
      <button
        className={`
          w-full mt-6 py-3 rounded-xl font-bold transition-all
          ${isSelected
            ? `bg-gradient-to-r ${colors.gradient} text-white shadow-lg`
            : isDarkMode
              ? "bg-slate-800 text-slate-300 hover:bg-slate-700"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }
        `}
      >
        {isSelected ? "Terpilih" : "Pilih Paket"}
      </button>
    </div>
  );
};

export default BoostPackageCard;
