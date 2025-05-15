import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../redux/store";
import {
  setApplicationLoading,
  setApplicationError,
  setApplications,
  addApplication,
  updateApplication,
  deleteApplication,
  setCurrentApplication,
  resetApplications,
} from "../redux/slices/applicationSlice";
import { applicationService } from "../services";
import {
  Application,
  ApplicationRequest,
  ApplicationUpdateRequest,
} from "../types";

/**
 * Hook for managing job application-related actions
 */
const useApplication = () => {
  const dispatch = useAppDispatch();
  const { applications, currentApplication, loading, error } = useAppSelector(
    (state) => state.application
  );

  // API loading states
  const getApplicationsApi = useApiCall("getApplications");
  const getApplicationApi = useApiCall("getApplication");
  const createApplicationApi = useApiCall("createApplication");
  const updateApplicationApi = useApiCall("updateApplication");
  const deleteApplicationApi = useApiCall("deleteApplication");

  // Fetch all applications for the user
  const fetchApplications = useCallback(async () => {
    dispatch(setApplicationLoading(true));
    const result = await getApplicationsApi.execute(
      () => applicationService.getUserApplications(),
      (data) => {
        dispatch(setApplications(data));
        dispatch(setApplicationLoading(false));
      }
    );
    if (!result.success) {
      dispatch(setApplicationError(result.error));
      dispatch(setApplicationLoading(false));
    }
    return result;
  }, [dispatch, getApplicationsApi]);

  // Fetch a specific application by ID
  const fetchApplication = useCallback(
    async (applicationId: string) => {
      dispatch(setApplicationLoading(true));
      const result = await getApplicationApi.execute(
        () => applicationService.getApplicationById(applicationId),
        (data) => {
          dispatch(updateApplication(data));
          dispatch(setCurrentApplication(data));
          dispatch(setApplicationLoading(false));
        }
      );
      if (!result.success) {
        dispatch(setApplicationError(result.error));
        dispatch(setApplicationLoading(false));
      }
      return result;
    },
    [dispatch, getApplicationApi]
  );

  // Create a new application
  const createApplication = useCallback(
    async (applicationData: ApplicationRequest) => {
      dispatch(setApplicationLoading(true));
      const result = await createApplicationApi.execute(
        () => applicationService.createApplication(applicationData),
        (data) => {
          dispatch(addApplication(data));
          dispatch(setCurrentApplication(data));
          dispatch(setApplicationLoading(false));
        }
      );
      if (!result.success) {
        dispatch(setApplicationError(result.error));
        dispatch(setApplicationLoading(false));
      }
      return result;
    },
    [dispatch, createApplicationApi]
  );

  // Update an application
  const updateApplicationData = useCallback(
    async (
      applicationId: string,
      applicationData: ApplicationUpdateRequest
    ) => {
      dispatch(setApplicationLoading(true));
      const result = await updateApplicationApi.execute(
        () =>
          applicationService.updateApplication(applicationId, applicationData),
        (data) => {
          dispatch(updateApplication(data));
          // Update currentApplication if it's the same application
          if (currentApplication && currentApplication._id === data._id) {
            dispatch(setCurrentApplication(data));
          }
          dispatch(setApplicationLoading(false));
        }
      );
      if (!result.success) {
        dispatch(setApplicationError(result.error));
        dispatch(setApplicationLoading(false));
      }
      return result;
    },
    [dispatch, updateApplicationApi, currentApplication]
  );

  // Delete an application
  const removeApplication = useCallback(
    async (applicationId: string) => {
      dispatch(setApplicationLoading(true));
      const result = await deleteApplicationApi.execute(
        () => applicationService.deleteApplication(applicationId),
        () => {
          dispatch(deleteApplication(applicationId));
          dispatch(setApplicationLoading(false));
        }
      );
      if (!result.success) {
        dispatch(setApplicationError(result.error));
        dispatch(setApplicationLoading(false));
      }
      return result;
    },
    [dispatch, deleteApplicationApi]
  );

  // Set the current application for viewing
  const selectApplication = useCallback(
    (application: Application | null) => {
      dispatch(setCurrentApplication(application));
    },
    [dispatch]
  );

  // Clear all application data
  const clearApplications = useCallback(() => {
    dispatch(resetApplications());
  }, [dispatch]);

  // Fetch applications for a specific job
  const fetchJobApplications = useCallback(
    async (jobId: string) => {
      dispatch(setApplicationLoading(true));
      const result = await getApplicationsApi.execute(
        () => applicationService.getJobApplications(jobId),
        (data) => {
          dispatch(setApplications(data));
          dispatch(setApplicationLoading(false));
        }
      );
      if (!result.success) {
        dispatch(setApplicationError(result.error));
        dispatch(setApplicationLoading(false));
      }
      return result;
    },
    [dispatch, getApplicationsApi]
  );

  return {
    // State
    applications,
    currentApplication,
    loading,
    error,

    // Methods
    fetchApplications,
    fetchApplication,
    createApplication,
    updateApplication: updateApplicationData,
    deleteApplication: removeApplication,
    selectApplication,
    clearApplications,
    fetchJobApplications,
  };
};

export default useApplication;
