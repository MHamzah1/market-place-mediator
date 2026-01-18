"use client";

import { useTheme } from "@/context/ThemeContext";
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
import { motion } from "framer-motion";
import Link from "next/link";

const MarketingSection = () => {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  const mainFeatures = [
    {
      id: 1,
      icon: <AiOutlineCar className="text-6xl" />,
      title: "Marketplace Mobil",
      description:
        "Ribuan pilihan mobil dari berbagai merek dan model dengan harga terbaik",
      features: [
        "10.000+ Unit Mobil",
        "Semua Merek Tersedia",
        "Harga Transparan",
      ],
      gradient: isDarkMode
        ? "from-cyan-500 to-blue-600"
        : "from-blue-500 to-blue-700",
      iconBg: isDarkMode ? "bg-cyan-500/20" : "bg-blue-100",
      link: "/marketplace",
    },
    {
      id: 2,
      icon: <AiOutlineCalculator className="text-6xl" />,
      title: "Kalkulator Mobil",
      description:
        "Hitung simulasi kredit dan cicilan mobil impian Anda dengan mudah dan akurat",
      features: [
        "Simulasi Kredit Real-time",
        "Berbagai Skema DP",
        "Perbandingan Leasing",
      ],
      gradient: isDarkMode
        ? "from-emerald-500 to-green-600"
        : "from-green-500 to-green-700",
      iconBg: isDarkMode ? "bg-emerald-500/20" : "bg-green-100",
      link: "/Kalkulator",
    },
    {
      id: 3,
      icon: <AiOutlineCheckCircle className="text-6xl" />,
      title: "Jasa Inspeksi",
      description:
        "Inspeksi profesional untuk memastikan kualitas mobil sebelum Anda membeli",
      features: [
        "150+ Poin Pemeriksaan",
        "Teknisi Bersertifikat",
        "Laporan Digital",
      ],
      gradient: isDarkMode
        ? "from-orange-500 to-red-600"
        : "from-orange-500 to-orange-700",
      iconBg: isDarkMode ? "bg-orange-500/20" : "bg-orange-100",
      link: "/Inspeksi",
    },
  ];

  const benefits = [
    {
      icon: <FiShield />,
      title: "Aman & Terpercaya",
      desc: "Semua mobil terverifikasi",
      color: isDarkMode ? "text-cyan-400" : "text-blue-600",
      bgHover: isDarkMode
        ? "group-hover:bg-cyan-500"
        : "group-hover:bg-blue-600",
    },
    {
      icon: <FiZap />,
      title: "Proses Cepat",
      desc: "Transaksi mudah & cepat",
      color: isDarkMode ? "text-yellow-400" : "text-yellow-600",
      bgHover: isDarkMode
        ? "group-hover:bg-yellow-500"
        : "group-hover:bg-yellow-600",
    },
    {
      icon: <FiUsers />,
      title: "50K+ Pengguna",
      desc: "Dipercaya ribuan orang",
      color: isDarkMode ? "text-purple-400" : "text-purple-600",
      bgHover: isDarkMode
        ? "group-hover:bg-purple-500"
        : "group-hover:bg-purple-600",
    },
    {
      icon: <FiAward />,
      title: "Rating 4.9/5",
      desc: "Kepuasan pelanggan",
      color: isDarkMode ? "text-green-400" : "text-green-600",
      bgHover: isDarkMode
        ? "group-hover:bg-green-500"
        : "group-hover:bg-green-600",
    },
    {
      icon: <FiTrendingUp />,
      title: "Harga Kompetitif",
      desc: "Harga terbaik di pasaran",
      color: isDarkMode ? "text-orange-400" : "text-orange-600",
      bgHover: isDarkMode
        ? "group-hover:bg-orange-500"
        : "group-hover:bg-orange-600",
    },
    {
      icon: <FiClock />,
      title: "Support 24/7",
      desc: "Layanan pelanggan siaga",
      color: isDarkMode ? "text-pink-400" : "text-pink-600",
      bgHover: isDarkMode
        ? "group-hover:bg-pink-500"
        : "group-hover:bg-pink-600",
    },
  ];

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };

  const floatingVariants = {
    animate: {
      y: [0, -20, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  const scaleVariants = {
    hover: {
      scale: 1.05,
      rotate: 5,
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };

  return (
    <section
      className={`py-20 transition-colors duration-300 ${
        isDarkMode ? "bg-slate-900" : "bg-gray-50"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
            className="inline-block mb-6"
          >
            <span
              className={`px-6 py-3 rounded-full text-sm font-bold border-2 ${
                isDarkMode
                  ? "bg-purple-500/10 border-purple-500/30 text-purple-400"
                  : "bg-purple-100 border-purple-200 text-purple-600"
              }`}
            >
              Fitur Unggulan
            </span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={`text-4xl md:text-5xl font-black mb-6 ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Solusi Lengkap untuk Kebutuhan Otomotif Anda
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className={`text-xl max-w-2xl mx-auto ${
              isDarkMode ? "text-slate-400" : "text-gray-600"
            }`}
          >
            Platform all-in-one untuk jual beli mobil, simulasi kredit, dan
            inspeksi kendaraan
          </motion.p>
        </motion.div>

        {/* Main Features Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-20"
        >
          {mainFeatures.map((feature, index) => (
            <motion.div
              key={feature.id}
              variants={itemVariants}
              whileHover="hover"
              className={`rounded-3xl shadow-2xl transition-all duration-500 overflow-hidden group border-2 ${
                isDarkMode
                  ? "bg-slate-800 border-slate-700 hover:border-cyan-500/50"
                  : "bg-white border-gray-200 hover:border-blue-500/50"
              }`}
            >
              {/* Header with Gradient */}
              <div
                className={`bg-gradient-to-r ${feature.gradient} p-8 text-white relative overflow-hidden`}
              >
                {/* Animated background circles */}
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 180, 360],
                  }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"
                ></motion.div>
                <motion.div
                  animate={{
                    scale: [1, 1.3, 1],
                    rotate: [360, 180, 0],
                  }}
                  transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-xl"
                ></motion.div>

                <div className="relative z-10">
                  <motion.div
                    variants={floatingVariants}
                    animate="animate"
                    className="flex justify-center mb-6"
                  >
                    {feature.icon}
                  </motion.div>
                  <h3 className="text-2xl font-black text-center">
                    {feature.title}
                  </h3>
                </div>
              </div>

              {/* Content */}
              <div className="p-8">
                <p
                  className={`text-center mb-8 leading-relaxed ${
                    isDarkMode ? "text-slate-400" : "text-gray-600"
                  }`}
                >
                  {feature.description}
                </p>

                {/* Feature List */}
                <ul className="space-y-4 mb-8">
                  {feature.features.map((item, idx) => (
                    <motion.li
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-center text-sm"
                    >
                      <div
                        className={`w-6 h-6 rounded-full ${feature.iconBg} flex items-center justify-center mr-3 shrink-0`}
                      >
                        <span
                          className={`text-xs font-bold ${
                            isDarkMode ? "text-white" : "text-gray-700"
                          }`}
                        >
                          ✓
                        </span>
                      </div>
                      <span
                        className={`font-medium ${
                          isDarkMode ? "text-slate-300" : "text-gray-700"
                        }`}
                      >
                        {item}
                      </span>
                    </motion.li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Link href={feature.link}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-full bg-gradient-to-r ${
                      feature.gradient
                    } text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 shadow-xl ${
                      isDarkMode ? "shadow-cyan-500/20" : "shadow-blue-500/20"
                    }`}
                  >
                    Explore Sekarang
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Benefits Grid */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className={`rounded-3xl shadow-2xl p-10 md:p-16 border-2 ${
            isDarkMode
              ? "bg-slate-800 border-slate-700"
              : "bg-white border-gray-200"
          }`}
        >
          <motion.h3
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className={`text-3xl md:text-4xl font-black text-center mb-14 ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Mengapa Memilih CarMediator?
          </motion.h3>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8"
          >
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.1, y: -10 }}
                className="text-center group cursor-pointer"
              >
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className={`w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-4 text-3xl transition-all duration-300 ${
                    isDarkMode
                      ? "bg-slate-900 group-hover:shadow-xl"
                      : "bg-gray-100 group-hover:shadow-xl"
                  } ${benefit.color} ${benefit.bgHover} group-hover:text-white`}
                >
                  {benefit.icon}
                </motion.div>
                <h4
                  className={`font-black text-sm mb-2 ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {benefit.title}
                </h4>
                <p
                  className={`text-xs ${
                    isDarkMode ? "text-slate-500" : "text-gray-600"
                  }`}
                >
                  {benefit.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* CTA Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className={`mt-20 rounded-3xl p-10 md:p-16 text-white relative overflow-hidden ${
            isDarkMode
              ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
              : "bg-gradient-to-r from-blue-600 via-blue-700 to-blue-900"
          }`}
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"
            ></motion.div>
            <motion.div
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
              className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-300 rounded-full blur-3xl"
            ></motion.div>
          </div>

          {/* Grid overlay */}
          <div className="absolute inset-0 opacity-5">
            <div
              className="w-full h-full"
              style={{
                backgroundImage:
                  "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)",
                backgroundSize: "50px 50px",
              }}
            ></div>
          </div>

          <div className="relative z-10 text-center max-w-3xl mx-auto">
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-4xl md:text-5xl font-black mb-6"
            >
              Siap Menemukan Mobil Impian Anda?
            </motion.h3>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className={`text-xl mb-10 ${
                isDarkMode ? "text-slate-300" : "text-blue-100"
              }`}
            >
              Bergabunglah dengan ribuan pengguna yang sudah menemukan mobil
              terbaik mereka
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-5 justify-center"
            >
              <Link href="/marketplace">
                <motion.button
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  className={`font-bold py-5 px-10 rounded-2xl transition-all duration-300 inline-flex items-center justify-center space-x-3 shadow-2xl ${
                    isDarkMode
                      ? "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-cyan-500/30"
                      : "bg-white text-blue-600 hover:bg-blue-50 shadow-white/30"
                  }`}
                >
                  <AiOutlineCar className="text-2xl" />
                  <span>Lihat Mobil</span>
                </motion.button>
              </Link>
              <Link href="/Kalkulator">
                <motion.button
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  className={`font-bold py-5 px-10 rounded-2xl transition-all duration-300 inline-flex items-center justify-center space-x-3 shadow-2xl ${
                    isDarkMode
                      ? "bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white shadow-yellow-500/30"
                      : "bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-gray-900 shadow-yellow-500/30"
                  }`}
                >
                  <AiOutlineCalculator className="text-2xl" />
                  <span>Hitung Kalkulator</span>
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default MarketingSection;
