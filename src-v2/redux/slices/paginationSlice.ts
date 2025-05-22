import { createSlice } from "@reduxjs/toolkit";
interface PaginationState {
  page: number;
  limit: number;
  totalPages: number;
}

const initialState: PaginationState = {
  page: 1,
  limit: 10,
  totalPages: 0,
};
const paginationSlice = createSlice({
  name: "pagination",
  initialState,
  reducers: {
    setPage: (state, action) => {
      state.page = action.payload;
    },
    setLimit: (state, action) => {
      state.limit = action.payload;
    },
    setTotalPages: (state, action) => {
      state.totalPages = action.payload;
    },
  },
});

export const { setPage, setLimit, setTotalPages } = paginationSlice.actions;
export default paginationSlice.reducer;
