import React, { useState } from "react";
import { Button, Input, TextArea, Select } from "../../../components/common";

interface JobApplicationFormProps {
  jobId: string;
  onSubmit: (formData: ApplicationFormData) => void;
  isLoading?: boolean;
}

export interface ApplicationFormData {
  jobId: string;
  coverLetter: string;
  resumeId?: string;
  phone: string;
  availableStartDate: string;
  desiredSalary?: string;
  additionalInformation?: string;
}

const JobApplicationForm: React.FC<JobApplicationFormProps> = ({
  jobId,
  onSubmit,
  isLoading = false,
}) => {
  // State for form data
  const [formData, setFormData] = useState<ApplicationFormData>({
    jobId,
    coverLetter: "",
    resumeId: "",
    phone: "",
    availableStartDate: "",
    desiredSalary: "",
    additionalInformation: "",
  });

  // State for form validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Mock resume options for demo
  const resumeOptions = [
    { value: "", label: "Select a resume" },
    { value: "resume1", label: "My Professional Resume" },
    { value: "resume2", label: "Technical Resume" },
    { value: "resume3", label: "Creative Portfolio" },
    { value: "new", label: "Upload new resume" },
  ];

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when field is changed
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Required fields
    if (!formData.coverLetter.trim()) {
      newErrors.coverLetter = "Cover letter is required";
    }

    if (!formData.resumeId) {
      newErrors.resumeId = "Please select a resume";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\+?[\d\s-]{10,15}$/.test(formData.phone.trim())) {
      newErrors.phone = "Please enter a valid phone number";
    }

    if (!formData.availableStartDate) {
      newErrors.availableStartDate = "Please select an available start date";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit(formData);
    }
  };

  // Handle file upload (would be expanded in a real implementation)
  const handleFileUpload = () => {
    console.log("File upload functionality would be implemented here");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <TextArea
          label="Cover Letter"
          name="coverLetter"
          value={formData.coverLetter}
          onChange={handleChange}
          placeholder="Introduce yourself and explain why you're a good fit for this position..."
          rows={6}
          fullWidth
          error={errors.coverLetter}
          hint="Highlight your relevant experience and skills that match the job requirements."
        />
      </div>

      <div>
        <Select
          label="Select Resume"
          name="resumeId"
          options={resumeOptions}
          value={formData.resumeId}
          onChange={handleChange}
          fullWidth
          error={errors.resumeId}
        />

        {formData.resumeId === "new" && (
          <div className="mt-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleFileUpload}
              fullWidth
            >
              Upload Resume
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Phone Number"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          placeholder="+1 (555) 123-4567"
          fullWidth
          error={errors.phone}
        />

        <Input
          label="Available Start Date"
          name="availableStartDate"
          type="date"
          value={formData.availableStartDate}
          onChange={handleChange}
          fullWidth
          error={errors.availableStartDate}
        />
      </div>

      <div>
        <Input
          label="Desired Salary (Optional)"
          name="desiredSalary"
          type="text"
          value={formData.desiredSalary}
          onChange={handleChange}
          placeholder="$60,000 - $80,000"
          fullWidth
        />
      </div>

      <div>
        <TextArea
          label="Additional Information (Optional)"
          name="additionalInformation"
          value={formData.additionalInformation || ""}
          onChange={handleChange}
          placeholder="Any other details you'd like to share with the employer..."
          rows={4}
          fullWidth
        />
      </div>

      <div className="pt-2">
        <Button type="submit" variant="primary" fullWidth isLoading={isLoading}>
          Submit Application
        </Button>
      </div>
    </form>
  );
};

export default JobApplicationForm;
