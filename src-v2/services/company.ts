import apiClient from "./api";
import { CompanyProfile, CompanyStaff } from "../types";
import { ApiResponse, CUDResponse, GetResponse } from "../types/common.types";

// Helper function to get full image URL
const getFullImageUrl = (path: string | undefined) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${apiClient.defaults.baseURL}${path}`;
};

// Company Profile service
const companyService = {
  //Update company profile
  updateCompanyProfile: async ({
    profileData,
    logo,
    wallPaper,
  }: {
    profileData: CompanyProfile;
    logo?: File;
    wallPaper?: File;
  }) => {
    const formData = new FormData();

    // Append each field of profileData individually
    for (const key in profileData) {
      if (profileData[key as keyof CompanyProfile]) {
        formData.append(
          key,
          profileData[key as keyof CompanyProfile] as string
        );
      }
    }

    // Append files
    if (logo) formData.append("logo", logo);
    if (wallPaper) formData.append("wallPaper", wallPaper);

    const response = await apiClient.put<ApiResponse<CUDResponse>>(
      "/companies/profile",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  },
  //Get company by id
  getCompanyByProfile: async () => {
    const response = await apiClient.get<ApiResponse<GetResponse>>(
      `/companies/profile`
    );

    // Transform image URLs in the response
    if (response.data.data) {
      const data = response.data.data as CompanyProfile;
      return {
        ...response.data,
        data: {
          ...data,
          logo: getFullImageUrl(data.logo),
          wallPaper: getFullImageUrl(data.wallPaper),
        },
      };
    }

    return response.data;
  },
  getCompanyById: async (id: string) => {
    const response = await apiClient.get<ApiResponse<GetResponse>>(
      `/companies/${id}`
    );
    return response.data;
  },
  //Get all companies
  getAllCompanies: async (page: number, limit: number) => {
    const response = await apiClient.get<ApiResponse<GetResponse>>(
      `/companies?page=${page}&limit=${limit}`
    );
    return response.data;
  },
  //Search companies by name
  searchCompaniesByName: async (name: string) => {
    const response = await apiClient.get<ApiResponse<GetResponse>>(
      `/companies?name=${name}`
    );
    return response.data;
  },
  //Get company jobs
  getCompanyJobs: async (id: string) => {
    const response = await apiClient.get<ApiResponse<GetResponse>>(
      `/companies/${id}/jobs`
    );
    return response.data;
  },
  //Get company staffs
  getCompanyStaffs: async () => {
    const response = await apiClient.get<ApiResponse<GetResponse>>(
      `/companies/staffs`
    );
    return response.data;
  },
  //Get company staff by id
  getCompanyStaffsById: async (id: string) => {
    const response = await apiClient.get<ApiResponse<GetResponse>>(
      `/companies/staffs/${id}`
    );
    return response.data;
  },
  //Get company staff by role
  getCompanyStaffByRole: async (role: string) => {
    const response = await apiClient.get<ApiResponse<GetResponse>>(
      `/companies/staffs?role=${role}`
    );
    return response.data;
  },
  //Create company staff
  createCompanyStaff: async (staffData: Partial<CompanyStaff>) => {
    const response = await apiClient.post<ApiResponse<CUDResponse>>(
      `/companies/staffs`,
      staffData
    );
    return response.data;
  },
  //Update company staff
  updateCompanyStaff: async (id: string, staffData: Partial<CompanyStaff>) => {
    const response = await apiClient.put<ApiResponse<CUDResponse>>(
      `/companies/staffs/${id}`,
      staffData
    );
    return response.data;
  },
  //Update company staff active
  updateCompanyStaffActive: async ({
    ids,
    active,
  }: {
    ids: string[];
    active: boolean;
  }) => {
    const response = await apiClient.put<ApiResponse<CUDResponse>>(
      `/companies/staffs/active`,
      { ids, active }
    );
    return response.data;
  },
  //Import company staff from CSV
  importCompanyStaffFromCSV: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await apiClient.post<ApiResponse<CUDResponse>>(
      `/companies/staffs/import`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },
};

export default companyService;
