import { useAppDispatch, useAppSelector } from "../redux/store";
import {
  setApplications,
  setCurrentApplication,
} from "../redux/slices/applicationSlice";
import { setToast } from "../redux/slices/toastSlice";
import { ApplicationStatus } from "../types/application.types";
import applicationService from "../services/application";

export const useApplication = () => {
  const dispatch = useAppDispatch();
  const { applications, currentApplication } = useAppSelector(
    (state) => state.application
  );

  const getUserApplications = async () => {
    const response = await applicationService.getUserApplications();
    if (response.success) {
      dispatch(setApplications(response.data));
    }

    return response.data;
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
    status: ApplicationStatus,
    interviewerId?: string
  ) => {
    const response = await applicationService.updateApplicationStatus(
      applicationId,
      status,
      interviewerId
    );
    if (response.success) {
      dispatch(setToast({ message: response.message, type: "success" }));
    }
    return response;
  };

  const getJobApplications = async (jobId: string) => {
    const response = await applicationService.getJobApplications(jobId);
    dispatch(setApplications(response.data));
  };

  // Manager-specific methods
  const getCompanyApplications = async (
    companyId: string,
    page = 1,
    limit = 10,
    search = ""
  ) => {
    const response = await applicationService.getCompanyApplications(
      companyId,
      page,
      limit,
      search
    );
    dispatch(setApplications(response.data));
    return response;
  };

  const getStaffApplications = async ({
    staffId,
    page = 1,
    limit = 10,
  }: {
    staffId: string;
    page?: number;
    limit?: number;
    search?: string;
  }) => {
    const response = await applicationService.getStaffApplications({
      staffId,
      page,
      limit,
    });
    console.log(response.data);
    dispatch(setApplications(response.data));
    console.log(applications);
    return response;
  };

  const searchApplications = async (query: string, page = 1, limit = 10) => {
    const response = await applicationService.searchApplications(
      query,
      page,
      limit
    );
    dispatch(setApplications(response.data));
    return response;
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
    // Manager methods
    getCompanyApplications,
    getStaffApplications,
    searchApplications,
  };
};
