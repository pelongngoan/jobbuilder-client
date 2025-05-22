import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { setToast } from "../redux/slices/toastSlice";
import saveJobService from "../services/saveJob";
import {
  addSavedJob,
  removeSavedJob,
  setSavedJobs,
} from "../redux/slices/saveJobSlice";
export const useSaveJob = () => {
  const dispatch = useAppDispatch();
  const { savedJobs } = useAppSelector((state) => state.saveJob);

  const saveJob = useCallback(
    async (jobId: string) => {
      const response = await saveJobService.saveJob(jobId);
      if (response.success) {
        dispatch(setToast({ message: response.message, type: "success" }));
        dispatch(addSavedJob(response.data));
      }
    },
    [dispatch]
  );

  const deleteSavedJob = useCallback(
    async (jobId: string) => {
      const response = await saveJobService.deleteSavedJob(jobId);
      if (response.success) {
        dispatch(setToast({ message: response.message, type: "success" }));
        dispatch(removeSavedJob(jobId));
      }
    },
    [dispatch]
  );

  const getSavedJobs = useCallback(async () => {
    const response = await saveJobService.getSavedJobs();
    if (response.success) {
      dispatch(setSavedJobs(response.data));
    }
  }, [dispatch]);

  return { saveJob, deleteSavedJob, getSavedJobs, savedJobs };
};
