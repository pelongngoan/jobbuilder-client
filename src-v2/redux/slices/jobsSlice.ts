import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { JobPost } from "../../types";

interface JobSatate {
  jobs: JobPost[];
}

const initialState: JobSatate = {
  jobs: [],
};

const jobsSlice = createSlice({
  name: "jobs",
  initialState,
  reducers: {
    setJobs: (state, action) => {
      state.jobs = action.payload;
    },
    // Reset jobs state
    resetJobs: () => initialState,
  },
});

// Export actions and reducer
export const { setJobs, resetJobs } = jobsSlice.actions;

export default jobsSlice.reducer;
