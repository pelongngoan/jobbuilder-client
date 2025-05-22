import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { RootState } from "../redux/store";
import userService from "../services/user";
import { setProfile } from "../redux/slices/userSlice";
import { UserProfile } from "../types";
export const useUser = () => {
  const dispatch = useDispatch();
  const { profile, user } = useSelector((state: RootState) => state.user);

  const getUserProfile = async () => {
    const response = await userService.getUserProfile();
    if (response.success) {
      dispatch(setProfile(response.data));
    }
  };
  const updateUserProfile = async (data: UserProfile) => {
    const response = await userService.updateUserProfile(data);
    if (response.success) {
      dispatch(setProfile(response.data));
    }
  };
  const getUserProfileById = async (id: string) => {
    const response = await userService.getUserProfileById(id);
    if (response.success) {
      dispatch(setProfile(response.data));
    }
  };
  const getUserProfileByEmail = async (email: string) => {
    const response = await userService.getUserProfileByEmail(email);
    if (response.success) {
      dispatch(setProfile(response.data));
    }
  };
  const saveJob = async (jobId: string) => {
    const response = await userService.saveJob(jobId);
    if (response.success) {
      dispatch(setProfile(response.data));
    }
  };
  const unsaveJob = async (jobId: string) => {
    const response = await userService.unsaveJob(jobId);
    if (response.success) {
      dispatch(setProfile(response.data));
    }
  };
  return {
    profile,
    user,
    getUserProfile,
    updateUserProfile,
    getUserProfileById,
    getUserProfileByEmail,
  };
};
