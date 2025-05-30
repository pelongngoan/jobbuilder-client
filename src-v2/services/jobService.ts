import apiClient from "./api";
import { JobPost } from "../types";
import {
  ApiResponse,
  CUDResponse,
  GetResponse,
  PaginatedResponse,
} from "../types/common.types";

export interface JobCategory {
  _id: string;
  name: string;
  description: string;
  slug: string;
  parentCategory?: string;
  createdAt: string;
  updatedAt: string;
}

// Job service
const jobService = {
  getJobById: async (id: string) => {
    const response = await apiClient.get<ApiResponse<GetResponse>>(
      `/jobs/${id}`
    );
    return response.data;
  },

  getAllJobCategories: async () => {
    const response = await apiClient.get<ApiResponse<JobCategory[]>>(
      "/jobs/categories"
    );
    return response.data;
  },

  // Get jobs by company ID
  getCompanyJobs: async (companyId: string, page: number, limit: number) => {
    const response = await apiClient.get<
      ApiResponse<PaginatedResponse<JobPost>>
    >(`/jobs/company/${companyId}`, {
      params: {
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
    salaryCurrency = "",
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
    salaryCurrency?: string;
    page?: number;
    limit?: number;
  }) => {
    const params = new URLSearchParams();
    if (title) params.append("title", title);
    if (location) params.append("location", location);
    if (category) params.append("category", category);
    if (jobType) params.append("jobType", jobType);
    if (experienceLevel) params.append("experienceLevel", experienceLevel);
    if (salaryFrom) params.append("salaryFrom", salaryFrom.toString());
    if (salaryTo) params.append("salaryTo", salaryTo.toString());
    if (salaryCurrency) params.append("salaryCurrency", salaryCurrency);
    params.append("page", page.toString());
    params.append("limit", limit.toString());

    const response = await apiClient.get<
      ApiResponse<PaginatedResponse<JobPost>>
    >(`/jobs/search?${params.toString()}`);
    return response.data;
  },
};

export default jobService;
