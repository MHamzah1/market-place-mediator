"use client";

import { useTheme } from "@/context/ThemeContext";
import React from "react";
import {
  AiOutlineCalculator,
  AiOutlineCar,
  AiOutlineCheckCircle,
} from "react-icons/ai";
import {
  FiTrendingUp,
  FiShield,
  FiZap,
  FiUsers,
  FiAward,
  FiClock,
} from "react-icons/fi";

const MarketingSection = () => {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  const mainFeatures = [
    {
      id: 1,
      icon: <AiOutlineCar className="text-6xl" />,
      title: "Marketplace Mobil",
      description:
        "Ribuan pilihan mobil dari berbagai merek dan model dengan harga terbaik",
      features: [
        "10.000+ Unit Mobil",
        "Semua Merek Tersedia",
        "Harga Transparan",
      ],
      gradient: isDarkMode
        ? "from-cyan-500 to-blue-600"
        : "from-blue-500 to-blue-700",
      iconBg: isDarkMode ? "bg-cyan-500/20" : "bg-blue-100",
    },
    {
      id: 2,
      icon: <AiOutlineCalculator className="text-6xl" />,
      title: "Kalkulator Mobil",
      description:
        "Hitung simulasi kredit dan cicilan mobil impian Anda dengan mudah dan akurat",
      features: [
        "Simulasi Kredit Real-time",
        "Berbagai Skema DP",
        "Perbandingan Leasing",
      ],
      gradient: isDarkMode
        ? "from-emerald-500 to-green-600"
        : "from-green-500 to-green-700",
      iconBg: isDarkMode ? "bg-emerald-500/20" : "bg-green-100",
    },
    {
      id: 3,
      icon: <AiOutlineCheckCircle className="text-6xl" />,
      title: "Jasa Inspeksi",
      description:
        "Inspeksi profesional untuk memastikan kualitas mobil sebelum Anda membeli",
      features: [
        "150+ Poin Pemeriksaan",
        "Teknisi Bersertifikat",
        "Laporan Digital",
      ],
      gradient: isDarkMode
        ? "from-orange-500 to-red-600"
        : "from-orange-500 to-orange-700",
      iconBg: isDarkMode ? "bg-orange-500/20" : "bg-orange-100",
    },
  ];

  const benefits = [
    {
      icon: <FiShield />,
      title: "Aman & Terpercaya",
      desc: "Semua mobil terverifikasi",
      color: isDarkMode ? "text-cyan-400" : "text-blue-600",
      bgHover: isDarkMode
        ? "group-hover:bg-cyan-500"
        : "group-hover:bg-blue-600",
    },
    {
      icon: <FiZap />,
      title: "Proses Cepat",
      desc: "Transaksi mudah & cepat",
      color: isDarkMode ? "text-yellow-400" : "text-yellow-600",
      bgHover: isDarkMode
        ? "group-hover:bg-yellow-500"
        : "group-hover:bg-yellow-600",
    },
    {
      icon: <FiUsers />,
      title: "50K+ Pengguna",
      desc: "Dipercaya ribuan orang",
      color: isDarkMode ? "text-purple-400" : "text-purple-600",
      bgHover: isDarkMode
        ? "group-hover:bg-purple-500"
        : "group-hover:bg-purple-600",
    },
    {
      icon: <FiAward />,
      title: "Rating 4.9/5",
      desc: "Kepuasan pelanggan",
      color: isDarkMode ? "text-green-400" : "text-green-600",
      bgHover: isDarkMode
        ? "group-hover:bg-green-500"
        : "group-hover:bg-green-600",
    },
    {
      icon: <FiTrendingUp />,
      title: "Harga Kompetitif",
      desc: "Harga terbaik di pasaran",
      color: isDarkMode ? "text-orange-400" : "text-orange-600",
      bgHover: isDarkMode
        ? "group-hover:bg-orange-500"
        : "group-hover:bg-orange-600",
    },
    {
      icon: <FiClock />,
      title: "Support 24/7",
      desc: "Layanan pelanggan siaga",
      color: isDarkMode ? "text-pink-400" : "text-pink-600",
      bgHover: isDarkMode
        ? "group-hover:bg-pink-500"
        : "group-hover:bg-pink-600",
    },
  ];

  return (
    <section
      className={`py-20 transition-colors duration-300 ${
        isDarkMode ? "bg-slate-900" : "bg-gray-50"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-block mb-6">
            <span
              className={`px-6 py-3 rounded-full text-sm font-bold border-2 ${
                isDarkMode
                  ? "bg-purple-500/10 border-purple-500/30 text-purple-400"
                  : "bg-purple-100 border-purple-200 text-purple-600"
              }`}
            >
              Fitur Unggulan
            </span>
          </div>
          <h2
            className={`text-4xl md:text-5xl font-black mb-6 ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Solusi Lengkap untuk Kebutuhan Otomotif Anda
          </h2>
          <p
            className={`text-xl max-w-2xl mx-auto ${
              isDarkMode ? "text-slate-400" : "text-gray-600"
            }`}
          >
            Platform all-in-one untuk jual beli mobil, simulasi kredit, dan
            inspeksi kendaraan
          </p>
        </div>

        {/* Main Features Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-20">
          {mainFeatures.map((feature) => (
            <div
              key={feature.id}
              className={`rounded-3xl shadow-2xl transition-all duration-500 overflow-hidden group hover:-translate-y-4 border-2 ${
                isDarkMode
                  ? "bg-slate-800 border-slate-700 hover:border-cyan-500/50"
                  : "bg-white border-gray-200 hover:border-blue-500/50"
              }`}
            >
              {/* Header with Gradient */}
              <div
                className={`bg-gradient-to-r ${feature.gradient} p-8 text-white relative overflow-hidden`}
              >
                {/* Animated background circles */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500"></div>

                <div className="relative z-10">
                  <div className="flex justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-black text-center">
                    {feature.title}
                  </h3>
                </div>
              </div>

              {/* Content */}
              <div className="p-8">
                <p
                  className={`text-center mb-8 leading-relaxed ${
                    isDarkMode ? "text-slate-400" : "text-gray-600"
                  }`}
                >
                  {feature.description}
                </p>

                {/* Feature List */}
                <ul className="space-y-4 mb-8">
                  {feature.features.map((item, index) => (
                    <li key={index} className="flex items-center text-sm">
                      <div
                        className={`w-6 h-6 rounded-full ${feature.iconBg} flex items-center justify-center mr-3 shrink-0`}
                      >
                        <span
                          className={`text-xs font-bold ${
                            isDarkMode ? "text-white" : "text-gray-700"
                          }`}
                        >
                          ✓
                        </span>
                      </div>
                      <span
                        className={`font-medium ${
                          isDarkMode ? "text-slate-300" : "text-gray-700"
                        }`}
                      >
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <button
                  className={`w-full bg-gradient-to-r ${
                    feature.gradient
                  } text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-xl ${
                    isDarkMode ? "shadow-cyan-500/20" : "shadow-blue-500/20"
                  }`}
                >
                  Explore Sekarang
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Benefits Grid */}
        <div
          className={`rounded-3xl shadow-2xl p-10 md:p-16 border-2 ${
            isDarkMode
              ? "bg-slate-800 border-slate-700"
              : "bg-white border-gray-200"
          }`}
        >
          <h3
            className={`text-3xl md:text-4xl font-black text-center mb-14 ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Mengapa Memilih CarMediator?
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center group cursor-pointer">
                <div
                  className={`w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-4 text-3xl transition-all duration-300 group-hover:scale-110 group-hover:-rotate-6 ${
                    isDarkMode
                      ? "bg-slate-900 group-hover:shadow-xl"
                      : "bg-gray-100 group-hover:shadow-xl"
                  } ${benefit.color} ${benefit.bgHover} group-hover:text-white`}
                >
                  {benefit.icon}
                </div>
                <h4
                  className={`font-black text-sm mb-2 ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {benefit.title}
                </h4>
                <p
                  className={`text-xs ${
                    isDarkMode ? "text-slate-500" : "text-gray-600"
                  }`}
                >
                  {benefit.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Banner */}
        <div
          className={`mt-20 rounded-3xl p-10 md:p-16 text-white relative overflow-hidden ${
            isDarkMode
              ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
              : "bg-gradient-to-r from-blue-600 via-blue-700 to-blue-900"
          }`}
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse"></div>
            <div
              className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-300 rounded-full blur-3xl animate-pulse"
              style={{ animationDelay: "1s" }}
            ></div>
          </div>

          {/* Grid overlay */}
          <div className="absolute inset-0 opacity-5">
            <div
              className="w-full h-full"
              style={{
                backgroundImage:
                  "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)",
                backgroundSize: "50px 50px",
              }}
            ></div>
          </div>

          <div className="relative z-10 text-center max-w-3xl mx-auto">
            <h3 className="text-4xl md:text-5xl font-black mb-6">
              Siap Menemukan Mobil Impian Anda?
            </h3>
            <p
              className={`text-xl mb-10 ${
                isDarkMode ? "text-slate-300" : "text-blue-100"
              }`}
            >
              Bergabunglah dengan ribuan pengguna yang sudah menemukan mobil
              terbaik mereka
            </p>
            <div className="flex flex-col sm:flex-row gap-5 justify-center">
              <button
                className={`font-bold py-5 px-10 rounded-2xl transition-all duration-300 inline-flex items-center justify-center space-x-3 shadow-2xl hover:scale-105 ${
                  isDarkMode
                    ? "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-cyan-500/30"
                    : "bg-white text-blue-600 hover:bg-blue-50 shadow-white/30"
                }`}
              >
                <AiOutlineCar className="text-2xl" />
                <span>Lihat Mobil</span>
              </button>
              <button
                className={`font-bold py-5 px-10 rounded-2xl transition-all duration-300 inline-flex items-center justify-center space-x-3 shadow-2xl hover:scale-105 ${
                  isDarkMode
                    ? "bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white shadow-yellow-500/30"
                    : "bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-gray-900 shadow-yellow-500/30"
                }`}
              >
                <AiOutlineCalculator className="text-2xl" />
                <span>Hitung Kredit</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MarketingSection;
