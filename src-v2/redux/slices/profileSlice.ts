import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Profile } from "../../types/profile.types";

// Define profile state structure
interface ProfileState {
  profile: Profile | null;
}

const initialState: ProfileState = {
  profile: null,
};
// Create the profile slice
const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    // User profile actions
    setProfile: (state, action: PayloadAction<Profile>) => {
      state.profile = action.payload;
    },
    resetProfile: (state) => {
      state.profile = null;
    },
  },
});

// Export actions and reducer
export const { setProfile, resetProfile } = profileSlice.actions;

export default profileSlice.reducer;
