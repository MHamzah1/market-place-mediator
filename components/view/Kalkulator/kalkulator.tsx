"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/state/store";
import { getBrandsForSelect, Brand } from "@/lib/state/slice/brand/brandSlice";
import {
  getCarModelsForSelect,
  CarModels,
} from "@/lib/state/slice/car-models/CarModelsSlice";
import {
  getSpecificationsForSelect,
  Specification,
} from "@/lib/state/slice/Specifications/SpecificationsSlice";
import {
  getCustomPricesWithFilters,
  CustomPrice,
} from "@/lib/state/slice/CustomPrices/CustomPriceSlice";
import { useTheme } from "@/context/ThemeContext";
import {
  FiChevronDown,
  FiCheck,
  FiPlus,
  FiMinus,
  FiRefreshCw,
  FiInfo,
  FiX,
} from "react-icons/fi";
import {
  AiOutlineCar,
  AiOutlineCalculator,
  AiOutlineTags,
  AiOutlineSetting,
  AiOutlineDollar,
  AiOutlineCheckCircle,
} from "react-icons/ai";
import { BiGasPump, BiCog } from "react-icons/bi";
import { MdOutlineSpeed, MdOutlineSecurity } from "react-icons/md";
import { TbDimensions } from "react-icons/tb";

// Helper function to format currency
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

// Spec category icon mapping
const getSpecIcon = (category: string) => {
  const iconMap: Record<string, React.ReactNode> = {
    engine: <BiCog className="text-lg" />,
    transmission: <MdOutlineSpeed className="text-lg" />,
    fuel: <BiGasPump className="text-lg" />,
    dimension: <TbDimensions className="text-lg" />,
    safety: <MdOutlineSecurity className="text-lg" />,
  };
  return (
    iconMap[category.toLowerCase()] || <AiOutlineSetting className="text-lg" />
  );
};

// Step indicator component
const StepIndicator = ({
  currentStep,
  isDarkMode,
}: {
  currentStep: number;
  isDarkMode: boolean;
}) => {
  const steps = [
    { num: 1, label: "Pilih Brand", icon: AiOutlineTags },
    { num: 2, label: "Pilih Model", icon: AiOutlineCar },
    { num: 3, label: "Kustomisasi", icon: AiOutlineSetting },
    { num: 4, label: "Hasil", icon: AiOutlineCalculator },
  ];

  return (
    <div className="flex items-center justify-center gap-2 md:gap-4 mb-8 md:mb-12">
      {steps.map((step, index) => (
        <React.Fragment key={step.num}>
          <div className="flex flex-col items-center gap-2">
            <div
              className={`w-10 h-10 md:w-14 md:h-14 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                currentStep >= step.num
                  ? isDarkMode
                    ? "bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/30 text-white"
                    : "bg-gradient-to-br from-blue-600 to-blue-700 shadow-lg shadow-blue-500/30 text-white"
                  : isDarkMode
                  ? "bg-slate-800/50 text-slate-500"
                  : "bg-slate-200 text-slate-400"
              }`}
            >
              {currentStep > step.num ? (
                <FiCheck className="text-xl md:text-2xl" />
              ) : (
                <step.icon className="text-xl md:text-2xl" />
              )}
            </div>
            <span
              className={`text-xs md:text-sm font-medium hidden sm:block transition-colors duration-300 ${
                currentStep >= step.num
                  ? isDarkMode
                    ? "text-cyan-400"
                    : "text-blue-600"
                  : isDarkMode
                  ? "text-slate-500"
                  : "text-slate-400"
              }`}
            >
              {step.label}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={`w-8 md:w-16 h-1 rounded-full transition-all duration-500 ${
                currentStep > step.num
                  ? isDarkMode
                    ? "bg-gradient-to-r from-cyan-500 to-blue-600"
                    : "bg-gradient-to-r from-blue-600 to-blue-700"
                  : isDarkMode
                  ? "bg-slate-800/50"
                  : "bg-slate-200"
              }`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

// Custom Select Component
const CustomSelect = ({
  label,
  placeholder,
  options,
  value,
  onChange,
  disabled,
  isDarkMode,
  icon,
  loading,
}: {
  label: string;
  placeholder: string;
  options: { id: string; label: string; sublabel?: string }[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  isDarkMode: boolean;
  icon?: React.ReactNode;
  loading?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find((opt) => opt.id === value);

  return (
    <div className="relative">
      <label
        className={`block text-sm font-bold mb-2 ${
          isDarkMode ? "text-slate-300" : "text-slate-700"
        }`}
      >
        {label}
      </label>
      <button
        type="button"
        onClick={() => !disabled && !loading && setIsOpen(!isOpen)}
        disabled={disabled || loading}
        className={`w-full px-4 py-4 rounded-2xl text-left flex items-center justify-between gap-3 transition-all duration-300 border-2 ${
          disabled || loading
            ? isDarkMode
              ? "bg-slate-800/30 border-slate-700/30 text-slate-600 cursor-not-allowed"
              : "bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed"
            : isOpen
            ? isDarkMode
              ? "bg-slate-800/80 border-cyan-500/50 ring-4 ring-cyan-500/20"
              : "bg-white border-blue-500/50 ring-4 ring-blue-500/20"
            : isDarkMode
            ? "bg-slate-800/50 border-slate-700/50 hover:border-cyan-500/30"
            : "bg-white border-slate-200 hover:border-blue-500/30 shadow-sm"
        }`}
      >
        <div className="flex items-center gap-3">
          {icon && (
            <span
              className={`${isDarkMode ? "text-cyan-400" : "text-blue-600"}`}
            >
              {icon}
            </span>
          )}
          <div>
            {loading ? (
              <span className="flex items-center gap-2">
                <FiRefreshCw className="animate-spin" />
                Memuat...
              </span>
            ) : selectedOption ? (
              <>
                <div
                  className={`font-semibold ${
                    isDarkMode ? "text-white" : "text-slate-900"
                  }`}
                >
                  {selectedOption.label}
                </div>
                {selectedOption.sublabel && (
                  <div
                    className={`text-xs ${
                      isDarkMode ? "text-slate-400" : "text-slate-500"
                    }`}
                  >
                    {selectedOption.sublabel}
                  </div>
                )}
              </>
            ) : (
              <span
                className={isDarkMode ? "text-slate-500" : "text-slate-400"}
              >
                {placeholder}
              </span>
            )}
          </div>
        </div>
        <FiChevronDown
          className={`text-xl transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          } ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div
            className={`absolute z-50 w-full mt-2 py-2 rounded-2xl border shadow-2xl max-h-64 overflow-y-auto ${
              isDarkMode
                ? "bg-slate-800 border-slate-700"
                : "bg-white border-slate-200"
            }`}
          >
            {options.length === 0 ? (
              <div
                className={`px-4 py-3 text-center ${
                  isDarkMode ? "text-slate-500" : "text-slate-400"
                }`}
              >
                Tidak ada data tersedia
              </div>
            ) : (
              options.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => {
                    onChange(option.id);
                    setIsOpen(false);
                  }}
                  className={`w-full px-4 py-3 text-left flex items-center gap-3 transition-colors ${
                    value === option.id
                      ? isDarkMode
                        ? "bg-cyan-500/20 text-cyan-400"
                        : "bg-blue-50 text-blue-600"
                      : isDarkMode
                      ? "hover:bg-slate-700/50 text-slate-300"
                      : "hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  {value === option.id && <FiCheck className="text-lg" />}
                  <div className={value === option.id ? "" : "ml-7"}>
                    <div className="font-medium">{option.label}</div>
                    {option.sublabel && (
                      <div
                        className={`text-xs ${
                          isDarkMode ? "text-slate-500" : "text-slate-400"
                        }`}
                      >
                        {option.sublabel}
                      </div>
                    )}
                  </div>
                </button>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
};

// Specification Card Component
const SpecCard = ({
  spec,
  isDarkMode,
}: {
  spec: Specification;
  isDarkMode: boolean;
}) => {
  return (
    <div
      className={`p-4 rounded-xl border transition-all duration-300 hover:scale-[1.02] ${
        isDarkMode
          ? "bg-slate-800/30 border-slate-700/50 hover:border-cyan-500/30"
          : "bg-white border-slate-200 hover:border-blue-500/30 shadow-sm"
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            isDarkMode
              ? "bg-gradient-to-br from-cyan-500/20 to-blue-600/20 text-cyan-400"
              : "bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600"
          }`}
        >
          {getSpecIcon(spec.specCategory)}
        </div>
        <div className="flex-1 min-w-0">
          <div
            className={`text-xs font-medium uppercase tracking-wider mb-1 ${
              isDarkMode ? "text-slate-500" : "text-slate-400"
            }`}
          >
            {spec.specCategory}
          </div>
          <div
            className={`font-bold ${
              isDarkMode ? "text-white" : "text-slate-900"
            }`}
          >
            {spec.specName}
          </div>
          <div
            className={`text-lg font-bold ${
              isDarkMode ? "text-cyan-400" : "text-blue-600"
            }`}
          >
            {spec.specValue} {spec.specUnit !== "-" && spec.specUnit}
          </div>
        </div>
      </div>
    </div>
  );
};

// Custom Price Item Component
const CustomPriceItem = ({
  customPrice,
  isSelected,
  onToggle,
  isDarkMode,
}: {
  customPrice: CustomPrice;
  isSelected: boolean;
  onToggle: () => void;
  isDarkMode: boolean;
}) => {
  const isAddition = customPrice.priceType === "addition";
  const isPercentage = customPrice.priceType === "percentage";

  return (
    <button
      type="button"
      onClick={onToggle}
      className={`w-full p-4 rounded-xl border-2 text-left transition-all duration-300 ${
        isSelected
          ? isDarkMode
            ? "bg-gradient-to-r from-cyan-500/10 to-blue-600/10 border-cyan-500/50"
            : "bg-gradient-to-r from-blue-50 to-blue-100 border-blue-500/50"
          : isDarkMode
          ? "bg-slate-800/30 border-slate-700/50 hover:border-slate-600"
          : "bg-white border-slate-200 hover:border-slate-300 shadow-sm"
      }`}
    >
      <div className="flex items-center gap-4">
        <div
          className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all duration-300 ${
            isSelected
              ? isDarkMode
                ? "bg-cyan-500 text-white"
                : "bg-blue-600 text-white"
              : isDarkMode
              ? "bg-slate-700 text-slate-500"
              : "bg-slate-200 text-slate-400"
          }`}
        >
          {isSelected ? (
            <FiCheck className="text-sm" />
          ) : (
            <FiPlus className="text-sm" />
          )}
        </div>
        <div className="flex-1">
          <div
            className={`font-bold ${
              isDarkMode ? "text-white" : "text-slate-900"
            }`}
          >
            {customPrice.priceName}
          </div>
          {customPrice.description && (
            <div
              className={`text-sm ${
                isDarkMode ? "text-slate-400" : "text-slate-500"
              }`}
            >
              {customPrice.description}
            </div>
          )}
        </div>
        <div className="text-right">
          <div
            className={`flex items-center gap-1 font-bold ${
              isAddition
                ? isDarkMode
                  ? "text-green-400"
                  : "text-green-600"
                : isDarkMode
                ? "text-red-400"
                : "text-red-600"
            }`}
          >
            {isAddition ? <FiPlus /> : <FiMinus />}
            {isPercentage
              ? `${customPrice.priceValue}%`
              : formatCurrency(customPrice.priceValue)}
          </div>
          <div
            className={`text-xs ${
              isDarkMode ? "text-slate-500" : "text-slate-400"
            }`}
          >
            {customPrice.priceType}
          </div>
        </div>
      </div>
    </button>
  );
};

// Main Calculator Component
const MenuKalkulator = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  // Redux state
  const { data: brands, loading: brandsLoading } = useSelector(
    (state: RootState) => state.brand
  );

  const { data: carModels, loading: carModelsLoading } = useSelector(
    (state: RootState) => state.CarModels
  );

  const { data: specifications, loading: specificationsLoading } = useSelector(
    (state: RootState) => state.Specifications
  );

  const { data: customPrices, loading: customPricesLoading } = useSelector(
    (state: RootState) => state.customPrices
  );

  // Local state
  const [selectedBrandId, setSelectedBrandId] = useState<string>("");
  const [selectedModelId, setSelectedModelId] = useState<string>("");
  const [selectedCustomPriceIds, setSelectedCustomPriceIds] = useState<
    string[]
  >([]);
  const [showResult, setShowResult] = useState(false);

  // Fetch brands on mount
  useEffect(() => {
    dispatch(getBrandsForSelect({ page: 1, perPage: 100 }));
  }, [dispatch]);

  // Fetch car models when brand changes
  useEffect(() => {
    if (selectedBrandId) {
      dispatch(
        getCarModelsForSelect({
          page: 1,
          perPage: 100,
          brandId: selectedBrandId,
        })
      );
      setSelectedModelId("");
      setSelectedCustomPriceIds([]);
      setShowResult(false);
    }
  }, [selectedBrandId, dispatch]);

  // Fetch specifications and custom prices when model changes
  useEffect(() => {
    if (selectedModelId) {
      dispatch(
        getSpecificationsForSelect({
          page: 1,
          perPage: 100,
          modelId: selectedModelId,
        })
      );
      dispatch(
        getCustomPricesWithFilters({
          page: 1,
          perPage: 100,
          modelId: selectedModelId,
        })
      );
      setSelectedCustomPriceIds([]);
      setShowResult(false);
    }
  }, [selectedModelId, dispatch]);

  // Current step calculation
  const currentStep = useMemo(() => {
    if (showResult) return 4;
    if (selectedModelId) return 3;
    if (selectedBrandId) return 2;
    return 1;
  }, [selectedBrandId, selectedModelId, showResult]);

  // Selected model data
  const selectedModel = useMemo(() => {
    return carModels.find((m) => m.id === selectedModelId);
  }, [carModels, selectedModelId]);

  // Filter models by selected brand
  const filteredModels = useMemo(() => {
    if (!selectedBrandId) return [];
    return carModels.filter((m) => m.brandId === selectedBrandId);
  }, [carModels, selectedBrandId]);

  // Filter specifications by selected model
  const filteredSpecifications = useMemo(() => {
    if (!selectedModelId) return [];
    return specifications.filter((s) => s.modelId === selectedModelId);
  }, [specifications, selectedModelId]);

  // Filter custom prices by selected model
  const filteredCustomPrices = useMemo(() => {
    if (!selectedModelId) return [];
    return customPrices.filter(
      (cp) => cp.modelId === selectedModelId && cp.isActive
    );
  }, [customPrices, selectedModelId]);

  // Price calculation
  const priceCalculation = useMemo(() => {
    if (!selectedModel) return null;

    const basePrice = parseFloat(selectedModel.basePrice) || 0;
    let totalAdditions = 0;
    let totalDeductions = 0;
    const customizations: {
      id: string;
      name: string;
      type: string;
      value: number;
      finalAmount: number;
    }[] = [];

    selectedCustomPriceIds.forEach((cpId) => {
      const cp = customPrices.find((p) => p.id === cpId);
      if (cp) {
        let finalAmount = 0;

        if (cp.priceType === "addition") {
          finalAmount = cp.priceValue;
          totalAdditions += finalAmount;
        } else if (cp.priceType === "deduction") {
          finalAmount = cp.priceValue;
          totalDeductions += finalAmount;
        } else if (cp.priceType === "percentage") {
          // Percentage can be addition or deduction based on sign
          finalAmount = (basePrice * cp.priceValue) / 100;
          if (cp.priceValue > 0) {
            totalDeductions += finalAmount; // Assume percentage is discount
          } else {
            totalAdditions += Math.abs(finalAmount);
          }
        }

        customizations.push({
          id: cp.id,
          name: cp.priceName,
          type: cp.priceType,
          value: cp.priceValue,
          finalAmount,
        });
      }
    });

    const totalCustomPrice = basePrice + totalAdditions - totalDeductions;

    return {
      basePrice,
      totalAdditions,
      totalDeductions,
      totalCustomPrice,
      customizations,
    };
  }, [selectedModel, selectedCustomPriceIds, customPrices]);

  // Toggle custom price selection
  const toggleCustomPrice = (id: string) => {
    setSelectedCustomPriceIds((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  // Reset calculator
  const resetCalculator = () => {
    setSelectedBrandId("");
    setSelectedModelId("");
    setSelectedCustomPriceIds([]);
    setShowResult(false);
  };

  // Brand options
  const brandOptions = brands
    .filter((b) => b.isActive)
    .map((b) => ({
      id: b.id,
      label: b.name,
      sublabel: b.description,
    }));

  // Model options
  const modelOptions = filteredModels
    .filter((m) => m.isActive)
    .map((m) => ({
      id: m.id,
      label: m.modelName,
      sublabel: formatCurrency(parseFloat(m.basePrice)),
    }));

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <div
            className={`inline-flex items-center gap-3 px-6 py-3 rounded-full mb-6 ${
              isDarkMode
                ? "bg-gradient-to-r from-cyan-500/10 to-blue-600/10 border border-cyan-500/20"
                : "bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200"
            }`}
          >
            <AiOutlineCalculator
              className={`text-2xl ${
                isDarkMode ? "text-cyan-400" : "text-blue-600"
              }`}
            />
            <span
              className={`font-bold ${
                isDarkMode ? "text-cyan-400" : "text-blue-600"
              }`}
            >
              Kalkulator Harga
            </span>
          </div>
          <h1
            className={`text-3xl md:text-5xl font-black mb-4 ${
              isDarkMode
                ? "text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400"
                : "text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-slate-700 to-slate-600"
            }`}
          >
            Hitung Harga Mobil Impianmu
          </h1>
          <p
            className={`text-lg max-w-2xl mx-auto ${
              isDarkMode ? "text-slate-400" : "text-slate-600"
            }`}
          >
            Pilih brand, model, dan kustomisasi untuk mendapatkan estimasi harga
            yang akurat
          </p>
        </div>

        {/* Step Indicator */}
        <StepIndicator currentStep={currentStep} isDarkMode={isDarkMode} />

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Panel - Selection */}
          <div className="lg:col-span-2 space-y-6">
            {/* Selection Card */}
            <div
              className={`rounded-3xl p-6 md:p-8 border transition-all duration-300 ${
                isDarkMode
                  ? "bg-slate-900/50 border-slate-800/50 backdrop-blur-xl"
                  : "bg-white/80 border-slate-200 backdrop-blur-xl shadow-xl"
              }`}
            >
              <div className="grid md:grid-cols-2 gap-6">
                {/* Brand Select */}
                <CustomSelect
                  label="Brand Mobil"
                  placeholder="Pilih brand mobil..."
                  options={brandOptions}
                  value={selectedBrandId}
                  onChange={setSelectedBrandId}
                  isDarkMode={isDarkMode}
                  icon={<AiOutlineTags className="text-xl" />}
                  loading={brandsLoading}
                />

                {/* Model Select */}
                <CustomSelect
                  label="Model Mobil"
                  placeholder="Pilih model mobil..."
                  options={modelOptions}
                  value={selectedModelId}
                  onChange={setSelectedModelId}
                  disabled={!selectedBrandId}
                  isDarkMode={isDarkMode}
                  icon={<AiOutlineCar className="text-xl" />}
                  loading={carModelsLoading}
                />
              </div>

              {/* Selected Model Info */}
              {selectedModel && (
                <div
                  className={`mt-6 p-6 rounded-2xl border ${
                    isDarkMode
                      ? "bg-gradient-to-br from-cyan-500/5 to-blue-600/5 border-cyan-500/20"
                      : "bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <div
                        className={`text-sm font-medium mb-1 ${
                          isDarkMode ? "text-slate-400" : "text-slate-500"
                        }`}
                      >
                        {selectedModel.brand?.name || "Brand"}
                      </div>
                      <div
                        className={`text-2xl font-black ${
                          isDarkMode ? "text-white" : "text-slate-900"
                        }`}
                      >
                        {selectedModel.modelName}
                      </div>
                      {selectedModel.description && (
                        <div
                          className={`text-sm mt-1 ${
                            isDarkMode ? "text-slate-400" : "text-slate-500"
                          }`}
                        >
                          {selectedModel.description}
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <div
                        className={`text-sm font-medium mb-1 ${
                          isDarkMode ? "text-slate-400" : "text-slate-500"
                        }`}
                      >
                        Harga Dasar
                      </div>
                      <div
                        className={`text-2xl md:text-3xl font-black ${
                          isDarkMode ? "text-cyan-400" : "text-blue-600"
                        }`}
                      >
                        {formatCurrency(parseFloat(selectedModel.basePrice))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Specifications */}
            {selectedModelId && (
              <div
                className={`rounded-3xl p-6 md:p-8 border transition-all duration-500 animate-fadeIn ${
                  isDarkMode
                    ? "bg-slate-900/50 border-slate-800/50 backdrop-blur-xl"
                    : "bg-white/80 border-slate-200 backdrop-blur-xl shadow-xl"
                }`}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      isDarkMode
                        ? "bg-gradient-to-br from-cyan-500/20 to-blue-600/20 text-cyan-400"
                        : "bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600"
                    }`}
                  >
                    <FiInfo className="text-xl" />
                  </div>
                  <h2
                    className={`text-xl font-bold ${
                      isDarkMode ? "text-white" : "text-slate-900"
                    }`}
                  >
                    Spesifikasi
                  </h2>
                </div>

                {specificationsLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <FiRefreshCw
                      className={`text-3xl animate-spin ${
                        isDarkMode ? "text-cyan-400" : "text-blue-600"
                      }`}
                    />
                  </div>
                ) : filteredSpecifications.length > 0 ? (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredSpecifications.map((spec) => (
                      <SpecCard
                        key={spec.id}
                        spec={spec}
                        isDarkMode={isDarkMode}
                      />
                    ))}
                  </div>
                ) : (
                  <div
                    className={`text-center py-12 ${
                      isDarkMode ? "text-slate-500" : "text-slate-400"
                    }`}
                  >
                    Tidak ada spesifikasi tersedia untuk model ini
                  </div>
                )}
              </div>
            )}

            {/* Custom Prices */}
            {selectedModelId && (
              <div
                className={`rounded-3xl p-6 md:p-8 border transition-all duration-500 animate-fadeIn ${
                  isDarkMode
                    ? "bg-slate-900/50 border-slate-800/50 backdrop-blur-xl"
                    : "bg-white/80 border-slate-200 backdrop-blur-xl shadow-xl"
                }`}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      isDarkMode
                        ? "bg-gradient-to-br from-cyan-500/20 to-blue-600/20 text-cyan-400"
                        : "bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600"
                    }`}
                  >
                    <AiOutlineDollar className="text-xl" />
                  </div>
                  <div>
                    <h2
                      className={`text-xl font-bold ${
                        isDarkMode ? "text-white" : "text-slate-900"
                      }`}
                    >
                      Kustomisasi Harga
                    </h2>
                    <p
                      className={`text-sm ${
                        isDarkMode ? "text-slate-400" : "text-slate-500"
                      }`}
                    >
                      Pilih opsi tambahan untuk kustomisasi
                    </p>
                  </div>
                </div>

                {customPricesLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <FiRefreshCw
                      className={`text-3xl animate-spin ${
                        isDarkMode ? "text-cyan-400" : "text-blue-600"
                      }`}
                    />
                  </div>
                ) : filteredCustomPrices.length > 0 ? (
                  <div className="space-y-3">
                    {filteredCustomPrices.map((cp) => (
                      <CustomPriceItem
                        key={cp.id}
                        customPrice={cp}
                        isSelected={selectedCustomPriceIds.includes(cp.id)}
                        onToggle={() => toggleCustomPrice(cp.id)}
                        isDarkMode={isDarkMode}
                      />
                    ))}
                  </div>
                ) : (
                  <div
                    className={`text-center py-12 ${
                      isDarkMode ? "text-slate-500" : "text-slate-400"
                    }`}
                  >
                    Tidak ada opsi kustomisasi tersedia untuk model ini
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Panel - Price Summary */}
          <div className="lg:col-span-1">
            <div
              className={`sticky top-24 rounded-3xl p-6 md:p-8 border transition-all duration-300 ${
                isDarkMode
                  ? "bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 border-slate-700/50"
                  : "bg-gradient-to-br from-white via-white to-blue-50 border-slate-200 shadow-xl"
              }`}
            >
              <div className="flex items-center gap-3 mb-6">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                    isDarkMode
                      ? "bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/30"
                      : "bg-gradient-to-br from-blue-600 to-blue-700 shadow-lg shadow-blue-500/30"
                  }`}
                >
                  <AiOutlineCalculator className="text-2xl text-white" />
                </div>
                <div>
                  <h2
                    className={`text-xl font-bold ${
                      isDarkMode ? "text-white" : "text-slate-900"
                    }`}
                  >
                    Ringkasan Harga
                  </h2>
                </div>
              </div>

              {priceCalculation ? (
                <div className="space-y-4">
                  {/* Base Price */}
                  <div
                    className={`flex justify-between items-center py-3 border-b ${
                      isDarkMode ? "border-slate-700/50" : "border-slate-200"
                    }`}
                  >
                    <span
                      className={
                        isDarkMode ? "text-slate-400" : "text-slate-600"
                      }
                    >
                      Harga Dasar
                    </span>
                    <span
                      className={`font-bold ${
                        isDarkMode ? "text-white" : "text-slate-900"
                      }`}
                    >
                      {formatCurrency(priceCalculation.basePrice)}
                    </span>
                  </div>

                  {/* Customizations */}
                  {priceCalculation.customizations.length > 0 && (
                    <div className="space-y-2">
                      {priceCalculation.customizations.map((c) => (
                        <div
                          key={c.id}
                          className={`flex justify-between items-center py-2 text-sm ${
                            isDarkMode ? "text-slate-400" : "text-slate-600"
                          }`}
                        >
                          <span className="truncate mr-2">{c.name}</span>
                          <span
                            className={`font-medium whitespace-nowrap ${
                              c.type === "addition"
                                ? "text-green-500"
                                : "text-red-500"
                            }`}
                          >
                            {c.type === "addition" ? "+" : "-"}
                            {formatCurrency(c.finalAmount)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Additions */}
                  {priceCalculation.totalAdditions > 0 && (
                    <div
                      className={`flex justify-between items-center py-2 ${
                        isDarkMode ? "text-slate-400" : "text-slate-600"
                      }`}
                    >
                      <span>Total Penambahan</span>
                      <span className="font-medium text-green-500">
                        +{formatCurrency(priceCalculation.totalAdditions)}
                      </span>
                    </div>
                  )}

                  {/* Deductions */}
                  {priceCalculation.totalDeductions > 0 && (
                    <div
                      className={`flex justify-between items-center py-2 ${
                        isDarkMode ? "text-slate-400" : "text-slate-600"
                      }`}
                    >
                      <span>Total Potongan</span>
                      <span className="font-medium text-red-500">
                        -{formatCurrency(priceCalculation.totalDeductions)}
                      </span>
                    </div>
                  )}

                  {/* Total */}
                  <div
                    className={`pt-4 border-t ${
                      isDarkMode ? "border-slate-700/50" : "border-slate-200"
                    }`}
                  >
                    <div
                      className={`text-sm font-medium mb-2 ${
                        isDarkMode ? "text-slate-400" : "text-slate-500"
                      }`}
                    >
                      Total Harga
                    </div>
                    <div
                      className={`text-3xl md:text-4xl font-black ${
                        isDarkMode
                          ? "text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500"
                          : "text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800"
                      }`}
                    >
                      {formatCurrency(priceCalculation.totalCustomPrice)}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3 pt-4">
                    <button
                      onClick={() => setShowResult(true)}
                      className={`w-full py-4 rounded-2xl font-bold text-white transition-all duration-300 flex items-center justify-center gap-2 ${
                        isDarkMode
                          ? "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50"
                          : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50"
                      }`}
                    >
                      <AiOutlineCheckCircle className="text-xl" />
                      Lihat Hasil Kalkulasi
                    </button>
                    <button
                      onClick={resetCalculator}
                      className={`w-full py-3 rounded-2xl font-bold transition-all duration-300 flex items-center justify-center gap-2 border-2 ${
                        isDarkMode
                          ? "border-slate-700 text-slate-300 hover:bg-slate-800/50"
                          : "border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <FiRefreshCw />
                      Reset Kalkulator
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  className={`text-center py-12 ${
                    isDarkMode ? "text-slate-500" : "text-slate-400"
                  }`}
                >
                  <AiOutlineCar className="text-5xl mx-auto mb-4 opacity-50" />
                  <p>
                    Pilih brand dan model mobil untuk melihat ringkasan harga
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Result Modal */}
        {showResult && priceCalculation && selectedModel && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
            <div
              className={`w-full max-w-2xl rounded-3xl p-6 md:p-8 border max-h-[90vh] overflow-y-auto ${
                isDarkMode
                  ? "bg-slate-900 border-slate-700"
                  : "bg-white border-slate-200"
              }`}
            >
              {/* Close Button */}
              <button
                onClick={() => setShowResult(false)}
                className={`absolute top-4 right-4 p-2 rounded-xl transition-colors ${
                  isDarkMode
                    ? "hover:bg-slate-800 text-slate-400"
                    : "hover:bg-slate-100 text-slate-500"
                }`}
              >
                <FiX className="text-2xl" />
              </button>

              {/* Success Icon */}
              <div className="text-center mb-8">
                <div
                  className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-4 ${
                    isDarkMode
                      ? "bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/30"
                      : "bg-gradient-to-br from-blue-600 to-blue-700 shadow-lg shadow-blue-500/30"
                  }`}
                >
                  <AiOutlineCheckCircle className="text-4xl text-white" />
                </div>
                <h2
                  className={`text-2xl md:text-3xl font-black mb-2 ${
                    isDarkMode ? "text-white" : "text-slate-900"
                  }`}
                >
                  Hasil Kalkulasi
                </h2>
                <p className={isDarkMode ? "text-slate-400" : "text-slate-500"}>
                  Berikut adalah ringkasan harga mobil pilihan Anda
                </p>
              </div>

              {/* Car Info */}
              <div
                className={`p-6 rounded-2xl mb-6 ${
                  isDarkMode ? "bg-slate-800/50" : "bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                      isDarkMode
                        ? "bg-gradient-to-br from-cyan-500/20 to-blue-600/20 text-cyan-400"
                        : "bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600"
                    }`}
                  >
                    <AiOutlineCar className="text-3xl" />
                  </div>
                  <div>
                    <div
                      className={`text-sm font-medium ${
                        isDarkMode ? "text-slate-400" : "text-slate-500"
                      }`}
                    >
                      {selectedModel.brand?.name}
                    </div>
                    <div
                      className={`text-2xl font-black ${
                        isDarkMode ? "text-white" : "text-slate-900"
                      }`}
                    >
                      {selectedModel.modelName}
                    </div>
                  </div>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-4 mb-8">
                <div
                  className={`flex justify-between items-center py-3 border-b ${
                    isDarkMode ? "border-slate-700" : "border-slate-200"
                  }`}
                >
                  <span
                    className={isDarkMode ? "text-slate-400" : "text-slate-600"}
                  >
                    Harga Dasar
                  </span>
                  <span
                    className={`font-bold text-lg ${
                      isDarkMode ? "text-white" : "text-slate-900"
                    }`}
                  >
                    {formatCurrency(priceCalculation.basePrice)}
                  </span>
                </div>

                {priceCalculation.customizations.map((c) => (
                  <div
                    key={c.id}
                    className={`flex justify-between items-center py-2 ${
                      isDarkMode ? "text-slate-400" : "text-slate-600"
                    }`}
                  >
                    <span>{c.name}</span>
                    <span
                      className={`font-medium ${
                        c.type === "addition"
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {c.type === "addition" ? "+" : "-"}
                      {formatCurrency(c.finalAmount)}
                    </span>
                  </div>
                ))}

                <div
                  className={`pt-4 border-t ${
                    isDarkMode ? "border-slate-700" : "border-slate-200"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span
                      className={`text-xl font-bold ${
                        isDarkMode ? "text-white" : "text-slate-900"
                      }`}
                    >
                      Total Harga
                    </span>
                    <span
                      className={`text-3xl font-black ${
                        isDarkMode
                          ? "text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500"
                          : "text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800"
                      }`}
                    >
                      {formatCurrency(priceCalculation.totalCustomPrice)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setShowResult(false)}
                  className={`flex-1 py-4 rounded-2xl font-bold transition-all duration-300 ${
                    isDarkMode
                      ? "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-lg shadow-cyan-500/30"
                      : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg shadow-blue-500/30"
                  }`}
                >
                  Selesai
                </button>
                <button
                  onClick={() => {
                    resetCalculator();
                    setShowResult(false);
                  }}
                  className={`flex-1 py-4 rounded-2xl font-bold border-2 transition-all duration-300 ${
                    isDarkMode
                      ? "border-slate-700 text-slate-300 hover:bg-slate-800"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  Hitung Ulang
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Custom Styles */}
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default MenuKalkulator;
