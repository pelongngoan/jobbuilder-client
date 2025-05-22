import { useAppDispatch, useAppSelector } from "../redux/store";
import { useCallback } from "react";
import companyService from "../services/company";
import { CompanyProfile } from "../types";
import { setToast } from "../redux/slices/toastSlice";
import { setCompanies, setCurrentCompany } from "../redux/slices/companySlice";
export const useCompany = () => {
  const dispatch = useAppDispatch();
  const { companies, currentCompany } = useAppSelector(
    (state) => state.company
  );
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
      dispatch(setCurrentCompany(response.data as unknown as CompanyProfile));
      return response.data;
    }
  }, [dispatch]);

  const getAllCompanies = useCallback(async (page: number, limit: number) => {
    const response = await companyService.getAllCompanies(page, limit);
    if (response.success && response.data) {
      dispatch(setCompanies(response.data as unknown as CompanyProfile[]));
      return response.data;
    }
  }, []);
  const getCompanyById = useCallback(async (id: string) => {
    const response = await companyService.getCompanyById(id);
    if (response.success && response.data) {
      dispatch(setCurrentCompany(response.data as unknown as CompanyProfile));
      return response.data;
    }
  }, []);

  return {
    updateCompanyProfile,
    getCompanyByProfile,
    getAllCompanies,
    companies,
    currentCompany,
    getCompanyById,
  };
};

export default useCompany;
