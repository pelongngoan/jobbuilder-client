import { useAppDispatch, useAppSelector } from "../redux/store";
import {
  setApplications,
  setCurrentApplication,
} from "../redux/slices/applicationSlice";
import applicationService from "../services/application";

export const useApplication = () => {
  const dispatch = useAppDispatch();
  const { applications, currentApplication } = useAppSelector(
    (state) => state.application
  );

  const getUserApplications = async () => {
    const response = await applicationService.getUserApplications();
    dispatch(setApplications(response.data));
  };

  const applyForJob = async (jobId: string, resumeId: string) => {
    const response = await applicationService.applyForJob(jobId, resumeId);
    dispatch(setCurrentApplication(response.data));
  };

  const deleteApplication = async (applicationId: string) => {
    const response = await applicationService.deleteApplication(applicationId);
    dispatch(setCurrentApplication(response.data));
  };

  const getApplicationById = async (applicationId: string) => {
    const response = await applicationService.getApplicationById(applicationId);
    dispatch(setCurrentApplication(response.data));
  };

  const updateApplicationStatus = async (
    applicationId: string,
    status: string
  ) => {
    const response = await applicationService.updateApplicationStatus(
      applicationId,
      status
    );
    dispatch(setCurrentApplication(response.data));
  };

  const getJobApplications = async (jobId: string) => {
    const response = await applicationService.getJobApplications(jobId);
    dispatch(setApplications(response.data));
  };

  return {
    applications,
    currentApplication,
    getUserApplications,
    applyForJob,
    deleteApplication,
    getApplicationById,
    updateApplicationStatus,
    getJobApplications,
  };
};
