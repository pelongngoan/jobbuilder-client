import { useDispatch, useSelector } from "react-redux";
import { setResumes, setCurrentResume } from "../redux/slices/resumeSlice";
import { RootState } from "../redux/store";
import resumeService from "../services/resumeService";
import { Resume } from "../types";
import { useCallback } from "react";
export const useResume = () => {
  const dispatch = useDispatch();
  const { resumes, currentResume } = useSelector(
    (state: RootState) => state.resume
  );

  const fetchResumes = useCallback(async () => {
    const response = await resumeService.getResumes();
    if (response.success && response.data) {
      dispatch(setResumes(response.data));
    }
  }, [dispatch]);
  const createResume = useCallback(
    async (resume: Resume) => {
      const response = await resumeService.createResume(resume);
      if (response.success && response.data) {
        dispatch(setResumes(response.data));
      }
    },
    [dispatch]
  );
  const updateResume = useCallback(
    async (resume: Resume) => {
      const response = await resumeService.updateResume(resume._id, resume);
      if (response.success && response.data) {
        dispatch(setResumes(response.data));
      }
    },
    [dispatch]
  );
  const deleteResume = useCallback(
    async (id: string) => {
      const response = await resumeService.deleteResume(id);
      if (response.success && response.data) {
        dispatch(setResumes(response.data));
      }
    },
    [dispatch]
  );
  const getResumeById = useCallback(
    async (id: string) => {
      const response = await resumeService.getResumeById(id);
      if (response.success && response.data) {
        dispatch(setCurrentResume(response.data));
      }
    },
    [dispatch]
  );
  const uploadResumeFile = useCallback(
    async (file: File, title: string) => {
      const response = await resumeService.uploadResumeFile(file, title);
      if (response.success && response.data) {
        // Nếu response.data là 1 resume object
        dispatch(setResumes([...resumes, response.data]));
        console.log(resumes);
      }
    },
    [dispatch, resumes]
  );

  return {
    resumes,
    currentResume,
    fetchResumes,
    createResume,
    updateResume,
    deleteResume,
    getResumeById,
    uploadResumeFile,
  };
};
