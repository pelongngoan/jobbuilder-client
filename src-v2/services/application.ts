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
  updateApplicationStatus: async (
    applicationId: string,
    status: string,
    interviewerId?: string
  ) => {
    const response = await apiClient.put<ApiResponse<GetResponse>>(
      `/applications/${applicationId}`,
      { status, interviewerId }
    );
    return response.data;
  },
  getJobApplications: async (jobId: string) => {
    const response = await apiClient.get<ApiResponse<GetResponse>>(
      `/applications/job/${jobId}`
    );
    return response.data;
  },
  // Manager-specific methods
  getCompanyApplications: async (
    companyId: string,
    page = 1,
    limit = 10,
    search = ""
  ) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search }),
    });
    const response = await apiClient.get<ApiResponse<GetResponse>>(
      `/applications/company/${companyId}?${params}`
    );
    return response.data;
  },
  getStaffApplications: async ({
    staffId,
    page = 1,
    limit = 10,
  }: {
    staffId: string;
    page?: number;
    limit?: number;
  }) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    const response = await apiClient.get<ApiResponse<GetResponse>>(
      `/applications/staff/${staffId}`,
      {
        params,
      }
    );
    return response.data;
  },
  searchApplications: async (query: string, page = 1, limit = 10) => {
    const params = new URLSearchParams({
      q: query,
      page: page.toString(),
      limit: limit.toString(),
    });
    const response = await apiClient.get<ApiResponse<GetResponse>>(
      `/applications/search?${params}`
    );
    return response.data;
  },
};

export default applicationService;
