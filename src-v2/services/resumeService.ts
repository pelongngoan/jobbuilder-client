import apiClient from "./api";
import { Resume } from "../types";
import { ApiResponse, CUDResponse, GetResponse } from "../types/common.types";

const resumeService = {
  getResumes: async (page = 1, limit = 10) => {
    const response = await apiClient.get<ApiResponse<GetResponse<Resume>>>(
      "/resumes",
      {
        params: { page, limit },
      }
    );
    return response.data;
  },

  getResumeById: async (id: string) => {
    const response = await apiClient.get<ApiResponse<GetResponse<Resume>>>(
      `/resumes/${id}`
    );
    return response.data;
  },
  createResume: async (resumeData: Resume) => {
    const response = await apiClient.post<ApiResponse<CUDResponse>>(
      "/resumes",
      resumeData
    );
    return response.data;
  },

  updateResume: async (id: string, resumeData: Resume) => {
    const response = await apiClient.put<ApiResponse<CUDResponse>>(
      `/resumes/${id}`,
      resumeData
    );
    return response.data;
  },

  deleteResume: async (id: string) => {
    const response = await apiClient.delete<ApiResponse<CUDResponse>>(
      `/resumes/${id}`
    );
    return response.data;
  },

  uploadResumeFile: async (file: File, title: string) => {
    // Validate file type
    if (file.type !== "application/pdf") {
      throw new Error("Only PDF files are allowed");
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);

    const response = await apiClient.post<ApiResponse<CUDResponse>>(
      "/resumes/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },
};

export default resumeService;
