import { createSlice } from "@reduxjs/toolkit";
import { Application } from "../../types/application.types";

interface ApplicationState {
  applications: Application[];
  currentApplication: Application | null;
}

const initialState: ApplicationState = {
  applications: [],
  currentApplication: null,
};

// Create the application slice
const applicationSlice = createSlice({
  name: "application",
  initialState,
  reducers: {
    setApplications: (state, action) => {
      state.applications = action.payload;
    },
    setCurrentApplication: (state, action) => {
      state.currentApplication = action.payload;
    },
    clearCurrentApplication: (state) => {
      state.currentApplication = null;
    },
    clearApplications: (state) => {
      state.applications = [];
    },
  },
});

// Export actions and reducer
export const {
  setApplications,
  setCurrentApplication,
  clearCurrentApplication,
  clearApplications,
} = applicationSlice.actions;

export default applicationSlice.reducer;
