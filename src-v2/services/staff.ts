import { ApiResponse, GetResponse, CUDResponse } from "../types/common.types";
import apiClient from "./api";

// Staff service
const staffService = {
  createStaff: async (data: {
    firstName: string;
    lastName: string;
    password: string;
    role: string;
    active: boolean;
  }) => {
    const response = await apiClient.post<ApiResponse<GetResponse>>(
      `/staffs`,
      data
    );
    return response.data;
  },
  getStaffs: async (page: number, limit: number) => {
    const response = await apiClient.get<ApiResponse<GetResponse>>(
      `/staffs?page=${page}&limit=${limit}`
    );
    return response.data;
  },
  getStaff: async (id: string) => {
    const response = await apiClient.get<ApiResponse<GetResponse>>(
      `/staffs/${id}`
    );
    return response.data;
  },
  updateStaff: async (
    id: string,
    data: {
      password?: string;
      role?: string;
      active?: boolean;
    }
  ) => {
    const response = await apiClient.put<ApiResponse<CUDResponse>>(
      `/staffs/${id}`,
      data
    );
    return response.data;
  },
  deleteStaff: async (id: string) => {
    const response = await apiClient.delete<ApiResponse<CUDResponse>>(
      `/staffs/${id}`
    );
    return response.data;
  },
  importStaffs: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await apiClient.post<ApiResponse<CUDResponse>>(
      `/staffs/import`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  searchStaffs: async ({
    page,
    limit,
    email,
    role,
  }: {
    page: number;
    limit: number;
    email: string;
    role: string;
  }) => {
    const response = await apiClient.get<ApiResponse<GetResponse>>(
      `/staffs/search?page=${page}&limit=${limit}&email=${email}&role=${role}`
    );
    return response.data;
  },
};

export default staffService;
