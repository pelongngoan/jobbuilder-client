import { useState } from "react";
import {
  Briefcase,
  Building,
  MapPin,
  DollarSign,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  X,
  Plus,
  Trash2,
  Upload,
  HelpCircle,
  Tag,
} from "lucide-react";
import { Button } from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Navigation } from "../components/Navigation";

type JobFormStep = "basic" | "details" | "requirements" | "preview";

// Interface aligned with MongoDB schema
interface JobFormData {
  // Required fields
  title: string;
  companyId: string; // Will be populated from auth context
  hrId: string; // Will be populated from auth context
  location: string;
  jobType: "full-time" | "part-time" | "contract" | "internship" | "remote";
  salaryCurrency: string;
  description: string;

  // Optional fields
  salaryRange: string;
  salaryType: "hourly" | "monthly" | "yearly";
  keyResponsibilities: string[];
  benefits: string[];
  status: "open" | "closed";
  deadline: string;
  requirements: string[];
  contactEmail: string;
  contactPhone: string;
  logoCompany: string;
  companyName: string;
  companyWebsite: string;
  category: string;

  // Custom 'other' fields
  other: {
    title1: string;
    description1: string;
    title2: string;
    description2: string;
    title3: string;
    description3: string;
    title4: string;
    description4: string;
    title5: string;
    description5: string;
  };
}

export const PostJob = () => {
  const [currentStep, setCurrentStep] = useState<JobFormStep>("basic");
  const [formData, setFormData] = useState<JobFormData>({
    // Required fields with initial values
    title: "",
    companyId: "placeholder-company-id", // Would be populated from auth context
    hrId: "placeholder-hr-id", // Would be populated from auth context
    location: "",
    jobType: "full-time",
    salaryCurrency: "USD",
    description: "",

    // Optional fields with initial values
    salaryRange: "",
    salaryType: "yearly",
    keyResponsibilities: [""],
    benefits: [""],
    status: "open",
    deadline: "",
    requirements: [""],
    contactEmail: "",
    contactPhone: "",
    logoCompany: "",
    companyName: "",
    companyWebsite: "",
    category: "",

    // Custom 'other' fields
    other: {
      title1: "",
      description1: "",
      title2: "",
      description2: "",
      title3: "",
      description3: "",
      title4: "",
      description4: "",
      title5: "",
      description5: "",
    },
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleOtherFieldChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      other: {
        ...prev.other,
        [field]: value,
      },
    }));
  };

  const handleArrayItemChange = (
    field: keyof JobFormData,
    index: number,
    value: string
  ) => {
    setFormData((prev) => {
      const newArray = [...(prev[field] as string[])];
      newArray[index] = value;
      return {
        ...prev,
        [field]: newArray,
      };
    });
  };

  const addArrayItem = (field: keyof JobFormData) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...(prev[field] as string[]), ""],
    }));
  };

  const removeArrayItem = (field: keyof JobFormData, index: number) => {
    setFormData((prev) => {
      const newArray = [...(prev[field] as string[])];
      newArray.splice(index, 1);
      return {
        ...prev,
        [field]: newArray,
      };
    });
  };

  const handleNext = () => {
    switch (currentStep) {
      case "basic":
        setCurrentStep("details");
        break;
      case "details":
        setCurrentStep("requirements");
        break;
      case "requirements":
        setCurrentStep("preview");
        break;
      default:
        break;
    }
  };

  const handleBack = () => {
    switch (currentStep) {
      case "details":
        setCurrentStep("basic");
        break;
      case "requirements":
        setCurrentStep("details");
        break;
      case "preview":
        setCurrentStep("requirements");
        break;
      default:
        break;
    }
  };

  const handleSubmit = () => {
    // Prepare data for API submission
    const jobData = {
      ...formData,
      // Clean up empty arrays
      keyResponsibilities: formData.keyResponsibilities.filter(
        (item) => item.trim() !== ""
      ),
      requirements: formData.requirements.filter((item) => item.trim() !== ""),
      benefits: formData.benefits.filter((item) => item.trim() !== ""),
      // Clean up other fields
      other: Object.fromEntries(
        Object.entries(formData.other).filter(
          ([_, value]) => value.trim() !== ""
        )
      ),
    };

    console.log("Submitting job:", jobData);
    // Here you would submit the job data to your API
    // e.g., axios.post('/api/jobs', jobData)
  };

  const renderBasicInfo = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-900">
          Basic Information
        </h2>
        <div className="flex items-center text-sm text-slate-500">
          <span className="mr-2">Step 1 of 4</span>
          <div className="flex space-x-1">
            <div className="w-3 h-3 rounded-full bg-blue-600"></div>
            <div className="w-3 h-3 rounded-full bg-slate-200"></div>
            <div className="w-3 h-3 rounded-full bg-slate-200"></div>
            <div className="w-3 h-3 rounded-full bg-slate-200"></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Job Title <span className="text-red-500">*</span>
          </label>
          <Input
            value={formData.title}
            onChange={(e) => handleInputChange("title", e.target.value)}
            placeholder="e.g. Senior Frontend Developer"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Company Name <span className="text-red-500">*</span>
          </label>
          <Input
            value={formData.companyName}
            onChange={(e) => handleInputChange("companyName", e.target.value)}
            placeholder="e.g. TechCorp Inc."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Location <span className="text-red-500">*</span>
          </label>
          <Input
            value={formData.location}
            onChange={(e) => handleInputChange("location", e.target.value)}
            placeholder="e.g. San Francisco, CA or Remote"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Job Category
          </label>
          <Input
            value={formData.category}
            onChange={(e) => handleInputChange("category", e.target.value)}
            placeholder="e.g. Technology, Marketing, Finance"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Job Type <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {["full-time", "part-time", "contract", "internship", "remote"].map(
              (type) => (
                <button
                  key={type}
                  className={`px-3 py-2 text-sm font-medium rounded-md ${
                    formData.jobType === type
                      ? "bg-blue-100 text-blue-800"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                  onClick={() => handleInputChange("jobType", type as any)}
                >
                  {type.charAt(0).toUpperCase() +
                    type.slice(1).replace("-", " ")}
                </button>
              )
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Status
          </label>
          <div className="grid grid-cols-2 gap-2">
            {["open", "closed"].map((status) => (
              <button
                key={status}
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  formData.status === status
                    ? "bg-blue-100 text-blue-800"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
                onClick={() => handleInputChange("status", status as any)}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Salary Information
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <div className="relative">
              <Input
                value={formData.salaryRange}
                onChange={(e) =>
                  handleInputChange("salaryRange", e.target.value)
                }
                placeholder="e.g. 50000-70000 or Negotiable"
              />
            </div>
            <div>
              <select
                value={formData.salaryCurrency}
                onChange={(e) =>
                  handleInputChange("salaryCurrency", e.target.value)
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="CAD">CAD</option>
                <option value="AUD">AUD</option>
              </select>
            </div>
            <div>
              <select
                value={formData.salaryType}
                onChange={(e) =>
                  handleInputChange("salaryType", e.target.value as any)
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="hourly">Hourly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Leave salary range blank if salary is negotiable
          </p>
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          onClick={handleNext}
          rightIcon={<ArrowRight className="h-4 w-4" />}
        >
          Next: Job Details
        </Button>
      </div>
    </div>
  );

  const renderJobDetails = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-900">Job Details</h2>
        <div className="flex items-center text-sm text-slate-500">
          <span className="mr-2">Step 2 of 4</span>
          <div className="flex space-x-1">
            <div className="w-3 h-3 rounded-full bg-blue-600"></div>
            <div className="w-3 h-3 rounded-full bg-blue-600"></div>
            <div className="w-3 h-3 rounded-full bg-slate-200"></div>
            <div className="w-3 h-3 rounded-full bg-slate-200"></div>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Job Description <span className="text-red-500">*</span>
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => handleInputChange("description", e.target.value)}
          className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          rows={6}
          placeholder="Provide a detailed description of the job, including key responsibilities and what makes this role unique..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Key Responsibilities
        </label>
        <div className="space-y-2">
          {formData.keyResponsibilities.map((item, index) => (
            <div key={index} className="flex items-center">
              <Input
                value={item}
                onChange={(e) =>
                  handleArrayItemChange(
                    "keyResponsibilities",
                    index,
                    e.target.value
                  )
                }
                placeholder={`Responsibility ${index + 1}`}
              />
              <button
                className="ml-2 text-red-500 hover:text-red-700"
                onClick={() => removeArrayItem("keyResponsibilities", index)}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Plus className="h-4 w-4" />}
            onClick={() => addArrayItem("keyResponsibilities")}
          >
            Add Responsibility
          </Button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Benefits
        </label>
        <div className="space-y-2">
          {formData.benefits.map((item, index) => (
            <div key={index} className="flex items-center">
              <Input
                value={item}
                onChange={(e) =>
                  handleArrayItemChange("benefits", index, e.target.value)
                }
                placeholder={`Benefit ${index + 1}`}
              />
              <button
                className="ml-2 text-red-500 hover:text-red-700"
                onClick={() => removeArrayItem("benefits", index)}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Plus className="h-4 w-4" />}
            onClick={() => addArrayItem("benefits")}
          >
            Add Benefit
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Application Deadline
          </label>
          <Input
            type="date"
            value={formData.deadline}
            onChange={(e) => handleInputChange("deadline", e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Company Website
          </label>
          <Input
            value={formData.companyWebsite}
            onChange={(e) =>
              handleInputChange("companyWebsite", e.target.value)
            }
            placeholder="https://example.com"
          />
        </div>
      </div>

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handleBack}
          leftIcon={<ArrowLeft className="h-4 w-4" />}
        >
          Back
        </Button>
        <Button
          onClick={handleNext}
          rightIcon={<ArrowRight className="h-4 w-4" />}
        >
          Next: Requirements
        </Button>
      </div>
    </div>
  );

  const renderRequirements = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-900">
          Requirements & Contact
        </h2>
        <div className="flex items-center text-sm text-slate-500">
          <span className="mr-2">Step 3 of 4</span>
          <div className="flex space-x-1">
            <div className="w-3 h-3 rounded-full bg-blue-600"></div>
            <div className="w-3 h-3 rounded-full bg-blue-600"></div>
            <div className="w-3 h-3 rounded-full bg-blue-600"></div>
            <div className="w-3 h-3 rounded-full bg-slate-200"></div>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Requirements
        </label>
        <div className="space-y-2">
          {formData.requirements.map((item, index) => (
            <div key={index} className="flex items-center">
              <Input
                value={item}
                onChange={(e) =>
                  handleArrayItemChange("requirements", index, e.target.value)
                }
                placeholder={`Requirement ${index + 1}`}
              />
              <button
                className="ml-2 text-red-500 hover:text-red-700"
                onClick={() => removeArrayItem("requirements", index)}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Plus className="h-4 w-4" />}
            onClick={() => addArrayItem("requirements")}
          >
            Add Requirement
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Contact Email <span className="text-red-500">*</span>
          </label>
          <Input
            type="email"
            value={formData.contactEmail}
            onChange={(e) => handleInputChange("contactEmail", e.target.value)}
            placeholder="hr@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Contact Phone
          </label>
          <Input
            value={formData.contactPhone}
            onChange={(e) => handleInputChange("contactPhone", e.target.value)}
            placeholder="+1 (555) 123-4567"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Company Logo
        </label>
        <div className="flex items-center">
          {formData.logoCompany ? (
            <div className="relative w-24 h-24 mr-4">
              <img
                src={formData.logoCompany}
                alt="Company logo"
                className="w-full h-full object-contain border border-slate-200 rounded-md"
              />
              <button
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                onClick={() => handleInputChange("logoCompany", "")}
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ) : (
            <div className="w-24 h-24 border-2 border-dashed border-slate-300 rounded-md flex items-center justify-center mr-4">
              <Upload className="h-6 w-6 text-slate-400" />
            </div>
          )}
          <div>
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Upload className="h-4 w-4" />}
              onClick={() => {
                // In real implementation, this would open a file picker
                const mockUrl = "/api/placeholder/200/200";
                handleInputChange("logoCompany", mockUrl);
              }}
            >
              Upload Logo
            </Button>
            <p className="mt-1 text-xs text-slate-500">
              Recommended size: 200x200px, max 2MB
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4 border-t border-slate-200 pt-4">
        <h3 className="font-medium text-slate-800">Additional Job Fields</h3>
        <p className="text-sm text-slate-600">
          Use these fields for any additional information not covered above.
        </p>

        {[1, 2, 3, 4, 5].map((num) => (
          <div key={num} className="border border-slate-200 rounded-md p-4">
            <div className="flex items-center mb-2">
              <Tag className="h-4 w-4 mr-2 text-slate-500" />
              <h4 className="font-medium text-slate-700">Custom Field {num}</h4>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Field Title
                </label>
                <Input
                  value={
                    formData.other[`title${num}` as keyof typeof formData.other]
                  }
                  onChange={(e) =>
                    handleOtherFieldChange(`title${num}`, e.target.value)
                  }
                  placeholder="e.g. Experience Level, Remote Policy"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Field Description
                </label>
                <textarea
                  value={
                    formData.other[
                      `description${num}` as keyof typeof formData.other
                    ]
                  }
                  onChange={(e) =>
                    handleOtherFieldChange(`description${num}`, e.target.value)
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  rows={2}
                  placeholder="Enter details for this field"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handleBack}
          leftIcon={<ArrowLeft className="h-4 w-4" />}
        >
          Back
        </Button>
        <Button
          onClick={handleNext}
          rightIcon={<ArrowRight className="h-4 w-4" />}
        >
          Next: Preview
        </Button>
      </div>
    </div>
  );
  const renderPreview = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-900">
          Preview Job Posting
        </h2>
        <div className="flex items-center text-sm text-slate-500">
          <span className="mr-2">Step 4 of 4</span>
          <div className="flex space-x-1">
            <div className="w-3 h-3 rounded-full bg-blue-600"></div>
            <div className="w-3 h-3 rounded-full bg-blue-600"></div>
            <div className="w-3 h-3 rounded-full bg-blue-600"></div>
            <div className="w-3 h-3 rounded-full bg-blue-600"></div>
          </div>
        </div>
      </div>

      <Card variant="bordered" className="overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white">
          <div className="flex items-center">
            {formData.logoCompany ? (
              <img
                src={formData.logoCompany}
                alt={formData.companyName}
                className="w-16 h-16 object-contain bg-white rounded-md p-1 mr-4"
              />
            ) : (
              <div className="w-16 h-16 bg-white rounded-md flex items-center justify-center mr-4">
                <Building className="h-8 w-8 text-blue-600" />
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold">{formData.title}</h1>
              <p className="text-blue-100">
                {formData.companyName || "Company Name"}
              </p>
              <span className="inline-block px-2 py-1 text-xs rounded-full bg-blue-900 text-white mt-1">
                {formData.status.charAt(0).toUpperCase() +
                  formData.status.slice(1)}
              </span>
            </div>
          </div>
        </div>

        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="flex items-center text-slate-600">
              <MapPin className="h-4 w-4 mr-2 text-slate-500" />
              <span>{formData.location}</span>
            </div>
            <div className="flex items-center text-slate-600">
              <Briefcase className="h-4 w-4 mr-2 text-slate-500" />
              <span>
                {formData.jobType.charAt(0).toUpperCase() +
                  formData.jobType.slice(1).replace("-", " ")}
              </span>
            </div>
            <div className="flex items-center text-slate-600">
              <DollarSign className="h-4 w-4 mr-2 text-slate-500" />
              <span>
                {formData.salaryRange
                  ? `${formData.salaryCurrency} ${formData.salaryRange} per ${formData.salaryType}`
                  : "Salary negotiable"}
              </span>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-2">
              Job Description
            </h2>
            <p className="text-slate-700 whitespace-pre-line">
              {formData.description}
            </p>
          </div>

          {formData.keyResponsibilities.length > 0 &&
            formData.keyResponsibilities[0] !== "" && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-2">
                  Key Responsibilities
                </h2>
                <ul className="list-disc pl-5 space-y-1 text-slate-700">
                  {formData.keyResponsibilities.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

          {formData.requirements.length > 0 &&
            formData.requirements[0] !== "" && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-2">
                  Requirements
                </h2>
                <ul className="list-disc pl-5 space-y-1 text-slate-700">
                  {formData.requirements.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

          {formData.benefits.length > 0 && formData.benefits[0] !== "" && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-2">
                Benefits
              </h2>
              <ul className="list-disc pl-5 space-y-1 text-slate-700">
                {formData.benefits.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Display custom fields that have content */}
          {[1, 2, 3, 4, 5].map((num) => {
            const titleKey = `title${num}` as keyof typeof formData.other;
            const descKey = `description${num}` as keyof typeof formData.other;

            if (formData.other[titleKey] && formData.other[descKey]) {
              return (
                <div key={num} className="mb-6">
                  <h2 className="text-lg font-semibold text-slate-900 mb-2">
                    {formData.other[titleKey]}
                  </h2>
                  <p className="text-slate-700 whitespace-pre-line">
                    {formData.other[descKey]}
                  </p>
                </div>
              );
            }
            return null;
          })}

          <div className="border-t border-slate-200 pt-6 mt-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-2">
              Contact Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {formData.contactEmail && (
                <div className="flex items-center text-slate-600">
                  <span className="font-medium mr-2">Email:</span>
                  <span>{formData.contactEmail}</span>
                </div>
              )}
              {formData.contactPhone && (
                <div className="flex items-center text-slate-600">
                  <span className="font-medium mr-2">Phone:</span>
                  <span>{formData.contactPhone}</span>
                </div>
              )}
              {formData.companyWebsite && (
                <div className="flex items-center text-slate-600">
                  <span className="font-medium mr-2">Website:</span>
                  <span>{formData.companyWebsite}</span>
                </div>
              )}
              {formData.deadline && (
                <div className="flex items-center text-slate-600">
                  <span className="font-medium mr-2">
                    Application Deadline:
                  </span>
                  <span>
                    {new Date(formData.deadline).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-start">
          <HelpCircle className="h-5 w-5 text-blue-500 mr-3 mt-0.5" />
          <div>
            <h3 className="font-medium text-blue-800">Before Publishing</h3>
            <p className="text-sm text-blue-700 mt-1">
              Review all information carefully. Once published, your job posting
              will be visible to all potential candidates. Ensure all
              requirements and contact information are accurate.
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handleBack}
          leftIcon={<ArrowLeft className="h-4 w-4" />}
        >
          Back
        </Button>
        <Button
          onClick={handleSubmit}
          leftIcon={<CheckCircle className="h-4 w-4" />}
        >
          Publish Job Posting
        </Button>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case "basic":
        return renderBasicInfo();
      case "details":
        return renderJobDetails();
      case "requirements":
        return renderRequirements();
      case "preview":
        return renderPreview();
      default:
        return renderBasicInfo();
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">
          Post a New Job
        </h1>
        <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
          {renderCurrentStep()}
        </div>
      </div>
    </div>
  );
};

export default PostJob;
