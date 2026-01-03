import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import instanceAxios from "@/lib/axiosInstance/instanceAxios";
import { getHeaders, getHeadersFormData } from "@/lib/headers/headers";
import { AxiosError } from "axios";

// Types
export interface Listing {
  id: string;
  sellerId: string;
  seller: {
    id: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    whatsappNumber: string;
    location: string;
  };
  carModelId: string;
  carModel: {
    id: string;
    modelName: string;
    description?: string;
    basePrice?: number;
    brand: {
      id: string;
      name: string;
      logo?: string;
    };
  };
  year: number;
  price: number;
  mileage: number;
  transmission: string;
  fuelType: string;
  color: string;
  locationCity: string;
  locationProvince: string;
  description: string;
  condition: string;
  ownershipStatus?: string;
  taxStatus?: string;
  images: string[];
  sellerWhatsapp: string;
  isActive: boolean;
  viewCount: number;
  contactClickCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface FilterParams {
  page?: number;
  perPage?: number;
  search?: string;
  brandId?: string;
  carModelId?: string;
  minPrice?: number;
  maxPrice?: number;
  yearMin?: number;
  yearMax?: number;
  transmission?: string;
  fuelType?: string;
  locationCity?: string;
  locationProvince?: string;
  condition?: string;
  sortBy?: string;
  isActive?: boolean;
}

export interface CreateListingData {
  carModelId: string;
  year: number;
  price: number;
  mileage: number;
  transmission: string;
  fuelType: string;
  color: string;
  locationCity: string;
  locationProvince: string;
  description: string;
  condition?: string;
  ownershipStatus?: string;
  taxStatus?: string;
  images: File[]; // Changed from string[] to File[] for file upload
  sellerWhatsapp: string;
}

export interface UpdateListingData {
  price?: number;
  mileage?: number;
  description?: string;
  taxStatus?: string;
  images?: File[]; // Changed from string[] to File[] for file upload
  isActive?: boolean;
}

export interface WhatsAppLink {
  whatsappUrl: string;
  sellerPhone: string;
  preFilledMessage: string;
  seller: {
    name: string;
    location: string;
  };
  listing: {
    id: string;
    carBrand: string;
    carModel: string;
    year: number;
    price: number;
  };
}

interface ErrorResponse {
  message?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface MarketplaceState {
  listings: Listing[];
  myListings: Listing[];
  selectedListing: Listing | null;
  whatsappLink: WhatsAppLink | null;
  loading: boolean;
  detailLoading: boolean;
  createLoading: boolean;
  updateLoading: boolean;
  deleteLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    pageSize: number;
    totalRecords: number;
    totalPages: number;
  };
  myListingsPagination: {
    page: number;
    pageSize: number;
    totalRecords: number;
    totalPages: number;
  };
  myListingsSummary: {
    totalActiveListings: number;
    totalInactiveListings: number;
    totalViews: number;
    totalContactClicks: number;
  };
  filters: FilterParams;
}

const initialState: MarketplaceState = {
  listings: [],
  myListings: [],
  selectedListing: null,
  whatsappLink: null,
  loading: false,
  detailLoading: false,
  createLoading: false,
  updateLoading: false,
  deleteLoading: false,
  error: null,
  pagination: {
    page: 1,
    pageSize: 20,
    totalRecords: 0,
    totalPages: 0,
  },
  myListingsPagination: {
    page: 1,
    pageSize: 20,
    totalRecords: 0,
    totalPages: 0,
  },
  myListingsSummary: {
    totalActiveListings: 0,
    totalInactiveListings: 0,
    totalViews: 0,
    totalContactClicks: 0,
  },
  filters: {},
};

// Async Thunks

// Get all listings (public)
export const fetchListings = createAsyncThunk<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any,
  FilterParams,
  { rejectValue: string }
>(
  "marketplace/fetchListings",
  async (params: FilterParams = {}, { rejectWithValue }) => {
    try {
      const response = await instanceAxios.get(`/marketplace/listings`, {
        params,
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      return rejectWithValue(
        axiosError.response?.data?.message || "Gagal mengambil data listing"
      );
    }
  }
);

// Get listing detail
export const fetchListingDetail = createAsyncThunk<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any,
  string,
  { rejectValue: string }
>("marketplace/fetchListingDetail", async (id: string, { rejectWithValue }) => {
  try {
    const response = await instanceAxios.get(`/marketplace/listings/${id}`, {
      headers: getHeaders(),
    });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    return rejectWithValue(
      axiosError.response?.data?.message || "Gagal mengambil detail listing"
    );
  }
});

// Get my listings (authenticated)
export const fetchMyListings = createAsyncThunk<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any,
  FilterParams,
  { rejectValue: string }
>(
  "marketplace/fetchMyListings",
  async (params: FilterParams = {}, { rejectWithValue }) => {
    try {
      const response = await instanceAxios.get(`/marketplace/my-listings`, {
        params,
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      return rejectWithValue(
        axiosError.response?.data?.message || "Gagal mengambil listing saya"
      );
    }
  }
);

// Create listing with file upload
export const createListing = createAsyncThunk<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any,
  CreateListingData,
  { rejectValue: string }
>(
  "marketplace/createListing",
  async (data: CreateListingData, { rejectWithValue }) => {
    try {
      // Create FormData for multipart/form-data
      const formData = new FormData();

      // Append all text fields
      formData.append("carModelId", data.carModelId);
      formData.append("year", String(data.year));
      formData.append("price", String(data.price));
      formData.append("mileage", String(data.mileage));
      formData.append("transmission", data.transmission);
      formData.append("fuelType", data.fuelType);
      formData.append("color", data.color);
      formData.append("locationCity", data.locationCity);
      formData.append("locationProvince", data.locationProvince);
      formData.append("description", data.description);
      formData.append("sellerWhatsapp", data.sellerWhatsapp);

      // Append optional fields if they exist
      if (data.condition) formData.append("condition", data.condition);
      if (data.ownershipStatus)
        formData.append("ownershipStatus", data.ownershipStatus);
      if (data.taxStatus) formData.append("taxStatus", data.taxStatus);

      // Append image files
      data.images.forEach((file) => {
        formData.append("images", file);
      });

      const response = await instanceAxios.post(
        `/marketplace/listings`,
        formData,
        {
          headers: getHeadersFormData(),
        }
      );
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      return rejectWithValue(
        axiosError.response?.data?.message || "Gagal membuat listing"
      );
    }
  }
);

// Update listing with file upload
export const updateListing = createAsyncThunk<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any,
  { id: string; data: UpdateListingData },
  { rejectValue: string }
>(
  "marketplace/updateListing",
  async (
    { id, data }: { id: string; data: UpdateListingData },
    { rejectWithValue }
  ) => {
    try {
      // Create FormData for multipart/form-data
      const formData = new FormData();

      // Append optional fields if they exist
      if (data.price !== undefined)
        formData.append("price", String(data.price));
      if (data.mileage !== undefined)
        formData.append("mileage", String(data.mileage));
      if (data.description) formData.append("description", data.description);
      if (data.taxStatus) formData.append("taxStatus", data.taxStatus);
      if (data.isActive !== undefined)
        formData.append("isActive", String(data.isActive));

      // Append image files if provided
      if (data.images && data.images.length > 0) {
        data.images.forEach((file) => {
          formData.append("images", file);
        });
      }

      const response = await instanceAxios.put(
        `/marketplace/listings/${id}`,
        formData,
        {
          headers: getHeadersFormData(),
        }
      );
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      return rejectWithValue(
        axiosError.response?.data?.message || "Gagal mengupdate listing"
      );
    }
  }
);

// Delete listing
export const deleteListing = createAsyncThunk<
  { id: string },
  string,
  { rejectValue: string }
>("marketplace/deleteListing", async (id: string, { rejectWithValue }) => {
  try {
    const response = await instanceAxios.delete(`/marketplace/listings/${id}`, {
      headers: getHeaders(),
    });
    return { ...response.data, id };
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    return rejectWithValue(
      axiosError.response?.data?.message || "Gagal menghapus listing"
    );
  }
});

// Get WhatsApp link
export const getWhatsAppLink = createAsyncThunk<
  WhatsAppLink,
  string,
  { rejectValue: string }
>("marketplace/getWhatsAppLink", async (id: string, { rejectWithValue }) => {
  try {
    const response = await instanceAxios.get(
      `/marketplace/listings/${id}/whatsapp`,
      {
        headers: getHeaders(),
      }
    );
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    return rejectWithValue(
      axiosError.response?.data?.message || "Gagal mengambil link WhatsApp"
    );
  }
});

const marketplaceSlice = createSlice({
  name: "marketplace",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedListing: (state) => {
      state.selectedListing = null;
    },
    setFilters: (state, action: PayloadAction<FilterParams>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    clearWhatsAppLink: (state) => {
      state.whatsappLink = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Listings
    builder
      .addCase(fetchListings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchListings.fulfilled, (state, action) => {
        state.loading = false;
        state.listings = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchListings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch Listing Detail
    builder
      .addCase(fetchListingDetail.pending, (state) => {
        state.detailLoading = true;
        state.error = null;
      })
      .addCase(fetchListingDetail.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.selectedListing = action.payload.data;
      })
      .addCase(fetchListingDetail.rejected, (state, action) => {
        state.detailLoading = false;
        state.error = action.payload as string;
      });

    // Fetch My Listings
    builder
      .addCase(fetchMyListings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyListings.fulfilled, (state, action) => {
        state.loading = false;
        state.myListings = action.payload.data;
        state.myListingsPagination = action.payload.pagination;
        state.myListingsSummary = action.payload.summary;
      })
      .addCase(fetchMyListings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Create Listing
    builder
      .addCase(createListing.pending, (state) => {
        state.createLoading = true;
        state.error = null;
      })
      .addCase(createListing.fulfilled, (state, action) => {
        state.createLoading = false;
        state.myListings = [action.payload.data, ...state.myListings];
      })
      .addCase(createListing.rejected, (state, action) => {
        state.createLoading = false;
        state.error = action.payload as string;
      });

    // Update Listing
    builder
      .addCase(updateListing.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
      })
      .addCase(updateListing.fulfilled, (state, action) => {
        state.updateLoading = false;
        const index = state.myListings.findIndex(
          (l) => l.id === action.payload.data.id
        );
        if (index !== -1) {
          state.myListings[index] = {
            ...state.myListings[index],
            ...action.payload.data,
          };
        }
      })
      .addCase(updateListing.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.payload as string;
      });

    // Delete Listing
    builder
      .addCase(deleteListing.pending, (state) => {
        state.deleteLoading = true;
        state.error = null;
      })
      .addCase(deleteListing.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.myListings = state.myListings.filter(
          (l) => l.id !== action.payload.id
        );
      })
      .addCase(deleteListing.rejected, (state, action) => {
        state.deleteLoading = false;
        state.error = action.payload as string;
      });

    // Get WhatsApp Link
    builder
      .addCase(getWhatsAppLink.pending, (state) => {
        state.error = null;
      })
      .addCase(getWhatsAppLink.fulfilled, (state, action) => {
        state.whatsappLink = action.payload;
      })
      .addCase(getWhatsAppLink.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const {
  clearError,
  clearSelectedListing,
  setFilters,
  clearFilters,
  clearWhatsAppLink,
} = marketplaceSlice.actions;

export default marketplaceSlice.reducer;
