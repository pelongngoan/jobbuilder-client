import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User, UserProfile } from "../../types";
interface HrCompany {
  user: User;
  profile: UserProfile;
}

interface CompanyState {
  hrCompanies: HrCompany[];
}

const initialState: CompanyState = {
  hrCompanies: [],
};

const companySlice = createSlice({
  name: "company",
  initialState,
  reducers: {
    setHrCompanies: (state, action: PayloadAction<HrCompany[]>) => {
      state.hrCompanies = action.payload;
    },
    clearHrCompanies: (state) => {
      state.hrCompanies = [];
    },
  },
});

export const { setHrCompanies } = companySlice.actions;
export default companySlice.reducer;
