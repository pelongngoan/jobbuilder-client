import React, { useEffect, useState } from "react";
import { useUserProfile } from "../../hooks/useUserProfile";
import { useLoading } from "../../hooks/useLoading";
import { Button, Card, Input, TextArea } from "../../components/common";
import { UserProfileUpdateRequest } from "../../types";

const UserProfilePage: React.FC = () => {
  const {
    profile,
    fetchUserProfile,
    updateProfile,
    addExperience,
    updateExperience,
    deleteExperience,
    addEducation,
    updateEducation,
    deleteEducation,
    addCertification,
    updateCertification,
    deleteCertification,
    addProject,
    updateProject,
    deleteProject,
  } = useUserProfile();

  const [formData, setFormData] = useState<UserProfileUpdateRequest>({
    firstName: "",
    lastName: "",
    headline: "",
    about: "",
    location: "",
    phoneNumber: "",
  });

  const isLoading = useLoading("getUserProfile");
  const isUpdating = useLoading("updateUserProfile");

  useEffect(() => {
    fetchUserProfile();
  }, []);

  useEffect(() => {
    if (profile) {
      setFormData({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        headline: profile.headline || "",
        about: profile.about || "",
        location: profile.location || "",
        phoneNumber: profile.phoneNumber || "",
      });
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await updateProfile(formData);
  };

  if (isLoading) return <div className="p-4">Loading profile...</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>

      <Card className="mb-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <Input
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Input
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <Input
              label="Headline"
              name="headline"
              value={formData.headline}
              onChange={handleChange}
              placeholder="e.g., Software Engineer at Company X"
            />
          </div>

          <div className="mb-4">
            <TextArea
              label="About"
              name="about"
              value={formData.about}
              onChange={handleChange}
              rows={4}
              placeholder="Tell us about yourself"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <Input
                label="Location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., New York, NY"
              />
            </div>
            <div>
              <Input
                label="Phone Number"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="e.g., +1 123-456-7890"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" variant="primary" disabled={isUpdating}>
              {isUpdating ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </Card>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Work Experience</h2>
          <Button variant="outline" size="sm">
            Add Experience
          </Button>
        </div>
        {profile?.experience && profile.experience.length > 0 ? (
          profile.experience.map((exp) => (
            <Card key={exp._id} className="mb-4 p-4">
              <div className="flex justify-between mb-2">
                <h3 className="font-semibold">{exp.title}</h3>
                <div className="flex space-x-2">
                  <Button variant="text" size="sm">
                    Edit
                  </Button>
                  <Button
                    variant="text"
                    size="sm"
                    onClick={() => deleteExperience(exp._id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
              <p className="text-gray-700">{exp.company}</p>
              <p className="text-gray-500 text-sm">
                {exp.startDate} - {exp.endDate || "Present"}
              </p>
              <p className="mt-2">{exp.description}</p>
            </Card>
          ))
        ) : (
          <p className="text-gray-500">No experience added yet.</p>
        )}
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Education</h2>
          <Button variant="outline" size="sm">
            Add Education
          </Button>
        </div>
        {profile?.education && profile.education.length > 0 ? (
          profile.education.map((edu) => (
            <Card key={edu._id} className="mb-4 p-4">
              <div className="flex justify-between mb-2">
                <h3 className="font-semibold">{edu.degree}</h3>
                <div className="flex space-x-2">
                  <Button variant="text" size="sm">
                    Edit
                  </Button>
                  <Button
                    variant="text"
                    size="sm"
                    onClick={() => deleteEducation(edu._id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
              <p className="text-gray-700">{edu.institution}</p>
              <p className="text-gray-500 text-sm">
                {edu.startDate} - {edu.endDate || "Present"}
              </p>
              <p className="mt-2">{edu.description}</p>
            </Card>
          ))
        ) : (
          <p className="text-gray-500">No education added yet.</p>
        )}
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Certifications</h2>
          <Button variant="outline" size="sm">
            Add Certification
          </Button>
        </div>
        {profile?.certifications && profile.certifications.length > 0 ? (
          profile.certifications.map((cert) => (
            <Card key={cert._id} className="mb-4 p-4">
              <div className="flex justify-between mb-2">
                <h3 className="font-semibold">{cert.name}</h3>
                <div className="flex space-x-2">
                  <Button variant="text" size="sm">
                    Edit
                  </Button>
                  <Button
                    variant="text"
                    size="sm"
                    onClick={() => deleteCertification(cert._id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
              <p className="text-gray-700">{cert.issuingOrganization}</p>
              <p className="text-gray-500 text-sm">
                Issued: {cert.issueDate}{" "}
                {cert.expirationDate && `- Expires: ${cert.expirationDate}`}
              </p>
            </Card>
          ))
        ) : (
          <p className="text-gray-500">No certifications added yet.</p>
        )}
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Projects</h2>
          <Button variant="outline" size="sm">
            Add Project
          </Button>
        </div>
        {profile?.projects && profile.projects.length > 0 ? (
          profile.projects.map((proj) => (
            <Card key={proj._id} className="mb-4 p-4">
              <div className="flex justify-between mb-2">
                <h3 className="font-semibold">{proj.title}</h3>
                <div className="flex space-x-2">
                  <Button variant="text" size="sm">
                    Edit
                  </Button>
                  <Button
                    variant="text"
                    size="sm"
                    onClick={() => deleteProject(proj._id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
              <p className="text-gray-500 text-sm">
                {proj.startDate} - {proj.endDate || "Present"}
              </p>
              <p className="mt-2">{proj.description}</p>
              {proj.url && (
                <a
                  href={proj.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 mt-2 inline-block"
                >
                  View Project
                </a>
              )}
            </Card>
          ))
        ) : (
          <p className="text-gray-500">No projects added yet.</p>
        )}
      </div>
    </div>
  );
};

export default UserProfilePage;
