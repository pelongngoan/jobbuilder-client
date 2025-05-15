import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SavedJob } from "../../types";

// Define savedJob state structure
interface SavedJobState {
  savedJobs: SavedJob[];
  loading: boolean;
  error: string | null;
}

const initialState: SavedJobState = {
  savedJobs: [],
  loading: false,
  error: null,
};

// Create the savedJob slice
const savedJobSlice = createSlice({
  name: "savedJob",
  initialState,
  reducers: {
    // Loading and error states
    setSavedJobLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setSavedJobError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    // SavedJob collection actions
    setSavedJobs: (state, action: PayloadAction<SavedJob[]>) => {
      state.savedJobs = action.payload;
    },
    addSavedJob: (state, action: PayloadAction<SavedJob>) => {
      state.savedJobs.push(action.payload);
    },
    removeSavedJob: (state, action: PayloadAction<string>) => {
      state.savedJobs = state.savedJobs.filter(
        (savedJob) => savedJob._id.toString() !== action.payload
      );
    },

    // Check if a job is saved
    toggleSaveStatus: (
      state,
      action: PayloadAction<{ jobId: string; isSaved: boolean }>
    ) => {
      const { jobId, isSaved } = action.payload;

      // If unsaving, remove from list
      if (!isSaved) {
        state.savedJobs = state.savedJobs.filter(
          (savedJob) => savedJob.jobId.toString() !== jobId
        );
      }
      // If saving, the actual SavedJob object will be added through addSavedJob action
      // when the API returns it with the proper _id
    },

    // Reset state
    resetSavedJobs: (state) => {
      state.savedJobs = [];
      state.loading = false;
      state.error = null;
    },
  },
});

// Export actions and reducer
export const {
  setSavedJobLoading,
  setSavedJobError,
  setSavedJobs,
  addSavedJob,
  removeSavedJob,
  toggleSaveStatus,
  resetSavedJobs,
} = savedJobSlice.actions;

export default savedJobSlice.reducer;
