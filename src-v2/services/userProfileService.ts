import apiClient from "./api";
import {
  UserProfile,
  UserProfileUpdateRequest,
  UserProfileWithDetails,
  UserExperience,
  UserEducation,
  UserCertification,
  UserPortfolioProject,
  UserSocialMedia,
} from "../types";
import { ApiResponse } from "../types/common.types";

// User Profile service
const userProfileService = {
  // Get current user profile
  getMyUserProfile: async () => {
    const response = await apiClient.get<ApiResponse<UserProfileWithDetails>>(
      "/user/profile"
    );
    return response.data;
  },

  // Get user profile by user ID
  getUserProfileByUserId: async (userId: string) => {
    const response = await apiClient.get<ApiResponse<UserProfileWithDetails>>(
      `/user/profile/${userId}`
    );
    return response.data;
  },

  // Update user profile
  updateUserProfile: async (profileData: UserProfileUpdateRequest) => {
    const response = await apiClient.put<ApiResponse<UserProfile>>(
      "/user/profile",
      profileData
    );
    return response.data;
  },

  // Add experience entry
  addExperience: async (experienceData: UserExperience) => {
    const response = await apiClient.post<ApiResponse<UserProfile>>(
      "/user/profile/experience",
      experienceData
    );
    return response.data;
  },

  // Update experience entry
  updateExperience: async (
    experienceId: string,
    experienceData: Partial<UserExperience>
  ) => {
    const response = await apiClient.put<ApiResponse<UserProfile>>(
      `/user/profile/experience/${experienceId}`,
      experienceData
    );
    return response.data;
  },

  // Delete experience entry
  deleteExperience: async (experienceId: string) => {
    const response = await apiClient.delete<ApiResponse<UserProfile>>(
      `/user/profile/experience/${experienceId}`
    );
    return response.data;
  },

  // Add education entry
  addEducation: async (educationData: UserEducation) => {
    const response = await apiClient.post<ApiResponse<UserProfile>>(
      "/user/profile/education",
      educationData
    );
    return response.data;
  },

  // Update education entry
  updateEducation: async (
    educationId: string,
    educationData: Partial<UserEducation>
  ) => {
    const response = await apiClient.put<ApiResponse<UserProfile>>(
      `/user/profile/education/${educationId}`,
      educationData
    );
    return response.data;
  },

  // Delete education entry
  deleteEducation: async (educationId: string) => {
    const response = await apiClient.delete<ApiResponse<UserProfile>>(
      `/user/profile/education/${educationId}`
    );
    return response.data;
  },

  // Add certification entry
  addCertification: async (certificationData: UserCertification) => {
    const response = await apiClient.post<ApiResponse<UserProfile>>(
      "/user/profile/certification",
      certificationData
    );
    return response.data;
  },

  // Update certification entry
  updateCertification: async (
    certificationId: string,
    certificationData: Partial<UserCertification>
  ) => {
    const response = await apiClient.put<ApiResponse<UserProfile>>(
      `/user/profile/certification/${certificationId}`,
      certificationData
    );
    return response.data;
  },

  // Delete certification entry
  deleteCertification: async (certificationId: string) => {
    const response = await apiClient.delete<ApiResponse<UserProfile>>(
      `/user/profile/certification/${certificationId}`
    );
    return response.data;
  },

  // Add project entry
  addProject: async (projectData: UserPortfolioProject) => {
    const response = await apiClient.post<ApiResponse<UserProfile>>(
      "/user/profile/project",
      projectData
    );
    return response.data;
  },

  // Update project entry
  updateProject: async (
    projectId: string,
    projectData: Partial<UserPortfolioProject>
  ) => {
    const response = await apiClient.put<ApiResponse<UserProfile>>(
      `/user/profile/project/${projectId}`,
      projectData
    );
    return response.data;
  },

  // Delete project entry
  deleteProject: async (projectId: string) => {
    const response = await apiClient.delete<ApiResponse<UserProfile>>(
      `/user/profile/project/${projectId}`
    );
    return response.data;
  },

  // Update social media links
  updateSocialMedia: async (socialMediaData: UserSocialMedia) => {
    const response = await apiClient.put<ApiResponse<UserProfile>>(
      "/user/profile/social-media",
      socialMediaData
    );
    return response.data;
  },

  // Update job search preferences
  updateJobSearchPreferences: async (preferences: {
    jobType?: string[];
    salaryRange?: string;
    remoteOnly?: boolean;
    availableForHire?: boolean;
  }) => {
    const response = await apiClient.put<ApiResponse<UserProfile>>(
      "/user/profile/job-preferences",
      preferences
    );
    return response.data;
  },

  // Update preferred categories
  updatePreferredCategories: async (categories: string[]) => {
    const response = await apiClient.put<ApiResponse<UserProfile>>(
      "/user/profile/preferred-categories",
      { categories }
    );
    return response.data;
  },

  // Update preferred locations
  updatePreferredLocations: async (locations: string[]) => {
    const response = await apiClient.put<ApiResponse<UserProfile>>(
      "/user/profile/preferred-locations",
      { locations }
    );
    return response.data;
  },
};

export default userProfileService;
