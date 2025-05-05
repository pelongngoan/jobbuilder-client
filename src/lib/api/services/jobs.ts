import { apiRequest } from "../axios";
import { Job } from "../types";

export const createJob = async (jobData: Job) => {
  const response = await apiRequest.post("/job", jobData);
  return response.data;
};

export const getAllJobs = async (page = 1, limit = 10) => {
  const response = await apiRequest.get("/job", {
    params: { page, limit },
  });
  return response.data;
};

export const uploadJobsFromCSV = async (
  file: File,
  companyId: string,
  hrId: string
) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("companyId", companyId);
  formData.append("hrId", hrId);

  const response = await apiRequest.post("/job/upload/csv", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const getJobById = async (id: string) => {
  const response = await apiRequest.get(`/job/${id}`);
  return response.data;
};

export const updateJob = async (id: string, jobData: Partial<Job>) => {
  const response = await apiRequest.put(`/job/${id}`, jobData);
  return response.data;
};

export const deleteJob = async (id: string) => {
  const response = await apiRequest.delete(`/job/${id}`);
  return response.data;
};

export const searchJobs = async (query: string, page = 1, limit = 10) => {
  const response = await apiRequest.get("/job/search", {
    params: { query, page, limit },
  });
  return response.data;
};
