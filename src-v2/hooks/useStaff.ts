import { useAppDispatch, useAppSelector } from "../redux/store";
import { RootState } from "../redux/store";
import { setStaffs, setCurrentStaff } from "../redux/slices/staffSlice";
import staffService from "../services/staff";
import { setToast } from "../redux/slices/toastSlice";
import { setTotalPages } from "../redux/slices/paginationSlice";

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
      dispatch(setToast({ message: response.message, type: "success" }));
    }
    return response;
  };

  const getStaffById = async (id: string) => {
    const response = await staffService.getStaff(id);
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
      dispatch(setToast({ message: response.message, type: "success" }));
    }
    return response;
  };

  const importStaffs = async (file: File) => {
    const response = await staffService.importStaffs(file);
    if (response.success) {
      dispatch(setToast({ message: response.message, type: "success" }));
    }
    return response;
  };
  const searchStaffs = async (
    email: string,
    role: string,
    page: number,
    limit: number
  ) => {
    const response = await staffService.searchStaffs({
      page,
      limit,
      email,
      role,
    });
    if (response.success && response.data) {
      dispatch(setStaffs(response.data));
    }
    return response;
  };

  const deleteStaff = async (id: string) => {
    const response = await staffService.deleteStaff(id);
    if (response.success) {
      dispatch(setToast({ message: response.message, type: "success" }));
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
