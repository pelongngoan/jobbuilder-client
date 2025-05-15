import React, { useRef } from "react";
import { Link } from "react-router-dom";

interface JobsDropdownProps {
  isOpen: boolean;
  toggleDropdown: () => void;
  variant?: "light" | "dark";
}

const JOB_CATEGORIES = [
  { id: "it", name: "IT & Software Development" },
  { id: "marketing", name: "Marketing" },
  { id: "finance", name: "Finance & Accounting" },
  { id: "hr", name: "Human Resources" },
  { id: "sales", name: "Sales" },
  { id: "engineering", name: "Engineering" },
  { id: "healthcare", name: "Healthcare" },
  { id: "education", name: "Education" },
];

const JobsDropdown: React.FC<JobsDropdownProps> = ({
  isOpen,
  toggleDropdown,
  variant = "light",
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  const linkColor =
    variant === "light"
      ? "text-gray-600 hover:text-blue-600"
      : "text-gray-200 hover:text-white";

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${linkColor}`}
      >
        <span>Jobs</span>
        <svg
          className="ml-1 h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d={isOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-60 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
          <div className="py-1">
            <div className="px-4 py-2 font-medium text-sm text-gray-700 bg-gray-50">
              JOBS BY CATEGORY
            </div>

            {JOB_CATEGORIES.map((category) => (
              <Link
                key={category.id}
                to={`/jobs?category=${category.id}`}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                {category.name}
              </Link>
            ))}

            <div className="border-t border-gray-100 mt-1">
              <Link
                to="/jobs"
                className="block px-4 py-2 text-sm text-blue-600 hover:bg-gray-100"
              >
                View All Jobs →
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobsDropdown;
