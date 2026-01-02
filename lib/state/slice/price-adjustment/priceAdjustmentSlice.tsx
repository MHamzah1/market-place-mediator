/* eslint-disable @typescript-eslint/no-explicit-any */
import instanceAxios from "@/lib/axiosInstance/instanceAxios";
import { getHeaders } from "@/lib/headers/headers";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { AxiosError } from "axios";

// Types
export interface PriceAdjustment {
  id: string;
  modelId: string;
  modelName?: string;
  brandName?: string;
  category: 'transmission' | 'ownership' | 'color';
  code: string;
  name: string;
  colorHex?: string;
  adjustmentType: 'fixed' | 'percentage';
  adjustmentValue: number;
  description?: string;
  sortOrder: number;
  isBaseline: boolean;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdjustmentItem {
  id: string;
  code: string;
  name: string;
  adjustmentValue: number;
  isBaseline: boolean;
  colorHex?: string;
}

export interface AdjustmentsByModel {
  modelId: string;
  modelName: string;
  brandName: string;
  adjustments: {
    transmission: AdjustmentItem[];
    ownership: AdjustmentItem[];
    color: AdjustmentItem[];
  };
}

interface Pagination {
  page: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
}

interface PriceAdjustmentResponse {
  data: PriceAdjustment[];
  pagination?: Pagination;
  meta?: {
    arg?: {
      page?: number;
      isInfiniteScroll?: boolean;
    };
  };
}

interface PriceAdjustmentState {
  data: PriceAdjustment[];
  adjustmentsByModel: AdjustmentsByModel | null;
  loadedPages: number[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  loading: boolean;
  error: string | null;
  selectedAdjustment: PriceAdjustment | null;
  success: boolean;
}

interface GetPriceAdjustmentsParams {
  page?: number;
  perPage?: number;
  modelId?: string;
  category?: 'transmission' | 'ownership' | 'color';
  isActive?: boolean;
  isInfiniteScroll?: boolean;
  [key: string]: any;
}

interface UpdatePriceAdjustmentPayload {
  id: string;
  adjustmentData: any;
}

interface BulkCreateAdjustmentItem {
  category: 'transmission' | 'ownership' | 'color';
  code: string;
  name: string;
  colorHex?: string;
  adjustmentValue: number;
  isBaseline?: boolean;
  sortOrder?: number;
}

interface BulkCreatePriceAdjustmentPayload {
  modelId: string;
  adjustments: BulkCreateAdjustmentItem[];
}

interface ErrorResponse {
  message?: string;
  data?: any[];
  [key: string]: any;
}

// GET All Price Adjustments
export const getAllPriceAdjustments = createAsyncThunk<
  PriceAdjustmentResponse,
  GetPriceAdjustmentsParams,
  { rejectValue: ErrorResponse }
>(
  "priceAdjustment/getAllPriceAdjustments",
  async ({ page = 1, perPage = 10, isInfiniteScroll = false, ...filters }, { rejectWithValue }) => {
    try {
      const response = await instanceAxios.get(`/price-adjustments`, {
        params: { page, perPage, ...filters },
        headers: getHeaders(),
      });
      return {
        data: response.data.data,
        pagination: response.data.pagination,
        meta: { arg: { page, isInfiniteScroll } },
      };
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      return rejectWithValue(
        axiosError.response?.data || { message: "Terjadi kesalahan saat mengambil data" }
      );
    }
  }
);

// GET Price Adjustments by Model ID (ENDPOINT UTAMA)
export const getAdjustmentsByModelId = createAsyncThunk<
  AdjustmentsByModel,
  string,
  { rejectValue: ErrorResponse }
>(
  "priceAdjustment/getAdjustmentsByModelId",
  async (modelId, { rejectWithValue }) => {
    try {
      const response = await instanceAxios.get(`/car-models/${modelId}/price-adjustments`, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      return rejectWithValue(
        axiosError.response?.data || { message: "Terjadi kesalahan saat mengambil data" }
      );
    }
  }
);

// GET Price Adjustment by ID
export const getPriceAdjustmentById = createAsyncThunk<
  PriceAdjustment,
  string,
  { rejectValue: string }
>("priceAdjustment/getPriceAdjustmentById", async (id, { rejectWithValue }) => {
  try {
    const response = await instanceAxios.get(`/price-adjustments/${id}`, {
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

// POST Create Price Adjustment
export const createPriceAdjustment = createAsyncThunk<
  PriceAdjustment,
  any,
  { rejectValue: string }
>("priceAdjustment/createPriceAdjustment", async (adjustmentData, { rejectWithValue }) => {
  try {
    const response = await instanceAxios.post("/price-adjustments", adjustmentData, {
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

// POST Bulk Create Price Adjustments for Model
export const bulkCreatePriceAdjustments = createAsyncThunk<
  any,
  BulkCreatePriceAdjustmentPayload,
  { rejectValue: string }
>("priceAdjustment/bulkCreatePriceAdjustments", async ({ modelId, adjustments }, { rejectWithValue }) => {
  try {
    const response = await instanceAxios.post(`/car-models/${modelId}/price-adjustments/bulk`, {
      adjustments,
    }, {
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

// PUT Update Price Adjustment
export const updatePriceAdjustment = createAsyncThunk<
  { message: string; data: PriceAdjustment },
  UpdatePriceAdjustmentPayload,
  { rejectValue: string }
>("priceAdjustment/updatePriceAdjustment", async ({ id, adjustmentData }, { rejectWithValue }) => {
  try {
    const response = await instanceAxios.put(`/price-adjustments/${id}`, adjustmentData, {
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

// DELETE Price Adjustment
export const deletePriceAdjustment = createAsyncThunk<
  { id: string },
  string,
  { rejectValue: string }
>("priceAdjustment/deletePriceAdjustment", async (id, { rejectWithValue }) => {
  try {
    await instanceAxios.delete(`/price-adjustments/${id}`, {
      headers: getHeaders(),
    });
    return { id };
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    return rejectWithValue(
      axiosError.response?.data?.message || "Terjadi kesalahan"
    );
  }
});

const initialState: PriceAdjustmentState = {
  data: [],
  adjustmentsByModel: null,
  loadedPages: [],
  totalItems: 0,
  totalPages: 1,
  currentPage: 1,
  loading: false,
  error: null,
  selectedAdjustment: null,
  success: false,
};

const priceAdjustmentSlice = createSlice({
  name: "priceAdjustment",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
    clearSelectedAdjustment: (state) => {
      state.selectedAdjustment = null;
    },
    clearAdjustmentsByModel: (state) => {
      state.adjustmentsByModel = null;
    },
    resetDataPriceAdjustment: (state) => {
      state.data = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // GET All Price Adjustments
      .addCase(getAllPriceAdjustments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllPriceAdjustments.fulfilled, (state, action: PayloadAction<PriceAdjustmentResponse>) => {
        state.loading = false;
        state.data = action.payload.data || [];
        state.totalItems = action.payload.pagination?.totalRecords || 0;
        state.totalPages = action.payload.pagination?.totalPages || 1;
        state.currentPage = action.payload.pagination?.page || 1;
      })
      .addCase(getAllPriceAdjustments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Terjadi kesalahan";
      })

      // GET Adjustments by Model ID
      .addCase(getAdjustmentsByModelId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAdjustmentsByModelId.fulfilled, (state, action: PayloadAction<AdjustmentsByModel>) => {
        state.loading = false;
        state.adjustmentsByModel = action.payload;
      })
      .addCase(getAdjustmentsByModelId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Terjadi kesalahan";
      })

      // GET Price Adjustment by ID
      .addCase(getPriceAdjustmentById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPriceAdjustmentById.fulfilled, (state, action: PayloadAction<PriceAdjustment>) => {
        state.loading = false;
        state.selectedAdjustment = action.payload;
      })
      .addCase(getPriceAdjustmentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Terjadi kesalahan";
      })

      // POST Create Price Adjustment
      .addCase(createPriceAdjustment.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createPriceAdjustment.fulfilled, (state, action: PayloadAction<PriceAdjustment>) => {
        state.loading = false;
        state.data.push(action.payload);
        state.success = true;
      })
      .addCase(createPriceAdjustment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Terjadi kesalahan";
        state.success = false;
      })

      // POST Bulk Create Price Adjustments
      .addCase(bulkCreatePriceAdjustments.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(bulkCreatePriceAdjustments.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(bulkCreatePriceAdjustments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Terjadi kesalahan";
        state.success = false;
      })

      // PUT Update Price Adjustment
      .addCase(updatePriceAdjustment.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updatePriceAdjustment.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.data.findIndex((pa) => pa.id === action.payload.data.id);
        if (index !== -1) {
          state.data[index] = action.payload.data;
        }
        state.success = true;
      })
      .addCase(updatePriceAdjustment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Terjadi kesalahan";
        state.success = false;
      })

      // DELETE Price Adjustment
      .addCase(deletePriceAdjustment.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deletePriceAdjustment.fulfilled, (state, action: PayloadAction<{ id: string }>) => {
        state.loading = false;
        state.data = state.data.filter((pa) => pa.id !== action.payload.id);
        state.success = true;
      })
      .addCase(deletePriceAdjustment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Terjadi kesalahan";
        state.success = false;
      });
  },
});

export const { 
  clearError, 
  clearSuccess, 
  clearSelectedAdjustment, 
  clearAdjustmentsByModel, 
  resetDataPriceAdjustment 
} = priceAdjustmentSlice.actions;
export default priceAdjustmentSlice.reducer;
