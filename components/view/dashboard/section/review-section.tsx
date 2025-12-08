"use client";

import React, { useState } from "react";
import { FiStar, FiChevronLeft, FiChevronRight } from "react-icons/fi";

const ReviewSection = () => {
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
    { value: "4.9/5", label: "Rating Rata-rata", icon: "⭐" },
    { value: "10,000+", label: "Review Positif", icon: "💬" },
    { value: "98%", label: "Tingkat Kepuasan", icon: "😊" },
    { value: "50,000+", label: "Pengguna Aktif", icon: "👥" },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-block mb-4">
            <span className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-full text-sm font-semibold">
              ⭐ Testimoni Pelanggan
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Apa Kata Mereka Tentang Kami?
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Ribuan pelanggan puas telah menemukan mobil impian mereka bersama
            CarMediator
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-linear-to-br from-blue-50 to-blue-100 rounded-2xl p-6 text-center hover:shadow-lg transition-shadow"
            >
              <div className="text-4xl mb-2">{stat.icon}</div>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Reviews Carousel */}
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {getCurrentReviews().map((review) => (
              <div
                key={review.id}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col"
              >
                {/* Rating Stars */}
                <div className="flex items-center mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <FiStar
                      key={i}
                      className="text-yellow-400 fill-yellow-400 text-lg"
                    />
                  ))}
                </div>

                {/* Review Text */}
                <p className="text-gray-700 mb-6 grow leading-relaxed">
                  &ldquo;{review.review}&rdquo;
                </p>

                {/* Car Info */}
                <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                  <div className="text-xs text-blue-600 font-medium">
                    Mobil yang dibeli:
                  </div>
                  <div className="text-sm font-bold text-gray-900">
                    {review.car}
                  </div>
                </div>

                {/* Reviewer Info */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-2xl">
                      {review.image}
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">
                        {review.name}
                      </div>
                      <div className="text-xs text-gray-500">{review.role}</div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-400">{review.date}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-center space-x-4">
            <button
              onClick={prevSlide}
              className="w-12 h-12 rounded-full bg-white border-2 border-gray-200 hover:border-blue-600 hover:bg-blue-50 flex items-center justify-center transition-all group"
              disabled={currentSlide === 0}
            >
              <FiChevronLeft className="text-xl text-gray-600 group-hover:text-blue-600" />
            </button>

            {/* Dots Indicator */}
            <div className="flex space-x-2">
              {[...Array(totalSlides)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    currentSlide === index
                      ? "w-8 bg-blue-600"
                      : "w-2 bg-gray-300 hover:bg-gray-400"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={nextSlide}
              className="w-12 h-12 rounded-full bg-white border-2 border-gray-200 hover:border-blue-600 hover:bg-blue-50 flex items-center justify-center transition-all group"
              disabled={currentSlide === totalSlides - 1}
            >
              <FiChevronRight className="text-xl text-gray-600 group-hover:text-blue-600" />
            </button>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-16 bg-linear-to-r from-gray-50 to-blue-50 rounded-3xl p-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Dipercaya Oleh
            </h3>
            <p className="text-gray-600">
              Partner dan pelanggan dari berbagai kalangan
            </p>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-8">
            {[
              "🏢 Perusahaan",
              "👨‍👩‍👧‍👦 Keluarga",
              "🚕 Driver",
              "👔 Profesional",
              "🎓 Mahasiswa",
            ].map((badge, index) => (
              <div
                key={index}
                className="px-6 py-3 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow font-medium text-gray-700"
              >
                {badge}
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">
            Siap bergabung dengan ribuan pelanggan puas kami?
          </p>
          <button className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors inline-flex items-center space-x-2">
            <span>Mulai Sekarang</span>
            <span>→</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default ReviewSection;
