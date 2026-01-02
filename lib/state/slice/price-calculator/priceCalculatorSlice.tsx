/* eslint-disable @typescript-eslint/no-explicit-any */
import instanceAxios from "@/lib/axiosInstance/instanceAxios";
import { getHeaders } from "@/lib/headers/headers";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { AxiosError } from "axios";

// Types
export interface CalculateRequest {
  variantId: string;
  year: number;
  transmissionCode: string;
  ownershipCode: string;
  colorCode: string;
  customPriceIds?: string[];
}

export interface PriceBreakdownAdjustment {
  category: string;
  name: string;
  amount: number;
}

export interface CalculationResult {
  calculation: {
    id: string;
    calculatedAt: string;
  };
  car: {
    brandId: string;
    brandName: string;
    modelId: string;
    modelName: string;
    variantId: string;
    variantName: string;
    year: number;
  };
  conditions: {
    transmission: { code: string; name: string };
    ownership: { code: string; name: string };
    color: { code: string; name: string; colorHex: string };
  };
  priceBreakdown: {
    basePrice: number;
    adjustments: PriceBreakdownAdjustment[];
    totalAdjustments: number;
  };
  finalPrice: number;
  priceRange: {
    min: number;
    max: number;
    note: string;
  };
}

export interface QuickCalculateResult {
  carName: string;
  finalPrice: number;
  formattedPrice: string;
}

export interface CalculatorOptions {
  brands: { id: string; name: string; logo?: string }[];
  years: number[];
}

export interface ModelsByBrand {
  brandId: string;
  brandName: string;
  models: { id: string; modelName: string; imageUrl?: string }[];
}

export interface YearsByVariant {
  variantId: string;
  variantName: string;
  modelName: string;
  brandName: string;
  years: number[];
}

interface PriceCalculatorState {
  calculationResult: CalculationResult | null;
  quickResult: QuickCalculateResult | null;
  options: CalculatorOptions | null;
  modelsByBrand: ModelsByBrand | null;
  yearsByVariant: YearsByVariant | null;
  loading: boolean;
  error: string | null;
}

interface ErrorResponse {
  message?: string;
  [key: string]: any;
}

// POST Calculate Price
export const calculatePrice = createAsyncThunk<
  CalculationResult,
  CalculateRequest,
  { rejectValue: string }
>("priceCalculator/calculatePrice", async (calculateRequest, { rejectWithValue }) => {
  try {
    const response = await instanceAxios.post("/price-calculator/calculate", calculateRequest, {
      headers: getHeaders(),
    });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    return rejectWithValue(
      axiosError.response?.data?.message || "Terjadi kesalahan saat menghitung harga"
    );
  }
});

// GET Quick Calculate
export const quickCalculate = createAsyncThunk<
  QuickCalculateResult,
  {
    variantId: string;
    year: number;
    transmission: string;
    ownership: string;
    color: string;
  },
  { rejectValue: string }
>("priceCalculator/quickCalculate", async (params, { rejectWithValue }) => {
  try {
    const response = await instanceAxios.get("/price-calculator/quick", {
      params,
      headers: getHeaders(),
    });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    return rejectWithValue(
      axiosError.response?.data?.message || "Terjadi kesalahan"
    );
  }
});

// GET Calculator Options (brands and years)
export const getCalculatorOptions = createAsyncThunk<
  CalculatorOptions,
  void,
  { rejectValue: string }
>("priceCalculator/getCalculatorOptions", async (_, { rejectWithValue }) => {
  try {
    const response = await instanceAxios.get("/price-calculator/options", {
      headers: getHeaders(),
    });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    return rejectWithValue(
      axiosError.response?.data?.message || "Terjadi kesalahan"
    );
  }
});

// GET Models by Brand for Calculator
export const getModelsByBrandForCalculator = createAsyncThunk<
  ModelsByBrand,
  string,
  { rejectValue: string }
>("priceCalculator/getModelsByBrand", async (brandId, { rejectWithValue }) => {
  try {
    const response = await instanceAxios.get(`/price-calculator/brands/${brandId}/models`, {
      headers: getHeaders(),
    });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    return rejectWithValue(
      axiosError.response?.data?.message || "Terjadi kesalahan"
    );
  }
});

// GET Years by Variant for Calculator
export const getYearsByVariantForCalculator = createAsyncThunk<
  YearsByVariant,
  string,
  { rejectValue: string }
>("priceCalculator/getYearsByVariant", async (variantId, { rejectWithValue }) => {
  try {
    const response = await instanceAxios.get(`/price-calculator/variants/${variantId}/years`, {
      headers: getHeaders(),
    });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    return rejectWithValue(
      axiosError.response?.data?.message || "Terjadi kesalahan"
    );
  }
});

const initialState: PriceCalculatorState = {
  calculationResult: null,
  quickResult: null,
  options: null,
  modelsByBrand: null,
  yearsByVariant: null,
  loading: false,
  error: null,
};

const priceCalculatorSlice = createSlice({
  name: "priceCalculator",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCalculationResult: (state) => {
      state.calculationResult = null;
    },
    clearQuickResult: (state) => {
      state.quickResult = null;
    },
    clearModelsByBrand: (state) => {
      state.modelsByBrand = null;
    },
    clearYearsByVariant: (state) => {
      state.yearsByVariant = null;
    },
    resetCalculator: (state) => {
      state.calculationResult = null;
      state.quickResult = null;
      state.modelsByBrand = null;
      state.yearsByVariant = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // POST Calculate Price
      .addCase(calculatePrice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(calculatePrice.fulfilled, (state, action: PayloadAction<CalculationResult>) => {
        state.loading = false;
        state.calculationResult = action.payload;
      })
      .addCase(calculatePrice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Terjadi kesalahan";
      })

      // GET Quick Calculate
      .addCase(quickCalculate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(quickCalculate.fulfilled, (state, action: PayloadAction<QuickCalculateResult>) => {
        state.loading = false;
        state.quickResult = action.payload;
      })
      .addCase(quickCalculate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Terjadi kesalahan";
      })

      // GET Calculator Options
      .addCase(getCalculatorOptions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCalculatorOptions.fulfilled, (state, action: PayloadAction<CalculatorOptions>) => {
        state.loading = false;
        state.options = action.payload;
      })
      .addCase(getCalculatorOptions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Terjadi kesalahan";
      })

      // GET Models by Brand
      .addCase(getModelsByBrandForCalculator.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getModelsByBrandForCalculator.fulfilled, (state, action: PayloadAction<ModelsByBrand>) => {
        state.loading = false;
        state.modelsByBrand = action.payload;
      })
      .addCase(getModelsByBrandForCalculator.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Terjadi kesalahan";
      })

      // GET Years by Variant
      .addCase(getYearsByVariantForCalculator.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getYearsByVariantForCalculator.fulfilled, (state, action: PayloadAction<YearsByVariant>) => {
        state.loading = false;
        state.yearsByVariant = action.payload;
      })
      .addCase(getYearsByVariantForCalculator.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Terjadi kesalahan";
      });
  },
});

export const { 
  clearError, 
  clearCalculationResult, 
  clearQuickResult, 
  clearModelsByBrand, 
  clearYearsByVariant,
  resetCalculator 
} = priceCalculatorSlice.actions;
export default priceCalculatorSlice.reducer;
