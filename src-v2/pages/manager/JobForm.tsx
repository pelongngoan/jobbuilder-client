import { useEffect, useState } from "react";
import { JobPost, CompanyStaff, Profile } from "../../types";
import {
  Button,
  Modal,
  Input,
  Select,
  TextArea,
} from "../../components/common";
import ArrayInput from "../../components/common/ArrayInput";
import Stepper from "../../components/common/Stepper";
import { useStaff } from "../../hooks/useStaff";
import { useCategory } from "../../hooks/useCategory";
import { useJobs } from "../../hooks/useJobs";
import { Category } from "../../types/category.types";
import { ObjectId } from "../../types/common.types";
import { StaffProfile } from "../../types/staff.types";
import { useAuth } from "../../hooks/useAuth";
import { useAppSelector } from "../../redux/store";
interface Option {
  value: string;
  label: string;
}

interface JobFormProps {
  isOpen: boolean;
  onClose: () => void;
  contacterId: string;
  isCompany: boolean;
}

interface ValidationErrors {
  [key: string]: string;
}

const getSteps = (isCompany: boolean) => {
  const baseSteps = [
    { title: "Basic Info", description: "Job title, type, and location" },
    { title: "Requirements", description: "Skills and experience needed" },
    { title: "Compensation", description: "Salary and benefits" },
    { title: "Additional", description: "Other important details" },
  ];

  return isCompany
    ? [
        {
          title: "Contact & Featured",
          description: "Select contacter and featured status",
        },
        ...baseSteps,
      ]
    : baseSteps;
};

export const JobForm = ({
  isOpen,
  onClose,
  contacterId,
  isCompany,
}: JobFormProps) => {
  const STEPS = getSteps(isCompany);
  const [currentStep, setCurrentStep] = useState(0);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const { staffs, getStaffs } = useStaff();
  const { getCompanyJobs, getHrJobs, currentJob, updateJob, createJob } =
    useJobs();
  const { page, limit } = useAppSelector((state) => state.pagination);
  useEffect(() => {
    getStaffs(1, 100);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { categories, getCategories } = useCategory();
  useEffect(() => {
    getCategories(1, 100);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [formData, setFormData] = useState<Partial<JobPost>>(() => ({
    title: "",
    location: "",
    jobType: "full-time",
    description: "",
    salaryFrom: 0,
    salaryTo: 0,
    salaryCurrency: "USD",
    benefits: [],
    skills: [],
    status: "draft",
    requirements: [],
    keyResponsibilities: [],
    experienceLevel: "Entry",
    isFeatured: false,
    category: categories[0],
    contacterId: isCompany
      ? (staffs.filter(
          (staff) => staff.role === "hr"
        )[0] as unknown as ObjectId)
      : (contacterId as unknown as ObjectId),
  }));
  // Reset form when modal is opened/closed
  useEffect(() => {
    if (isOpen) {
      if (currentJob) {
        // If editing an existing job
        setFormData({
          ...currentJob,
          category: (currentJob.category as Category)?._id || "",
          contacterId: (currentJob.contacterId as CompanyStaff)._id as
            | CompanyStaff
            | undefined,
        });
      } else {
        // If creating a new job
        setFormData({
          title: "",
          location: "",
          jobType: "full-time",
          description: "",
          salaryFrom: 0,
          salaryTo: 0,
          salaryCurrency: "VND",
          benefits: [],
          skills: [],
          status: "draft",
          requirements: [],
          keyResponsibilities: [],
          experienceLevel: "Entry",
          isFeatured: false,
          category: categories[0]._id,
          contacterId: isCompany
            ? (staffs.filter((staff) => staff.role === "hr")[0]
                ._id as unknown as ObjectId)
            : (contacterId as unknown as ObjectId),
        });
      }
      setCurrentStep(0);
      setErrors({});
    }
  }, [isOpen, currentJob, isCompany, contacterId, staffs, categories]);

  const handleChange = (
    name: keyof JobPost,
    value: string | number | string[] | boolean | Date
  ) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when field is modified
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1));
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };
  const { role, useProfileId } = useAuth();
  const handleSubmit = () => {
    if (currentJob) {
      updateJob(currentJob._id, formData as JobPost).then(() => {
        if (role === "company" && useProfileId) {
          getCompanyJobs(useProfileId, page, limit);
        } else if (role === "staff" && useProfileId) {
          getHrJobs(useProfileId, page, limit);
        }
      });
    } else {
      createJob(formData as JobPost).then(() => {
        if (role === "company" && useProfileId) {
          getCompanyJobs(useProfileId, page, limit);
        } else if (role === "staff" && useProfileId) {
          getHrJobs(useProfileId, page, limit);
        }
      });
    }
    setFormData({});
    onClose();
  };

  const renderError = (field: string) => {
    return errors[field] ? (
      <div className="text-red-500 text-sm mt-1">{errors[field]}</div>
    ) : null;
  };

  const renderStepContent = () => {
    if (isCompany && currentStep === 0) {
      return (
        <div className="space-y-4">
          <Select
            label="Contact Person"
            value={(formData.contacterId as unknown as string) || ""}
            onChange={(e) => handleChange("contacterId", e.target.value)}
            options={staffs
              .filter((staff: StaffProfile) => staff.role === "hr")
              .map((staff: StaffProfile) => ({
                value: staff._id as string,
                label: (staff.profile as Profile)?.email || "No email",
              }))}
            error={errors.contacterId}
            fullWidth
          />
          {renderError("contacterId")}

          <Select
            label="Job Category"
            value={(formData.category as unknown as string) || ""}
            onChange={(e) => {
              const value = e.target.value;
              handleChange("category", value as unknown as ObjectId);
            }}
            options={
              categories.map((category) => ({
                value: category._id,
                label: category.name,
              })) as Option[]
            }
            fullWidth
          />

          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <label htmlFor="isFeatured" className="font-medium">
                  Feature this job post
                </label>
                <p className="text-sm text-gray-500">
                  Featured jobs appear at the top of search results
                </p>
              </div>
              <input
                type="checkbox"
                id="isFeatured"
                className="w-6 h-6"
                checked={formData.isFeatured}
                onChange={(e) => handleChange("isFeatured", e.target.checked)}
              />
            </div>
          </div>
        </div>
      );
    }

    const adjustedStep = isCompany ? currentStep - 1 : currentStep;

    switch (adjustedStep) {
      case 0:
        return (
          <div className="space-y-4">
            <Input
              label="Job Title"
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="e.g. Senior Software Engineer"
              error={errors.title}
              fullWidth
            />
            {renderError("title")}

            <Select
              label="Job Type"
              value={formData.jobType}
              onChange={(e) => handleChange("jobType", e.target.value)}
              options={[
                { value: "full-time", label: "Full Time" },
                { value: "part-time", label: "Part Time" },
                { value: "contract", label: "Contract" },
                { value: "internship", label: "Internship" },
                { value: "remote", label: "Remote" },
              ]}
              fullWidth
            />

            <Input
              label="Location"
              value={formData.location}
              onChange={(e) => handleChange("location", e.target.value)}
              placeholder="e.g. New York, NY"
              error={errors.location}
              fullWidth
            />
            {renderError("location")}

            <TextArea
              label="Job Description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Describe the role and responsibilities"
              error={errors.description}
              rows={6}
              fullWidth
            />
            {renderError("description")}
          </div>
        );
      case 1:
        return (
          <div className="space-y-4">
            <Select
              label="Experience Level"
              value={formData.experienceLevel}
              onChange={(e) => handleChange("experienceLevel", e.target.value)}
              options={[
                { value: "Entry", label: "Entry Level (0-2 years)" },
                { value: "Mid", label: "Mid Level (2-5 years)" },
                { value: "Senior", label: "Senior Level (5+ years)" },
                { value: "Executive", label: "Executive Level (10+ years)" },
              ]}
              fullWidth
            />

            <ArrayInput
              label="Requirements"
              value={formData.requirements || []}
              onChange={(value) => handleChange("requirements", value)}
              placeholder="Add a requirement"
            />
            {renderError("requirements")}

            <ArrayInput
              label="Key Responsibilities"
              value={formData.keyResponsibilities || []}
              onChange={(value) => handleChange("keyResponsibilities", value)}
              placeholder="Add a responsibility"
            />

            <ArrayInput
              label="Required Skills"
              value={formData.skills || []}
              onChange={(value) => handleChange("skills", value)}
              placeholder="Add a skill"
            />
            {renderError("skills")}
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Input
                  label="Salary From"
                  type="number"
                  value={formData.salaryFrom}
                  onChange={(e) =>
                    handleChange("salaryFrom", parseInt(e.target.value))
                  }
                  error={errors.salaryFrom}
                  fullWidth
                />
                {renderError("salaryFrom")}
              </div>
              <div>
                <Input
                  label="Salary To"
                  type="number"
                  value={formData.salaryTo}
                  onChange={(e) =>
                    handleChange("salaryTo", parseInt(e.target.value))
                  }
                  error={errors.salaryTo}
                  fullWidth
                />
                {renderError("salaryTo")}
              </div>
            </div>

            <Select
              label="Currency"
              value={formData.salaryCurrency}
              onChange={(e) => handleChange("salaryCurrency", e.target.value)}
              options={[
                { value: "VND", label: "VND - Vietnamese Dong" },
                { value: "USD", label: "USD - US Dollar" },
                { value: "EUR", label: "EUR - Euro" },
                { value: "GBP", label: "GBP - British Pound" },
                { value: "JPY", label: "JPY - Japanese Yen" },
                { value: "CNY", label: "CNY - Chinese Yuan" },
              ]}
              fullWidth
            />

            <ArrayInput
              label="Benefits"
              value={formData.benefits || []}
              onChange={(value) => handleChange("benefits", value)}
              placeholder="Add a benefit (e.g. Health Insurance, 401k, etc.)"
            />
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <Select
              label="Status"
              value={formData.status}
              onChange={(e) => handleChange("status", e.target.value)}
              options={[
                { value: "draft", label: "Draft - Save for later" },
                { value: "open", label: "Open - Start accepting applications" },
                {
                  value: "closed",
                  label: "Closed - Stop accepting applications",
                },
              ]}
              fullWidth
            />

            <Input
              type="date"
              label="Application Deadline"
              value={
                formData.deadline
                  ? new Date(formData.deadline).toISOString().split("T")[0]
                  : ""
              }
              onChange={(e) =>
                handleChange("deadline", new Date(e.target.value))
              }
              min={new Date().toISOString().split("T")[0]}
              fullWidth
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${currentJob ? "Edit" : "Create"} Job Post`}
      size="lg"
      footer={
        <div className="flex justify-between w-full">
          <Button
            onClick={handlePrev}
            variant="outline"
            disabled={currentStep === 0}
          >
            Previous
          </Button>
          <div className="flex gap-2">
            <Button onClick={onClose} variant="outline">
              Cancel
            </Button>
            {currentStep === STEPS.length - 1 ? (
              <Button
                onClick={handleSubmit}
                variant="primary"
                disabled={Object.keys(errors).length > 0}
              >
                {formData.status === "draft" ? "Save Draft" : "Publish Job"}
              </Button>
            ) : (
              <Button onClick={handleNext} variant="primary">
                Next
              </Button>
            )}
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        <Stepper
          steps={STEPS}
          currentStep={currentStep}
          onStepChange={setCurrentStep}
        />

        {renderStepContent()}
      </div>
    </Modal>
  );
};
