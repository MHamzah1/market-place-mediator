"use client";

import { useTheme } from "@/context/ThemeContext";
import React from "react";
import {
  AiOutlineCheckCircle,
  AiOutlineSafety,
  AiOutlineFileProtect,
} from "react-icons/ai";
import { FiCheckCircle, FiTool, FiClock } from "react-icons/fi";

const JasaInspeksiSection = () => {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  const inspectionFeatures = [
    {
      icon: <AiOutlineCheckCircle className="text-5xl" />,
      title: "Inspeksi Menyeluruh",
      description: "150+ poin pemeriksaan detail oleh teknisi bersertifikat",
      gradient: isDarkMode
        ? "from-cyan-500 to-blue-600"
        : "from-blue-500 to-blue-700",
      iconBg: isDarkMode ? "bg-cyan-500/20" : "bg-blue-50",
      iconColor: isDarkMode ? "text-cyan-400" : "text-blue-600",
    },
    {
      icon: <AiOutlineSafety className="text-5xl" />,
      title: "Garansi Keamanan",
      description: "Laporan lengkap kondisi kendaraan dengan jaminan akurat",
      gradient: isDarkMode
        ? "from-emerald-500 to-green-600"
        : "from-green-500 to-green-700",
      iconBg: isDarkMode ? "bg-emerald-500/20" : "bg-green-50",
      iconColor: isDarkMode ? "text-emerald-400" : "text-green-600",
    },
    {
      icon: <FiClock className="text-5xl" />,
      title: "Proses Cepat",
      description: "Inspeksi selesai dalam 2-3 jam, laporan langsung tersedia",
      gradient: isDarkMode
        ? "from-orange-500 to-red-600"
        : "from-orange-500 to-orange-700",
      iconBg: isDarkMode ? "bg-orange-500/20" : "bg-orange-50",
      iconColor: isDarkMode ? "text-orange-400" : "text-orange-600",
    },
    {
      icon: <AiOutlineFileProtect className="text-5xl" />,
      title: "Sertifikat Digital",
      description: "Sertifikat inspeksi digital yang dapat diverifikasi",
      gradient: isDarkMode
        ? "from-purple-500 to-pink-600"
        : "from-purple-500 to-purple-700",
      iconBg: isDarkMode ? "bg-purple-500/20" : "bg-purple-50",
      iconColor: isDarkMode ? "text-purple-400" : "text-purple-600",
    },
  ];

  const inspectionSteps = [
    {
      step: 1,
      title: "Booking Online",
      desc: "Pilih jadwal inspeksi",
      emoji: "📅",
    },
    {
      step: 2,
      title: "Inspeksi Dilakukan",
      desc: "Teknisi datang & periksa",
      emoji: "🔧",
    },
    {
      step: 3,
      title: "Terima Laporan",
      desc: "Laporan detail lengkap",
      emoji: "📋",
    },
    {
      step: 4,
      title: "Keputusan Beli",
      desc: "Beli dengan percaya diri",
      emoji: "✅",
    },
  ];

  const checklistItems = [
    { text: "Mesin & Sistem Kelistrikan", icon: "⚡" },
    { text: "Rangka & Bodi Kendaraan", icon: "🚗" },
    { text: "Sistem Suspensi & Kaki-kaki", icon: "🔩" },
    { text: "Sistem Rem & Transmisi", icon: "⚙️" },
    { text: "Interior & Eksterior", icon: "🎨" },
    { text: "Dokumen & Riwayat Kendaraan", icon: "📄" },
  ];

  return (
    <section
      className={`py-20 transition-colors duration-300 ${
        isDarkMode ? "bg-slate-950" : "bg-white"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-block mb-6">
            <span
              className={`px-6 py-3 rounded-full text-sm font-bold border-2 ${
                isDarkMode
                  ? "bg-green-500/10 border-green-500/30 text-green-400"
                  : "bg-green-100 border-green-200 text-green-600"
              }`}
            >
              Jasa Inspeksi Profesional
            </span>
          </div>
          <h2
            className={`text-4xl md:text-5xl font-black mb-6 ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Pastikan Mobil Anda Berkualitas
          </h2>
          <p
            className={`text-xl max-w-2xl mx-auto ${
              isDarkMode ? "text-slate-400" : "text-gray-600"
            }`}
          >
            Layanan inspeksi komprehensif oleh teknisi berpengalaman untuk
            memastikan kondisi mobil sebelum membeli
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {inspectionFeatures.map((feature, index) => (
            <div
              key={index}
              className={`rounded-3xl p-8 shadow-2xl transition-all duration-500 hover:-translate-y-4 group border-2 ${
                isDarkMode
                  ? "bg-slate-900 border-slate-800 hover:border-cyan-500/50"
                  : "bg-white border-gray-100 hover:border-blue-500/50"
              }`}
            >
              <div
                className={`w-20 h-20 ${feature.iconBg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 ${feature.iconColor}`}
              >
                {feature.icon}
              </div>
              <h3
                className={`text-xl font-black mb-3 ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {feature.title}
              </h3>
              <p
                className={`text-sm leading-relaxed ${
                  isDarkMode ? "text-slate-400" : "text-gray-600"
                }`}
              >
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Inspection Process */}
        <div
          className={`rounded-3xl p-10 md:p-16 mb-20 relative overflow-hidden ${
            isDarkMode
              ? "bg-gradient-to-br from-slate-900 to-slate-800"
              : "bg-gradient-to-br from-blue-50 to-blue-100"
          }`}
        >
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>

          <div className="relative z-10">
            <h3
              className={`text-3xl md:text-4xl font-black text-center mb-16 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Cara Kerja Inspeksi
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
              {/* Connection Lines for Desktop */}
              <div
                className={`hidden md:block absolute top-16 left-0 right-0 h-1 ${
                  isDarkMode ? "bg-slate-700" : "bg-blue-300"
                }`}
                style={{ width: "75%", left: "12.5%" }}
              ></div>

              {inspectionSteps.map((item, index) => (
                <div key={index} className="relative z-10">
                  <div className="flex flex-col items-center text-center">
                    <div
                      className={`w-32 h-32 rounded-3xl flex flex-col items-center justify-center text-white text-4xl font-black mb-6 shadow-2xl transition-all duration-300 hover:scale-110 ${
                        isDarkMode
                          ? "bg-gradient-to-br from-cyan-500 to-blue-600"
                          : "bg-gradient-to-br from-blue-600 to-blue-700"
                      }`}
                    >
                      <div className="text-5xl mb-2">{item.emoji}</div>
                      <div className="text-2xl">{item.step}</div>
                    </div>
                    <h4
                      className={`font-black text-lg mb-3 ${
                        isDarkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {item.title}
                    </h4>
                    <p
                      className={`text-sm ${
                        isDarkMode ? "text-slate-400" : "text-gray-600"
                      }`}
                    >
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Inspection Checklist Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h3
              className={`text-3xl font-black mb-8 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Yang Kami Periksa
            </h3>
            <div className="space-y-4">
              {checklistItems.map((item, index) => (
                <div
                  key={index}
                  className={`flex items-center space-x-4 p-5 rounded-2xl transition-all duration-300 hover:scale-105 group ${
                    isDarkMode
                      ? "bg-slate-900 hover:bg-slate-800 border-2 border-slate-800"
                      : "bg-gray-50 hover:bg-blue-50 border-2 border-gray-100"
                  }`}
                >
                  <div className="text-3xl">{item.icon}</div>
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                      isDarkMode
                        ? "bg-green-500/20 group-hover:bg-green-500"
                        : "bg-green-100 group-hover:bg-green-500"
                    }`}
                  >
                    <FiCheckCircle
                      className={`transition-colors ${
                        isDarkMode
                          ? "text-green-400 group-hover:text-white"
                          : "text-green-600 group-hover:text-white"
                      }`}
                    />
                  </div>
                  <span
                    className={`font-bold ${
                      isDarkMode ? "text-white" : "text-gray-800"
                    }`}
                  >
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Premium Package Card */}
          <div
            className={`rounded-3xl p-10 text-white shadow-2xl relative overflow-hidden ${
              isDarkMode
                ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
                : "bg-gradient-to-br from-gray-800 to-gray-900"
            }`}
          >
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl"></div>

            <div className="relative z-10">
              <div className="flex items-center justify-center mb-8">
                <div
                  className={`w-24 h-24 rounded-3xl flex items-center justify-center ${
                    isDarkMode
                      ? "bg-gradient-to-br from-cyan-500 to-blue-600"
                      : "bg-blue-600"
                  }`}
                >
                  <FiTool className="text-6xl" />
                </div>
              </div>

              <h3 className="text-3xl font-black mb-8 text-center">
                Paket Inspeksi Premium
              </h3>

              <div className="space-y-4 mb-10">
                {[
                  "Inspeksi Lengkap",
                  "Laporan Digital",
                  "Sertifikat Resmi",
                  "Test Drive",
                  "Garansi 30 Hari",
                ].map((item, index) => (
                  <div
                    key={index}
                    className={`flex justify-between items-center pb-4 border-b ${
                      isDarkMode ? "border-slate-700" : "border-gray-700"
                    }`}
                  >
                    <span
                      className={
                        isDarkMode ? "text-slate-300" : "text-gray-300"
                      }
                    >
                      {item}
                    </span>
                    <span className="font-black text-2xl text-green-400">
                      ✓
                    </span>
                  </div>
                ))}
              </div>

              <div className="text-center mb-8 p-6 bg-white/5 rounded-2xl backdrop-blur-sm">
                <div
                  className={`text-sm font-bold mb-3 ${
                    isDarkMode ? "text-slate-400" : "text-gray-400"
                  }`}
                >
                  Mulai dari
                </div>
                <div
                  className={`text-5xl font-black mb-2 ${
                    isDarkMode
                      ? "text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500"
                      : "text-white"
                  }`}
                >
                  Rp 500.000
                </div>
                <div
                  className={`text-sm ${
                    isDarkMode ? "text-slate-400" : "text-gray-400"
                  }`}
                >
                  per inspeksi
                </div>
              </div>

              <button
                className={`w-full font-bold py-5 px-6 rounded-2xl transition-all duration-300 shadow-2xl hover:scale-105 ${
                  isDarkMode
                    ? "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-cyan-500/30"
                    : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-blue-500/30"
                }`}
              >
                Pesan Inspeksi Sekarang
              </button>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-20">
          <div
            className={`rounded-3xl p-10 ${
              isDarkMode
                ? "bg-slate-900"
                : "bg-gradient-to-r from-gray-50 to-blue-50"
            }`}
          >
            <div className="flex flex-wrap justify-center gap-10 items-center">
              {[
                { icon: "🏆", text: "1000+ Inspeksi" },
                { icon: "👨‍🔧", text: "Teknisi Bersertifikat" },
                { icon: "⭐", text: "Rating 4.9/5" },
                { icon: "💯", text: "Garansi Uang Kembali" },
              ].map((badge, index) => (
                <div key={index} className="flex items-center space-x-3 group">
                  <div className="text-3xl group-hover:scale-125 transition-transform">
                    {badge.icon}
                  </div>
                  <span
                    className={`font-black ${
                      isDarkMode ? "text-white" : "text-gray-700"
                    }`}
                  >
                    {badge.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default JasaInspeksiSection;
