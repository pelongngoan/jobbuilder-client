import { useAppDispatch, useAppSelector } from "../redux/store";
import {
  setCategories,
  setCurrentCategory,
} from "../redux/slices/categorySlice";
import { Category } from "../types/category.types";
import { categoryService } from "../services";
import { setTotalPages } from "../redux/slices/paginationSlice";
import toast from "react-hot-toast";

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
      toast.success("Category created successfully");
      return response.data;
    }
    toast.error("Failed to create category");
    return null;
  };

  const updateCategory = async (data: Category) => {
    if (!data._id) return null;

    const response = await categoryService.updateCategory(data._id, data);
    if (response.success) {
      toast.success("Category updated successfully");
      return response.data;
    }
    toast.error("Failed to update category");
    return null;
  };

  const deleteCategory = async (id: string) => {
    const response = await categoryService.deleteCategory(id);
    if (response.success) {
      toast.success("Category deleted successfully");
      return true;
    }
    toast.error("Failed to delete category");
    return false;
  };

  const importCategories = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await categoryService.importCategoriesFromCSV(formData);
    if (response?.errors) {
      toast.error("Error importing categories");
    } else {
      toast.success("Categories imported successfully");
    }
    return response.data;
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
