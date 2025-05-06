import React from "react";
import { Card, CardContent } from "../../ui/Card";
import { Button } from "../../ui/Button";
import {
  ArrowLeft,
  CheckCircle,
  HelpCircle,
  Building,
  MapPin,
  Briefcase,
  DollarSign,
} from "lucide-react";
import type { JobFormData } from "../../../pages/PostJob";

interface PreviewStepProps {
  formData: JobFormData;
  handleBack: () => void;
  handleSubmit: () => void;
  loading?: boolean;
  error?: string | null;
}

const PreviewStep: React.FC<PreviewStepProps> = ({
  formData,
  handleBack,
  handleSubmit,
  loading = false,
  error = null,
}) => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h2 className="text-xl font-semibold text-slate-900">
        Preview Job Posting
      </h2>
      <div className="flex items-center text-sm text-slate-500">
        <span className="mr-2">Step 5 of 5</span>
        <div className="flex space-x-1">
          <div className="w-3 h-3 rounded-full bg-blue-600"></div>
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
                <span className="font-medium mr-2">Application Deadline:</span>
                <span>{new Date(formData.deadline).toLocaleDateString()}</span>
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
            will be visible to all potential candidates. Ensure all requirements
            and contact information are accurate.
          </p>
        </div>
      </div>
    </div>
    <div className="flex justify-between">
      <Button
        variant="outline"
        onClick={handleBack}
        leftIcon={<ArrowLeft className="h-4 w-4" />}
        disabled={loading}
      >
        Back
      </Button>
      <Button
        onClick={handleSubmit}
        leftIcon={<CheckCircle className="h-4 w-4" />}
        disabled={loading}
      >
        {loading ? "Publishing..." : "Publish Job Posting"}
      </Button>
    </div>
    {error && (
      <div className="mt-4 text-red-600 text-sm font-medium">{error}</div>
    )}
  </div>
);

export default PreviewStep;
