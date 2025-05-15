import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../redux/store";
import {
  setSavedJobLoading,
  setSavedJobError,
  setSavedJobs,
  addSavedJob,
  removeSavedJob,
  toggleSaveStatus,
  resetSavedJobs,
} from "../redux/slices/savedJobSlice";
import { savedJobService } from "../services";

/**
 * Hook for managing saved job-related actions
 */
const useSavedJob = () => {
  const dispatch = useAppDispatch();
  const { savedJobs, loading, error } = useAppSelector(
    (state) => state.savedJob
  );

  // API loading states
  const getSavedJobsApi = useApiCall("getSavedJobs");
  const saveJobApi = useApiCall("saveJob");
  const isJobSavedApi = useApiCall("isJobSaved");
  const unsaveJobApi = useApiCall("unsaveJob");
  const getSavedJobCountApi = useApiCall("getSavedJobCount");

  // Fetch all saved jobs
  const fetchSavedJobs = useCallback(
    async (page = 1, limit = 10) => {
      dispatch(setSavedJobLoading(true));
      const result = await getSavedJobsApi.execute(
        () => savedJobService.getSavedJobs(page, limit),
        (data) => {
          if (data.data && data.data.items) {
            dispatch(setSavedJobs(data.data.items));
          }
          dispatch(setSavedJobLoading(false));
        }
      );
      if (result && !result.success) {
        dispatch(
          setSavedJobError(result.error || "Failed to fetch saved jobs")
        );
        dispatch(setSavedJobLoading(false));
      }
      return result;
    },
    [dispatch, getSavedJobsApi]
  );

  // Save a job
  const saveJob = useCallback(
    async (jobId: string) => {
      dispatch(setSavedJobLoading(true));
      // Optimistically update UI
      dispatch(toggleSaveStatus({ jobId, isSaved: true }));

      const result = await saveJobApi.execute(
        () => savedJobService.saveJob(jobId),
        (data) => {
          if (data.data) {
            dispatch(addSavedJob(data.data));
          }
          dispatch(setSavedJobLoading(false));
        }
      );
      if (result && !result.success) {
        // Revert optimistic update
        dispatch(toggleSaveStatus({ jobId, isSaved: false }));
        dispatch(setSavedJobError(result.error || "Failed to save job"));
        dispatch(setSavedJobLoading(false));
      }
      return result;
    },
    [dispatch, saveJobApi]
  );

  // Check if a job is saved
  const checkIfJobSaved = useCallback(
    async (jobId: string) => {
      dispatch(setSavedJobLoading(true));
      const result = await isJobSavedApi.execute(
        () => savedJobService.isJobSaved(jobId),
        () => {
          dispatch(setSavedJobLoading(false));
        }
      );
      if (result && !result.success) {
        dispatch(
          setSavedJobError(result.error || "Failed to check if job is saved")
        );
        dispatch(setSavedJobLoading(false));
      }
      return result && result.data ? result.data.isSaved : false;
    },
    [dispatch, isJobSavedApi]
  );

  // Unsave a job
  const unsaveJob = useCallback(
    async (jobId: string) => {
      dispatch(setSavedJobLoading(true));
      // Optimistically update UI
      dispatch(toggleSaveStatus({ jobId, isSaved: false }));

      const result = await unsaveJobApi.execute(
        () => savedJobService.unsaveJob(jobId),
        () => {
          dispatch(removeSavedJob(jobId));
          dispatch(setSavedJobLoading(false));
        }
      );
      if (result && !result.success) {
        // Revert optimistic update
        dispatch(toggleSaveStatus({ jobId, isSaved: true }));
        dispatch(setSavedJobError(result.error || "Failed to unsave job"));
        dispatch(setSavedJobLoading(false));
      }
      return result;
    },
    [dispatch, unsaveJobApi]
  );

  // Get saved job count
  const getSavedJobCount = useCallback(async () => {
    dispatch(setSavedJobLoading(true));
    const result = await getSavedJobCountApi.execute(
      () => savedJobService.getSavedJobCount(),
      () => {
        dispatch(setSavedJobLoading(false));
      }
    );
    if (result && !result.success) {
      dispatch(
        setSavedJobError(result.error || "Failed to get saved job count")
      );
      dispatch(setSavedJobLoading(false));
    }
    return result && result.data ? result.data.count : 0;
  }, [dispatch, getSavedJobCountApi]);

  // Toggle job save status
  const toggleJobSave = useCallback(
    async (jobId: string, currentlySaved: boolean) => {
      if (currentlySaved) {
        return unsaveJob(jobId);
      } else {
        return saveJob(jobId);
      }
    },
    [saveJob, unsaveJob]
  );

  // Clear saved jobs state
  const clearSavedJobs = useCallback(() => {
    dispatch(resetSavedJobs());
  }, [dispatch]);

  return {
    // State
    savedJobs,
    loading,
    error,

    // Methods
    fetchSavedJobs,
    saveJob,
    unsaveJob,
    checkIfJobSaved,
    getSavedJobCount,
    toggleJobSave,
    clearSavedJobs,
  };
};

export default useSavedJob;
