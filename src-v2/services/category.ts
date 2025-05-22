import apiClient from "./api";
import { ApiResponse, CUDResponse, GetResponse } from "../types/common.types";
import { Category } from "../types/category.types";

// Category service
const categoryService = {
  // Get all categories
  getCategories: async ({ page, limit }: { page: number; limit: number }) => {
    console.log("getCategories", page, limit);
    const response = await apiClient.get<ApiResponse<GetResponse>>(
      "/categories/",
      {
        params: {
          page,
          limit,
        },
      }
    );
    return response.data;
  },

  // Get category by ID
  getCategoryById: async (id: string) => {
    const response = await apiClient.get<ApiResponse<GetResponse>>(
      `/categories/${id}`
    );
    return response.data;
  },

  // Create new job category
  createCategory: async (data: Category) => {
    const response = await apiClient.post<ApiResponse<CUDResponse>>(
      "/categories",
      data
    );
    return response.data;
  },

  // Update job category
  updateCategory: async (id: string, data: Category) => {
    const response = await apiClient.put<ApiResponse<CUDResponse>>(
      `/categories/${id}`,
      data
    );
    return response.data;
  },

  // Delete job category
  deleteCategory: async (id: string) => {
    const response = await apiClient.delete<ApiResponse<boolean>>(
      `/categories/${id}`
    );
    return response.data;
  },
  // Import job categories from CSV file
  importCategoriesFromCSV: async (formData: FormData) => {
    const response = await apiClient.post<
      ApiResponse<{
        successCount: number;
        failedCount: number;
        categories: Category[];
      }>
    >("/categories/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
  //Search categories
  searchCategories: async ({
    page,
    limit,
    query,
  }: {
    page: number;
    limit: number;
    query: string;
  }) => {
    const response = await apiClient.get<ApiResponse<GetResponse>>(
      `/categories/search?page=${page}&limit=${limit}&query=${query}`
    );
    return response.data;
  },
};

export default categoryService;
