import { createSlice } from "@reduxjs/toolkit";
import { CompanyProfile } from "../../types";

interface CompanyState {
  companies: CompanyProfile[] | null;
  currentCompany: CompanyProfile | null;
}

const initialState: CompanyState = {
  companies: null,
  currentCompany: null,
};

const companySlice = createSlice({
  name: "company",
  initialState,
  reducers: {
    setCompanies: (state, action) => {
      state.companies = action.payload;
    },

    setCurrentCompany: (state, action) => {
      state.currentCompany = action.payload;
    },
  },
});

export const { setCompanies, setCurrentCompany } = companySlice.actions;
export default companySlice.reducer;
