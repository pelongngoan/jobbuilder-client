import { useCallback } from "react";
import { JobPost } from "../types/job.types";
import { useAppSelector } from "../redux/store";
import { useAppDispatch } from "../redux/store";
import { jobService } from "../services";
import { setCurrentJob, setJobs } from "../redux/slices/jobsSlice";
import { setTotalPages } from "../redux/slices/paginationSlice";
import toast from "react-hot-toast";
export const useJobs = () => {
  const dispatch = useAppDispatch();
  const { jobs, currentJob } = useAppSelector((state) => state.jobs);
  const createJob = useCallback(async (jobData: JobPost) => {
    const response = await jobService.createJob(jobData);
    if (response.success) {
      toast.success("Job created successfully");
    }
  }, []);

  const updateJob = useCallback(
    async (jobId: string, jobData: Partial<JobPost>) => {
      const response = await jobService.updateJob(jobId, jobData);
      if (response.success) {
        toast.success("Job updated successfully");
        // Refresh the current job if it's the one being updated
        if (currentJob?._id === jobId) {
          dispatch(setCurrentJob({ ...currentJob, ...jobData }));
        }
      }
    },
    [dispatch, currentJob]
  );

  const getCompanyJobs = useCallback(
    async (companyId: string, page: number, limit: number) => {
      const response = await jobService.getCompanyJobs(companyId, page, limit);
      if (response.success && response.data && response.pagination) {
        dispatch(setJobs(response.data));
        dispatch(setTotalPages(response.pagination?.pages || 0));
      }
    },
    [dispatch]
  );
  const getHrJobs = useCallback(
    async (hrId: string, page: number, limit: number) => {
      const response = await jobService.getHrJobs(hrId, page, limit);
      if (response.success && response.data && response.pagination) {
        dispatch(setJobs(response.data));
        dispatch(setTotalPages(response.pagination?.pages || 0));
      }
    },
    [dispatch]
  );
  const importJobsFromCSV = useCallback(
    async (file: File, companyId: string) => {
      const response = await jobService.importJobsFromCSV(file, companyId);
      if (response.success) {
        toast.success("Jobs imported successfully");
      }
    },
    []
  );
  const getFeaturedJobs = useCallback(async () => {
    const response = await jobService.getFeaturedJobs();
    if (response.success && response.data) {
      dispatch(setJobs(response.data));
    }
  }, [dispatch]);

  const getCategoryJobs = useCallback(
    async (categoryId: string) => {
      const response = await jobService.getJobsByCategory(categoryId);
      if (response.success && response.data) {
        dispatch(setJobs(response.data));
      }
    },
    [dispatch]
  );
  const getJobById = useCallback(
    async (jobId: string) => {
      const response = await jobService.getJobById(jobId);
      if (response.success && response.data) {
        dispatch(setCurrentJob(response.data));
      }
    },
    [dispatch]
  );
  const deleteJob = useCallback(async (jobId: string) => {
    const response = await jobService.deleteJob(jobId);
    if (response.success) {
      toast.success("Job deleted successfully");
    }
  }, []);
  const searchJobs = useCallback(
    async ({
      title,
      location,
      category,
      jobType,
      experienceLevel,
      salaryFrom,
      salaryTo,
      currency,
      page,
      limit,
    }: {
      title?: string;
      location?: string;
      category?: string;
      jobType?: string;
      experienceLevel?: string;
      salaryFrom?: number;
      salaryTo?: number;
      currency?: string;
      page?: number;
      limit?: number;
    }) => {
      const response = await jobService.searchJobs({
        title,
        location,
        category,
        jobType,
        experienceLevel,
        salaryFrom,
        salaryTo,
        currency,
        page,
        limit,
      });
      if (response.success && response.data) {
        dispatch(setJobs(response.data));
        dispatch(setTotalPages(response.pagination?.pages || 0));
      }
    },
    [dispatch]
  );

  return {
    jobs,
    createJob,
    updateJob,
    getCompanyJobs,
    getHrJobs,
    importJobsFromCSV,
    getFeaturedJobs,
    getCategoryJobs,
    getJobById,
    currentJob,
    deleteJob,
    searchJobs,
  };
};
