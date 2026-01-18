"use client";

import { useTheme } from "@/context/ThemeContext";
import React, { useState } from "react";
import {
  AiOutlineCheckCircle,
  AiOutlineSafety,
  AiOutlineFileProtect,
  AiOutlineCar,
} from "react-icons/ai";
import {
  FiCheckCircle,
  FiTool,
  FiClock,
  FiMapPin,
  FiPhone,
  FiUser,
  FiCalendar,
  FiMessageCircle,
  FiSend,
} from "react-icons/fi";
import { BsWhatsapp } from "react-icons/bs";
import toast from "react-hot-toast";

const InspeksiPage = () => {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  // Form state
  const [formData, setFormData] = useState({
    nama: "",
    noTelepon: "",
    email: "",
    merekMobil: "",
    modelMobil: "",
    tahunMobil: "",
    platNomor: "",
    lokasiInspeksi: "",
    alamatLengkap: "",
    tanggalInspeksi: "",
    waktuInspeksi: "",
    paketInspeksi: "premium",
    catatanTambahan: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // WhatsApp number
  const WHATSAPP_NUMBER = "6281574865632";

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const generateWhatsAppMessage = () => {
    const message = `
🔧 *PERMINTAAN JASA INSPEKSI MOBIL*
━━━━━━━━━━━━━━━━━━━━━━

👤 *DATA PELANGGAN*
• Nama: ${formData.nama}
• No. Telepon: ${formData.noTelepon}
• Email: ${formData.email || "-"}

🚗 *DATA KENDARAAN*
• Merek: ${formData.merekMobil}
• Model: ${formData.modelMobil}
• Tahun: ${formData.tahunMobil}
• Plat Nomor: ${formData.platNomor || "-"}

📍 *LOKASI INSPEKSI*
• Kota/Kabupaten: ${formData.lokasiInspeksi}
• Alamat Lengkap: ${formData.alamatLengkap}

📅 *JADWAL*
• Tanggal: ${formData.tanggalInspeksi}
• Waktu: ${formData.waktuInspeksi}

📦 *PAKET INSPEKSI*
• ${formData.paketInspeksi === "basic" ? "Paket Basic (Rp 300.000)" : formData.paketInspeksi === "premium" ? "Paket Premium (Rp 500.000)" : "Paket Complete (Rp 750.000)"}

📝 *CATATAN TAMBAHAN*
${formData.catatanTambahan || "Tidak ada catatan tambahan"}

━━━━━━━━━━━━━━━━━━━━━━
Terima kasih telah menggunakan layanan CarMediator!
    `.trim();

    return encodeURIComponent(message);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (
      !formData.nama ||
      !formData.noTelepon ||
      !formData.merekMobil ||
      !formData.modelMobil ||
      !formData.tahunMobil ||
      !formData.lokasiInspeksi ||
      !formData.alamatLengkap ||
      !formData.tanggalInspeksi ||
      !formData.waktuInspeksi
    ) {
      toast.error("Mohon lengkapi semua field yang wajib diisi");
      return;
    }

    setIsSubmitting(true);

    try {
      const message = generateWhatsAppMessage();
      const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;

      // Open WhatsApp in new tab
      window.open(whatsappUrl, "_blank");

      toast.success("Mengarahkan ke WhatsApp...");

      // Reset form after successful submission
      setTimeout(() => {
        setFormData({
          nama: "",
          noTelepon: "",
          email: "",
          merekMobil: "",
          modelMobil: "",
          tahunMobil: "",
          platNomor: "",
          lokasiInspeksi: "",
          alamatLengkap: "",
          tanggalInspeksi: "",
          waktuInspeksi: "",
          paketInspeksi: "premium",
          catatanTambahan: "",
        });
        setIsSubmitting(false);
      }, 1000);
    } catch (error) {
      toast.error("Terjadi kesalahan, silakan coba lagi");
      setIsSubmitting(false);
    }
  };

  const inspectionFeatures = [
    {
      icon: <AiOutlineCheckCircle className="text-4xl" />,
      title: "Inspeksi Menyeluruh",
      description: "150+ poin pemeriksaan detail oleh teknisi bersertifikat",
      iconBg: isDarkMode ? "bg-cyan-500/20" : "bg-blue-50",
      iconColor: isDarkMode ? "text-cyan-400" : "text-blue-600",
    },
    {
      icon: <AiOutlineSafety className="text-4xl" />,
      title: "Garansi Keamanan",
      description: "Laporan lengkap kondisi kendaraan dengan jaminan akurat",
      iconBg: isDarkMode ? "bg-emerald-500/20" : "bg-green-50",
      iconColor: isDarkMode ? "text-emerald-400" : "text-green-600",
    },
    {
      icon: <FiClock className="text-4xl" />,
      title: "Proses Cepat",
      description: "Inspeksi selesai dalam 2-3 jam, laporan langsung tersedia",
      iconBg: isDarkMode ? "bg-orange-500/20" : "bg-orange-50",
      iconColor: isDarkMode ? "text-orange-400" : "text-orange-600",
    },
    {
      icon: <AiOutlineFileProtect className="text-4xl" />,
      title: "Sertifikat Digital",
      description: "Sertifikat inspeksi digital yang dapat diverifikasi",
      iconBg: isDarkMode ? "bg-purple-500/20" : "bg-purple-50",
      iconColor: isDarkMode ? "text-purple-400" : "text-purple-600",
    },
  ];

  const paketInspeksi = [
    {
      id: "basic",
      name: "Paket Basic",
      price: "Rp 300.000",
      features: [
        "50+ Poin Pemeriksaan",
        "Cek Mesin Dasar",
        "Cek Bodi & Rangka",
        "Laporan Digital",
      ],
      popular: false,
    },
    {
      id: "premium",
      name: "Paket Premium",
      price: "Rp 500.000",
      features: [
        "100+ Poin Pemeriksaan",
        "Cek Mesin Lengkap",
        "Cek Bodi & Rangka",
        "Test Drive",
        "Sertifikat Resmi",
        "Garansi 30 Hari",
      ],
      popular: true,
    },
    {
      id: "complete",
      name: "Paket Complete",
      price: "Rp 750.000",
      features: [
        "150+ Poin Pemeriksaan",
        "Cek Mesin Komprehensif",
        "Cek Seluruh Sistem",
        "Test Drive Extended",
        "Sertifikat Resmi",
        "Garansi 60 Hari",
        "Konsultasi Gratis",
        "Riwayat Kendaraan",
      ],
      popular: false,
    },
  ];

  const checklistItems = [
    { text: "Mesin & Sistem Kelistrikan", icon: "⚡" },
    { text: "Rangka & Bodi Kendaraan", icon: "🚗" },
    { text: "Sistem Suspensi & Kaki-kaki", icon: "🔩" },
    { text: "Sistem Rem & Transmisi", icon: "⚙️" },
    { text: "Interior & Eksterior", icon: "🎨" },
    { text: "Dokumen & Riwayat Kendaraan", icon: "📄" },
  ];

  const inputClass = `w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none ${
    isDarkMode
      ? "bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:border-cyan-500"
      : "bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-500"
  }`;

  const labelClass = `block text-sm font-bold mb-2 ${
    isDarkMode ? "text-slate-300" : "text-gray-700"
  }`;

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDarkMode ? "bg-slate-950" : "bg-gray-50"
      }`}
    >
      {/* Hero Section */}
      <section
        className={`relative py-20 overflow-hidden ${
          isDarkMode
            ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
            : "bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800"
        }`}
      >
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 px-6 py-3 rounded-full bg-white/10 backdrop-blur-sm mb-6">
              <FiTool className="text-cyan-400" />
              <span className="text-white font-semibold">
                Jasa Inspeksi Profesional
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6">
              Inspeksi Mobil
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                Sebelum Membeli
              </span>
            </h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto mb-8">
              Pastikan kondisi mobil impian Anda dengan layanan inspeksi
              menyeluruh oleh teknisi berpengalaman
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {[
                { icon: "🏆", text: "1000+ Inspeksi" },
                { icon: "⭐", text: "Rating 4.9/5" },
                { icon: "👨‍🔧", text: "Teknisi Bersertifikat" },
              ].map((badge, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm"
                >
                  <span className="text-2xl">{badge.icon}</span>
                  <span className="text-white font-semibold">{badge.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {inspectionFeatures.map((feature, index) => (
              <div
                key={index}
                className={`rounded-2xl p-6 transition-all duration-300 hover:-translate-y-2 group border ${
                  isDarkMode
                    ? "bg-slate-900 border-slate-800 hover:border-cyan-500/50"
                    : "bg-white border-gray-100 hover:border-blue-500/50 shadow-lg"
                }`}
              >
                <div
                  className={`w-16 h-16 ${feature.iconBg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${feature.iconColor}`}
                >
                  {feature.icon}
                </div>
                <h3
                  className={`text-lg font-bold mb-2 ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {feature.title}
                </h3>
                <p
                  className={`text-sm ${
                    isDarkMode ? "text-slate-400" : "text-gray-600"
                  }`}
                >
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Paket Inspeksi */}
      <section className={`py-16 ${isDarkMode ? "bg-slate-900" : "bg-white"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2
              className={`text-3xl md:text-4xl font-black mb-4 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Pilih Paket Inspeksi
            </h2>
            <p
              className={`text-lg ${
                isDarkMode ? "text-slate-400" : "text-gray-600"
              }`}
            >
              Sesuaikan dengan kebutuhan inspeksi Anda
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {paketInspeksi.map((paket) => (
              <div
                key={paket.id}
                className={`relative rounded-3xl p-8 transition-all duration-300 border-2 ${
                  paket.popular
                    ? isDarkMode
                      ? "bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-cyan-500"
                      : "bg-gradient-to-br from-blue-50 to-blue-100 border-blue-500"
                    : isDarkMode
                      ? "bg-slate-800 border-slate-700 hover:border-slate-600"
                      : "bg-gray-50 border-gray-200 hover:border-gray-300"
                } ${formData.paketInspeksi === paket.id ? "ring-4 ring-cyan-500/50 scale-105" : "hover:scale-102"}`}
                onClick={() =>
                  setFormData((prev) => ({ ...prev, paketInspeksi: paket.id }))
                }
              >
                {paket.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-bold rounded-full">
                      Paling Populer
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3
                    className={`text-xl font-bold mb-2 ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {paket.name}
                  </h3>
                  <div
                    className={`text-3xl font-black ${
                      isDarkMode
                        ? "text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500"
                        : "text-blue-600"
                    }`}
                  >
                    {paket.price}
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {paket.features.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-3">
                      <FiCheckCircle
                        className={
                          isDarkMode ? "text-cyan-400" : "text-green-500"
                        }
                      />
                      <span
                        className={
                          isDarkMode ? "text-slate-300" : "text-gray-700"
                        }
                      >
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  className={`w-full py-3 rounded-xl font-bold transition-all duration-300 ${
                    formData.paketInspeksi === paket.id
                      ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white"
                      : isDarkMode
                        ? "bg-slate-700 text-white hover:bg-slate-600"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      paketInspeksi: paket.id,
                    }))
                  }
                >
                  {formData.paketInspeksi === paket.id
                    ? "✓ Dipilih"
                    : "Pilih Paket"}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form Booking Section */}
      <section className="py-16" id="booking-form">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Form */}
            <div
              className={`rounded-3xl p-8 ${
                isDarkMode
                  ? "bg-slate-900 border border-slate-800"
                  : "bg-white shadow-xl"
              }`}
            >
              <div className="flex items-center space-x-3 mb-8">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    isDarkMode
                      ? "bg-gradient-to-r from-cyan-500 to-blue-600"
                      : "bg-gradient-to-r from-blue-600 to-blue-700"
                  }`}
                >
                  <BsWhatsapp className="text-white text-2xl" />
                </div>
                <div>
                  <h2
                    className={`text-2xl font-black ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Booking Inspeksi
                  </h2>
                  <p
                    className={`text-sm ${
                      isDarkMode ? "text-slate-400" : "text-gray-600"
                    }`}
                  >
                    Isi form dan kirim langsung ke WhatsApp
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Data Pelanggan */}
                <div className="space-y-4">
                  <h3
                    className={`text-lg font-bold flex items-center space-x-2 ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    <FiUser
                      className={isDarkMode ? "text-cyan-400" : "text-blue-600"}
                    />
                    <span>Data Pelanggan</span>
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>
                        Nama Lengkap <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="nama"
                        value={formData.nama}
                        onChange={handleInputChange}
                        placeholder="Masukkan nama lengkap"
                        className={inputClass}
                        required
                      />
                    </div>
                    <div>
                      <label className={labelClass}>
                        No. Telepon <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        name="noTelepon"
                        value={formData.noTelepon}
                        onChange={handleInputChange}
                        placeholder="08xxxxxxxxxx"
                        className={inputClass}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Email (Opsional)</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="email@example.com"
                      className={inputClass}
                    />
                  </div>
                </div>

                {/* Data Kendaraan */}
                <div className="space-y-4">
                  <h3
                    className={`text-lg font-bold flex items-center space-x-2 ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    <AiOutlineCar
                      className={isDarkMode ? "text-cyan-400" : "text-blue-600"}
                    />
                    <span>Data Kendaraan</span>
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>
                        Merek Mobil <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="merekMobil"
                        value={formData.merekMobil}
                        onChange={handleInputChange}
                        placeholder="Contoh: Toyota, Honda"
                        className={inputClass}
                        required
                      />
                    </div>
                    <div>
                      <label className={labelClass}>
                        Model <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="modelMobil"
                        value={formData.modelMobil}
                        onChange={handleInputChange}
                        placeholder="Contoh: Avanza, Civic"
                        className={inputClass}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>
                        Tahun <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        name="tahunMobil"
                        value={formData.tahunMobil}
                        onChange={handleInputChange}
                        placeholder="Contoh: 2020"
                        min="1990"
                        max="2026"
                        className={inputClass}
                        required
                      />
                    </div>
                    <div>
                      <label className={labelClass}>
                        Plat Nomor (Opsional)
                      </label>
                      <input
                        type="text"
                        name="platNomor"
                        value={formData.platNomor}
                        onChange={handleInputChange}
                        placeholder="Contoh: B 1234 ABC"
                        className={inputClass}
                      />
                    </div>
                  </div>
                </div>

                {/* Lokasi Inspeksi */}
                <div className="space-y-4">
                  <h3
                    className={`text-lg font-bold flex items-center space-x-2 ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    <FiMapPin
                      className={isDarkMode ? "text-cyan-400" : "text-blue-600"}
                    />
                    <span>Lokasi Inspeksi</span>
                  </h3>

                  <div>
                    <label className={labelClass}>
                      Kota/Kabupaten <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="lokasiInspeksi"
                      value={formData.lokasiInspeksi}
                      onChange={handleInputChange}
                      placeholder="Contoh: Jakarta Selatan"
                      className={inputClass}
                      required
                    />
                  </div>

                  <div>
                    <label className={labelClass}>
                      Alamat Lengkap <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="alamatLengkap"
                      value={formData.alamatLengkap}
                      onChange={handleInputChange}
                      placeholder="Masukkan alamat lengkap untuk lokasi inspeksi"
                      rows={3}
                      className={inputClass}
                      required
                    />
                  </div>
                </div>

                {/* Jadwal */}
                <div className="space-y-4">
                  <h3
                    className={`text-lg font-bold flex items-center space-x-2 ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    <FiCalendar
                      className={isDarkMode ? "text-cyan-400" : "text-blue-600"}
                    />
                    <span>Jadwal Inspeksi</span>
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>
                        Tanggal <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        name="tanggalInspeksi"
                        value={formData.tanggalInspeksi}
                        onChange={handleInputChange}
                        min={new Date().toISOString().split("T")[0]}
                        className={inputClass}
                        required
                      />
                    </div>
                    <div>
                      <label className={labelClass}>
                        Waktu <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="waktuInspeksi"
                        value={formData.waktuInspeksi}
                        onChange={handleInputChange}
                        className={inputClass}
                        required
                      >
                        <option value="">Pilih Waktu</option>
                        <option value="08:00 - 10:00">08:00 - 10:00</option>
                        <option value="10:00 - 12:00">10:00 - 12:00</option>
                        <option value="13:00 - 15:00">13:00 - 15:00</option>
                        <option value="15:00 - 17:00">15:00 - 17:00</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Catatan */}
                <div>
                  <label className={labelClass}>Catatan Tambahan</label>
                  <textarea
                    name="catatanTambahan"
                    value={formData.catatanTambahan}
                    onChange={handleInputChange}
                    placeholder="Tambahkan catatan khusus jika ada..."
                    rows={3}
                    className={inputClass}
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center space-x-3 ${
                    isSubmitting
                      ? "bg-gray-400 cursor-not-allowed"
                      : isDarkMode
                        ? "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg shadow-green-500/30 hover:scale-105"
                        : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg shadow-green-500/30 hover:scale-105"
                  }`}
                >
                  <BsWhatsapp className="text-2xl" />
                  <span>
                    {isSubmitting ? "Mengirim..." : "Kirim via WhatsApp"}
                  </span>
                  <FiSend />
                </button>
              </form>
            </div>

            {/* Info Sidebar */}
            <div className="space-y-8">
              {/* What We Check */}
              <div
                className={`rounded-3xl p-8 ${
                  isDarkMode
                    ? "bg-slate-900 border border-slate-800"
                    : "bg-white shadow-xl"
                }`}
              >
                <h3
                  className={`text-2xl font-black mb-6 ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Yang Kami Periksa
                </h3>
                <div className="space-y-4">
                  {checklistItems.map((item, index) => (
                    <div
                      key={index}
                      className={`flex items-center space-x-4 p-4 rounded-xl transition-all duration-300 hover:scale-105 ${
                        isDarkMode
                          ? "bg-slate-800 hover:bg-slate-700"
                          : "bg-gray-50 hover:bg-blue-50"
                      }`}
                    >
                      <div className="text-2xl">{item.icon}</div>
                      <span
                        className={`font-semibold ${
                          isDarkMode ? "text-white" : "text-gray-800"
                        }`}
                      >
                        {item.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact Info */}
              <div
                className={`rounded-3xl p-8 ${
                  isDarkMode
                    ? "bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700"
                    : "bg-gradient-to-br from-blue-600 to-blue-700"
                }`}
              >
                <h3 className="text-2xl font-black mb-6 text-white">
                  Butuh Bantuan?
                </h3>
                <p
                  className={`mb-6 ${
                    isDarkMode ? "text-slate-300" : "text-white/90"
                  }`}
                >
                  Tim kami siap membantu Anda 24/7 untuk pertanyaan seputar
                  layanan inspeksi
                </p>
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 px-6 py-4 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold transition-all duration-300 hover:scale-105"
                >
                  <BsWhatsapp className="text-2xl" />
                  <span>Chat Langsung</span>
                </a>
              </div>

              {/* Trust Badges */}
              <div
                className={`rounded-3xl p-8 ${
                  isDarkMode
                    ? "bg-slate-900 border border-slate-800"
                    : "bg-white shadow-xl"
                }`}
              >
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: "🏆", text: "1000+ Inspeksi" },
                    { icon: "👨‍🔧", text: "Teknisi Pro" },
                    { icon: "⭐", text: "Rating 4.9/5" },
                    { icon: "💯", text: "Garansi" },
                  ].map((badge, index) => (
                    <div
                      key={index}
                      className={`flex items-center space-x-2 p-3 rounded-xl ${
                        isDarkMode ? "bg-slate-800" : "bg-gray-50"
                      }`}
                    >
                      <span className="text-2xl">{badge.icon}</span>
                      <span
                        className={`font-bold text-sm ${
                          isDarkMode ? "text-white" : "text-gray-700"
                        }`}
                      >
                        {badge.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default InspeksiPage;
