import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define loading state structure
interface LoadingState {
  [key: string]: boolean;
}

const initialState: LoadingState = {};

// Create the loading slice
const loadingSlice = createSlice({
  name: "loading",
  initialState,
  reducers: {
    setLoading: (
      state,
      action: PayloadAction<{ key: string; isLoading: boolean }>
    ) => {
      const { key, isLoading } = action.payload;
      state[key] = isLoading;
    },
    clearLoading: (state, action: PayloadAction<string>) => {
      delete state[action.payload];
    },
    clearAllLoading: () => {
      return {};
    },
  },
});

// Export actions and reducer
export const { setLoading, clearLoading, clearAllLoading } =
  loadingSlice.actions;
export default loadingSlice.reducer;
