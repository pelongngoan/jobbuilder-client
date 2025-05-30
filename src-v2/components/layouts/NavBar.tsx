import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useCategory } from "../../hooks/useCategory";
import { useUser } from "../../hooks/useUser";
import { getImageUrl } from "../../pages/users/CompanyCard";
import { useAppDispatch } from "../../redux/store";
import { useNavigate } from "react-router-dom";
import { logout } from "../../redux/slices/authSlice";
import { useTranslation } from "react-i18next";
import { Notification, ChatButton } from "../common";

interface NavBarProps {
  variant?: "light" | "dark";
}

const NavBar: React.FC<NavBarProps> = ({ variant = "light" }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { categories, getCategories } = useCategory();
  const { user, profile, getUserProfile } = useUser();
  // const { page, limit } = useAppSelector((state) => state.pagination);
  useEffect(() => {
    getCategories(1, 100);
    getUserProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [isScrolled, setIsScrolled] = useState(false);
  const [jobsDropdownOpen, setJobsDropdownOpen] = useState(false);
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const jobsDropdownRef = useRef<HTMLDivElement>(null);
  const toolsDropdownRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);

  // Handle scroll effect for transparent to solid navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        jobsDropdownRef.current &&
        !jobsDropdownRef.current.contains(event.target as Node)
      ) {
        setJobsDropdownOpen(false);
      }
      if (
        toolsDropdownRef.current &&
        !toolsDropdownRef.current.contains(event.target as Node)
      ) {
        setToolsDropdownOpen(false);
      }
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target as Node)
      ) {
        setUserDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleJobsDropdown = () => {
    setJobsDropdownOpen(!jobsDropdownOpen);
    if (toolsDropdownOpen) setToolsDropdownOpen(false);
    if (userDropdownOpen) setUserDropdownOpen(false);
  };

  const toggleToolsDropdown = () => {
    setToolsDropdownOpen(!toolsDropdownOpen);
    if (jobsDropdownOpen) setJobsDropdownOpen(false);
    if (userDropdownOpen) setUserDropdownOpen(false);
  };

  const toggleUserDropdown = () => {
    setUserDropdownOpen(!userDropdownOpen);
    if (jobsDropdownOpen) setJobsDropdownOpen(false);
    if (toolsDropdownOpen) setToolsDropdownOpen(false);
  };

  // Close mobile menu and dropdowns when route changes
  useEffect(() => {
    setJobsDropdownOpen(false);
    setToolsDropdownOpen(false);
    setUserDropdownOpen(false);
  }, [location.pathname]);

  // Styles based on variant
  const bgColor =
    variant === "light"
      ? isScrolled
        ? "bg-white shadow-md"
        : "bg-white shadow"
      : "bg-gray-800 shadow-md";
  const logoColor = variant === "light" ? "text-blue-600" : "text-white";
  const linkColor =
    variant === "light"
      ? "text-gray-600 hover:text-blue-600"
      : "text-gray-200 hover:text-white";

  // Get user's first name or username for display
  const profileData =
    profile?.profile && typeof profile.profile === "object"
      ? profile.profile
      : null;
  const displayName = profileData?.firstName || user?.email || "User";

  // Get user's initials for avatar fallback
  const getInitials = () => {
    if (profileData?.firstName && profileData?.lastName) {
      return `${profileData.firstName.charAt(0)}${profileData.lastName.charAt(
        0
      )}`.toUpperCase();
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return "U";
  };

  return (
    <nav
      className={`${bgColor} fixed top-0 left-0 right-0 z-10 transition-all duration-300`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16">
          {/* Logo and brand */}
          <div className="flex items-center">
            <Link
              to="/user"
              className={`flex-shrink-0 flex items-center ${logoColor} font-bold text-xl`}
            >
              JobBuilder
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:ml-8 md:flex md:space-x-6">
              {/* Jobs Dropdown */}
              <div className="relative" ref={jobsDropdownRef}>
                <button
                  onClick={toggleJobsDropdown}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${linkColor}`}
                >
                  <span>{t("navigation.jobs")}</span>
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
                      d={jobsDropdownOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
                    />
                  </svg>
                </button>

                {jobsDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-60 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                    <div className="py-1">
                      <div className="px-4 py-2 font-medium text-sm text-gray-700 bg-gray-50">
                        {t("navigation.jobsByCategory")}
                      </div>
                      {categories
                        .filter((category) => category.parentCategory === null)
                        .map((category) => (
                          <Link
                            key={category._id}
                            to={`/user/jobs/category/${category._id}`}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            {category.name}
                          </Link>
                        ))}
                    </div>
                  </div>
                )}
              </div>

              <Link
                to="/user/companies"
                className={`px-3 py-2 rounded-md text-sm font-medium ${linkColor}`}
              >
                {t("navigation.companies")}
              </Link>

              {/* Tools Dropdown */}
              <div className="relative" ref={toolsDropdownRef}>
                <button
                  onClick={toggleToolsDropdown}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${linkColor}`}
                >
                  <span>{t("navigation.tools")}</span>
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
                      d={toolsDropdownOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
                    />
                  </svg>
                </button>

                {toolsDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                    <div className="py-1">
                      <div className="px-4 py-2 font-medium text-sm text-gray-700 bg-gray-50">
                        {t("navigation.careerTools")}
                      </div>
                      <Link
                        to="/user/resumes"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        {t("navigation.resumeBuilder")}
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right side with user profile */}
          <div className="hidden md:flex items-center space-x-4">
            <Notification />
            <ChatButton />
            {profile ? (
              <div className="relative" ref={userDropdownRef}>
                <button
                  onClick={toggleUserDropdown}
                  className="flex items-center space-x-2 focus:outline-none"
                >
                  <div className="flex items-center space-x-3">
                    {profileData?.profilePicture ? (
                      <img
                        src={getImageUrl(
                          `/uploads/${profileData.profilePicture}`
                        )}
                        alt="Profile"
                        className="h-8 w-8 rounded-full object-cover border border-gray-200"
                      />
                    ) : (
                      <div
                        className={`h-8 w-8 rounded-full flex items-center justify-center ${
                          variant === "light"
                            ? "bg-blue-100 text-blue-600"
                            : "bg-blue-600 text-white"
                        }`}
                      >
                        {getInitials()}
                      </div>
                    )}
                    <span className={`text-sm font-medium ${linkColor}`}>
                      {displayName}
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
                        strokeWidth="2"
                        d={
                          userDropdownOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"
                        }
                      />
                    </svg>
                  </div>
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                    <div className="py-1">
                      <div className="px-4 py-2 font-medium text-sm text-gray-700 bg-gray-50 border-b">
                        {t("navigation.myAccount")}
                      </div>
                      <Link
                        to="/user/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <div className="flex items-center">
                          <svg
                            className="mr-2 h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            ></path>
                          </svg>
                          {t("dashboard.profile")}
                        </div>
                      </Link>
                      <Link
                        to="/user/applications"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <div className="flex items-center">
                          <svg
                            className="mr-2 h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                            ></path>
                          </svg>
                          {t("dashboard.applications")}
                        </div>
                      </Link>
                      <Link
                        to="/user/saved-jobs"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <div className="flex items-center">
                          <svg
                            className="mr-2 h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                            ></path>
                          </svg>
                          {t("dashboard.savedJobs")}
                        </div>
                      </Link>
                      <div className="border-t border-gray-100"></div>
                      <button
                        onClick={() => {
                          dispatch(logout());
                          navigate("/user/login");
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <div className="flex items-center">
                          <svg
                            className="mr-2 h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                            ></path>
                          </svg>
                          {t("common.logout")}
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex space-x-4">
                <Link
                  to="/user/login"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${linkColor}`}
                >
                  {t("common.login")}
                </Link>
                <Link
                  to="/user/register"
                  className="px-3 py-2 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700"
                >
                  {t("common.register")}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
