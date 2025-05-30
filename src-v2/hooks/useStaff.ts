import { useAppDispatch, useAppSelector } from "../redux/store";
import { RootState } from "../redux/store";
import { setStaffs, setCurrentStaff } from "../redux/slices/staffSlice";
import staffService from "../services/staff";
import { setTotalPages } from "../redux/slices/paginationSlice";
import toast from "react-hot-toast";

export const useStaff = () => {
  const dispatch = useAppDispatch();
  const { staffs, currentStaff } = useAppSelector(
    (state: RootState) => state.staff
  );

  const getStaffs = async (page: number, limit: number) => {
    const response = await staffService.getStaffs(page, limit);
    if (response.success) {
      dispatch(setStaffs(response.data));
      dispatch(setTotalPages(response.pagination || 0));
    }
  };

  const createStaff = async (data: {
    firstName: string;
    lastName: string;
    password: string;
    role: string;
    active: boolean;
  }) => {
    const response = await staffService.createStaff(data);
    if (response.success) {
      toast.success("Create staff successfully");
    }
    return response;
  };

  const getStaffById = async (id: string) => {
    const response = await staffService.getStaffById(id);
    if (response.success) {
      dispatch(setCurrentStaff(response.data));
    }
  };

  const updateStaff = async (
    id: string,
    data: {
      password?: string;
      role?: string;
      active?: boolean;
    }
  ) => {
    const response = await staffService.updateStaff(id, data);
    if (response.success) {
      toast.success("Update staff successfully");
    }
    return response;
  };

  const importStaffs = async (file: File) => {
    const response = await staffService.importStaffs(file);
    if (response.imported && response.imported > 0) {
      toast.success(`Imported ${response.imported} staffs successfully`);
    } else {
      toast.error("Import staffs failed");
    }
    return response;
  };
  const searchStaffs = async (
    email: string,
    role: string,
    page: number,
    limit: number,
    companyId: string
  ) => {
    const response = await staffService.searchStaffs({
      companyId,
      page,
      limit,
      email,
      role,
    });
    if (response.success && response.data) {
      dispatch(setStaffs(response.data));
      dispatch(setTotalPages(response.pagination.pages || 0));
    }
    return response;
  };

  const deleteStaff = async (id: string) => {
    const response = await staffService.deleteStaff(id);
    if (response.success) {
      toast.success("Delete staff successfully");
    }
  };

  return {
    staffs,
    currentStaff,
    getStaffs,
    createStaff,
    getStaffById,
    updateStaff,
    importStaffs,
    searchStaffs,
    deleteStaff,
  };
};
