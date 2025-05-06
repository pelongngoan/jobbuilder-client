import React from "react";
import { Input } from "../../ui/Input";
import { Button } from "../../ui/Button";
import { ArrowLeft, ArrowRight, Plus, Trash2 } from "lucide-react";
import type { JobFormData } from "../../../pages/PostJob";

interface JobDetailsStepProps {
  formData: JobFormData;
  handleInputChange: (field: string, value: string) => void;
  handleArrayItemChange: (
    field: keyof JobFormData,
    index: number,
    value: string
  ) => void;
  addArrayItem: (field: keyof JobFormData) => void;
  removeArrayItem: (field: keyof JobFormData, index: number) => void;
  handleBack: () => void;
  handleNext: () => void;
}

const JobDetailsStep: React.FC<JobDetailsStepProps> = ({
  formData,
  handleInputChange,
  handleArrayItemChange,
  addArrayItem,
  removeArrayItem,
  handleBack,
  handleNext,
}) => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h2 className="text-xl font-semibold text-slate-900">Job Details</h2>
      <div className="flex items-center text-sm text-slate-500">
        <span className="mr-2">Step 2 of 5</span>
        <div className="flex space-x-1">
          <div className="w-3 h-3 rounded-full bg-blue-600"></div>
          <div className="w-3 h-3 rounded-full bg-blue-600"></div>
          <div className="w-3 h-3 rounded-full bg-slate-200"></div>
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
              type="button"
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
              type="button"
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
          onChange={(e) => handleInputChange("companyWebsite", e.target.value)}
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

export default JobDetailsStep;
