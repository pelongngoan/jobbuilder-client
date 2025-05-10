import apiClient from "./api";
import {
  AdminProfile,
  AdminProfileUpdateRequest,
  AdminActionRequest,
} from "../types";
import { ApiResponse, PaginatedResponse } from "../types/common.types";

// Admin Profile service
const adminProfileService = {
  // Get admin profile for current user
  getMyAdminProfile: async () => {
    const response = await apiClient.get<ApiResponse<AdminProfile>>(
      "/admin/profile"
    );
    return response.data;
  },

  // Get admin profile by user ID
  getAdminProfileByUserId: async (userId: string) => {
    const response = await apiClient.get<ApiResponse<AdminProfile>>(
      `/admin/profile/${userId}`
    );
    return response.data;
  },

  // Get all admin profiles
  getAllAdminProfiles: async (page = 1, limit = 10) => {
    const response = await apiClient.get<
      ApiResponse<PaginatedResponse<AdminProfile>>
    >("/admin/profiles", {
      params: { page, limit },
    });
    return response.data;
  },

  // Update admin profile
  updateAdminProfile: async (
    userId: string,
    profileData: AdminProfileUpdateRequest
  ) => {
    const response = await apiClient.put<ApiResponse<AdminProfile>>(
      `/admin/profile/${userId}`,
      profileData
    );
    return response.data;
  },

  // Create admin profile
  createAdminProfile: async (
    userId: string,
    profileData: AdminProfileUpdateRequest
  ) => {
    const response = await apiClient.post<ApiResponse<AdminProfile>>(
      "/admin/profile",
      {
        userId,
        ...profileData,
      }
    );
    return response.data;
  },

  // Delete admin profile
  removeAdminProfile: async (userId: string) => {
    const response = await apiClient.delete<ApiResponse<boolean>>(
      `/admin/profile/${userId}`
    );
    return response.data;
  },

  // Record admin action
  recordAction: async (actionData: AdminActionRequest) => {
    const response = await apiClient.post<ApiResponse<AdminProfile>>(
      "/admin/record-action",
      actionData
    );
    return response.data;
  },

  // Get admin activity logs
  getAdminActivityLogs: async (page = 1, limit = 20) => {
    const response = await apiClient.get<
      ApiResponse<
        PaginatedResponse<{
          adminId: string;
          adminName: string;
          action: {
            type: string;
            description: string;
            timestamp: string;
          };
        }>
      >
    >("/admin/activity-logs", {
      params: { page, limit },
    });
    return response.data;
  },
};

export default adminProfileService;
