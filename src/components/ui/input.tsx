import React from "react";
import { cn } from "../../lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  rightIcon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  rightIcon,
  className = "",
  ...props
}) => {
  return (
    <div className="relative">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          className={cn(
            "w-full px-3 py-2 border rounded-md shadow-sm",
            "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500",
            error ? "border-red-500" : "border-gray-300",
            className
          )}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            {rightIcon}
          </div>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};
