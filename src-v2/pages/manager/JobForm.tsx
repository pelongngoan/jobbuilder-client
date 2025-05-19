import { useEffect, useState } from "react";
import { JobPost, CompanyStaff } from "../../types";
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

interface StaffMember extends CompanyStaff {
  id: string;
  firstName: string;
  lastName: string;
}

interface JobFormProps {
  isOpen: boolean;
  onClose: () => void;
  job?: JobPost;
  onSubmit: (job: JobPost) => void;
  contacterId: string;
  isCompanyUser: boolean;
  staffList?: StaffMember[];
}

interface ValidationErrors {
  [key: string]: string;
}

const getSteps = (isCompanyUser: boolean) => {
  const baseSteps = [
    { title: "Basic Info", description: "Job title, type, and location" },
    { title: "Requirements", description: "Skills and experience needed" },
    { title: "Compensation", description: "Salary and benefits" },
    { title: "Additional", description: "Other important details" },
  ];

  return isCompanyUser
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
  job,
  onSubmit,
  contacterId,
  isCompanyUser,
}: JobFormProps) => {
  const STEPS = getSteps(isCompanyUser);
  const [currentStep, setCurrentStep] = useState(0);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const { staffs, getStaffs } = useStaff();
  useEffect(() => {
    getStaffs();
    console.log(staffs);
  }, []);
  const [formData, setFormData] = useState<Partial<JobPost>>(() => ({
    ...job,
    title: job?.title || "",
    location: job?.location || "",
    jobType: job?.jobType || "full-time",
    description: job?.description || "",
    salaryFrom: job?.salaryFrom || 0,
    salaryTo: job?.salaryTo || 0,
    salaryCurrency: job?.salaryCurrency || "USD",
    benefits: job?.benefits || [],
    skills: job?.skills || [],
    status: job?.status || "draft",
    requirements: job?.requirements || [],
    keyResponsibilities: job?.keyResponsibilities || [],
    experienceLevel: job?.experienceLevel || "Entry",
    isFeatured: job?.isFeatured || false,
    contacterId: isCompanyUser
      ? undefined
      : (contacterId as unknown as CompanyStaff),
  }));

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

  const handleSubmit = () => {
    // Final validation before submission
    const finalData = {
      ...formData,
    } as JobPost;
    onSubmit(finalData);
  };

  const renderError = (field: string) => {
    return errors[field] ? (
      <div className="text-red-500 text-sm mt-1">{errors[field]}</div>
    ) : null;
  };

  const renderStepContent = () => {
    if (isCompanyUser && currentStep === 0) {
      return (
        <div className="space-y-4">
          <Select
            label="Contact Person"
            value={(formData.contacterId as unknown as string) || ""}
            onChange={(e) => handleChange("contacterId", e.target.value)}
            options={staffs
              .filter((staff) => staff.role === "hr")
              .map((staff) => ({
                value: staff._id,
                label: `${staff.profile.email}`,
              }))}
            error={errors.contacterId}
            fullWidth
          />
          {renderError("contacterId")}

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

    const adjustedStep = isCompanyUser ? currentStep - 1 : currentStep;

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
                { value: "USD", label: "USD - US Dollar" },
                { value: "EUR", label: "EUR - Euro" },
                { value: "GBP", label: "GBP - British Pound" },
                { value: "JPY", label: "JPY - Japanese Yen" },
                { value: "AUD", label: "AUD - Australian Dollar" },
                { value: "CAD", label: "CAD - Canadian Dollar" },
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

            {isCompanyUser && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <label htmlFor="isFeatured" className="font-medium">
                      Featured Status
                    </label>
                    <p className="text-sm text-gray-500">
                      Currently:{" "}
                      {formData.isFeatured ? "Featured" : "Not Featured"}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() =>
                      handleChange("isFeatured", !formData.isFeatured)
                    }
                  >
                    {formData.isFeatured ? "Remove Featured" : "Make Featured"}
                  </Button>
                </div>
              </div>
            )}
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
      title={`${job ? "Edit" : "Create"} Job Post`}
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
