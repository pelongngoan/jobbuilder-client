import apiClient from "./api";
import {
  HRProfile,
  HRProfileCreateRequest,
  HRProfileUpdateRequest,
  HRProfileWithDetails,
} from "../types";
import { ApiResponse, PaginatedResponse } from "../types/common.types";

// HR Profile service
const hrProfileService = {
  // Get HR profile for current user
  getMyHRProfile: async () => {
    const response = await apiClient.get<ApiResponse<HRProfileWithDetails>>(
      "/hr/profile"
    );
    return response.data;
  },

  // Get HR profile by user ID
  getHRProfileByUserId: async (userId: string) => {
    const response = await apiClient.get<ApiResponse<HRProfileWithDetails>>(
      `/hr/profile/${userId}`
    );
    return response.data;
  },

  // Get HR profiles by company ID
  getHRProfilesByCompany: async (companyId: string, page = 1, limit = 10) => {
    const response = await apiClient.get<
      ApiResponse<PaginatedResponse<HRProfile>>
    >(`/hr/company/${companyId}`, {
      params: { page, limit },
    });
    return response.data;
  },

  // Create HR profile
  createHRProfile: async (profileData: HRProfileCreateRequest) => {
    const response = await apiClient.post<ApiResponse<HRProfile>>(
      "/hr/profile",
      profileData
    );
    return response.data;
  },

  // Update HR profile
  updateHRProfile: async (profileData: HRProfileUpdateRequest) => {
    const response = await apiClient.put<ApiResponse<HRProfile>>(
      "/hr/profile",
      profileData
    );
    return response.data;
  },

  // Update HR permissions
  updateHRPermissions: async (
    userId: string,
    permissions: {
      canPostJobs?: boolean;
      canManageApplications?: boolean;
      canAddHRMembers?: boolean;
      canEditCompanyProfile?: boolean;
    }
  ) => {
    const response = await apiClient.put<ApiResponse<HRProfile>>(
      `/hr/permissions/${userId}`,
      { permissions }
    );
    return response.data;
  },

  // Delete HR profile
  deleteHRProfile: async (userId: string) => {
    const response = await apiClient.delete<ApiResponse<boolean>>(
      `/hr/profile/${userId}`
    );
    return response.data;
  },

  // Get HR dashboard stats
  getHRDashboardStats: async () => {
    const response = await apiClient.get<
      ApiResponse<{
        activeJobs: number;
        totalApplications: number;
        pendingApplications: number;
        interviewScheduled: number;
        hrMembers: number;
        applicationsByStatus: Record<string, number>;
        recentApplications: Array<{
          _id: string;
          jobTitle: string;
          applicantName: string;
          status: string;
          appliedAt: string;
        }>;
      }>
    >("/hr/dashboard-stats");
    return response.data;
  },
};

export default hrProfileService;
