"use client";

import React from "react";
import { FiSearch, FiMapPin } from "react-icons/fi";
import { AiOutlineCar } from "react-icons/ai";

const HeaderBeranda = () => {
  return (
    <section className="relative bg-linear-to-r from-blue-600 via-blue-700 to-blue-900 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-300 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6 animate-fade-in-up">
            <div className="inline-block">
              <span className="px-4 py-2 bg-blue-500/30 backdrop-blur-sm rounded-full text-sm font-medium border border-white/20">
                \ud83c\udf89 Platform Marketplace Mobil Terpercaya
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Temukan Mobil
              <span className="block text-yellow-300">Impian Anda</span>
            </h1>

            <p className="text-lg md:text-xl text-blue-100 max-w-xl">
              Ribuan pilihan mobil berkualitas dengan harga terbaik. Dilengkapi
              jasa inspeksi profesional dan kalkulator pembiayaan.
            </p>

            {/* Search Box */}
            <div className="bg-white rounded-2xl p-4 shadow-2xl">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Cari merek atau model..."
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                  />
                </div>

                <div className="relative">
                  <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <select className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 appearance-none bg-white">
                    <option>Semua Lokasi</option>
                    <option>Jakarta</option>
                    <option>Bandung</option>
                    <option>Surabaya</option>
                    <option>Medan</option>
                  </select>
                </div>

                <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2">
                  <FiSearch />
                  <span>Cari Mobil</span>
                </button>
              </div>

              {/* Quick Filters */}
              <div className="flex flex-wrap gap-2 mt-4">
                <span className="text-xs text-gray-500 font-medium">
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
                    className="px-3 py-1 text-xs bg-gray-100 hover:bg-blue-50 text-gray-700 hover:text-blue-600 rounded-full transition-colors"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-4">
              <div className="text-center md:text-left">
                <div className="text-3xl font-bold">10K+</div>
                <div className="text-blue-200 text-sm">Mobil Tersedia</div>
              </div>
              <div className="text-center md:text-left">
                <div className="text-3xl font-bold">50K+</div>
                <div className="text-blue-200 text-sm">Pengguna</div>
              </div>
              <div className="text-center md:text-left">
                <div className="text-3xl font-bold">4.9</div>
                <div className="text-blue-200 text-sm">Rating ⭐</div>
              </div>
            </div>
          </div>

          {/* Right Content - Car Image */}
          <div className="relative hidden lg:block animate-fade-in-right">
            <div className="relative">
              {/* Floating Cards */}
              <div className="absolute -top-4 -right-4 bg-white rounded-xl shadow-xl p-4 animate-bounce-slow">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">\u2705</span>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Inspeksi</div>
                    <div className="text-sm font-bold text-gray-800">
                      Terpercaya
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-xl p-4 animate-bounce-slow delay-200">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">\ud83d\udcb0</span>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Harga</div>
                    <div className="text-sm font-bold text-gray-800">
                      Terjangkau
                    </div>
                  </div>
                </div>
              </div>

              {/* Car Illustration Placeholder */}
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
                <div className="flex items-center justify-center h-80">
                  <AiOutlineCar className="text-white/50 text-9xl" />
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
        >
          <path
            fill="#f9fafb"
            fillOpacity="1"
            d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
          ></path>
        </svg>
      </div>
    </section>
  );
};

export default HeaderBeranda;
