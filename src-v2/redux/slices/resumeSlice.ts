import { createSlice } from "@reduxjs/toolkit";
import { Resume } from "../../types";

interface ResumeState {
  resumes: Resume[];
  currentResume: Resume | null;
}

const initialState: ResumeState = {
  resumes: [],
  currentResume: null,
};

// Create the resume slice
const resumeSlice = createSlice({
  name: "resume",
  initialState,
  reducers: {
    setResumes: (state, action) => {
      state.resumes = action.payload;
    },
    setCurrentResume: (state, action) => {
      state.currentResume = action.payload;
    },
  },
});

// Export actions and reducer
export const { setResumes, setCurrentResume } = resumeSlice.actions;

export default resumeSlice.reducer;
