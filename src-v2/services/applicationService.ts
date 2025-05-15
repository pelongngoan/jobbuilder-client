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
    >("/applications", {
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
    >(`/applications/job/${jobId}`, {
      params: {
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
  applyForJob: async (jobId: string, applicationData: ApplicationRequest) => {
    const response = await apiClient.post<ApiResponse<Application>>(
      `/applications/${jobId}/apply`,
      applicationData
    );
    return response.data;
  },

  // Update application status (HR/Admin)
  updateApplicationStatus: async (
    id: string,
    statusData: {
      status: string;
      feedback?: string;
      interviewDate?: Date | string;
    }
  ) => {
    const response = await apiClient.put<ApiResponse<Application>>(
      `/applications/${id}/status`,
      statusData
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

  // For backward compatibility with existing code
  getUserApplications: async (page = 1, limit = 10) => {
    return applicationService.getMyApplications({}, page, limit);
  },

  createApplication: async (applicationData: ApplicationRequest) => {
    // Ensure jobId is provided
    if (!applicationData.jobId) {
      throw new Error("Job ID is required for application");
    }
    return applicationService.applyForJob(
      applicationData.jobId,
      applicationData
    );
  },

  updateApplication: async (
    id: string,
    updateData: ApplicationUpdateRequest
  ) => {
    if (updateData && "status" in updateData && updateData.status) {
      return applicationService.updateApplicationStatus(id, {
        status: updateData.status,
        feedback: updateData.feedback,
        interviewDate: updateData.interview?.scheduledFor,
      });
    }
    // If it's not a status update, this is a fallback that might need to be implemented
    // based on the actual API requirements
    const response = await apiClient.put<ApiResponse<Application>>(
      `/applications/${id}`,
      updateData
    );
    return response.data;
  },

  deleteApplication: async (id: string) => {
    return applicationService.withdrawApplication(id);
  },

  getJobApplications: async (jobId: string, page = 1, limit = 10) => {
    return applicationService.getApplicationsByJob(jobId, {}, page, limit);
  },
};

export default applicationService;
