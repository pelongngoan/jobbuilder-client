import apiClient from "./api";
import { JobPost } from "../types";
import {
  ApiResponse,
  CUDResponse,
  GetResponse,
  PaginatedResponse,
} from "../types/common.types";

// Job service
const jobService = {
  getJobById: async (id: string) => {
    const response = await apiClient.get<ApiResponse<GetResponse>>(
      `/jobs/${id}`
    );
    return response.data;
  },

  // Get jobs by company ID
  getCompanyJobs: async (companyId: string, page: number, limit: number) => {
    const response = await apiClient.get<
      ApiResponse<PaginatedResponse<JobPost>>
    >("/jobs/company", {
      params: {
        companyId,
        page,
        limit,
      },
    });
    return response.data;
  },
  getHrJobs: async (hrId: string, page: number, limit: number) => {
    const response = await apiClient.get<
      ApiResponse<PaginatedResponse<JobPost>>
    >("/jobs/hr", {
      params: { hrId, page, limit },
    });
    return response.data;
  },
  createJob: async (jobData: JobPost) => {
    const response = await apiClient.post<ApiResponse<CUDResponse>>(
      "/jobs",
      jobData
    );

    return response.data;
  },

  updateJob: async (jobId: string, jobData: Partial<JobPost>) => {
    const response = await apiClient.put<ApiResponse<CUDResponse>>(
      `/jobs/${jobId}`,
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
        jobs: JobPost[];
      }>
    >("/jobs/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
  getFeaturedJobs: async () => {
    const response = await apiClient.get<
      ApiResponse<PaginatedResponse<JobPost>>
    >("/jobs/featured");
    return response.data;
  },

  // Get jobs by category
  getJobsByCategory: async (categoryId: string) => {
    const response = await apiClient.get<
      ApiResponse<PaginatedResponse<JobPost>>
    >(`/jobs/categories/${categoryId}`);
    return response.data;
  },
  deleteJob: async (jobId: string) => {
    const response = await apiClient.delete<ApiResponse<CUDResponse>>(
      `/jobs/${jobId}`
    );
    return response.data;
  },
  searchJobs: async ({
    title = "",
    location = "",
    category = "",
    jobType = "",
    experienceLevel = "",
    salaryFrom,
    salaryTo,
    currency = "",
    page = 1,
    limit = 10,
  }: {
    title?: string;
    location?: string;
    category?: string;
    jobType?: string;
    experienceLevel?: string;
    salaryFrom?: number;
    salaryTo?: number;
    currency?: string;
    page?: number;
    limit?: number;
  }) => {
    const response = await apiClient.get<
      ApiResponse<PaginatedResponse<JobPost>>
    >(
      `/jobs/search?title=${title}&location=${location}&category=${category}&jobType=${jobType}&experienceLevel=${experienceLevel}&salaryFrom=${salaryFrom}&salaryTo=${salaryTo}&currency=${currency}&page=${page}&limit=${limit}`
    );
    return response.data;
  },
};

export default jobService;
