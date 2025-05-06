import React from "react";
import { Input } from "../../ui/Input";
import { Button } from "../../ui/Button";
import { ArrowLeft, ArrowRight, Plus, Trash2, Upload, X } from "lucide-react";
import type { JobFormData } from "../../../pages/PostJob";

interface RequirementsStepProps {
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

const RequirementsStep: React.FC<RequirementsStepProps> = ({
  formData,
  handleInputChange,
  handleArrayItemChange,
  addArrayItem,
  removeArrayItem,
  handleBack,
  handleNext,
}) => {
  // Ref for the hidden file input
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Handle file selection and preview
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          handleInputChange("logoCompany", reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-900">
          Requirements & Contact
        </h2>
        <div className="flex items-center text-sm text-slate-500">
          <span className="mr-2">Step 3 of 5</span>
          <div className="flex space-x-1">
            <div className="w-3 h-3 rounded-full bg-blue-600"></div>
            <div className="w-3 h-3 rounded-full bg-blue-600"></div>
            <div className="w-3 h-3 rounded-full bg-blue-600"></div>
            <div className="w-3 h-3 rounded-full bg-slate-200"></div>
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
                type="button"
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
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleLogoChange}
            />
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Upload className="h-4 w-4" />}
              onClick={() => fileInputRef.current?.click()}
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
          Next: Additional Fields
        </Button>
      </div>
    </div>
  );
};

export default RequirementsStep;
