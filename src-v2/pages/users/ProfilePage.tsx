import { useState, useEffect } from "react";
import { useProfile } from "../../hooks/useProfile";
import { getImageUrl } from "./CompanyCard";
import { Profile } from "../../types/profile.types";
import { useAppSelector } from "../../redux/store";

export const ProfilePage = () => {
  const { updateProfile } = useProfile();
  const { getProfile, profile } = useProfile();
  const { id } = useAppSelector((state) => state.auth);
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  // Form state for profile
  const [formData, setFormData] = useState<Profile>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    profilePicture: "",
  });

  useEffect(() => {
    if (id) {
      getProfile(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (profile) {
      console.log("profile", profile);
      setFormData({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        email: profile.email || "",
        phone: profile.phone || "",
        address: profile.address || "",
        profilePicture: profile.profilePicture || "",
      });
      // Set the preview URL to the existing profile picture
      if (profile.profilePicture) {
        setPreviewUrl(getImageUrl(`/uploads/${profile.profilePicture}`));
      }
    }
  }, [profile]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Create a preview URL for the new image
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      setFormData((prev) => ({
        ...prev,
        profilePicture: file.name,
      }));
    }
  };

  const handleUpdateProfile = async () => {
    try {
      if (!id) return;

      await updateProfile(id, formData, selectedFile);
      setIsEditingPersonal(false);
      setSelectedFile(null);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleCancel = () => {
    setIsEditingPersonal(false);
    setSelectedFile(null);
    // Reset preview URL to original profile picture
    if (profile?.profilePicture) {
      setPreviewUrl(getImageUrl(`/uploads/${profile.profilePicture}`));
    } else {
      setPreviewUrl("");
    }
    // Reset form data to original profile data
    if (profile) {
      setFormData({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        email: profile.email || "",
        phone: profile.phone || "",
        address: profile.address || "",
        profilePicture: profile.profilePicture || "",
      });
    }
  };

  // Cleanup preview URL when component unmounts
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-blue-600 text-white p-6">
            <h1 className="text-2xl font-bold">User Profile</h1>
          </div>

          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Personal Information</h2>
              {!isEditingPersonal ? (
                <button
                  onClick={() => setIsEditingPersonal(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                >
                  Edit Profile
                </button>
              ) : (
                <div className="space-x-2">
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdateProfile}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              )}
            </div>

            {/* Profile Picture Section */}
            <div className="flex flex-col items-center mb-6">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 mb-4">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Profile Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
                    No Image
                  </div>
                )}
              </div>
              {isEditingPersonal && (
                <label className="cursor-pointer bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition-colors">
                  Upload Image
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
              )}
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  disabled={!isEditingPersonal}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:bg-gray-50 disabled:text-gray-500"
                  placeholder="Enter first name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  disabled={!isEditingPersonal}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:bg-gray-50 disabled:text-gray-500"
                  placeholder="Enter last name"
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={!isEditingPersonal}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:bg-gray-50 disabled:text-gray-500"
                placeholder="Enter email"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={!isEditingPersonal}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:bg-gray-50 disabled:text-gray-500"
                placeholder="Enter phone number"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                disabled={!isEditingPersonal}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:bg-gray-50 disabled:text-gray-500"
                placeholder="Enter address"
                rows={3}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
