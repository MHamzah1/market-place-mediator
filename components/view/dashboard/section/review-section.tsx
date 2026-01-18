"use client";

import { useTheme } from "@/context/ThemeContext";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FiStar, FiChevronLeft, FiChevronRight } from "react-icons/fi";

const ReviewSection = () => {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  const [currentSlide, setCurrentSlide] = useState(0);

  const router = useRouter();

  const reviews = [
    {
      id: 1,
      name: "Budi Santoso",
      role: "Pembeli Mobil",
      image: "👨",
      rating: 5,
      date: "2 minggu lalu",
      review:
        "Pengalaman membeli mobil di CarMediator sangat memuaskan! Prosesnya cepat, transparan, dan tim inspeksinya sangat profesional.",
      car: "Toyota Avanza 2023",
    },
    {
      id: 2,
      name: "Siti Nurhaliza",
      role: "Pembeli Mobil",
      image: "👩",
      rating: 5,
      date: "1 bulan lalu",
      review:
        "Kalkulator kreditnya membantu banget! Saya bisa bandingkan berbagai skema cicilan sebelum memutuskan. Terima kasih CarMediator!",
      car: "Honda CR-V 2022",
    },
    {
      id: 3,
      name: "Ahmad Fauzi",
      role: "Pengguna Inspeksi",
      image: "👨‍💼",
      rating: 5,
      date: "3 minggu lalu",
      review:
        "Jasa inspeksinya top! Detail banget laporannya sampai saya yakin beli mobilnya. Teknisinya ramah dan profesional.",
      car: "Mitsubishi Xpander 2023",
    },
    {
      id: 4,
      name: "Rina Wijaya",
      role: "Pembeli Mobil",
      image: "👩‍💼",
      rating: 5,
      date: "1 minggu lalu",
      review:
        "Platform yang sangat user-friendly! Sebagai pembeli pertama kali, saya merasa sangat terbantu dengan panduan step-by-step.",
      car: "Suzuki Ertiga 2022",
    },
    {
      id: 5,
      name: "Dedy Prasetyo",
      role: "Pembeli Mobil",
      image: "👨‍🏫",
      rating: 5,
      date: "2 bulan lalu",
      review:
        "Harga transparannya yang saya suka! Tidak ada biaya tersembunyi dan prosesnya jelas. Tim support sangat membantu.",
      car: "Wuling Almaz 2023",
    },
    {
      id: 6,
      name: "Lisa Andini",
      role: "Pengguna Kalkulator",
      image: "👩‍⚕️",
      rating: 5,
      date: "3 minggu lalu",
      review:
        "Kalkulator kreditnya akurat dan mudah digunakan. Membantu saya merencanakan budget dengan baik sebelum beli mobil.",
      car: "Daihatsu Terios 2021",
    },
  ];

  // Responsive: 1 card on mobile, 2 on tablet, 3 on desktop
  const getReviewsPerPage = () => {
    if (typeof window !== "undefined") {
      if (window.innerWidth < 640) return 1;
      if (window.innerWidth < 1024) return 2;
      return 3;
    }
    return 3;
  };

  const [reviewsPerPage, setReviewsPerPage] = useState(3);

  React.useEffect(() => {
    const handleResize = () => {
      const newPerPage = getReviewsPerPage();
      setReviewsPerPage(newPerPage);
      setCurrentSlide(0);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
      value: "10K+",
      label: "Review Positif",
      icon: "💬",
      gradient: "from-blue-500 to-cyan-600",
    },
    {
      value: "98%",
      label: "Kepuasan",
      icon: "😊",
      gradient: "from-green-500 to-emerald-600",
    },
    {
      value: "50K+",
      label: "Pengguna Aktif",
      icon: "👥",
      gradient: "from-purple-500 to-pink-600",
    },
  ];

  return (
    <section
      className={`py-10 sm:py-14 md:py-20 transition-colors duration-300 ${
        isDarkMode ? "bg-slate-900" : "bg-white"
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <div className="inline-block mb-4 sm:mb-6">
            <span
              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-bold border-2 ${
                isDarkMode
                  ? "bg-yellow-500/10 border-yellow-500/30 text-yellow-400"
                  : "bg-yellow-100 border-yellow-200 text-yellow-700"
              }`}
            >
              ⭐ Testimoni Pelanggan
            </span>
          </div>
          <h2
            className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mb-3 sm:mb-4 md:mb-6 px-2 ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Apa Kata Mereka Tentang Kami?
          </h2>
          <p
            className={`text-sm sm:text-base md:text-lg lg:text-xl max-w-2xl mx-auto px-4 ${
              isDarkMode ? "text-slate-400" : "text-gray-600"
            }`}
          >
            Ribuan pelanggan puas telah menemukan mobil impian mereka bersama
            CarMediator
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-8 mb-10 sm:mb-14 md:mb-20">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`rounded-xl sm:rounded-2xl md:rounded-3xl p-4 sm:p-5 md:p-6 lg:p-8 text-center transition-all duration-500 hover:scale-105 shadow-lg sm:shadow-xl md:shadow-2xl ${
                isDarkMode
                  ? "bg-gradient-to-br from-slate-800 to-slate-900"
                  : `bg-gradient-to-br ${stat.gradient}`
              }`}
            >
              <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-2 sm:mb-3 md:mb-4">
                {stat.icon}
              </div>
              <div
                className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black mb-1 sm:mb-2 ${
                  isDarkMode ? "text-white" : "text-white"
                }`}
              >
                {stat.value}
              </div>
              <div
                className={`text-[10px] sm:text-xs md:text-sm font-bold ${
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-8 sm:mb-10 md:mb-12">
            {getCurrentReviews().map((review) => (
              <div
                key={review.id}
                className={`rounded-xl sm:rounded-2xl md:rounded-3xl p-4 sm:p-5 md:p-6 lg:p-8 shadow-lg sm:shadow-xl md:shadow-2xl transition-all duration-500 hover:-translate-y-1 sm:hover:-translate-y-2 flex flex-col border-2 ${
                  isDarkMode
                    ? "bg-slate-800 border-slate-700 hover:border-cyan-500/50"
                    : "bg-white border-gray-100 hover:border-blue-500/50"
                }`}
              >
                {/* Rating Stars */}
                <div className="flex items-center mb-3 sm:mb-4 md:mb-6">
                  {[...Array(review.rating)].map((_, i) => (
                    <FiStar
                      key={i}
                      className="text-yellow-400 fill-yellow-400 text-sm sm:text-base md:text-lg lg:text-xl mr-0.5 sm:mr-1"
                    />
                  ))}
                </div>

                {/* Review Text */}
                <p
                  className={`mb-4 sm:mb-6 md:mb-8 grow leading-relaxed text-xs sm:text-sm md:text-base ${
                    isDarkMode ? "text-slate-300" : "text-gray-700"
                  }`}
                >
                  &ldquo;{review.review}&rdquo;
                </p>

                {/* Car Info */}
                <div
                  className={`mb-4 sm:mb-5 md:mb-6 p-2.5 sm:p-3 md:p-4 rounded-lg sm:rounded-xl md:rounded-2xl ${
                    isDarkMode
                      ? "bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border-2 border-cyan-500/20"
                      : "bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-100"
                  }`}
                >
                  <div
                    className={`text-[10px] sm:text-xs font-bold mb-1 sm:mb-2 ${
                      isDarkMode ? "text-cyan-400" : "text-blue-600"
                    }`}
                  >
                    Mobil yang dibeli:
                  </div>
                  <div
                    className={`text-xs sm:text-sm font-black ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {review.car}
                  </div>
                </div>

                {/* Reviewer Info */}
                <div
                  className={`flex items-center justify-between pt-3 sm:pt-4 md:pt-6 border-t-2 ${
                    isDarkMode ? "border-slate-700" : "border-gray-100"
                  }`}
                >
                  <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4">
                    <div
                      className={`w-10 h-10 sm:w-11 sm:h-11 md:w-14 md:h-14 rounded-lg sm:rounded-xl md:rounded-2xl flex items-center justify-center text-xl sm:text-2xl md:text-3xl ${
                        isDarkMode
                          ? "bg-gradient-to-br from-cyan-500 to-blue-600"
                          : "bg-gradient-to-br from-blue-500 to-purple-600"
                      }`}
                    >
                      {review.image}
                    </div>
                    <div>
                      <div
                        className={`font-bold text-xs sm:text-sm md:text-base ${
                          isDarkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {review.name}
                      </div>
                      <div
                        className={`text-[10px] sm:text-xs ${
                          isDarkMode ? "text-slate-500" : "text-gray-500"
                        }`}
                      >
                        {review.role}
                      </div>
                    </div>
                  </div>
                  <div
                    className={`text-[10px] sm:text-xs hidden sm:block ${
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
          <div className="flex items-center justify-center space-x-3 sm:space-x-4 md:space-x-6">
            <button
              onClick={prevSlide}
              disabled={currentSlide === 0}
              className={`w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-lg sm:rounded-xl md:rounded-2xl flex items-center justify-center transition-all duration-300 shadow-lg sm:shadow-xl ${
                isDarkMode
                  ? "bg-slate-800 hover:bg-gradient-to-r hover:from-cyan-500 hover:to-blue-600 border-2 border-slate-700 disabled:opacity-30"
                  : "bg-white hover:bg-gradient-to-r hover:from-blue-600 hover:to-blue-700 border-2 border-gray-200 disabled:opacity-30"
              } hover:scale-105 disabled:hover:scale-100`}
            >
              <FiChevronLeft
                className={`text-lg sm:text-xl md:text-2xl ${
                  isDarkMode ? "text-slate-400" : "text-gray-600"
                }`}
              />
            </button>

            {/* Dots Indicator */}
            <div className="flex space-x-1.5 sm:space-x-2 md:space-x-3">
              {[...Array(totalSlides)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-2 sm:h-2.5 md:h-3 rounded-full transition-all duration-300 ${
                    currentSlide === index
                      ? isDarkMode
                        ? "w-6 sm:w-8 md:w-10 lg:w-12 bg-gradient-to-r from-cyan-500 to-blue-600"
                        : "w-6 sm:w-8 md:w-10 lg:w-12 bg-gradient-to-r from-blue-600 to-blue-700"
                      : isDarkMode
                        ? "w-2 sm:w-2.5 md:w-3 bg-slate-700 hover:bg-slate-600"
                        : "w-2 sm:w-2.5 md:w-3 bg-gray-300 hover:bg-gray-400"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={nextSlide}
              disabled={currentSlide === totalSlides - 1}
              className={`w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-lg sm:rounded-xl md:rounded-2xl flex items-center justify-center transition-all duration-300 shadow-lg sm:shadow-xl ${
                isDarkMode
                  ? "bg-slate-800 hover:bg-gradient-to-r hover:from-cyan-500 hover:to-blue-600 border-2 border-slate-700 disabled:opacity-30"
                  : "bg-white hover:bg-gradient-to-r hover:from-blue-600 hover:to-blue-700 border-2 border-gray-200 disabled:opacity-30"
              } hover:scale-105 disabled:hover:scale-100`}
            >
              <FiChevronRight
                className={`text-lg sm:text-xl md:text-2xl ${
                  isDarkMode ? "text-slate-400" : "text-gray-600"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Trust Badges */}
        <div
          className={`mt-10 sm:mt-14 md:mt-20 rounded-xl sm:rounded-2xl md:rounded-3xl p-5 sm:p-8 md:p-12 lg:p-16 ${
            isDarkMode
              ? "bg-gradient-to-r from-slate-800 to-slate-900"
              : "bg-gradient-to-r from-gray-50 to-blue-50"
          }`}
        >
          <div className="text-center mb-6 sm:mb-8 md:mb-12">
            <h3
              className={`text-xl sm:text-2xl md:text-3xl font-black mb-2 sm:mb-3 md:mb-4 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Dipercaya Oleh
            </h3>
            <p
              className={`text-xs sm:text-sm md:text-base ${
                isDarkMode ? "text-slate-400" : "text-gray-600"
              }`}
            >
              Partner dan pelanggan dari berbagai kalangan
            </p>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-3 md:gap-4 lg:gap-6">
            {[
              "🏢 Perusahaan",
              "👨‍👩‍👧‍👦 Keluarga",
              "🚕 Driver",
              "👔 Profesional",
              "🎓 Mahasiswa",
            ].map((badge, index) => (
              <div
                key={index}
                className={`px-3 sm:px-4 md:px-6 lg:px-8 py-2 sm:py-2.5 md:py-3 lg:py-4 rounded-lg sm:rounded-xl md:rounded-2xl font-bold text-xs sm:text-sm md:text-base transition-all duration-300 hover:scale-105 shadow-md sm:shadow-lg md:shadow-xl ${
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
        <div className="mt-10 sm:mt-12 md:mt-16 text-center">
          <p
            className={`text-sm sm:text-base md:text-lg lg:text-xl mb-4 sm:mb-6 md:mb-8 px-4 ${
              isDarkMode ? "text-slate-400" : "text-gray-600"
            }`}
          >
            Siap bergabung dengan ribuan pelanggan puas kami?
          </p>
          <button
            className={`px-6 sm:px-8 md:px-10 lg:px-12 py-3 sm:py-4 md:py-5 rounded-xl sm:rounded-2xl font-bold sm:font-black transition-all duration-300 inline-flex items-center space-x-2 sm:space-x-3 shadow-lg sm:shadow-xl md:shadow-2xl hover:scale-105 text-sm sm:text-base md:text-lg ${
              isDarkMode
                ? "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-cyan-500/30"
                : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-blue-500/30"
            }`}
            onClick={() => {
              router.push("/marketplace");
            }}
          >
            <span>Mulai Sekarang</span>
            <span className="text-lg sm:text-xl md:text-2xl">→</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default ReviewSection;
