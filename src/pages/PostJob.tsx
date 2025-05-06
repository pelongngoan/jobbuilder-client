import React, { useState, useEffect } from "react";
import { JobPost } from "../types/job";
import BasicInfoStep from "../components/admin/job-posts/BasicInfoStep";
import JobDetailsStep from "../components/admin/job-posts/JobDetailsStep";
import RequirementsStep from "../components/admin/job-posts/RequirementsStep";
import AdditionalFieldsStep from "../components/admin/job-posts/AdditionalFieldsStep";
import PreviewStep from "../components/admin/job-posts/PreviewStep";
import { createJob, updateJob } from "../lib/api/services/jobs";

type JobFormStep =
  | "basic"
  | "details"
  | "requirements"
  | "additional"
  | "preview";

// Interface aligned with MongoDB schema
export interface JobFormData {
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

interface PostJobProps {
  jobToEdit?: JobPost | null;
  onClose?: () => void;
}

export const PostJob: React.FC<PostJobProps> = ({
  jobToEdit = null,
  onClose,
}) => {
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Prefill form if editing
  useEffect(() => {
    if (jobToEdit) {
      console.log(jobToEdit);
      setFormData({
        ...formData,
        ...jobToEdit,
        keyResponsibilities: jobToEdit.keyResponsibilities || [""],
        benefits: jobToEdit.benefits || [""],
        requirements: jobToEdit.requirements || [""],
        jobType: (jobToEdit.jobType as JobFormData["jobType"]) || "full-time",
        salaryType:
          (jobToEdit.salaryType as JobFormData["salaryType"]) || "yearly",
        status: (jobToEdit.status as JobFormData["status"]) || "open",
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
          ...(jobToEdit.other || {}),
        },
      });
    }
    console.log(formData);
  }, [jobToEdit]);

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
        setCurrentStep("additional");
        break;
      case "additional":
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
      case "additional":
        setCurrentStep("requirements");
        break;
      case "preview":
        setCurrentStep("additional");
        break;
      default:
        break;
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    let otherField = undefined;
    for (let i = 1; i <= 5; i++) {
      const title = formData.other[`title${i}` as keyof typeof formData.other];
      const description =
        formData.other[`description${i}` as keyof typeof formData.other];
      if (title?.trim() && description?.trim()) {
        otherField = { title, description };
        break;
      }
    }
    const jobData = {
      ...formData,
      keyResponsibilities: formData.keyResponsibilities.filter(
        (item) => item.trim() !== ""
      ),
      requirements: formData.requirements.filter((item) => item.trim() !== ""),
      benefits: formData.benefits.filter((item) => item.trim() !== ""),
      other: otherField,
      // Fallbacks for required JobPost fields
      _id: jobToEdit?._id || "",
      applications: jobToEdit?.applications || [],
      createdAt: jobToEdit?.createdAt || new Date().toISOString(),
      salary: jobToEdit?.salary || 0,
    };
    try {
      console.log(jobToEdit);
      console.log(jobToEdit?._id);

      if (jobToEdit && jobToEdit._id) {
        await updateJob(jobToEdit._id, jobData);
      } else {
        await createJob(jobData);
      }
      if (onClose) onClose();
    } catch (err) {
      const error = err as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      setError(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to submit job"
      );
    } finally {
      setLoading(false);
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case "basic":
        return (
          <BasicInfoStep
            formData={formData}
            handleInputChange={handleInputChange}
            handleNext={handleNext}
          />
        );
      case "details":
        return (
          <JobDetailsStep
            formData={formData}
            handleInputChange={handleInputChange}
            handleArrayItemChange={handleArrayItemChange}
            addArrayItem={addArrayItem}
            removeArrayItem={removeArrayItem}
            handleBack={handleBack}
            handleNext={handleNext}
          />
        );
      case "requirements":
        return (
          <RequirementsStep
            formData={formData}
            handleInputChange={handleInputChange}
            handleArrayItemChange={handleArrayItemChange}
            addArrayItem={addArrayItem}
            removeArrayItem={removeArrayItem}
            handleBack={handleBack}
            handleNext={handleNext}
          />
        );
      case "additional":
        return (
          <AdditionalFieldsStep
            formData={formData}
            handleOtherFieldChange={handleOtherFieldChange}
            handleBack={handleBack}
            handleNext={handleNext}
          />
        );
      case "preview":
        return (
          <PreviewStep
            formData={formData}
            handleBack={handleBack}
            handleSubmit={handleSubmit}
            loading={loading}
            error={error}
          />
        );
      default:
        return null;
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
