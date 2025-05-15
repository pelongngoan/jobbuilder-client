import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Skill } from "../../types";

// Define skill state structure
interface SkillState {
  skills: Skill[];
  loading: boolean;
  error: string | null;
}

const initialState: SkillState = {
  skills: [],
  loading: false,
  error: null,
};

// Create the skill slice
const skillSlice = createSlice({
  name: "skill",
  initialState,
  reducers: {
    // Loading and error states
    setSkillLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setSkillError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    // Skill collection actions
    setSkills: (state, action: PayloadAction<Skill[]>) => {
      state.skills = action.payload;
    },
    addSkill: (state, action: PayloadAction<Skill>) => {
      state.skills.push(action.payload);
    },
    updateSkill: (state, action: PayloadAction<Skill>) => {
      const index = state.skills.findIndex(
        (skill) => skill._id === action.payload._id
      );
      if (index !== -1) {
        state.skills[index] = action.payload;
      }
    },
    deleteSkill: (state, action: PayloadAction<string>) => {
      state.skills = state.skills.filter(
        (skill) => skill._id.toString() !== action.payload
      );
    },

    // Reset state
    resetSkills: (state) => {
      state.skills = [];
      state.loading = false;
      state.error = null;
    },
  },
});

// Export actions and reducer
export const {
  setSkillLoading,
  setSkillError,
  setSkills,
  addSkill,
  updateSkill,
  deleteSkill,
  resetSkills,
} = skillSlice.actions;

export default skillSlice.reducer;
