import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../redux/store";
import {
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
} from "../redux/slices/profileSlice";
import {
  userProfileService,
  companyProfileService,
  hrProfileService,
  adminProfileService,
} from "../services";
  UserProfileUpdateRequest,
  CompanyProfileRequest,
  HRProfileUpdateRequest,
  AdminProfileUpdateRequest,
} from "../types";

/**
 * Hook for managing profile-related actions
 */
const useProfile = () => {
  const dispatch = useAppDispatch();
  const { userProfile, loading, error } = useAppSelector(
    (state) => state.profile
  );

  // API loading states
  const getUserProfileApi = useApiCall("getUserProfile");
  const updateUserProfileApi = useApiCall("updateUserProfile");

  // User Profile Methods
  const fetchUserProfile = useCallback(async () => {
    dispatch(setProfileLoading(true));
    const result = await getUserProfileApi.execute(
      () => userProfileService.getUserProfile(),
      (data) => {
        dispatch(setUserProfile(data));
        dispatch(setProfileLoading(false));
      }
    );
    if (!result.success) {
      dispatch(setProfileError(result.error));
      dispatch(setProfileLoading(false));
    }
    return result;
  }, [dispatch, getUserProfileApi]);

  const createUserProfile = useCallback(
    async (profileData: UserProfileRequest) => {
      dispatch(setProfileLoading(true));
      const result = await updateUserProfileApi.execute(
        () => userProfileService.createUserProfile(profileData),
        (data) => {
          dispatch(setUserProfile(data));
          dispatch(setProfileLoading(false));
        }
      );
      if (!result.success) {
        dispatch(setProfileError(result.error));
        dispatch(setProfileLoading(false));
      }
      return result;
    },
    [dispatch, updateUserProfileApi]
  );

  const updateUserProfileData = useCallback(
    async (profileData: UserProfileUpdateRequest) => {
      dispatch(setProfileLoading(true));
      const result = await updateUserProfileApi.execute(
        () => userProfileService.updateUserProfile(profileData),
        (data) => {
          dispatch(updateUserProfile(data));
          dispatch(setProfileLoading(false));
        }
      );
      if (!result.success) {
        dispatch(setProfileError(result.error));
        dispatch(setProfileLoading(false));
      }
      return result;
    },
    [dispatch, updateUserProfileApi]
  );

  // Clear profile data
  const clearProfiles = useCallback(() => {
    dispatch(clearAllProfiles());
  }, [dispatch]);

  return {
    // State
    userProfile,
    loading,
    error,

    // User Profile Methods
    fetchUserProfile,
    createUserProfile,
    updateUserProfile: updateUserProfileData,
    clearUserProfile: () => dispatch(clearUserProfile()),

    // Clear all profiles
    clearProfiles,
  };
};

export default useProfile;
