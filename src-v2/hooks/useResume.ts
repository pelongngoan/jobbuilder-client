import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../redux/store";
import {
  setResumeLoading,
  setResumeError,
  setResumes,
  addResume,
  updateResume,
  deleteResume,
  setCurrentResume,
  updateResumeContent,
  resetResumes,
} from "../redux/slices/resumeSlice";
import { resumeService } from "../services";
import { Resume, ResumeRequest, ResumeUpdateRequest } from "../types";

/**
 * Hook for managing resume-related actions
 */
const useResume = () => {
  const dispatch = useAppDispatch();
  const { resumes, currentResume, loading, error } = useAppSelector(
    (state) => state.resume
  );

  // API loading states
  const getResumesApi = useApiCall("getResumes");
  const getResumeApi = useApiCall("getResume");
  const getDefaultResumeApi = useApiCall("getDefaultResume");
  const createResumeApi = useApiCall("createResume");
  const updateResumeApi = useApiCall("updateResume");
  const deleteResumeApi = useApiCall("deleteResume");
  const setDefaultResumeApi = useApiCall("setDefaultResume");
  const uploadResumeFileApi = useApiCall("uploadResumeFile");
  const parseResumeFromFileApi = useApiCall("parseResumeFromFile");

  // Fetch all resumes
  const fetchResumes = useCallback(
    async (page = 1, limit = 10) => {
      dispatch(setResumeLoading(true));
      const result = await getResumesApi.execute(
        () => resumeService.getResumes(page, limit),
        (data) => {
          if (data.items) {
            dispatch(setResumes(data.items));
          }
          dispatch(setResumeLoading(false));
        }
      );
      if (result && !result.success) {
        dispatch(setResumeError(result.error || "Failed to fetch resumes"));
        dispatch(setResumeLoading(false));
      }
      return result;
    },
    [dispatch, getResumesApi]
  );

  // Fetch a specific resume by ID
  const fetchResume = useCallback(
    async (resumeId: string) => {
      dispatch(setResumeLoading(true));
      const result = await getResumeApi.execute(
        () => resumeService.getResumeById(resumeId),
        (data) => {
          if (data && data.data) {
            dispatch(updateResume(data.data));
            dispatch(setCurrentResume(data.data));
          }
          dispatch(setResumeLoading(false));
        }
      );
      if (result && !result.success) {
        dispatch(setResumeError(result.error || "Failed to fetch resume"));
        dispatch(setResumeLoading(false));
      }
      return result;
    },
    [dispatch, getResumeApi]
  );

  // Fetch default resume
  const fetchDefaultResume = useCallback(async () => {
    dispatch(setResumeLoading(true));
    const result = await getDefaultResumeApi.execute(
      () => resumeService.getDefaultResume(),
      (data) => {
        if (data && data.data) {
          dispatch(setCurrentResume(data.data));
        }
        dispatch(setResumeLoading(false));
      }
    );
    if (result && !result.success) {
      dispatch(
        setResumeError(result.error || "Failed to fetch default resume")
      );
      dispatch(setResumeLoading(false));
    }
    return result;
  }, [dispatch, getDefaultResumeApi]);

  // Create a new resume
  const createResume = useCallback(
    async (resumeData: ResumeRequest) => {
      dispatch(setResumeLoading(true));
      const result = await createResumeApi.execute(
        () => resumeService.createResume(resumeData),
        (data) => {
          if (data && data.data) {
            dispatch(addResume(data.data));
            dispatch(setCurrentResume(data.data));
          }
          dispatch(setResumeLoading(false));
        }
      );
      if (result && !result.success) {
        dispatch(setResumeError(result.error || "Failed to create resume"));
        dispatch(setResumeLoading(false));
      }
      return result;
    },
    [dispatch, createResumeApi]
  );

  // Update a resume
  const updateResumeData = useCallback(
    async (resumeId: string, resumeData: ResumeUpdateRequest) => {
      dispatch(setResumeLoading(true));
      const result = await updateResumeApi.execute(
        () => resumeService.updateResume(resumeId, resumeData),
        (data) => {
          if (data && data.data) {
            dispatch(updateResume(data.data));
            // Update currentResume if it's the same resume
            if (currentResume && currentResume._id === data.data._id) {
              dispatch(setCurrentResume(data.data));
            }
          }
          dispatch(setResumeLoading(false));
        }
      );
      if (result && !result.success) {
        dispatch(setResumeError(result.error || "Failed to update resume"));
        dispatch(setResumeLoading(false));
      }
      return result;
    },
    [dispatch, updateResumeApi, currentResume]
  );

  // Delete a resume
  const removeResume = useCallback(
    async (resumeId: string) => {
      dispatch(setResumeLoading(true));
      const result = await deleteResumeApi.execute(
        () => resumeService.deleteResume(resumeId),
        () => {
          dispatch(deleteResume(resumeId));
          dispatch(setResumeLoading(false));
        }
      );
      if (result && !result.success) {
        dispatch(setResumeError(result.error || "Failed to delete resume"));
        dispatch(setResumeLoading(false));
      }
      return result;
    },
    [dispatch, deleteResumeApi]
  );

  // Set a resume as default
  const setDefaultResume = useCallback(
    async (resumeId: string) => {
      dispatch(setResumeLoading(true));
      const result = await setDefaultResumeApi.execute(
        () => resumeService.setDefaultResume(resumeId),
        (data) => {
          if (data && data.data) {
            dispatch(updateResume(data.data));
            if (currentResume && currentResume._id === data.data._id) {
              dispatch(setCurrentResume(data.data));
            }
          }
          dispatch(setResumeLoading(false));
        }
      );
      if (result && !result.success) {
        dispatch(
          setResumeError(result.error || "Failed to set default resume")
        );
        dispatch(setResumeLoading(false));
      }
      return result;
    },
    [dispatch, setDefaultResumeApi, currentResume]
  );

  // Upload a resume file
  const uploadResumeFile = useCallback(
    async (file: File, title: string) => {
      dispatch(setResumeLoading(true));
      const result = await uploadResumeFileApi.execute(
        () => resumeService.uploadResumeFile(file, title),
        (data) => {
          if (data && data.data) {
            dispatch(addResume(data.data));
            dispatch(setCurrentResume(data.data));
          }
          dispatch(setResumeLoading(false));
        }
      );
      if (result && !result.success) {
        dispatch(setResumeError(result.error || "Failed to upload resume"));
        dispatch(setResumeLoading(false));
      }
      return result;
    },
    [dispatch, uploadResumeFileApi]
  );

  // Parse resume from file
  const parseResumeFromFile = useCallback(
    async (file: File) => {
      dispatch(setResumeLoading(true));
      const result = await parseResumeFromFileApi.execute(
        () => resumeService.parseResumeFromFile(file),
        () => {
          dispatch(setResumeLoading(false));
        }
      );
      if (result && !result.success) {
        dispatch(setResumeError(result.error || "Failed to parse resume"));
        dispatch(setResumeLoading(false));
      }
      return result;
    },
    [dispatch, parseResumeFromFileApi]
  );

  // Generate PDF from resume
  const generateResumePDF = useCallback(
    async (resumeId: string, template: string = "default") => {
      dispatch(setResumeLoading(true));
      try {
        await resumeService.generateResumePDF(resumeId, template);
        dispatch(setResumeLoading(false));
        return { success: true };
      } catch (error) {
        dispatch(setResumeError("Failed to generate PDF"));
        dispatch(setResumeLoading(false));
        return { success: false, error: "Failed to generate PDF" };
      }
    },
    [dispatch]
  );

  // Set the current resume for editing
  const selectResume = useCallback(
    (resume: Resume | null) => {
      dispatch(setCurrentResume(resume));
    },
    [dispatch]
  );

  // Update a section in the current resume
  const updateResumeSection = useCallback(
    (field: keyof Resume["content"], data: unknown) => {
      dispatch(updateResumeContent({ field, data }));
    },
    [dispatch]
  );

  // Clear all resume data
  const clearResumes = useCallback(() => {
    dispatch(resetResumes());
  }, [dispatch]);

  return {
    // State
    resumes,
    currentResume,
    loading,
    error,

    // Methods
    fetchResumes,
    fetchResume,
    fetchDefaultResume,
    createResume,
    updateResume: updateResumeData,
    deleteResume: removeResume,
    setDefaultResume,
    uploadResumeFile,
    parseResumeFromFile,
    generateResumePDF,
    selectResume,
    updateResumeSection,
    clearResumes,
  };
};

export default useResume;
