import React from "react";
import { Link } from "react-router-dom";
import { User } from "../../../types/user.types";
import {
  MOBILE_JOB_CATEGORIES,
  MenuItem,
  shouldShowMenuItem,
} from "./navigationItems";

interface MobileMenuProps {
  isOpen: boolean;
  user: User | null;
  isAuthenticated: boolean;
  variant?: "light" | "dark";
  handleLogout: () => void;
}

// User menu items by role
const USER_MENU_ITEMS: MenuItem[] = [
  {
    id: "search-jobs",
    path: "/dashboard/user/jobs",
    name: "Search Jobs",
    role: "user",
  },
  {
    id: "saved-jobs",
    path: "/dashboard/user/saved-jobs",
    name: "Saved Jobs",
    role: "user",
  },
  {
    id: "applications",
    path: "/dashboard/user/applications",
    name: "My Applications",
    role: "user",
  },
  {
    id: "resumes",
    path: "/dashboard/user/resume",
    name: "Manage Resumes",
    role: "user",
  },

  {
    id: "manage-jobs",
    path: "/management/jobs",
    name: "Manage Jobs",
    role: ["company", "hr"],
  },
  {
    id: "post-job",
    path: "/management/jobs/create",
    name: "Post New Job",
    role: ["company", "hr"],
  },
  {
    id: "manage-applications",
    path: "/management/applications",
    name: "Manage Applications",
    role: ["company", "hr"],
  },
  {
    id: "hr-team",
    path: "/management/hr-team",
    name: "Manage HR Team",
    role: "company",
  },
  {
    id: "analytics",
    path: "/management/analytics",
    name: "Analytics",
    role: ["company", "hr"],
  },

  { id: "users", path: "/admin/users", name: "Manage Users", role: "admin" },
  {
    id: "companies",
    path: "/admin/companies",
    name: "Manage Companies",
    role: "admin",
  },
  { id: "admin-jobs", path: "/admin/jobs", name: "Manage Jobs", role: "admin" },
  { id: "skills", path: "/admin/skills", name: "Manage Skills", role: "admin" },
  {
    id: "job-categories",
    path: "/admin/job-categories",
    name: "Job Categories",
    role: "admin",
  },
  {
    id: "admin-settings",
    path: "/admin/settings",
    name: "System Settings",
    role: "admin",
  },
];

const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  user,
  isAuthenticated,
  variant = "light",
  handleLogout,
}) => {
  if (!isOpen) return null;

  const linkColor =
    variant === "light"
      ? "text-gray-600 hover:text-blue-600"
      : "text-gray-200 hover:text-white";

  const bgColor = variant === "light" ? "bg-white" : "bg-gray-800";

  const getDashboardPath = () => {
    if (user?.role === "admin") return "/admin/dashboard";
    if (user?.role === "hr" || user?.role === "company") return "/management";
    return "/dashboard/user";
  };

  return (
    <div className={`md:hidden ${bgColor}`}>
      <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
        <div className="px-3 py-2 font-medium text-base text-gray-500">
          JOBS BY CATEGORY
        </div>

        {MOBILE_JOB_CATEGORIES.map((category) => (
          <Link
            key={category.id}
            to={category.path}
            className={`block px-3 py-2 rounded-md text-base font-medium ${linkColor}`}
          >
            {category.name}
          </Link>
        ))}
      </div>

      <div className="border-t border-gray-200 px-2 pt-2 pb-3">
        <Link
          to="/companies"
          className={`block px-3 py-2 rounded-md text-base font-medium ${linkColor}`}
        >
          Companies
        </Link>
        <Link
          to="/resume-builder"
          className={`block px-3 py-2 rounded-md text-base font-medium ${linkColor}`}
        >
          Resume Builder
        </Link>
        <Link
          to="/career-advice"
          className={`block px-3 py-2 rounded-md text-base font-medium ${linkColor}`}
        >
          Career Advice
        </Link>
        {user?.role === "company" && (
          <Link
            to="/management/jobs/create"
            className={`block px-3 py-2 rounded-md text-base font-medium ${linkColor}`}
          >
            Post a Job
          </Link>
        )}
      </div>

      <div className="pt-4 pb-3 border-t border-gray-200">
        {isAuthenticated ? (
          <div className="px-2 space-y-1">
            <div className="flex items-center px-3 py-2">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3 overflow-hidden">
                {user?.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-600 font-medium">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div>
                <div
                  className={`text-sm font-medium ${
                    variant === "light" ? "text-gray-700" : "text-white"
                  }`}
                >
                  {user?.name}
                </div>
                <div className="text-xs text-gray-500">{user?.email}</div>
              </div>
            </div>

            {/* Common options for all users */}
            <Link
              to={getDashboardPath()}
              className={`block px-3 py-2 rounded-md text-base font-medium ${linkColor}`}
            >
              Dashboard
            </Link>
            <Link
              to="/profile"
              className={`block px-3 py-2 rounded-md text-base font-medium ${linkColor}`}
            >
              Profile
            </Link>

            {/* Role-specific menu items */}
            {user?.role && (
              <>
                <div className="border-t border-gray-700 my-2"></div>

                {USER_MENU_ITEMS.filter((item) =>
                  shouldShowMenuItem(item, user.role)
                ).map((item) => (
                  <Link
                    key={item.id}
                    to={item.path}
                    className={`block px-3 py-2 rounded-md text-base font-medium ${linkColor}`}
                  >
                    {item.name}
                  </Link>
                ))}
              </>
            )}

            {/* Logout button */}
            <div className="border-t border-gray-700 my-2"></div>
            <button
              onClick={handleLogout}
              className={`w-full text-left block px-3 py-2 rounded-md text-base font-medium ${linkColor}`}
            >
              Sign out
            </button>
          </div>
        ) : (
          <div className="px-2 space-y-2">
            <Link
              to="/login"
              className={`block px-3 py-2 rounded-md text-base font-medium ${linkColor}`}
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className={`block px-3 py-2 rounded-md text-base font-medium ${linkColor}`}
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileMenu;
