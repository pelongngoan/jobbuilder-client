import apiClient from "./api";
import { Job, JobPost } from "../types";
import {
  ApiResponse,
  CUDResponse,
  GetResponse,
  PaginatedResponse,
} from "../types/common.types";

// Job service
const jobService = {
  // Get job by ID
  getJobById: async (id: string) => {
    const response = await apiClient.get<ApiResponse<GetResponse>>(
      `/jobs/${id}`
    );
    return response.data;
  },

  // Get jobs by company ID
  getCompanyJobs: async (companyId: string, page = 1, limit = 10) => {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<Job>>>(
      "/jobs/company",
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
  getHrJobs: async (hrId: string, page = 1, limit = 10) => {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<Job>>>(
      "/jobs/hr",
      {
        params: { hrId, page, limit },
      }
    );
    return response.data;
  },
  createJob: async (jobData: JobPost) => {
    const response = await apiClient.post<ApiResponse<CUDResponse>>(
      "/jobs",
      jobData
    );

    return response.data;
  },

  // Import jobs from CSV file
  importJobsFromCSV: async (file: File, companyId: string) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("companyId", companyId);

    const response = await apiClient.post<
      ApiResponse<{
        successCount: number;
        failedCount: number;
        jobs: Job[];
      }>
    >("/jobs/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
};

export default jobService;
