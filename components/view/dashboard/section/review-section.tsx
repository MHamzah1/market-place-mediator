"use client";

import { useTheme } from "@/context/ThemeContext";
import React, { useState } from "react";
import { FiStar, FiChevronLeft, FiChevronRight } from "react-icons/fi";

const ReviewSection = () => {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  const [currentSlide, setCurrentSlide] = useState(0);

  const reviews = [
    {
      id: 1,
      name: "Budi Santoso",
      role: "Pembeli Mobil",
      image: "👨",
      rating: 5,
      date: "2 minggu yang lalu",
      review:
        "Pengalaman membeli mobil di CarMediator sangat memuaskan! Prosesnya cepat, transparan, dan tim inspeksinya sangat profesional. Saya dapat mobil impian dengan harga yang sangat bagus.",
      car: "Toyota Avanza 2023",
    },
    {
      id: 2,
      name: "Siti Nurhaliza",
      role: "Pembeli Mobil",
      image: "👩",
      rating: 5,
      date: "1 bulan yang lalu",
      review:
        "Kalkulator kreditnya membantu banget! Saya bisa bandingkan berbagai skema cicilan sebelum memutuskan. Terima kasih CarMediator, sekarang punya Honda CR-V idaman!",
      car: "Honda CR-V 2022",
    },
    {
      id: 3,
      name: "Ahmad Fauzi",
      role: "Pengguna Jasa Inspeksi",
      image: "👨‍💼",
      rating: 5,
      date: "3 minggu yang lalu",
      review:
        "Jasa inspeksinya top! Detail banget laporannya sampai saya yakin beli mobilnya. Teknisinya ramah dan menjelaskan semua dengan detail. Highly recommended!",
      car: "Mitsubishi Xpander 2023",
    },
    {
      id: 4,
      name: "Rina Wijaya",
      role: "Pembeli Mobil",
      image: "👩‍💼",
      rating: 5,
      date: "1 minggu yang lalu",
      review:
        "Platform yang sangat user-friendly! Sebagai pembeli pertama kali, saya merasa sangat terbantu dengan panduan step-by-step dan customer service yang responsif.",
      car: "Suzuki Ertiga 2022",
    },
    {
      id: 5,
      name: "Dedy Prasetyo",
      role: "Pembeli Mobil",
      image: "👨‍🏫",
      rating: 5,
      date: "2 bulan yang lalu",
      review:
        "Harga transparannya yang saya suka! Tidak ada biaya tersembunyi dan prosesnya jelas. Tim support juga sangat membantu menjawab semua pertanyaan saya.",
      car: "Wuling Almaz 2023",
    },
    {
      id: 6,
      name: "Lisa Andini",
      role: "Pengguna Kalkulator",
      image: "👩‍⚕️",
      rating: 5,
      date: "3 minggu yang lalu",
      review:
        "Kalkulator kreditnya akurat dan mudah digunakan. Membantu saya merencanakan budget dengan baik sebelum beli mobil. Fitur yang sangat berguna!",
      car: "Daihatsu Terios 2021",
    },
  ];

  const reviewsPerPage = 3;
  const totalSlides = Math.ceil(reviews.length / reviewsPerPage);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const getCurrentReviews = () => {
    const start = currentSlide * reviewsPerPage;
    return reviews.slice(start, start + reviewsPerPage);
  };

  const stats = [
    {
      value: "4.9/5",
      label: "Rating Rata-rata",
      icon: "⭐",
      gradient: "from-yellow-500 to-orange-600",
    },
    {
      value: "10,000+",
      label: "Review Positif",
      icon: "💬",
      gradient: "from-blue-500 to-cyan-600",
    },
    {
      value: "98%",
      label: "Tingkat Kepuasan",
      icon: "😊",
      gradient: "from-green-500 to-emerald-600",
    },
    {
      value: "50,000+",
      label: "Pengguna Aktif",
      icon: "👥",
      gradient: "from-purple-500 to-pink-600",
    },
  ];

  return (
    <section
      className={`py-20 transition-colors duration-300 ${
        isDarkMode ? "bg-slate-900" : "bg-white"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-block mb-6">
            <span
              className={`px-6 py-3 rounded-full text-sm font-bold border-2 ${
                isDarkMode
                  ? "bg-yellow-500/10 border-yellow-500/30 text-yellow-400"
                  : "bg-yellow-100 border-yellow-200 text-yellow-700"
              }`}
            >
              ⭐ Testimoni Pelanggan
            </span>
          </div>
          <h2
            className={`text-4xl md:text-5xl font-black mb-6 ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Apa Kata Mereka Tentang Kami?
          </h2>
          <p
            className={`text-xl max-w-2xl mx-auto ${
              isDarkMode ? "text-slate-400" : "text-gray-600"
            }`}
          >
            Ribuan pelanggan puas telah menemukan mobil impian mereka bersama
            CarMediator
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`rounded-3xl p-8 text-center transition-all duration-500 hover:scale-110 hover:-rotate-3 shadow-2xl ${
                isDarkMode
                  ? "bg-gradient-to-br from-slate-800 to-slate-900"
                  : `bg-gradient-to-br ${stat.gradient}`
              }`}
            >
              <div className="text-5xl mb-4 animate-bounce">{stat.icon}</div>
              <div
                className={`text-4xl font-black mb-2 ${
                  isDarkMode ? "text-white" : "text-white"
                }`}
              >
                {stat.value}
              </div>
              <div
                className={`text-sm font-bold ${
                  isDarkMode ? "text-slate-400" : "text-white/80"
                }`}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Reviews Carousel */}
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {getCurrentReviews().map((review) => (
              <div
                key={review.id}
                className={`rounded-3xl p-8 shadow-2xl transition-all duration-500 hover:-translate-y-2 flex flex-col border-2 ${
                  isDarkMode
                    ? "bg-slate-800 border-slate-700 hover:border-cyan-500/50"
                    : "bg-white border-gray-100 hover:border-blue-500/50"
                }`}
              >
                {/* Rating Stars */}
                <div className="flex items-center mb-6">
                  {[...Array(review.rating)].map((_, i) => (
                    <FiStar
                      key={i}
                      className="text-yellow-400 fill-yellow-400 text-xl mr-1"
                    />
                  ))}
                </div>

                {/* Review Text */}
                <p
                  className={`mb-8 grow leading-relaxed ${
                    isDarkMode ? "text-slate-300" : "text-gray-700"
                  }`}
                >
                  &ldquo;{review.review}&rdquo;
                </p>

                {/* Car Info */}
                <div
                  className={`mb-6 p-4 rounded-2xl ${
                    isDarkMode
                      ? "bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border-2 border-cyan-500/20"
                      : "bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-100"
                  }`}
                >
                  <div
                    className={`text-xs font-bold mb-2 ${
                      isDarkMode ? "text-cyan-400" : "text-blue-600"
                    }`}
                  >
                    Mobil yang dibeli:
                  </div>
                  <div
                    className={`text-sm font-black ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {review.car}
                  </div>
                </div>

                {/* Reviewer Info */}
                <div
                  className={`flex items-center justify-between pt-6 border-t-2 ${
                    isDarkMode ? "border-slate-700" : "border-gray-100"
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl ${
                        isDarkMode
                          ? "bg-gradient-to-br from-cyan-500 to-blue-600"
                          : "bg-gradient-to-br from-blue-500 to-purple-600"
                      }`}
                    >
                      {review.image}
                    </div>
                    <div>
                      <div
                        className={`font-black ${
                          isDarkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {review.name}
                      </div>
                      <div
                        className={`text-xs ${
                          isDarkMode ? "text-slate-500" : "text-gray-500"
                        }`}
                      >
                        {review.role}
                      </div>
                    </div>
                  </div>
                  <div
                    className={`text-xs ${
                      isDarkMode ? "text-slate-500" : "text-gray-400"
                    }`}
                  >
                    {review.date}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-center space-x-6">
            <button
              onClick={prevSlide}
              disabled={currentSlide === 0}
              className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-xl ${
                isDarkMode
                  ? "bg-slate-800 hover:bg-gradient-to-r hover:from-cyan-500 hover:to-blue-600 border-2 border-slate-700 disabled:opacity-30"
                  : "bg-white hover:bg-gradient-to-r hover:from-blue-600 hover:to-blue-700 border-2 border-gray-200 disabled:opacity-30"
              } hover:scale-110 disabled:hover:scale-100`}
            >
              <FiChevronLeft
                className={`text-2xl ${
                  isDarkMode ? "text-slate-400" : "text-gray-600"
                } group-hover:text-white`}
              />
            </button>

            {/* Dots Indicator */}
            <div className="flex space-x-3">
              {[...Array(totalSlides)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-3 rounded-full transition-all duration-300 ${
                    currentSlide === index
                      ? isDarkMode
                        ? "w-12 bg-gradient-to-r from-cyan-500 to-blue-600"
                        : "w-12 bg-gradient-to-r from-blue-600 to-blue-700"
                      : isDarkMode
                      ? "w-3 bg-slate-700 hover:bg-slate-600"
                      : "w-3 bg-gray-300 hover:bg-gray-400"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={nextSlide}
              disabled={currentSlide === totalSlides - 1}
              className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-xl ${
                isDarkMode
                  ? "bg-slate-800 hover:bg-gradient-to-r hover:from-cyan-500 hover:to-blue-600 border-2 border-slate-700 disabled:opacity-30"
                  : "bg-white hover:bg-gradient-to-r hover:from-blue-600 hover:to-blue-700 border-2 border-gray-200 disabled:opacity-30"
              } hover:scale-110 disabled:hover:scale-100`}
            >
              <FiChevronRight
                className={`text-2xl ${
                  isDarkMode ? "text-slate-400" : "text-gray-600"
                } group-hover:text-white`}
              />
            </button>
          </div>
        </div>

        {/* Trust Badges */}
        <div
          className={`mt-20 rounded-3xl p-10 md:p-16 ${
            isDarkMode
              ? "bg-gradient-to-r from-slate-800 to-slate-900"
              : "bg-gradient-to-r from-gray-50 to-blue-50"
          }`}
        >
          <div className="text-center mb-12">
            <h3
              className={`text-3xl font-black mb-4 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Dipercaya Oleh
            </h3>
            <p className={isDarkMode ? "text-slate-400" : "text-gray-600"}>
              Partner dan pelanggan dari berbagai kalangan
            </p>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-6">
            {[
              "🏢 Perusahaan",
              "👨‍👩‍👧‍👦 Keluarga",
              "🚕 Driver",
              "👔 Profesional",
              "🎓 Mahasiswa",
            ].map((badge, index) => (
              <div
                key={index}
                className={`px-8 py-4 rounded-2xl font-bold transition-all duration-300 hover:scale-110 shadow-xl ${
                  isDarkMode
                    ? "bg-slate-900 text-white hover:bg-gradient-to-r hover:from-cyan-500 hover:to-blue-600"
                    : "bg-white text-gray-700 hover:bg-gradient-to-r hover:from-blue-600 hover:to-blue-700 hover:text-white"
                }`}
              >
                {badge}
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <p
            className={`text-xl mb-8 ${
              isDarkMode ? "text-slate-400" : "text-gray-600"
            }`}
          >
            Siap bergabung dengan ribuan pelanggan puas kami?
          </p>
          <button
            className={`px-12 py-5 rounded-2xl font-black transition-all duration-300 inline-flex items-center space-x-3 shadow-2xl hover:scale-110 ${
              isDarkMode
                ? "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-cyan-500/30"
                : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-blue-500/30"
            }`}
          >
            <span>Mulai Sekarang</span>
            <span className="text-2xl">→</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default ReviewSection;
