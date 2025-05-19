import { useAppDispatch, useAppSelector } from "../redux/store";
import { RootState } from "../redux/store";
import { setStaffs, setCurrentStaff } from "../redux/slices/staffSlice";
import staffService from "../services/staff";
import { setToast } from "../redux/slices/toastSlice";

export const useStaff = () => {
  const dispatch = useAppDispatch();
  const { staffs, currentStaff } = useAppSelector(
    (state: RootState) => state.staff
  );

  const getStaffs = async () => {
    const response = await staffService.getStaffs();
    if (response.success) {
      dispatch(setStaffs(response.data));
    }
  };

  const createStaff = async (data: {
    fullName: string;
    password: string;
    role: string;
    active: boolean;
  }) => {
    const response = await staffService.createStaff(data);
    if (response.success) {
      getStaffs();
    }
  };

  const getStaff = async (id: string) => {
    const response = await staffService.getStaff(id);
    if (response.success) {
      dispatch(setCurrentStaff(response.data));
    }
  };

  const updateStaffProfile = async (
    id: string,
    data: {
      firstName?: string;
      lastName?: string;
      email?: string;
      phone?: string;
      address?: string;
    }
  ) => {
    const response = await staffService.updateStaffProfile(id, data);
    if (response.success) {
      dispatch(setToast({ message: response.message, type: "success" }));
      await getStaff(id);
    }
    return response;
  };

  return {
    staffs,
    currentStaff,
    getStaffs,
    createStaff,
    getStaff,
    updateStaffProfile,
  };
};
