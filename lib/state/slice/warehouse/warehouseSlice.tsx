import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import instanceAxios from "@/lib/axiosInstance/instanceAxios";
import { getHeaders } from "@/lib/headers/headers";
import { AxiosError } from "axios";

// ============================================================
// TYPES
// ============================================================

export interface Showroom {
  id: string;
  ownerId: string;
  name: string;
  code: string;
  address: string;
  city: string;
  province: string;
  phone?: string;
  whatsapp?: string;
  logo?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type VehicleStatus =
  | "inspecting"
  | "registered"
  | "in_warehouse"
  | "in_repair"
  | "ready"
  | "listed"
  | "sold"
  | "rejected";

export interface WarehouseVehicle {
  id: string;
  showroomId: string;
  showroom?: Showroom;
  sellerId: string;
  carModelId?: string;
  barcode: string;
  brandName: string;
  modelName: string;
  year: number;
  color: string;
  licensePlate: string;
  chassisNumber: string;
  engineNumber: string;
  mileage: number;
  transmission: string;
  fuelType: string;
  askingPrice: number;
  images?: string[];
  sellerName: string;
  sellerPhone: string;
  sellerKtp?: string;
  status: VehicleStatus;
  listingId?: string;
  notes?: string;
  inspections?: VehicleInspection[];
  placements?: VehiclePlacement[];
  repairs?: RepairOrder[];
  createdAt: string;
  updatedAt: string;
}

export type InspectionType = "initial" | "re_inspection" | "qc";
export type InspectionResult = "accepted_ready" | "accepted_repair" | "rejected";
export type DocumentStatus = "complete" | "incomplete" | "invalid";

export interface VehicleInspection {
  id: string;
  warehouseVehicleId: string;
  inspectorId: string;
  inspectionType: InspectionType;
  overallResult: InspectionResult;
  exteriorScore?: number;
  interiorScore?: number;
  engineScore?: number;
  electricalScore?: number;
  chassisScore?: number;
  documentStatus: DocumentStatus;
  hasBpkb: boolean;
  hasStnk: boolean;
  hasFaktur: boolean;
  hasKtp: boolean;
  hasSpareKey: boolean;
  chassisNumberMatch: boolean;
  repairNotes?: string;
  rejectionReason?: string;
  photos?: string[];
  inspectedAt: string;
  createdAt: string;
  updatedAt: string;
}

export type ZoneType = "ready" | "light_repair" | "heavy_repair" | "holding" | "showroom_display";

export interface WarehouseZone {
  id: string;
  showroomId: string;
  code: string;
  name: string;
  type: ZoneType;
  capacity: number;
  currentCount: number;
  isActive: boolean;
}

export interface VehiclePlacement {
  id: string;
  warehouseVehicleId: string;
  zoneId: string;
  zone?: WarehouseZone;
  scannedById: string;
  action: "placed" | "moved" | "removed";
  isCurrent: boolean;
  placedAt: string;
  removedAt?: string;
}

export type RepairType = "light" | "heavy";
export type RepairStatus = "pending" | "in_progress" | "completed" | "cancelled";

export interface RepairOrder {
  id: string;
  warehouseVehicleId: string;
  warehouseVehicle?: WarehouseVehicle;
  assignedToId?: string;
  repairType: RepairType;
  description: string;
  estimatedCost?: number;
  actualCost?: number;
  status: RepairStatus;
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminPayment {
  id: string;
  warehouseVehicleId: string;
  payerId: string;
  amount: number;
  paymentMethod?: string;
  paymentStatus: "pending" | "paid" | "failed" | "expired";
  paymentReference?: string;
  paymentUrl?: string;
  invoiceNumber: string;
  paidAt?: string;
  expiresAt?: string;
  createdAt: string;
}

export interface PurchaseTransaction {
  id: string;
  warehouseVehicleId: string;
  warehouseVehicle?: WarehouseVehicle;
  listingId?: string;
  buyerId: string;
  totalPrice: number;
  paymentType: "cash" | "credit" | "booking_fee";
  downPayment?: number;
  paymentMethod?: string;
  paymentStatus: "pending" | "dp_paid" | "fully_paid" | "failed" | "refunded";
  paymentReference?: string;
  paymentUrl?: string;
  invoiceNumber: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  buyerName: string;
  buyerPhone: string;
  buyerKtp?: string;
  paidAt?: string;
  completedAt?: string;
  createdAt: string;
}

export interface StockLog {
  id: string;
  showroomId: string;
  warehouseVehicleId: string;
  warehouseVehicle?: WarehouseVehicle;
  action: "vehicle_in" | "vehicle_out" | "status_change" | "zone_transfer";
  previousStatus?: string;
  newStatus?: string;
  performedById: string;
  notes?: string;
  createdAt: string;
}

export interface DashboardSummary {
  totalVehicles: number;
  statusCounts: Record<string, number>;
  zoneSummary: Array<{
    zone: WarehouseZone;
    vehicleCount: number;
  }>;
  recentActivity: StockLog[];
}

export interface StockSummary {
  totalVehicles: number;
  statusBreakdown: Record<string, number>;
  monthlyIn: number;
  monthlyOut: number;
}

// ============================================================
// DTO TYPES
// ============================================================

export interface CreateShowroomData {
  name: string;
  code: string;
  address: string;
  city: string;
  province: string;
  phone?: string;
  whatsapp?: string;
}

export interface CreateVehicleData {
  showroomId: string;
  brandName: string;
  modelName: string;
  year: number;
  color: string;
  licensePlate: string;
  chassisNumber: string;
  engineNumber: string;
  mileage: number;
  transmission: string;
  fuelType: string;
  askingPrice: number;
  sellerName: string;
  sellerPhone: string;
  sellerKtp?: string;
  notes?: string;
  carModelId?: string;
}

export interface CreateInspectionData {
  warehouseVehicleId: string;
  inspectionType: InspectionType;
  overallResult: InspectionResult;
  exteriorScore?: number;
  interiorScore?: number;
  engineScore?: number;
  electricalScore?: number;
  chassisScore?: number;
  documentStatus: DocumentStatus;
  hasBpkb: boolean;
  hasStnk: boolean;
  hasFaktur: boolean;
  hasKtp: boolean;
  hasSpareKey: boolean;
  chassisNumberMatch: boolean;
  repairNotes?: string;
  rejectionReason?: string;
}

export interface CreateZoneData {
  showroomId: string;
  code: string;
  name: string;
  type: ZoneType;
  capacity: number;
}

export interface PlaceVehicleData {
  zoneId: string;
}

export interface CreateRepairData {
  warehouseVehicleId: string;
  repairType: RepairType;
  description: string;
  estimatedCost?: number;
  assignedToId?: string;
}

export interface CreatePurchaseData {
  warehouseVehicleId: string;
  totalPrice: number;
  paymentType: "cash" | "credit" | "booking_fee";
  downPayment?: number;
  buyerName: string;
  buyerPhone: string;
  buyerKtp?: string;
}

export interface VehicleQueryParams {
  showroomId?: string;
  status?: VehicleStatus;
  search?: string;
  page?: number;
  perPage?: number;
}

// ============================================================
// STATE
// ============================================================

interface ErrorResponse {
  message?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface WarehouseState {
  // Showrooms
  showrooms: Showroom[];
  selectedShowroom: Showroom | null;
  dashboard: DashboardSummary | null;

  // Vehicles
  vehicles: WarehouseVehicle[];
  selectedVehicle: WarehouseVehicle | null;

  // Inspections
  inspections: VehicleInspection[];

  // Zones
  zones: WarehouseZone[];

  // Repairs
  repairs: RepairOrder[];

  // Payments
  adminPayment: AdminPayment | null;

  // Purchases
  purchases: PurchaseTransaction[];
  selectedPurchase: PurchaseTransaction | null;

  // Stock Logs
  stockLogs: StockLog[];
  stockSummary: StockSummary | null;

  // UI State
  loading: boolean;
  actionLoading: boolean;
  error: string | null;
  successMessage: string | null;

  pagination: {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
  };
}

const initialState: WarehouseState = {
  showrooms: [],
  selectedShowroom: null,
  dashboard: null,
  vehicles: [],
  selectedVehicle: null,
  inspections: [],
  zones: [],
  repairs: [],
  adminPayment: null,
  purchases: [],
  selectedPurchase: null,
  stockLogs: [],
  stockSummary: null,
  loading: false,
  actionLoading: false,
  error: null,
  successMessage: null,
  pagination: { page: 1, perPage: 20, total: 0, totalPages: 0 },
};

// ============================================================
// ASYNC THUNKS — SHOWROOM
// ============================================================

export const fetchShowrooms = createAsyncThunk<Showroom[], void, { rejectValue: string }>(
  "warehouse/fetchShowrooms",
  async (_, { rejectWithValue }) => {
    try {
      const res = await instanceAxios.get("/warehouse/showrooms", { headers: getHeaders() });
      return res.data?.data ?? res.data;
    } catch (e) {
      const err = e as AxiosError<ErrorResponse>;
      return rejectWithValue(err.response?.data?.message || "Gagal mengambil data showroom");
    }
  }
);

export const fetchShowroomDetail = createAsyncThunk<Showroom, string, { rejectValue: string }>(
  "warehouse/fetchShowroomDetail",
  async (id, { rejectWithValue }) => {
    try {
      const res = await instanceAxios.get(`/warehouse/showrooms/${id}`, { headers: getHeaders() });
      return res.data?.data ?? res.data;
    } catch (e) {
      const err = e as AxiosError<ErrorResponse>;
      return rejectWithValue(err.response?.data?.message || "Gagal mengambil detail showroom");
    }
  }
);

export const fetchShowroomDashboard = createAsyncThunk<DashboardSummary, string, { rejectValue: string }>(
  "warehouse/fetchShowroomDashboard",
  async (id, { rejectWithValue }) => {
    try {
      const res = await instanceAxios.get(`/warehouse/showrooms/${id}/dashboard`, { headers: getHeaders() });
      return res.data?.data ?? res.data;
    } catch (e) {
      const err = e as AxiosError<ErrorResponse>;
      return rejectWithValue(err.response?.data?.message || "Gagal mengambil dashboard");
    }
  }
);

export const createShowroom = createAsyncThunk<Showroom, CreateShowroomData, { rejectValue: string }>(
  "warehouse/createShowroom",
  async (data, { rejectWithValue }) => {
    try {
      const res = await instanceAxios.post("/warehouse/showrooms", data, { headers: getHeaders() });
      return res.data?.data ?? res.data;
    } catch (e) {
      const err = e as AxiosError<ErrorResponse>;
      return rejectWithValue(err.response?.data?.message || "Gagal membuat showroom");
    }
  }
);

export const updateShowroom = createAsyncThunk<Showroom, { id: string; data: CreateShowroomData }, { rejectValue: string }>(
  "warehouse/updateShowroom",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await instanceAxios.put(`/warehouse/showrooms/${id}`, data, { headers: getHeaders() });
      return res.data?.data ?? res.data;
    } catch (e) {
      const err = e as AxiosError<ErrorResponse>;
      return rejectWithValue(err.response?.data?.message || "Gagal mengupdate showroom");
    }
  }
);

export const deleteShowroom = createAsyncThunk<string, string, { rejectValue: string }>(
  "warehouse/deleteShowroom",
  async (id, { rejectWithValue }) => {
    try {
      await instanceAxios.delete(`/warehouse/showrooms/${id}`, { headers: getHeaders() });
      return id;
    } catch (e) {
      const err = e as AxiosError<ErrorResponse>;
      return rejectWithValue(err.response?.data?.message || "Gagal menghapus showroom");
    }
  }
);

// ============================================================
// ASYNC THUNKS — VEHICLE
// ============================================================

export const fetchVehicles = createAsyncThunk<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any,
  VehicleQueryParams,
  { rejectValue: string }
>("warehouse/fetchVehicles", async (params, { rejectWithValue }) => {
  try {
    const res = await instanceAxios.get("/warehouse/vehicles", { params, headers: getHeaders() });
    return res.data;
  } catch (e) {
    const err = e as AxiosError<ErrorResponse>;
    return rejectWithValue(err.response?.data?.message || "Gagal mengambil data kendaraan");
  }
});

export const fetchVehicleDetail = createAsyncThunk<WarehouseVehicle, string, { rejectValue: string }>(
  "warehouse/fetchVehicleDetail",
  async (id, { rejectWithValue }) => {
    try {
      const res = await instanceAxios.get(`/warehouse/vehicles/${id}`, { headers: getHeaders() });
      return res.data?.data ?? res.data;
    } catch (e) {
      const err = e as AxiosError<ErrorResponse>;
      return rejectWithValue(err.response?.data?.message || "Gagal mengambil detail kendaraan");
    }
  }
);

export const fetchVehicleByBarcode = createAsyncThunk<WarehouseVehicle, string, { rejectValue: string }>(
  "warehouse/fetchVehicleByBarcode",
  async (barcode, { rejectWithValue }) => {
    try {
      const res = await instanceAxios.get(`/warehouse/vehicles/barcode/${barcode}`, { headers: getHeaders() });
      return res.data?.data ?? res.data;
    } catch (e) {
      const err = e as AxiosError<ErrorResponse>;
      return rejectWithValue(err.response?.data?.message || "Kendaraan tidak ditemukan");
    }
  }
);

export const registerVehicle = createAsyncThunk<WarehouseVehicle, CreateVehicleData, { rejectValue: string }>(
  "warehouse/registerVehicle",
  async (data, { rejectWithValue }) => {
    try {
      const res = await instanceAxios.post("/warehouse/vehicles", data, { headers: getHeaders() });
      return res.data?.data ?? res.data;
    } catch (e) {
      const err = e as AxiosError<ErrorResponse>;
      return rejectWithValue(err.response?.data?.message || "Gagal mendaftarkan kendaraan");
    }
  }
);

export const updateVehicleStatus = createAsyncThunk<
  WarehouseVehicle,
  { id: string; status: VehicleStatus },
  { rejectValue: string }
>("warehouse/updateVehicleStatus", async ({ id, status }, { rejectWithValue }) => {
  try {
    const res = await instanceAxios.patch(`/warehouse/vehicles/${id}/status`, null, {
      params: { status },
      headers: getHeaders(),
    });
    return res.data?.data ?? res.data;
  } catch (e) {
    const err = e as AxiosError<ErrorResponse>;
    return rejectWithValue(err.response?.data?.message || "Gagal update status");
  }
});

export const placeVehicle = createAsyncThunk<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any,
  { id: string; data: PlaceVehicleData },
  { rejectValue: string }
>("warehouse/placeVehicle", async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await instanceAxios.post(`/warehouse/vehicles/${id}/place`, data, { headers: getHeaders() });
    return res.data?.data ?? res.data;
  } catch (e) {
    const err = e as AxiosError<ErrorResponse>;
    return rejectWithValue(err.response?.data?.message || "Gagal menempatkan kendaraan");
  }
});

export const publishVehicle = createAsyncThunk<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any,
  string,
  { rejectValue: string }
>("warehouse/publishVehicle", async (id, { rejectWithValue }) => {
  try {
    const res = await instanceAxios.post(`/warehouse/vehicles/${id}/publish`, {}, { headers: getHeaders() });
    return res.data?.data ?? res.data;
  } catch (e) {
    const err = e as AxiosError<ErrorResponse>;
    return rejectWithValue(err.response?.data?.message || "Gagal publish ke marketplace");
  }
});

// ============================================================
// ASYNC THUNKS — INSPECTION
// ============================================================

export const createInspection = createAsyncThunk<VehicleInspection, CreateInspectionData, { rejectValue: string }>(
  "warehouse/createInspection",
  async (data, { rejectWithValue }) => {
    try {
      const res = await instanceAxios.post("/warehouse/inspections", data, { headers: getHeaders() });
      return res.data?.data ?? res.data;
    } catch (e) {
      const err = e as AxiosError<ErrorResponse>;
      return rejectWithValue(err.response?.data?.message || "Gagal submit inspeksi");
    }
  }
);

export const fetchInspectionsByVehicle = createAsyncThunk<VehicleInspection[], string, { rejectValue: string }>(
  "warehouse/fetchInspectionsByVehicle",
  async (vehicleId, { rejectWithValue }) => {
    try {
      const res = await instanceAxios.get(`/warehouse/inspections/vehicle/${vehicleId}`, { headers: getHeaders() });
      return res.data?.data ?? res.data;
    } catch (e) {
      const err = e as AxiosError<ErrorResponse>;
      return rejectWithValue(err.response?.data?.message || "Gagal mengambil inspeksi");
    }
  }
);

// ============================================================
// ASYNC THUNKS — ZONE
// ============================================================

export const fetchZonesByShowroom = createAsyncThunk<WarehouseZone[], string, { rejectValue: string }>(
  "warehouse/fetchZonesByShowroom",
  async (showroomId, { rejectWithValue }) => {
    try {
      const res = await instanceAxios.get(`/warehouse/zones/showroom/${showroomId}`, { headers: getHeaders() });
      return res.data?.data ?? res.data;
    } catch (e) {
      const err = e as AxiosError<ErrorResponse>;
      return rejectWithValue(err.response?.data?.message || "Gagal mengambil data zona");
    }
  }
);

export const createZone = createAsyncThunk<WarehouseZone, CreateZoneData, { rejectValue: string }>(
  "warehouse/createZone",
  async (data, { rejectWithValue }) => {
    try {
      const res = await instanceAxios.post("/warehouse/zones", data, { headers: getHeaders() });
      return res.data?.data ?? res.data;
    } catch (e) {
      const err = e as AxiosError<ErrorResponse>;
      return rejectWithValue(err.response?.data?.message || "Gagal membuat zona");
    }
  }
);

// ============================================================
// ASYNC THUNKS — REPAIR
// ============================================================

export const createRepairOrder = createAsyncThunk<RepairOrder, CreateRepairData, { rejectValue: string }>(
  "warehouse/createRepairOrder",
  async (data, { rejectWithValue }) => {
    try {
      const res = await instanceAxios.post("/warehouse/repairs", data, { headers: getHeaders() });
      return res.data?.data ?? res.data;
    } catch (e) {
      const err = e as AxiosError<ErrorResponse>;
      return rejectWithValue(err.response?.data?.message || "Gagal membuat repair order");
    }
  }
);

export const fetchRepairsByVehicle = createAsyncThunk<RepairOrder[], string, { rejectValue: string }>(
  "warehouse/fetchRepairsByVehicle",
  async (vehicleId, { rejectWithValue }) => {
    try {
      const res = await instanceAxios.get(`/warehouse/repairs/vehicle/${vehicleId}`, { headers: getHeaders() });
      return res.data?.data ?? res.data;
    } catch (e) {
      const err = e as AxiosError<ErrorResponse>;
      return rejectWithValue(err.response?.data?.message || "Gagal mengambil data perbaikan");
    }
  }
);

export const updateRepairStatus = createAsyncThunk<
  RepairOrder,
  { id: string; status: RepairStatus; actualCost?: number },
  { rejectValue: string }
>("warehouse/updateRepairStatus", async ({ id, status, actualCost }, { rejectWithValue }) => {
  try {
    const res = await instanceAxios.patch(`/warehouse/repairs/${id}/status`, null, {
      params: { status, ...(actualCost ? { actualCost } : {}) },
      headers: getHeaders(),
    });
    return res.data?.data ?? res.data;
  } catch (e) {
    const err = e as AxiosError<ErrorResponse>;
    return rejectWithValue(err.response?.data?.message || "Gagal update repair status");
  }
});

// ============================================================
// ASYNC THUNKS — ADMIN PAYMENT
// ============================================================

export const createAdminPayment = createAsyncThunk<AdminPayment, string, { rejectValue: string }>(
  "warehouse/createAdminPayment",
  async (vehicleId, { rejectWithValue }) => {
    try {
      const res = await instanceAxios.post(`/warehouse/payments/${vehicleId}`, {}, { headers: getHeaders() });
      return res.data?.data ?? res.data;
    } catch (e) {
      const err = e as AxiosError<ErrorResponse>;
      return rejectWithValue(err.response?.data?.message || "Gagal membuat payment");
    }
  }
);

export const fetchAdminPayment = createAsyncThunk<AdminPayment, string, { rejectValue: string }>(
  "warehouse/fetchAdminPayment",
  async (vehicleId, { rejectWithValue }) => {
    try {
      const res = await instanceAxios.get(`/warehouse/payments/${vehicleId}`, { headers: getHeaders() });
      return res.data?.data ?? res.data;
    } catch (e) {
      const err = e as AxiosError<ErrorResponse>;
      return rejectWithValue(err.response?.data?.message || "Gagal mengambil payment");
    }
  }
);

// ============================================================
// ASYNC THUNKS — PURCHASE
// ============================================================

export const createPurchase = createAsyncThunk<PurchaseTransaction, CreatePurchaseData, { rejectValue: string }>(
  "warehouse/createPurchase",
  async (data, { rejectWithValue }) => {
    try {
      const res = await instanceAxios.post("/warehouse/purchases", data, { headers: getHeaders() });
      return res.data?.data ?? res.data;
    } catch (e) {
      const err = e as AxiosError<ErrorResponse>;
      return rejectWithValue(err.response?.data?.message || "Gagal membuat transaksi pembelian");
    }
  }
);

export const fetchPurchasesByShowroom = createAsyncThunk<PurchaseTransaction[], string, { rejectValue: string }>(
  "warehouse/fetchPurchasesByShowroom",
  async (showroomId, { rejectWithValue }) => {
    try {
      const res = await instanceAxios.get(`/warehouse/purchases/showroom/${showroomId}`, { headers: getHeaders() });
      return res.data?.data ?? res.data;
    } catch (e) {
      const err = e as AxiosError<ErrorResponse>;
      return rejectWithValue(err.response?.data?.message || "Gagal mengambil transaksi");
    }
  }
);

export const confirmPurchasePayment = createAsyncThunk<PurchaseTransaction, string, { rejectValue: string }>(
  "warehouse/confirmPurchasePayment",
  async (id, { rejectWithValue }) => {
    try {
      const res = await instanceAxios.patch(`/warehouse/purchases/${id}/confirm-payment`, {}, { headers: getHeaders() });
      return res.data?.data ?? res.data;
    } catch (e) {
      const err = e as AxiosError<ErrorResponse>;
      return rejectWithValue(err.response?.data?.message || "Gagal konfirmasi pembayaran");
    }
  }
);

// ============================================================
// ASYNC THUNKS — STOCK LOG
// ============================================================

export const fetchStockLogs = createAsyncThunk<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any,
  { showroomId: string; page?: number; perPage?: number },
  { rejectValue: string }
>("warehouse/fetchStockLogs", async ({ showroomId, page, perPage }, { rejectWithValue }) => {
  try {
    const res = await instanceAxios.get(`/warehouse/stock/${showroomId}/logs`, {
      params: { page: page || 1, perPage: perPage || 20 },
      headers: getHeaders(),
    });
    return res.data;
  } catch (e) {
    const err = e as AxiosError<ErrorResponse>;
    return rejectWithValue(err.response?.data?.message || "Gagal mengambil stock logs");
  }
});

export const fetchStockSummary = createAsyncThunk<StockSummary, string, { rejectValue: string }>(
  "warehouse/fetchStockSummary",
  async (showroomId, { rejectWithValue }) => {
    try {
      const res = await instanceAxios.get(`/warehouse/stock/${showroomId}/summary`, { headers: getHeaders() });
      return res.data?.data ?? res.data;
    } catch (e) {
      const err = e as AxiosError<ErrorResponse>;
      return rejectWithValue(err.response?.data?.message || "Gagal mengambil stock summary");
    }
  }
);

// ============================================================
// SLICE
// ============================================================

const warehouseSlice = createSlice({
  name: "warehouse",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.successMessage = null;
    },
    clearSelectedVehicle: (state) => {
      state.selectedVehicle = null;
    },
    clearSelectedShowroom: (state) => {
      state.selectedShowroom = null;
    },
    setSelectedShowroom: (state, action: PayloadAction<Showroom>) => {
      state.selectedShowroom = action.payload;
    },
  },
  extraReducers: (builder) => {
    // ---- SHOWROOM ----
    builder
      .addCase(fetchShowrooms.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchShowrooms.fulfilled, (state, action) => { state.loading = false; state.showrooms = action.payload; })
      .addCase(fetchShowrooms.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })

      .addCase(fetchShowroomDetail.fulfilled, (state, action) => { state.selectedShowroom = action.payload; })

      .addCase(fetchShowroomDashboard.pending, (state) => { state.loading = true; })
      .addCase(fetchShowroomDashboard.fulfilled, (state, action) => { state.loading = false; state.dashboard = action.payload; })
      .addCase(fetchShowroomDashboard.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })

      .addCase(createShowroom.pending, (state) => { state.actionLoading = true; state.error = null; })
      .addCase(createShowroom.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.showrooms = [action.payload, ...state.showrooms];
        state.successMessage = "Showroom berhasil dibuat!";
      })
      .addCase(createShowroom.rejected, (state, action) => { state.actionLoading = false; state.error = action.payload as string; })

      .addCase(updateShowroom.fulfilled, (state, action) => {
        const idx = state.showrooms.findIndex((s) => s.id === action.payload.id);
        if (idx !== -1) state.showrooms[idx] = action.payload;
        state.successMessage = "Showroom berhasil diupdate!";
      })

      .addCase(deleteShowroom.fulfilled, (state, action) => {
        state.showrooms = state.showrooms.filter((s) => s.id !== action.payload);
        state.successMessage = "Showroom berhasil dihapus!";
      });

    // ---- VEHICLE ----
    builder
      .addCase(fetchVehicles.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchVehicles.fulfilled, (state, action) => {
        state.loading = false;
        state.vehicles = action.payload?.data ?? action.payload;
        if (action.payload?.pagination) state.pagination = action.payload.pagination;
      })
      .addCase(fetchVehicles.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })

      .addCase(fetchVehicleDetail.pending, (state) => { state.loading = true; })
      .addCase(fetchVehicleDetail.fulfilled, (state, action) => { state.loading = false; state.selectedVehicle = action.payload; })
      .addCase(fetchVehicleDetail.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })

      .addCase(fetchVehicleByBarcode.fulfilled, (state, action) => { state.selectedVehicle = action.payload; })

      .addCase(registerVehicle.pending, (state) => { state.actionLoading = true; })
      .addCase(registerVehicle.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.vehicles = [action.payload, ...state.vehicles];
        state.successMessage = "Kendaraan berhasil didaftarkan!";
      })
      .addCase(registerVehicle.rejected, (state, action) => { state.actionLoading = false; state.error = action.payload as string; })

      .addCase(updateVehicleStatus.fulfilled, (state, action) => {
        const idx = state.vehicles.findIndex((v) => v.id === action.payload.id);
        if (idx !== -1) state.vehicles[idx] = action.payload;
        if (state.selectedVehicle?.id === action.payload.id) state.selectedVehicle = action.payload;
        state.successMessage = "Status berhasil diupdate!";
      })

      .addCase(placeVehicle.fulfilled, (state) => { state.successMessage = "Kendaraan berhasil ditempatkan!"; })
      .addCase(publishVehicle.fulfilled, (state) => { state.successMessage = "Kendaraan berhasil dipublish ke marketplace!"; });

    // ---- INSPECTION ----
    builder
      .addCase(createInspection.pending, (state) => { state.actionLoading = true; })
      .addCase(createInspection.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.inspections = [action.payload, ...state.inspections];
        state.successMessage = "Inspeksi berhasil disubmit!";
      })
      .addCase(createInspection.rejected, (state, action) => { state.actionLoading = false; state.error = action.payload as string; })

      .addCase(fetchInspectionsByVehicle.fulfilled, (state, action) => { state.inspections = action.payload; });

    // ---- ZONE ----
    builder
      .addCase(fetchZonesByShowroom.fulfilled, (state, action) => { state.zones = action.payload; })
      .addCase(createZone.pending, (state) => { state.actionLoading = true; })
      .addCase(createZone.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.zones = [action.payload, ...state.zones];
        state.successMessage = "Zona berhasil dibuat!";
      })
      .addCase(createZone.rejected, (state, action) => { state.actionLoading = false; state.error = action.payload as string; });

    // ---- REPAIR ----
    builder
      .addCase(createRepairOrder.pending, (state) => { state.actionLoading = true; })
      .addCase(createRepairOrder.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.repairs = [action.payload, ...state.repairs];
        state.successMessage = "Repair order berhasil dibuat!";
      })
      .addCase(createRepairOrder.rejected, (state, action) => { state.actionLoading = false; state.error = action.payload as string; })
      .addCase(fetchRepairsByVehicle.fulfilled, (state, action) => { state.repairs = action.payload; })
      .addCase(updateRepairStatus.fulfilled, (state, action) => {
        const idx = state.repairs.findIndex((r) => r.id === action.payload.id);
        if (idx !== -1) state.repairs[idx] = action.payload;
        state.successMessage = "Repair status berhasil diupdate!";
      });

    // ---- PAYMENT ----
    builder
      .addCase(createAdminPayment.pending, (state) => { state.actionLoading = true; })
      .addCase(createAdminPayment.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.adminPayment = action.payload;
        state.successMessage = "Invoice pembayaran admin berhasil dibuat!";
      })
      .addCase(createAdminPayment.rejected, (state, action) => { state.actionLoading = false; state.error = action.payload as string; })
      .addCase(fetchAdminPayment.fulfilled, (state, action) => { state.adminPayment = action.payload; });

    // ---- PURCHASE ----
    builder
      .addCase(createPurchase.pending, (state) => { state.actionLoading = true; })
      .addCase(createPurchase.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.purchases = [action.payload, ...state.purchases];
        state.successMessage = "Transaksi pembelian berhasil dibuat!";
      })
      .addCase(createPurchase.rejected, (state, action) => { state.actionLoading = false; state.error = action.payload as string; })
      .addCase(fetchPurchasesByShowroom.fulfilled, (state, action) => { state.purchases = action.payload; })
      .addCase(confirmPurchasePayment.fulfilled, (state, action) => {
        const idx = state.purchases.findIndex((p) => p.id === action.payload.id);
        if (idx !== -1) state.purchases[idx] = action.payload;
        state.successMessage = "Pembayaran berhasil dikonfirmasi!";
      });

    // ---- STOCK LOG ----
    builder
      .addCase(fetchStockLogs.pending, (state) => { state.loading = true; })
      .addCase(fetchStockLogs.fulfilled, (state, action) => {
        state.loading = false;
        state.stockLogs = action.payload?.data ?? action.payload;
        if (action.payload?.pagination) state.pagination = action.payload.pagination;
      })
      .addCase(fetchStockLogs.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })
      .addCase(fetchStockSummary.fulfilled, (state, action) => { state.stockSummary = action.payload; });
  },
});

export const {
  clearError,
  clearSuccess,
  clearSelectedVehicle,
  clearSelectedShowroom,
  setSelectedShowroom,
} = warehouseSlice.actions;

export default warehouseSlice.reducer;
