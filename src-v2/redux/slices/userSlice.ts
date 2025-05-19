import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Profile, User } from "../../types";

// Define user state structure
interface UserState {
  user: User | null;
  profile: Profile | null;
}

const initialState: UserState = {
  user: null,
  profile: null,
};

// Create the user slice
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    clearUser: (state) => {
      state.user = null;
    },
    setProfile: (state, action: PayloadAction<Profile>) => {
      state.profile = action.payload;
    },
    clearProfile: (state) => {
      state.profile = null;
    },
  },
});

// Export actions and reducer
export const { setUser, clearUser, setProfile, clearProfile } =
  userSlice.actions;

export default userSlice.reducer;
