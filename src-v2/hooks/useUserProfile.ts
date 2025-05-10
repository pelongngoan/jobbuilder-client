import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../redux/store";
import {
  setUserProfile,
  updateUserProfile,
  clearUserProfile,
} from "../redux/slices/userSlice";
import userProfileService from "../services/userProfileService";
import {
  UserProfileUpdateRequest,
  UserExperience,
  UserEducation,
  UserCertification,
  UserPortfolioProject,
  UserSocialMedia,
  JobSearchPreferences,
} from "../types";
import useApiCall from "./useApiCall";

/**
 * Hook for managing user profile data and API calls
 */
export function useUserProfile() {
  const dispatch = useAppDispatch();
  const profile = useAppSelector((state) => state.user.userProfile);

  // API loading states
  const getProfileApi = useApiCall("getUserProfile");
  const updateProfileApi = useApiCall("updateUserProfile");
  const addExperienceApi = useApiCall("addExperience");
  const updateExperienceApi = useApiCall("updateExperience");
  const deleteExperienceApi = useApiCall("deleteExperience");
  const addEducationApi = useApiCall("addEducation");
  const updateEducationApi = useApiCall("updateEducation");
  const deleteEducationApi = useApiCall("deleteEducation");
  const addCertificationApi = useApiCall("addCertification");
  const updateCertificationApi = useApiCall("updateCertification");
  const deleteCertificationApi = useApiCall("deleteCertification");
  const addProjectApi = useApiCall("addProject");
  const updateProjectApi = useApiCall("updateProject");
  const deleteProjectApi = useApiCall("deleteProject");
  const updateSocialMediaApi = useApiCall("updateSocialMedia");
  const updateJobPreferencesApi = useApiCall("updateJobPreferences");

  // Fetch user profile
  const fetchUserProfile = useCallback(async () => {
    const result = await getProfileApi.execute(
      () => userProfileService.getMyUserProfile(),
      (data) => {
        if (data.success && data.data) {
          dispatch(setUserProfile(data.data));
        }
      }
    );
    return result;
  }, [dispatch, getProfileApi]);

  // Update user profile
  const updateProfile = useCallback(
    async (profileData: UserProfileUpdateRequest) => {
      const result = await updateProfileApi.execute(
        () => userProfileService.updateUserProfile(profileData),
        (data) => {
          if (data.success && data.data) {
            dispatch(updateUserProfile(data.data));
          }
        }
      );
      return result;
    },
    [dispatch, updateProfileApi]
  );

  // Add experience
  const addExperience = useCallback(
    async (experienceData: UserExperience) => {
      const result = await addExperienceApi.execute(
        () => userProfileService.addExperience(experienceData),
        (data) => {
          if (data.success && data.data) {
            dispatch(updateUserProfile(data.data));
          }
        }
      );
      return result;
    },
    [dispatch, addExperienceApi]
  );

  // Update experience
  const updateExperience = useCallback(
    async (experienceId: string, experienceData: Partial<UserExperience>) => {
      const result = await updateExperienceApi.execute(
        () => userProfileService.updateExperience(experienceId, experienceData),
        (data) => {
          if (data.success && data.data) {
            dispatch(updateUserProfile(data.data));
          }
        }
      );
      return result;
    },
    [dispatch, updateExperienceApi]
  );

  // Delete experience
  const deleteExperience = useCallback(
    async (experienceId: string) => {
      const result = await deleteExperienceApi.execute(
        () => userProfileService.deleteExperience(experienceId),
        (data) => {
          if (data.success && data.data) {
            dispatch(updateUserProfile(data.data));
          }
        }
      );
      return result;
    },
    [dispatch, deleteExperienceApi]
  );

  // Add education
  const addEducation = useCallback(
    async (educationData: UserEducation) => {
      const result = await addEducationApi.execute(
        () => userProfileService.addEducation(educationData),
        (data) => {
          if (data.success && data.data) {
            dispatch(updateUserProfile(data.data));
          }
        }
      );
      return result;
    },
    [dispatch, addEducationApi]
  );

  // Update education
  const updateEducation = useCallback(
    async (educationId: string, educationData: Partial<UserEducation>) => {
      const result = await updateEducationApi.execute(
        () => userProfileService.updateEducation(educationId, educationData),
        (data) => {
          if (data.success && data.data) {
            dispatch(updateUserProfile(data.data));
          }
        }
      );
      return result;
    },
    [dispatch, updateEducationApi]
  );

  // Delete education
  const deleteEducation = useCallback(
    async (educationId: string) => {
      const result = await deleteEducationApi.execute(
        () => userProfileService.deleteEducation(educationId),
        (data) => {
          if (data.success && data.data) {
            dispatch(updateUserProfile(data.data));
          }
        }
      );
      return result;
    },
    [dispatch, deleteEducationApi]
  );

  // Add certification
  const addCertification = useCallback(
    async (certificationData: UserCertification) => {
      const result = await addCertificationApi.execute(
        () => userProfileService.addCertification(certificationData),
        (data) => {
          if (data.success && data.data) {
            dispatch(updateUserProfile(data.data));
          }
        }
      );
      return result;
    },
    [dispatch, addCertificationApi]
  );

  // Update certification
  const updateCertification = useCallback(
    async (
      certificationId: string,
      certificationData: Partial<UserCertification>
    ) => {
      const result = await updateCertificationApi.execute(
        () =>
          userProfileService.updateCertification(
            certificationId,
            certificationData
          ),
        (data) => {
          if (data.success && data.data) {
            dispatch(updateUserProfile(data.data));
          }
        }
      );
      return result;
    },
    [dispatch, updateCertificationApi]
  );

  // Delete certification
  const deleteCertification = useCallback(
    async (certificationId: string) => {
      const result = await deleteCertificationApi.execute(
        () => userProfileService.deleteCertification(certificationId),
        (data) => {
          if (data.success && data.data) {
            dispatch(updateUserProfile(data.data));
          }
        }
      );
      return result;
    },
    [dispatch, deleteCertificationApi]
  );

  // Add project
  const addProject = useCallback(
    async (projectData: UserPortfolioProject) => {
      const result = await addProjectApi.execute(
        () => userProfileService.addProject(projectData),
        (data) => {
          if (data.success && data.data) {
            dispatch(updateUserProfile(data.data));
          }
        }
      );
      return result;
    },
    [dispatch, addProjectApi]
  );

  // Update project
  const updateProject = useCallback(
    async (projectId: string, projectData: Partial<UserPortfolioProject>) => {
      const result = await updateProjectApi.execute(
        () => userProfileService.updateProject(projectId, projectData),
        (data) => {
          if (data.success && data.data) {
            dispatch(updateUserProfile(data.data));
          }
        }
      );
      return result;
    },
    [dispatch, updateProjectApi]
  );

  // Delete project
  const deleteProject = useCallback(
    async (projectId: string) => {
      const result = await deleteProjectApi.execute(
        () => userProfileService.deleteProject(projectId),
        (data) => {
          if (data.success && data.data) {
            dispatch(updateUserProfile(data.data));
          }
        }
      );
      return result;
    },
    [dispatch, deleteProjectApi]
  );

  // Update social media
  const updateSocialMedia = useCallback(
    async (socialMediaData: UserSocialMedia) => {
      const result = await updateSocialMediaApi.execute(
        () => userProfileService.updateSocialMedia(socialMediaData),
        (data) => {
          if (data.success && data.data) {
            dispatch(updateUserProfile(data.data));
          }
        }
      );
      return result;
    },
    [dispatch, updateSocialMediaApi]
  );

  // Update job preferences
  const updateJobPreferences = useCallback(
    async (preferences: Partial<JobSearchPreferences>) => {
      const result = await updateJobPreferencesApi.execute(
        () => userProfileService.updateJobSearchPreferences(preferences),
        (data) => {
          if (data.success && data.data) {
            dispatch(updateUserProfile(data.data));
          }
        }
      );
      return result;
    },
    [dispatch, updateJobPreferencesApi]
  );

  return {
    profile,
    loading: {
      getProfile: getProfileApi.error !== null,
      updateProfile: updateProfileApi.error !== null,
      addExperience: addExperienceApi.error !== null,
      updateExperience: updateExperienceApi.error !== null,
      deleteExperience: deleteExperienceApi.error !== null,
      addEducation: addEducationApi.error !== null,
      updateEducation: updateEducationApi.error !== null,
      deleteEducation: deleteEducationApi.error !== null,
      addCertification: addCertificationApi.error !== null,
      updateCertification: updateCertificationApi.error !== null,
      deleteCertification: deleteCertificationApi.error !== null,
      addProject: addProjectApi.error !== null,
      updateProject: updateProjectApi.error !== null,
      deleteProject: deleteProjectApi.error !== null,
      updateSocialMedia: updateSocialMediaApi.error !== null,
      updateJobPreferences: updateJobPreferencesApi.error !== null,
    },
    error: {
      getProfile: getProfileApi.error,
      updateProfile: updateProfileApi.error,
      addExperience: addExperienceApi.error,
      updateExperience: updateExperienceApi.error,
      deleteExperience: deleteExperienceApi.error,
      addEducation: addEducationApi.error,
      updateEducation: updateEducationApi.error,
      deleteEducation: deleteEducationApi.error,
      addCertification: addCertificationApi.error,
      updateCertification: updateCertificationApi.error,
      deleteCertification: deleteCertificationApi.error,
      addProject: addProjectApi.error,
      updateProject: updateProjectApi.error,
      deleteProject: deleteProjectApi.error,
      updateSocialMedia: updateSocialMediaApi.error,
      updateJobPreferences: updateJobPreferencesApi.error,
    },
    fetchUserProfile,
    updateProfile,
    addExperience,
    updateExperience,
    deleteExperience,
    addEducation,
    updateEducation,
    deleteEducation,
    addCertification,
    updateCertification,
    deleteCertification,
    addProject,
    updateProject,
    deleteProject,
    updateSocialMedia,
    updateJobPreferences,
    // Clear profile data on logout
    clearProfile: useCallback(() => {
      dispatch(clearUserProfile());
    }, [dispatch]),
  };
}

export default useUserProfile;
