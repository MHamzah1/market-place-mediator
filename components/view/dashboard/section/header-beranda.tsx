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
            <div className="relative min-h-[70vh] sm:min-h-[80vh] md:min-h-[85vh] lg:min-h-[90vh]">
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
              <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 h-full">
                <div className="flex flex-col justify-center min-h-[70vh] sm:min-h-[80vh] md:min-h-[85vh] lg:min-h-[90vh] py-12 sm:py-16 md:py-20">
                  <div className="max-w-3xl">
                    {/* Badge with animation */}
                    <div
                      className={`inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 md:py-2.5 rounded-full text-xs sm:text-sm font-bold mb-4 sm:mb-5 md:mb-6 backdrop-blur-md animate-pulse ${
                        isDarkMode
                          ? "bg-white/10 text-cyan-400 border border-cyan-500/30 shadow-lg shadow-cyan-500/20"
                          : "bg-white/20 text-white border border-white/40 shadow-lg shadow-white/20"
                      }`}
                    >
                      <span className="text-sm sm:text-base md:text-lg animate-bounce">
                        ✨
                      </span>
                      <span className="hidden sm:inline">{slide.badge}</span>
                      <span className="sm:hidden">Platform #1</span>
                    </div>

                    {/* Title with stagger animation */}
                    <div className="mb-4 sm:mb-5 md:mb-6 space-y-1 sm:space-y-2">
                      <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-black text-white leading-tight animate-fade-in-up">
                        {slide.title}
                      </h1>
                      <h2
                        className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-black leading-tight bg-gradient-to-r ${slide.accentColor} bg-clip-text text-transparent animate-fade-in-up animation-delay-100 drop-shadow-2xl`}
                        style={{ textShadow: "0 0 40px rgba(0,0,0,0.3)" }}
                      >
                        {slide.highlight}
                      </h2>
                    </div>

                    {/* Description with better typography */}
                    <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/90 leading-relaxed mb-6 sm:mb-8 md:mb-10 max-w-2xl font-medium animate-fade-in-up animation-delay-200 backdrop-blur-sm bg-black/10 p-3 sm:p-4 rounded-lg sm:rounded-xl">
                      {slide.description}
                    </p>

                    {/* Buttons with enhanced styling */}
                    <div className="flex flex-wrap gap-3 sm:gap-4 animate-fade-in-up animation-delay-300">
                      <button
                        onClick={() => router.push(slide.buttonLink)}
                        className={`group px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base md:text-lg transition-all duration-300 flex items-center gap-2 sm:gap-3 shadow-2xl hover:shadow-3xl hover:scale-105 bg-gradient-to-r ${slide.accentColor} text-white hover:brightness-110`}
                      >
                        <span className="hidden sm:inline">
                          {slide.buttonText}
                        </span>
                        <span className="sm:hidden">Mulai</span>
                        <FiArrowRight className="group-hover:translate-x-2 transition-transform duration-300 text-base sm:text-lg" />
                      </button>
                    </div>

                    {/* Stats/Features */}
                    <div className="mt-8 sm:mt-10 md:mt-12 grid grid-cols-3 gap-3 sm:gap-4 md:gap-6 max-w-xs sm:max-w-md md:max-w-2xl">
                      {[
                        { value: "10K+", label: "Mobil Terjual" },
                        { value: "98%", label: "Kepuasan" },
                        { value: "24/7", label: "Dukungan" },
                      ].map((stat, idx) => (
                        <div
                          key={idx}
                          className="backdrop-blur-md bg-white/10 rounded-lg sm:rounded-xl p-2 sm:p-3 md:p-4 border border-white/20 hover:bg-white/20 transition-all duration-300"
                        >
                          <div
                            className={`text-lg sm:text-xl md:text-2xl lg:text-3xl font-black bg-gradient-to-r ${slide.accentColor} bg-clip-text text-transparent`}
                          >
                            {stat.value}
                          </div>
                          <div className="text-[10px] sm:text-xs md:text-sm text-white/80 font-medium">
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
        className={`swiper-prev absolute left-2 sm:left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 group ${
          isDarkMode
            ? "bg-white/10 text-white hover:bg-white/20 backdrop-blur-md border-2 border-white/20 hover:border-white/40"
            : "bg-white/20 text-white hover:bg-white/30 backdrop-blur-md border-2 border-white/30 hover:border-white/50"
        }`}
      >
        <svg
          className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 group-hover:-translate-x-1 transition-transform"
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
        className={`swiper-next absolute right-2 sm:right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 group ${
          isDarkMode
            ? "bg-white/10 text-white hover:bg-white/20 backdrop-blur-md border-2 border-white/20 hover:border-white/40"
            : "bg-white/20 text-white hover:bg-white/30 backdrop-blur-md border-2 border-white/30 hover:border-white/50"
        }`}
      >
        <svg
          className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 group-hover:translate-x-1 transition-transform"
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
      <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-20">
        <div className="custom-pagination flex items-center gap-2 sm:gap-3 backdrop-blur-md bg-black/20 px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-full">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              className={`transition-all duration-500 rounded-full ${
                activeIndex === index
                  ? `w-8 sm:w-10 md:w-12 h-2.5 sm:h-3 md:h-3.5 bg-gradient-to-r ${slide.accentColor} shadow-lg`
                  : `w-2.5 sm:w-3 md:w-3.5 h-2.5 sm:h-3 md:h-3.5 ${
                      isDarkMode
                        ? "bg-white/50 hover:bg-white/70"
                        : "bg-white/60 hover:bg-white/80"
                    } hover:scale-125`
              }`}
            />
          ))}
        </div>
      </div>

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
