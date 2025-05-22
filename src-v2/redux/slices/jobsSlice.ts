import { createSlice } from "@reduxjs/toolkit";
import { JobPost } from "../../types";

interface JobSatate {
  jobs: JobPost[];
  currentJob: JobPost | null;
}

const initialState: JobSatate = {
  jobs: [],
  currentJob: null,
};

const jobsSlice = createSlice({
  name: "jobs",
  initialState,
  reducers: {
    setJobs: (state, action) => {
      state.jobs = action.payload;
    },
    setCurrentJob: (state, action) => {
      state.currentJob = action.payload;
    },
    clearCurrentJob: (state) => {
      state.currentJob = null;
    },
    clearJobs: (state) => {
      state.jobs = [];
    },
  },
});

export const { setJobs, setCurrentJob, clearCurrentJob, clearJobs } =
  jobsSlice.actions;

export default jobsSlice.reducer;
