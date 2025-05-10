import apiClient from "./api";
import {
  CompanyProfile,
  CompanyProfileRequest,
  CompanyProfileWithDetails,
  CompanySearchFilters,
} from "../types";
import { ApiResponse, PaginatedResponse } from "../types/common.types";

// Company Profile service
const companyProfileService = {
  // Get company profile for current user
  getMyCompanyProfile: async () => {
    const response = await apiClient.get<
      ApiResponse<CompanyProfileWithDetails>
    >("/company/profile");
    return response.data;
  },

  // Get company profile by ID
  getCompanyProfileById: async (id: string) => {
    const response = await apiClient.get<
      ApiResponse<CompanyProfileWithDetails>
    >(`/company/profile/${id}`);
    return response.data;
  },

  // Get company profile by slug
  getCompanyProfileBySlug: async (slug: string) => {
    const response = await apiClient.get<
      ApiResponse<CompanyProfileWithDetails>
    >(`/company/profile/slug/${slug}`);
    return response.data;
  },

  // Get all companies
  getAllCompanies: async (
    page = 1,
    limit = 10,
    filters?: CompanySearchFilters
  ) => {
    const response = await apiClient.get<
      ApiResponse<PaginatedResponse<CompanyProfile>>
    >("/companies", {
      params: {
        ...filters,
        page,
        limit,
      },
    });
    return response.data;
  },

  // Create company profile
  createCompanyProfile: async (profileData: CompanyProfileRequest) => {
    const response = await apiClient.post<ApiResponse<CompanyProfile>>(
      "/company/profile",
      profileData
    );
    return response.data;
  },

  // Update company profile
  updateCompanyProfile: async (profileData: Partial<CompanyProfileRequest>) => {
    const response = await apiClient.put<ApiResponse<CompanyProfile>>(
      "/company/profile",
      profileData
    );
    return response.data;
  },

  // Delete company profile
  deleteCompanyProfile: async () => {
    const response = await apiClient.delete<ApiResponse<boolean>>(
      "/company/profile"
    );
    return response.data;
  },

  // Upload company logo
  uploadLogo: async (file: File) => {
    const formData = new FormData();
    formData.append("logo", file);

    const response = await apiClient.post<ApiResponse<{ logoUrl: string }>>(
      "/company/upload-logo",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  // Add HR member
  addHRMember: async (userId: string) => {
    const response = await apiClient.post<ApiResponse<CompanyProfile>>(
      "/company/hr-members",
      { userId }
    );
    return response.data;
  },

  // Remove HR member
  removeHRMember: async (userId: string) => {
    const response = await apiClient.delete<ApiResponse<CompanyProfile>>(
      `/company/hr-members/${userId}`
    );
    return response.data;
  },

  // Get company HR members
  getCompanyHRMembers: async (companyId: string) => {
    const response = await apiClient.get<
      ApiResponse<
        Array<{
          _id: string;
          name: string;
          email: string;
          profilePicture?: string;
          position?: string;
          department?: string;
        }>
      >
    >(`/company/${companyId}/hr-members`);
    return response.data;
  },

  // Search companies by name
  searchCompanies: async (query: string, page = 1, limit = 10) => {
    const response = await apiClient.get<
      ApiResponse<PaginatedResponse<CompanyProfile>>
    >("/companies/search", {
      params: {
        query,
        page,
        limit,
      },
    });
    return response.data;
  },
};

export default companyProfileService;
