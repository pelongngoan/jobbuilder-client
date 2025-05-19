import { ApiResponse, GetResponse, CUDResponse } from "../types/common.types";
import apiClient from "./api";

// Staff service
const staffService = {
  createStaff: async (data: {
    fullName: string;
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
  getStaffs: async () => {
    const response = await apiClient.get<ApiResponse<GetResponse>>(`/staffs`);
    return response.data;
  },
  getStaff: async (id: string) => {
    const response = await apiClient.get<ApiResponse<GetResponse>>(
      `/staffs/${id}`
    );
    return response.data;
  },
  updateStaffProfile: async (
    id: string,
    data: {
      firstName?: string;
      lastName?: string;
      email?: string;
      phone?: string;
      address?: string;
    }
  ) => {
    const response = await apiClient.put<ApiResponse<CUDResponse>>(
      `/staffs/${id}/profile`,
      data
    );
    return response.data;
  },
};

export default staffService;
