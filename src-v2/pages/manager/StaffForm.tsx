import { useState } from "react";
import { Button, Modal, Select } from "../../components/common";
import { Input } from "../../components/common";
import { Switch } from "@mui/material";

interface StaffFormProps {
  staff?: any;
  status: "add" | "edit" | "view";
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    formData: {
      fullName: string;
      active: boolean;
      password: string;
      role: string;
    },
    staffId?: string
  ) => void;
}

export const StaffForm = ({
  isOpen,
  onClose,
  onSubmit,
  staff,
  status,
}: StaffFormProps) => {
  const [formData, setFormData] = useState({
    fullName: "",
    active: false,
    password: "",
    role: "",
  });

  const handleSubmit = () => {
    if (status === "add") {
      onSubmit(formData);
    } else if (status === "edit") {
      onSubmit(formData, staff.id);
    }
    setFormData({
      fullName: "",
      active: false,
      password: "",
      role: "",
    });
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
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
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
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Full Name
          </label>
          <Input
            placeholder="Enter staff full name"
            value={formData.fullName}
            disabled={status === "view" || status === "edit"}
            onChange={(e) =>
              setFormData({ ...formData, fullName: e.target.value })
            }
            className="w-full"
          />
        </div>

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
