import { useAppDispatch } from "../redux/store";
import { setToast } from "../redux/slices/toastSlice";
import profileService from "../services/profile";
import { Profile } from "../types/profile.types";

export const useProfile = () => {
  const dispatch = useAppDispatch();

  const updateProfile = async (id: string, data: Profile) => {
    const response = await profileService.updateProfile(id, data);
    if (response.success) {
      dispatch(setToast({ message: response.message, type: "success" }));
    }
    return response;
  };

  return { updateProfile };
};
