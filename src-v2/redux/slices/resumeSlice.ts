import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Resume } from "../../types";

// Define resume state structure
interface ResumeState {
  resumes: Resume[];
  currentResume: Resume | null;
  loading: boolean;
  error: string | null;
}

const initialState: ResumeState = {
  resumes: [],
  currentResume: null,
  loading: false,
  error: null,
};

// Create the resume slice
const resumeSlice = createSlice({
  name: "resume",
  initialState,
  reducers: {
    // Loading and error states
    setResumeLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setResumeError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    // Resume collection actions
    setResumes: (state, action: PayloadAction<Resume[]>) => {
      state.resumes = action.payload;
    },
    addResume: (state, action: PayloadAction<Resume>) => {
      state.resumes.push(action.payload);
    },
    updateResume: (state, action: PayloadAction<Resume>) => {
      const index = state.resumes.findIndex(
        (resume) => resume._id === action.payload._id
      );
      if (index !== -1) {
        state.resumes[index] = action.payload;

        // Also update currentResume if it's the same resume
        if (
          state.currentResume &&
          state.currentResume._id === action.payload._id
        ) {
          state.currentResume = action.payload;
        }
      }
    },
    deleteResume: (state, action: PayloadAction<string>) => {
      state.resumes = state.resumes.filter(
        (resume) => resume._id.toString() !== action.payload
      );

      // Clear currentResume if it's the deleted resume
      if (
        state.currentResume &&
        state.currentResume._id.toString() === action.payload
      ) {
        state.currentResume = null;
      }
    },

    // Current resume actions
    setCurrentResume: (state, action: PayloadAction<Resume | null>) => {
      state.currentResume = action.payload;
    },
    updateResumeContent: (
      state,
      action: PayloadAction<{ field: keyof Resume["content"]; data: unknown }>
    ) => {
      if (state.currentResume && state.currentResume.content) {
        const { field, data } = action.payload;
        state.currentResume = {
          ...state.currentResume,
          content: {
            ...state.currentResume.content,
            [field]: data,
          },
        };
      }
    },

    // Reset state
    resetResumes: (state) => {
      state.resumes = [];
      state.currentResume = null;
      state.loading = false;
      state.error = null;
    },
  },
});

// Export actions and reducer
export const {
  setResumeLoading,
  setResumeError,
  setResumes,
  addResume,
  updateResume,
  deleteResume,
  setCurrentResume,
  updateResumeContent,
  resetResumes,
} = resumeSlice.actions;

export default resumeSlice.reducer;
