import {
  CalculationResult,
  PriceBreakdownAdjustment,
} from "@/lib/state/slice/price-calculator/priceCalculatorSlice";
import { AdjustmentsByModel } from "@/lib/state/slice/price-adjustment/priceAdjustmentSlice";
import { YearsByVariant } from "@/lib/state/slice/price-calculator/priceCalculatorSlice";

interface CalculatePriceParams {
  yearsByVariant: YearsByVariant;
  adjustmentsByModel: AdjustmentsByModel;
  selectedYear: number;
  transmissionCode: string;
  ownershipCode: string;
  colorCode: string;
  selectedFeatureIds?: string[];
  variantId: string;
  variantName: string;
}

// Assume base price based on year (newer = more expensive)
const calculateBasePrice = (year: number): number => {
  const currentYear = new Date().getFullYear();
  const age = currentYear - year;

  // Simple formula: starts from 150M for current year, depreciate 10M per year
  const baseForCurrentYear = 150000000;
  const depreciationPerYear = 10000000;

  return Math.max(50000000, baseForCurrentYear - age * depreciationPerYear);
};

export const calculatePriceClientSide = (
  params: CalculatePriceParams,
): CalculationResult => {
  const {
    yearsByVariant,
    adjustmentsByModel,
    selectedYear,
    transmissionCode,
    ownershipCode,
    colorCode,
    selectedFeatureIds = [],
    variantId,
    variantName,
  } = params;

  // 1. Calculate base price
  const basePrice = calculateBasePrice(selectedYear);

  // 2. Get adjustments
  const adjustments: PriceBreakdownAdjustment[] = [];
  let totalAdjustments = 0;

  // Transmission adjustment (if exists - removed as per your request)
  // Note: Transmission sudah di variant, jadi tidak perlu adjustment

  // Ownership adjustment
  const ownershipAdj = adjustmentsByModel.adjustments.ownership?.find(
    (o) => o.code === ownershipCode,
  );
  if (ownershipAdj) {
    adjustments.push({
      category: "ownership",
      name: ownershipAdj.name,
      amount: ownershipAdj.adjustmentValue,
    });
    totalAdjustments += ownershipAdj.adjustmentValue;
  }

  // Color adjustment
  const colorAdj = adjustmentsByModel.adjustments.color?.find(
    (c) => c.code === colorCode,
  );
  if (colorAdj) {
    adjustments.push({
      category: "color",
      name: colorAdj.name,
      amount: colorAdj.adjustmentValue,
    });
    totalAdjustments += colorAdj.adjustmentValue;
  }

  // Feature adjustments
  if (selectedFeatureIds.length > 0 && adjustmentsByModel.adjustments.feature) {
    selectedFeatureIds.forEach((featureId) => {
      const featureAdj = adjustmentsByModel.adjustments.feature?.find(
        (f) => f.id === featureId,
      );
      if (featureAdj) {
        adjustments.push({
          category: "feature",
          name: featureAdj.name,
          amount: featureAdj.adjustmentValue,
        });
        totalAdjustments += featureAdj.adjustmentValue;
      }
    });
  }

  // 3. Calculate final price
  const finalPrice = basePrice + totalAdjustments;

  // 4. Calculate price range (±10%)
  const rangePercentage = 0.1;
  const minPrice = Math.floor(finalPrice * (1 - rangePercentage));
  const maxPrice = Math.ceil(finalPrice * (1 + rangePercentage));

  // 5. Build result object
  const result: CalculationResult = {
    calculation: {
      id: `calc-${Date.now()}`,
      calculatedAt: new Date().toISOString(),
    },
    car: {
      brandId: adjustmentsByModel.modelId || "",
      brandName: yearsByVariant.brandName,
      modelId: adjustmentsByModel.modelId,
      modelName: yearsByVariant.modelName,
      variantId: variantId,
      variantName: variantName,
      year: selectedYear,
    },
    conditions: {
      transmission: {
        code: transmissionCode,
        name: transmissionCode === "matic" ? "Automatic" : "Manual",
      },
      ownership: {
        code: ownershipCode,
        name: ownershipAdj?.name || ownershipCode,
      },
      color: {
        code: colorCode,
        name: colorAdj?.name || colorCode,
        colorHex: colorAdj?.colorHex || "#000000",
      },
    },
    priceBreakdown: {
      basePrice,
      adjustments,
      totalAdjustments,
    },
    finalPrice,
    priceRange: {
      min: minPrice,
      max: maxPrice,
      note: "Estimasi harga dapat bervariasi tergantung kondisi mobil dan lokasi penjualan",
    },
  };

  return result;
};
