"use client";

import React, { useState } from "react";
import { FiHeart, FiMapPin, FiCalendar } from "react-icons/fi";
import { AiOutlineCar } from "react-icons/ai";
import { useTheme } from "@/context/ThemeContext";

const SuperiorCarSection = () => {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const cars = [
    {
      id: 1,
      name: "Toyota Avanza 1.3 G MT",
      year: 2023,
      price: 185000000,
      location: "Jakarta Selatan",
      mileage: "15.000 km",
      transmission: "Manual",
      fuel: "Bensin",
      image: "🚗",
      condition: "Sangat Baik",
      badge: "Populer",
    },
    // ... other cars
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <section
      className={`py-20 transition-colors duration-300 ${
        isDarkMode ? "bg-slate-950" : "bg-gray-50"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-block mb-6">
            <span
              className={`px-6 py-3 rounded-full text-sm font-bold border-2 ${
                isDarkMode
                  ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-400"
                  : "bg-blue-100 border-blue-200 text-blue-600"
              }`}
            >
              Mobil Unggulan
            </span>
          </div>
          <h2
            className={`text-4xl md:text-5xl font-black mb-6 ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Pilihan Mobil Terbaik
          </h2>
          <p
            className={`text-xl max-w-2xl mx-auto ${
              isDarkMode ? "text-slate-400" : "text-gray-600"
            }`}
          >
            Koleksi mobil berkualitas dengan harga terjangkau, sudah diinspeksi
            dan siap pakai
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {["Semua", "SUV", "MPV", "Sedan", "Hatchback", "Sport"].map(
            (filter) => (
              <button
                key={filter}
                className={`px-8 py-3 rounded-2xl font-bold transition-all duration-200 ${
                  filter === "Semua"
                    ? isDarkMode
                      ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-xl shadow-cyan-500/30"
                      : "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-xl shadow-blue-500/30"
                    : isDarkMode
                    ? "bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-cyan-400 border-2 border-slate-800"
                    : "bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 border-2 border-gray-200"
                } hover:scale-105`}
              >
                {filter}
              </button>
            )
          )}
        </div>

        {/* Cars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cars.map((car) => (
            <div
              key={car.id}
              className={`rounded-3xl shadow-2xl transition-all duration-300 overflow-hidden group cursor-pointer border-2 ${
                isDarkMode
                  ? "bg-slate-900 border-slate-800 hover:border-cyan-500/50"
                  : "bg-white border-gray-200 hover:border-blue-500/50"
              } ${
                hoveredCard === car.id
                  ? "transform -translate-y-4 scale-105"
                  : ""
              }`}
              onMouseEnter={() => setHoveredCard(car.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Image Container */}
              <div
                className={`relative h-56 flex items-center justify-center overflow-hidden ${
                  isDarkMode
                    ? "bg-gradient-to-br from-slate-800 to-slate-900"
                    : "bg-gradient-to-br from-blue-50 to-purple-50"
                }`}
              >
                <div className="text-9xl group-hover:scale-125 transition-transform duration-500">
                  {car.image}
                </div>

                {/* Badge */}
                {car.badge && (
                  <div
                    className={`absolute top-6 left-6 px-4 py-2 rounded-full text-xs font-black shadow-lg ${
                      isDarkMode
                        ? "bg-gradient-to-r from-yellow-500 to-orange-600 text-white"
                        : "bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900"
                    }`}
                  >
                    {car.badge}
                  </div>
                )}

                {/* Favorite Button */}
                <button
                  className={`absolute top-6 right-6 w-12 h-12 rounded-full flex items-center justify-center shadow-xl backdrop-blur-sm transition-all duration-200 group/fav ${
                    isDarkMode
                      ? "bg-slate-900/50 hover:bg-red-500"
                      : "bg-white/80 hover:bg-red-50"
                  }`}
                >
                  <FiHeart
                    className={`text-xl transition-colors ${
                      isDarkMode
                        ? "text-slate-400 group-hover/fav:text-white"
                        : "text-gray-400 group-hover/fav:text-red-500"
                    }`}
                  />
                </button>

                {/* Condition Badge */}
                <div
                  className={`absolute bottom-6 left-6 px-4 py-2 rounded-full text-xs font-bold backdrop-blur-md ${
                    isDarkMode
                      ? "bg-slate-900/50 text-cyan-400 border border-cyan-500/30"
                      : "bg-white/90 text-gray-700 border border-gray-200"
                  }`}
                >
                  {car.condition}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3
                  className={`font-black text-xl mb-3 transition-colors ${
                    isDarkMode
                      ? "text-white group-hover:text-cyan-400"
                      : "text-gray-900 group-hover:text-blue-600"
                  }`}
                >
                  {car.name}
                </h3>

                <div
                  className={`flex items-center text-sm mb-6 gap-6 ${
                    isDarkMode ? "text-slate-400" : "text-gray-500"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <FiCalendar />
                    {car.year}
                  </span>
                  <span className="flex items-center gap-2">
                    <FiMapPin />
                    {car.location}
                  </span>
                </div>

                {/* Specs */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {[
                    { label: "Jarak", value: car.mileage },
                    { label: "Transmisi", value: car.transmission },
                    { label: "BBM", value: car.fuel },
                  ].map((spec, index) => (
                    <div
                      key={index}
                      className={`text-center p-3 rounded-xl ${
                        isDarkMode ? "bg-slate-800" : "bg-gray-50"
                      }`}
                    >
                      <div
                        className={`text-xs font-bold mb-1 ${
                          isDarkMode ? "text-slate-500" : "text-gray-500"
                        }`}
                      >
                        {spec.label}
                      </div>
                      <div
                        className={`text-xs font-black ${
                          isDarkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {spec.value}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Price & Action */}
                <div
                  className={`flex items-center justify-between pt-6 border-t-2 ${
                    isDarkMode ? "border-slate-800" : "border-gray-100"
                  }`}
                >
                  <div>
                    <div
                      className={`text-xs font-bold mb-1 ${
                        isDarkMode ? "text-slate-500" : "text-gray-500"
                      }`}
                    >
                      Harga
                    </div>
                    <div
                      className={`text-2xl font-black ${
                        isDarkMode ? "text-cyan-400" : "text-blue-600"
                      }`}
                    >
                      {formatPrice(car.price)}
                    </div>
                  </div>
                  <button
                    className={`px-6 py-3 rounded-2xl font-bold transition-all duration-200 shadow-lg ${
                      isDarkMode
                        ? "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-cyan-500/30"
                        : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-blue-500/30"
                    } hover:scale-110`}
                  >
                    Lihat
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center mt-16">
          <button
            className={`px-10 py-4 rounded-2xl font-bold transition-all duration-200 inline-flex items-center space-x-3 border-2 ${
              isDarkMode
                ? "border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-white"
                : "border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
            } hover:scale-105 shadow-xl`}
          >
            <AiOutlineCar className="text-2xl" />
            <span>Lihat Lebih Banyak Mobil</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default SuperiorCarSection;
