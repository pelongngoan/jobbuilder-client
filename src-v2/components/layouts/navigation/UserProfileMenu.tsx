import React, { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../common";
import { User } from "../../../types/user.types";

interface UserProfileMenuProps {
  isOpen: boolean;
  toggleMenu: () => void;
  user: User | null;
  logout: () => void;
  variant?: "light" | "dark";
  isAuthenticated: boolean;
}

// Options by role
const USER_OPTIONS = [
  { id: "search-jobs", path: "/dashboard/user/jobs", name: "Search Jobs" },
  { id: "saved-jobs", path: "/dashboard/user/saved-jobs", name: "Saved Jobs" },
  {
    id: "applications",
    path: "/dashboard/user/applications",
    name: "My Applications",
  },
  { id: "resumes", path: "/dashboard/user/resume", name: "Manage Resumes" },
];

const COMPANY_OPTIONS = [
  { id: "manage-jobs", path: "/management/jobs", name: "Manage Jobs" },
  { id: "post-job", path: "/management/jobs/create", name: "Post New Job" },
  {
    id: "applications",
    path: "/management/applications",
    name: "Manage Applications",
  },
  {
    id: "hr-team",
    path: "/management/hr-team",
    name: "Manage HR Team",
    role: "company",
  },
  { id: "analytics", path: "/management/analytics", name: "Analytics" },
];

const ADMIN_OPTIONS = [
  { id: "users", path: "/admin/users", name: "Manage Users" },
  { id: "companies", path: "/admin/companies", name: "Manage Companies" },
  { id: "jobs", path: "/admin/jobs", name: "Manage Jobs" },
  { id: "skills", path: "/admin/skills", name: "Manage Skills" },
  {
    id: "job-categories",
    path: "/admin/job-categories",
    name: "Job Categories",
  },
  { id: "applications", path: "/admin/applications", name: "All Applications" },
  { id: "settings", path: "/admin/settings", name: "System Settings" },
];

const UserProfileMenu: React.FC<UserProfileMenuProps> = ({
  isOpen,
  toggleMenu,
  user,
  logout,
  variant = "light",
  isAuthenticated,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const linkColor =
    variant === "light"
      ? "text-gray-600 hover:text-blue-600"
      : "text-gray-200 hover:text-white";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getDashboardPath = () => {
    if (user?.role === "admin") return "/admin/dashboard";
    if (user?.role === "hr" || user?.role === "company") return "/management";
    return "/dashboard/user";
  };

  if (!isAuthenticated) {
    return (
      <>
        <Link to="/login">
          <Button variant="outline" size="sm">
            Sign In
          </Button>
        </Link>
        <Link to="/register">
          <Button variant="primary" size="sm">
            Sign Up
          </Button>
        </Link>
      </>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={toggleMenu}
        className="flex items-center space-x-2 focus:outline-none"
      >
        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
          {user?.profilePicture ? (
            <img
              src={user.profilePicture}
              alt={user.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span
              className={`${
                variant === "light" ? "text-gray-600" : "text-gray-800"
              } font-medium text-sm`}
            >
              {user?.name?.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
        <span
          className={`text-sm font-medium ${linkColor} max-w-[100px] truncate`}
        >
          {user?.name}
        </span>
        <svg
          className={`h-4 w-4 ${linkColor}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
          <div className="py-1" role="menu" aria-orientation="vertical">
            {/* Common options for all users */}
            <Link
              to={getDashboardPath()}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              role="menuitem"
            >
              Dashboard
            </Link>
            <Link
              to="/profile"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              role="menuitem"
            >
              Profile
            </Link>

            {/* Regular User-specific options */}
            {user?.role === "user" && (
              <>
                <div className="border-t border-gray-100 mt-1 pt-1">
                  {USER_OPTIONS.map((option) => (
                    <Link
                      key={option.id}
                      to={option.path}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                    >
                      {option.name}
                    </Link>
                  ))}
                </div>
              </>
            )}

            {/* Company/HR-specific options */}
            {(user?.role === "hr" || user?.role === "company") && (
              <>
                <div className="border-t border-gray-100 mt-1 pt-1">
                  {COMPANY_OPTIONS.map(
                    (option) =>
                      (option.role === undefined ||
                        option.role === user?.role) && (
                        <Link
                          key={option.id}
                          to={option.path}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          role="menuitem"
                        >
                          {option.name}
                        </Link>
                      )
                  )}
                </div>
              </>
            )}

            {/* Admin-specific options */}
            {user?.role === "admin" && (
              <>
                <div className="border-t border-gray-100 mt-1 pt-1">
                  {ADMIN_OPTIONS.map((option) => (
                    <Link
                      key={option.id}
                      to={option.path}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                    >
                      {option.name}
                    </Link>
                  ))}
                </div>
              </>
            )}

            {/* Logout option for all users */}
            <div className="border-t border-gray-100 mt-1 pt-1">
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                role="menuitem"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfileMenu;
