import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import instanceAxios from "@/lib/axiosInstance/instanceAxios";
import { getHeaders } from "@/lib/headers/headers";
import { AxiosError } from "axios";

// Types
export interface BoostPackage {
  id: string;
  name: string;
  price: number;
  durationDays: number;
  estimatedReachMin: number;
  estimatedReachMax: number;
  priorityScore: number;
  description?: string;
  isActive: boolean;
  sortOrder: number;
}

export interface BoostTransaction {
  id: string;
  listingId: string;
  userId: string;
  packageId?: string;
  package?: BoostPackage;
  amount: number;
  currency: string;
  customDurationDays?: number;
  paymentMethod?: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'expired' | 'refunded';
  paymentReference?: string;
  paymentUrl?: string;
  startDate?: string;
  endDate?: string;
  priorityScore: number;
  estimatedReachMin: number;
  estimatedReachMax: number;
  actualReach: number;
  status: 'pending_payment' | 'active' | 'expired' | 'cancelled' | 'refunded';
  createdAt: string;
  updatedAt: string;
  paidAt?: string;
  expiredAt?: string;
  paymentExpiresAt?: string;
  listing?: {
    id: string;
    carModel: {
      modelName: string;
      brand: {
        name: string;
        logo?: string;
      };
    };
    year: number;
    price: number;
    images: string[];
  };
}

export interface BoostStatistic {
  date: string;
  impressions: number;
  clicks: number;
  contactClicks: number;
}

export interface BoostEstimation {
  listing: {
    id: string;
    title: string;
    currentViews: number;
    image: string | null;
  };
  package: {
    id: string;
    name: string;
    price: number;
    durationDays: number;
  } | null;
  customConfig: {
    budget: number;
    durationDays: number;
  } | null;
  estimation: {
    reachMin: number;
    reachMax: number;
    priorityScore: number;
    startDate: string;
    endDate: string;
  };
  totalAmount: number;
  currency: string;
}

export interface BoostOrderResponse {
  transaction: {
    id: string;
    listingId: string;
    amount: number;
    status: string;
    paymentStatus: string;
    paymentMethod: string;
    createdAt: string;
    expiresAt: string;
  };
  payment: {
    paymentUrl: string;
    paymentReference: string;
    qrCode?: string;
    virtualAccount?: string;
    bankName?: string;
    instructions: string[];
  };
  estimatedReach: {
    min: number;
    max: number;
  };
}

export interface TransactionStatistics {
  transaction: {
    id: string;
    status: string;
    startDate: string;
    endDate: string;
    daysRemaining: number;
  };
  estimation: {
    reachMin: number;
    reachMax: number;
  };
  actual: {
    totalImpressions: number;
    totalClicks: number;
    totalContactClicks: number;
    clickThroughRate: string;
    contactRate: string;
  };
  daily: BoostStatistic[];
}

export interface FeaturedListing {
  id: string;
  carModel: {
    modelName: string;
    brand: {
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
  images: string[];
  condition: string;
  ownershipStatus?: string;
  viewCount: number;
  isFeatured: boolean;
  featuredBadge: string;
  featuredUntil: string;
  createdAt: string;
}

interface ErrorResponse {
  message?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface BoostState {
  // Packages
  packages: BoostPackage[];
  packagesLoading: boolean;
  
  // Transactions
  transactions: BoostTransaction[];
  transactionsLoading: boolean;
  transactionsPagination: {
    page: number;
    pageSize: number;
    totalRecords: number;
    totalPages: number;
  };
  
  // Selected transaction
  selectedTransaction: BoostTransaction | null;
  selectedTransactionLoading: boolean;
  
  // Transaction Statistics
  transactionStatistics: TransactionStatistics | null;
  statisticsLoading: boolean;
  
  // Boost estimation
  estimation: BoostEstimation | null;
  estimationLoading: boolean;
  
  // Boost order response
  orderResponse: BoostOrderResponse | null;
  orderLoading: boolean;
  
  // Featured listings
  featuredListings: FeaturedListing[];
  featuredLoading: boolean;
  
  // General
  error: string | null;
}

const initialState: BoostState = {
  packages: [],
  packagesLoading: false,
  transactions: [],
  transactionsLoading: false,
  transactionsPagination: {
    page: 1,
    pageSize: 10,
    totalRecords: 0,
    totalPages: 0,
  },
  selectedTransaction: null,
  selectedTransactionLoading: false,
  transactionStatistics: null,
  statisticsLoading: false,
  estimation: null,
  estimationLoading: false,
  orderResponse: null,
  orderLoading: false,
  featuredListings: [],
  featuredLoading: false,
  error: null,
};

// ==================== ASYNC THUNKS ====================

// Fetch all boost packages (public)
export const fetchBoostPackages = createAsyncThunk<
  BoostPackage[],
  void,
  { rejectValue: string }
>("boost/fetchPackages", async (_, { rejectWithValue }) => {
  try {
    const response = await instanceAxios.get(`/boost/packages`, {
      headers: getHeaders(),
    });
    return response.data.data;
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    return rejectWithValue(
      axiosError.response?.data?.message || "Gagal mengambil paket boost"
    );
  }
});

// Calculate boost estimation
export const calculateBoost = createAsyncThunk<
  BoostEstimation,
  {
    listingId: string;
    packageId?: string;
    customBudget?: number;
    customDurationDays?: number;
  },
  { rejectValue: string }
>("boost/calculate", async (data, { rejectWithValue }) => {
  try {
    const response = await instanceAxios.post(`/boost/calculate`, data, {
      headers: getHeaders(),
    });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    return rejectWithValue(
      axiosError.response?.data?.message || "Gagal menghitung estimasi boost"
    );
  }
});

// Create boost order
export const createBoostOrder = createAsyncThunk<
  BoostOrderResponse,
  {
    listingId: string;
    packageId?: string;
    customBudget?: number;
    customDurationDays?: number;
    paymentMethod: string;
  },
  { rejectValue: string }
>("boost/createOrder", async (data, { rejectWithValue }) => {
  try {
    const { listingId, ...orderData } = data;
    const response = await instanceAxios.post(
      `/boost/listings/${listingId}/boost`,
      orderData,
      {
        headers: getHeaders(),
      }
    );
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    return rejectWithValue(
      axiosError.response?.data?.message || "Gagal membuat order boost"
    );
  }
});

// Fetch my boost transactions
export const fetchMyTransactions = createAsyncThunk<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any,
  {
    page?: number;
    perPage?: number;
    listingId?: string;
    status?: string;
    paymentStatus?: string;
  },
  { rejectValue: string }
>("boost/fetchMyTransactions", async (params = {}, { rejectWithValue }) => {
  try {
    const response = await instanceAxios.get(`/boost/transactions`, {
      params,
      headers: getHeaders(),
    });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    return rejectWithValue(
      axiosError.response?.data?.message || "Gagal mengambil transaksi boost"
    );
  }
});

// Fetch single transaction
export const fetchTransaction = createAsyncThunk<
  BoostTransaction,
  string,
  { rejectValue: string }
>("boost/fetchTransaction", async (id, { rejectWithValue }) => {
  try {
    const response = await instanceAxios.get(`/boost/transactions/${id}`, {
      headers: getHeaders(),
    });
    return response.data.data;
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    return rejectWithValue(
      axiosError.response?.data?.message || "Gagal mengambil detail transaksi"
    );
  }
});

// Fetch transaction statistics
export const fetchTransactionStatistics = createAsyncThunk<
  TransactionStatistics,
  string,
  { rejectValue: string }
>("boost/fetchStatistics", async (id, { rejectWithValue }) => {
  try {
    const response = await instanceAxios.get(
      `/boost/transactions/${id}/statistics`,
      {
        headers: getHeaders(),
      }
    );
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    return rejectWithValue(
      axiosError.response?.data?.message || "Gagal mengambil statistik boost"
    );
  }
});

// Cancel pending transaction
export const cancelTransaction = createAsyncThunk<
  BoostTransaction,
  string,
  { rejectValue: string }
>("boost/cancelTransaction", async (id, { rejectWithValue }) => {
  try {
    const response = await instanceAxios.post(
      `/boost/transactions/${id}/cancel`,
      {},
      {
        headers: getHeaders(),
      }
    );
    return response.data.data;
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    return rejectWithValue(
      axiosError.response?.data?.message || "Gagal membatalkan transaksi"
    );
  }
});

// Fetch featured listings (public)
export const fetchFeaturedListings = createAsyncThunk<
  { data: FeaturedListing[]; total: number },
  { limit?: number; category?: string },
  { rejectValue: string }
>("boost/fetchFeaturedListings", async (params = {}, { rejectWithValue }) => {
  try {
    const response = await instanceAxios.get(`/marketplace/featured`, {
      params,
      headers: getHeaders(),
    });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    return rejectWithValue(
      axiosError.response?.data?.message || "Gagal mengambil mobil unggulan"
    );
  }
});

// Simulate payment (dev only)
export const simulatePayment = createAsyncThunk<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any,
  string,
  { rejectValue: string }
>("boost/simulatePayment", async (paymentReference, { rejectWithValue }) => {
  try {
    const response = await instanceAxios.post(
      `/boost/webhook/payment/simulate`,
      { paymentReference },
      {
        headers: getHeaders(),
      }
    );
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    return rejectWithValue(
      axiosError.response?.data?.message || "Gagal simulasi pembayaran"
    );
  }
});

// ==================== SLICE ====================

const boostSlice = createSlice({
  name: "boost",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearEstimation: (state) => {
      state.estimation = null;
    },
    clearOrderResponse: (state) => {
      state.orderResponse = null;
    },
    clearSelectedTransaction: (state) => {
      state.selectedTransaction = null;
      state.transactionStatistics = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Packages
    builder
      .addCase(fetchBoostPackages.pending, (state) => {
        state.packagesLoading = true;
        state.error = null;
      })
      .addCase(fetchBoostPackages.fulfilled, (state, action) => {
        state.packagesLoading = false;
        state.packages = action.payload;
      })
      .addCase(fetchBoostPackages.rejected, (state, action) => {
        state.packagesLoading = false;
        state.error = action.payload as string;
      });

    // Calculate Boost
    builder
      .addCase(calculateBoost.pending, (state) => {
        state.estimationLoading = true;
        state.error = null;
      })
      .addCase(calculateBoost.fulfilled, (state, action) => {
        state.estimationLoading = false;
        state.estimation = action.payload;
      })
      .addCase(calculateBoost.rejected, (state, action) => {
        state.estimationLoading = false;
        state.error = action.payload as string;
      });

    // Create Order
    builder
      .addCase(createBoostOrder.pending, (state) => {
        state.orderLoading = true;
        state.error = null;
      })
      .addCase(createBoostOrder.fulfilled, (state, action) => {
        state.orderLoading = false;
        state.orderResponse = action.payload;
      })
      .addCase(createBoostOrder.rejected, (state, action) => {
        state.orderLoading = false;
        state.error = action.payload as string;
      });

    // Fetch My Transactions
    builder
      .addCase(fetchMyTransactions.pending, (state) => {
        state.transactionsLoading = true;
        state.error = null;
      })
      .addCase(fetchMyTransactions.fulfilled, (state, action) => {
        state.transactionsLoading = false;
        state.transactions = action.payload.data;
        state.transactionsPagination = action.payload.pagination;
      })
      .addCase(fetchMyTransactions.rejected, (state, action) => {
        state.transactionsLoading = false;
        state.error = action.payload as string;
      });

    // Fetch Single Transaction
    builder
      .addCase(fetchTransaction.pending, (state) => {
        state.selectedTransactionLoading = true;
        state.error = null;
      })
      .addCase(fetchTransaction.fulfilled, (state, action) => {
        state.selectedTransactionLoading = false;
        state.selectedTransaction = action.payload;
      })
      .addCase(fetchTransaction.rejected, (state, action) => {
        state.selectedTransactionLoading = false;
        state.error = action.payload as string;
      });

    // Fetch Statistics
    builder
      .addCase(fetchTransactionStatistics.pending, (state) => {
        state.statisticsLoading = true;
        state.error = null;
      })
      .addCase(fetchTransactionStatistics.fulfilled, (state, action) => {
        state.statisticsLoading = false;
        state.transactionStatistics = action.payload;
      })
      .addCase(fetchTransactionStatistics.rejected, (state, action) => {
        state.statisticsLoading = false;
        state.error = action.payload as string;
      });

    // Cancel Transaction
    builder
      .addCase(cancelTransaction.pending, (state) => {
        state.error = null;
      })
      .addCase(cancelTransaction.fulfilled, (state, action) => {
        const index = state.transactions.findIndex(
          (t) => t.id === action.payload.id
        );
        if (index !== -1) {
          state.transactions[index] = action.payload;
        }
        if (state.selectedTransaction?.id === action.payload.id) {
          state.selectedTransaction = action.payload;
        }
      })
      .addCase(cancelTransaction.rejected, (state, action) => {
        state.error = action.payload as string;
      });

    // Fetch Featured Listings
    builder
      .addCase(fetchFeaturedListings.pending, (state) => {
        state.featuredLoading = true;
        state.error = null;
      })
      .addCase(fetchFeaturedListings.fulfilled, (state, action) => {
        state.featuredLoading = false;
        state.featuredListings = action.payload.data;
      })
      .addCase(fetchFeaturedListings.rejected, (state, action) => {
        state.featuredLoading = false;
        state.error = action.payload as string;
      });

    // Simulate Payment
    builder
      .addCase(simulatePayment.pending, (state) => {
        state.error = null;
      })
      .addCase(simulatePayment.fulfilled, (state) => {
        // Refresh transactions after successful payment
      })
      .addCase(simulatePayment.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const {
  clearError,
  clearEstimation,
  clearOrderResponse,
  clearSelectedTransaction,
} = boostSlice.actions;

export default boostSlice.reducer;
