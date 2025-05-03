import React, { useState } from "react";
import {
  Save,
  User,
  Building,
  Lock,
  Bell,
  Globe,
  Mail,
  Shield,
  Trash,
} from "lucide-react";

// Mock company data
const initialCompanyData = {
  name: "Acme Corporation",
  logo: null,
  website: "www.acmecorp.com",
  email: "hr@acmecorp.com",
  phone: "(555) 123-4567",
  address: "123 Business Ave, San Francisco, CA 94107",
  description:
    "Acme Corporation is a leading technology company specializing in innovative solutions for businesses worldwide.",
};

// Mock user data
const initialUserData = {
  name: "Alex Johnson",
  email: "alex.johnson@acmecorp.com",
  role: "HR Manager",
  notifications: {
    email: true,
    applicants: true,
    messages: true,
    updates: false,
  },
};

export const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("company");
  const [companyData, setCompanyData] = useState(initialCompanyData);
  const [userData, setUserData] = useState(initialUserData);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleCompanyChange = (e) => {
    const { name, value } = e.target;
    setCompanyData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUserChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setUserData((prev) => ({
      ...prev,
      notifications: { ...prev.notifications, [name]: checked },
    }));
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setPasswordError("");
    setSuccessMessage("");

    // Validate passwords
    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords don't match");
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      return;
    }

    // Simulate password change
    setSuccessMessage("Password updated successfully");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleCompanySubmit = (e) => {
    e.preventDefault();
    setSuccessMessage("Company information updated successfully");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const handleUserSubmit = (e) => {
    e.preventDefault();
    setSuccessMessage("User information updated successfully");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const handleLogoChange = (e) => {
    // In a real app, you would handle file upload here
    console.log("Logo file selected:", e.target.files[0]);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>

      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          {successMessage}
        </div>
      )}

      <div className="bg-white shadow rounded-lg overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b">
          <button
            className={`px-6 py-3 text-sm font-medium ${
              activeTab === "company"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("company")}
          >
            <Building className="inline h-4 w-4 mr-2" />
            Company
          </button>
          <button
            className={`px-6 py-3 text-sm font-medium ${
              activeTab === "account"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("account")}
          >
            <User className="inline h-4 w-4 mr-2" />
            Account
          </button>
          <button
            className={`px-6 py-3 text-sm font-medium ${
              activeTab === "password"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("password")}
          >
            <Lock className="inline h-4 w-4 mr-2" />
            Password
          </button>
          <button
            className={`px-6 py-3 text-sm font-medium ${
              activeTab === "notifications"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("notifications")}
          >
            <Bell className="inline h-4 w-4 mr-2" />
            Notifications
          </button>
        </div>

        {/* Company Information */}
        {activeTab === "company" && (
          <form onSubmit={handleCompanySubmit} className="p-6 space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Logo
                </label>
                <div className="flex items-center space-x-4">
                  <div className="h-20 w-20 bg-gray-200 rounded-lg flex items-center justify-center">
                    {companyData.logo ? (
                      <img
                        src={companyData.logo}
                        alt="Company logo"
                        className="h-full w-full object-cover rounded-lg"
                      />
                    ) : (
                      <Building className="h-10 w-10 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <label className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-700">
                      Upload Logo
                      <input
                        type="file"
                        className="hidden"
                        onChange={handleLogoChange}
                        accept="image/*"
                      />
                    </label>
                    <p className="text-xs text-gray-500 mt-1">
                      Recommended size: 200x200px
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Company Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={companyData.name}
                  onChange={handleCompanyChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="website"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Website
                  </label>
                  <div className="flex items-center">
                    <span className="bg-gray-100 p-2 rounded-l border-l border-y text-gray-500">
                      https://
                    </span>
                    <input
                      type="text"
                      id="website"
                      name="website"
                      value={companyData.website}
                      onChange={handleCompanyChange}
                      className="w-full p-2 border-r border-y rounded-r focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={companyData.email}
                    onChange={handleCompanyChange}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Phone
                  </label>
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    value={companyData.phone}
                    onChange={handleCompanyChange}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Address
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={companyData.address}
                    onChange={handleCompanyChange}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Company Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={companyData.description}
                  onChange={handleCompanyChange}
                  rows={4}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded flex items-center"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </button>
            </div>
          </form>
        )}

        {/* Account Settings */}
        {activeTab === "account" && (
          <form onSubmit={handleUserSubmit} className="p-6 space-y-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="userName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="userName"
                    name="name"
                    value={userData.name}
                    onChange={handleUserChange}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="userEmail"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="userEmail"
                    name="email"
                    value={userData.email}
                    onChange={handleUserChange}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="role"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Role
                </label>
                <input
                  type="text"
                  id="role"
                  name="role"
                  value={userData.role}
                  onChange={handleUserChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded flex items-center"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </button>
            </div>
          </form>
        )}

        {/* Password */}
        {activeTab === "password" && (
          <form onSubmit={handlePasswordSubmit} className="p-6 space-y-6">
            {passwordError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {passwordError}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="currentPassword"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Current Password
                </label>
                <input
                  type="password"
                  id="currentPassword"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="newPassword"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  New Password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Password must be at least 8 characters long
                </p>
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Confirm New Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded flex items-center"
              >
                <Save className="h-4 w-4 mr-2" />
                Update Password
              </button>
            </div>
          </form>
        )}

        {/* Notifications */}
        {activeTab === "notifications" && (
          <form onSubmit={handleUserSubmit} className="p-6 space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Email Notifications</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-700">
                      New Applications
                    </h4>
                    <p className="text-sm text-gray-500">
                      Receive emails when new candidates apply for a position
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="applicants"
                      className="sr-only peer"
                      checked={userData.notifications.applicants}
                      onChange={handleNotificationChange}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-700">New Messages</h4>
                    <p className="text-sm text-gray-500">
                      Receive emails when candidates send you messages
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="messages"
                      className="sr-only peer"
                      checked={userData.notifications.messages}
                      onChange={handleNotificationChange}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-700">
                      System Updates
                    </h4>
                    <p className="text-sm text-gray-500">
                      Receive emails about system updates and new features
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="updates"
                      className="sr-only peer"
                      checked={userData.notifications.updates}
                      onChange={handleNotificationChange}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-700">Email Digest</h4>
                    <p className="text-sm text-gray-500">
                      Receive a daily summary of all activities
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="email"
                      className="sr-only peer"
                      checked={userData.notifications.email}
                      onChange={handleNotificationChange}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded flex items-center"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Preferences
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Danger Zone */}
      <div className="bg-white shadow rounded-lg overflow-hidden mt-6">
        <div className="p-6">
          <h3 className="text-lg font-medium text-red-600 flex items-center">
            <Shield className="h-5 w-5 mr-2" /> Danger Zone
          </h3>
          <div className="mt-4 border-t border-gray-200 pt-4">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-medium">Delete Account</h4>
                <p className="text-sm text-gray-500">
                  Permanently delete your account and all associated data
                </p>
              </div>
              <button className="bg-red-600 text-white px-4 py-2 rounded flex items-center">
                <Trash className="h-4 w-4 mr-2" />
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
