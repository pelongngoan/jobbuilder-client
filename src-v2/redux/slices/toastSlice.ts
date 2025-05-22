import { createSlice } from "@reduxjs/toolkit";

export interface ToastState {
  message: string | null;
  type: "success" | "error" | "warning" | "info";
}

const toastSlice = createSlice({
  name: "toast",
  initialState: {
    message: null,
    type: "success",
  },
  reducers: {
    setToast: (state, action) => {
      state.message = action.payload.message;
      state.type = action.payload.type;
    },
    clearToast: (state) => {
      state.message = null;
      state.type = "success";
    },
  },
});
export const { setToast, clearToast } = toastSlice.actions;
export default toastSlice.reducer;
