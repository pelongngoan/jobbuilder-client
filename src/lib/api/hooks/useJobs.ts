import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { jobsService } from "../services/jobs.service";
import type { Job } from "../types";

export const useJobs = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ["jobs", page, limit],
    queryFn: () => jobsService.getAllJobs(page, limit),
  });
};

export const useJob = (id: string) => {
  return useQuery({
    queryKey: ["job", id],
    queryFn: () => jobsService.getJobById(id),
    enabled: !!id,
  });
};

export const useCreateJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (jobData: Omit<Job, "id" | "createdAt" | "updatedAt">) =>
      jobsService.createJob(jobData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
  });
};

export const useUpdateJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Job> }) =>
      jobsService.updateJob(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      queryClient.invalidateQueries({ queryKey: ["job", id] });
    },
  });
};

export const useDeleteJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => jobsService.deleteJob(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
  });
};

export const useSearchJobs = (query: string, page = 1, limit = 10) => {
  return useQuery({
    queryKey: ["jobs", "search", query, page, limit],
    queryFn: () => jobsService.searchJobs(query, page, limit),
    enabled: !!query,
  });
};
