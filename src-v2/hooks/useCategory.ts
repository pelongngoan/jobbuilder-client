import { useAppDispatch, useAppSelector } from "../redux/store";
import {
  setCategories,
  setCurrentCategory,
} from "../redux/slices/categorySlice";
import { Category } from "../types/category.types";
import { categoryService } from "../services";
import { setToast } from "../redux/slices/toastSlice";
import { setTotalPages } from "../redux/slices/paginationSlice";

export const useCategory = () => {
  const dispatch = useAppDispatch();
  const { categories, currentCategory } = useAppSelector(
    (state) => state.category
  );

  const getCategories = async (page: number, limit: number) => {
    const response = await categoryService.getCategories({
      page,
      limit,
    });
    if (response.success && response.data && response.pagination) {
      dispatch(setCategories(response.data as unknown as Category[]));
      dispatch(setTotalPages(response.pagination?.pages || 0));
    }
  };

  const getCategoryById = async (id: string) => {
    const response = await categoryService.getCategoryById(id);
    if (response.success && response.data) {
      dispatch(setCurrentCategory(response.data as unknown as Category));
      return response.data;
    }
    return null;
  };

  const createCategory = async (data: Category) => {
    const response = await categoryService.createCategory(data);
    if (response.success) {
      dispatch(
        setToast({ message: "Category created successfully", type: "success" })
      );
      return response.data;
    }
    dispatch(setToast({ message: "Failed to create category", type: "error" }));
    return null;
  };

  const updateCategory = async (data: Category) => {
    if (!data._id) return null;

    const response = await categoryService.updateCategory(data._id, data);
    if (response.success) {
      dispatch(
        setToast({ message: "Category updated successfully", type: "success" })
      );
      return response.data;
    }
    dispatch(setToast({ message: "Failed to update category", type: "error" }));
    return null;
  };

  const deleteCategory = async (id: string) => {
    const response = await categoryService.deleteCategory(id);
    if (response.success) {
      dispatch(
        setToast({ message: "Category deleted successfully", type: "success" })
      );
      return true;
    }
    dispatch(setToast({ message: "Failed to delete category", type: "error" }));
    return false;
  };

  const importCategories = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await categoryService.importCategoriesFromCSV(formData);
    if (response.success) {
      dispatch(
        setToast({
          message: `Successfully imported ${response.data?.successCount} categories`,
          type: "success",
        })
      );
      return response.data;
    }
    dispatch(
      setToast({ message: "Failed to import categories", type: "error" })
    );
    return null;
  };

  const searchCategories = async (
    query: string,
    page: number,
    limit: number
  ) => {
    const response = await categoryService.searchCategories({
      page,
      limit,
      query,
    });
    if (response.success && response.data && response.pagination) {
      dispatch(setCategories(response.data as unknown as Category[]));
      dispatch(setTotalPages(response.pagination?.pages || 0));
    }
  };
  return {
    getCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
    importCategories,
    categories,
    currentCategory,
    searchCategories,
  };
};
