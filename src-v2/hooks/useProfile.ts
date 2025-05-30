import { RootState, useAppDispatch } from "../redux/store";
import profileService from "../services/profile";
import { Profile } from "../types/profile.types";
import { useSelector } from "react-redux";
import { setProfile } from "../redux/slices/profileSlice";
import toast from "react-hot-toast";

export const useProfile = () => {
  const dispatch = useAppDispatch();
  // const { user, profile } = useSelector((state: RootState) => state.user);
  const { profile } = useSelector((state: RootState) => state.profile);

  const getProfile = async (userId: string) => {
    const response = await profileService.getProfile(userId);
    if (response.success && response.data) {
      dispatch(setProfile(response.data as unknown as Profile));
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
    console.log("response", response);
    if (response.success) {
      toast.success(response.message || "Update profile successfully");
    }
    return response;
  };

  return { updateProfile, getProfile, profile };
};
