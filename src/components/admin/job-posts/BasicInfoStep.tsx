import React from "react";
import { Input } from "../../ui/Input";
import { Button } from "../../ui/Button";
import { ArrowRight } from "lucide-react";
import type { JobFormData } from "../../../pages/PostJob";

interface BasicInfoStepProps {
  formData: JobFormData;
  handleInputChange: (field: string, value: string) => void;
  handleNext: () => void;
}

const BasicInfoStep: React.FC<BasicInfoStepProps> = ({
  formData,
  handleInputChange,
  handleNext,
}) => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h2 className="text-xl font-semibold text-slate-900">
        Basic Information
      </h2>
      <div className="flex items-center text-sm text-slate-500">
        <span className="mr-2">Step 1 of 5</span>
        <div className="flex space-x-1">
          <div className="w-3 h-3 rounded-full bg-blue-600"></div>
          <div className="w-3 h-3 rounded-full bg-slate-200"></div>
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
                onClick={() => handleInputChange("jobType", type)}
                type="button"
              >
                {type.charAt(0).toUpperCase() + type.slice(1).replace("-", " ")}
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
              onClick={() => handleInputChange("status", status)}
              type="button"
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
              onChange={(e) => handleInputChange("salaryRange", e.target.value)}
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
              onChange={(e) => handleInputChange("salaryType", e.target.value)}
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

export default BasicInfoStep;
