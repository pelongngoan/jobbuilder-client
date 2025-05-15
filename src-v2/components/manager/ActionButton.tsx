import React, { ReactNode } from "react";
import { Button } from "../common";

interface ActionButtonProps {
  label: string;
  onClick: () => void;
  icon?: ReactNode;
  variant?: "primary" | "outline" | "danger" | "success";
  disabled?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
}

/**
 * Standardized action button with icon support for management pages
 */
const ActionButton: React.FC<ActionButtonProps> = ({
  label,
  onClick,
  icon,
  variant = "primary",
  disabled = false,
  className = "",
  size = "md",
}) => {
  // Convert variant to button variant and className
  let buttonVariant: "primary" | "outline" = "primary";
  let variantClass = "";

  switch (variant) {
    case "primary":
      buttonVariant = "primary";
      break;
    case "outline":
      buttonVariant = "outline";
      break;
    case "danger":
      buttonVariant = "outline";
      variantClass = "text-red-600 border-red-300 hover:bg-red-50";
      break;
    case "success":
      buttonVariant = "outline";
      variantClass = "text-green-600 border-green-300 hover:bg-green-50";
      break;
  }

  return (
    <Button
      variant={buttonVariant}
      size={size}
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-2 ${variantClass} ${className}`}
    >
      {icon && <span className="icon">{icon}</span>}
      {label}
    </Button>
  );
};

// Common icons for management actions
export const PlusIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

export const EditIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
  </svg>
);

export const DeleteIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
  </svg>
);

export const DownloadIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="7 10 12 15 17 10"></polyline>
    <line x1="12" y1="15" x2="12" y2="3"></line>
  </svg>
);

export const ViewIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);

export default ActionButton;
