import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { RootState } from "../redux/store";
import userService from "../services/user";
import { setProfile, setUsers } from "../redux/slices/userSlice";
import { User, UserProfile } from "../types";
import { setTotalPages } from "../redux/slices/paginationSlice";

export const useUser = () => {
  const dispatch = useDispatch();
  const { profile, user, users, currentUser } = useSelector(
    (state: RootState) => state.user
  );

  const getUserProfile = async () => {
    const response = await userService.getUserProfile();
    if (response.success) {
      dispatch(setProfile(response.data));
    }
    return response;
  };

  const updateUserProfile = async (data: UserProfile) => {
    const response = await userService.updateUserProfile(data);
    if (response.success) {
      dispatch(setProfile(response.data));
    }
    return response;
  };

  const getUserProfileById = async (id: string) => {
    const response = await userService.getUserProfileById(id);
    if (response.success) {
      dispatch(setProfile(response.data));
    }
    return response;
  };

  const getUserProfileByEmail = async (email: string) => {
    const response = await userService.getUserProfileByEmail(email);
    if (response.success) {
      dispatch(setProfile(response.data));
    }
    return response;
  };

  const getUsers = async (page?: number, limit?: number) => {
    const response = await userService.getUsers(page, limit);
    if (response.success) {
      dispatch(setUsers(response.data));
      dispatch(setTotalPages(response.pagination?.pages || 0));
    }
    return response;
  };

  const searchUsers = async (query: string, page?: number, limit?: number) => {
    const response = await userService.searchUsers(query, page, limit);
    if (response.success) {
      dispatch(setUsers(response.data));
    }
    return response;
  };

  const createUser = async (data: User) => {
    const response = await userService.createUser(data);
    if (response.success) {
      dispatch(setUsers(response.data));
    }
    return response;
  };

  const deleteUser = async (id: string) => {
    const response = await userService.deleteUser(id);
    if (response.success) {
      dispatch(setUsers(response.data));
    }
    return response;
  };

  const importUser = async (file: File) => {
    const response = await userService.importUser(file);
    return response;
  };

  return {
    profile,
    user,
    users,
    currentUser,
    getUserProfile,
    updateUserProfile,
    getUserProfileById,
    getUserProfileByEmail,
    getUsers,
    searchUsers,
    createUser,
    deleteUser,
    importUser,
  };
};
