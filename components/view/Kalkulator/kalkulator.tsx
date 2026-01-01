"use client";

import React, { useState, useMemo } from "react";
import {
  Car,
  Calendar,
  Settings,
  User,
  Palette,
  Calculator,
  ChevronDown,
  Sparkles,
  TrendingUp,
  Info,
} from "lucide-react";

// Data dummy mobil
const carBrands = [
  { id: 1, name: "Toyota", logo: "🚗" },
  { id: 2, name: "Honda", logo: "🚙" },
  { id: 3, name: "Daihatsu", logo: "🚐" },
  { id: 4, name: "Suzuki", logo: "🚕" },
  { id: 5, name: "Mitsubishi", logo: "🚘" },
];

const carModels: Record<
  string,
  { id: number; name: string; series: string[] }[]
> = {
  Toyota: [
    { id: 1, name: "Avanza", series: ["E", "G", "Veloz"] },
    { id: 2, name: "Innova", series: ["G", "V", "Venturer"] },
    { id: 3, name: "Rush", series: ["S", "G", "TRD"] },
    { id: 4, name: "Fortuner", series: ["G", "VRZ", "SRZ", "GR Sport"] },
  ],
  Honda: [
    { id: 1, name: "Brio", series: ["S", "E", "RS"] },
    { id: 2, name: "Jazz", series: ["S", "RS"] },
    { id: 3, name: "HR-V", series: ["S", "E", "SE", "Prestige"] },
    { id: 4, name: "CR-V", series: ["2.0", "1.5 Turbo", "Prestige"] },
  ],
  Daihatsu: [
    { id: 1, name: "Xenia", series: ["M", "X", "R"] },
    { id: 2, name: "Terios", series: ["X", "R", "R Adventure"] },
    { id: 3, name: "Sigra", series: ["D", "M", "X", "R"] },
  ],
  Suzuki: [
    { id: 1, name: "Ertiga", series: ["GA", "GL", "GX", "Sport"] },
    { id: 2, name: "XL7", series: ["Zeta", "Beta", "Alpha"] },
    { id: 3, name: "Ignis", series: ["GL", "GX"] },
  ],
  Mitsubishi: [
    { id: 1, name: "Xpander", series: ["GLS", "Exceed", "Sport", "Cross"] },
    { id: 2, name: "Pajero Sport", series: ["GLX", "Exceed", "Dakar"] },
  ],
};

const years = Array.from({ length: 12 }, (_, i) => 2024 - i);

const transmissions = [
  { id: "matic", name: "Matic (Automatic)", icon: "⚙️" },
  { id: "manual", name: "Manual", icon: "🔧" },
];

const ownershipTypes = [
  { id: "personal", name: "Atas Nama Orang", icon: "👤" },
  { id: "company", name: "Atas Nama PT/Perusahaan", icon: "🏢" },
];

const colors = [
  { id: "hitam", name: "Hitam", hex: "#1a1a1a" },
  { id: "putih", name: "Putih", hex: "#ffffff" },
  { id: "silver", name: "Silver", hex: "#c0c0c0" },
  { id: "merah", name: "Merah", hex: "#dc2626" },
  { id: "biru", name: "Biru", hex: "#2563eb" },
  { id: "abu-abu", name: "Abu-abu", hex: "#6b7280" },
];

// Harga dasar mobil (dummy)
const basePrices: Record<
  string,
  Record<string, Record<string, Record<number, number>>>
> = {
  Toyota: {
    Avanza: {
      E: {
        2024: 210000000,
        2023: 195000000,
        2022: 180000000,
        2021: 165000000,
        2020: 150000000,
        2019: 135000000,
        2018: 125000000,
        2017: 115000000,
        2016: 105000000,
        2015: 95000000,
        2014: 85000000,
        2013: 75000000,
      },
      G: {
        2024: 240000000,
        2023: 220000000,
        2022: 200000000,
        2021: 185000000,
        2020: 170000000,
        2019: 155000000,
        2018: 140000000,
        2017: 130000000,
        2016: 120000000,
        2015: 110000000,
        2014: 100000000,
        2013: 90000000,
      },
      Veloz: {
        2024: 280000000,
        2023: 260000000,
        2022: 240000000,
        2021: 220000000,
        2020: 200000000,
        2019: 180000000,
        2018: 165000000,
        2017: 150000000,
        2016: 140000000,
        2015: 130000000,
        2014: 120000000,
        2013: 110000000,
      },
    },
    Innova: {
      G: {
        2024: 380000000,
        2023: 350000000,
        2022: 320000000,
        2021: 300000000,
        2020: 280000000,
        2019: 260000000,
        2018: 240000000,
        2017: 220000000,
        2016: 200000000,
        2015: 180000000,
        2014: 165000000,
        2013: 150000000,
      },
      V: {
        2024: 450000000,
        2023: 420000000,
        2022: 390000000,
        2021: 360000000,
        2020: 330000000,
        2019: 300000000,
        2018: 280000000,
        2017: 260000000,
        2016: 240000000,
        2015: 220000000,
        2014: 200000000,
        2013: 180000000,
      },
      Venturer: {
        2024: 520000000,
        2023: 480000000,
        2022: 450000000,
        2021: 420000000,
        2020: 390000000,
        2019: 360000000,
        2018: 340000000,
        2017: 320000000,
        2016: 300000000,
        2015: 0,
        2014: 0,
        2013: 0,
      },
    },
    Rush: {
      S: {
        2024: 270000000,
        2023: 250000000,
        2022: 230000000,
        2021: 210000000,
        2020: 190000000,
        2019: 175000000,
        2018: 160000000,
        2017: 145000000,
        2016: 130000000,
        2015: 120000000,
        2014: 110000000,
        2013: 100000000,
      },
      G: {
        2024: 300000000,
        2023: 280000000,
        2022: 260000000,
        2021: 240000000,
        2020: 220000000,
        2019: 200000000,
        2018: 185000000,
        2017: 170000000,
        2016: 155000000,
        2015: 140000000,
        2014: 130000000,
        2013: 120000000,
      },
      TRD: {
        2024: 340000000,
        2023: 320000000,
        2022: 300000000,
        2021: 280000000,
        2020: 260000000,
        2019: 240000000,
        2018: 220000000,
        2017: 200000000,
        2016: 185000000,
        2015: 170000000,
        2014: 155000000,
        2013: 145000000,
      },
    },
    Fortuner: {
      G: {
        2024: 520000000,
        2023: 480000000,
        2022: 450000000,
        2021: 420000000,
        2020: 400000000,
        2019: 380000000,
        2018: 360000000,
        2017: 340000000,
        2016: 320000000,
        2015: 300000000,
        2014: 280000000,
        2013: 260000000,
      },
      VRZ: {
        2024: 620000000,
        2023: 580000000,
        2022: 550000000,
        2021: 520000000,
        2020: 500000000,
        2019: 480000000,
        2018: 450000000,
        2017: 420000000,
        2016: 400000000,
        2015: 380000000,
        2014: 350000000,
        2013: 330000000,
      },
      SRZ: {
        2024: 580000000,
        2023: 540000000,
        2022: 510000000,
        2021: 480000000,
        2020: 460000000,
        2019: 440000000,
        2018: 420000000,
        2017: 400000000,
        2016: 380000000,
        2015: 360000000,
        2014: 340000000,
        2013: 320000000,
      },
      "GR Sport": {
        2024: 700000000,
        2023: 650000000,
        2022: 620000000,
        2021: 590000000,
        2020: 560000000,
        2019: 0,
        2018: 0,
        2017: 0,
        2016: 0,
        2015: 0,
        2014: 0,
        2013: 0,
      },
    },
  },
  Honda: {
    Brio: {
      S: {
        2024: 160000000,
        2023: 150000000,
        2022: 140000000,
        2021: 130000000,
        2020: 120000000,
        2019: 110000000,
        2018: 100000000,
        2017: 95000000,
        2016: 90000000,
        2015: 85000000,
        2014: 80000000,
        2013: 75000000,
      },
      E: {
        2024: 180000000,
        2023: 170000000,
        2022: 160000000,
        2021: 150000000,
        2020: 140000000,
        2019: 130000000,
        2018: 120000000,
        2017: 110000000,
        2016: 100000000,
        2015: 95000000,
        2014: 90000000,
        2013: 85000000,
      },
      RS: {
        2024: 220000000,
        2023: 205000000,
        2022: 190000000,
        2021: 175000000,
        2020: 160000000,
        2019: 150000000,
        2018: 140000000,
        2017: 130000000,
        2016: 120000000,
        2015: 110000000,
        2014: 100000000,
        2013: 95000000,
      },
    },
    Jazz: {
      S: {
        2024: 260000000,
        2023: 245000000,
        2022: 230000000,
        2021: 215000000,
        2020: 200000000,
        2019: 185000000,
        2018: 170000000,
        2017: 155000000,
        2016: 145000000,
        2015: 135000000,
        2014: 125000000,
        2013: 115000000,
      },
      RS: {
        2024: 300000000,
        2023: 280000000,
        2022: 260000000,
        2021: 245000000,
        2020: 230000000,
        2019: 215000000,
        2018: 200000000,
        2017: 185000000,
        2016: 170000000,
        2015: 160000000,
        2014: 150000000,
        2013: 140000000,
      },
    },
    "HR-V": {
      S: {
        2024: 350000000,
        2023: 330000000,
        2022: 310000000,
        2021: 290000000,
        2020: 275000000,
        2019: 260000000,
        2018: 245000000,
        2017: 230000000,
        2016: 215000000,
        2015: 200000000,
        2014: 0,
        2013: 0,
      },
      E: {
        2024: 390000000,
        2023: 365000000,
        2022: 340000000,
        2021: 320000000,
        2020: 300000000,
        2019: 285000000,
        2018: 270000000,
        2017: 255000000,
        2016: 240000000,
        2015: 225000000,
        2014: 0,
        2013: 0,
      },
      SE: {
        2024: 430000000,
        2023: 400000000,
        2022: 375000000,
        2021: 350000000,
        2020: 330000000,
        2019: 310000000,
        2018: 295000000,
        2017: 280000000,
        2016: 265000000,
        2015: 250000000,
        2014: 0,
        2013: 0,
      },
      Prestige: {
        2024: 480000000,
        2023: 450000000,
        2022: 420000000,
        2021: 395000000,
        2020: 370000000,
        2019: 350000000,
        2018: 330000000,
        2017: 310000000,
        2016: 290000000,
        2015: 275000000,
        2014: 0,
        2013: 0,
      },
    },
    "CR-V": {
      "2.0": {
        2024: 470000000,
        2023: 440000000,
        2022: 410000000,
        2021: 385000000,
        2020: 360000000,
        2019: 340000000,
        2018: 320000000,
        2017: 300000000,
        2016: 280000000,
        2015: 260000000,
        2014: 240000000,
        2013: 220000000,
      },
      "1.5 Turbo": {
        2024: 530000000,
        2023: 500000000,
        2022: 470000000,
        2021: 445000000,
        2020: 420000000,
        2019: 400000000,
        2018: 380000000,
        2017: 360000000,
        2016: 0,
        2015: 0,
        2014: 0,
        2013: 0,
      },
      Prestige: {
        2024: 600000000,
        2023: 560000000,
        2022: 530000000,
        2021: 500000000,
        2020: 475000000,
        2019: 450000000,
        2018: 430000000,
        2017: 410000000,
        2016: 0,
        2015: 0,
        2014: 0,
        2013: 0,
      },
    },
  },
  Daihatsu: {
    Xenia: {
      M: {
        2024: 190000000,
        2023: 175000000,
        2022: 160000000,
        2021: 150000000,
        2020: 140000000,
        2019: 130000000,
        2018: 120000000,
        2017: 110000000,
        2016: 100000000,
        2015: 95000000,
        2014: 90000000,
        2013: 85000000,
      },
      X: {
        2024: 210000000,
        2023: 195000000,
        2022: 180000000,
        2021: 170000000,
        2020: 160000000,
        2019: 150000000,
        2018: 140000000,
        2017: 130000000,
        2016: 120000000,
        2015: 110000000,
        2014: 100000000,
        2013: 95000000,
      },
      R: {
        2024: 240000000,
        2023: 225000000,
        2022: 210000000,
        2021: 195000000,
        2020: 180000000,
        2019: 165000000,
        2018: 155000000,
        2017: 145000000,
        2016: 135000000,
        2015: 125000000,
        2014: 115000000,
        2013: 105000000,
      },
    },
    Terios: {
      X: {
        2024: 250000000,
        2023: 235000000,
        2022: 220000000,
        2021: 205000000,
        2020: 190000000,
        2019: 175000000,
        2018: 165000000,
        2017: 155000000,
        2016: 145000000,
        2015: 135000000,
        2014: 125000000,
        2013: 115000000,
      },
      R: {
        2024: 280000000,
        2023: 260000000,
        2022: 245000000,
        2021: 230000000,
        2020: 215000000,
        2019: 200000000,
        2018: 185000000,
        2017: 175000000,
        2016: 165000000,
        2015: 155000000,
        2014: 145000000,
        2013: 135000000,
      },
      "R Adventure": {
        2024: 310000000,
        2023: 290000000,
        2022: 270000000,
        2021: 255000000,
        2020: 240000000,
        2019: 225000000,
        2018: 210000000,
        2017: 195000000,
        2016: 185000000,
        2015: 175000000,
        2014: 165000000,
        2013: 155000000,
      },
    },
    Sigra: {
      D: {
        2024: 140000000,
        2023: 130000000,
        2022: 120000000,
        2021: 110000000,
        2020: 105000000,
        2019: 100000000,
        2018: 95000000,
        2017: 90000000,
        2016: 85000000,
        2015: 0,
        2014: 0,
        2013: 0,
      },
      M: {
        2024: 155000000,
        2023: 145000000,
        2022: 135000000,
        2021: 125000000,
        2020: 118000000,
        2019: 112000000,
        2018: 106000000,
        2017: 100000000,
        2016: 95000000,
        2015: 0,
        2014: 0,
        2013: 0,
      },
      X: {
        2024: 170000000,
        2023: 160000000,
        2022: 150000000,
        2021: 140000000,
        2020: 132000000,
        2019: 125000000,
        2018: 118000000,
        2017: 112000000,
        2016: 106000000,
        2015: 0,
        2014: 0,
        2013: 0,
      },
      R: {
        2024: 190000000,
        2023: 175000000,
        2022: 165000000,
        2021: 155000000,
        2020: 145000000,
        2019: 138000000,
        2018: 130000000,
        2017: 123000000,
        2016: 116000000,
        2015: 0,
        2014: 0,
        2013: 0,
      },
    },
  },
  Suzuki: {
    Ertiga: {
      GA: {
        2024: 220000000,
        2023: 205000000,
        2022: 190000000,
        2021: 175000000,
        2020: 165000000,
        2019: 155000000,
        2018: 145000000,
        2017: 135000000,
        2016: 125000000,
        2015: 115000000,
        2014: 105000000,
        2013: 95000000,
      },
      GL: {
        2024: 250000000,
        2023: 235000000,
        2022: 220000000,
        2021: 205000000,
        2020: 190000000,
        2019: 175000000,
        2018: 165000000,
        2017: 155000000,
        2016: 145000000,
        2015: 135000000,
        2014: 125000000,
        2013: 115000000,
      },
      GX: {
        2024: 280000000,
        2023: 265000000,
        2022: 250000000,
        2021: 235000000,
        2020: 220000000,
        2019: 205000000,
        2018: 190000000,
        2017: 175000000,
        2016: 165000000,
        2015: 155000000,
        2014: 145000000,
        2013: 135000000,
      },
      Sport: {
        2024: 310000000,
        2023: 290000000,
        2022: 270000000,
        2021: 255000000,
        2020: 240000000,
        2019: 225000000,
        2018: 210000000,
        2017: 195000000,
        2016: 185000000,
        2015: 175000000,
        2014: 165000000,
        2013: 155000000,
      },
    },
    XL7: {
      Zeta: {
        2024: 270000000,
        2023: 255000000,
        2022: 240000000,
        2021: 225000000,
        2020: 210000000,
        2019: 0,
        2018: 0,
        2017: 0,
        2016: 0,
        2015: 0,
        2014: 0,
        2013: 0,
      },
      Beta: {
        2024: 295000000,
        2023: 280000000,
        2022: 265000000,
        2021: 250000000,
        2020: 235000000,
        2019: 0,
        2018: 0,
        2017: 0,
        2016: 0,
        2015: 0,
        2014: 0,
        2013: 0,
      },
      Alpha: {
        2024: 320000000,
        2023: 305000000,
        2022: 290000000,
        2021: 275000000,
        2020: 260000000,
        2019: 0,
        2018: 0,
        2017: 0,
        2016: 0,
        2015: 0,
        2014: 0,
        2013: 0,
      },
    },
    Ignis: {
      GL: {
        2024: 195000000,
        2023: 180000000,
        2022: 170000000,
        2021: 160000000,
        2020: 150000000,
        2019: 140000000,
        2018: 130000000,
        2017: 120000000,
        2016: 0,
        2015: 0,
        2014: 0,
        2013: 0,
      },
      GX: {
        2024: 220000000,
        2023: 205000000,
        2022: 195000000,
        2021: 185000000,
        2020: 175000000,
        2019: 165000000,
        2018: 155000000,
        2017: 145000000,
        2016: 0,
        2015: 0,
        2014: 0,
        2013: 0,
      },
    },
  },
  Mitsubishi: {
    Xpander: {
      GLS: {
        2024: 270000000,
        2023: 255000000,
        2022: 240000000,
        2021: 225000000,
        2020: 210000000,
        2019: 195000000,
        2018: 185000000,
        2017: 175000000,
        2016: 0,
        2015: 0,
        2014: 0,
        2013: 0,
      },
      Exceed: {
        2024: 290000000,
        2023: 275000000,
        2022: 260000000,
        2021: 245000000,
        2020: 230000000,
        2019: 215000000,
        2018: 200000000,
        2017: 190000000,
        2016: 0,
        2015: 0,
        2014: 0,
        2013: 0,
      },
      Sport: {
        2024: 320000000,
        2023: 300000000,
        2022: 285000000,
        2021: 270000000,
        2020: 255000000,
        2019: 240000000,
        2018: 225000000,
        2017: 0,
        2016: 0,
        2015: 0,
        2014: 0,
        2013: 0,
      },
      Cross: {
        2024: 380000000,
        2023: 360000000,
        2022: 340000000,
        2021: 320000000,
        2020: 300000000,
        2019: 0,
        2018: 0,
        2017: 0,
        2016: 0,
        2015: 0,
        2014: 0,
        2013: 0,
      },
    },
    "Pajero Sport": {
      GLX: {
        2024: 520000000,
        2023: 490000000,
        2022: 460000000,
        2021: 435000000,
        2020: 410000000,
        2019: 390000000,
        2018: 370000000,
        2017: 350000000,
        2016: 330000000,
        2015: 310000000,
        2014: 290000000,
        2013: 270000000,
      },
      Exceed: {
        2024: 580000000,
        2023: 545000000,
        2022: 515000000,
        2021: 485000000,
        2020: 460000000,
        2019: 435000000,
        2018: 415000000,
        2017: 395000000,
        2016: 375000000,
        2015: 355000000,
        2014: 335000000,
        2013: 315000000,
      },
      Dakar: {
        2024: 650000000,
        2023: 610000000,
        2022: 575000000,
        2021: 545000000,
        2020: 515000000,
        2019: 490000000,
        2018: 465000000,
        2017: 445000000,
        2016: 425000000,
        2015: 405000000,
        2014: 385000000,
        2013: 365000000,
      },
    },
  },
};

// Fungsi untuk menghitung penyesuaian harga
const calculatePriceAdjustments = (
  basePrice: number,
  transmission: string,
  ownership: string,
  color: string
) => {
  let adjustedPrice = basePrice;
  const adjustments: { label: string; value: number }[] = [];

  // Penyesuaian berdasarkan transmisi
  // Matic biasanya lebih mahal +5juta dari manual
  if (transmission === "matic") {
    const maticBonus = 5000000;
    adjustedPrice += maticBonus;
    adjustments.push({ label: "Transmisi Matic", value: maticBonus });
  } else {
    adjustments.push({ label: "Transmisi Manual", value: 0 });
  }

  // Penyesuaian berdasarkan kepemilikan
  // Atas nama PT biasanya -5juta dari atas nama orang
  if (ownership === "company") {
    const companyDiscount = -5000000;
    adjustedPrice += companyDiscount;
    adjustments.push({ label: "Atas Nama PT", value: companyDiscount });
  } else {
    adjustments.push({ label: "Atas Nama Orang", value: 0 });
  }

  // Penyesuaian berdasarkan warna
  // Hitam adalah warna paling populer (0 adjustment)
  // Putih sedikit kurang populer (-3juta)
  // Warna lain (-5juta)
  if (color === "hitam") {
    adjustments.push({ label: "Warna Hitam (Populer)", value: 0 });
  } else if (color === "putih") {
    const colorDiscount = -3000000;
    adjustedPrice += colorDiscount;
    adjustments.push({ label: "Warna Putih", value: colorDiscount });
  } else if (color === "silver") {
    const colorDiscount = -2000000;
    adjustedPrice += colorDiscount;
    adjustments.push({ label: "Warna Silver", value: colorDiscount });
  } else {
    const colorDiscount = -5000000;
    adjustedPrice += colorDiscount;
    adjustments.push({ label: `Warna Lainnya`, value: colorDiscount });
  }

  return { adjustedPrice, adjustments };
};

const Kalkulator = () => {
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedSeries, setSelectedSeries] = useState("");
  const [selectedYear, setSelectedYear] = useState<number>(2024);
  const [selectedTransmission, setSelectedTransmission] = useState("matic");
  const [selectedOwnership, setSelectedOwnership] = useState("personal");
  const [selectedColor, setSelectedColor] = useState("hitam");
  const [showResult, setShowResult] = useState(false);

  const availableModels = selectedBrand ? carModels[selectedBrand] || [] : [];
  const availableSeries = selectedModel
    ? availableModels.find((m) => m.name === selectedModel)?.series || []
    : [];

  const priceResult = useMemo(() => {
    if (!selectedBrand || !selectedModel || !selectedSeries || !selectedYear) {
      return null;
    }

    const brandPrices = basePrices[selectedBrand];
    if (!brandPrices) return null;

    const modelPrices = brandPrices[selectedModel];
    if (!modelPrices) return null;

    const seriesPrices = modelPrices[selectedSeries];
    if (!seriesPrices) return null;

    const basePrice = seriesPrices[selectedYear];
    if (!basePrice || basePrice === 0) return null;

    const { adjustedPrice, adjustments } = calculatePriceAdjustments(
      basePrice,
      selectedTransmission,
      selectedOwnership,
      selectedColor
    );

    return {
      basePrice,
      adjustedPrice,
      adjustments,
    };
  }, [
    selectedBrand,
    selectedModel,
    selectedSeries,
    selectedYear,
    selectedTransmission,
    selectedOwnership,
    selectedColor,
  ]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleCalculate = () => {
    if (priceResult) {
      setShowResult(true);
    }
  };

  const handleReset = () => {
    setSelectedBrand("");
    setSelectedModel("");
    setSelectedSeries("");
    setSelectedYear(2024);
    setSelectedTransmission("matic");
    setSelectedOwnership("personal");
    setSelectedColor("hitam");
    setShowResult(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 py-12">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

        <div className="relative container mx-auto px-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
              <Calculator className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              Kalkulator Harga Mobil Bekas
            </h1>
          </div>
          <p className="text-center text-white/80 text-lg max-w-2xl mx-auto">
            Cek estimasi harga mobil bekas Anda secara akurat berdasarkan merk,
            model, tahun, transmisi, kepemilikan, dan warna
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 -mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 md:p-8 shadow-2xl border border-white/20">
              <div className="flex items-center gap-2 mb-6">
                <Sparkles className="w-5 h-5 text-yellow-400" />
                <h2 className="text-xl font-semibold text-white">
                  Detail Mobil
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Brand Selection */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-white/80">
                    <Car className="w-4 h-4" />
                    Merk Mobil
                  </label>
                  <div className="relative">
                    <select
                      value={selectedBrand}
                      onChange={(e) => {
                        setSelectedBrand(e.target.value);
                        setSelectedModel("");
                        setSelectedSeries("");
                        setShowResult(false);
                      }}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    >
                      <option value="" className="bg-slate-800">
                        Pilih Merk
                      </option>
                      {carBrands.map((brand) => (
                        <option
                          key={brand.id}
                          value={brand.name}
                          className="bg-slate-800"
                        >
                          {brand.logo} {brand.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50 pointer-events-none" />
                  </div>
                </div>

                {/* Model Selection */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-white/80">
                    <Car className="w-4 h-4" />
                    Model Mobil
                  </label>
                  <div className="relative">
                    <select
                      value={selectedModel}
                      onChange={(e) => {
                        setSelectedModel(e.target.value);
                        setSelectedSeries("");
                        setShowResult(false);
                      }}
                      disabled={!selectedBrand}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="" className="bg-slate-800">
                        Pilih Model
                      </option>
                      {availableModels.map((model) => (
                        <option
                          key={model.id}
                          value={model.name}
                          className="bg-slate-800"
                        >
                          {model.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50 pointer-events-none" />
                  </div>
                </div>

                {/* Series Selection */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-white/80">
                    <Settings className="w-4 h-4" />
                    Tipe/Seri
                  </label>
                  <div className="relative">
                    <select
                      value={selectedSeries}
                      onChange={(e) => {
                        setSelectedSeries(e.target.value);
                        setShowResult(false);
                      }}
                      disabled={!selectedModel}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="" className="bg-slate-800">
                        Pilih Tipe
                      </option>
                      {availableSeries.map((series) => (
                        <option
                          key={series}
                          value={series}
                          className="bg-slate-800"
                        >
                          {series}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50 pointer-events-none" />
                  </div>
                </div>

                {/* Year Selection */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-white/80">
                    <Calendar className="w-4 h-4" />
                    Tahun
                  </label>
                  <div className="relative">
                    <select
                      value={selectedYear}
                      onChange={(e) => {
                        setSelectedYear(Number(e.target.value));
                        setShowResult(false);
                      }}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    >
                      {years.map((year) => (
                        <option
                          key={year}
                          value={year}
                          className="bg-slate-800"
                        >
                          {year}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50 pointer-events-none" />
                  </div>
                </div>

                {/* Transmission Selection */}
                <div className="space-y-2 md:col-span-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-white/80">
                    <Settings className="w-4 h-4" />
                    Transmisi
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {transmissions.map((trans) => (
                      <button
                        key={trans.id}
                        onClick={() => {
                          setSelectedTransmission(trans.id);
                          setShowResult(false);
                        }}
                        className={`px-4 py-3 rounded-xl border-2 transition-all flex items-center justify-center gap-2 ${
                          selectedTransmission === trans.id
                            ? "bg-purple-600 border-purple-500 text-white"
                            : "bg-white/5 border-white/20 text-white/70 hover:bg-white/10"
                        }`}
                      >
                        <span>{trans.icon}</span>
                        <span className="font-medium">{trans.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Ownership Selection */}
                <div className="space-y-2 md:col-span-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-white/80">
                    <User className="w-4 h-4" />
                    Kepemilikan
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {ownershipTypes.map((ownership) => (
                      <button
                        key={ownership.id}
                        onClick={() => {
                          setSelectedOwnership(ownership.id);
                          setShowResult(false);
                        }}
                        className={`px-4 py-3 rounded-xl border-2 transition-all flex items-center justify-center gap-2 ${
                          selectedOwnership === ownership.id
                            ? "bg-purple-600 border-purple-500 text-white"
                            : "bg-white/5 border-white/20 text-white/70 hover:bg-white/10"
                        }`}
                      >
                        <span>{ownership.icon}</span>
                        <span className="font-medium">{ownership.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color Selection */}
                <div className="space-y-2 md:col-span-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-white/80">
                    <Palette className="w-4 h-4" />
                    Warna
                  </label>
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                    {colors.map((color) => (
                      <button
                        key={color.id}
                        onClick={() => {
                          setSelectedColor(color.id);
                          setShowResult(false);
                        }}
                        className={`px-3 py-3 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                          selectedColor === color.id
                            ? "bg-purple-600/30 border-purple-500"
                            : "bg-white/5 border-white/20 hover:bg-white/10"
                        }`}
                      >
                        <div
                          className="w-8 h-8 rounded-full border-2 border-white/30 shadow-lg"
                          style={{ backgroundColor: color.hex }}
                        ></div>
                        <span className="text-xs text-white/80 font-medium">
                          {color.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <button
                  onClick={handleCalculate}
                  disabled={!priceResult}
                  className="flex-1 px-6 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg shadow-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Calculator className="w-5 h-5" />
                  Hitung Harga
                </button>
                <button
                  onClick={handleReset}
                  className="px-6 py-4 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-all border border-white/20"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>

          {/* Result Section */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/20">
                <div className="flex items-center gap-2 mb-6">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                  <h2 className="text-xl font-semibold text-white">
                    Estimasi Harga
                  </h2>
                </div>

                {showResult && priceResult ? (
                  <div className="space-y-6">
                    {/* Car Info */}
                    <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                      <p className="text-sm text-white/60 mb-1">Mobil Anda</p>
                      <h3 className="text-lg font-bold text-white">
                        {selectedBrand} {selectedModel} {selectedSeries}
                      </h3>
                      <p className="text-sm text-white/60">
                        {selectedYear} •{" "}
                        {selectedTransmission === "matic" ? "Matic" : "Manual"}{" "}
                        • {colors.find((c) => c.id === selectedColor)?.name}
                      </p>
                    </div>

                    {/* Base Price */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center py-2 border-b border-white/10">
                        <span className="text-white/70">Harga Dasar</span>
                        <span className="text-white font-medium">
                          {formatCurrency(priceResult.basePrice)}
                        </span>
                      </div>

                      {/* Adjustments */}
                      {priceResult.adjustments.map((adj, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center py-2 border-b border-white/10"
                        >
                          <span className="text-white/70 text-sm">
                            {adj.label}
                          </span>
                          <span
                            className={`font-medium ${
                              adj.value > 0
                                ? "text-green-400"
                                : adj.value < 0
                                ? "text-red-400"
                                : "text-white/50"
                            }`}
                          >
                            {adj.value > 0
                              ? `+${formatCurrency(adj.value)}`
                              : adj.value < 0
                              ? formatCurrency(adj.value)
                              : "-"}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Final Price */}
                    <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl p-5 border border-green-500/30">
                      <p className="text-sm text-green-300 mb-1">
                        Estimasi Harga
                      </p>
                      <p className="text-3xl font-bold text-white">
                        {formatCurrency(priceResult.adjustedPrice)}
                      </p>
                    </div>

                    {/* Info */}
                    <div className="flex items-start gap-2 p-3 bg-blue-500/10 rounded-xl border border-blue-500/20">
                      <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-blue-200/80">
                        Harga ini adalah estimasi berdasarkan kondisi pasar.
                        Harga aktual dapat berbeda tergantung kondisi fisik
                        mobil, kilometer, dan kelengkapan dokumen.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 mx-auto mb-4 bg-white/5 rounded-full flex items-center justify-center">
                      <Car className="w-10 h-10 text-white/30" />
                    </div>
                    <p className="text-white/50">
                      Lengkapi data mobil Anda untuk melihat estimasi harga
                    </p>
                  </div>
                )}
              </div>

              {/* Quick Tips */}
              <div className="mt-6 bg-gradient-to-br from-amber-500/10 to-orange-500/10 backdrop-blur-xl rounded-2xl p-5 border border-amber-500/20">
                <h3 className="text-sm font-semibold text-amber-300 mb-3">
                  💡 Tips Jual Mobil
                </h3>
                <ul className="space-y-2 text-xs text-white/70">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-400">•</span>
                    Mobil warna hitam & putih lebih diminati pasar
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-400">•</span>
                    Transmisi matic memiliki nilai jual lebih tinggi
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-400">•</span>
                    STNK atas nama pribadi lebih disukai pembeli
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-400">•</span>
                    Lengkapi service record untuk nilai tambah
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Kalkulator;
