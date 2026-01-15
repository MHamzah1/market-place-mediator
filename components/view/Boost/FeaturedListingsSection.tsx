"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/lib/state/store";
import { fetchFeaturedListings } from "@/lib/state/slice/boost/boostSlice";
import { useTheme } from "@/context/ThemeContext";
import Link from "next/link";
import {
  FiHeart,
  FiMapPin,
  FiCalendar,
  FiEye,
  FiArrowRight,
} from "react-icons/fi";
import { AiOutlineCar, AiOutlineWhatsApp } from "react-icons/ai";
import { BsSpeedometer2, BsFuelPump } from "react-icons/bs";
import { TbManualGearbox } from "react-icons/tb";
import FeaturedBadge from "./FeaturedBadge";

interface FeaturedListingsSectionProps {
  limit?: number;
  showViewAll?: boolean;
}

const FeaturedListingsSection: React.FC<FeaturedListingsSectionProps> = ({
  limit = 6,
  showViewAll = true,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  const { featuredListings, featuredLoading } = useSelector(
    (state: RootState) => state.boost
  );

  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("Semua");

  useEffect(() => {
    dispatch(fetchFeaturedListings({ limit }));
  }, [dispatch, limit]);

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

  const categories = ["Semua", "SUV", "MPV", "Sedan", "Hatchback", "Sport"];

  // Filter by category (mock - in real app this would be API filter)
  const filteredListings = featuredListings;

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
                  ? "bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-500/30 text-yellow-400"
                  : "bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200 text-yellow-600"
              }`}
            >
              ⭐ Mobil Unggulan
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
            Koleksi mobil berkualitas dengan eksposur tertinggi, dipilih oleh
            seller terpercaya
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-8 py-3 rounded-2xl font-bold transition-all duration-200 ${
                category === selectedCategory
                  ? isDarkMode
                    ? "bg-gradient-to-r from-yellow-500 to-orange-600 text-white shadow-xl shadow-yellow-500/30"
                    : "bg-gradient-to-r from-yellow-500 to-orange-600 text-white shadow-xl shadow-yellow-500/30"
                  : isDarkMode
                  ? "bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-yellow-400 border-2 border-slate-800"
                  : "bg-white text-gray-700 hover:bg-yellow-50 hover:text-yellow-600 border-2 border-gray-200"
              } hover:scale-105`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Loading */}
        {featuredLoading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-yellow-500 border-t-transparent"></div>
          </div>
        )}

        {/* Empty State */}
        {!featuredLoading && filteredListings.length === 0 && (
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
              Belum ada mobil unggulan
            </h3>
            <p className={isDarkMode ? "text-slate-400" : "text-gray-600"}>
              Mobil unggulan akan muncul di sini
            </p>
          </div>
        )}

        {/* Featured Cars Grid */}
        {!featuredLoading && filteredListings.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredListings.map((car) => (
              <Link
                key={car.id}
                href={`/marketplace/${car.id}`}
                className={`rounded-3xl shadow-2xl transition-all duration-300 overflow-hidden group cursor-pointer border-2 ${
                  isDarkMode
                    ? "bg-slate-900 border-slate-800 hover:border-yellow-500/50"
                    : "bg-white border-gray-200 hover:border-yellow-500/50"
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
                  className={`relative h-56 overflow-hidden ${
                    isDarkMode
                      ? "bg-gradient-to-br from-slate-800 to-slate-900"
                      : "bg-gradient-to-br from-yellow-50 to-orange-50"
                  }`}
                >
                  {car.images && car.images[0] ? (
                    <img
                      src={car.images[0]}
                      alt={`${car.carModel?.brand?.name} ${car.carModel?.modelName}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <span className="text-9xl group-hover:scale-125 transition-transform duration-500">
                        🚗
                      </span>
                    </div>
                  )}

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

                  {/* Featured Badge */}
                  <div className="absolute top-4 left-4">
                    <FeaturedBadge badge={car.featuredBadge || "Unggulan"} size="md" />
                  </div>

                  {/* Favorite Button */}
                  <button
                    onClick={(e) => e.preventDefault()}
                    className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center shadow-xl backdrop-blur-sm transition-all duration-200 group/fav ${
                      isDarkMode
                        ? "bg-slate-900/50 hover:bg-red-500"
                        : "bg-white/80 hover:bg-red-50"
                    }`}
                  >
                    <FiHeart
                      className={`text-lg transition-colors ${
                        isDarkMode
                          ? "text-slate-400 group-hover/fav:text-white"
                          : "text-gray-400 group-hover/fav:text-red-500"
                      }`}
                    />
                  </button>

                  {/* Views Badge */}
                  <div className="absolute bottom-4 right-4 flex items-center gap-1 px-3 py-1 bg-black/50 backdrop-blur-sm rounded-full text-white text-sm">
                    <FiEye />
                    <span>{car.viewCount}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3
                    className={`font-black text-xl mb-3 transition-colors ${
                      isDarkMode
                        ? "text-white group-hover:text-yellow-400"
                        : "text-gray-900 group-hover:text-yellow-600"
                    }`}
                  >
                    {car.carModel?.brand?.name} {car.carModel?.modelName}
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
                      {car.locationCity}
                    </span>
                  </div>

                  {/* Specs */}
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    <div
                      className={`text-center p-3 rounded-xl ${
                        isDarkMode ? "bg-slate-800" : "bg-gray-50"
                      }`}
                    >
                      <BsSpeedometer2
                        className={`text-lg mx-auto mb-1 ${
                          isDarkMode ? "text-yellow-400" : "text-yellow-500"
                        }`}
                      />
                      <div
                        className={`text-xs font-bold ${
                          isDarkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {formatMileage(car.mileage)}
                      </div>
                    </div>
                    <div
                      className={`text-center p-3 rounded-xl ${
                        isDarkMode ? "bg-slate-800" : "bg-gray-50"
                      }`}
                    >
                      <TbManualGearbox
                        className={`text-lg mx-auto mb-1 ${
                          isDarkMode ? "text-yellow-400" : "text-yellow-500"
                        }`}
                      />
                      <div
                        className={`text-xs font-bold capitalize ${
                          isDarkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {car.transmission === "automatic" ? "AT" : "MT"}
                      </div>
                    </div>
                    <div
                      className={`text-center p-3 rounded-xl ${
                        isDarkMode ? "bg-slate-800" : "bg-gray-50"
                      }`}
                    >
                      <BsFuelPump
                        className={`text-lg mx-auto mb-1 ${
                          isDarkMode ? "text-yellow-400" : "text-yellow-500"
                        }`}
                      />
                      <div
                        className={`text-xs font-bold capitalize ${
                          isDarkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {car.fuelType}
                      </div>
                    </div>
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
                          isDarkMode ? "text-yellow-400" : "text-yellow-600"
                        }`}
                      >
                        {formatPrice(car.price)}
                      </div>
                    </div>
                    <button
                      onClick={(e) => e.preventDefault()}
                      className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 transition-all"
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

        {/* View All Button */}
        {showViewAll && filteredListings.length > 0 && (
          <div className="text-center mt-16">
            <Link
              href="/marketplace"
              className={`px-10 py-4 rounded-2xl font-bold transition-all duration-200 inline-flex items-center space-x-3 border-2 ${
                isDarkMode
                  ? "border-yellow-500 text-yellow-400 hover:bg-yellow-500 hover:text-white"
                  : "border-yellow-500 text-yellow-600 hover:bg-yellow-500 hover:text-white"
              } hover:scale-105 shadow-xl`}
            >
              <AiOutlineCar className="text-2xl" />
              <span>Lihat Semua Mobil</span>
              <FiArrowRight />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedListingsSection;
