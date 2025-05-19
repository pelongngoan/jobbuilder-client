import { createSlice } from "@reduxjs/toolkit";

interface StaffProfile {
  _id: string;
  userId: {
    _id: string;
    email: string;
    isVerified: boolean;
    createdAt: string;
    updatedAt: string;
  };
  companyId: string;
  role: string;
  profile: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    address?: string;
    profilePicture?: string;
    createdAt: string;
    updatedAt: string;
  };
  jobPosts: {
    id: string;
    title: string;
    description: string;
    createdAt: string;
    updatedAt: string;
  };
  applications: {
    id: string;
    jobPostId: string;
    staffId: string;
    createdAt: string;
    updatedAt: string;
  };
  active: boolean;
  createdAt: string;
  updatedAt: string;
}
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
  },
});

export const { setStaffs, setCurrentStaff } = staffSlice.actions;
export default staffSlice.reducer;
