import { UserRole } from "../types";
import { ApiResponse, CUDResponse } from "../types/common.types";
import apiClient from "./api";
export interface UserRequest {
  _id?: string;
  email?: string;
  password?: string;
  role?: UserRole;
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  companyName?: string;
  domain?: string;
  website?: string;
  isVerified?: boolean;
}
const userService = {
  getUserProfile: async () => {
    const response = await apiClient.get("/users/profile");
    return response.data;
  },
  updateUser: async (data: UserRequest) => {
    const response = await apiClient.put(`/users/${data._id}`, data);
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
  getUserById: async (id: string) => {
    const response = await apiClient.get(`/users/${id}`);
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
  createUser: async (data: UserRequest) => {
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
