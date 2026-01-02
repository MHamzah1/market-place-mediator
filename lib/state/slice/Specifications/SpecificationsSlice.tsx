/* eslint-disable @typescript-eslint/no-explicit-any */
import instanceAxios from "@/lib/axiosInstance/instanceAxios";
import { getHeaders } from "@/lib/headers/headers";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { AxiosError } from "axios";

// Types
// ...existing code...

// Types
export interface Specification {
  id: string;
  modelId: string;
  modelName?: string;
  specCode?: string;
  specName: string;
  specCategory: string;
  specValue: string;
  specUnit: string;
  description: string;
  engineCapacity?: string;
  transmission?: string;
  fuelType?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  carModel?: {
    id: string;
    brandId: string;
    modelName: string;
    description: string;
    basePrice: string;
    imageUrl: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    brand?: {
      id: string;
      name: string;
      description: string;
      logo: string;
      isActive: boolean;
      createdAt: string;
      updatedAt: string;
    };
  };
}

// ...existing code...

// Pagination interface
interface Pagination {
  page: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
}

interface SpecificationResponse {
  data: Specification[];
  pagination?: Pagination;
  page?: number;
  meta?: {
    arg?: {
      page?: number;
      isInfiniteScroll?: boolean;
    };
  };
}

interface SpecificationState {
  data: Specification[];
  loadedPages: number[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  loading: boolean;
  error: string | null;
  selectedSpecification: Specification | null;
  success: boolean;
}

interface GetSpecificationsParams {
  page?: number;
  perPage?: number;
  pageSize?: number;
  modelId?: string;
  search?: string;
  sortBy?: string;
  sortDirection?: "ASC" | "DESC";
  isInfiniteScroll?: boolean;
  [key: string]: any;
}

interface UpdateSpecificationPayload {
  id: string | number;
  specificationData: any;
}

interface ErrorResponse {
  message?: string;
  data?: any[];
  [key: string]: any;
}

interface RootState {
  Specifications: SpecificationState;
}

// GET Specifications with Filters
export const getSpecificationsWithFilters = createAsyncThunk<
  SpecificationResponse,
  GetSpecificationsParams,
  { rejectValue: ErrorResponse; state: RootState }
>(
  "Specifications/getSpecificationsWithFilters",
  async (
    { page = 1, perPage = 10, isInfiniteScroll = false, ...filters },
    { rejectWithValue }
  ) => {
    try {
      const response = await instanceAxios.get(`/specifications`, {
        params: { page, pageSize: perPage, ...filters },
        headers: getHeaders(),
      });
      return {
        data: response.data.data,
        pagination: response.data.pagination,
        page,
        meta: { arg: { page, isInfiniteScroll } },
      };
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      console.log("error fetching data", error);
      return rejectWithValue(
        axiosError.response?.data || {
          message: "Terjadi kesalahan saat mengambil data",
        }
      );
    }
  }
);

// GET Specifications for Table (with all filters)
export const getSpecificationsForTable = createAsyncThunk<
  SpecificationResponse,
  GetSpecificationsParams,
  { rejectValue: ErrorResponse }
>(
  "Specifications/getSpecificationsForTable",
  async ({ isInfiniteScroll = false, ...filters }, { rejectWithValue }) => {
    try {
      // Map perPage to pageSize for API
      const params = {
        ...filters,
        pageSize: filters.perPage || filters.pageSize || 10,
      };
      delete params.perPage;

      const response = await instanceAxios.get(`/specifications`, {
        params,
        headers: getHeaders(),
      });

      console.log("Response API Specifications (Filtered):", response.data);

      return {
        ...response.data,
        meta: {
          arg: {
            page: filters.page,
            isInfiniteScroll,
          },
        },
      };
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      if (axiosError.response?.status === 404) {
        return rejectWithValue({
          message: "Tidak ada data yang tersedia",
          data: [],
        });
      }
      return rejectWithValue(
        axiosError.response?.data || {
          message: "Terjadi kesalahan saat mengambil data",
        }
      );
    }
  }
);

// GET Specifications for Select (dropdown/autocomplete)
export const getSpecificationsForSelect = createAsyncThunk<
  SpecificationResponse,
  GetSpecificationsParams,
  { rejectValue: ErrorResponse }
>(
  "Specifications/getSpecificationsForSelect",
  async ({ isInfiniteScroll = false, ...filters }, { rejectWithValue }) => {
    try {
      const params = {
        ...filters,
        pageSize: filters.perPage || filters.pageSize || 100,
      };
      delete params.perPage;

      const response = await instanceAxios.get(`/specifications`, {
        params,
        headers: getHeaders(),
      });

      console.log("Response API Specifications for Select:", response.data);

      return {
        ...response.data,
        meta: {
          arg: {
            page: filters.page,
            isInfiniteScroll,
          },
        },
      };
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      if (axiosError.response?.status === 404) {
        return rejectWithValue({
          message: "Tidak ada data yang tersedia",
          data: [],
        });
      }
      return rejectWithValue(
        axiosError.response?.data || {
          message: "Terjadi kesalahan saat mengambil data",
        }
      );
    }
  }
);

// GET Specification by ID
export const getSpecificationById = createAsyncThunk<
  Specification,
  string | number,
  { rejectValue: string }
>("Specifications/getSpecificationById", async (id, { rejectWithValue }) => {
  try {
    const response = await instanceAxios.get(`/specifications/${id}`, {
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

// POST Create Specification
export const createSpecification = createAsyncThunk<
  Specification,
  any,
  { rejectValue: string }
>(
  "Specifications/createSpecification",
  async (specificationData, { rejectWithValue }) => {
    try {
      const response = await instanceAxios.post(
        "/specifications",
        specificationData,
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

// PUT Update Specification
export const updateSpecification = createAsyncThunk<
  Specification,
  UpdateSpecificationPayload,
  { rejectValue: string }
>(
  "Specifications/updateSpecification",
  async ({ id, specificationData }, { rejectWithValue }) => {
    try {
      const response = await instanceAxios.put(
        `/specifications/${id}`,
        specificationData,
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

// DELETE Specification
export const deleteSpecification = createAsyncThunk<
  { id: string | number },
  string | number,
  { rejectValue: string }
>("Specifications/deleteSpecification", async (id, { rejectWithValue }) => {
  try {
    const response = await instanceAxios.delete(`/specifications/${id}`, {
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

const initialState: SpecificationState = {
  data: [],
  loadedPages: [],
  totalItems: 0,
  totalPages: 1,
  currentPage: 1,
  loading: false,
  error: null,
  selectedSpecification: null,
  success: false,
};

const specificationSlice = createSlice({
  name: "Specifications",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
    clearSelectedSpecification: (state) => {
      state.selectedSpecification = null;
    },
    resetDataSpecifications: (state) => {
      state.data = [];
      state.loading = true;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder

      // GET Specifications with Filters
      .addCase(getSpecificationsWithFilters.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getSpecificationsWithFilters.fulfilled,
        (state, action: PayloadAction<SpecificationResponse>) => {
          state.loading = false;
          state.data = action.payload.data;
          state.totalItems = action.payload.pagination?.totalRecords || 0;
          state.totalPages = action.payload.pagination?.totalPages || 1;
          state.currentPage = action.payload.page || 1;
          state.loadedPages = action.payload.meta?.arg?.isInfiniteScroll
            ? state.loadedPages.concat(action.payload.page || 1)
            : [action.payload.page || 1];
          state.error = null;
        }
      )
      .addCase(getSpecificationsWithFilters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Terjadi kesalahan";
      })

      // GET Specifications for Select
      .addCase(getSpecificationsForSelect.pending, (state, action) => {
        state.loading = true;
        state.error = null;

        const isInfiniteScroll = action.meta.arg?.isInfiniteScroll;

        if (!isInfiniteScroll) {
          state.loadedPages = [];
        }
      })
      .addCase(
        getSpecificationsForSelect.fulfilled,
        (state, action: PayloadAction<SpecificationResponse>) => {
          state.loading = false;

          const isInfiniteScroll =
            action.payload.meta?.arg?.isInfiniteScroll || false;
          const currentPageFromArg = action.payload.meta?.arg?.page || 1;

          if (!isInfiniteScroll) {
            state.data = action.payload.data || [];
            state.loadedPages = [currentPageFromArg];
          } else {
            const existingIds = new Set(
              state.data.map((item: Specification) => item.id)
            );
            const newItems = (action.payload.data || []).filter(
              (item: Specification) => !existingIds.has(item.id)
            );

            state.data = [...state.data, ...newItems];

            if (!state.loadedPages.includes(currentPageFromArg)) {
              state.loadedPages.push(currentPageFromArg);
            }
          }

          state.totalItems = action.payload.pagination?.totalRecords || 0;
          state.totalPages = action.payload.pagination?.totalPages || 1;
          state.currentPage = currentPageFromArg;
        }
      )
      .addCase(getSpecificationsForSelect.rejected, (state, action) => {
        state.loading = false;
        state.data = [];
        state.error = action.payload?.message || "Gagal mengambil data";
      })

      // GET Specifications for Table
      .addCase(getSpecificationsForTable.pending, (state, action) => {
        state.loading = true;
        state.error = null;

        const isInfiniteScroll = action.meta.arg?.isInfiniteScroll;

        if (!isInfiniteScroll) {
          state.loadedPages = [];
        }
      })
      .addCase(
        getSpecificationsForTable.fulfilled,
        (state, action: PayloadAction<SpecificationResponse>) => {
          state.loading = false;

          const isInfiniteScroll =
            action.payload.meta?.arg?.isInfiniteScroll || false;
          const currentPageFromArg = action.payload.meta?.arg?.page || 1;

          if (!isInfiniteScroll) {
            state.data = action.payload.data || [];
            state.loadedPages = [currentPageFromArg];
          } else {
            const existingIds = new Set(
              state.data.map((item: Specification) => item.id)
            );
            const newItems = (action.payload.data || []).filter(
              (item: Specification) => !existingIds.has(item.id)
            );

            state.data = [...state.data, ...newItems];

            if (!state.loadedPages.includes(currentPageFromArg)) {
              state.loadedPages.push(currentPageFromArg);
            }
          }

          state.totalItems = action.payload.pagination?.totalRecords || 0;
          state.totalPages = action.payload.pagination?.totalPages || 1;
          state.currentPage = currentPageFromArg;
        }
      )
      .addCase(getSpecificationsForTable.rejected, (state, action) => {
        state.loading = false;
        state.data = [];
        state.error = action.payload?.message || "Gagal mengambil data";
      })

      // GET Specification by ID
      .addCase(getSpecificationById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getSpecificationById.fulfilled,
        (state, action: PayloadAction<Specification>) => {
          state.loading = false;
          state.selectedSpecification = action.payload;
        }
      )
      .addCase(getSpecificationById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Terjadi kesalahan";
      })

      // POST Create Specification
      .addCase(createSpecification.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(
        createSpecification.fulfilled,
        (state, action: PayloadAction<Specification>) => {
          state.loading = false;
          state.data.push(action.payload);
          state.success = true;
        }
      )
      .addCase(createSpecification.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Terjadi kesalahan";
        state.success = false;
      })

      // PUT Update Specification
      .addCase(updateSpecification.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(
        updateSpecification.fulfilled,
        (state, action: PayloadAction<Specification>) => {
          state.loading = false;
          const index = state.data.findIndex(
            (spec) => spec.id === action.payload.id
          );
          if (index !== -1) {
            state.data[index] = action.payload;
          }
          state.success = true;
        }
      )
      .addCase(updateSpecification.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Terjadi kesalahan";
        state.success = false;
      })

      // DELETE Specification
      .addCase(deleteSpecification.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(
        deleteSpecification.fulfilled,
        (state, action: PayloadAction<{ id: string | number }>) => {
          state.loading = false;
          state.data = state.data.filter(
            (spec) => spec.id !== action.payload.id
          );
          state.success = true;
        }
      )
      .addCase(deleteSpecification.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Terjadi kesalahan";
        state.success = false;
      });
  },
});

export const {
  clearError,
  clearSuccess,
  clearSelectedSpecification,
  resetDataSpecifications,
} = specificationSlice.actions;
export default specificationSlice.reducer;
