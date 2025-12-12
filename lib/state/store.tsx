import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slice/authSlice";
import brandSlice from "./slice/brand/brandSlice";
import userSlice from "./slice/user/userSlice";
const store = configureStore({
  reducer: {
    // Tambahkan slice reducer di sini
    auth: authSlice,
    brand: brandSlice,
    Users: userSlice,
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
