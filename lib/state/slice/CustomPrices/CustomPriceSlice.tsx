/* eslint-disable @typescript-eslint/no-explicit-any */
import instanceAxios from "@/lib/axiosInstance/instanceAxios";
import { getHeaders } from "@/lib/headers/headers";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { AxiosError } from "axios";

// Types
export interface CustomPrice {
  id: string;
  modelId: string;
  modelName: string;
  priceName: string;
  priceType: string;
  priceValue: number;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Pagination {
  page: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
}

interface CustomPriceResponse {
  data: CustomPrice[];
  pagination?: Pagination;
}

interface CustomPriceState {
  data: CustomPrice[];
  loadedPages: number[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  loading: boolean;
  error: string | null;
  selectedCustomPrice: CustomPrice | null;
  success: boolean;
}

interface GetCustomPriceParams {
  page?: number;
  perPage?: number;
  modelId?: string;
  [key: string]: any;
}

interface UpdateCustomPricePayload {
  id: string | number;
  customPriceData: any;
}

interface ErrorResponse {
  message?: string;
  data?: any[];
  [key: string]: any;
}

interface RootState {
  customPrices: CustomPriceState;
}

// GET Custom Prices with Filters
export const getCustomPricesWithFilters = createAsyncThunk<
  CustomPriceResponse,
  GetCustomPriceParams,
  { rejectValue: ErrorResponse; state: RootState }
>(
  "customPrices/getCustomPricesWithFilters",
  async ({ page = 1, perPage = 10, ...filters }, { rejectWithValue }) => {
    try {
      const response = await instanceAxios.get(`/custom-prices`, {
        params: { page, perPage, ...filters },
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      return rejectWithValue(
        axiosError.response?.data || {
          message: "Terjadi kesalahan saat mengambil data",
        }
      );
    }
  }
);

// GET Custom Prices by Model ID
export const getCustomPricesByModelId = createAsyncThunk<
  CustomPriceResponse,
  string | number,
  { rejectValue: ErrorResponse }
>(
  "customPrices/getCustomPricesByModelId",
  async (modelId, { rejectWithValue }) => {
    try {
      const response = await instanceAxios.get(
        `/car-models/${modelId}/custom-prices`,
        {
          headers: getHeaders(),
        }
      );
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      return rejectWithValue(
        axiosError.response?.data || {
          message: "Terjadi kesalahan saat mengambil data",
        }
      );
    }
  }
);

// GET Custom Price by ID
export const getCustomPriceById = createAsyncThunk<
  CustomPrice,
  string | number,
  { rejectValue: string }
>("customPrices/getCustomPriceById", async (id, { rejectWithValue }) => {
  try {
    const response = await instanceAxios.get(`/custom-prices/${id}`, {
      headers: getHeaders(),
    });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    return rejectWithValue(
      axiosError.response?.data?.message ||
        axiosError.message ||
        "Terjadi kesalahan"
    );
  }
});

// POST Create Custom Price
export const createCustomPrice = createAsyncThunk<
  CustomPrice,
  any,
  { rejectValue: string }
>(
  "customPrices/createCustomPrice",
  async (customPriceData, { rejectWithValue }) => {
    try {
      const response = await instanceAxios.post(
        "/custom-prices",
        customPriceData,
        {
          headers: getHeaders(),
        }
      );
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      return rejectWithValue(
        axiosError.response?.data?.message ||
          axiosError.message ||
          "Terjadi kesalahan"
      );
    }
  }
);

// PUT Update Custom Price
export const updateCustomPrice = createAsyncThunk<
  CustomPrice,
  UpdateCustomPricePayload,
  { rejectValue: string }
>(
  "customPrices/updateCustomPrice",
  async ({ id, customPriceData }, { rejectWithValue }) => {
    try {
      const response = await instanceAxios.put(
        `/custom-prices/${id}`,
        customPriceData,
        {
          headers: getHeaders(),
        }
      );
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      return rejectWithValue(
        axiosError.response?.data?.message ||
          axiosError.message ||
          "Terjadi kesalahan"
      );
    }
  }
);

// DELETE Custom Price
export const deleteCustomPrice = createAsyncThunk<
  { id: string | number },
  string | number,
  { rejectValue: string }
>("customPrices/deleteCustomPrice", async (id, { rejectWithValue }) => {
  try {
    const response = await instanceAxios.delete(`/custom-prices/${id}`, {
      headers: getHeaders(),
    });
    return { id, ...response.data };
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    return rejectWithValue(
      axiosError.response?.data?.message ||
        axiosError.message ||
        "Terjadi kesalahan"
    );
  }
});

const initialState: CustomPriceState = {
  data: [],
  loadedPages: [],
  totalItems: 0,
  totalPages: 1,
  currentPage: 1,
  loading: false,
  error: null,
  selectedCustomPrice: null,
  success: false,
};

const customPriceSlice = createSlice({
  name: "customPrices",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
    clearSelectedCustomPrice: (state) => {
      state.selectedCustomPrice = null;
    },
    resetDataCustomPrices: (state) => {
      state.data = [];
      state.loading = true;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCustomPricesWithFilters.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getCustomPricesWithFilters.fulfilled,
        (state, action: PayloadAction<CustomPriceResponse>) => {
          state.loading = false;
          state.data = action.payload.data;
          state.totalItems = action.payload.pagination?.totalRecords || 0;
          state.totalPages = action.payload.pagination?.totalPages || 1;
          state.currentPage = action.payload.pagination?.page || 1;
          state.loadedPages = [action.payload.pagination?.page || 1];
          state.error = null;
        }
      )
      .addCase(getCustomPricesWithFilters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Terjadi kesalahan";
      })
      .addCase(getCustomPricesByModelId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getCustomPricesByModelId.fulfilled,
        (state, action: PayloadAction<CustomPriceResponse>) => {
          state.loading = false;
          state.data = action.payload.data;
          state.error = null;
        }
      )
      .addCase(getCustomPricesByModelId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Terjadi kesalahan";
      })
      .addCase(getCustomPriceById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getCustomPriceById.fulfilled,
        (state, action: PayloadAction<CustomPrice>) => {
          state.loading = false;
          state.selectedCustomPrice = action.payload;
        }
      )
      .addCase(getCustomPriceById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Terjadi kesalahan";
      })
      .addCase(createCustomPrice.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(
        createCustomPrice.fulfilled,
        (state, action: PayloadAction<CustomPrice>) => {
          state.loading = false;
          state.data.push(action.payload);
          state.success = true;
        }
      )
      .addCase(createCustomPrice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Terjadi kesalahan";
        state.success = false;
      })
      .addCase(updateCustomPrice.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(
        updateCustomPrice.fulfilled,
        (state, action: PayloadAction<CustomPrice>) => {
          state.loading = false;
          const index = state.data.findIndex(
            (customPrice) => customPrice.id === action.payload.id
          );
          if (index !== -1) {
            state.data[index] = action.payload;
          }
          state.success = true;
        }
      )
      .addCase(updateCustomPrice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Terjadi kesalahan";
        state.success = false;
      })
      .addCase(deleteCustomPrice.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(
        deleteCustomPrice.fulfilled,
        (state, action: PayloadAction<{ id: string | number }>) => {
          state.loading = false;
          state.data = state.data.filter(
            (customPrice) => customPrice.id !== action.payload.id
          );
          state.success = true;
        }
      )
      .addCase(deleteCustomPrice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Terjadi kesalahan";
        state.success = false;
      });
  },
});

export const {
  clearError,
  clearSuccess,
  clearSelectedCustomPrice,
  resetDataCustomPrices,
} = customPriceSlice.actions;
export default customPriceSlice.reducer;
