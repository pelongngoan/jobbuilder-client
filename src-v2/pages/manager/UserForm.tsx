import { useEffect, useState } from "react";
import { Modal } from "../../components/common";
import { Button, Input, Select } from "../../components/common";
import { useUser } from "../../hooks/useUser";
import { User, UserRole } from "../../types";
import { useAppSelector } from "../../redux/store";

interface UserFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

export const UserForm = ({ isOpen, onClose, onSubmit }: UserFormProps) => {
  const { currentUser } = useAppSelector((state) => state.user);
  const { createUser, updateUserProfile } = useUser();
  const [formData, setFormData] = useState<Partial<User>>({
    email: "",
    password: "",
    role: "user" as UserRole,
    isVerified: false,
  });

  useEffect(() => {
    if (currentUser) {
      setFormData({
        ...currentUser,
        password: "", // Don't show existing password
      });
    } else {
      setFormData({
        email: "",
        password: "",
        role: "user" as UserRole,
        isVerified: false,
      });
    }
  }, [currentUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (currentUser) {
        await updateUserProfile({
          ...formData,
          userId: currentUser._id,
        });
      } else {
        await createUser(formData as User);
      }
      onSubmit();
    } catch (error) {
      console.error("Error submitting user:", error);
    }
  };

  const roleOptions = [
    { value: "user", label: "User" },
    { value: "admin", label: "Admin" },
    { value: "staff", label: "Staff" },
    { value: "company", label: "Company" },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={currentUser ? "Edit User" : "Add User"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
        <Input
          label="Password"
          type="password"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          required={!currentUser}
          placeholder={
            currentUser ? "Leave blank to keep current password" : ""
          }
        />
        <Select
          label="Role"
          value={formData.role}
          onChange={(e) =>
            setFormData({ ...formData, role: e.target.value as UserRole })
          }
          options={roleOptions}
          required
        />
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isVerified"
            checked={formData.isVerified}
            onChange={(e) =>
              setFormData({ ...formData, isVerified: e.target.checked })
            }
          />
          <label htmlFor="isVerified">Verified User</label>
        </div>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            {currentUser ? "Update User" : "Add User"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
