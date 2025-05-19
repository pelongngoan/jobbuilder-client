import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CompanyProfile } from "../../types";

interface CompanyState {
  company: CompanyProfile | null;
}

const initialState: CompanyState = {
  company: null,
};

const companySlice = createSlice({
  name: "company",
  initialState,
  reducers: {
    setCompany: (state, action: PayloadAction<CompanyProfile>) => {
      state.company = action.payload;
    },
    clearCompany: (state) => {
      state.company = null;
    },
  },
});

export const { setCompany, clearCompany } = companySlice.actions;
export default companySlice.reducer;
