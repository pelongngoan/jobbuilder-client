import { useState } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Award,
  Edit,
  Save,
  X,
  Camera,
  Plus,
  Trash2,
  Link,
  Globe,
  Lock,
  Bell,
  Settings,
} from "lucide-react";
import { Button } from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Navigation } from "../components/Navigation";

type ProfileSection =
  | "personal"
  | "skills"
  | "experience"
  | "education"
  | "settings";

export const Profile = () => {
  const [activeSection, setActiveSection] =
    useState<ProfileSection>("personal");
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "John Doe",
    title: "Senior Frontend Developer",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    bio: "Experienced frontend developer with a passion for creating beautiful and functional user interfaces. Skilled in React, TypeScript, and modern web technologies.",
    avatar:
      "https://ui-avatars.com/api/?name=John+Doe&background=6366f1&color=fff",
    skills: [
      "React",
      "TypeScript",
      "JavaScript",
      "HTML",
      "CSS",
      "Tailwind CSS",
      "Next.js",
      "Node.js",
    ],
    experience: [
      {
        id: 1,
        title: "Senior Frontend Developer",
        company: "TechCorp Inc.",
        location: "San Francisco, CA",
        startDate: "Jan 2020",
        endDate: "Present",
        description:
          "Leading the frontend development team, implementing new features, and improving performance.",
      },
      {
        id: 2,
        title: "Frontend Developer",
        company: "WebSolutions",
        location: "New York, NY",
        startDate: "Mar 2017",
        endDate: "Dec 2019",
        description:
          "Developed responsive web applications using React and Redux.",
      },
    ],
    education: [
      {
        id: 1,
        degree: "Bachelor of Science in Computer Science",
        school: "University of Technology",
        location: "Boston, MA",
        startDate: "2013",
        endDate: "2017",
        description: "Graduated with honors, specialized in Web Development.",
      },
    ],
    links: [
      { id: 1, title: "LinkedIn", url: "https://linkedin.com/in/johndoe" },
      { id: 2, title: "GitHub", url: "https://github.com/johndoe" },
      { id: 3, title: "Portfolio", url: "https://johndoe.dev" },
    ],
  });

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
    // Here you would typically save the data to your backend
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data to original values
  };

  const handleInputChange = (field: string, value: string) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const renderPersonalInfo = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-900">
          Personal Information
        </h2>
        {!isEditing && (
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Edit className="h-4 w-4" />}
            onClick={handleEdit}
          >
            Edit
          </Button>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-shrink-0">
          <div className="relative">
            <img
              src={profileData.avatar}
              alt={profileData.name}
              className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md"
            />
            {isEditing && (
              <Button
                variant="outline"
                size="sm"
                className="absolute bottom-0 right-0 rounded-full bg-white"
                leftIcon={<Camera className="h-4 w-4" />}
              >
                Change
              </Button>
            )}
          </div>
        </div>

        <div className="flex-1 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Full Name
              </label>
              {isEditing ? (
                <Input
                  value={profileData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Your full name"
                />
              ) : (
                <div className="flex items-center text-slate-900">
                  <User className="h-4 w-4 mr-2 text-slate-500" />
                  <span>{profileData.name}</span>
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Professional Title
              </label>
              {isEditing ? (
                <Input
                  value={profileData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="Your professional title"
                />
              ) : (
                <div className="flex items-center text-slate-900">
                  <Briefcase className="h-4 w-4 mr-2 text-slate-500" />
                  <span>{profileData.title}</span>
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Email
              </label>
              {isEditing ? (
                <Input
                  value={profileData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Your email address"
                />
              ) : (
                <div className="flex items-center text-slate-900">
                  <Mail className="h-4 w-4 mr-2 text-slate-500" />
                  <span>{profileData.email}</span>
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Phone
              </label>
              {isEditing ? (
                <Input
                  value={profileData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="Your phone number"
                />
              ) : (
                <div className="flex items-center text-slate-900">
                  <Phone className="h-4 w-4 mr-2 text-slate-500" />
                  <span>{profileData.phone}</span>
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Location
              </label>
              {isEditing ? (
                <Input
                  value={profileData.location}
                  onChange={(e) =>
                    handleInputChange("location", e.target.value)
                  }
                  placeholder="Your location"
                />
              ) : (
                <div className="flex items-center text-slate-900">
                  <MapPin className="h-4 w-4 mr-2 text-slate-500" />
                  <span>{profileData.location}</span>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Bio
            </label>
            {isEditing ? (
              <textarea
                value={profileData.bio}
                onChange={(e) => handleInputChange("bio", e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                rows={4}
                placeholder="Tell us about yourself"
              />
            ) : (
              <p className="text-slate-700">{profileData.bio}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Links
            </label>
            <div className="space-y-2">
              {profileData.links.map((link) => (
                <div key={link.id} className="flex items-center">
                  <Link className="h-4 w-4 mr-2 text-slate-500" />
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {link.title}
                  </a>
                </div>
              ))}
              {isEditing && (
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<Plus className="h-4 w-4" />}
                >
                  Add Link
                </Button>
              )}
            </div>
          </div>

          {isEditing && (
            <div className="flex gap-2 pt-4">
              <Button
                leftIcon={<Save className="h-4 w-4" />}
                onClick={handleSave}
              >
                Save Changes
              </Button>
              <Button
                variant="outline"
                leftIcon={<X className="h-4 w-4" />}
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderSkills = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-900">Skills</h2>
        {!isEditing && (
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Edit className="h-4 w-4" />}
            onClick={handleEdit}
          >
            Edit
          </Button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {profileData.skills.map((skill, index) => (
          <div
            key={index}
            className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium flex items-center"
          >
            {skill}
            {isEditing && (
              <button
                className="ml-2 text-blue-600 hover:text-blue-800"
                onClick={() => {
                  setProfileData((prev) => ({
                    ...prev,
                    skills: prev.skills.filter((_, i) => i !== index),
                  }));
                }}
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        ))}
        {isEditing && (
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Plus className="h-4 w-4" />}
          >
            Add Skill
          </Button>
        )}
      </div>

      {isEditing && (
        <div className="flex gap-2 pt-4">
          <Button leftIcon={<Save className="h-4 w-4" />} onClick={handleSave}>
            Save Changes
          </Button>
          <Button
            variant="outline"
            leftIcon={<X className="h-4 w-4" />}
            onClick={handleCancel}
          >
            Cancel
          </Button>
        </div>
      )}
    </div>
  );

  const renderExperience = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-900">
          Work Experience
        </h2>
        {!isEditing && (
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Plus className="h-4 w-4" />}
            onClick={handleEdit}
          >
            Add Experience
          </Button>
        )}
      </div>

      <div className="space-y-6">
        {profileData.experience.map((exp) => (
          <Card
            key={exp.id}
            variant="bordered"
            className="group hover:border-blue-500"
          >
            <CardContent className="p-6">
              <div className="flex justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    {exp.title}
                  </h3>
                  <div className="flex items-center text-slate-600 mt-1">
                    <Briefcase className="h-4 w-4 mr-2" />
                    <span>{exp.company}</span>
                  </div>
                  <div className="flex items-center text-slate-600 mt-1">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>{exp.location}</span>
                  </div>
                  <div className="flex items-center text-slate-600 mt-1">
                    <span className="text-sm">
                      {exp.startDate} - {exp.endDate}
                    </span>
                  </div>
                </div>
                {isEditing && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    leftIcon={<Trash2 className="h-4 w-4" />}
                  >
                    Delete
                  </Button>
                )}
              </div>
              <p className="text-slate-700 mt-4">{exp.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {isEditing && (
        <div className="flex gap-2 pt-4">
          <Button leftIcon={<Save className="h-4 w-4" />} onClick={handleSave}>
            Save Changes
          </Button>
          <Button
            variant="outline"
            leftIcon={<X className="h-4 w-4" />}
            onClick={handleCancel}
          >
            Cancel
          </Button>
        </div>
      )}
    </div>
  );

  const renderEducation = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-900">Education</h2>
        {!isEditing && (
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Plus className="h-4 w-4" />}
            onClick={handleEdit}
          >
            Add Education
          </Button>
        )}
      </div>

      <div className="space-y-6">
        {profileData.education.map((edu) => (
          <Card
            key={edu.id}
            variant="bordered"
            className="group hover:border-blue-500"
          >
            <CardContent className="p-6">
              <div className="flex justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    {edu.degree}
                  </h3>
                  <div className="flex items-center text-slate-600 mt-1">
                    <GraduationCap className="h-4 w-4 mr-2" />
                    <span>{edu.school}</span>
                  </div>
                  <div className="flex items-center text-slate-600 mt-1">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>{edu.location}</span>
                  </div>
                  <div className="flex items-center text-slate-600 mt-1">
                    <span className="text-sm">
                      {edu.startDate} - {edu.endDate}
                    </span>
                  </div>
                </div>
                {isEditing && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    leftIcon={<Trash2 className="h-4 w-4" />}
                  >
                    Delete
                  </Button>
                )}
              </div>
              <p className="text-slate-700 mt-4">{edu.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {isEditing && (
        <div className="flex gap-2 pt-4">
          <Button leftIcon={<Save className="h-4 w-4" />} onClick={handleSave}>
            Save Changes
          </Button>
          <Button
            variant="outline"
            leftIcon={<X className="h-4 w-4" />}
            onClick={handleCancel}
          >
            Cancel
          </Button>
        </div>
      )}
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-slate-900">Account Settings</h2>

      <div className="space-y-4">
        <Card variant="bordered">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-full mr-4">
                  <Lock className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    Password
                  </h3>
                  <p className="text-slate-600">Change your password</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Change
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card variant="bordered">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-full mr-4">
                  <Bell className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    Notifications
                  </h3>
                  <p className="text-slate-600">
                    Manage your notification preferences
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Manage
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card variant="bordered">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-full mr-4">
                  <Globe className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    Privacy
                  </h3>
                  <p className="text-slate-600">
                    Control your profile visibility
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Manage
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card variant="bordered">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-full mr-4">
                  <Settings className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    Preferences
                  </h3>
                  <p className="text-slate-600">Customize your experience</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Manage
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case "personal":
        return renderPersonalInfo();
      case "skills":
        return renderSkills();
      case "experience":
        return renderExperience();
      case "education":
        return renderEducation();
      case "settings":
        return renderSettings();
      default:
        return renderPersonalInfo();
    }
  };

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-slate-50 pt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Sidebar */}
            <div className="w-full md:w-64 flex-shrink-0">
              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-col items-center mb-6">
                    <img
                      src={profileData.avatar}
                      alt={profileData.name}
                      className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md mb-4"
                    />
                    <h2 className="text-xl font-semibold text-slate-900">
                      {profileData.name}
                    </h2>
                    <p className="text-slate-600 text-center">
                      {profileData.title}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <button
                      className={`w-full flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                        activeSection === "personal"
                          ? "bg-blue-100 text-blue-800"
                          : "text-slate-700 hover:bg-slate-100"
                      }`}
                      onClick={() => setActiveSection("personal")}
                    >
                      <User className="h-4 w-4 mr-2" />
                      Personal Info
                    </button>
                    <button
                      className={`w-full flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                        activeSection === "skills"
                          ? "bg-blue-100 text-blue-800"
                          : "text-slate-700 hover:bg-slate-100"
                      }`}
                      onClick={() => setActiveSection("skills")}
                    >
                      <Award className="h-4 w-4 mr-2" />
                      Skills
                    </button>
                    <button
                      className={`w-full flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                        activeSection === "experience"
                          ? "bg-blue-100 text-blue-800"
                          : "text-slate-700 hover:bg-slate-100"
                      }`}
                      onClick={() => setActiveSection("experience")}
                    >
                      <Briefcase className="h-4 w-4 mr-2" />
                      Experience
                    </button>
                    <button
                      className={`w-full flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                        activeSection === "education"
                          ? "bg-blue-100 text-blue-800"
                          : "text-slate-700 hover:bg-slate-100"
                      }`}
                      onClick={() => setActiveSection("education")}
                    >
                      <GraduationCap className="h-4 w-4 mr-2" />
                      Education
                    </button>
                    <button
                      className={`w-full flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                        activeSection === "settings"
                          ? "bg-blue-100 text-blue-800"
                          : "text-slate-700 hover:bg-slate-100"
                      }`}
                      onClick={() => setActiveSection("settings")}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              <Card>
                <CardContent className="p-6">{renderContent()}</CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
