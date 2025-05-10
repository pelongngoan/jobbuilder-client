import apiClient from "./api";
import {
  JobCategory,
  JobCategoryRequest,
  JobCategoryHierarchy,
} from "../types";
import { ApiResponse } from "../types/common.types";

// Job Category service
const jobCategoryService = {
  // Get all job categories
  getJobCategories: async () => {
    const response = await apiClient.get<ApiResponse<JobCategory[]>>(
      "/job-categories"
    );
    return response.data;
  },

  // Get job category by ID
  getJobCategoryById: async (id: string) => {
    const response = await apiClient.get<ApiResponse<JobCategory>>(
      `/job-categories/${id}`
    );
    return response.data;
  },

  // Create new job category
  createJobCategory: async (categoryData: JobCategoryRequest) => {
    const response = await apiClient.post<ApiResponse<JobCategory>>(
      "/job-categories",
      categoryData
    );
    return response.data;
  },

  // Update job category
  updateJobCategory: async (
    id: string,
    categoryData: Partial<JobCategoryRequest>
  ) => {
    const response = await apiClient.put<ApiResponse<JobCategory>>(
      `/job-categories/${id}`,
      categoryData
    );
    return response.data;
  },

  // Delete job category
  deleteJobCategory: async (id: string) => {
    const response = await apiClient.delete<ApiResponse<boolean>>(
      `/job-categories/${id}`
    );
    return response.data;
  },

  // Get job category hierarchy
  getJobCategoryHierarchy: async () => {
    const response = await apiClient.get<ApiResponse<JobCategoryHierarchy[]>>(
      "/job-categories/hierarchy"
    );
    return response.data;
  },
};

export default jobCategoryService;
