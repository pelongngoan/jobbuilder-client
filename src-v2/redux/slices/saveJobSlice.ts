import { createSlice } from "@reduxjs/toolkit";
import { SavedJob } from "../../types/saveJob.types";

// Define save job state structure
interface SaveJobState {
  savedJobs: SavedJob[];
}

const initialState: SaveJobState = {
  savedJobs: [],
};

const saveJobSlice = createSlice({
  name: "saveJob",
  initialState,
  reducers: {
    setSavedJobs: (state, action) => {
      console.log(action.payload);
      state.savedJobs = action.payload;
    },
    addSavedJob: (state, action) => {
      console.log(action.payload);

      state.savedJobs.push(action.payload);
    },
    removeSavedJob: (state, action) => {
      console.log(action.payload);

      state.savedJobs = state.savedJobs.filter(
        (job) => job.jobId._id !== action.payload
      );
    },
    clearSavedJobs: (state) => {
      state.savedJobs = [];
    },
  },
});

export const { setSavedJobs, addSavedJob, removeSavedJob, clearSavedJobs } =
  saveJobSlice.actions;
export default saveJobSlice.reducer;
