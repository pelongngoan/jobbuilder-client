import { GetResponse } from "../types/common.types";

import { ApiResponse } from "../types/common.types";
import apiClient from "./api";
import { Profile } from "../types/profile.types";
// User Profile service
const profileService = {
  getProfile: async (id: string) => {
    const response = await apiClient.get<ApiResponse<GetResponse>>(
      `/profile/${id}`
    );
    return response.data;
  },
  updateProfile: async (id: string, data: Profile) => {
    const response = await apiClient.put<ApiResponse<GetResponse>>(
      `/profile/${id}`,
      data
    );
    return response.data;
  },
};

export default profileService;
