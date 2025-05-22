import { useEffect, useState } from "react";
import { Button, Modal, Select } from "../../components/common";
import { Input } from "../../components/common";
import { Switch } from "@mui/material";
import { useStaff } from "../../hooks/useStaff";
import { clearCurrentStaff } from "../../redux/slices/staffSlice";
import { useAppDispatch } from "../../redux/store";
interface StaffFormProps {
  status: "add" | "edit";
  isOpen: boolean;
  onClose: () => void;
}

export const StaffForm = ({ isOpen, onClose, status }: StaffFormProps) => {
  const dispatch = useAppDispatch();
  const { currentStaff, updateStaff, createStaff } = useStaff();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    active: false,
    password: "",
    role: "",
  });
  useEffect(() => {
    if (currentStaff) {
      setFormData({
        firstName: currentStaff?.profile?.firstName || "",
        lastName: currentStaff?.profile?.lastName || "",
        active: currentStaff?.active || false,
        password: "",
        role: currentStaff?.role || "",
      });
    } else {
      setFormData({
        firstName: "",
        lastName: "",
        active: false,
        password: "",
        role: "",
      });
    }
  }, [currentStaff]);

  const handleSubmit = () => {
    if (status === "add") {
      createStaff(formData);
    } else if (status === "edit") {
      updateStaff(currentStaff?._id as string, formData);
    }
    dispatch(clearCurrentStaff());
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${
        status === "add" ? "Add" : status === "edit" ? "Edit" : "View"
      } Staff Member`}
      size="md"
      footer={
        <div className="flex gap-2">
          <Button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-500 hover:bg-gray-600 rounded-md"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md"
          >
            {status === "add"
              ? "Add Staff"
              : status === "edit"
              ? "Edit Staff"
              : "View Staff"}
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        {status === "add" && (
          <div className="flex gap-2 w-full">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                First Name
              </label>
              <Input
                placeholder="Enter staff first name"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Last Name
              </label>
              <Input
                placeholder="Enter staff last name"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
              />
            </div>
          </div>
        )}

        {status === "add" && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <Input
              type="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full"
            />
          </div>
        )}

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Role
          </label>
          <Select
            options={[
              { label: "HR", value: "hr" },
              { label: "Interviewer", value: "interviewer" },
            ]}
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            className="w-full"
            placeholder="Select staff role"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Active
          </label>
          <Switch
            checked={formData.active}
            onChange={(e) =>
              setFormData({ ...formData, active: e.target.checked })
            }
          />
        </div>
      </div>
    </Modal>
  );
};
