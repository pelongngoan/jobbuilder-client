import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User, UserProfile } from "../../types";

// Define user state structure
interface UserState {
  user: User | null;
  profile: UserProfile | null;
}
const getInitialState = (): UserState => {
  if (typeof window !== "undefined") {
    const user = localStorage.getItem("user");
    const profile = localStorage.getItem("profile");
    return {
      user: user as User | null,
      profile: profile as UserProfile | null,
    };
  }
  return {
    user: null,
    profile: null,
  };
};
const initialState: UserState = getInitialState();

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
    setProfile: (state, action: PayloadAction<UserProfile>) => {
      state.profile = action.payload;
    },
    clearProfile: (state) => {
      state.profile = null;
    },
  },
});

export const { setUser, clearUser, setProfile, clearProfile } =
  userSlice.actions;

export default userSlice.reducer;
