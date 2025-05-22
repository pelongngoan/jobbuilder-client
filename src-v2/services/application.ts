import { CUDResponse, GetResponse } from "../types/common.types";
import { ApiResponse } from "../types/common.types";
import apiClient from "./api";

// Application service
const applicationService = {
  getUserApplications: async () => {
    const response = await apiClient.get<ApiResponse<GetResponse>>(
      `/applications/`
    );
    return response.data;
  },
  applyForJob: async (jobId: string, resumeId: string) => {
    const response = await apiClient.post<ApiResponse<CUDResponse>>(
      `/applications/${jobId}/apply`,
      { resumeId }
    );
    return response.data;
  },
  deleteApplication: async (applicationId: string) => {
    const response = await apiClient.delete<ApiResponse<CUDResponse>>(
      `/applications/${applicationId}`
    );
    return response.data;
  },
  getApplicationById: async (applicationId: string) => {
    const response = await apiClient.get<ApiResponse<GetResponse>>(
      `/applications/${applicationId}`
    );
    return response.data;
  },
  updateApplicationStatus: async (applicationId: string, status: string) => {
    const response = await apiClient.put<ApiResponse<CUDResponse>>(
      `/applications/${applicationId}/status`,
      { status }
    );
    return response.data;
  },
  getJobApplications: async (jobId: string) => {
    const response = await apiClient.get<ApiResponse<GetResponse>>(
      `/applications/job/${jobId}`
    );
    return response.data;
  },
};

export default applicationService;
