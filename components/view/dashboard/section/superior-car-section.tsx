"use client";

import React, { useState } from "react";
import { FiHeart, FiMapPin, FiCalendar } from "react-icons/fi";
import { AiOutlineCar } from "react-icons/ai";

const SuperiorCarSection = () => {
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
    {
      id: 2,
      name: "Honda CR-V 1.5 Turbo",
      year: 2022,
      price: 425000000,
      location: "Tangerang",
      mileage: "25.000 km",
      transmission: "Automatic",
      fuel: "Bensin",
      image: "🚙",
      condition: "Istimewa",
      badge: "Rekomendasi",
    },
    {
      id: 3,
      name: "Mitsubishi Xpander Ultimate",
      year: 2023,
      price: 265000000,
      location: "Bandung",
      mileage: "10.000 km",
      transmission: "Automatic",
      fuel: "Bensin",
      image: "🚐",
      condition: "Seperti Baru",
      badge: "Terlaris",
    },
    {
      id: 4,
      name: "Suzuki Ertiga Sport",
      year: 2022,
      price: 215000000,
      location: "Jakarta Timur",
      mileage: "30.000 km",
      transmission: "Manual",
      fuel: "Bensin",
      image: "🚗",
      condition: "Baik",
      badge: null,
    },
    {
      id: 5,
      name: "Daihatsu Terios R MT",
      year: 2021,
      price: 195000000,
      location: "Bekasi",
      mileage: "40.000 km",
      transmission: "Manual",
      fuel: "Bensin",
      image: "🚙",
      condition: "Terawat",
      badge: null,
    },
    {
      id: 6,
      name: "Wuling Almaz RS Pro",
      year: 2023,
      price: 355000000,
      location: "Surabaya",
      mileage: "8.000 km",
      transmission: "Automatic",
      fuel: "Bensin",
      image: "🚐",
      condition: "Istimewa",
      badge: "Baru",
    },
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-block mb-4">
            <span className="px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold">
              Mobil Unggulan
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Pilihan Mobil Terbaik
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Koleksi mobil berkualitas dengan harga terjangkau, sudah diinspeksi
            dan siap pakai
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {["Semua", "SUV", "MPV", "Sedan", "Hatchback", "Sport"].map(
            (filter) => (
              <button
                key={filter}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-200 ${
                  filter === "Semua"
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                    : "bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 border border-gray-200"
                }`}
              >
                {filter}
              </button>
            )
          )}
        </div>

        {/* Cars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cars.map((car) => (
            <div
              key={car.id}
              className={`bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden group cursor-pointer ${
                hoveredCard === car.id ? "transform -translate-y-2" : ""
              }`}
              onMouseEnter={() => setHoveredCard(car.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Image Container */}
              <div className="relative h-48 bg-linear-to-br from-blue-50 to-blue-100 flex items-center justify-center overflow-hidden">
                <div className="text-8xl group-hover:scale-110 transition-transform duration-300">
                  {car.image}
                </div>

                {/* Badge */}
                {car.badge && (
                  <div className="absolute top-4 left-4 bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-xs font-bold">
                    {car.badge}
                  </div>
                )}

                {/* Favorite Button */}
                <button className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-50 transition-colors group/fav">
                  <FiHeart className="text-gray-400 group-hover/fav:text-red-500 transition-colors" />
                </button>

                {/* Condition Badge */}
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-gray-700">
                  {car.condition}
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {car.name}
                </h3>

                <div className="flex items-center text-sm text-gray-500 mb-4 space-x-4">
                  <span className="flex items-center">
                    <FiCalendar className="mr-1" />
                    {car.year}
                  </span>
                  <span className="flex items-center">
                    <FiMapPin className="mr-1" />
                    {car.location}
                  </span>
                </div>

                {/* Specs */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="text-center p-2 bg-gray-50 rounded-lg">
                    <div className="text-xs text-gray-500">Jarak</div>
                    <div className="text-xs font-semibold text-gray-900">
                      {car.mileage}
                    </div>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded-lg">
                    <div className="text-xs text-gray-500">Transmisi</div>
                    <div className="text-xs font-semibold text-gray-900">
                      {car.transmission}
                    </div>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded-lg">
                    <div className="text-xs text-gray-500">Bahan Bakar</div>
                    <div className="text-xs font-semibold text-gray-900">
                      {car.fuel}
                    </div>
                  </div>
                </div>

                {/* Price & Action */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Harga</div>
                    <div className="text-xl font-bold text-blue-600">
                      {formatPrice(car.price)}
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors text-sm">
                    Lihat Detail
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center mt-12">
          <button className="px-8 py-3 bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg font-semibold transition-colors duration-200 inline-flex items-center space-x-2">
            <AiOutlineCar className="text-xl" />
            <span>Lihat Lebih Banyak Mobil</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default SuperiorCarSection;
