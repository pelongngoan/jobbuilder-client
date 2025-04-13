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
} from "lucide-react";
import { Button } from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Navigation } from "../components/Navigation";

type JobFormStep = "basic" | "details" | "requirements" | "preview";

interface JobFormData {
  title: string;
  company: string;
  location: string;
  jobType: string;
  salary: {
    min: string;
    max: string;
    currency: string;
    period: string;
  };
  description: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
  applicationDeadline: string;
  contactEmail: string;
  contactPhone: string;
  website: string;
  logo: string;
}

export const PostJob = () => {
  const [currentStep, setCurrentStep] = useState<JobFormStep>("basic");
  const [formData, setFormData] = useState<JobFormData>({
    title: "",
    company: "",
    location: "",
    jobType: "full-time",
    salary: {
      min: "",
      max: "",
      currency: "USD",
      period: "year",
    },
    description: "",
    responsibilities: [""],
    requirements: [""],
    benefits: [""],
    applicationDeadline: "",
    contactEmail: "",
    contactPhone: "",
    website: "",
    logo: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSalaryChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      salary: {
        ...prev.salary,
        [field]: value,
      },
    }));
  };

  const handleArrayItemChange = (
    field: string,
    index: number,
    value: string
  ) => {
    setFormData((prev) => {
      const newArray = [...(prev[field as keyof JobFormData] as string[])];
      newArray[index] = value;
      return {
        ...prev,
        [field]: newArray,
      };
    });
  };

  const addArrayItem = (field: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...(prev[field as keyof JobFormData] as string[]), ""],
    }));
  };

  const removeArrayItem = (field: string, index: number) => {
    setFormData((prev) => {
      const newArray = [...(prev[field as keyof JobFormData] as string[])];
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
    // Here you would typically submit the job data to your backend
    console.log("Submitting job:", formData);
    // Reset form and redirect to job listings or confirmation page
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
            value={formData.company}
            onChange={(e) => handleInputChange("company", e.target.value)}
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
            Job Type <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              "full-time",
              "part-time",
              "contract",
              "internship",
              "temporary",
              "remote",
            ].map((type) => (
              <button
                key={type}
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  formData.jobType === type
                    ? "bg-blue-100 text-blue-800"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
                onClick={() => handleInputChange("jobType", type)}
              >
                {type.charAt(0).toUpperCase() + type.slice(1).replace("-", " ")}
              </button>
            ))}
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Salary Range
          </label>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
            <div className="relative">
              <Input
                value={formData.salary.min}
                onChange={(e) => handleSalaryChange("min", e.target.value)}
                placeholder="Min"
              />
            </div>
            <div className="relative">
              <Input
                value={formData.salary.max}
                onChange={(e) => handleSalaryChange("max", e.target.value)}
                placeholder="Max"
              />
            </div>
            <div>
              <select
                value={formData.salary.currency}
                onChange={(e) => handleSalaryChange("currency", e.target.value)}
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
                value={formData.salary.period}
                onChange={(e) => handleSalaryChange("period", e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="hour">Per Hour</option>
                <option value="day">Per Day</option>
                <option value="week">Per Week</option>
                <option value="month">Per Month</option>
                <option value="year">Per Year</option>
              </select>
            </div>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Leave blank if salary is negotiable or not specified
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
          {formData.responsibilities.map((item, index) => (
            <div key={index} className="flex items-center">
              <Input
                value={item}
                onChange={(e) =>
                  handleArrayItemChange(
                    "responsibilities",
                    index,
                    e.target.value
                  )
                }
                placeholder={`Responsibility ${index + 1}`}
              />
              <button
                className="ml-2 text-red-500 hover:text-red-700"
                onClick={() => removeArrayItem("responsibilities", index)}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Plus className="h-4 w-4" />}
            onClick={() => addArrayItem("responsibilities")}
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
            value={formData.applicationDeadline}
            onChange={(e) =>
              handleInputChange("applicationDeadline", e.target.value)
            }
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Company Website
          </label>
          <Input
            value={formData.website}
            onChange={(e) => handleInputChange("website", e.target.value)}
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
          Job Requirements
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
          Required Skills & Qualifications{" "}
          <span className="text-red-500">*</span>
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
          {formData.logo ? (
            <div className="relative w-24 h-24 mr-4">
              <img
                src={formData.logo}
                alt="Company logo"
                className="w-full h-full object-contain border border-slate-200 rounded-md"
              />
              <button
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                onClick={() => handleInputChange("logo", "")}
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
            >
              Upload Logo
            </Button>
            <p className="mt-1 text-xs text-slate-500">
              Recommended size: 200x200px, max 2MB
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
            {formData.logo ? (
              <img
                src={formData.logo}
                alt={formData.company}
                className="w-16 h-16 object-contain bg-white rounded-md p-1 mr-4"
              />
            ) : (
              <div className="w-16 h-16 bg-white rounded-md flex items-center justify-center mr-4">
                <Building className="h-8 w-8 text-blue-600" />
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold">{formData.title}</h1>
              <p className="text-blue-100">{formData.company}</p>
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
                {formData.salary.min && formData.salary.max
                  ? `${formData.salary.currency} ${formData.salary.min} - ${formData.salary.max} ${formData.salary.period}`
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

          {formData.responsibilities.length > 0 &&
            formData.responsibilities[0] !== "" && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-2">
                  Key Responsibilities
                </h2>
                <ul className="list-disc pl-5 space-y-1 text-slate-700">
                  {formData.responsibilities.map((item, index) => (
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

          <div className="border-t border-slate-200 pt-4 mt-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-2">
              How to Apply
            </h2>
            <p className="text-slate-700 mb-2">
              Please send your resume and cover letter to{" "}
              <a
                href={`mailto:${formData.contactEmail}`}
                className="text-blue-600 hover:underline"
              >
                {formData.contactEmail}
              </a>
              {formData.contactPhone && ` or call ${formData.contactPhone}`}.
            </p>
            {formData.applicationDeadline && (
              <p className="text-slate-700">
                <span className="font-medium">Application Deadline:</span>{" "}
                {new Date(formData.applicationDeadline).toLocaleDateString()}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

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
          Post Job
        </Button>
      </div>
    </div>
  );

  const renderContent = () => {
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
    <>
      <Navigation />
      <div className="min-h-screen bg-slate-50 pt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-slate-900">Post a Job</h1>
              <p className="text-slate-600 mt-2">
                Fill out the form below to create your job listing. Fields
                marked with <span className="text-red-500">*</span> are
                required.
              </p>
            </div>

            <Card>
              <CardContent className="p-6">{renderContent()}</CardContent>
            </Card>

            <div className="mt-6 flex items-center text-sm text-slate-500">
              <HelpCircle className="h-4 w-4 mr-2" />
              <p>
                Need help? Contact our support team at{" "}
                <a
                  href="mailto:support@jobbuilder.com"
                  className="text-blue-600 hover:underline"
                >
                  support@jobbuilder.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
