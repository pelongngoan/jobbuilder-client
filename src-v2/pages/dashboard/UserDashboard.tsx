import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { Link } from "react-router-dom";

const UserDashboard = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <div className="user-dashboard p-6">
      <div className="dashboard-header bg-white p-6 rounded-lg shadow-md mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Welcome, {user?.name}
        </h1>
      </div>

      {/* Quick Action Links */}
      <div className="quick-actions bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/dashboard/user/profile"
            className="flex items-center p-3 rounded-md bg-blue-50 text-blue-700 hover:bg-blue-100 transition"
          >
            <span className="mr-2">👤</span>
            <span>Edit Profile</span>
          </Link>
          <Link
            to="/dashboard/user/resume"
            className="flex items-center p-3 rounded-md bg-green-50 text-green-700 hover:bg-green-100 transition"
          >
            <span className="mr-2">📄</span>
            <span>Update Resume</span>
          </Link>
          <Link
            to="/dashboard/user/jobs"
            className="flex items-center p-3 rounded-md bg-purple-50 text-purple-700 hover:bg-purple-100 transition"
          >
            <span className="mr-2">🔍</span>
            <span>Find Jobs</span>
          </Link>
        </div>
      </div>

      <div className="dashboard-stats grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="stat-card bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700">Applications</h3>
          <p className="stat-value text-3xl font-bold text-blue-600 mt-2">0</p>
        </div>
        <div className="stat-card bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700">Saved Jobs</h3>
          <p className="stat-value text-3xl font-bold text-blue-600 mt-2">0</p>
        </div>
        <div className="stat-card bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700">Interviews</h3>
          <p className="stat-value text-3xl font-bold text-blue-600 mt-2">0</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="dashboard-section bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Recent Job Applications</h2>
            <Link
              to="/dashboard/user/applications"
              className="text-sm text-blue-600 hover:underline"
            >
              View All
            </Link>
          </div>
          <div className="empty-state p-6 bg-gray-50 rounded-md text-center">
            <p className="text-gray-500">
              You haven't applied to any jobs yet.
            </p>
          </div>
        </div>

        <div className="dashboard-section bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Recommended Jobs</h2>
            <Link
              to="/dashboard/user/jobs"
              className="text-sm text-blue-600 hover:underline"
            >
              View All
            </Link>
          </div>
          <div className="empty-state p-6 bg-gray-50 rounded-md text-center">
            <p className="text-gray-500">
              Job recommendations will appear here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
