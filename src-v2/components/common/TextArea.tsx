import React, { TextareaHTMLAttributes } from "react";

interface TextAreaProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "size"> {
  label?: string;
  error?: string;
  hint?: string;
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  rows?: number;
  maxLength?: number;
  showCharCount?: boolean;
}

const TextArea: React.FC<TextAreaProps> = ({
  label,
  error,
  hint,
  size = "md",
  fullWidth = false,
  className = "",
  id,
  rows = 4,
  maxLength,
  showCharCount = false,
  value = "",
  ...rest
}) => {
  // Generate an ID if not provided
  const textAreaId =
    id || `textarea-${Math.random().toString(36).substring(2, 9)}`;

  // Size classes
  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-5 py-3 text-lg",
  };

  // Width classes
  const widthClasses = fullWidth ? "w-full" : "";

  // Error classes
  const errorClasses = error
    ? "border-red-500 focus:ring-red-500 focus:border-red-500"
    : "border-gray-300 focus:ring-blue-500 focus:border-blue-500";

  // Character count
  const charCount = typeof value === "string" ? value.length : 0;

  return (
    <div className={`${widthClasses}`}>
      {label && (
        <label
          htmlFor={textAreaId}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
        </label>
      )}

      <textarea
        id={textAreaId}
        rows={rows}
        maxLength={maxLength}
        className={`bg-white border ${errorClasses} rounded-md shadow-sm focus:outline-none focus:ring-1 ${sizeClasses[size]} ${widthClasses} ${className}`}
        value={value}
        {...rest}
      />

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}

      {hint && !error && <p className="mt-1 text-sm text-gray-500">{hint}</p>}

      {showCharCount && maxLength && (
        <div className="mt-1 text-sm text-gray-500 text-right">
          {charCount} / {maxLength}
        </div>
      )}
    </div>
  );
};

export default TextArea;
