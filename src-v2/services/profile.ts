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
  updateProfile: async (id: string, data: Profile, profilePicture?: File) => {
    const formData = new FormData();

    // Append each field of profileData individually
    for (const key in data) {
      if (data[key as keyof Profile]) {
        formData.append(key, data[key as keyof Profile] as string);
      }
    }

    // Append files
    if (profilePicture) formData.append("profilePicture", profilePicture);
    const response = await apiClient.put<ApiResponse<GetResponse>>(
      `/profile/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },
};

export default profileService;
