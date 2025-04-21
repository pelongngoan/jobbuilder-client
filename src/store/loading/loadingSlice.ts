import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface LoadingState {
  loading: boolean;
}

const initialState: LoadingState = {
  loading: false,
};

const loadingSlice = createSlice({
  name: "loading",
  initialState,
  reducers: {
    toggleLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { toggleLoading } = loadingSlice.actions;
export default loadingSlice.reducer;
