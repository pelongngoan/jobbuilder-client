import { apiRequest } from "../axios";
import { User } from "../types";

export const getProfile = async () => {
  const response = await apiRequest.get("/user/profile");
  return response.data;
};

export const updateUserProfile = async (params: User) => {
  const response = await apiRequest.put("/user/profile", params);
  return response.data;
};

export const changePassword = async (oldPass: string, newPass: string) => {
  const response = await apiRequest.put("/user/change-password", {
    params: {
      oldPass,
      newPass,
    },
  });
  return response.data;
};
