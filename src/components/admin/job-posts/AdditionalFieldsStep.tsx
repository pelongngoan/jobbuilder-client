import React, { useState } from "react";
import { Input } from "../../ui/Input";
import { Button } from "../../ui/Button";
import { ArrowLeft, ArrowRight, Tag, Plus, Trash2 } from "lucide-react";
import type { JobFormData } from "../../../pages/PostJob";

interface AdditionalFieldsStepProps {
  formData: JobFormData;
  handleOtherFieldChange: (field: string, value: string) => void;
  handleBack: () => void;
  handleNext: () => void;
}

const MAX_FIELDS = 5;

const AdditionalFieldsStep: React.FC<AdditionalFieldsStepProps> = ({
  formData,
  handleOtherFieldChange,
  handleBack,
  handleNext,
}) => {
  const filledCount = (
    Array.from({ length: MAX_FIELDS }, (_, i) =>
      formData.other[`title${i + 1}` as keyof typeof formData.other] ||
      formData.other[`description${i + 1}` as keyof typeof formData.other]
        ? 1
        : 0
    ) as number[]
  ).reduce((a: number, b: number) => a + b, 0);
  const initialCount = Math.max(1, filledCount);
  const [fieldCount, setFieldCount] = useState(initialCount);

  const handleAddField = () => {
    if (fieldCount < MAX_FIELDS) {
      setFieldCount(fieldCount + 1);
    }
  };

  const handleRemoveField = (index: number) => {
    // Clear the values for the removed field
    handleOtherFieldChange(`title${index + 1}`, "");
    handleOtherFieldChange(`description${index + 1}`, "");
    // Shift up the remaining fields
    for (let i = index + 1; i < fieldCount; i++) {
      handleOtherFieldChange(
        `title${i}`,
        formData.other[`title${i + 1}` as keyof typeof formData.other] || ""
      );
      handleOtherFieldChange(
        `description${i}`,
        formData.other[`description${i + 1}` as keyof typeof formData.other] ||
          ""
      );
    }
    // Clear the last field
    handleOtherFieldChange(`title${fieldCount}`, "");
    handleOtherFieldChange(`description${fieldCount}`, "");
    setFieldCount(fieldCount - 1);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-900">
          Additional Job Fields
        </h2>
        <div className="flex items-center text-sm text-slate-500">
          <span className="mr-2">Step 4 of 5</span>
          <div className="flex space-x-1">
            <div className="w-3 h-3 rounded-full bg-blue-600"></div>
            <div className="w-3 h-3 rounded-full bg-blue-600"></div>
            <div className="w-3 h-3 rounded-full bg-blue-600"></div>
            <div className="w-3 h-3 rounded-full bg-blue-600"></div>
            <div className="w-3 h-3 rounded-full bg-slate-200"></div>
          </div>
        </div>
      </div>
      <h3 className="font-medium text-slate-800">Custom Fields</h3>
      <p className="text-sm text-slate-600">
        Use these fields for any additional information not covered above.
      </p>
      {Array.from({ length: fieldCount }, (_, idx) => (
        <div
          key={idx}
          className="border border-slate-200 rounded-md p-4 relative"
        >
          <div className="flex items-center mb-2">
            <Tag className="h-4 w-4 mr-2 text-slate-500" />
            <h4 className="font-medium text-slate-700">
              Custom Field {idx + 1}
            </h4>
            {fieldCount > 1 && (
              <button
                type="button"
                className="ml-auto text-red-500 hover:text-red-700"
                onClick={() => handleRemoveField(idx)}
                aria-label="Remove field"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Field Title
              </label>
              <Input
                value={
                  formData.other[
                    `title${idx + 1}` as keyof typeof formData.other
                  ]
                }
                onChange={(e) =>
                  handleOtherFieldChange(`title${idx + 1}`, e.target.value)
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
                    `description${idx + 1}` as keyof typeof formData.other
                  ]
                }
                onChange={(e) =>
                  handleOtherFieldChange(
                    `description${idx + 1}`,
                    e.target.value
                  )
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                rows={2}
                placeholder="Enter details for this field"
              />
            </div>
          </div>
        </div>
      ))}
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={handleBack}
          leftIcon={<ArrowLeft className="h-4 w-4" />}
        >
          Back
        </Button>
        <div className="flex items-center space-x-2">
          {fieldCount < MAX_FIELDS && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              leftIcon={<Plus className="h-4 w-4" />}
              onClick={handleAddField}
            >
              Add Field
            </Button>
          )}
          <Button
            onClick={handleNext}
            rightIcon={<ArrowRight className="h-4 w-4" />}
          >
            Next: Preview
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdditionalFieldsStep;
