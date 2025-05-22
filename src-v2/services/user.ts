import { UserProfile } from "../types";
import apiClient from "./api";

const userService = {
  getUserProfile: async () => {
    const response = await apiClient.get("/users/profile");
    return response.data;
  },
  updateUserProfile: async (data: UserProfile) => {
    const response = await apiClient.put("/users/profile", data);
    return response.data;
  },
  getUserProfileById: async (id: string) => {
    const response = await apiClient.get(`/users/profile/${id}`);
    return response.data;
  },
  getUserProfileByEmail: async (email: string) => {
    const response = await apiClient.get(`/users/profile/email/${email}`);
    return response.data;
  },
  saveJob: async (jobId: string) => {
    const response = await apiClient.post(`/users/jobs/${jobId}/save`);
    return response.data;
  },
  unsaveJob: async (jobId: string) => {
    const response = await apiClient.delete(`/users/jobs/${jobId}/unsave`);
    return response.data;
  },
  applyJob: async (jobId: string) => {
    const response = await apiClient.post(`/users/jobs/${jobId}/apply`);
    return response.data;
  },
  removeApplication: async (jobId: string) => {
    const response = await apiClient.delete(`/users/jobs/${jobId}/remove`);
    return response.data;
  },
};

export default userService;
