import React from "react";

interface CardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
  variant?: "default" | "outlined" | "elevated";
  padding?: "none" | "small" | "normal" | "large";
  footer?: React.ReactNode;
  header?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  className = "",
  variant = "default",
  padding = "normal",
  footer,
  header,
}) => {
  // Variant styles
  const variantClasses = {
    default: "bg-white border border-gray-200",
    outlined: "bg-white border border-gray-300",
    elevated: "bg-white border border-gray-200 shadow-md",
  };

  // Padding styles
  const paddingClasses = {
    none: "",
    small: "p-2",
    normal: "p-4",
    large: "p-6",
  };

  return (
    <div className={`rounded-lg ${variantClasses[variant]} ${className}`}>
      {header && (
        <div className="border-b border-gray-200 px-4 py-3">{header}</div>
      )}

      {(title || subtitle) && (
        <div
          className={`border-b border-gray-200 px-4 py-3 ${
            !header ? "" : "border-t-0"
          }`}
        >
          {title && (
            <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          )}
          {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
        </div>
      )}

      <div className={paddingClasses[padding]}>{children}</div>

      {footer && (
        <div className="border-t border-gray-200 px-4 py-3 bg-gray-50 rounded-b-lg">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;
