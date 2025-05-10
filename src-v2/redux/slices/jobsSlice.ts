import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Job, JobCategory, Skill } from "../../types";
import { PaginatedResponse } from "../../types/common.types";

// Define jobs state structure
interface JobsState {
  jobs: Job[];
  featuredJobs: Job[];
  recommendedJobs: Job[];
  savedJobs: Job[];
  appliedJobs: Job[];
  currentJob: Job | null;
  categories: JobCategory[];
  skills: Skill[];
  totalJobs: number;
  totalPages: number;
  currentPage: number;
  filters: {
    search: string;
    category: string[];
    location: string[];
    jobType: string[];
    skills: string[];
    salaryRange: string[];
    remote: boolean;
  };
}

const initialState: JobsState = {
  jobs: [],
  featuredJobs: [],
  recommendedJobs: [],
  savedJobs: [],
  appliedJobs: [],
  currentJob: null,
  categories: [],
  skills: [],
  totalJobs: 0,
  totalPages: 1,
  currentPage: 1,
  filters: {
    search: "",
    category: [],
    location: [],
    jobType: [],
    skills: [],
    salaryRange: [],
    remote: false,
  },
};

// Create the jobs slice
const jobsSlice = createSlice({
  name: "jobs",
  initialState,
  reducers: {
    // Set jobs with pagination data
    setJobs: (state, action: PayloadAction<PaginatedResponse<Job>>) => {
      const { items, total, totalPages, page } = action.payload;
      state.jobs = items;
      state.totalJobs = total;
      state.totalPages = totalPages;
      state.currentPage = page;
    },

    // Set a single job as current
    setCurrentJob: (state, action: PayloadAction<Job>) => {
      state.currentJob = action.payload;
    },

    // Clear current job
    clearCurrentJob: (state) => {
      state.currentJob = null;
    },

    // Set featured jobs
    setFeaturedJobs: (state, action: PayloadAction<Job[]>) => {
      state.featuredJobs = action.payload;
    },

    // Set recommended jobs
    setRecommendedJobs: (state, action: PayloadAction<Job[]>) => {
      state.recommendedJobs = action.payload;
    },

    // Set saved jobs
    setSavedJobs: (state, action: PayloadAction<Job[]>) => {
      state.savedJobs = action.payload;
    },

    // Set applied jobs
    setAppliedJobs: (state, action: PayloadAction<Job[]>) => {
      state.appliedJobs = action.payload;
    },

    // Add job to saved jobs
    addSavedJob: (state, action: PayloadAction<Job>) => {
      state.savedJobs.push(action.payload);
    },

    // Remove job from saved jobs
    removeSavedJob: (state, action: PayloadAction<string>) => {
      state.savedJobs = state.savedJobs.filter(
        (job) => job._id.toString() !== action.payload
      );
    },

    // Set categories
    setCategories: (state, action: PayloadAction<JobCategory[]>) => {
      state.categories = action.payload;
    },

    // Set skills
    setSkills: (state, action: PayloadAction<Skill[]>) => {
      state.skills = action.payload;
    },

    // Update filters
    setFilters: (
      state,
      action: PayloadAction<Partial<JobsState["filters"]>>
    ) => {
      state.filters = { ...state.filters, ...action.payload };
    },

    // Clear filters
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },

    // Reset jobs state
    resetJobs: () => initialState,
  },
});

// Export actions and reducer
export const {
  setJobs,
  setCurrentJob,
  clearCurrentJob,
  setFeaturedJobs,
  setRecommendedJobs,
  setSavedJobs,
  setAppliedJobs,
  addSavedJob,
  removeSavedJob,
  setCategories,
  setSkills,
  setFilters,
  clearFilters,
  resetJobs,
} = jobsSlice.actions;

export default jobsSlice.reducer;
