import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Category } from "../../types/category.types";

// Define category state structure
interface CategoryState {
  categories: Category[];
  currentCategory: Category | null;
}

const initialState: CategoryState = {
  categories: [],
  currentCategory: null,
};

// Create the category slice
const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    setCategories: (state, action: PayloadAction<Category[]>) => {
      state.categories = action.payload;
    },
    setCurrentCategory: (state, action: PayloadAction<Category>) => {
      state.currentCategory = action.payload;
    },
  },
});

// Export actions and reducer
export const { setCategories, setCurrentCategory } = categorySlice.actions;

export default categorySlice.reducer;
