import React, { InputHTMLAttributes } from "react";

interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  hint,
  icon,
  iconPosition = "left",
  size = "md",
  fullWidth = false,
  className = "",
  id,
  ...rest
}) => {
  // Generate an ID if not provided
  const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`;

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

  // Icon classes
  const iconClasses = icon ? (iconPosition === "left" ? "pl-10" : "pr-10") : "";

  return (
    <div className={`${widthClasses}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
        </label>
      )}

      <div className="relative">
        {icon && iconPosition === "left" && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}

        <input
          id={inputId}
          className={`bg-white border ${errorClasses} rounded-md shadow-sm focus:outline-none focus:ring-1 ${sizeClasses[size]} ${iconClasses} ${widthClasses} ${className}`}
          {...rest}
        />

        {icon && iconPosition === "right" && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
      </div>

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}

      {hint && !error && <p className="mt-1 text-sm text-gray-500">{hint}</p>}
    </div>
  );
};

export default Input;
