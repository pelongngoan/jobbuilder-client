import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../redux/store";
import {
  setJobs,
  setCurrentJob,
  clearCurrentJob,
  setFeaturedJobs,
  setRecommendedJobs,
  setSavedJobs,
  addSavedJob,
  removeSavedJob,
  setCategories,
  setSkills,
  setFilters,
  clearFilters,
} from "../redux/slices/jobsSlice";
import jobService from "../services/jobService";
import jobCategoryService from "../services/jobCategoryService";
import skillService from "../services/skillService";
import savedJobService from "../services/savedJobService";
import useApiCall from "./useApiCall";
import { Job, JobSearchFilters, JobType } from "../types";

/**
 * Hook for managing jobs data and API calls
 */
export function useJobs() {
  const dispatch = useAppDispatch();
  const {
    jobs,
    featuredJobs,
    recommendedJobs,
    savedJobs,
    currentJob,
    categories,
    skills,
    filters,
    totalJobs,
    totalPages,
    currentPage,
  } = useAppSelector((state) => state.jobs);

  // API loading states
  const getJobsApi = useApiCall("getJobs");
  const getJobApi = useApiCall("getJob");
  const getFeaturedJobsApi = useApiCall("getFeaturedJobs");
  const getRecommendedJobsApi = useApiCall("getRecommendedJobs");
  const getSavedJobsApi = useApiCall("getSavedJobs");
  const saveJobApi = useApiCall("saveJob");
  const unsaveJobApi = useApiCall("unsaveJob");
  const getCategoriesApi = useApiCall("getCategories");
  const getSkillsApi = useApiCall("getSkills");

  // Fetch jobs with pagination and filters
  const fetchJobs = useCallback(
    async (page = 1, limit = 10, filterParams = filters) => {
      // Convert Redux filter state to backend filter format
      const convertFiltersToBackendFormat = (
        reduxFilters: typeof filters
      ): JobSearchFilters => {
        return {
          query: reduxFilters.search,
          location: reduxFilters.location?.[0], // Backend expects a single location string
          category: reduxFilters.category?.[0], // Backend expects a single category ID
          jobType: reduxFilters.jobType as JobType[], // Cast to the right type
          skills: reduxFilters.skills,
          // Add other conversions as needed
        };
      };

      const backendFilters = convertFiltersToBackendFormat(filterParams);
      const result = await getJobsApi.execute(
        () => jobService.getJobs(backendFilters, page, limit),
        (data) => {
          if (data.success && data.data) {
            dispatch(setJobs(data.data));
          }
        }
      );
      return result;
    },
    [dispatch, filters, getJobsApi]
  );

  // Fetch single job
  const fetchJob = useCallback(
    async (jobId: string) => {
      const result = await getJobApi.execute(
        () => jobService.getJobById(jobId),
        (data) => {
          if (data.success && data.data) {
            dispatch(setCurrentJob(data.data));
          }
        }
      );
      return result;
    },
    [dispatch, getJobApi]
  );

  // Fetch featured jobs
  const fetchFeaturedJobs = useCallback(async () => {
    const result = await getFeaturedJobsApi.execute(
      () => jobService.getFeaturedJobs(),
      (data) => {
        if (data.success && data.data) {
          dispatch(setFeaturedJobs(data.data));
        }
      }
    );
    return result;
  }, [dispatch, getFeaturedJobsApi]);

  // Fetch recommended jobs - placeholder for future implementation
  const fetchRecommendedJobs = useCallback(async () => {
    const result = await getRecommendedJobsApi.execute(
      () => {
        // This is a placeholder - backend needs to implement this endpoint
        return jobService.getJobs({ isFeatured: true }, 1, 5);
      },
      (data) => {
        if (data.success && data.data?.items) {
          dispatch(setRecommendedJobs(data.data.items));
        }
      }
    );
    return result;
  }, [dispatch, getRecommendedJobsApi]);

  // Fetch saved jobs
  const fetchSavedJobs = useCallback(async () => {
    const result = await getSavedJobsApi.execute(
      () => savedJobService.getSavedJobs(),
      (data) => {
        if (data.success && data.data?.items) {
          // Extract the Job objects from the SavedJobWithDetails objects
          const jobs = data.data.items
            .map((item) => item.job)
            .filter(Boolean) as Job[];
          dispatch(setSavedJobs(jobs));
        }
      }
    );
    return result;
  }, [dispatch, getSavedJobsApi]);

  // Save job
  const saveJob = useCallback(
    async (jobId: string) => {
      const result = await saveJobApi.execute(
        () => savedJobService.saveJob(jobId),
        async (data) => {
          if (data.success && data.data) {
            // Fetch the full job details to add to saved jobs
            const jobResult = await jobService.getJobById(jobId);
            if (jobResult.success && jobResult.data) {
              dispatch(addSavedJob(jobResult.data));
            }
          }
        }
      );
      return result;
    },
    [dispatch, saveJobApi]
  );

  // Unsave job
  const unsaveJob = useCallback(
    async (jobId: string) => {
      const result = await unsaveJobApi.execute(
        () => savedJobService.unsaveJob(jobId),
        (data) => {
          if (data.success) {
            dispatch(removeSavedJob(jobId));
          }
        }
      );
      return result;
    },
    [dispatch, unsaveJobApi]
  );

  // Fetch job categories
  const fetchCategories = useCallback(async () => {
    const result = await getCategoriesApi.execute(
      () => jobCategoryService.getJobCategories(),
      (data) => {
        if (data.success && data.data) {
          dispatch(setCategories(data.data));
        }
      }
    );
    return result;
  }, [dispatch, getCategoriesApi]);

  // Fetch skills
  const fetchSkills = useCallback(async () => {
    const result = await getSkillsApi.execute(
      () => skillService.getSkills(),
      (data) => {
        if (data.success && data.data) {
          dispatch(setSkills(data.data));
        }
      }
    );
    return result;
  }, [dispatch, getSkillsApi]);

  // Update filters
  const updateFilters = useCallback(
    (newFilters: Partial<typeof filters>) => {
      dispatch(setFilters(newFilters));
    },
    [dispatch]
  );

  // Reset filters
  const resetFilters = useCallback(() => {
    dispatch(clearFilters());
  }, [dispatch]);

  // Clear current job
  const clearJob = useCallback(() => {
    dispatch(clearCurrentJob());
  }, [dispatch]);

  return {
    // State
    jobs,
    featuredJobs,
    recommendedJobs,
    savedJobs,
    currentJob,
    categories,
    skills,
    filters,
    pagination: {
      totalJobs,
      totalPages,
      currentPage,
    },

    // Loading states
    loading: {
      jobs: getJobsApi.error !== null,
      job: getJobApi.error !== null,
      featuredJobs: getFeaturedJobsApi.error !== null,
      recommendedJobs: getRecommendedJobsApi.error !== null,
      savedJobs: getSavedJobsApi.error !== null,
      saveJob: saveJobApi.error !== null,
      unsaveJob: unsaveJobApi.error !== null,
      categories: getCategoriesApi.error !== null,
      skills: getSkillsApi.error !== null,
    },

    // Error states
    error: {
      jobs: getJobsApi.error,
      job: getJobApi.error,
      featuredJobs: getFeaturedJobsApi.error,
      recommendedJobs: getRecommendedJobsApi.error,
      savedJobs: getSavedJobsApi.error,
      saveJob: saveJobApi.error,
      unsaveJob: unsaveJobApi.error,
      categories: getCategoriesApi.error,
      skills: getSkillsApi.error,
    },

    // Methods
    fetchJobs,
    fetchJob,
    fetchFeaturedJobs,
    fetchRecommendedJobs,
    fetchSavedJobs,
    saveJob,
    unsaveJob,
    fetchCategories,
    fetchSkills,
    updateFilters,
    resetFilters,
    clearJob,
  };
}

export default useJobs;
