import apiClient from "./api";
import { SavedJob, SavedJobWithDetails } from "../types";
import { ApiResponse, PaginatedResponse } from "../types/common.types";

// Saved Job service
const savedJobService = {
  // Get all saved jobs for current user
  getSavedJobs: async (page = 1, limit = 10) => {
    const response = await apiClient.get<
      ApiResponse<PaginatedResponse<SavedJobWithDetails>>
    >("/saved-jobs", {
      params: { page, limit },
    });
    return response.data;
  },

  // Save a job
  saveJob: async (jobId: string) => {
    const response = await apiClient.post<ApiResponse<SavedJob>>(
      "/saved-jobs",
      { jobId }
    );
    return response.data;
  },

  // Check if a job is saved
  isJobSaved: async (jobId: string) => {
    const response = await apiClient.get<ApiResponse<{ isSaved: boolean }>>(
      `/saved-jobs/check/${jobId}`
    );
    return response.data;
  },

  // Unsave a job
  unsaveJob: async (jobId: string) => {
    const response = await apiClient.delete<ApiResponse<boolean>>(
      `/saved-jobs/${jobId}`
    );
    return response.data;
  },

  // Get saved job count
  getSavedJobCount: async () => {
    const response = await apiClient.get<ApiResponse<{ count: number }>>(
      "/saved-jobs/count"
    );
    return response.data;
  },
};

export default savedJobService;
