import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Application } from "../../types";

// Define application state structure
interface ApplicationState {
  applications: Application[];
  currentApplication: Application | null;
  loading: boolean;
  error: string | null;
}

const initialState: ApplicationState = {
  applications: [],
  currentApplication: null,
  loading: false,
  error: null,
};

// Create the application slice
const applicationSlice = createSlice({
  name: "application",
  initialState,
  reducers: {
    // Loading and error states
    setApplicationLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setApplicationError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    // Application collection actions
    setApplications: (state, action: PayloadAction<Application[]>) => {
      state.applications = action.payload;
    },
    addApplication: (state, action: PayloadAction<Application>) => {
      state.applications.push(action.payload);
    },
    updateApplication: (state, action: PayloadAction<Application>) => {
      const index = state.applications.findIndex(
        (application) => application._id === action.payload._id
      );
      if (index !== -1) {
        state.applications[index] = action.payload;

        // Also update currentApplication if it's the same application
        if (
          state.currentApplication &&
          state.currentApplication._id === action.payload._id
        ) {
          state.currentApplication = action.payload;
        }
      }
    },
    deleteApplication: (state, action: PayloadAction<string>) => {
      state.applications = state.applications.filter(
        (application) => application._id.toString() !== action.payload
      );

      // Clear currentApplication if it's the deleted application
      if (
        state.currentApplication &&
        state.currentApplication._id.toString() === action.payload
      ) {
        state.currentApplication = null;
      }
    },

    // Current application actions
    setCurrentApplication: (
      state,
      action: PayloadAction<Application | null>
    ) => {
      state.currentApplication = action.payload;
    },

    // Reset state
    resetApplications: (state) => {
      state.applications = [];
      state.currentApplication = null;
      state.loading = false;
      state.error = null;
    },
  },
});

// Export actions and reducer
export const {
  setApplicationLoading,
  setApplicationError,
  setApplications,
  addApplication,
  updateApplication,
  deleteApplication,
  setCurrentApplication,
  resetApplications,
} = applicationSlice.actions;

export default applicationSlice.reducer;
