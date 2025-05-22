import { RootState, useAppDispatch } from "../redux/store";
import { setToast } from "../redux/slices/toastSlice";
import profileService from "../services/profile";
import { Profile } from "../types/profile.types";
import { useSelector } from "react-redux";
import { setProfile } from "../redux/slices/profileSlice";
export const useProfile = () => {
  const dispatch = useAppDispatch();
  // const { user, profile } = useSelector((state: RootState) => state.user);
  const { profile } = useSelector((state: RootState) => state.profile);

  const getProfile = async (userId: string) => {
    const response = await profileService.getProfile(userId);
    console.log("response", response);
    if (response.success && response.data) {
      console.log("response.data", response.data);
      dispatch(setProfile(response.data as unknown as Profile));
      console.log("profile", profile);
    }
    return response;
  };
  const updateProfile = async (
    id: string,
    data: Profile,
    profilePicture?: File | null
  ) => {
    const response = await profileService.updateProfile(
      id,
      data,
      profilePicture || undefined
    );
    if (response.success) {
      dispatch(setToast({ message: response.message, type: "success" }));
    }
    return response;
  };

  return { updateProfile, getProfile, profile };
};
