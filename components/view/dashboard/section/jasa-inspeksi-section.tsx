"use client";

import React from "react";
import {
  AiOutlineCheckCircle,
  AiOutlineSafety,
  AiOutlineFileProtect,
} from "react-icons/ai";
import { FiCheckCircle, FiTool, FiClock } from "react-icons/fi";

const JasaInspeksiSection = () => {
  const inspectionFeatures = [
    {
      icon: <AiOutlineCheckCircle className="text-4xl" />,
      title: "Inspeksi Menyeluruh",
      description: "150+ poin pemeriksaan detail oleh teknisi bersertifikat",
      color: "blue",
    },
    {
      icon: <AiOutlineSafety className="text-4xl" />,
      title: "Garansi Keamanan",
      description: "Laporan lengkap kondisi kendaraan dengan jaminan akurat",
      color: "green",
    },
    {
      icon: <FiClock className="text-4xl" />,
      title: "Proses Cepat",
      description: "Inspeksi selesai dalam 2-3 jam, laporan langsung tersedia",
      color: "orange",
    },
    {
      icon: <AiOutlineFileProtect className="text-4xl" />,
      title: "Sertifikat Digital",
      description: "Sertifikat inspeksi digital yang dapat diverifikasi",
      color: "purple",
    },
  ];

  const inspectionSteps = [
    { step: 1, title: "Booking Online", desc: "Pilih jadwal inspeksi" },
    { step: 2, title: "Inspeksi Dilakukan", desc: "Teknisi datang & periksa" },
    { step: 3, title: "Terima Laporan", desc: "Laporan detail lengkap" },
    { step: 4, title: "Keputusan Beli", desc: "Beli dengan percaya diri" },
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string; icon: string }> = {
      blue: { bg: "bg-blue-50", text: "text-blue-600", icon: "text-blue-600" },
      green: {
        bg: "bg-green-50",
        text: "text-green-600",
        icon: "text-green-600",
      },
      orange: {
        bg: "bg-orange-50",
        text: "text-orange-600",
        icon: "text-orange-600",
      },
      purple: {
        bg: "bg-purple-50",
        text: "text-purple-600",
        icon: "text-purple-600",
      },
    };
    return colors[color];
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-block mb-4">
            <span className="px-4 py-2 bg-green-100 text-green-600 rounded-full text-sm font-semibold">
              Jasa Inspeksi Profesional
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Pastikan Mobil Anda Berkualitas
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Layanan inspeksi komprehensif oleh teknisi berpengalaman untuk
            memastikan kondisi mobil sebelum membeli
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {inspectionFeatures.map((feature, index) => {
            const colors = getColorClasses(feature.color);
            return (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:-translate-y-2 group"
              >
                <div
                  className={`w-16 h-16 ${colors.bg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${colors.icon}`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            );
          })}
        </div>

        {/* Inspection Process */}
        <div className="bg-linear-to-br from-blue-50 to-blue-100 rounded-3xl p-8 md:p-12 mb-12">
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-10">
            Cara Kerja Inspeksi
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {/* Connection Lines for Desktop */}
            <div
              className="hidden md:block absolute top-12 left-0 right-0 h-1 bg-blue-300"
              style={{ width: "75%", left: "12.5%" }}
            ></div>

            {inspectionSteps.map((item, index) => (
              <div key={index} className="relative z-10">
                <div className="flex flex-col items-center text-center">
                  <div className="w-24 h-24 bg-blue-600 text-white rounded-full flex items-center justify-center text-3xl font-bold mb-4 shadow-lg">
                    {item.step}
                  </div>
                  <h4 className="font-bold text-lg text-gray-900 mb-2">
                    {item.title}
                  </h4>
                  <p className="text-gray-600 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Inspection Checklist Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Yang Kami Periksa
            </h3>
            <div className="space-y-4">
              {[
                "Mesin & Sistem Kelistrikan",
                "Rangka & Bodi Kendaraan",
                "Sistem Suspensi & Kaki-kaki",
                "Sistem Rem & Transmisi",
                "Interior & Eksterior",
                "Dokumen & Riwayat Kendaraan",
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                    <FiCheckCircle className="text-green-600" />
                  </div>
                  <span className="text-gray-800 font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-linear-to-br from-gray-800 to-gray-900 rounded-3xl p-8 text-white">
            <div className="flex items-center justify-center mb-6">
              <FiTool className="text-6xl text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-center">
              Paket Inspeksi Premium
            </h3>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between items-center pb-3 border-b border-gray-700">
                <span className="text-gray-300">Inspeksi Lengkap</span>
                <span className="font-bold">✓</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-gray-700">
                <span className="text-gray-300">Laporan Digital</span>
                <span className="font-bold">✓</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-gray-700">
                <span className="text-gray-300">Sertifikat Resmi</span>
                <span className="font-bold">✓</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-gray-700">
                <span className="text-gray-300">Test Drive</span>
                <span className="font-bold">✓</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Garansi 30 Hari</span>
                <span className="font-bold">✓</span>
              </div>
            </div>
            <div className="text-center mb-6">
              <div className="text-sm text-gray-400 mb-2">Mulai dari</div>
              <div className="text-4xl font-bold mb-1">Rp 500.000</div>
              <div className="text-sm text-gray-400">per inspeksi</div>
            </div>
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
              Pesan Inspeksi Sekarang
            </button>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-16 text-center">
          <div className="inline-flex flex-wrap justify-center gap-8 items-center">
            <div className="flex items-center space-x-2 text-gray-600">
              <FiCheckCircle className="text-green-500 text-xl" />
              <span className="font-medium">1000+ Inspeksi</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <FiCheckCircle className="text-green-500 text-xl" />
              <span className="font-medium">Teknisi Bersertifikat</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <FiCheckCircle className="text-green-500 text-xl" />
              <span className="font-medium">Rating 4.9/5</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <FiCheckCircle className="text-green-500 text-xl" />
              <span className="font-medium">Garansi Uang Kembali</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default JasaInspeksiSection;
