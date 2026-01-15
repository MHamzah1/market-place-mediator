"use client";

import React from "react";
import {
  FiEye,
  FiMousePointer,
  FiMessageCircle,
  FiTrendingUp,
  FiTrendingDown,
  FiCalendar,
} from "react-icons/fi";
import { useTheme } from "@/context/ThemeContext";
import { TransactionStatistics } from "@/lib/state/slice/boost/boostSlice";

interface BoostStatisticsChartProps {
  statistics: TransactionStatistics;
}

const BoostStatisticsChart: React.FC<BoostStatisticsChartProps> = ({
  statistics,
}) => {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
    });
  };

  // Calculate max value for chart scaling
  const maxImpressions = Math.max(...statistics.daily.map((d) => d.impressions), 1);

  // Status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500";
      case "expired":
        return "bg-gray-500";
      case "pending_payment":
        return "bg-yellow-500";
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Aktif";
      case "expired":
        return "Selesai";
      case "pending_payment":
        return "Menunggu Bayar";
      case "cancelled":
        return "Dibatalkan";
      default:
        return status;
    }
  };

  return (
    <div className={`rounded-2xl ${isDarkMode ? "bg-slate-900" : "bg-white"} shadow-xl`}>
      {/* Header */}
      <div className={`p-6 border-b ${isDarkMode ? "border-slate-800" : "border-gray-200"}`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              Statistik Performa Boost
            </h3>
            <p className={`text-sm ${isDarkMode ? "text-slate-400" : "text-gray-500"}`}>
              {formatDate(statistics.transaction.startDate)} -{" "}
              {formatDate(statistics.transaction.endDate)}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold text-white ${getStatusColor(
                statistics.transaction.status
              )}`}
            >
              {getStatusText(statistics.transaction.status)}
            </span>
            {statistics.transaction.status === "active" && (
              <span className={`text-sm ${isDarkMode ? "text-slate-400" : "text-gray-500"}`}>
                {statistics.transaction.daysRemaining} hari tersisa
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className={`p-4 rounded-xl ${isDarkMode ? "bg-slate-800" : "bg-gray-50"}`}>
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600">
              <FiEye className="text-white" />
            </div>
            <span className={`text-sm ${isDarkMode ? "text-slate-400" : "text-gray-500"}`}>
              Impressions
            </span>
          </div>
          <div className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
            {formatNumber(statistics.actual.totalImpressions)}
          </div>
          <div className={`text-xs ${isDarkMode ? "text-slate-500" : "text-gray-400"}`}>
            Target: {formatNumber(statistics.estimation.reachMin)} -{" "}
            {formatNumber(statistics.estimation.reachMax)}
          </div>
        </div>

        <div className={`p-4 rounded-xl ${isDarkMode ? "bg-slate-800" : "bg-gray-50"}`}>
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-600">
              <FiMousePointer className="text-white" />
            </div>
            <span className={`text-sm ${isDarkMode ? "text-slate-400" : "text-gray-500"}`}>
              Klik
            </span>
          </div>
          <div className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
            {formatNumber(statistics.actual.totalClicks)}
          </div>
          <div className={`text-xs ${isDarkMode ? "text-slate-500" : "text-gray-400"}`}>
            CTR: {statistics.actual.clickThroughRate}
          </div>
        </div>

        <div className={`p-4 rounded-xl ${isDarkMode ? "bg-slate-800" : "bg-gray-50"}`}>
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600">
              <FiMessageCircle className="text-white" />
            </div>
            <span className={`text-sm ${isDarkMode ? "text-slate-400" : "text-gray-500"}`}>
              Kontak
            </span>
          </div>
          <div className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
            {statistics.actual.totalContactClicks}
          </div>
          <div className={`text-xs ${isDarkMode ? "text-slate-500" : "text-gray-400"}`}>
            Rate: {statistics.actual.contactRate}
          </div>
        </div>

        <div className={`p-4 rounded-xl ${isDarkMode ? "bg-slate-800" : "bg-gray-50"}`}>
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-600">
              <FiTrendingUp className="text-white" />
            </div>
            <span className={`text-sm ${isDarkMode ? "text-slate-400" : "text-gray-500"}`}>
              Konversi
            </span>
          </div>
          <div className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
            {statistics.actual.contactRate}
          </div>
          <div className={`text-xs ${isDarkMode ? "text-slate-500" : "text-gray-400"}`}>
            dari total klik
          </div>
        </div>
      </div>

      {/* Daily Chart */}
      <div className="p-6">
        <h4 className={`font-semibold mb-4 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
          Performa Harian
        </h4>
        <div className="space-y-3">
          {statistics.daily.map((day, idx) => (
            <div key={idx} className={`p-4 rounded-xl ${isDarkMode ? "bg-slate-800" : "bg-gray-50"}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <FiCalendar className={isDarkMode ? "text-slate-400" : "text-gray-500"} />
                  <span className={`font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                    {formatDate(day.date)}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className={isDarkMode ? "text-slate-400" : "text-gray-500"}>
                    <FiEye className="inline mr-1" />
                    {day.impressions}
                  </span>
                  <span className={isDarkMode ? "text-slate-400" : "text-gray-500"}>
                    <FiMousePointer className="inline mr-1" />
                    {day.clicks}
                  </span>
                  <span className={isDarkMode ? "text-slate-400" : "text-gray-500"}>
                    <FiMessageCircle className="inline mr-1" />
                    {day.contactClicks}
                  </span>
                </div>
              </div>
              {/* Progress Bar */}
              <div className={`h-2 rounded-full ${isDarkMode ? "bg-slate-700" : "bg-gray-200"}`}>
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 transition-all duration-500"
                  style={{
                    width: `${(day.impressions / maxImpressions) * 100}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reach Progress */}
      <div className="p-6 border-t border-slate-800">
        <h4 className={`font-semibold mb-4 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
          Progress Jangkauan
        </h4>
        <div className={`p-4 rounded-xl ${isDarkMode ? "bg-slate-800" : "bg-gray-50"}`}>
          <div className="flex justify-between mb-2">
            <span className={isDarkMode ? "text-slate-400" : "text-gray-500"}>
              {formatNumber(statistics.actual.totalImpressions)} /{" "}
              {formatNumber(statistics.estimation.reachMax)}
            </span>
            <span className={isDarkMode ? "text-slate-400" : "text-gray-500"}>
              {Math.round(
                (statistics.actual.totalImpressions / statistics.estimation.reachMax) * 100
              )}
              %
            </span>
          </div>
          <div className={`h-4 rounded-full ${isDarkMode ? "bg-slate-700" : "bg-gray-200"} overflow-hidden`}>
            {/* Min target indicator */}
            <div className="relative h-full">
              <div
                className="absolute h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full transition-all duration-1000"
                style={{
                  width: `${Math.min(
                    (statistics.actual.totalImpressions / statistics.estimation.reachMax) * 100,
                    100
                  )}%`,
                }}
              />
              {/* Min target line */}
              <div
                className="absolute h-full w-0.5 bg-yellow-500"
                style={{
                  left: `${(statistics.estimation.reachMin / statistics.estimation.reachMax) * 100}%`,
                }}
              />
            </div>
          </div>
          <div className="flex justify-between mt-2 text-xs">
            <span className={isDarkMode ? "text-slate-500" : "text-gray-400"}>0</span>
            <span className="text-yellow-500">
              Min: {formatNumber(statistics.estimation.reachMin)}
            </span>
            <span className={isDarkMode ? "text-slate-500" : "text-gray-400"}>
              Max: {formatNumber(statistics.estimation.reachMax)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoostStatisticsChart;
