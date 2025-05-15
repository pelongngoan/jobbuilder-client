import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "../common";

interface NavBarProps {
  variant?: "light" | "dark";
}

const NavBar: React.FC<NavBarProps> = ({ variant = "light" }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [jobsDropdownOpen, setJobsDropdownOpen] = useState(false);
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false);

  const jobsDropdownRef = useRef<HTMLDivElement>(null);
  const toolsDropdownRef = useRef<HTMLDivElement>(null);

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
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleJobsDropdown = () => {
    setJobsDropdownOpen(!jobsDropdownOpen);
    if (toolsDropdownOpen) setToolsDropdownOpen(false);
  };

  const toggleToolsDropdown = () => {
    setToolsDropdownOpen(!toolsDropdownOpen);
    if (jobsDropdownOpen) setJobsDropdownOpen(false);
  };

  // Close mobile menu and dropdowns when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsProfileMenuOpen(false);
    setJobsDropdownOpen(false);
    setToolsDropdownOpen(false);
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

  return (
    <nav
      className={`${bgColor} fixed top-0 left-0 right-0 z-10 transition-all duration-300`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16">
          {/* Logo and brand */}
          <div className="flex items-center">
            <Link
              to="/"
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
                      d={jobsDropdownOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
                    />
                  </svg>
                </button>

                {jobsDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-60 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                    <div className="py-1">
                      <div className="px-4 py-2 font-medium text-sm text-gray-700 bg-gray-50">
                        JOBS BY CATEGORY
                      </div>
                      <Link
                        to="/jobs?category=it"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        IT & Software Development
                      </Link>
                      <Link
                        to="/jobs?category=marketing"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Marketing
                      </Link>
                      <Link
                        to="/jobs?category=finance"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Finance & Accounting
                      </Link>
                      <Link
                        to="/jobs?category=hr"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Human Resources
                      </Link>
                      <Link
                        to="/jobs?category=sales"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Sales
                      </Link>
                      <Link
                        to="/jobs?category=engineering"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Engineering
                      </Link>
                      <Link
                        to="/jobs?category=healthcare"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Healthcare
                      </Link>
                      <Link
                        to="/jobs?category=education"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Education
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              <Link
                to="/companies"
                className={`px-3 py-2 rounded-md text-sm font-medium ${linkColor}`}
              >
                Companies
              </Link>

              {/* Tools Dropdown */}
              <div className="relative" ref={toolsDropdownRef}>
                <button
                  onClick={toggleToolsDropdown}
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
                      d={toolsDropdownOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
                    />
                  </svg>
                </button>

                {toolsDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                    <div className="py-1">
                      <div className="px-4 py-2 font-medium text-sm text-gray-700 bg-gray-50">
                        CAREER TOOLS
                      </div>
                      <Link
                        to="/resume-builder"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Resume Builder
                      </Link>
                      <Link
                        to="/cover-letter"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Cover Letter Generator
                      </Link>
                      <Link
                        to="/salary-calculator"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Salary Calculator
                      </Link>
                      <Link
                        to="/career-advice"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Career Advice
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={toggleMobileMenu}
              className={`inline-flex items-center justify-center p-2 rounded-md ${linkColor}`}
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {/* Icon when menu is closed */}
              <svg
                className={`${isMobileMenuOpen ? "hidden" : "block"} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              {/* Icon when menu is open */}
              <svg
                className={`${isMobileMenuOpen ? "block" : "hidden"} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      <div
        className={`${isMobileMenuOpen ? "block" : "hidden"} md:hidden ${
          variant === "light" ? "bg-white" : "bg-gray-800"
        }`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <div className="px-3 py-2 font-medium text-base text-gray-500">
            JOBS BY CATEGORY
          </div>
          <Link
            to="/jobs"
            className={`block px-3 py-2 rounded-md text-base font-medium ${linkColor}`}
          >
            All Jobs
          </Link>
          <Link
            to="/jobs?category=it"
            className={`block px-3 py-2 rounded-md text-base font-medium ${linkColor}`}
          >
            IT & Software Development
          </Link>
          <Link
            to="/jobs?category=marketing"
            className={`block px-3 py-2 rounded-md text-base font-medium ${linkColor}`}
          >
            Marketing
          </Link>
          <Link
            to="/jobs?category=finance"
            className={`block px-3 py-2 rounded-md text-base font-medium ${linkColor}`}
          >
            Finance & Accounting
          </Link>
          <Link
            to="/jobs?category=hr"
            className={`block px-3 py-2 rounded-md text-base font-medium ${linkColor}`}
          >
            Human Resources
          </Link>
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
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
