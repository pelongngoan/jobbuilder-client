import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { Link } from "react-router-dom";

const ManagerDashboard = () => {
  const { user, role } = useSelector((state: RootState) => state.auth);

  return (
    <div className="manager-dashboard p-6">
      <div className="dashboard-header bg-white p-6 rounded-lg shadow-md mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Welcome, {user?.name}
        </h1>
        <p className="text-gray-600">Role: {role}</p>
      </div>

      {/* Quick Action Links */}
      <div className="quick-actions bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/management/profile"
            className="flex items-center p-3 rounded-md bg-blue-50 text-blue-700 hover:bg-blue-100 transition"
          >
            <span className="mr-2">👤</span>
            <span>Edit Profile</span>
          </Link>
          {role === "company" && (
            <Link
              to="/management/jobs/create"
              className="flex items-center p-3 rounded-md bg-green-50 text-green-700 hover:bg-green-100 transition"
            >
              <span className="mr-2">➕</span>
              <span>Post a Job</span>
            </Link>
          )}
          {(role === "hr" || role === "company") && (
            <Link
              to="/management/applications"
              className="flex items-center p-3 rounded-md bg-purple-50 text-purple-700 hover:bg-purple-100 transition"
            >
              <span className="mr-2">📝</span>
              <span>Review Applications</span>
            </Link>
          )}
          {role === "admin" && (
            <Link
              to="/management/users"
              className="flex items-center p-3 rounded-md bg-amber-50 text-amber-700 hover:bg-amber-100 transition"
            >
              <span className="mr-2">👥</span>
              <span>Manage Users</span>
            </Link>
          )}
        </div>
      </div>

      {/* Admin Dashboard */}
      {role === "admin" && (
        <>
          <div className="dashboard-stats grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="stat-card bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-700">
                Total Users
              </h3>
              <p className="stat-value text-3xl font-bold text-blue-600 mt-2">
                0
              </p>
            </div>
            <div className="stat-card bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-700">Companies</h3>
              <p className="stat-value text-3xl font-bold text-blue-600 mt-2">
                0
              </p>
            </div>
            <div className="stat-card bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-700">
                Active Jobs
              </h3>
              <p className="stat-value text-3xl font-bold text-blue-600 mt-2">
                0
              </p>
            </div>
          </div>

          <div className="dashboard-section bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Recent Users</h2>
              <Link
                to="/management/users"
                className="text-sm text-blue-600 hover:underline"
              >
                View All
              </Link>
            </div>
            <div className="empty-state p-6 bg-gray-50 rounded-md text-center">
              <p className="text-gray-500">No users to display.</p>
            </div>
          </div>
        </>
      )}

      {/* HR Dashboard */}
      {role === "hr" && (
        <>
          <div className="dashboard-stats grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="stat-card bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-700">
                Applications
              </h3>
              <p className="stat-value text-3xl font-bold text-blue-600 mt-2">
                0
              </p>
            </div>
            <div className="stat-card bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-700">
                Active Jobs
              </h3>
              <p className="stat-value text-3xl font-bold text-blue-600 mt-2">
                0
              </p>
            </div>
            <div className="stat-card bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-700">
                Interviews
              </h3>
              <p className="stat-value text-3xl font-bold text-blue-600 mt-2">
                0
              </p>
            </div>
          </div>

          <div className="dashboard-section bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Recent Applications</h2>
              <Link
                to="/management/applications"
                className="text-sm text-blue-600 hover:underline"
              >
                View All
              </Link>
            </div>
            <div className="empty-state p-6 bg-gray-50 rounded-md text-center">
              <p className="text-gray-500">No applications to display.</p>
            </div>
          </div>
        </>
      )}

      {/* Company Dashboard */}
      {role === "company" && (
        <>
          <div className="dashboard-stats grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="stat-card bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-700">
                Posted Jobs
              </h3>
              <p className="stat-value text-3xl font-bold text-blue-600 mt-2">
                0
              </p>
            </div>
            <div className="stat-card bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-700">
                Applications
              </h3>
              <p className="stat-value text-3xl font-bold text-blue-600 mt-2">
                0
              </p>
            </div>
            <div className="stat-card bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-700">Hired</h3>
              <p className="stat-value text-3xl font-bold text-blue-600 mt-2">
                0
              </p>
            </div>
          </div>

          <div className="dashboard-section bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Recent Job Posts</h2>
              <Link
                to="/management/jobs"
                className="text-sm text-blue-600 hover:underline"
              >
                View All
              </Link>
            </div>
            <div className="empty-state p-6 bg-gray-50 rounded-md text-center">
              <p className="text-gray-500">No job posts to display.</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ManagerDashboard;
