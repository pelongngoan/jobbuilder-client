import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { RootState } from "../redux/store";
import userService, { UserRequest } from "../services/user";
import {
  setProfile,
  setUsers,
  setCurrentUser,
} from "../redux/slices/userSlice";
import { setTotalPages } from "../redux/slices/paginationSlice";
import toast from "react-hot-toast";

export const useUser = () => {
  const dispatch = useDispatch();
  const { profile, user, users, currentUser } = useSelector(
    (state: RootState) => state.user
  );

  const getUserProfile = async () => {
    const response = await userService.getUserProfile();
    if (response) {
      dispatch(setProfile(response.data));
    }
    return response;
  };

  const updateUser = async (data: UserRequest) => {
    const response = await userService.updateUser(data);
    if (response.success) {
      dispatch(setProfile(response.data));
      toast.success("Profile updated successfully");
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

  const getUserById = async (id: string) => {
    const response = await userService.getUserById(id);
    if (response.success) {
      dispatch(setCurrentUser(response.data));
    }
    return response;
  };

  const searchUsers = async (query: string, page?: number, limit?: number) => {
    const response = await userService.searchUsers(query, page, limit);
    if (response.success) {
      dispatch(setUsers(response.data));
      dispatch(setTotalPages(response.pagination?.pages || 0));
    }
    return response;
  };

  const createUser = async (data: UserRequest) => {
    const response = await userService.createUser(data);
    if (response.success) {
      toast.success("User created successfully");
    }
    return response;
  };

  const deleteUser = async (id: string) => {
    const response = await userService.deleteUser(id);
    if (response.success) {
      toast.success("User deleted successfully");
    }
    return response;
  };

  const importUser = async (file: File) => {
    const response = await userService.importUser(file);
    if (response.imported && response.imported > 0) {
      toast.success(`Imported ${response.imported} users`);
    } else {
      toast.error("Error importing users");
    }
    return response;
  };

  return {
    profile,
    user,
    users,
    currentUser,
    getUserProfile,
    getUserById,
    updateUser,
    getUsers,
    searchUsers,
    createUser,
    deleteUser,
    importUser,
  };
};
