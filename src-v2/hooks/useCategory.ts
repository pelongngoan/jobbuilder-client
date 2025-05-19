import { useAppDispatch, useAppSelector } from "../redux/store";
import {
  setCategories,
  setCurrentCategory,
} from "../redux/slices/categorySlice";
import { Category } from "../types/category.types";
import { categoryService } from "../services";
import { setToast } from "../redux/slices/toastSlice";

export const useCategory = () => {
  const dispatch = useAppDispatch();
  const { categories, currentCategory } = useAppSelector(
    (state) => state.category
  );

  const getCategories = async () => {
    const response = await categoryService.getCategories({
      page: 1,
      limit: 10,
    });
    if (response.success && response.data) {
      dispatch(setCategories(response.data as unknown as Category[]));
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
    if (response.success && response.data) {
      dispatch(setToast({ message: response.message, type: "success" }));
      return response.data;
    }
    return null;
  };

  return {
    getCategories,
    getCategoryById,
    createCategory,
    categories,
    currentCategory,
    setCurrentCategory,
  };
};
