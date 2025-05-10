import apiClient from "./api";
import {
  Application,
  ApplicationRequest,
  ApplicationUpdateRequest,
  ApplicationFilters,
} from "../types";
import { ApiResponse, PaginatedResponse } from "../types/common.types";

// Application service
const applicationService = {
  // Get all applications for current user (job seeker)
  getMyApplications: async (
    filters?: ApplicationFilters,
    page = 1,
    limit = 10
  ) => {
    const response = await apiClient.get<
      ApiResponse<PaginatedResponse<Application>>
    >("/applications/my", {
      params: {
        ...filters,
        page,
        limit,
      },
    });
    return response.data;
  },

  // Get applications for a specific job (HR/Company)
  getApplicationsByJob: async (
    jobId: string,
    filters?: ApplicationFilters,
    page = 1,
    limit = 10
  ) => {
    const response = await apiClient.get<
      ApiResponse<PaginatedResponse<Application>>
    >("/applications", {
      params: {
        jobId,
        ...filters,
        page,
        limit,
      },
    });
    return response.data;
  },

  // Get application by ID
  getApplicationById: async (id: string) => {
    const response = await apiClient.get<ApiResponse<Application>>(
      `/applications/${id}`
    );
    return response.data;
  },

  // Create new application
  applyForJob: async (applicationData: ApplicationRequest) => {
    const response = await apiClient.post<ApiResponse<Application>>(
      "/applications",
      applicationData
    );
    return response.data;
  },

  // Update application status (HR/Admin)
  updateApplication: async (
    id: string,
    updateData: ApplicationUpdateRequest
  ) => {
    const response = await apiClient.put<ApiResponse<Application>>(
      `/applications/${id}`,
      updateData
    );
    return response.data;
  },

  // Withdraw application (job seeker)
  withdrawApplication: async (id: string) => {
    const response = await apiClient.delete<ApiResponse<boolean>>(
      `/applications/${id}`
    );
    return response.data;
  },

  // Get application statistics (for HR dashboard)
  getApplicationStats: async (jobId?: string) => {
    const response = await apiClient.get<
      ApiResponse<{
        total: number;
        pending: number;
        reviewed: number;
        shortlisted: number;
        interview: number;
        accepted: number;
        rejected: number;
      }>
    >("/applications/stats", {
      params: { jobId },
    });
    return response.data;
  },

  // Schedule interview
  scheduleInterview: async (
    id: string,
    interviewData: {
      scheduledFor: Date | string;
      location?: string;
      isOnline?: boolean;
      meetingLink?: string;
      interviewers?: string[];
      notes?: string;
      interviewType?: "phone" | "technical" | "behavioral" | "final";
      round?: number;
    }
  ) => {
    const response = await apiClient.put<ApiResponse<Application>>(
      `/applications/${id}/interview`,
      interviewData
    );
    return response.data;
  },
};

export default applicationService;
