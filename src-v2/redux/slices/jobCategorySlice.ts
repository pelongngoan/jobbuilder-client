import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { JobCategory } from "../../types";

// Define jobCategory state structure
interface JobCategoryState {
  jobCategories: JobCategory[];
  loading: boolean;
  error: string | null;
}

const initialState: JobCategoryState = {
  jobCategories: [],
  loading: false,
  error: null,
};

// Create the jobCategory slice
const jobCategorySlice = createSlice({
  name: "jobCategory",
  initialState,
  reducers: {
    // Loading and error states
    setJobCategoryLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setJobCategoryError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    // JobCategory collection actions
    setJobCategories: (state, action: PayloadAction<JobCategory[]>) => {
      state.jobCategories = action.payload;
    },
    addJobCategory: (state, action: PayloadAction<JobCategory>) => {
      state.jobCategories.push(action.payload);
    },
    updateJobCategory: (state, action: PayloadAction<JobCategory>) => {
      const index = state.jobCategories.findIndex(
        (category) => category._id === action.payload._id
      );
      if (index !== -1) {
        state.jobCategories[index] = action.payload;
      }
    },
    deleteJobCategory: (state, action: PayloadAction<string>) => {
      state.jobCategories = state.jobCategories.filter(
        (category) => category._id.toString() !== action.payload
      );
    },

    // Reset state
    resetJobCategories: (state) => {
      state.jobCategories = [];
      state.loading = false;
      state.error = null;
    },
  },
});

// Export actions and reducer
export const {
  setJobCategoryLoading,
  setJobCategoryError,
  setJobCategories,
  addJobCategory,
  updateJobCategory,
  deleteJobCategory,
  resetJobCategories,
} = jobCategorySlice.actions;

export default jobCategorySlice.reducer;
