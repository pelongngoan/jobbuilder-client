import apiClient from "./api";
import { Resume, ResumeRequest, ResumeUpdateRequest } from "../types";
import { ApiResponse, PaginatedResponse } from "../types/common.types";

// Resume service
const resumeService = {
  // Get all resumes for current user
  getResumes: async (page = 1, limit = 10) => {
    const response = await apiClient.get<
      ApiResponse<PaginatedResponse<Resume>>
    >("/resumes", {
      params: { page, limit },
    });
    return response.data;
  },

  // Get resume by ID
  getResumeById: async (id: string) => {
    const response = await apiClient.get<ApiResponse<Resume>>(`/resumes/${id}`);
    return response.data;
  },

  // Get default resume
  getDefaultResume: async () => {
    const response = await apiClient.get<ApiResponse<Resume>>(
      "/resumes/default"
    );
    return response.data;
  },

  // Create new resume
  createResume: async (resumeData: ResumeRequest) => {
    const response = await apiClient.post<ApiResponse<Resume>>(
      "/resumes",
      resumeData
    );
    return response.data;
  },

  // Update resume
  updateResume: async (id: string, resumeData: ResumeUpdateRequest) => {
    const response = await apiClient.put<ApiResponse<Resume>>(
      `/resumes/${id}`,
      resumeData
    );
    return response.data;
  },

  // Delete resume
  deleteResume: async (id: string) => {
    const response = await apiClient.delete<ApiResponse<boolean>>(
      `/resumes/${id}`
    );
    return response.data;
  },

  // Set resume as default
  setDefaultResume: async (id: string) => {
    const response = await apiClient.put<ApiResponse<Resume>>(
      `/resumes/${id}/default`
    );
    return response.data;
  },

  // Upload resume file
  uploadResumeFile: async (file: File, title: string) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);

    const response = await apiClient.post<ApiResponse<Resume>>(
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

  // Parse resume from file
  parseResumeFromFile: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await apiClient.post<ApiResponse<Partial<Resume>>>(
      "/resumes/parse",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  // Generate PDF from resume
  generateResumePDF: async (id: string, template: string = "default") => {
    const response = await apiClient.get<Blob>(`/resumes/${id}/pdf`, {
      params: { template },
      responseType: "blob",
    });

    // Create download link for PDF
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `resume-${id}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();

    return true;
  },
};

export default resumeService;
