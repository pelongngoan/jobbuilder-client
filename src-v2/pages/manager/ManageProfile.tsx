import { useStaff } from "../../hooks/useStaff";
import { useState, useEffect, ChangeEvent } from "react";
import { useCompany } from "../../hooks/useCompany";
import { Input, Button } from "../../components/common";
import { Profile } from "../../types/profile.types";
import { CompanyProfile } from "../../types/company.types";
import { useProfile } from "../../hooks/useProfile";
import useAuth from "../../hooks/useAuth";

// Utility function to get complete image URL
const getImageUrl = (path: string) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  // Use the backend URL for serving static files
  // return `http://localhost:3000/uploads/${path}`;
  return `https://jobbuilder-server.onrender.com/uploads/${path}`;
};

export const ManageProfile = () => {
  const { currentStaff, getStaffById } = useStaff();
  const { updateProfile } = useProfile();
  const { getCompanyByProfile, currentCompany, updateCompanyProfile } =
    useCompany();
  // const { id, role } = useAppSelector((state) => state.auth);
  const { id, role, useProfileId } = useAuth();
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [selectedLogo, setSelectedLogo] = useState<File | null>(null);
  const [selectedWallpaper, setSelectedWallpaper] = useState<File | null>(null);
  const [selectedProfilePicture, setSelectedProfilePicture] =
    useState<File | null>(null);

  // Form state for staff profile
  const [formValues, setFormValues] = useState<Profile>({
    firstName: (currentStaff?.profile as Profile).firstName || "",
    lastName: (currentStaff?.profile as Profile).lastName || "",
    email: (currentStaff?.profile as Profile).email || "",
    phone: (currentStaff?.profile as Profile).phone || "",
    address: (currentStaff?.profile as Profile).address || "",
    profilePicture: (currentStaff?.profile as Profile).profilePicture || "",
  });

  // Form state for company profile
  const [companyFormValues, setCompanyFormValues] = useState<CompanyProfile>({
    companyName: "",
    email: "",
    website: "",
    phone: "",
    address: "",
    logo: "",
    wallPaper: "",
    description: "",
    domain: "",
  });

  useEffect(() => {
    if (useProfileId && role === "staff") {
      getStaffById(useProfileId);
    }
    if (id && role === "company") {
      getCompanyByProfile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, role]);

  useEffect(() => {
    if (currentStaff) {
      setFormValues({
        firstName: (currentStaff.profile as Profile).firstName || "",
        lastName: (currentStaff.profile as Profile).lastName || "",
        email: (currentStaff.profile as Profile).email || "",
        profilePicture: (currentStaff.profile as Profile).profilePicture || "",
        phone: (currentStaff.profile as Profile).phone || "",
        address: (currentStaff.profile as Profile).address || "",
      });
    }
  }, [currentStaff]);

  useEffect(() => {
    if (currentCompany) {
      setCompanyFormValues({
        companyName: currentCompany.companyName || "",
        email: currentCompany.email || "",
        website: currentCompany.website || "",
        phone: currentCompany.phone || "",
        logo: currentCompany.logo || "",
        wallPaper: currentCompany.wallPaper || "",
        description: currentCompany.description || "",
        address: currentCompany.address || "",
        domain: currentCompany.domain || "",
      });
    }
  }, [currentCompany]);

  const handleFileChange = (
    event: ChangeEvent<HTMLInputElement>,
    type: "logo" | "wallpaper" | "profilePicture"
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    switch (type) {
      case "logo":
        setSelectedLogo(file);
        setCompanyFormValues((prev) => ({
          ...prev,
          logo: URL.createObjectURL(file),
        }));
        break;
      case "wallpaper":
        setSelectedWallpaper(file);
        setCompanyFormValues((prev) => ({
          ...prev,
          wallPaper: URL.createObjectURL(file),
        }));
        break;
      case "profilePicture":
        setSelectedProfilePicture(file);
        setFormValues((prev) => ({
          ...prev,
          profilePicture: URL.createObjectURL(file),
        }));
        break;
    }
  };

  const handleUpdateProfile = async () => {
    try {
      if (!id) return;

      if (role === "staff") {
        // Create a profile object first
        const profileData: Profile = {
          ...formValues,
        };

        // Then create FormData and append all values
        const formData = new FormData();
        Object.entries(profileData).forEach(([key, value]) => {
          if (value) formData.append(key, value);
        });

        if (selectedProfilePicture) {
          formData.append("profilePicture", selectedProfilePicture);
        }

        await updateProfile(id, profileData, selectedProfilePicture);
      } else if (role === "company") {
        const companyData: CompanyProfile = {
          ...companyFormValues,
        };
        await updateCompanyProfile(
          companyData,
          selectedLogo || undefined,
          selectedWallpaper || undefined
        );
      }

      setIsEditingInfo(false);
      setIsEditingPersonal(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const renderContent = () => {
    if (role === "staff") {
      return (
        <>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Personal Information</h2>
              {!isEditingPersonal ? (
                <Button
                  variant="primary"
                  onClick={() => setIsEditingPersonal(true)}
                >
                  Edit
                </Button>
              ) : (
                <div className="space-x-2">
                  <Button onClick={() => setIsEditingPersonal(false)}>
                    Cancel
                  </Button>
                  <Button variant="primary" onClick={handleUpdateProfile}>
                    Save
                  </Button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <Input
                  value={formValues.firstName}
                  onChange={(e) =>
                    setFormValues({
                      ...formValues,
                      firstName: e.target.value,
                    })
                  }
                  disabled={!isEditingPersonal}
                  placeholder="Enter first name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <Input
                  value={formValues.lastName}
                  onChange={(e) =>
                    setFormValues({ ...formValues, lastName: e.target.value })
                  }
                  disabled={!isEditingPersonal}
                  placeholder="Enter last name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <Input
                  value={formValues.email}
                  onChange={(e) =>
                    setFormValues({ ...formValues, email: e.target.value })
                  }
                  disabled={!isEditingPersonal}
                  placeholder="Enter email"
                  type="email"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <Input
                  value={formValues.phone}
                  onChange={(e) =>
                    setFormValues({ ...formValues, phone: e.target.value })
                  }
                  disabled={!isEditingPersonal}
                  placeholder="Enter phone number"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <Input
                  value={formValues.address}
                  onChange={(e) =>
                    setFormValues({ ...formValues, address: e.target.value })
                  }
                  disabled={!isEditingPersonal}
                  placeholder="Enter address"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Profile Picture
                </label>
                <div className="mt-1 flex items-center">
                  {formValues.profilePicture && (
                    <img
                      src={
                        selectedProfilePicture
                          ? URL.createObjectURL(selectedProfilePicture)
                          : getImageUrl(formValues.profilePicture)
                      }
                      alt="Profile"
                      className="h-12 w-12 object-cover rounded-full mr-4"
                    />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, "profilePicture")}
                    disabled={!isEditingPersonal}
                    className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-full file:border-0
                      file:text-sm file:font-semibold
                      file:bg-indigo-50 file:text-indigo-700
                      hover:file:bg-indigo-100"
                  />
                </div>
              </div>
            </div>
          </div>
        </>
      );
    }

    if (role === "company") {
      return (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Company Profile</h2>
            {!isEditingInfo ? (
              <Button variant="primary" onClick={() => setIsEditingInfo(true)}>
                Edit
              </Button>
            ) : (
              <div className="space-x-2">
                <Button onClick={() => setIsEditingInfo(false)}>Cancel</Button>
                <Button variant="primary" onClick={handleUpdateProfile}>
                  Save
                </Button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company Name
              </label>
              <Input
                value={companyFormValues.companyName}
                onChange={(e) =>
                  setCompanyFormValues({
                    ...companyFormValues,
                    companyName: e.target.value,
                  })
                }
                disabled={!isEditingInfo}
                placeholder="Enter company name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <Input
                value={companyFormValues.email}
                onChange={(e) => {
                  setCompanyFormValues({
                    ...companyFormValues,
                    email: e.target.value,
                  });
                }}
                disabled={!isEditingInfo}
                placeholder="Enter email"
                type="email"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Website
              </label>
              <Input
                value={companyFormValues.website}
                onChange={(e) =>
                  setCompanyFormValues({
                    ...companyFormValues,
                    website: e.target.value,
                  })
                }
                disabled={!isEditingInfo}
                placeholder="Enter website"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <Input
                value={companyFormValues.phone}
                onChange={(e) =>
                  setCompanyFormValues({
                    ...companyFormValues,
                    phone: e.target.value,
                  })
                }
                disabled={!isEditingInfo}
                placeholder="Enter phone number"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <Input
                value={companyFormValues.address}
                onChange={(e) =>
                  setCompanyFormValues({
                    ...companyFormValues,
                    address: e.target.value,
                  })
                }
                disabled={!isEditingInfo}
                placeholder="Enter address"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Domain
              </label>
              <Input
                value={companyFormValues.domain}
                onChange={(e) =>
                  setCompanyFormValues({
                    ...companyFormValues,
                    domain: e.target.value,
                  })
                }
                disabled={!isEditingInfo}
                placeholder="Enter domain"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={companyFormValues.description}
                onChange={(e) =>
                  setCompanyFormValues({
                    ...companyFormValues,
                    description: e.target.value,
                  })
                }
                disabled={!isEditingInfo}
                placeholder="Enter company description"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                rows={4}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Logo
              </label>
              <div className="mt-1 flex items-center">
                {companyFormValues.logo && (
                  <img
                    src={
                      selectedLogo
                        ? URL.createObjectURL(selectedLogo)
                        : getImageUrl(companyFormValues.logo)
                    }
                    alt="Company Logo"
                    className="h-12 w-12 object-cover rounded-full mr-4"
                  />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "logo")}
                  disabled={!isEditingInfo}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-indigo-50 file:text-indigo-700
                    hover:file:bg-indigo-100"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Wallpaper
              </label>
              <div className="mt-1 flex items-center">
                {companyFormValues.wallPaper && (
                  <img
                    src={
                      selectedWallpaper
                        ? URL.createObjectURL(selectedWallpaper)
                        : getImageUrl(companyFormValues.wallPaper)
                    }
                    alt="Company Wallpaper"
                    className="h-24 w-full object-cover rounded-lg mb-4"
                  />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "wallpaper")}
                  disabled={!isEditingInfo}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-indigo-50 file:text-indigo-700
                    hover:file:bg-indigo-100"
                />
              </div>
            </div>
          </div>
        </div>
      );
    }
  };

  return <div className="container mx-auto px-4 py-8">{renderContent()}</div>;
};
