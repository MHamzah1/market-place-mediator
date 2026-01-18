"use client";

import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";
import { FiArrowRight, FiPlay } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";
import Image from "next/image";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";

const slides = [
  {
    id: 1,
    badge: "Platform Marketplace #1 di Indonesia",
    title: "Temukan Mobil",
    highlight: "Impian Anda",
    description:
      "Ribuan pilihan mobil berkualitas dengan harga terbaik. Dilengkapi jasa inspeksi profesional dan kalkulator pembiayaan.",
    image: "/image/cars1.jpg",
    buttonText: "Jelajahi Marketplace",
    buttonLink: "/marketplace",
    accentColor: "from-blue-500 to-cyan-500",
  },
  {
    id: 2,
    badge: "Layanan Inspeksi Profesional",
    title: "Jasa Inspeksi",
    highlight: "Mobil Terpercaya",
    description:
      "Pemeriksaan menyeluruh oleh mekanik bersertifikat. Lebih dari 150 titik inspeksi untuk memastikan kualitas mobil Anda.",
    image: "/image/cars2.png",
    buttonText: "Pesan Inspeksi",
    buttonLink: "/Inspeksi",
    accentColor: "from-emerald-500 to-teal-500",
  },
  {
    id: 3,
    badge: "Hitung Cicilan dengan Mudah",
    title: "Kalkulator",
    highlight: "Pembiayaan Mobil",
    description:
      "Simulasikan cicilan mobil impian Anda. Bandingkan berbagai opsi leasing dari partner terpercaya kami.",
    image: "/image/cars3.png",
    buttonText: "Hitung Sekarang",
    buttonLink: "/Kalkulator",
    accentColor: "from-amber-500 to-orange-500",
  },
];

const HeaderBeranda = () => {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="relative overflow-hidden">
      <Swiper
        modules={[Autoplay, Pagination, Navigation, EffectFade]}
        effect="fade"
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          el: ".custom-pagination",
          bulletClass: "custom-bullet",
          bulletActiveClass: "custom-bullet-active",
        }}
        navigation={{
          nextEl: ".swiper-next",
          prevEl: ".swiper-prev",
        }}
        loop={true}
        speed={1000}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        className="w-full"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="relative min-h-[85vh] md:min-h-[90vh]">
              {/* Background Image with Overlay */}
              <div className="absolute inset-0">
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  priority
                  quality={90}
                  className="object-cover object-center"
                  sizes="100vw"
                />
                {/* Gradient Overlay */}
                <div
                  className={`absolute inset-0 ${
                    isDarkMode
                      ? "bg-gradient-to-r from-slate-950/95 via-slate-900/75 to-transparent"
                      : "bg-gradient-to-r from-blue-950/90 via-blue-900/70 to-transparent"
                  }`}
                />
                {/* Additional overlay for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />

                {/* Animated gradient accent */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${slide.accentColor} opacity-10 mix-blend-overlay`}
                />
              </div>

              {/* Content */}
              <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
                <div className="flex flex-col justify-center min-h-[85vh] md:min-h-[90vh] py-20">
                  <div className="max-w-3xl">
                    {/* Badge with animation */}
                    <div
                      className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold mb-6 backdrop-blur-md animate-pulse ${
                        isDarkMode
                          ? "bg-white/10 text-cyan-400 border border-cyan-500/30 shadow-lg shadow-cyan-500/20"
                          : "bg-white/20 text-white border border-white/40 shadow-lg shadow-white/20"
                      }`}
                    >
                      <span className="text-lg animate-bounce">✨</span>
                      {slide.badge}
                    </div>

                    {/* Title with stagger animation */}
                    <div className="mb-6 space-y-2">
                      <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-tight animate-fade-in-up">
                        {slide.title}
                      </h1>
                      <h2
                        className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-tight bg-gradient-to-r ${slide.accentColor} bg-clip-text text-transparent animate-fade-in-up animation-delay-100 drop-shadow-2xl`}
                        style={{ textShadow: "0 0 40px rgba(0,0,0,0.3)" }}
                      >
                        {slide.highlight}
                      </h2>
                    </div>

                    {/* Description with better typography */}
                    <p className="text-lg md:text-xl text-white/90 leading-relaxed mb-10 max-w-2xl font-medium animate-fade-in-up animation-delay-200 backdrop-blur-sm bg-black/10 p-4 rounded-xl">
                      {slide.description}
                    </p>

                    {/* Buttons with enhanced styling */}
                    <div className="flex flex-wrap gap-4 animate-fade-in-up animation-delay-300">
                      <button
                        onClick={() => router.push(slide.buttonLink)}
                        className={`group px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center gap-3 shadow-2xl hover:shadow-3xl hover:scale-105 bg-gradient-to-r ${slide.accentColor} text-white hover:brightness-110`}
                      >
                        {slide.buttonText}
                        <FiArrowRight className="group-hover:translate-x-2 transition-transform duration-300" />
                      </button>

                      {/* <button
                        className={`group px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center gap-3 border-2 hover:scale-105 ${
                          isDarkMode
                            ? "border-white/40 text-white hover:bg-white/20 backdrop-blur-md hover:border-white/60"
                            : "border-white/60 text-white hover:bg-white/30 backdrop-blur-md hover:border-white/80"
                        }`}
                      >
                        <FiPlay className="text-xl group-hover:scale-125 transition-transform" />
                        Lihat Video
                      </button> */}
                    </div>

                    {/* Stats/Features */}
                    <div className="mt-12 grid grid-cols-3 gap-6 max-w-2xl">
                      {[
                        { value: "10K+", label: "Mobil Terjual" },
                        { value: "98%", label: "Kepuasan" },
                        { value: "24/7", label: "Dukungan" },
                      ].map((stat, idx) => (
                        <div
                          key={idx}
                          className="backdrop-blur-md bg-white/10 rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300"
                        >
                          <div
                            className={`text-2xl md:text-3xl font-black bg-gradient-to-r ${slide.accentColor} bg-clip-text text-transparent`}
                          >
                            {stat.value}
                          </div>
                          <div className="text-sm text-white/80 font-medium">
                            {stat.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Navigation Arrows - Enhanced */}
      <button
        className={`swiper-prev absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 group ${
          isDarkMode
            ? "bg-white/10 text-white hover:bg-white/20 backdrop-blur-md border-2 border-white/20 hover:border-white/40"
            : "bg-white/20 text-white hover:bg-white/30 backdrop-blur-md border-2 border-white/30 hover:border-white/50"
        }`}
      >
        <svg
          className="w-7 h-7 group-hover:-translate-x-1 transition-transform"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={3}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      <button
        className={`swiper-next absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 group ${
          isDarkMode
            ? "bg-white/10 text-white hover:bg-white/20 backdrop-blur-md border-2 border-white/20 hover:border-white/40"
            : "bg-white/20 text-white hover:bg-white/30 backdrop-blur-md border-2 border-white/30 hover:border-white/50"
        }`}
      >
        <svg
          className="w-7 h-7 group-hover:translate-x-1 transition-transform"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={3}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>

      {/* Custom Pagination Dots - Enhanced */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
        <div className="custom-pagination flex items-center gap-3 backdrop-blur-md bg-black/20 px-6 py-3 rounded-full">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              className={`transition-all duration-500 rounded-full ${
                activeIndex === index
                  ? `w-12 h-3.5 bg-gradient-to-r ${slide.accentColor} shadow-lg`
                  : `w-3.5 h-3.5 ${
                      isDarkMode
                        ? "bg-white/50 hover:bg-white/70"
                        : "bg-white/60 hover:bg-white/80"
                    } hover:scale-125`
              }`}
            />
          ))}
        </div>
      </div>

      {/* Quick Links Bar - Enhanced */}
      {/* <div className="absolute bottom-0 left-0 right-0 z-20">
        <div className="max-w-5xl mx-auto px-4 transform translate-y-1/2">
          <div
            className={`grid grid-cols-1 md:grid-cols-3 rounded-2xl overflow-hidden shadow-2xl ${
              isDarkMode
                ? "bg-slate-900/95 backdrop-blur-xl border border-slate-700/50"
                : "bg-white/95 backdrop-blur-xl border border-white/20"
            }`}
          >
            {[
              {
                title: "Marketplace",
                desc: "Jual Beli Mobil",
                link: "/marketplace",
                icon: "🚗",
                color: "from-blue-500 to-cyan-500",
              },
              {
                title: "Inspeksi",
                desc: "Cek Kualitas Mobil",
                link: "/Inspeksi",
                icon: "🔍",
                color: "from-emerald-500 to-teal-500",
              },
              {
                title: "Kalkulator",
                desc: "Hitung Cicilan",
                link: "/Kalkulator",
                icon: "💰",
                color: "from-amber-500 to-orange-500",
              },
            ].map((item, index) => (
              <button
                key={index}
                onClick={() => router.push(item.link)}
                className={`group relative p-6 md:p-7 text-left transition-all duration-300 ${
                  index !== 2
                    ? isDarkMode
                      ? "border-b md:border-b-0 md:border-r border-slate-700/50"
                      : "border-b md:border-b-0 md:border-r border-gray-200"
                    : ""
                } ${isDarkMode ? "hover:bg-slate-800/70" : "hover:bg-gray-50"}`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-2xl md:text-3xl shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}
                  >
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <h3
                      className={`font-bold text-base md:text-lg ${
                        isDarkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {item.title}
                    </h3>
                    <p
                      className={`text-sm ${
                        isDarkMode ? "text-slate-400" : "text-gray-500"
                      }`}
                    >
                      {item.desc}
                    </p>
                  </div>
                  <FiArrowRight
                    className={`text-xl opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-300 ${
                      isDarkMode ? "text-cyan-400" : "text-blue-600"
                    }`}
                  />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div> */}

      {/* Spacer for Quick Links Bar */}
      {/* <div className="h-20 md:h-24"></div> */}

      <style jsx global>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }

        .animation-delay-100 {
          animation-delay: 0.1s;
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
        }

        .animation-delay-300 {
          animation-delay: 0.3s;
        }
      `}</style>
    </section>
  );
};

export default HeaderBeranda;
