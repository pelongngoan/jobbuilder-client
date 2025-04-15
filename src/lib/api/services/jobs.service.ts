import { apiClient } from "../config";
import type { ApiResponse, Job, PaginatedResponse } from "../types";

export const jobsService = {
  async getAllJobs(
    page = 1,
    limit = 10
  ): Promise<ApiResponse<PaginatedResponse<Job>>> {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<Job>>>(
      "/jobs",
      {
        params: { page, limit },
      }
    );
    return response.data;
  },

  async getJobById(id: string): Promise<ApiResponse<Job>> {
    const response = await apiClient.get<ApiResponse<Job>>(`/jobs/${id}`);
    return response.data;
  },

  async createJob(
    jobData: Omit<Job, "id" | "createdAt" | "updatedAt">
  ): Promise<ApiResponse<Job>> {
    const response = await apiClient.post<ApiResponse<Job>>("/jobs", jobData);
    return response.data;
  },

  async updateJob(
    id: string,
    jobData: Partial<Job>
  ): Promise<ApiResponse<Job>> {
    const response = await apiClient.put<ApiResponse<Job>>(
      `/jobs/${id}`,
      jobData
    );
    return response.data;
  },

  async deleteJob(id: string): Promise<ApiResponse<void>> {
    const response = await apiClient.delete<ApiResponse<void>>(`/jobs/${id}`);
    return response.data;
  },

  async searchJobs(
    query: string,
    page = 1,
    limit = 10
  ): Promise<ApiResponse<PaginatedResponse<Job>>> {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<Job>>>(
      "/jobs/search",
      {
        params: { query, page, limit },
      }
    );
    return response.data;
  },
};
