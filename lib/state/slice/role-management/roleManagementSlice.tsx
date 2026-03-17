/* eslint-disable @typescript-eslint/no-explicit-any */
import instanceAxios from "@/lib/axiosInstance/instanceAxios";
import { getHeaders } from "@/lib/headers/headers";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";

// Types
export interface RoleUser {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean;
  positions?: RolePosition[];
  createdAt: string;
  updatedAt: string;
}

export interface RolePosition {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean;
  roleUserId: string;
  roleUser: Pick<RoleUser, "id" | "name">;
  createdAt: string;
  updatedAt: string;
}

interface RoleManagementState {
  roleUsers: RoleUser[];
  rolePositions: RolePosition[];
  selectedRoleUser: RoleUser | null;
  selectedRolePosition: RolePosition | null;
  loading: boolean;
  error: string | null;
  success: boolean;
}

interface ErrorResponse {
  message?: string;
  [key: string]: any;
}

const handleError = (error: unknown, rejectWithValue: any) => {
  const axiosError = error as AxiosError<ErrorResponse>;
  const message =
    axiosError.response?.data?.message ||
    axiosError.message ||
    "Terjadi kesalahan";
  return rejectWithValue(message);
};

// ──────────────────────────────────────────
// ROLE USER THUNKS
// ──────────────────────────────────────────

export const getAllRoleUsers = createAsyncThunk<
  RoleUser[],
  { search?: string } | void,
  { rejectValue: string }
>("roleManagement/getAllRoleUsers", async (params, { rejectWithValue }) => {
  try {
    const search = params?.search ? `?search=${params.search}` : "";
    const res = await instanceAxios.get(`/role-users${search}`, {
      headers: getHeaders(),
    });
    return res.data?.data ?? res.data;
  } catch (error) {
    return handleError(error, rejectWithValue);
  }
});

export const getRoleUserById = createAsyncThunk<
  RoleUser,
  string,
  { rejectValue: string }
>("roleManagement/getRoleUserById", async (id, { rejectWithValue }) => {
  try {
    const res = await instanceAxios.get(`/role-users/${id}`, {
      headers: getHeaders(),
    });
    return res.data?.data ?? res.data;
  } catch (error) {
    return handleError(error, rejectWithValue);
  }
});

export const createRoleUser = createAsyncThunk<
  RoleUser,
  { name: string; description?: string; isActive?: boolean },
  { rejectValue: string }
>("roleManagement/createRoleUser", async (data, { rejectWithValue }) => {
  try {
    const res = await instanceAxios.post("/role-users", data, {
      headers: getHeaders(),
    });
    return res.data?.data ?? res.data;
  } catch (error) {
    return handleError(error, rejectWithValue);
  }
});

export const updateRoleUser = createAsyncThunk<
  RoleUser,
  { id: string; data: Partial<RoleUser> },
  { rejectValue: string }
>(
  "roleManagement/updateRoleUser",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await instanceAxios.put(`/role-users/${id}`, data, {
        headers: getHeaders(),
      });
      return res.data?.data ?? res.data;
    } catch (error) {
      return handleError(error, rejectWithValue);
    }
  },
);

export const deleteRoleUser = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("roleManagement/deleteRoleUser", async (id, { rejectWithValue }) => {
  try {
    await instanceAxios.delete(`/role-users/${id}`, { headers: getHeaders() });
    return id;
  } catch (error) {
    return handleError(error, rejectWithValue);
  }
});

// ──────────────────────────────────────────
// ROLE POSITION THUNKS
// ──────────────────────────────────────────

export const getAllRolePositions = createAsyncThunk<
  RolePosition[],
  { roleUserId?: string; search?: string } | void,
  { rejectValue: string }
>("roleManagement/getAllRolePositions", async (params, { rejectWithValue }) => {
  try {
    const query = new URLSearchParams();
    if (params?.roleUserId) query.set("roleUserId", params.roleUserId);
    if (params?.search) query.set("search", params.search);
    const qs = query.toString() ? `?${query.toString()}` : "";
    const res = await instanceAxios.get(`/role-positions${qs}`, {
      headers: getHeaders(),
    });
    return res.data?.data ?? res.data;
  } catch (error) {
    return handleError(error, rejectWithValue);
  }
});

export const getRolePositionById = createAsyncThunk<
  RolePosition,
  string,
  { rejectValue: string }
>("roleManagement/getRolePositionById", async (id, { rejectWithValue }) => {
  try {
    const res = await instanceAxios.get(`/role-positions/${id}`, {
      headers: getHeaders(),
    });
    return res.data?.data ?? res.data;
  } catch (error) {
    return handleError(error, rejectWithValue);
  }
});

export const createRolePosition = createAsyncThunk<
  RolePosition,
  {
    name: string;
    roleUserId: string;
    description?: string;
    isActive?: boolean;
  },
  { rejectValue: string }
>("roleManagement/createRolePosition", async (data, { rejectWithValue }) => {
  try {
    const res = await instanceAxios.post("/role-positions", data, {
      headers: getHeaders(),
    });
    return res.data?.data ?? res.data;
  } catch (error) {
    return handleError(error, rejectWithValue);
  }
});

export const updateRolePosition = createAsyncThunk<
  RolePosition,
  { id: string; data: Partial<RolePosition> },
  { rejectValue: string }
>(
  "roleManagement/updateRolePosition",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await instanceAxios.put(`/role-positions/${id}`, data, {
        headers: getHeaders(),
      });
      return res.data?.data ?? res.data;
    } catch (error) {
      return handleError(error, rejectWithValue);
    }
  },
);

export const deleteRolePosition = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("roleManagement/deleteRolePosition", async (id, { rejectWithValue }) => {
  try {
    await instanceAxios.delete(`/role-positions/${id}`, {
      headers: getHeaders(),
    });
    return id;
  } catch (error) {
    return handleError(error, rejectWithValue);
  }
});

// ──────────────────────────────────────────
// SLICE
// ──────────────────────────────────────────

const initialState: RoleManagementState = {
  roleUsers: [],
  rolePositions: [],
  selectedRoleUser: null,
  selectedRolePosition: null,
  loading: false,
  error: null,
  success: false,
};

const roleManagementSlice = createSlice({
  name: "roleManagement",
  initialState,
  reducers: {
    clearRoleManagementError: (state) => {
      state.error = null;
    },
    clearRoleManagementSuccess: (state) => {
      state.success = false;
    },
    setSelectedRoleUser: (state, action) => {
      state.selectedRoleUser = action.payload;
    },
    setSelectedRolePosition: (state, action) => {
      state.selectedRolePosition = action.payload;
    },
  },
  extraReducers: (builder) => {
    const pending = (state: RoleManagementState) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    };
    const rejected = (state: RoleManagementState, action: any) => {
      state.loading = false;
      state.error = action.payload || "Terjadi kesalahan";
    };

    builder
      // getAllRoleUsers
      .addCase(getAllRoleUsers.pending, pending)
      .addCase(getAllRoleUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.roleUsers = action.payload;
      })
      .addCase(getAllRoleUsers.rejected, rejected)

      // getRoleUserById
      .addCase(getRoleUserById.pending, pending)
      .addCase(getRoleUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedRoleUser = action.payload;
      })
      .addCase(getRoleUserById.rejected, rejected)

      // createRoleUser
      .addCase(createRoleUser.pending, pending)
      .addCase(createRoleUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.roleUsers.unshift(action.payload);
      })
      .addCase(createRoleUser.rejected, rejected)

      // updateRoleUser
      .addCase(updateRoleUser.pending, pending)
      .addCase(updateRoleUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        const idx = state.roleUsers.findIndex(
          (r) => r.id === action.payload.id,
        );
        if (idx !== -1) state.roleUsers[idx] = action.payload;
        if (state.selectedRoleUser?.id === action.payload.id) {
          state.selectedRoleUser = action.payload;
        }
      })
      .addCase(updateRoleUser.rejected, rejected)

      // deleteRoleUser
      .addCase(deleteRoleUser.pending, pending)
      .addCase(deleteRoleUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.roleUsers = state.roleUsers.filter(
          (r) => r.id !== action.payload,
        );
      })
      .addCase(deleteRoleUser.rejected, rejected)

      // getAllRolePositions
      .addCase(getAllRolePositions.pending, pending)
      .addCase(getAllRolePositions.fulfilled, (state, action) => {
        state.loading = false;
        state.rolePositions = action.payload;
      })
      .addCase(getAllRolePositions.rejected, rejected)

      // getRolePositionById
      .addCase(getRolePositionById.pending, pending)
      .addCase(getRolePositionById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedRolePosition = action.payload;
      })
      .addCase(getRolePositionById.rejected, rejected)

      // createRolePosition
      .addCase(createRolePosition.pending, pending)
      .addCase(createRolePosition.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.rolePositions.unshift(action.payload);
      })
      .addCase(createRolePosition.rejected, rejected)

      // updateRolePosition
      .addCase(updateRolePosition.pending, pending)
      .addCase(updateRolePosition.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        const idx = state.rolePositions.findIndex(
          (p) => p.id === action.payload.id,
        );
        if (idx !== -1) state.rolePositions[idx] = action.payload;
        if (state.selectedRolePosition?.id === action.payload.id) {
          state.selectedRolePosition = action.payload;
        }
      })
      .addCase(updateRolePosition.rejected, rejected)

      // deleteRolePosition
      .addCase(deleteRolePosition.pending, pending)
      .addCase(deleteRolePosition.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.rolePositions = state.rolePositions.filter(
          (p) => p.id !== action.payload,
        );
      })
      .addCase(deleteRolePosition.rejected, rejected);
  },
});

export const {
  clearRoleManagementError,
  clearRoleManagementSuccess,
  setSelectedRoleUser,
  setSelectedRolePosition,
} = roleManagementSlice.actions;

export default roleManagementSlice.reducer;
