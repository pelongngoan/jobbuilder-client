import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";

// Import slices as they are created
import authReducer from "./slices/authSlice";
import jobsReducer from "./slices/jobsSlice";
import userReducer from "./slices/userSlice";
import loadingReducer from "./slices/loadingSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    jobs: jobsReducer,
    user: userReducer,
    loading: loadingReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
