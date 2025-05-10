import apiClient from "./api";
import { Job, JobRequest, JobSearchFilters } from "../types";
import { ApiResponse, PaginatedResponse } from "../types/common.types";

// Job service
const jobService = {
  // Get all jobs with filters
  getJobs: async (filters?: JobSearchFilters, page = 1, limit = 10) => {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<Job>>>(
      "/jobs",
      {
        params: {
          ...filters,
          page,
          limit,
        },
      }
    );
    return response.data;
  },

  // Get job by ID
  getJobById: async (id: string) => {
    const response = await apiClient.get<ApiResponse<Job>>(`/jobs/${id}`);
    return response.data;
  },

  // Get jobs by company ID
  getJobsByCompany: async (companyId: string, page = 1, limit = 10) => {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<Job>>>(
      "/jobs",
      {
        params: {
          companyId,
          page,
          limit,
        },
      }
    );
    return response.data;
  },

  // Create new job
  createJob: async (jobData: JobRequest) => {
    const response = await apiClient.post<ApiResponse<Job>>("/jobs", jobData);
    return response.data;
  },

  // Update job
  updateJob: async (id: string, jobData: Partial<JobRequest>) => {
    const response = await apiClient.put<ApiResponse<Job>>(
      `/jobs/${id}`,
      jobData
    );
    return response.data;
  },

  // Delete job
  deleteJob: async (id: string) => {
    const response = await apiClient.delete<ApiResponse<boolean>>(
      `/jobs/${id}`
    );
    return response.data;
  },

  // Get featured jobs
  getFeaturedJobs: async (limit = 6) => {
    const response = await apiClient.get<ApiResponse<Job[]>>("/jobs/featured", {
      params: { limit },
    });
    return response.data;
  },

  // Search jobs by query
  searchJobs: async (query: string, page = 1, limit = 10) => {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<Job>>>(
      "/jobs/search",
      {
        params: {
          query,
          page,
          limit,
        },
      }
    );
    return response.data;
  },

  // Get job categories
  getJobCategories: async () => {
    const response = await apiClient.get<
      ApiResponse<Array<{ _id: string; name: string }>>
    >("/job-categories");
    return response.data;
  },
};

export default jobService;
