"use client";

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
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
  Loader2,
  RefreshCw,
} from "lucide-react";
import { AppDispatch, RootState } from "@/lib/state/store";
import {
  getCalculatorOptions,
  getModelsByBrandForCalculator,
  getYearsByVariantForCalculator,
  calculatePrice,
  resetCalculator,
} from "@/lib/state/slice/price-calculator/priceCalculatorSlice";
import { getVariantsByModelId } from "@/lib/state/slice/variant/variantSlice";
import { getAdjustmentsByModelId } from "@/lib/state/slice/price-adjustment/priceAdjustmentSlice";

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

// Format compact untuk mobile
const formatCompact = (value: number): string => {
  if (Math.abs(value) >= 1000000000) {
    return `${value < 0 ? "-" : ""}${(Math.abs(value) / 1000000000).toFixed(1)}M`;
  }
  if (Math.abs(value) >= 1000000) {
    return `${value < 0 ? "-" : ""}${(Math.abs(value) / 1000000).toFixed(0)}jt`;
  }
  return formatCurrency(value);
};

const Kalkulator = () => {
  const dispatch = useDispatch<AppDispatch>();

  const {
    options,
    modelsByBrand,
    yearsByVariant,
    calculationResult,
    loading,
    error,
  } = useSelector((state: RootState) => state.priceCalculator);
  const { data: variants, loading: variantsLoading } = useSelector(
    (state: RootState) => state.variant,
  );
  const { adjustmentsByModel, loading: adjustmentsLoading } = useSelector(
    (state: RootState) => state.priceAdjustment,
  );

  const [selectedBrandId, setSelectedBrandId] = useState<string>("");
  const [selectedModelId, setSelectedModelId] = useState<string>("");
  const [selectedVariantId, setSelectedVariantId] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedTransmission, setSelectedTransmission] = useState<string>("");
  const [selectedOwnership, setSelectedOwnership] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    dispatch(getCalculatorOptions());
  }, [dispatch]);

  useEffect(() => {
    if (selectedBrandId) {
      dispatch(getModelsByBrandForCalculator(selectedBrandId));
      setSelectedModelId("");
      setSelectedVariantId("");
      setSelectedYear(null);
      setSelectedTransmission("");
      setSelectedOwnership("");
      setSelectedColor("");
      setShowResult(false);
    }
  }, [selectedBrandId, dispatch]);

  useEffect(() => {
    if (selectedModelId) {
      dispatch(getVariantsByModelId({ modelId: selectedModelId }));
      dispatch(getAdjustmentsByModelId(selectedModelId));
      setSelectedVariantId("");
      setSelectedYear(null);
      setSelectedTransmission("");
      setSelectedOwnership("");
      setSelectedColor("");
      setShowResult(false);
    }
  }, [selectedModelId, dispatch]);

  useEffect(() => {
    if (selectedVariantId) {
      dispatch(getYearsByVariantForCalculator(selectedVariantId));
      setSelectedYear(null);
      setShowResult(false);
    }
  }, [selectedVariantId, dispatch]);

  const handleCalculate = () => {
    if (
      !selectedVariantId ||
      !selectedYear ||
      !selectedTransmission ||
      !selectedOwnership ||
      !selectedColor
    ) {
      return;
    }
    dispatch(
      calculatePrice({
        variantId: selectedVariantId,
        year: selectedYear,
        transmissionCode: selectedTransmission,
        ownershipCode: selectedOwnership,
        colorCode: selectedColor,
      }),
    );
    setShowResult(true);
  };

  const handleReset = () => {
    setSelectedBrandId("");
    setSelectedModelId("");
    setSelectedVariantId("");
    setSelectedYear(null);
    setSelectedTransmission("");
    setSelectedOwnership("");
    setSelectedColor("");
    setShowResult(false);
    dispatch(resetCalculator());
  };

  const isFormComplete =
    selectedVariantId &&
    selectedYear &&
    selectedTransmission &&
    selectedOwnership &&
    selectedColor;

  // Common classes
  const selectClass =
    "w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 border border-white/20 rounded-xl text-white text-sm sm:text-base appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500/50 disabled:opacity-50";

  const labelClass =
    "flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium text-white/80 mb-1.5 sm:mb-2";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      <div className="relative py-6 sm:py-8 md:py-12 px-3 sm:px-4 md:px-6 lg:px-8">
        {/* Background Decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-48 sm:w-64 md:w-96 h-48 sm:h-64 md:h-96 bg-purple-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-48 sm:w-64 md:w-96 h-48 sm:h-64 md:h-96 bg-blue-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8 md:mb-12">
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-purple-500/20 rounded-full border border-purple-500/30 mb-4 sm:mb-6">
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-400" />
              <span className="text-xs sm:text-sm font-medium text-purple-300">
                Kalkulator Harga Mobil Bekas
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 sm:mb-4">
              Cek Harga Mobil Bekas
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-white/60 max-w-2xl mx-auto px-4">
              Dapatkan estimasi harga mobil bekas Anda secara akurat
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-300 text-center text-sm sm:text-base">
              {error}
            </div>
          )}

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {/* Form Section */}
            <div className="lg:col-span-2">
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-2xl border border-white/20">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
                  {/* Merek */}
                  <div>
                    <label className={labelClass}>
                      <Car className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      Merek Mobil
                    </label>
                    <div className="relative">
                      <select
                        value={selectedBrandId}
                        onChange={(e) => setSelectedBrandId(e.target.value)}
                        className={selectClass}
                        disabled={loading}
                      >
                        <option value="" className="bg-slate-900">
                          Pilih Merek
                        </option>
                        {options?.brands.map((brand) => (
                          <option
                            key={brand.id}
                            value={brand.id}
                            className="bg-slate-900"
                          >
                            {brand.name}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-white/50 pointer-events-none" />
                    </div>
                  </div>

                  {/* Model */}
                  <div>
                    <label className={labelClass}>
                      <Car className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      Model Mobil
                    </label>
                    <div className="relative">
                      <select
                        value={selectedModelId}
                        onChange={(e) => setSelectedModelId(e.target.value)}
                        className={selectClass}
                        disabled={!selectedBrandId || loading}
                      >
                        <option value="" className="bg-slate-900">
                          Pilih Model
                        </option>
                        {modelsByBrand?.models.map((model) => (
                          <option
                            key={model.id}
                            value={model.id}
                            className="bg-slate-900"
                          >
                            {model.modelName}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-white/50 pointer-events-none" />
                    </div>
                  </div>

                  {/* Tipe/Varian */}
                  <div>
                    <label className={labelClass}>
                      <Settings className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      Tipe/Seri
                    </label>
                    <div className="relative">
                      <select
                        value={selectedVariantId}
                        onChange={(e) => setSelectedVariantId(e.target.value)}
                        className={selectClass}
                        disabled={!selectedModelId || variantsLoading}
                      >
                        <option value="" className="bg-slate-900">
                          Pilih Tipe
                        </option>
                        {variants.map((variant) => (
                          <option
                            key={variant.id}
                            value={variant.id}
                            className="bg-slate-900"
                          >
                            {variant.variantName}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-white/50 pointer-events-none" />
                    </div>
                  </div>

                  {/* Tahun */}
                  <div>
                    <label className={labelClass}>
                      <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      Tahun
                    </label>
                    <div className="relative">
                      <select
                        value={selectedYear || ""}
                        onChange={(e) =>
                          setSelectedYear(Number(e.target.value))
                        }
                        className={selectClass}
                        disabled={!selectedVariantId}
                      >
                        <option value="" className="bg-slate-900">
                          Pilih Tahun
                        </option>
                        {yearsByVariant?.years.map((year) => (
                          <option
                            key={year}
                            value={year}
                            className="bg-slate-900"
                          >
                            {year}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-white/50 pointer-events-none" />
                    </div>
                  </div>

                  {/* Transmisi */}
                  <div className="sm:col-span-2">
                    <label className={labelClass}>
                      <Settings className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      Transmisi
                    </label>
                    <div className="grid grid-cols-2 gap-2 sm:gap-3">
                      {adjustmentsByModel?.adjustments.transmission.map(
                        (trans) => (
                          <button
                            key={trans.code}
                            onClick={() => {
                              setSelectedTransmission(trans.code);
                              setShowResult(false);
                            }}
                            disabled={!selectedModelId || adjustmentsLoading}
                            className={`px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border-2 transition-all flex items-center justify-center gap-1.5 sm:gap-2 disabled:opacity-50 text-xs sm:text-sm ${
                              selectedTransmission === trans.code
                                ? "bg-purple-600 border-purple-500 text-white"
                                : "bg-white/5 border-white/20 text-white/70 hover:bg-white/10"
                            }`}
                          >
                            <span>{trans.code === "matic" ? "⚙️" : "🔧"}</span>
                            <span className="font-medium">{trans.name}</span>
                            {trans.adjustmentValue !== 0 && (
                              <span
                                className={`text-[10px] sm:text-xs hidden sm:inline ${
                                  trans.adjustmentValue < 0
                                    ? "text-red-400"
                                    : "text-green-400"
                                }`}
                              >
                                ({formatCompact(trans.adjustmentValue)})
                              </span>
                            )}
                          </button>
                        ),
                      )}
                    </div>
                  </div>

                  {/* Kepemilikan */}
                  <div className="sm:col-span-2">
                    <label className={labelClass}>
                      <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      Kepemilikan
                    </label>
                    <div className="grid grid-cols-2 gap-2 sm:gap-3">
                      {adjustmentsByModel?.adjustments.ownership.map((own) => (
                        <button
                          key={own.code}
                          onClick={() => {
                            setSelectedOwnership(own.code);
                            setShowResult(false);
                          }}
                          disabled={!selectedModelId || adjustmentsLoading}
                          className={`px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border-2 transition-all flex items-center justify-center gap-1.5 sm:gap-2 disabled:opacity-50 text-xs sm:text-sm ${
                            selectedOwnership === own.code
                              ? "bg-purple-600 border-purple-500 text-white"
                              : "bg-white/5 border-white/20 text-white/70 hover:bg-white/10"
                          }`}
                        >
                          <span>{own.code === "personal" ? "👤" : "🏢"}</span>
                          <span className="font-medium">{own.name}</span>
                          {own.adjustmentValue !== 0 && (
                            <span
                              className={`text-[10px] sm:text-xs hidden sm:inline ${
                                own.adjustmentValue < 0
                                  ? "text-red-400"
                                  : "text-green-400"
                              }`}
                            >
                              ({formatCompact(own.adjustmentValue)})
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Warna */}
                  <div className="sm:col-span-2">
                    <label className={labelClass}>
                      <Palette className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      Warna
                    </label>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 sm:gap-3">
                      {adjustmentsByModel?.adjustments.color.map((color) => (
                        <button
                          key={color.code}
                          onClick={() => {
                            setSelectedColor(color.code);
                            setShowResult(false);
                          }}
                          disabled={!selectedModelId || adjustmentsLoading}
                          className={`px-2 sm:px-3 py-2 sm:py-3 rounded-xl border-2 transition-all flex flex-col items-center gap-1 sm:gap-2 disabled:opacity-50 ${
                            selectedColor === color.code
                              ? "bg-purple-600/30 border-purple-500"
                              : "bg-white/5 border-white/20 hover:bg-white/10"
                          }`}
                        >
                          <div
                            className="w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 border-white/30 shadow-lg"
                            style={{
                              backgroundColor: color.colorHex || "#888",
                            }}
                          />
                          <span className="text-[10px] sm:text-xs text-white/80 font-medium text-center leading-tight">
                            {color.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8">
                  <button
                    onClick={handleCalculate}
                    disabled={!isFormComplete || loading}
                    className="flex-1 px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg shadow-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                    ) : (
                      <Calculator className="w-4 h-4 sm:w-5 sm:h-5" />
                    )}
                    {loading ? "Menghitung..." : "Hitung Harga"}
                  </button>
                  <button
                    onClick={handleReset}
                    className="px-4 sm:px-6 py-3 sm:py-4 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-all border border-white/20 flex items-center justify-center gap-2 text-sm sm:text-base"
                  >
                    <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
                    Reset
                  </button>
                </div>
              </div>
            </div>

            {/* Result Sidebar */}
            <div className="lg:col-span-1">
              <div className="lg:sticky lg:top-20 space-y-4 sm:space-y-6">
                {/* Estimasi Harga Card */}
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl border border-white/20">
                  <div className="flex items-center gap-2 mb-4 sm:mb-6">
                    <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
                    <h2 className="text-lg sm:text-xl font-semibold text-white">
                      Estimasi Harga
                    </h2>
                  </div>

                  {showResult && calculationResult ? (
                    <div className="space-y-4 sm:space-y-6">
                      {/* Car Info */}
                      <div className="bg-white/5 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/10">
                        <p className="text-xs sm:text-sm text-white/60 mb-1">
                          Mobil Anda
                        </p>
                        <h3 className="text-sm sm:text-base md:text-lg font-bold text-white leading-tight">
                          {calculationResult.car.brandName}{" "}
                          {calculationResult.car.modelName}{" "}
                          {calculationResult.car.variantName}
                        </h3>
                        <p className="text-xs sm:text-sm text-white/60 mt-1">
                          {calculationResult.car.year} •{" "}
                          {calculationResult.conditions.transmission.name} •{" "}
                          {calculationResult.conditions.color.name}
                        </p>
                      </div>

                      {/* Price Breakdown */}
                      <div className="space-y-2 sm:space-y-3">
                        <div className="flex justify-between items-center py-2 border-b border-white/10">
                          <span className="text-white/70 text-xs sm:text-sm">
                            Harga Dasar
                          </span>
                          <span className="text-white font-medium text-xs sm:text-sm">
                            {formatCurrency(
                              calculationResult.priceBreakdown.basePrice,
                            )}
                          </span>
                        </div>

                        {calculationResult.priceBreakdown.adjustments.map(
                          (adj, index) => (
                            <div
                              key={index}
                              className="flex justify-between items-center py-2 border-b border-white/10"
                            >
                              <span className="text-white/70 text-xs sm:text-sm">
                                {adj.name}
                              </span>
                              <span
                                className={`font-medium text-xs sm:text-sm ${
                                  adj.amount > 0
                                    ? "text-green-400"
                                    : adj.amount < 0
                                      ? "text-red-400"
                                      : "text-white/50"
                                }`}
                              >
                                {adj.amount > 0
                                  ? `+${formatCurrency(adj.amount)}`
                                  : adj.amount < 0
                                    ? formatCurrency(adj.amount)
                                    : "-"}
                              </span>
                            </div>
                          ),
                        )}
                      </div>

                      {/* Final Price */}
                      <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-green-500/30">
                        <p className="text-xs sm:text-sm text-green-300 mb-1">
                          Estimasi Harga
                        </p>
                        <p className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
                          {formatCurrency(calculationResult.finalPrice)}
                        </p>
                      </div>

                      {/* Price Range */}
                      <div className="bg-white/5 rounded-xl p-3 sm:p-4 border border-white/10">
                        <p className="text-xs sm:text-sm text-white/60 mb-2">
                          Range Harga
                        </p>
                        <div className="flex justify-between text-white/80 text-xs sm:text-sm">
                          <span>
                            {formatCurrency(calculationResult.priceRange.min)}
                          </span>
                          <span>-</span>
                          <span>
                            {formatCurrency(calculationResult.priceRange.max)}
                          </span>
                        </div>
                      </div>

                      {/* Note */}
                      <div className="flex items-start gap-2 p-3 bg-blue-500/10 rounded-xl border border-blue-500/20">
                        <Info className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                        <p className="text-[10px] sm:text-xs text-blue-200/80">
                          {calculationResult.priceRange.note}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 sm:py-12">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 bg-white/5 rounded-full flex items-center justify-center">
                        <Car className="w-8 h-8 sm:w-10 sm:h-10 text-white/30" />
                      </div>
                      <p className="text-white/50 text-sm sm:text-base px-4">
                        Lengkapi data mobil Anda untuk melihat estimasi harga
                      </p>
                    </div>
                  )}
                </div>

                {/* Tips Card */}
                <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 backdrop-blur-xl rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-amber-500/20">
                  <h3 className="text-xs sm:text-sm font-semibold text-amber-300 mb-2 sm:mb-3">
                    💡 Tips Jual Mobil
                  </h3>
                  <ul className="space-y-1.5 sm:space-y-2 text-[10px] sm:text-xs text-white/70">
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
    </div>
  );
};

export default Kalkulator;
