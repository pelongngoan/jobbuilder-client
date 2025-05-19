import { useCallback } from "react";
import { JobPost } from "../types/job.types";
import { useAppSelector } from "../redux/store";
import { useAppDispatch } from "../redux/store";
import { jobService } from "../services";
import { setToast } from "../redux/slices/toastSlice";
import { setJobs } from "../redux/slices/jobsSlice";
export const useJobs = () => {
  const dispatch = useAppDispatch();
  const { jobs } = useAppSelector((state) => state.jobs);
  const createJob = useCallback(
    async (jobData: JobPost) => {
      const response = await jobService.createJob(jobData);
      if (response.success) {
        dispatch(setToast({ message: response.message, type: "success" }));
      }
    },
    [dispatch]
  );

  const getCompanyJobs = useCallback(
    async (companyId: string) => {
      const response = await jobService.getCompanyJobs(companyId);
      if (response.success && response.data) {
        dispatch(setJobs(response.data));
      }
    },
    [dispatch]
  );
  const getHrJobs = useCallback(
    async (hrId: string) => {
      const response = await jobService.getHrJobs(hrId);
      if (response.success && response.data) {
        dispatch(setJobs(response.data));
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
  return { jobs, createJob, getCompanyJobs, getHrJobs, importJobsFromCSV };
};
