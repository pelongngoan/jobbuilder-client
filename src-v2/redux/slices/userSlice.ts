import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  UserProfile,
  UserProfileWithDetails,
  AdminProfile,
  CompanyProfile,
  HRProfile,
} from "../../types";

// Define user state structure
interface UserState {
  userProfile: UserProfileWithDetails | null;
  adminProfile: AdminProfile | null;
  companyProfile: CompanyProfile | null;
  hrProfile: HRProfile | null;
}

const initialState: UserState = {
  userProfile: null,
  adminProfile: null,
  companyProfile: null,
  hrProfile: null,
};

// Create the user slice
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserProfile: (state, action: PayloadAction<UserProfileWithDetails>) => {
      state.userProfile = action.payload;
    },
    updateUserProfile: (state, action: PayloadAction<Partial<UserProfile>>) => {
      if (state.userProfile) {
        state.userProfile = { ...state.userProfile, ...action.payload };
      }
    },
    clearUserProfile: (state) => {
      state.userProfile = null;
    },

    // Admin profile reducers
    setAdminProfile: (state, action: PayloadAction<AdminProfile>) => {
      state.adminProfile = action.payload;
    },
    updateAdminProfile: (
      state,
      action: PayloadAction<Partial<AdminProfile>>
    ) => {
      if (state.adminProfile) {
        state.adminProfile = { ...state.adminProfile, ...action.payload };
      }
    },
    clearAdminProfile: (state) => {
      state.adminProfile = null;
    },

    // Company profile reducers
    setCompanyProfile: (state, action: PayloadAction<CompanyProfile>) => {
      state.companyProfile = action.payload;
    },
    updateCompanyProfile: (
      state,
      action: PayloadAction<Partial<CompanyProfile>>
    ) => {
      if (state.companyProfile) {
        state.companyProfile = { ...state.companyProfile, ...action.payload };
      }
    },
    clearCompanyProfile: (state) => {
      state.companyProfile = null;
    },

    // HR profile reducers
    setHRProfile: (state, action: PayloadAction<HRProfile>) => {
      state.hrProfile = action.payload;
    },
    updateHRProfile: (state, action: PayloadAction<Partial<HRProfile>>) => {
      if (state.hrProfile) {
        state.hrProfile = { ...state.hrProfile, ...action.payload };
      }
    },
    clearHRProfile: (state) => {
      state.hrProfile = null;
    },

    // Clear all profiles
    clearAllProfiles: (state) => {
      state.userProfile = null;
      state.adminProfile = null;
      state.companyProfile = null;
      state.hrProfile = null;
    },
  },
});

// Export actions and reducer
export const {
  setUserProfile,
  updateUserProfile,
  clearUserProfile,
  setAdminProfile,
  updateAdminProfile,
  clearAdminProfile,
  setCompanyProfile,
  updateCompanyProfile,
  clearCompanyProfile,
  setHRProfile,
  updateHRProfile,
  clearHRProfile,
  clearAllProfiles,
} = userSlice.actions;

export default userSlice.reducer;
