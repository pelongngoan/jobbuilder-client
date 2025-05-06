import { apiRequest } from "../axios";
import { JobPost } from "../../../types/job";

/**
 * Create a new job post
 */
export const createJob = async (jobData: JobPost) => {
  const response = await apiRequest.post("/job", jobData);
  return response.data;
};

/**
 * Get all job posts (paginated, with filters)
 */
export const getAllJobs = async ({
  page = 1,
  limit = 10,
  title,
  location,
}: {
  page?: number;
  limit?: number;
  title?: string;
  location?: string;
}) => {
  const response = await apiRequest.get("/job", {
    params: { page, limit, title, location },
  });
  return response.data;
};

/**
 * Upload jobs from a CSV file
 */
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

/**
 * Get a job post by ID
 */
export const getJobById = async (id: string) => {
  const response = await apiRequest.get(`/job/${id}`);
  return response.data;
};

/**
 * Update a job post by ID
 */
export const updateJob = async (id: string, jobData: Partial<JobPost>) => {
  console.log(jobData);
  const response = await apiRequest.put(`/job/${id}`, jobData);
  console.log(response.data);
  return response.data;
};

/**
 * Delete a job post by ID
 */
export const deleteJob = async (id: string) => {
  const response = await apiRequest.delete(`/job/${id}`);
  return response.data;
};

/**
 * Search job posts by query (paginated)
 */
export const searchJobs = async (query: string, page = 1, limit = 10) => {
  const response = await apiRequest.get("/job/search", {
    params: { title: query, page, limit },
  });
  return response.data;
};
