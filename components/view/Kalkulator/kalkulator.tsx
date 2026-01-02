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

const Kalkulator = () => {
  const dispatch = useDispatch<AppDispatch>();
  
  const { options, modelsByBrand, yearsByVariant, calculationResult, loading, error } = useSelector(
    (state: RootState) => state.priceCalculator
  );
  const { data: variants, loading: variantsLoading } = useSelector(
    (state: RootState) => state.variant
  );
  const { adjustmentsByModel, loading: adjustmentsLoading } = useSelector(
    (state: RootState) => state.priceAdjustment
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
    if (!selectedVariantId || !selectedYear || !selectedTransmission || !selectedOwnership || !selectedColor) {
      return;
    }
    dispatch(calculatePrice({
      variantId: selectedVariantId,
      year: selectedYear,
      transmissionCode: selectedTransmission,
      ownershipCode: selectedOwnership,
      colorCode: selectedColor,
    }));
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

  const isFormComplete = selectedVariantId && selectedYear && selectedTransmission && selectedOwnership && selectedColor;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      <div className="relative py-12 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 rounded-full border border-purple-500/30 mb-6">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-medium text-purple-300">Kalkulator Harga Mobil Bekas V2.1</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Cek Harga Mobil Bekas</h1>
            <p className="text-lg text-white/60 max-w-2xl mx-auto">
              Dapatkan estimasi harga mobil bekas Anda secara akurat dengan adjustment khusus per model
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-300 text-center">
              {error}
            </div>
          )}

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 md:p-8 shadow-2xl border border-white/20">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-white/80">
                      <Car className="w-4 h-4" />Merek Mobil
                    </label>
                    <div className="relative">
                      <select
                        value={selectedBrandId}
                        onChange={(e) => setSelectedBrandId(e.target.value)}
                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500/50 disabled:opacity-50"
                        disabled={loading}
                      >
                        <option value="" className="bg-slate-900">Pilih Merek</option>
                        {options?.brands.map((brand) => (
                          <option key={brand.id} value={brand.id} className="bg-slate-900">{brand.name}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50 pointer-events-none" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-white/80">
                      <Car className="w-4 h-4" />Model Mobil
                    </label>
                    <div className="relative">
                      <select
                        value={selectedModelId}
                        onChange={(e) => setSelectedModelId(e.target.value)}
                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500/50 disabled:opacity-50"
                        disabled={!selectedBrandId || loading}
                      >
                        <option value="" className="bg-slate-900">Pilih Model</option>
                        {modelsByBrand?.models.map((model) => (
                          <option key={model.id} value={model.id} className="bg-slate-900">{model.modelName}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50 pointer-events-none" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-white/80">
                      <Settings className="w-4 h-4" />Tipe/Seri
                    </label>
                    <div className="relative">
                      <select
                        value={selectedVariantId}
                        onChange={(e) => setSelectedVariantId(e.target.value)}
                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500/50 disabled:opacity-50"
                        disabled={!selectedModelId || variantsLoading}
                      >
                        <option value="" className="bg-slate-900">Pilih Tipe</option>
                        {variants.map((variant) => (
                          <option key={variant.id} value={variant.id} className="bg-slate-900">{variant.variantName}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50 pointer-events-none" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-white/80">
                      <Calendar className="w-4 h-4" />Tahun
                    </label>
                    <div className="relative">
                      <select
                        value={selectedYear || ""}
                        onChange={(e) => setSelectedYear(Number(e.target.value))}
                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500/50 disabled:opacity-50"
                        disabled={!selectedVariantId}
                      >
                        <option value="" className="bg-slate-900">Pilih Tahun</option>
                        {yearsByVariant?.years.map((year) => (
                          <option key={year} value={year} className="bg-slate-900">{year}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50 pointer-events-none" />
                    </div>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-white/80">
                      <Settings className="w-4 h-4" />Transmisi
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {adjustmentsByModel?.adjustments.transmission.map((trans) => (
                        <button
                          key={trans.code}
                          onClick={() => { setSelectedTransmission(trans.code); setShowResult(false); }}
                          disabled={!selectedModelId || adjustmentsLoading}
                          className={`px-4 py-3 rounded-xl border-2 transition-all flex items-center justify-center gap-2 disabled:opacity-50 ${
                            selectedTransmission === trans.code
                              ? "bg-purple-600 border-purple-500 text-white"
                              : "bg-white/5 border-white/20 text-white/70 hover:bg-white/10"
                          }`}
                        >
                          <span>{trans.code === "matic" ? "⚙️" : "🔧"}</span>
                          <span className="font-medium">{trans.name}</span>
                          {trans.adjustmentValue !== 0 && (
                            <span className={`text-xs ${trans.adjustmentValue < 0 ? "text-red-400" : "text-green-400"}`}>
                              ({formatCurrency(trans.adjustmentValue)})
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-white/80">
                      <User className="w-4 h-4" />Kepemilikan
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {adjustmentsByModel?.adjustments.ownership.map((own) => (
                        <button
                          key={own.code}
                          onClick={() => { setSelectedOwnership(own.code); setShowResult(false); }}
                          disabled={!selectedModelId || adjustmentsLoading}
                          className={`px-4 py-3 rounded-xl border-2 transition-all flex items-center justify-center gap-2 disabled:opacity-50 ${
                            selectedOwnership === own.code
                              ? "bg-purple-600 border-purple-500 text-white"
                              : "bg-white/5 border-white/20 text-white/70 hover:bg-white/10"
                          }`}
                        >
                          <span>{own.code === "personal" ? "👤" : "🏢"}</span>
                          <span className="font-medium">{own.name}</span>
                          {own.adjustmentValue !== 0 && (
                            <span className={`text-xs ${own.adjustmentValue < 0 ? "text-red-400" : "text-green-400"}`}>
                              ({formatCurrency(own.adjustmentValue)})
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-white/80">
                      <Palette className="w-4 h-4" />Warna
                    </label>
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                      {adjustmentsByModel?.adjustments.color.map((color) => (
                        <button
                          key={color.code}
                          onClick={() => { setSelectedColor(color.code); setShowResult(false); }}
                          disabled={!selectedModelId || adjustmentsLoading}
                          className={`px-3 py-3 rounded-xl border-2 transition-all flex flex-col items-center gap-2 disabled:opacity-50 ${
                            selectedColor === color.code
                              ? "bg-purple-600/30 border-purple-500"
                              : "bg-white/5 border-white/20 hover:bg-white/10"
                          }`}
                        >
                          <div
                            className="w-8 h-8 rounded-full border-2 border-white/30 shadow-lg"
                            style={{ backgroundColor: color.colorHex || "#888" }}
                          />
                          <span className="text-xs text-white/80 font-medium">{color.name}</span>
                          {color.adjustmentValue !== 0 && (
                            <span className={`text-xs ${color.adjustmentValue < 0 ? "text-red-400" : "text-green-400"}`}>
                              {formatCurrency(color.adjustmentValue)}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mt-8">
                  <button
                    onClick={handleCalculate}
                    disabled={!isFormComplete || loading}
                    className="flex-1 px-6 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg shadow-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Calculator className="w-5 h-5" />}
                    {loading ? "Menghitung..." : "Hitung Harga"}
                  </button>
                  <button
                    onClick={handleReset}
                    className="px-6 py-4 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-all border border-white/20 flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="w-5 h-5" />Reset
                  </button>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/20">
                  <div className="flex items-center gap-2 mb-6">
                    <TrendingUp className="w-5 h-5 text-green-400" />
                    <h2 className="text-xl font-semibold text-white">Estimasi Harga</h2>
                  </div>

                  {showResult && calculationResult ? (
                    <div className="space-y-6">
                      <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                        <p className="text-sm text-white/60 mb-1">Mobil Anda</p>
                        <h3 className="text-lg font-bold text-white">
                          {calculationResult.car.brandName} {calculationResult.car.modelName} {calculationResult.car.variantName}
                        </h3>
                        <p className="text-sm text-white/60">
                          {calculationResult.car.year} • {calculationResult.conditions.transmission.name} • {calculationResult.conditions.color.name}
                        </p>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between items-center py-2 border-b border-white/10">
                          <span className="text-white/70">Harga Dasar</span>
                          <span className="text-white font-medium">{formatCurrency(calculationResult.priceBreakdown.basePrice)}</span>
                        </div>

                        {calculationResult.priceBreakdown.adjustments.map((adj, index) => (
                          <div key={index} className="flex justify-between items-center py-2 border-b border-white/10">
                            <span className="text-white/70 text-sm">{adj.name}</span>
                            <span className={`font-medium ${adj.amount > 0 ? "text-green-400" : adj.amount < 0 ? "text-red-400" : "text-white/50"}`}>
                              {adj.amount > 0 ? `+${formatCurrency(adj.amount)}` : adj.amount < 0 ? formatCurrency(adj.amount) : "-"}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl p-5 border border-green-500/30">
                        <p className="text-sm text-green-300 mb-1">Estimasi Harga</p>
                        <p className="text-3xl font-bold text-white">{formatCurrency(calculationResult.finalPrice)}</p>
                      </div>

                      <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                        <p className="text-sm text-white/60 mb-2">Range Harga</p>
                        <div className="flex justify-between text-white/80">
                          <span>{formatCurrency(calculationResult.priceRange.min)}</span>
                          <span>-</span>
                          <span>{formatCurrency(calculationResult.priceRange.max)}</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-2 p-3 bg-blue-500/10 rounded-xl border border-blue-500/20">
                        <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-blue-200/80">{calculationResult.priceRange.note}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-20 h-20 mx-auto mb-4 bg-white/5 rounded-full flex items-center justify-center">
                        <Car className="w-10 h-10 text-white/30" />
                      </div>
                      <p className="text-white/50">Lengkapi data mobil Anda untuk melihat estimasi harga</p>
                    </div>
                  )}
                </div>

                <div className="mt-6 bg-gradient-to-br from-amber-500/10 to-orange-500/10 backdrop-blur-xl rounded-2xl p-5 border border-amber-500/20">
                  <h3 className="text-sm font-semibold text-amber-300 mb-3">💡 Tips Jual Mobil</h3>
                  <ul className="space-y-2 text-xs text-white/70">
                    <li className="flex items-start gap-2"><span className="text-amber-400">•</span>Mobil warna hitam & putih lebih diminati pasar</li>
                    <li className="flex items-start gap-2"><span className="text-amber-400">•</span>Transmisi matic memiliki nilai jual lebih tinggi</li>
                    <li className="flex items-start gap-2"><span className="text-amber-400">•</span>STNK atas nama pribadi lebih disukai pembeli</li>
                    <li className="flex items-start gap-2"><span className="text-amber-400">•</span>Lengkapi service record untuk nilai tambah</li>
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
