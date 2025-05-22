import { createSlice } from "@reduxjs/toolkit";
import { StaffProfile } from "../../types/staff.types";

interface StaffState {
  staffs: StaffProfile[];
  currentStaff: StaffProfile | null;
}

const initialState: StaffState = {
  staffs: [],
  currentStaff: null,
};

const staffSlice = createSlice({
  name: "staff",
  initialState,
  reducers: {
    setStaffs: (state, action) => {
      state.staffs = action.payload;
    },
    setCurrentStaff: (state, action) => {
      state.currentStaff = action.payload;
    },
    clearCurrentStaff: (state) => {
      state.currentStaff = null;
    },
    clearStaffs: (state) => {
      state.staffs = [];
    },
  },
});

export const { setStaffs, setCurrentStaff, clearCurrentStaff, clearStaffs } =
  staffSlice.actions;
export default staffSlice.reducer;
