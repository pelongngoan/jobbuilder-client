import { useAppDispatch, useAppSelector } from "../redux/store";
import { useCallback } from "react";
import companyService from "../services/company";
import { CompanyProfile } from "../types";
import { setToast } from "../redux/slices/toastSlice";
import { setCompany } from "../redux/slices/companySlice";
export const useCompany = () => {
  const dispatch = useAppDispatch();
  const { company } = useAppSelector((state) => state.company);
  const updateCompanyProfile = useCallback(
    async (
      profileData: CompanyProfile,
      logo?: File | null,
      wallPaper?: File | null
    ) => {
      const response = await companyService.updateCompanyProfile({
        profileData,
        logo: logo || undefined,
        wallPaper: wallPaper || undefined,
      });
      if (response.success) {
        dispatch(setToast({ message: response.message, type: "success" }));
      }
    },
    [dispatch]
  );
  const getCompanyByProfile = useCallback(async () => {
    const response = await companyService.getCompanyByProfile();
    if (response.success && response.data) {
      dispatch(setCompany(response.data as unknown as CompanyProfile));
      return response.data;
    }
  }, [dispatch]);

  return { company, updateCompanyProfile, getCompanyByProfile };
};

export default useCompany;
