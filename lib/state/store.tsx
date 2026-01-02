import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slice/authSlice";
import brandSlice from "./slice/brand/brandSlice";
import userSlice from "./slice/user/userSlice";
import CarModelsSlice from "./slice/car-models/CarModelsSlice";
import specificationSlice from "./slice/Specifications/SpecificationsSlice";
import customPriceSlice from "./slice/CustomPrices/CustomPriceSlice";
// New slices for API V2.1
import variantSlice from "./slice/variant/variantSlice";
import yearPriceSlice from "./slice/year-price/yearPriceSlice";
import priceAdjustmentSlice from "./slice/price-adjustment/priceAdjustmentSlice";
import priceCalculatorSlice from "./slice/price-calculator/priceCalculatorSlice";

const store = configureStore({
  reducer: {
    // Tambahkan slice reducer di sini
    auth: authSlice,
    brand: brandSlice,
    Users: userSlice,
    CarModels: CarModelsSlice,
    Specifications: specificationSlice,
    customPrices: customPriceSlice,
    // API V2.1 reducers
    variant: variantSlice,
    yearPrice: yearPriceSlice,
    priceAdjustment: priceAdjustmentSlice,
    priceCalculator: priceCalculatorSlice,
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
