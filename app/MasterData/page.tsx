"use client";

import React, { useState, useEffect } from "react";
import {
  FiTrendingUp,
  FiUsers,
  FiShoppingCart,
  FiDollarSign,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiEye,
  FiFilter,
} from "react-icons/fi";
import {
  BsCarFrontFill,
  BsFuelPump,
  BsGearFill,
  BsSpeedometer2,
} from "react-icons/bs";

const Page = () => {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme");
      return savedTheme === "dark";
    }
    return true;
  });

  // Sync with theme from localStorage
  useEffect(() => {
    // Listen for theme changes
    const handleStorageChange = () => {
      const theme = localStorage.getItem("theme");
      setIsDarkMode(theme === "dark");
    };

    window.addEventListener("storage", handleStorageChange);

    // Poll for changes (since storage event doesn't fire in same tab)
    const interval = setInterval(() => {
      const theme = localStorage.getItem("theme");
      setIsDarkMode(theme === "dark");
    }, 100);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  // Statistics data
  const stats = [
    {
      label: "Total Mobil",
      value: "248",
      change: "+12%",
      trend: "up",
      icon: BsCarFrontFill,
      color: "from-cyan-500 to-blue-600",
      bgColor: "bg-cyan-500/10",
    },
    {
      label: "Transaksi Bulan Ini",
      value: "156",
      change: "+23%",
      trend: "up",
      icon: FiShoppingCart,
      color: "from-green-500 to-emerald-600",
      bgColor: "bg-green-500/10",
    },
    {
      label: "Total Revenue",
      value: "Rp 4.2M",
      change: "+18%",
      trend: "up",
      icon: FiDollarSign,
      color: "from-yellow-500 to-orange-600",
      bgColor: "bg-yellow-500/10",
    },
    {
      label: "Active Customers",
      value: "1,243",
      change: "+8%",
      trend: "up",
      icon: FiUsers,
      color: "from-purple-500 to-pink-600",
      bgColor: "bg-purple-500/10",
    },
  ];

  // Master data mobil
  const masterData = [
    {
      id: 1,
      name: "Toyota Fortuner VRZ",
      brand: "Toyota",
      year: 2023,
      price: "Rp 650.000.000",
      stock: 5,
      type: "SUV",
      fuel: "Diesel",
      transmission: "Automatic",
      mileage: "12.000 km",
      image: "🚙",
      color: "Putih",
      status: "Available",
    },
    {
      id: 2,
      name: "Honda CR-V Turbo",
      brand: "Honda",
      year: 2023,
      price: "Rp 580.000.000",
      stock: 3,
      type: "SUV",
      fuel: "Bensin",
      transmission: "CVT",
      mileage: "8.500 km",
      image: "🚗",
      color: "Hitam",
      status: "Available",
    },
    {
      id: 3,
      name: "Mitsubishi Pajero Sport",
      brand: "Mitsubishi",
      year: 2022,
      price: "Rp 525.000.000",
      stock: 2,
      type: "SUV",
      fuel: "Diesel",
      transmission: "Automatic",
      mileage: "25.000 km",
      image: "🚙",
      color: "Silver",
      status: "Low Stock",
    },
    {
      id: 4,
      name: "BMW X5 M Sport",
      brand: "BMW",
      year: 2023,
      price: "Rp 1.450.000.000",
      stock: 1,
      type: "Luxury SUV",
      fuel: "Bensin",
      transmission: "Automatic",
      mileage: "5.000 km",
      image: "🚙",
      color: "Biru",
      status: "Available",
    },
    {
      id: 5,
      name: "Mercedes-Benz GLC 200",
      brand: "Mercedes",
      year: 2023,
      price: "Rp 1.250.000.000",
      stock: 2,
      type: "Luxury SUV",
      fuel: "Bensin",
      transmission: "Automatic",
      mileage: "3.200 km",
      image: "🚗",
      color: "Putih",
      status: "Available",
    },
    {
      id: 6,
      name: "Mazda CX-5 Elite",
      brand: "Mazda",
      year: 2023,
      price: "Rp 485.000.000",
      stock: 4,
      type: "SUV",
      fuel: "Bensin",
      transmission: "Automatic",
      mileage: "10.000 km",
      image: "🚙",
      color: "Merah",
      status: "Available",
    },
  ];

  const brands = [
    "All",
    "Toyota",
    "Honda",
    "Mitsubishi",
    "BMW",
    "Mercedes",
    "Mazda",
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black tracking-tight bg-linear-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2">
            Dashboard Master Data
          </h1>
          <p
            className={`text-lg ${
              isDarkMode ? "text-slate-400" : "text-slate-600"
            }`}
          >
            Kelola data mobil dan monitoring marketplace Anda
          </p>
        </div>
        <button className="px-6 py-3 bg-linear-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 rounded-xl font-semibold flex items-center gap-2 transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/50">
          <FiPlus className="text-xl" />
          Tambah Mobil Baru
        </button>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`relative group overflow-hidden rounded-2xl backdrop-blur-sm border p-6 transition-all duration-300 hover:scale-105 ${
              isDarkMode
                ? "bg-slate-800/50 border-slate-700/50 hover:border-cyan-500/50"
                : "bg-white border-slate-200 hover:border-cyan-500/50 shadow-lg"
            }`}
          >
            {/* Animated background gradient */}
            <div
              className={`absolute inset-0 bg-linear-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
            ></div>

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center`}
                >
                  <stat.icon className="text-2xl text-white" />
                </div>
                <div className="flex items-center gap-1 text-green-400 text-sm font-semibold">
                  <FiTrendingUp className="text-lg" />
                  {stat.change}
                </div>
              </div>
              <h3
                className={`text-3xl font-black mb-1 ${
                  isDarkMode ? "text-white" : "text-slate-900"
                }`}
              >
                {stat.value}
              </h3>
              <p
                className={`text-sm font-medium ${
                  isDarkMode ? "text-slate-400" : "text-slate-600"
                }`}
              >
                {stat.label}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Filter & Search Section */}
      <div
        className={`backdrop-blur-sm border rounded-2xl p-6 ${
          isDarkMode
            ? "bg-slate-800/50 border-slate-700/50"
            : "bg-white border-slate-200 shadow-lg"
        }`}
      >
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <FiFilter className="text-cyan-400 text-xl" />
            <span
              className={`font-semibold ${
                isDarkMode ? "text-slate-300" : "text-slate-700"
              }`}
            >
              Filter Brand:
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {brands.map((brand) => (
              <button
                key={brand}
                onClick={() => setSelectedFilter(brand.toLowerCase())}
                className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                  selectedFilter === brand.toLowerCase()
                    ? "bg-linear-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30"
                    : isDarkMode
                    ? "bg-slate-700/50 text-slate-300 hover:bg-slate-700"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {brand}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Master Data Table */}
      <div
        className={`backdrop-blur-sm border rounded-2xl overflow-hidden ${
          isDarkMode
            ? "bg-slate-800/50 border-slate-700/50"
            : "bg-white border-slate-200 shadow-lg"
        }`}
      >
        <div
          className={`p-6 border-b ${
            isDarkMode ? "border-slate-700/50" : "border-slate-200"
          }`}
        >
          <h2
            className={`text-2xl font-black flex items-center gap-3 ${
              isDarkMode ? "text-white" : "text-slate-900"
            }`}
          >
            <BsCarFrontFill className="text-cyan-400" />
            Master Data Mobil
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr
                className={`border-b ${
                  isDarkMode
                    ? "bg-slate-900/50 border-slate-700/50"
                    : "bg-slate-50 border-slate-200"
                }`}
              >
                <th
                  className={`px-6 py-4 text-left text-xs font-bold uppercase tracking-wider ${
                    isDarkMode ? "text-slate-400" : "text-slate-600"
                  }`}
                >
                  Mobil
                </th>
                <th
                  className={`px-6 py-4 text-left text-xs font-bold uppercase tracking-wider ${
                    isDarkMode ? "text-slate-400" : "text-slate-600"
                  }`}
                >
                  Spesifikasi
                </th>
                <th
                  className={`px-6 py-4 text-left text-xs font-bold uppercase tracking-wider ${
                    isDarkMode ? "text-slate-400" : "text-slate-600"
                  }`}
                >
                  Detail
                </th>
                <th
                  className={`px-6 py-4 text-left text-xs font-bold uppercase tracking-wider ${
                    isDarkMode ? "text-slate-400" : "text-slate-600"
                  }`}
                >
                  Harga
                </th>
                <th
                  className={`px-6 py-4 text-left text-xs font-bold uppercase tracking-wider ${
                    isDarkMode ? "text-slate-400" : "text-slate-600"
                  }`}
                >
                  Stock
                </th>
                <th
                  className={`px-6 py-4 text-left text-xs font-bold uppercase tracking-wider ${
                    isDarkMode ? "text-slate-400" : "text-slate-600"
                  }`}
                >
                  Status
                </th>
                <th
                  className={`px-6 py-4 text-left text-xs font-bold uppercase tracking-wider ${
                    isDarkMode ? "text-slate-400" : "text-slate-600"
                  }`}
                >
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody
              className={`divide-y ${
                isDarkMode ? "divide-slate-700/50" : "divide-slate-200"
              }`}
            >
              {masterData.map((car, index) => (
                <tr
                  key={car.id}
                  className={`transition-colors group ${
                    isDarkMode ? "hover:bg-slate-700/30" : "hover:bg-slate-50"
                  }`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-16 h-16 rounded-xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform ${
                          isDarkMode
                            ? "bg-linear-to-br from-slate-700 to-slate-800"
                            : "bg-linear-to-br from-slate-100 to-slate-200"
                        }`}
                      >
                        {car.image}
                      </div>
                      <div>
                        <h3
                          className={`font-bold mb-1 ${
                            isDarkMode ? "text-white" : "text-slate-900"
                          }`}
                        >
                          {car.name}
                        </h3>
                        <p
                          className={`text-sm ${
                            isDarkMode ? "text-slate-400" : "text-slate-600"
                          }`}
                        >
                          {car.brand} • {car.year}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <BsGearFill className="text-cyan-400" />
                        <span
                          className={
                            isDarkMode ? "text-slate-300" : "text-slate-700"
                          }
                        >
                          {car.transmission}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <BsFuelPump className="text-green-400" />
                        <span
                          className={
                            isDarkMode ? "text-slate-300" : "text-slate-700"
                          }
                        >
                          {car.fuel}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1 text-sm">
                      <p
                        className={
                          isDarkMode ? "text-slate-300" : "text-slate-700"
                        }
                      >
                        <span
                          className={
                            isDarkMode ? "text-slate-500" : "text-slate-500"
                          }
                        >
                          Type:
                        </span>{" "}
                        {car.type}
                      </p>
                      <p
                        className={
                          isDarkMode ? "text-slate-300" : "text-slate-700"
                        }
                      >
                        <span
                          className={
                            isDarkMode ? "text-slate-500" : "text-slate-500"
                          }
                        >
                          Warna:
                        </span>{" "}
                        {car.color}
                      </p>
                      <div className="flex items-center gap-2">
                        <BsSpeedometer2 className="text-yellow-400" />
                        <span
                          className={
                            isDarkMode ? "text-slate-300" : "text-slate-700"
                          }
                        >
                          {car.mileage}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-lg text-cyan-400">
                      {car.price}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-center">
                      <span
                        className={`inline-block px-3 py-1 rounded-lg font-bold text-sm ${
                          car.stock > 3
                            ? "bg-green-500/20 text-green-400"
                            : "bg-orange-500/20 text-orange-400"
                        }`}
                      >
                        {car.stock} unit
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                        car.status === "Available"
                          ? "bg-green-500/20 text-green-400 border border-green-500/30"
                          : "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                      }`}
                    >
                      {car.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 transition-colors"
                        title="Lihat Detail"
                      >
                        <FiEye />
                      </button>
                      <button
                        className="p-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors"
                        title="Edit"
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                        title="Hapus"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div
          className={`p-6 border-t flex items-center justify-between ${
            isDarkMode ? "border-slate-700/50" : "border-slate-200"
          }`}
        >
          <p className="text-sm">
            <span className={isDarkMode ? "text-slate-400" : "text-slate-600"}>
              Menampilkan{" "}
            </span>
            <span
              className={`font-semibold ${
                isDarkMode ? "text-white" : "text-slate-900"
              }`}
            >
              1-6
            </span>
            <span className={isDarkMode ? "text-slate-400" : "text-slate-600"}>
              {" "}
              dari{" "}
            </span>
            <span
              className={`font-semibold ${
                isDarkMode ? "text-white" : "text-slate-900"
              }`}
            >
              248
            </span>
            <span className={isDarkMode ? "text-slate-400" : "text-slate-600"}>
              {" "}
              data mobil
            </span>
          </p>
          <div className="flex items-center gap-2">
            <button
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                isDarkMode
                  ? "bg-slate-700/50 text-slate-400 hover:bg-slate-700"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Previous
            </button>
            <button className="px-4 py-2 rounded-lg bg-linear-to-r from-cyan-500 to-blue-600 text-white font-semibold">
              1
            </button>
            <button
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                isDarkMode
                  ? "bg-slate-700/50 text-slate-300 hover:bg-slate-700"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              2
            </button>
            <button
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                isDarkMode
                  ? "bg-slate-700/50 text-slate-300 hover:bg-slate-700"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              3
            </button>
            <button
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                isDarkMode
                  ? "bg-slate-700/50 text-slate-300 hover:bg-slate-700"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          className={`rounded-2xl p-6 hover:scale-105 transition-transform cursor-pointer ${
            isDarkMode
              ? "bg-linear-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/30"
              : "bg-linear-to-br from-cyan-50 to-blue-50 border border-cyan-200 shadow-lg"
          }`}
        >
          <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center mb-4">
            <FiPlus className="text-2xl text-cyan-400" />
          </div>
          <h3
            className={`text-xl font-bold mb-2 ${
              isDarkMode ? "text-white" : "text-slate-900"
            }`}
          >
            Tambah Data Baru
          </h3>
          <p
            className={`text-sm ${
              isDarkMode ? "text-slate-400" : "text-slate-600"
            }`}
          >
            Input data mobil baru ke dalam sistem
          </p>
        </div>

        <div
          className={`rounded-2xl p-6 hover:scale-105 transition-transform cursor-pointer ${
            isDarkMode
              ? "bg-linear-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30"
              : "bg-linear-to-br from-green-50 to-emerald-50 border border-green-200 shadow-lg"
          }`}
        >
          <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mb-4">
            <FiShoppingCart className="text-2xl text-green-400" />
          </div>
          <h3
            className={`text-xl font-bold mb-2 ${
              isDarkMode ? "text-white" : "text-slate-900"
            }`}
          >
            Proses Transaksi
          </h3>
          <p
            className={`text-sm ${
              isDarkMode ? "text-slate-400" : "text-slate-600"
            }`}
          >
            Kelola transaksi penjualan mobil
          </p>
        </div>

        <div
          className={`rounded-2xl p-6 hover:scale-105 transition-transform cursor-pointer ${
            isDarkMode
              ? "bg-linear-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30"
              : "bg-linear-to-br from-purple-50 to-pink-50 border border-purple-200 shadow-lg"
          }`}
        >
          <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4">
            <FiUsers className="text-2xl text-purple-400" />
          </div>
          <h3
            className={`text-xl font-bold mb-2 ${
              isDarkMode ? "text-white" : "text-slate-900"
            }`}
          >
            Kelola Customer
          </h3>
          <p
            className={`text-sm ${
              isDarkMode ? "text-slate-400" : "text-slate-600"
            }`}
          >
            Manajemen data customer dan leads
          </p>
        </div>
      </div>
    </div>
  );
};

export default Page;
