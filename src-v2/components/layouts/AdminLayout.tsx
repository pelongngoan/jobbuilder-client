import React, { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import NavBar from "./NavBar";

const AdminLayout = () => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Check if the current path matches the link
  const isActive = (path: string) => {
    return (
      location.pathname === path || location.pathname.startsWith(`${path}/`)
    );
  };

  return (
    <div className="admin-layout flex flex-col min-h-screen">
      <NavBar variant="dark" />

      <div className="flex flex-grow pt-16">
        {/* Sidebar */}
        <aside
          className={`bg-gray-900 text-white transition-all duration-300 ${
            sidebarOpen ? "w-64" : "w-20"
          } fixed left-0 h-full z-10 pt-4 shadow-lg`}
        >
          <div className="px-4 py-2 flex justify-between items-center">
            <h2
              className={`text-xl font-semibold ${
                sidebarOpen ? "block" : "hidden"
              }`}
            >
              Admin Panel
            </h2>
            <button
              onClick={toggleSidebar}
              className="text-white p-1 rounded-md hover:bg-gray-700"
            >
              {sidebarOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 5l7 7-7 7M5 5l7 7-7 7"
                  />
                </svg>
              )}
            </button>
          </div>

          <nav className="mt-6">
            <ul className="space-y-1 px-2">
              {/* Dashboard */}
              <li>
                <Link
                  to="/admin/dashboard"
                  className={`flex items-center px-4 py-3 rounded-md transition-colors ${
                    isActive("/admin/dashboard")
                      ? "bg-blue-700"
                      : "hover:bg-gray-800"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                  <span className={`${sidebarOpen ? "block" : "hidden"}`}>
                    Dashboard
                  </span>
                </Link>
              </li>

              {/* Users */}
              <li>
                <Link
                  to="/admin/users"
                  className={`flex items-center px-4 py-3 rounded-md transition-colors ${
                    isActive("/admin/users")
                      ? "bg-blue-700"
                      : "hover:bg-gray-800"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                  <span className={`${sidebarOpen ? "block" : "hidden"}`}>
                    Users
                  </span>
                </Link>
              </li>

              {/* Jobs */}
              <li>
                <Link
                  to="/admin/jobs"
                  className={`flex items-center px-4 py-3 rounded-md transition-colors ${
                    isActive("/admin/jobs")
                      ? "bg-blue-700"
                      : "hover:bg-gray-800"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <span className={`${sidebarOpen ? "block" : "hidden"}`}>
                    Jobs
                  </span>
                </Link>
              </li>

              {/* Applications */}
              <li>
                <Link
                  to="/admin/applications"
                  className={`flex items-center px-4 py-3 rounded-md transition-colors ${
                    isActive("/admin/applications")
                      ? "bg-blue-700"
                      : "hover:bg-gray-800"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <span className={`${sidebarOpen ? "block" : "hidden"}`}>
                    Applications
                  </span>
                </Link>
              </li>

              {/* Companies */}
              <li>
                <Link
                  to="/admin/companies"
                  className={`flex items-center px-4 py-3 rounded-md transition-colors ${
                    isActive("/admin/companies")
                      ? "bg-blue-700"
                      : "hover:bg-gray-800"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                  <span className={`${sidebarOpen ? "block" : "hidden"}`}>
                    Companies
                  </span>
                </Link>
              </li>

              {/* Skills */}
              <li>
                <Link
                  to="/admin/skills"
                  className={`flex items-center px-4 py-3 rounded-md transition-colors ${
                    isActive("/admin/skills")
                      ? "bg-blue-700"
                      : "hover:bg-gray-800"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                  <span className={`${sidebarOpen ? "block" : "hidden"}`}>
                    Skills
                  </span>
                </Link>
              </li>

              {/* Job Categories */}
              <li>
                <Link
                  to="/admin/job-categories"
                  className={`flex items-center px-4 py-3 rounded-md transition-colors ${
                    isActive("/admin/job-categories")
                      ? "bg-blue-700"
                      : "hover:bg-gray-800"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                    />
                  </svg>
                  <span className={`${sidebarOpen ? "block" : "hidden"}`}>
                    Job Categories
                  </span>
                </Link>
              </li>

              {/* Settings */}
              <li>
                <Link
                  to="/admin/settings"
                  className={`flex items-center px-4 py-3 rounded-md transition-colors ${
                    isActive("/admin/settings")
                      ? "bg-blue-700"
                      : "hover:bg-gray-800"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span className={`${sidebarOpen ? "block" : "hidden"}`}>
                    Settings
                  </span>
                </Link>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main content */}
        <main
          className={`flex-grow transition-all duration-300 ${
            sidebarOpen ? "ml-64" : "ml-20"
          } pt-4 bg-gray-100 min-h-screen`}
        >
          <div className="container mx-auto px-6 py-8">
            <Outlet />
          </div>
        </main>
      </div>

      <footer
        className={`footer py-4 bg-gray-800 text-center transition-all duration-300 ${
          sidebarOpen ? "ml-64" : "ml-20"
        }`}
      >
        <div className="container mx-auto px-4">
          <p className="text-gray-300 text-sm">
            &copy; {new Date().getFullYear()} JobBuilder Admin. All rights
            reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default AdminLayout;
