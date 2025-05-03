import { apiRequest } from "../axios";
import { Job } from "../types";

export const getAllJobs = async (page = 1, limit = 10) => {
  const response = await apiRequest.get("/jobs", {
    params: { page, limit },
  });
  return response.data;
};

export const getJobById = async (id: string) => {
  const response = await apiRequest.get(`/jobs/${id}`);
  return response.data;
};

export const createJob = async (jobData: Job) => {
  const response = await apiRequest.post("/jobs", jobData);
  return response.data;
};

export const updateJob = async (id: string, jobData: Partial<Job>) => {
  const response = await apiRequest.put(`/jobs/${id}`, jobData);
  return response.data;
};

export const deleteJob = async (id: string) => {
  const response = await apiRequest.delete(`/jobs/${id}`);
  return response.data;
};

export const searchJobs = async (query: string, page = 1, limit = 10) => {
  const response = await apiRequest.get("/jobs/search", {
    params: { query, page, limit },
  });
  return response.data;
};
