import { useCallback } from "react";
import { JobPost } from "../types/job.types";
import { useAppSelector } from "../redux/store";
import { useAppDispatch } from "../redux/store";
import { jobService } from "../services";
import { setToast } from "../redux/slices/toastSlice";
import { setCurrentJob, setJobs } from "../redux/slices/jobsSlice";
import { setTotalPages } from "../redux/slices/paginationSlice";
export const useJobs = () => {
  const dispatch = useAppDispatch();
  const { jobs, currentJob } = useAppSelector((state) => state.jobs);
  const createJob = useCallback(
    async (jobData: JobPost) => {
      const response = await jobService.createJob(jobData);
      if (response.success) {
        dispatch(setToast({ message: response.message, type: "success" }));
      }
    },
    [dispatch]
  );

  const updateJob = useCallback(
    async (jobId: string, jobData: Partial<JobPost>) => {
      const response = await jobService.updateJob(jobId, jobData);
      if (response.success) {
        dispatch(setToast({ message: response.message, type: "success" }));
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
        dispatch(setToast({ message: response.message, type: "success" }));
      }
    },
    [dispatch]
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
  const deleteJob = useCallback(
    async (jobId: string) => {
      const response = await jobService.deleteJob(jobId);
      if (response.success) {
        dispatch(setToast({ message: response.message, type: "success" }));
      }
    },
    [dispatch]
  );
  const searchJobs = useCallback(
    async (
      name: string,
      location: string,
      category: string,
      page: number,
      limit: number
    ) => {
      const response = await jobService.searchJobs(
        name,
        location,
        category,
        page,
        limit
      );
      if (response.success && response.data) {
        dispatch(setJobs(response.data));
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
