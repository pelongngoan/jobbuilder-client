import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserProfile } from "../../types";

// Define profile state structure
interface ProfileState {
  userProfile: UserProfile | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  userProfile: localStorage.getItem("userProfile")
    ? JSON.parse(localStorage.getItem("userProfile") || "{}")
    : null,
  loading: false,
  error: null,
};
// Create the profile slice
const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    // Loading and error states
    setProfileLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setProfileError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    // User profile actions
    setUserProfile: (state, action: PayloadAction<UserProfile>) => {
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

    // // Company profile actions
    // setCompanyProfile: (state, action: PayloadAction<CompanyProfile>) => {
    //   state.companyProfile = action.payload;
    // },
    // updateCompanyProfile: (
    //   state,
    //   action: PayloadAction<Partial<CompanyProfile>>
    // ) => {
    //   if (state.companyProfile) {
    //     state.companyProfile = { ...state.companyProfile, ...action.payload };
    //   }
    // },
    // clearCompanyProfile: (state) => {
    //   state.companyProfile = null;
    // },

    // // HR profile actions
    // setHRProfile: (state, action: PayloadAction<HRProfile>) => {
    //   state.hrProfile = action.payload;
    // },
    // updateHRProfile: (state, action: PayloadAction<Partial<HRProfile>>) => {
    //   if (state.hrProfile) {
    //     state.hrProfile = { ...state.hrProfile, ...action.payload };
    //   }
    // },
    // clearHRProfile: (state) => {
    //   state.hrProfile = null;
    // },

    // // Admin profile actions
    // setAdminProfile: (state, action: PayloadAction<AdminProfile>) => {
    //   state.adminProfile = action.payload;
    // },
    // updateAdminProfile: (
    //   state,
    //   action: PayloadAction<Partial<AdminProfile>>
    // ) => {
    //   if (state.adminProfile) {
    //     state.adminProfile = { ...state.adminProfile, ...action.payload };
    //   }
    // },
    // clearAdminProfile: (state) => {
    //   state.adminProfile = null;
    // },

    // Clear all profiles
    clearAllProfiles: (state) => {
      state.userProfile = null;
      // state.companyProfile = null;
      // state.hrProfile = null;
      // state.adminProfile = null;
    },
  },
});

// Export actions and reducer
export const {
  setProfileLoading,
  setProfileError,
  setUserProfile,
  updateUserProfile,
  clearUserProfile,
  // setCompanyProfile,
  // updateCompanyProfile,
  // clearCompanyProfile,
  // setHRProfile,
  // updateHRProfile,
  // clearHRProfile,
  // setAdminProfile,
  // updateAdminProfile,
  // clearAdminProfile,
  clearAllProfiles,
} = profileSlice.actions;

export default profileSlice.reducer;
