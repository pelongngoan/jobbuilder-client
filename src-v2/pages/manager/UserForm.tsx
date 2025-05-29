import { useEffect, useState } from "react";
import { Modal } from "../../components/common";
import { Button, Input, Select } from "../../components/common";
import { useUser } from "../../hooks/useUser";
import { UserRole } from "../../types";
import { useAppSelector } from "../../redux/store";
import { UserRequest } from "../../services/user";
interface UserFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

export const UserForm = ({ isOpen, onClose, onSubmit }: UserFormProps) => {
  const { currentUser } = useAppSelector((state) => state.user);
  const { createUser, updateUser } = useUser();
  const [formData, setFormData] = useState<UserRequest>({
    email: "",
    password: "",
    role: "user" as UserRole,
    isVerified: false,
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    companyName: "",
    domain: "",
    website: "",
  });

  useEffect(() => {
    if (currentUser) {
      setFormData({
        ...currentUser,
        password: currentUser.password || "",
        firstName: currentUser.firstName || "",
        lastName: currentUser.lastName || "",
        phone: currentUser.phone || "",
        address: currentUser.address || "",
        companyName: currentUser.companyName || "",
        domain: currentUser.domain || "",
        website: currentUser.website || "",
        isVerified: currentUser.isVerified || false,
        role: currentUser.role || ("user" as UserRole),
      });
    } else {
      setFormData({
        email: "",
        password: "",
        role: "user" as UserRole,
        isVerified: false,
        firstName: "",
        lastName: "",
        phone: "",
        address: "",
        companyName: "",
        domain: "",
        website: "",
      });
    }
  }, [currentUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (currentUser) {
        await updateUser(formData);
      } else {
        await createUser(formData);
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
      size="lg"
    >
      <div className="max-h-[80vh] overflow-y-auto px-1">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Basic Information */}
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  Basic Information
                </h3>
                <div className="space-y-4">
                  <Input
                    label="Email Address"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                    className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                  />
                  {!currentUser && (
                    <>
                      <Input
                        label="Password"
                        type="password"
                        value={formData.password}
                        onChange={(e) =>
                          setFormData({ ...formData, password: e.target.value })
                        }
                        required={!currentUser}
                        placeholder={
                          currentUser
                            ? "Leave blank to keep current password"
                            : "Enter password"
                        }
                        className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                      />
                      <Select
                        label="User Role"
                        value={formData.role}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            role: e.target.value as UserRole,
                          })
                        }
                        options={roleOptions}
                        required
                        className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                      />
                    </>
                  )}

                  <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-300">
                    <input
                      type="checkbox"
                      id="isVerified"
                      checked={formData.isVerified}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          isVerified: e.target.checked,
                        })
                      }
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                    />
                    <label
                      htmlFor="isVerified"
                      className="text-sm font-medium text-gray-700 cursor-pointer"
                    >
                      Verified User
                    </label>
                    <svg
                      className="w-4 h-4 text-green-500 ml-auto"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Contact, Personal, and Company Information */}
            <div className="space-y-6">
              {/* Contact Information Section */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  Contact Information
                </h3>
                <div className="space-y-4">
                  <Input
                    label="Phone Number"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    required
                    className="transition-all duration-200 focus:ring-2 focus:ring-green-500"
                  />
                  <Input
                    label="Address"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    required
                    className="transition-all duration-200 focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              {/* Personal Information Section - Only for User role */}
              {formData.role === "user" && (
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <svg
                      className="w-5 h-5 mr-2 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Personal Details
                  </h3>
                  <div className="space-y-4">
                    <Input
                      label="First Name"
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData({ ...formData, firstName: e.target.value })
                      }
                      required
                      className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                    />
                    <Input
                      label="Last Name"
                      value={formData.lastName}
                      onChange={(e) =>
                        setFormData({ ...formData, lastName: e.target.value })
                      }
                      required
                      className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              )}

              {/* Company Information Section - Only for Company role */}
              {formData.role === "company" && (
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <svg
                      className="w-5 h-5 mr-2 text-purple-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                    Company Details
                  </h3>
                  <div className="space-y-4">
                    <Input
                      label="Company Name"
                      value={formData.companyName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          companyName: e.target.value,
                        })
                      }
                      required
                      className="transition-all duration-200 focus:ring-2 focus:ring-purple-500"
                    />
                    <Input
                      label="Domain"
                      value={formData.domain}
                      onChange={(e) =>
                        setFormData({ ...formData, domain: e.target.value })
                      }
                      required
                      placeholder="example.com"
                      className="transition-all duration-200 focus:ring-2 focus:ring-purple-500"
                    />
                    <Input
                      label="Website"
                      value={formData.website}
                      onChange={(e) =>
                        setFormData({ ...formData, website: e.target.value })
                      }
                      required
                      placeholder="https://example.com"
                      className="transition-all duration-200 focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 bg-white sticky bottom-0 pb-2">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200 font-medium"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 font-medium shadow-sm hover:shadow-md"
            >
              {currentUser ? "Update User" : "Create User"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
