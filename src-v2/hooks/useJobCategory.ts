import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../redux/store";
import {
  setJobCategoryLoading,
  setJobCategoryError,
  setJobCategories,
  addJobCategory,
  updateJobCategory,
  deleteJobCategory,
  resetJobCategories,
} from "../redux/slices/jobCategorySlice";
import { jobCategoryService } from "../services";
import { JobCategoryRequest } from "../types";

/**
 * Hook for managing job categories
 */
const useJobCategory = () => {
  const dispatch = useAppDispatch();
  const { jobCategories, loading, error } = useAppSelector(
    (state) => state.jobCategory
  );

  // API loading states
  const getJobCategoriesApi = useApiCall("getJobCategories");
  const getJobCategoryApi = useApiCall("getJobCategory");
  const createJobCategoryApi = useApiCall("createJobCategory");
  const updateJobCategoryApi = useApiCall("updateJobCategory");
  const deleteJobCategoryApi = useApiCall("deleteJobCategory");
  const getJobCategoryHierarchyApi = useApiCall("getJobCategoryHierarchy");

  // Fetch all job categories
  const fetchJobCategories = useCallback(async () => {
    dispatch(setJobCategoryLoading(true));
    const result = await getJobCategoriesApi.execute(
      () => jobCategoryService.getJobCategories(),
      (data) => {
        if (data.data) {
          dispatch(setJobCategories(data.data));
        }
        dispatch(setJobCategoryLoading(false));
      }
    );
    if (result && !result.success) {
      dispatch(
        setJobCategoryError(result.error || "Failed to fetch job categories")
      );
      dispatch(setJobCategoryLoading(false));
    }
    return result;
  }, [dispatch, getJobCategoriesApi]);

  // Fetch a specific job category by ID
  const fetchJobCategory = useCallback(
    async (categoryId: string) => {
      dispatch(setJobCategoryLoading(true));
      const result = await getJobCategoryApi.execute(
        () => jobCategoryService.getJobCategoryById(categoryId),
        (data) => {
          if (data.data) {
            dispatch(updateJobCategory(data.data));
          }
          dispatch(setJobCategoryLoading(false));
        }
      );
      if (result && !result.success) {
        dispatch(
          setJobCategoryError(result.error || "Failed to fetch job category")
        );
        dispatch(setJobCategoryLoading(false));
      }
      return result;
    },
    [dispatch, getJobCategoryApi]
  );

  // Create a new job category
  const createJobCategory = useCallback(
    async (categoryData: JobCategoryRequest) => {
      dispatch(setJobCategoryLoading(true));
      const result = await createJobCategoryApi.execute(
        () => jobCategoryService.createJobCategory(categoryData),
        (data) => {
          if (data.data) {
            dispatch(addJobCategory(data.data));
          }
          dispatch(setJobCategoryLoading(false));
        }
      );
      if (result && !result.success) {
        dispatch(
          setJobCategoryError(result.error || "Failed to create job category")
        );
        dispatch(setJobCategoryLoading(false));
      }
      return result;
    },
    [dispatch, createJobCategoryApi]
  );

  // Update a job category
  const updateJobCategoryData = useCallback(
    async (categoryId: string, categoryData: Partial<JobCategoryRequest>) => {
      dispatch(setJobCategoryLoading(true));
      const result = await updateJobCategoryApi.execute(
        () => jobCategoryService.updateJobCategory(categoryId, categoryData),
        (data) => {
          if (data.data) {
            dispatch(updateJobCategory(data.data));
          }
          dispatch(setJobCategoryLoading(false));
        }
      );
      if (result && !result.success) {
        dispatch(
          setJobCategoryError(result.error || "Failed to update job category")
        );
        dispatch(setJobCategoryLoading(false));
      }
      return result;
    },
    [dispatch, updateJobCategoryApi]
  );

  // Delete a job category
  const removeJobCategory = useCallback(
    async (categoryId: string) => {
      dispatch(setJobCategoryLoading(true));
      const result = await deleteJobCategoryApi.execute(
        () => jobCategoryService.deleteJobCategory(categoryId),
        () => {
          dispatch(deleteJobCategory(categoryId));
          dispatch(setJobCategoryLoading(false));
        }
      );
      if (result && !result.success) {
        dispatch(
          setJobCategoryError(result.error || "Failed to delete job category")
        );
        dispatch(setJobCategoryLoading(false));
      }
      return result;
    },
    [dispatch, deleteJobCategoryApi]
  );

  // Get job category hierarchy
  const getJobCategoryHierarchy = useCallback(async () => {
    dispatch(setJobCategoryLoading(true));
    const result = await getJobCategoryHierarchyApi.execute(
      () => jobCategoryService.getJobCategoryHierarchy(),
      () => {
        dispatch(setJobCategoryLoading(false));
      }
    );
    if (result && !result.success) {
      dispatch(
        setJobCategoryError(
          result.error || "Failed to fetch job category hierarchy"
        )
      );
      dispatch(setJobCategoryLoading(false));
    }
    return result && result.data ? result.data : [];
  }, [dispatch, getJobCategoryHierarchyApi]);

  // Clear job categories state
  const clearJobCategories = useCallback(() => {
    dispatch(resetJobCategories());
  }, [dispatch]);

  return {
    // State
    jobCategories,
    loading,
    error,

    // Methods
    fetchJobCategories,
    fetchJobCategory,
    createJobCategory,
    updateJobCategory: updateJobCategoryData,
    deleteJobCategory: removeJobCategory,
    getJobCategoryHierarchy,
    clearJobCategories,
  };
};

export default useJobCategory;
