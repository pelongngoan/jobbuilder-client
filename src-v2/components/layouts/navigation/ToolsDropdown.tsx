import React, { useRef } from "react";
import { Link } from "react-router-dom";

interface ToolsDropdownProps {
  isOpen: boolean;
  toggleDropdown: () => void;
  variant?: "light" | "dark";
}

const CAREER_TOOLS = [
  { id: "resume", path: "/resume-builder", name: "Resume Builder" },
  { id: "cover-letter", path: "/cover-letter", name: "Cover Letter Generator" },
  { id: "salary", path: "/salary-calculator", name: "Salary Calculator" },
  { id: "advice", path: "/career-advice", name: "Career Advice" },
];

const ToolsDropdown: React.FC<ToolsDropdownProps> = ({
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
        <span>Tools</span>
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
        <div className="absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
          <div className="py-1">
            <div className="px-4 py-2 font-medium text-sm text-gray-700 bg-gray-50">
              CAREER TOOLS
            </div>

            {CAREER_TOOLS.map((tool) => (
              <Link
                key={tool.id}
                to={tool.path}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                {tool.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ToolsDropdown;
