import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";

// Import slices as they are created
import authReducer from "./slices/authSlice";
import jobsReducer from "./slices/jobsSlice";
import userReducer from "./slices/userSlice";
import loadingReducer from "./slices/loadingSlice";
import resumeReducer from "./slices/resumeSlice";
import applicationReducer from "./slices/applicationSlice";
import profileReducer from "./slices/profileSlice";
import companyReducer from "./slices/companySlice";
import toastReducer from "./slices/toastSlice";
import staffReducer from "./slices/staffSlice";
import categoryReducer from "./slices/categorySlice";
import paginationReducer from "./slices/paginationSlice";
import saveJobReducer from "./slices/saveJobSlice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    jobs: jobsReducer,
    user: userReducer,
    loading: loadingReducer,
    staff: staffReducer,
    resume: resumeReducer,
    application: applicationReducer,
    category: categoryReducer,
    toast: toastReducer,
    profile: profileReducer,
    company: companyReducer,
    saveJob: saveJobReducer,
    pagination: paginationReducer,
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
