"use client";

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
  const mainFeatures = [
    {
      id: 1,
      icon: <AiOutlineCar className="text-5xl" />,
      title: "Marketplace Mobil",
      description:
        "Ribuan pilihan mobil dari berbagai merek dan model dengan harga terbaik",
      features: [
        "10.000+ Unit Mobil",
        "Semua Merek Tersedia",
        "Harga Transparan",
      ],
      color: "blue",
      link: "/marketplace",
    },
    {
      id: 2,
      icon: <AiOutlineCalculator className="text-5xl" />,
      title: "Kalkulator Mobil",
      description:
        "Hitung simulasi kredit dan cicilan mobil impian Anda dengan mudah dan akurat",
      features: [
        "Simulasi Kredit Real-time",
        "Berbagai Skema DP",
        "Perbandingan Leasing",
      ],
      color: "green",
      link: "/kalkulator",
    },
    {
      id: 3,
      icon: <AiOutlineCheckCircle className="text-5xl" />,
      title: "Jasa Inspeksi",
      description:
        "Inspeksi profesional untuk memastikan kualitas mobil sebelum Anda membeli",
      features: [
        "150+ Poin Pemeriksaan",
        "Teknisi Bersertifikat",
        "Laporan Digital",
      ],
      color: "orange",
      link: "/inspeksi",
    },
  ];

  const benefits = [
    {
      icon: <FiShield />,
      title: "Aman & Terpercaya",
      desc: "Semua mobil terverifikasi",
    },
    {
      icon: <FiZap />,
      title: "Proses Cepat",
      desc: "Transaksi mudah & cepat",
    },
    {
      icon: <FiUsers />,
      title: "50K+ Pengguna",
      desc: "Dipercaya ribuan orang",
    },
    {
      icon: <FiAward />,
      title: "Rating 4.9/5",
      desc: "Kepuasan pelanggan",
    },
    {
      icon: <FiTrendingUp />,
      title: "Harga Kompetitif",
      desc: "Harga terbaik di pasaran",
    },
    {
      icon: <FiClock />,
      title: "Support 24/7",
      desc: "Layanan pelanggan siaga",
    },
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<
      string,
      { bg: string; hover: string; text: string; border: string }
    > = {
      blue: {
        bg: "from-blue-500 to-blue-700",
        hover: "hover:from-blue-600 hover:to-blue-800",
        text: "text-blue-600",
        border: "border-blue-200",
      },
      green: {
        bg: "from-green-500 to-green-700",
        hover: "hover:from-green-600 hover:to-green-800",
        text: "text-green-600",
        border: "border-green-200",
      },
      orange: {
        bg: "from-orange-500 to-orange-700",
        hover: "hover:from-orange-600 hover:to-orange-800",
        text: "text-orange-600",
        border: "border-orange-200",
      },
    };
    return colors[color];
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-block mb-4">
            <span className="px-4 py-2 bg-purple-100 text-purple-600 rounded-full text-sm font-semibold">
              Fitur Unggulan
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Solusi Lengkap untuk Kebutuhan Otomotif Anda
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Platform all-in-one untuk jual beli mobil, simulasi kredit, dan
            inspeksi kendaraan
          </p>
        </div>

        {/* Main Features Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {mainFeatures.map((feature) => {
            const colors = getColorClasses(feature.color);
            return (
              <div
                key={feature.id}
                className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group hover:-translate-y-2"
              >
                {/* Header with Gradient */}
                <div className={`bg-linear-to-r ${colors.bg} p-6 text-white`}>
                  <div className="flex justify-center mb-4 group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-center mb-2">
                    {feature.title}
                  </h3>
                </div>

                {/* Content */}
                <div className="p-6">
                  <p className="text-gray-600 text-center mb-6">
                    {feature.description}
                  </p>

                  {/* Feature List */}
                  <ul className="space-y-3 mb-6">
                    {feature.features.map((item, index) => (
                      <li key={index} className="flex items-center text-sm">
                        <div
                          className={`w-5 h-5 rounded-full ${colors.text} bg-opacity-10 flex items-center justify-center mr-3 shrink-0`}
                        >
                          <span className="text-xs">✓</span>
                        </div>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <button
                    className={`w-full bg-linear-to-r ${colors.bg} ${colors.hover} text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105`}
                  >
                    Explore Sekarang
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Benefits Grid */}
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-10">
            Mengapa Memilih CarMediator?
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="text-center group hover:transform hover:-translate-y-2 transition-all duration-300"
              >
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-3 text-2xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  {benefit.icon}
                </div>
                <h4 className="font-bold text-sm text-gray-900 mb-1">
                  {benefit.title}
                </h4>
                <p className="text-xs text-gray-600">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Banner */}
        <div className="mt-16 bg-linear-to-r from-blue-600 via-blue-700 to-blue-900 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-300 rounded-full blur-3xl"></div>
          </div>

          <div className="relative z-10 text-center max-w-3xl mx-auto">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              Siap Menemukan Mobil Impian Anda?
            </h3>
            <p className="text-xl text-blue-100 mb-8">
              Bergabunglah dengan ribuan pengguna yang sudah menemukan mobil
              terbaik mereka
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-blue-600 hover:bg-blue-50 font-bold py-4 px-8 rounded-lg transition-colors inline-flex items-center justify-center space-x-2">
                <AiOutlineCar className="text-xl" />
                <span>Lihat Mobil</span>
              </button>
              <button className="bg-yellow-400 text-gray-900 hover:bg-yellow-300 font-bold py-4 px-8 rounded-lg transition-colors inline-flex items-center justify-center space-x-2">
                <AiOutlineCalculator className="text-xl" />
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
