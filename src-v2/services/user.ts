import { User, UserProfile } from "../types";
import { ApiResponse, CUDResponse } from "../types/common.types";
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
  getUsers: async (page?: number, limit?: number) => {
    const response = await apiClient.get(`/users`, {
      params: {
        page,
        limit,
      },
    });
    return response.data;
  },
  searchUsers: async (query: string, page?: number, limit?: number) => {
    const params = new URLSearchParams();
    params.append("q", query);
    if (page) params.append("page", page.toString());
    if (limit) params.append("limit", limit.toString());
    const response = await apiClient.get(`/users/search?${params.toString()}`);
    return response.data;
  },
  createUser: async (data: User) => {
    const response = await apiClient.post("/users", data);
    return response.data;
  },
  deleteUser: async (id: string) => {
    const response = await apiClient.delete(`/users/${id}`);
    return response.data;
  },
  importUser: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await apiClient.post<ApiResponse<CUDResponse>>(
      `/users/import`,
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

export default userService;
