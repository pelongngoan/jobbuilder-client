import { configureStore } from "@reduxjs/toolkit";
import loadingReducer from "./loading/loadingSlice";
import authReducer from "./auth/authSlice";
import themeReducer from "./theme/themeSlice";
import jobsReducer from "./jobs/jobsSlice";

export const store = configureStore({
  reducer: {
    loading: loadingReducer,
    auth: authReducer,
    theme: themeReducer,
    jobs: jobsReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
