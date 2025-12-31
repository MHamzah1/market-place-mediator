"use client";

import React from "react";
import { FiSearch, FiMapPin, FiTrendingUp } from "react-icons/fi";
import { AiOutlineCar } from "react-icons/ai";
import { useTheme } from "@/context/ThemeContext";

const HeaderBeranda = () => {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  return (
    <section
      className={`relative overflow-hidden transition-colors duration-300 ${
        isDarkMode
          ? "bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950"
          : "bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900"
      }`}
    >
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div
          className={`absolute top-20 left-20 w-96 h-96 rounded-full blur-3xl animate-pulse ${
            isDarkMode ? "bg-cyan-500" : "bg-white"
          }`}
        ></div>
        <div
          className={`absolute bottom-20 right-20 w-[500px] h-[500px] rounded-full blur-3xl animate-pulse ${
            isDarkMode ? "bg-blue-500" : "bg-blue-300"
          }`}
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `linear-gradient(${
              isDarkMode ? "#ffffff" : "#000000"
            } 1px, transparent 1px), linear-gradient(90deg, ${
              isDarkMode ? "#ffffff" : "#000000"
            } 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        ></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8 animate-fade-in">
            {/* Badge */}
            <div className="inline-block">
              <span
                className={`px-5 py-2.5 rounded-full text-sm font-bold border-2 backdrop-blur-sm ${
                  isDarkMode
                    ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-400"
                    : "bg-white/20 border-white/30 text-white"
                }`}
              >
                🎉 Platform Marketplace #1 di Indonesia
              </span>
            </div>

            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight">
                <span className="text-white">Temukan Mobil</span>
                <span
                  className={`block ${
                    isDarkMode
                      ? "text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500"
                      : "text-yellow-300"
                  }`}
                >
                  Impian Anda
                </span>
              </h1>

              <p
                className={`text-xl md:text-2xl font-medium leading-relaxed max-w-xl ${
                  isDarkMode ? "text-slate-300" : "text-blue-100"
                }`}
              >
                Ribuan pilihan mobil berkualitas dengan harga terbaik.
                Dilengkapi jasa inspeksi profesional dan kalkulator pembiayaan.
              </p>
            </div>

            {/* Search Box */}
            <div
              className={`rounded-3xl p-6 shadow-2xl backdrop-blur-xl border-2 ${
                isDarkMode
                  ? "bg-slate-900/50 border-slate-700/50"
                  : "bg-white/95 border-white/20"
              }`}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative group">
                  <FiSearch
                    className={`absolute left-4 top-1/2 transform -translate-y-1/2 text-xl ${
                      isDarkMode ? "text-slate-500" : "text-gray-400"
                    }`}
                  />
                  <input
                    type="text"
                    placeholder="Cari merek atau model..."
                    className={`w-full pl-12 pr-4 py-4 rounded-2xl border-2 font-medium transition-all duration-200 focus:outline-none ${
                      isDarkMode
                        ? "bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                        : "bg-white border-gray-200 text-gray-800 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    }`}
                  />
                </div>

                <div className="relative group">
                  <FiMapPin
                    className={`absolute left-4 top-1/2 transform -translate-y-1/2 text-xl ${
                      isDarkMode ? "text-slate-500" : "text-gray-400"
                    }`}
                  />
                  <select
                    className={`w-full pl-12 pr-4 py-4 rounded-2xl border-2 font-medium transition-all duration-200 focus:outline-none appearance-none ${
                      isDarkMode
                        ? "bg-slate-800 border-slate-700 text-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                        : "bg-white border-gray-200 text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    }`}
                  >
                    <option>Semua Lokasi</option>
                    <option>Jakarta</option>
                    <option>Bandung</option>
                    <option>Surabaya</option>
                    <option>Medan</option>
                  </select>
                </div>

                <button
                  className={`py-4 px-6 rounded-2xl font-bold transition-all duration-200 flex items-center justify-center space-x-2 shadow-xl ${
                    isDarkMode
                      ? "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-cyan-500/30"
                      : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-blue-500/30"
                  } hover:scale-105`}
                >
                  <FiSearch />
                  <span>Cari Mobil</span>
                </button>
              </div>

              {/* Quick Filters */}
              <div className="flex flex-wrap gap-3 mt-6">
                <span
                  className={`text-sm font-semibold ${
                    isDarkMode ? "text-slate-400" : "text-gray-600"
                  }`}
                >
                  Populer:
                </span>
                {[
                  "Toyota Avanza",
                  "Honda CR-V",
                  "Mitsubishi Xpander",
                  "Suzuki Ertiga",
                ].map((item) => (
                  <button
                    key={item}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      isDarkMode
                        ? "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-cyan-400 border border-slate-700"
                        : "bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-600 border border-gray-200"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6">
              {[
                { value: "10K+", label: "Mobil Tersedia", icon: "🚗" },
                { value: "50K+", label: "Pengguna", icon: "👥" },
                { value: "4.9", label: "Rating", icon: "⭐" },
              ].map((stat, index) => (
                <div key={index} className="text-center md:text-left group">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl">{stat.icon}</span>
                    <div className="text-4xl font-black text-white group-hover:scale-110 transition-transform">
                      {stat.value}
                    </div>
                  </div>
                  <div
                    className={`text-sm font-semibold ${
                      isDarkMode ? "text-slate-400" : "text-blue-200"
                    }`}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Floating Cards */}
          <div className="relative hidden lg:block">
            <div className="relative">
              {/* Floating Badge Cards */}
              <div
                className={`absolute -top-8 -right-8 rounded-2xl shadow-2xl p-6 backdrop-blur-xl border-2 animate-bounce ${
                  isDarkMode
                    ? "bg-slate-800/50 border-slate-700/50"
                    : "bg-white/90 border-white/20"
                }`}
                style={{ animationDuration: "3s" }}
              >
                <div className="flex items-center space-x-4">
                  <div
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                      isDarkMode
                        ? "bg-gradient-to-br from-green-500 to-emerald-600"
                        : "bg-green-100"
                    }`}
                  >
                    <span className="text-3xl">✓</span>
                  </div>
                  <div>
                    <div
                      className={`text-xs font-bold ${
                        isDarkMode ? "text-slate-400" : "text-gray-500"
                      }`}
                    >
                      Inspeksi
                    </div>
                    <div
                      className={`text-lg font-black ${
                        isDarkMode ? "text-white" : "text-gray-800"
                      }`}
                    >
                      Terpercaya
                    </div>
                  </div>
                </div>
              </div>

              <div
                className={`absolute -bottom-8 -left-8 rounded-2xl shadow-2xl p-6 backdrop-blur-xl border-2 animate-bounce ${
                  isDarkMode
                    ? "bg-slate-800/50 border-slate-700/50"
                    : "bg-white/90 border-white/20"
                }`}
                style={{ animationDuration: "3s", animationDelay: "0.5s" }}
              >
                <div className="flex items-center space-x-4">
                  <div
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                      isDarkMode
                        ? "bg-gradient-to-br from-yellow-500 to-orange-600"
                        : "bg-blue-100"
                    }`}
                  >
                    <span className="text-3xl">💰</span>
                  </div>
                  <div>
                    <div
                      className={`text-xs font-bold ${
                        isDarkMode ? "text-slate-400" : "text-gray-500"
                      }`}
                    >
                      Harga
                    </div>
                    <div
                      className={`text-lg font-black ${
                        isDarkMode ? "text-white" : "text-gray-800"
                      }`}
                    >
                      Terjangkau
                    </div>
                  </div>
                </div>
              </div>

              {/* Car Illustration */}
              <div
                className={`rounded-3xl p-12 backdrop-blur-xl border-2 ${
                  isDarkMode
                    ? "bg-slate-800/30 border-slate-700/50"
                    : "bg-white/10 border-white/20"
                }`}
              >
                <div className="flex items-center justify-center h-96">
                  <AiOutlineCar
                    className={`text-9xl animate-pulse ${
                      isDarkMode ? "text-slate-700" : "text-white/50"
                    }`}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wave Bottom */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 120"
          className="w-full"
          preserveAspectRatio="none"
        >
          <path
            fill={isDarkMode ? "#0f172a" : "#f9fafb"}
            fillOpacity="1"
            d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
          ></path>
        </svg>
      </div>
    </section>
  );
};

export default HeaderBeranda;
