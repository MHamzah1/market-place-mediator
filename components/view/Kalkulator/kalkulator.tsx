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
  RefreshCw,
  Star,
} from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { AppDispatch, RootState } from "@/lib/state/store";
import {
  getCalculatorOptions,
  getModelsByBrandForCalculator,
  getYearsByVariantForCalculator,
  resetCalculator,
  setCalculationResult,
} from "@/lib/state/slice/price-calculator/priceCalculatorSlice";
import { getVariantsByModelId } from "@/lib/state/slice/variant/variantSlice";
import { getAdjustmentsByModelId } from "@/lib/state/slice/price-adjustment/priceAdjustmentSlice";
import { calculatePriceClientSide } from "@/components/utils/CalculateClientSide";

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

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
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  const {
    options,
    modelsByBrand,
    yearsByVariant,
    calculationResult,
    loading,
    error,
  } = useSelector((state: RootState) => state.priceCalculator);
  const { data: variants = [], loading: variantsLoading } = useSelector(
    (state: RootState) => state.variant,
  );
  const { adjustmentsByModel, loading: adjustmentsLoading } = useSelector(
    (state: RootState) => state.priceAdjustment,
  );

  const [selectedBrandId, setSelectedBrandId] = useState<string>("");
  const [selectedModelId, setSelectedModelId] = useState<string>("");
  const [selectedVariantId, setSelectedVariantId] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedOwnership, setSelectedOwnership] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);

  // Get selected variant transmission
  const selectedVariant = variants.find((v) => v.id === selectedVariantId);
  const transmissionCode = selectedVariant?.transmissionType || "";

  useEffect(() => {
    dispatch(getCalculatorOptions());
  }, [dispatch]);

  useEffect(() => {
    if (selectedBrandId) {
      dispatch(getModelsByBrandForCalculator(selectedBrandId));
      setSelectedModelId("");
      setSelectedVariantId("");
      setSelectedYear(null);
      setSelectedOwnership("");
      setSelectedColor("");
      setSelectedFeatures([]);
      setShowResult(false);
    }
  }, [selectedBrandId, dispatch]);

  useEffect(() => {
    if (selectedModelId) {
      dispatch(getVariantsByModelId({ modelId: selectedModelId }));
      dispatch(getAdjustmentsByModelId(selectedModelId));
      setSelectedVariantId("");
      setSelectedYear(null);
      setSelectedOwnership("");
      setSelectedColor("");
      setSelectedFeatures([]);
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

  const handleFeatureToggle = (featureCode: string) => {
    setSelectedFeatures((prev) => {
      if (prev.includes(featureCode)) {
        return prev.filter((code) => code !== featureCode);
      }
      return [...prev, featureCode];
    });
    setShowResult(false);
  };

  // CLIENT-SIDE CALCULATION - No POST request!
  const handleCalculate = () => {
    if (
      !selectedVariantId ||
      !selectedYear ||
      !transmissionCode ||
      !selectedOwnership ||
      !selectedColor ||
      !yearsByVariant ||
      !adjustmentsByModel ||
      !selectedVariant
    ) {
      return;
    }

    try {
      // Calculate price on client side
      const result = calculatePriceClientSide({
        yearsByVariant,
        adjustmentsByModel,
        selectedYear,
        transmissionCode,
        ownershipCode: selectedOwnership,
        colorCode: selectedColor,
        selectedFeatureIds: selectedFeatures,
        variantId: selectedVariantId,
        variantName: selectedVariant.variantName,
      });

      // Dispatch result to Redux
      dispatch(setCalculationResult(result));
      setShowResult(true);
    } catch (error) {
      console.error("Error calculating price:", error);
    }
  };

  const handleReset = () => {
    setSelectedBrandId("");
    setSelectedModelId("");
    setSelectedVariantId("");
    setSelectedYear(null);
    setSelectedOwnership("");
    setSelectedColor("");
    setSelectedFeatures([]);
    setShowResult(false);
    dispatch(resetCalculator());
  };

  const isFormComplete =
    selectedVariantId &&
    selectedYear &&
    transmissionCode &&
    selectedOwnership &&
    selectedColor;

  const selectClass = `w-full px-3 sm:px-4 py-2.5 sm:py-3 ${
    isDarkMode
      ? "bg-slate-800 border-slate-700 text-white"
      : "bg-white border-gray-200 text-gray-900"
  } border rounded-xl text-sm sm:text-base appearance-none focus:outline-none focus:ring-2 ${
    isDarkMode ? "focus:ring-purple-500/50" : "focus:ring-blue-500/50"
  } disabled:opacity-50 transition-colors`;

  const labelClass = `flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium ${
    isDarkMode ? "text-slate-300" : "text-gray-700"
  } mb-1.5 sm:mb-2`;

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDarkMode
          ? "bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950"
          : "bg-gradient-to-br from-blue-50 via-purple-50 to-blue-50"
      }`}
    >
      <div className="relative py-6 sm:py-8 md:py-12 px-3 sm:px-4 md:px-6 lg:px-8">
        {/* Background Decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className={`absolute top-0 left-1/4 w-48 sm:w-64 md:w-96 h-48 sm:h-64 md:h-96 ${
              isDarkMode ? "bg-purple-500/10" : "bg-purple-300/20"
            } rounded-full blur-3xl`}
          />
          <div
            className={`absolute bottom-0 right-1/4 w-48 sm:w-64 md:w-96 h-48 sm:h-64 md:h-96 ${
              isDarkMode ? "bg-blue-500/10" : "bg-blue-300/20"
            } rounded-full blur-3xl`}
          />
        </div>

        <div className="relative max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8 md:mb-12">
            <div
              className={`inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border mb-4 sm:mb-6 ${
                isDarkMode
                  ? "bg-purple-500/20 border-purple-500/30"
                  : "bg-purple-100 border-purple-200"
              }`}
            >
              <Sparkles
                className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
                  isDarkMode ? "text-purple-400" : "text-purple-600"
                }`}
              />
              <span
                className={`text-xs sm:text-sm font-medium ${
                  isDarkMode ? "text-purple-300" : "text-purple-700"
                }`}
              >
                Kalkulator Harga Mobil Bekas
              </span>
            </div>
            <h1
              className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-4 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Cek Harga Mobil Bekas
            </h1>
            <p
              className={`text-sm sm:text-base md:text-lg max-w-2xl mx-auto px-4 ${
                isDarkMode ? "text-slate-400" : "text-gray-600"
              }`}
            >
              Dapatkan estimasi harga mobil bekas Anda secara akurat
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div
              className={`mb-4 sm:mb-6 p-3 sm:p-4 rounded-xl text-center text-sm sm:text-base ${
                isDarkMode
                  ? "bg-red-500/20 border border-red-500/30 text-red-300"
                  : "bg-red-50 border border-red-200 text-red-700"
              }`}
            >
              {error}
            </div>
          )}

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {/* Form Section */}
            <div className="lg:col-span-2">
              <div
                className={`rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-2xl border ${
                  isDarkMode
                    ? "bg-slate-900/50 backdrop-blur-xl border-slate-800"
                    : "bg-white/90 backdrop-blur-xl border-gray-200"
                }`}
              >
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
                        <option
                          value=""
                          className={isDarkMode ? "bg-slate-900" : "bg-white"}
                        >
                          Pilih Merek
                        </option>
                        {options?.brands?.map((brand) => (
                          <option
                            key={brand.id}
                            value={brand.id}
                            className={isDarkMode ? "bg-slate-900" : "bg-white"}
                          >
                            {brand.name}
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 pointer-events-none ${
                          isDarkMode ? "text-slate-400" : "text-gray-400"
                        }`}
                      />
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
                        <option
                          value=""
                          className={isDarkMode ? "bg-slate-900" : "bg-white"}
                        >
                          Pilih Model
                        </option>
                        {modelsByBrand?.models?.map((model) => (
                          <option
                            key={model.id}
                            value={model.id}
                            className={isDarkMode ? "bg-slate-900" : "bg-white"}
                          >
                            {model.modelName}
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 pointer-events-none ${
                          isDarkMode ? "text-slate-400" : "text-gray-400"
                        }`}
                      />
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
                        <option
                          value=""
                          className={isDarkMode ? "bg-slate-900" : "bg-white"}
                        >
                          Pilih Tipe
                        </option>
                        {variants?.map((variant) => (
                          <option
                            key={variant.id}
                            value={variant.id}
                            className={isDarkMode ? "bg-slate-900" : "bg-white"}
                          >
                            {variant.variantName} (
                            {variant.transmissionType === "matic"
                              ? "Matic"
                              : variant.transmissionType === "manual"
                                ? "Manual"
                                : "Both"}
                            )
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 pointer-events-none ${
                          isDarkMode ? "text-slate-400" : "text-gray-400"
                        }`}
                      />
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
                        <option
                          value=""
                          className={isDarkMode ? "bg-slate-900" : "bg-white"}
                        >
                          Pilih Tahun
                        </option>
                        {yearsByVariant?.years?.map((year) => (
                          <option
                            key={year}
                            value={year}
                            className={isDarkMode ? "bg-slate-900" : "bg-white"}
                          >
                            {year}
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 pointer-events-none ${
                          isDarkMode ? "text-slate-400" : "text-gray-400"
                        }`}
                      />
                    </div>
                  </div>

                  {/* Kepemilikan */}
                  <div className="sm:col-span-2">
                    <label className={labelClass}>
                      <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      Kepemilikan
                    </label>
                    <div className="grid grid-cols-2 gap-2 sm:gap-3">
                      {adjustmentsByModel?.adjustments?.ownership?.map(
                        (own) => (
                          <button
                            key={own.code}
                            onClick={() => {
                              setSelectedOwnership(own.code);
                              setShowResult(false);
                            }}
                            disabled={!selectedModelId || adjustmentsLoading}
                            className={`px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border-2 transition-all flex items-center justify-center gap-1.5 sm:gap-2 disabled:opacity-50 text-xs sm:text-sm ${
                              selectedOwnership === own.code
                                ? isDarkMode
                                  ? "bg-gradient-to-r from-purple-600 to-indigo-600 border-purple-500 text-white"
                                  : "bg-gradient-to-r from-blue-600 to-blue-700 border-blue-500 text-white"
                                : isDarkMode
                                  ? "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
                                  : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                            }`}
                          >
                            <span>
                              {own.code === "atas-nama-orang" ? "👤" : "🏢"}
                            </span>
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
                        ),
                      ) || null}
                    </div>
                  </div>

                  {/* Warna */}
                  <div className="sm:col-span-2">
                    <label className={labelClass}>
                      <Palette className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      Warna
                    </label>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 sm:gap-3">
                      {adjustmentsByModel?.adjustments?.color?.map((color) => (
                        <button
                          key={color.code}
                          onClick={() => {
                            setSelectedColor(color.code);
                            setShowResult(false);
                          }}
                          disabled={!selectedModelId || adjustmentsLoading}
                          className={`px-2 sm:px-3 py-2 sm:py-3 rounded-xl border-2 transition-all flex flex-col items-center gap-1 sm:gap-2 disabled:opacity-50 ${
                            selectedColor === color.code
                              ? isDarkMode
                                ? "bg-purple-600/30 border-purple-500"
                                : "bg-blue-100 border-blue-500"
                              : isDarkMode
                                ? "bg-slate-800 border-slate-700 hover:bg-slate-700"
                                : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                          }`}
                        >
                          <div
                            className="w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 border-white/30 shadow-lg"
                            style={{
                              backgroundColor: color.colorHex || "#888",
                            }}
                          />
                          <span
                            className={`text-[10px] sm:text-xs font-medium text-center leading-tight ${
                              isDarkMode ? "text-slate-300" : "text-gray-700"
                            }`}
                          >
                            {color.name}
                          </span>
                        </button>
                      )) || null}
                    </div>
                  </div>

                  {/* Fitur Tambahan (Optional) */}
                  {adjustmentsByModel?.adjustments?.feature &&
                    adjustmentsByModel.adjustments.feature.length > 0 && (
                      <div className="sm:col-span-2">
                        <label className={labelClass}>
                          <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          Fitur Tambahan (Opsional)
                        </label>
                        <div className="grid grid-cols-2 gap-2 sm:gap-3">
                          {adjustmentsByModel.adjustments.feature.map(
                            (feature) => (
                              <button
                                key={feature.id}
                                onClick={() => handleFeatureToggle(feature.id)}
                                disabled={
                                  !selectedModelId || adjustmentsLoading
                                }
                                className={`px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border-2 transition-all flex items-center justify-center gap-1.5 sm:gap-2 disabled:opacity-50 text-xs sm:text-sm ${
                                  selectedFeatures.includes(feature.id)
                                    ? isDarkMode
                                      ? "bg-gradient-to-r from-amber-600 to-orange-600 border-amber-500 text-white"
                                      : "bg-gradient-to-r from-amber-500 to-orange-500 border-amber-500 text-white"
                                    : isDarkMode
                                      ? "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
                                      : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                                }`}
                              >
                                <span>✨</span>
                                <span className="font-medium">
                                  {feature.name}
                                </span>
                                {feature.adjustmentValue !== 0 && (
                                  <span
                                    className={`text-[10px] sm:text-xs hidden sm:inline ${
                                      feature.adjustmentValue < 0
                                        ? "text-red-400"
                                        : "text-green-400"
                                    }`}
                                  >
                                    (+{formatCompact(feature.adjustmentValue)})
                                  </span>
                                )}
                              </button>
                            ),
                          )}
                        </div>
                      </div>
                    )}
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8">
                  <button
                    onClick={handleCalculate}
                    disabled={!isFormComplete}
                    className={`flex-1 px-4 sm:px-6 py-3 sm:py-4 font-semibold rounded-xl transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base ${
                      isDarkMode
                        ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-purple-500/30"
                        : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-blue-500/30"
                    }`}
                  >
                    <Calculator className="w-4 h-4 sm:w-5 sm:h-5" />
                    Hitung Harga
                  </button>
                  <button
                    onClick={handleReset}
                    className={`px-4 sm:px-6 py-3 sm:py-4 font-semibold rounded-xl transition-all border-2 flex items-center justify-center gap-2 text-sm sm:text-base ${
                      isDarkMode
                        ? "bg-slate-800 border-slate-700 text-white hover:bg-slate-700"
                        : "bg-gray-100 border-gray-200 text-gray-700 hover:bg-gray-200"
                    }`}
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
                <div
                  className={`rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl border ${
                    isDarkMode
                      ? "bg-slate-900/50 backdrop-blur-xl border-slate-800"
                      : "bg-white/90 backdrop-blur-xl border-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-4 sm:mb-6">
                    <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                    <h2
                      className={`text-lg sm:text-xl font-semibold ${
                        isDarkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      Estimasi Harga
                    </h2>
                  </div>

                  {showResult && calculationResult ? (
                    <div className="space-y-4 sm:space-y-6">
                      <div
                        className={`rounded-xl sm:rounded-2xl p-3 sm:p-4 border ${
                          isDarkMode
                            ? "bg-slate-800 border-slate-700"
                            : "bg-gray-50 border-gray-200"
                        }`}
                      >
                        <p
                          className={`text-xs sm:text-sm mb-1 ${
                            isDarkMode ? "text-slate-400" : "text-gray-500"
                          }`}
                        >
                          Mobil Anda
                        </p>
                        <h3
                          className={`text-sm sm:text-base md:text-lg font-bold leading-tight ${
                            isDarkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {calculationResult.car.brandName}{" "}
                          {calculationResult.car.modelName}{" "}
                          {calculationResult.car.variantName}
                        </h3>
                        <p
                          className={`text-xs sm:text-sm mt-1 ${
                            isDarkMode ? "text-slate-400" : "text-gray-500"
                          }`}
                        >
                          {calculationResult.car.year} •{" "}
                          {calculationResult.conditions.transmission.name} •{" "}
                          {calculationResult.conditions.color.name}
                        </p>
                      </div>

                      <div className="space-y-2 sm:space-y-3">
                        <div
                          className={`flex justify-between items-center py-2 border-b ${
                            isDarkMode ? "border-slate-700" : "border-gray-200"
                          }`}
                        >
                          <span
                            className={`text-xs sm:text-sm ${
                              isDarkMode ? "text-slate-400" : "text-gray-600"
                            }`}
                          >
                            Harga Dasar
                          </span>
                          <span
                            className={`font-medium text-xs sm:text-sm ${
                              isDarkMode ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {formatCurrency(
                              calculationResult.priceBreakdown.basePrice,
                            )}
                          </span>
                        </div>

                        {calculationResult.priceBreakdown.adjustments.map(
                          (adj, index) => (
                            <div
                              key={index}
                              className={`flex justify-between items-center py-2 border-b ${
                                isDarkMode
                                  ? "border-slate-700"
                                  : "border-gray-200"
                              }`}
                            >
                              <span
                                className={`text-xs sm:text-sm ${
                                  isDarkMode
                                    ? "text-slate-400"
                                    : "text-gray-600"
                                }`}
                              >
                                {adj.name}
                              </span>
                              <span
                                className={`font-medium text-xs sm:text-sm ${
                                  adj.amount > 0
                                    ? "text-green-500"
                                    : adj.amount < 0
                                      ? "text-red-500"
                                      : isDarkMode
                                        ? "text-slate-500"
                                        : "text-gray-400"
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

                      <div
                        className={`rounded-xl sm:rounded-2xl p-4 sm:p-5 border ${
                          isDarkMode
                            ? "bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500/30"
                            : "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200"
                        }`}
                      >
                        <p
                          className={`text-xs sm:text-sm mb-1 ${
                            isDarkMode ? "text-green-300" : "text-green-700"
                          }`}
                        >
                          Estimasi Harga
                        </p>
                        <p
                          className={`text-xl sm:text-2xl md:text-3xl font-bold ${
                            isDarkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {formatCurrency(calculationResult.finalPrice)}
                        </p>
                      </div>

                      <div
                        className={`rounded-xl p-3 sm:p-4 border ${
                          isDarkMode
                            ? "bg-slate-800 border-slate-700"
                            : "bg-gray-50 border-gray-200"
                        }`}
                      >
                        <p
                          className={`text-xs sm:text-sm mb-2 ${
                            isDarkMode ? "text-slate-400" : "text-gray-600"
                          }`}
                        >
                          Range Harga
                        </p>
                        <div
                          className={`flex justify-between text-xs sm:text-sm ${
                            isDarkMode ? "text-slate-300" : "text-gray-700"
                          }`}
                        >
                          <span>
                            {formatCurrency(calculationResult.priceRange.min)}
                          </span>
                          <span>-</span>
                          <span>
                            {formatCurrency(calculationResult.priceRange.max)}
                          </span>
                        </div>
                      </div>

                      <div
                        className={`flex items-start gap-2 p-3 rounded-xl border ${
                          isDarkMode
                            ? "bg-blue-500/10 border-blue-500/20"
                            : "bg-blue-50 border-blue-200"
                        }`}
                      >
                        <Info
                          className={`w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5 ${
                            isDarkMode ? "text-blue-400" : "text-blue-600"
                          }`}
                        />
                        <p
                          className={`text-[10px] sm:text-xs ${
                            isDarkMode ? "text-blue-200" : "text-blue-700"
                          }`}
                        >
                          {calculationResult.priceRange.note}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 sm:py-12">
                      <div
                        className={`w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 rounded-full flex items-center justify-center ${
                          isDarkMode ? "bg-slate-800" : "bg-gray-100"
                        }`}
                      >
                        <Car
                          className={`w-8 h-8 sm:w-10 sm:h-10 ${
                            isDarkMode ? "text-slate-600" : "text-gray-400"
                          }`}
                        />
                      </div>
                      <p
                        className={`text-sm sm:text-base px-4 ${
                          isDarkMode ? "text-slate-400" : "text-gray-500"
                        }`}
                      >
                        Lengkapi data mobil Anda untuk melihat estimasi harga
                      </p>
                    </div>
                  )}
                </div>

                <div
                  className={`rounded-xl sm:rounded-2xl p-4 sm:p-5 border ${
                    isDarkMode
                      ? "bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/20"
                      : "bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200"
                  }`}
                >
                  <h3
                    className={`text-xs sm:text-sm font-semibold mb-2 sm:mb-3 ${
                      isDarkMode ? "text-amber-300" : "text-amber-700"
                    }`}
                  >
                    💡 Tips Jual Mobil
                  </h3>
                  <ul
                    className={`space-y-1.5 sm:space-y-2 text-[10px] sm:text-xs ${
                      isDarkMode ? "text-slate-300" : "text-gray-600"
                    }`}
                  >
                    <li className="flex items-start gap-2">
                      <span
                        className={
                          isDarkMode ? "text-amber-400" : "text-amber-600"
                        }
                      >
                        •
                      </span>
                      Mobil warna hitam & putih lebih diminati pasar
                    </li>
                    <li className="flex items-start gap-2">
                      <span
                        className={
                          isDarkMode ? "text-amber-400" : "text-amber-600"
                        }
                      >
                        •
                      </span>
                      Transmisi matic memiliki nilai jual lebih tinggi
                    </li>
                    <li className="flex items-start gap-2">
                      <span
                        className={
                          isDarkMode ? "text-amber-400" : "text-amber-600"
                        }
                      >
                        •
                      </span>
                      STNK atas nama pribadi lebih disukai pembeli
                    </li>
                    <li className="flex items-start gap-2">
                      <span
                        className={
                          isDarkMode ? "text-amber-400" : "text-amber-600"
                        }
                      >
                        •
                      </span>
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
