import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";

// Import slices as they are created
import authReducer from "./slices/authSlice";
import jobsReducer from "./slices/jobsSlice";
import userReducer from "./slices/userSlice";
import loadingReducer from "./slices/loadingSlice";
import resumeReducer from "./slices/resumeSlice";
import applicationReducer from "./slices/applicationSlice";
import jobCategoryReducer from "./slices/jobCategorySlice";
import skillReducer from "./slices/skillSlice";
import notificationReducer from "./slices/notificationSlice";
import chatReducer from "./slices/chatSlice";
import savedJobReducer from "./slices/savedJobSlice";
import settingsReducer from "./slices/settingsSlice";
import profileReducer from "./slices/profileSlice";
import companyReducer from "./slices/companySlice";
import toastReducer from "./slices/toastSlice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    jobs: jobsReducer,
    user: userReducer,
    loading: loadingReducer,
    resume: resumeReducer,
    application: applicationReducer,
    jobCategory: jobCategoryReducer,
    toast: toastReducer,
    notification: notificationReducer,
    chat: chatReducer,
    savedJob: savedJobReducer,
    settings: settingsReducer,
    profile: profileReducer,
    company: companyReducer,
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
