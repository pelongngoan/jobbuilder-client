import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User, UserProfile } from "../../types";
import { UserRequest } from "../../services/user";

// Define user state structure
interface UserState {
  profile: UserProfile | null;
  user: User | null;
  currentUser: UserRequest | null;
  users: UserRequest[];
}

const initialState: UserState = {
  profile: null,
  user: null,
  currentUser: null,
  users: [],
};

// Create the user slice
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setProfile: (state, action: PayloadAction<UserProfile>) => {
      state.profile = action.payload;
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    setCurrentUser: (state, action: PayloadAction<UserRequest | null>) => {
      state.currentUser = action.payload;
    },
    clearCurrentUser: (state) => {
      state.currentUser = null;
    },
    setUsers: (state, action: PayloadAction<UserRequest[]>) => {
      state.users = action.payload;
    },
  },
});

export const {
  setProfile,
  setUser,
  setCurrentUser,
  clearCurrentUser,
  setUsers,
} = userSlice.actions;

export default userSlice.reducer;
