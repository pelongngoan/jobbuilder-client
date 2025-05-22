import { CUDResponse, GetResponse } from "../types/common.types";
import { ApiResponse } from "../types/common.types";
import apiClient from "./api";
const saveJobService = {
  saveJob: async (jobId: string) => {
    const response = await apiClient.post<ApiResponse<CUDResponse>>(
      `/saveJobs/${jobId}`
    );
    return response.data;
  },
  deleteSavedJob: async (jobId: string) => {
    const response = await apiClient.delete<ApiResponse<CUDResponse>>(
      `/saveJobs/${jobId}`
    );
    return response.data;
  },
  getSavedJobs: async () => {
    const response = await apiClient.get<ApiResponse<GetResponse>>(`/saveJobs`);
    return response.data;
  },
};

export default saveJobService;
