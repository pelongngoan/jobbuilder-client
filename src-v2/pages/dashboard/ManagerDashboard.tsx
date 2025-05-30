import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { Link } from "react-router-dom";
import { useNotifications } from "../../hooks/useNotifications";
import { useSocket } from "../../hooks/useSocket";
import { useDashboard } from "../../hooks/useDashboard";

const ManagerDashboard = () => {
  const { id, role } = useSelector((state: RootState) => state.auth);
  const { notifications, unreadCount } = useNotifications();
  const { isConnected } = useSocket();
  const { stats, isLoading, error, refetch } = useDashboard();

  // Filter notifications for staff dashboard
  const recentNotifications = notifications
    .filter(
      (n) => n.type === "job_application" || n.type === "application_status"
    )
    .slice(0, 5);

  // Refresh stats when real-time events occur
  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [refetch]);

  if (isLoading) {
    return (
      <div className="manager-dashboard p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="manager-dashboard p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong>Error:</strong> {error}
          <button
            onClick={refetch}
            className="ml-4 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="manager-dashboard p-6">
      <div className="dashboard-header bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Welcome, {id || "Manager"}
            </h1>
            <p className="text-gray-600">Role: {role}</p>
          </div>
          <div className="flex items-center space-x-4">
            <div
              className={`w-3 h-3 rounded-full ${
                isConnected ? "bg-green-500" : "bg-red-500"
              }`}
            ></div>
            <span className="text-sm text-gray-600">
              {isConnected ? "Connected" : "Disconnected"}
            </span>
            {unreadCount > 0 && (
              <div className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-medium">
                {unreadCount} new notifications
              </div>
            )}
            <button
              onClick={refetch}
              className="px-3 py-1 text-sm bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Real-time Notifications */}
      {recentNotifications.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">
            Recent Notifications
          </h2>
          <div className="space-y-3">
            {recentNotifications.map((notification) => (
              <div
                key={notification._id}
                className={`p-3 rounded-lg border-l-4 ${
                  notification.isRead
                    ? "border-gray-300 bg-gray-50"
                    : "border-blue-500 bg-blue-50"
                }`}
              >
                <h3 className="font-medium text-gray-900">
                  {notification.title}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {notification.content}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  {new Date(notification.createdAt!).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
          <Link
            to="/manager/notifications"
            className="inline-block mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            View all notifications →
          </Link>
        </div>
      )}

      {/* Quick Action Links */}
      <div className="quick-actions bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/manager/profile"
            className="flex items-center p-3 rounded-md bg-blue-50 text-blue-700 hover:bg-blue-100 transition"
          >
            <span className="mr-2">👤</span>
            <span>Edit Profile</span>
          </Link>
          {role === "company" && (
            <Link
              to="/manager/jobs/create"
              className="flex items-center p-3 rounded-md bg-green-50 text-green-700 hover:bg-green-100 transition"
            >
              <span className="mr-2">➕</span>
              <span>Post a Job</span>
            </Link>
          )}
          {(role === "staff" || role === "company") && (
            <Link
              to="/manager/applications"
              className="flex items-center p-3 rounded-md bg-purple-50 text-purple-700 hover:bg-purple-100 transition"
            >
              <span className="mr-2">📝</span>
              <span>Review Applications</span>
            </Link>
          )}
          {role === "admin" && (
            <Link
              to="/manager/users"
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
          <div className="dashboard-stats grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="stat-card bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-700">
                Total Users
              </h3>
              <p className="stat-value text-3xl font-bold text-blue-600 mt-2">
                {stats.totalUsers || 0}
              </p>
            </div>
            <div className="stat-card bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-700">Companies</h3>
              <p className="stat-value text-3xl font-bold text-green-600 mt-2">
                {stats.totalCompanies || 0}
              </p>
            </div>
            <div className="stat-card bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-700">
                Active Jobs
              </h3>
              <p className="stat-value text-3xl font-bold text-purple-600 mt-2">
                {stats.totalJobs || 0}
              </p>
            </div>
            <div className="stat-card bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-700">
                Applications
              </h3>
              <p className="stat-value text-3xl font-bold text-orange-600 mt-2">
                {stats.totalApplications || 0}
              </p>
            </div>
          </div>

          <div className="dashboard-section bg-white p-6 rounded-lg shadow-md mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Recent Users</h2>
              <Link
                to="/manager/users"
                className="text-sm text-blue-600 hover:underline"
              >
                View All
              </Link>
            </div>
            {stats.recentUsers && stats.recentUsers.length > 0 ? (
              <div className="space-y-3">
                {stats.recentUsers.map((user) => (
                  <div
                    key={user._id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-900">
                        {user.profile.firstName} {user.profile.lastName}
                      </p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state p-6 bg-gray-50 rounded-md text-center">
                <p className="text-gray-500">No users to display.</p>
              </div>
            )}
          </div>
        </>
      )}

      {/* Staff Dashboard */}
      {role === "staff" && (
        <>
          <div className="dashboard-stats grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="stat-card bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-700">
                Total Applications
              </h3>
              <p className="stat-value text-3xl font-bold text-blue-600 mt-2">
                {stats.totalApplications || 0}
              </p>
            </div>
            <div className="stat-card bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-700">
                Pending Review
              </h3>
              <p className="stat-value text-3xl font-bold text-orange-600 mt-2">
                {stats.pendingReview || 0}
              </p>
            </div>
            <div className="stat-card bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-700">
                Interviews Scheduled
              </h3>
              <p className="stat-value text-3xl font-bold text-purple-600 mt-2">
                {stats.interviewsScheduled || 0}
              </p>
            </div>
            <div className="stat-card bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-700">
                Today's Applications
              </h3>
              <p className="stat-value text-3xl font-bold text-green-600 mt-2">
                {stats.todayApplications || 0}
              </p>
            </div>
          </div>

          {/* Applications by Status Chart */}
          {stats.applicationsByStatus && (
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h2 className="text-lg font-semibold mb-4">
                Applications by Status
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(stats.applicationsByStatus).map(
                  ([status, count]) => (
                    <div
                      key={status}
                      className="text-center p-3 border rounded-lg"
                    >
                      <div className="text-2xl font-bold text-blue-600">
                        {count}
                      </div>
                      <div className="text-sm text-gray-600 capitalize">
                        {status}
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          <div className="dashboard-section bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Recent Applications</h2>
              <Link
                to="/manager/applications"
                className="text-sm text-blue-600 hover:underline"
              >
                View All
              </Link>
            </div>
            {stats.recentApplications && stats.recentApplications.length > 0 ? (
              <div className="space-y-3">
                {stats.recentApplications.slice(0, 5).map((application) => (
                  <div
                    key={application._id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-900">
                        {application.userId.profile.firstName}{" "}
                        {application.userId.profile.lastName}
                      </p>
                      <p className="text-sm text-gray-500">
                        {application.jobId.title}
                      </p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          application.status === "pending"
                            ? "bg-orange-100 text-orange-800"
                            : application.status === "accepted"
                            ? "bg-green-100 text-green-800"
                            : application.status === "rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {application.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state p-6 bg-gray-50 rounded-md text-center">
                <p className="text-gray-500">No applications to display.</p>
              </div>
            )}
          </div>
        </>
      )}

      {/* Company Dashboard */}
      {role === "company" && (
        <>
          <div className="dashboard-stats grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="stat-card bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-700">
                Posted Jobs
              </h3>
              <p className="stat-value text-3xl font-bold text-blue-600 mt-2">
                {stats.totalJobs || 0}
              </p>
            </div>
            <div className="stat-card bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-700">
                Active Jobs
              </h3>
              <p className="stat-value text-3xl font-bold text-green-600 mt-2">
                {stats.activeJobs || 0}
              </p>
            </div>
            <div className="stat-card bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-700">
                Total Applications
              </h3>
              <p className="stat-value text-3xl font-bold text-purple-600 mt-2">
                {stats.totalApplications || 0}
              </p>
            </div>
            <div className="stat-card bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-700">Hired</h3>
              <p className="stat-value text-3xl font-bold text-orange-600 mt-2">
                {stats.acceptedApplications || 0}
              </p>
            </div>
          </div>

          {/* Applications by Status for Company */}
          {stats.applicationsByStatus && (
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h2 className="text-lg font-semibold mb-4">
                Applications Overview
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="text-center p-3 border rounded-lg bg-orange-50">
                  <div className="text-2xl font-bold text-orange-600">
                    {stats.applicationsByStatus.pending}
                  </div>
                  <div className="text-sm text-gray-600">Pending</div>
                </div>
                <div className="text-center p-3 border rounded-lg bg-blue-50">
                  <div className="text-2xl font-bold text-blue-600">
                    {stats.applicationsByStatus.reviewed}
                  </div>
                  <div className="text-sm text-gray-600">Reviewed</div>
                </div>
                <div className="text-center p-3 border rounded-lg bg-purple-50">
                  <div className="text-2xl font-bold text-purple-600">
                    {stats.applicationsByStatus.shortlisted}
                  </div>
                  <div className="text-sm text-gray-600">Shortlisted</div>
                </div>
                <div className="text-center p-3 border rounded-lg bg-yellow-50">
                  <div className="text-2xl font-bold text-yellow-600">
                    {stats.applicationsByStatus.interview}
                  </div>
                  <div className="text-sm text-gray-600">Interview</div>
                </div>
                <div className="text-center p-3 border rounded-lg bg-green-50">
                  <div className="text-2xl font-bold text-green-600">
                    {stats.applicationsByStatus.accepted}
                  </div>
                  <div className="text-sm text-gray-600">Accepted</div>
                </div>
                <div className="text-center p-3 border rounded-lg bg-red-50">
                  <div className="text-2xl font-bold text-red-600">
                    {stats.applicationsByStatus.rejected}
                  </div>
                  <div className="text-sm text-gray-600">Rejected</div>
                </div>
              </div>
            </div>
          )}

          {/* Recent Job Posts */}
          <div className="dashboard-section bg-white p-6 rounded-lg shadow-md mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Recent Job Posts</h2>
              <Link
                to="/manager/jobs"
                className="text-sm text-blue-600 hover:underline"
              >
                View All
              </Link>
            </div>
            {stats.recentJobs && stats.recentJobs.length > 0 ? (
              <div className="space-y-3">
                {stats.recentJobs.map((job) => (
                  <div
                    key={job._id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{job.title}</p>
                      <p className="text-sm text-gray-500">{job.location}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-blue-600">
                        {job.applicationCount} applications
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(job.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state p-6 bg-gray-50 rounded-md text-center">
                <p className="text-gray-500">No job posts to display.</p>
              </div>
            )}
          </div>

          {/* Recent Applications */}
          <div className="dashboard-section bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Recent Applications</h2>
              <Link
                to="/manager/applications"
                className="text-sm text-blue-600 hover:underline"
              >
                View All
              </Link>
            </div>
            {stats.recentApplications && stats.recentApplications.length > 0 ? (
              <div className="space-y-3">
                {stats.recentApplications.slice(0, 5).map((application) => (
                  <div
                    key={application._id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-900">
                        {application.userId.profile.firstName}{" "}
                        {application.userId.profile.lastName}
                      </p>
                      <p className="text-sm text-gray-500">
                        {application.jobId.title}
                      </p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          application.status === "pending"
                            ? "bg-orange-100 text-orange-800"
                            : application.status === "accepted"
                            ? "bg-green-100 text-green-800"
                            : application.status === "rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {application.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state p-6 bg-gray-50 rounded-md text-center">
                <p className="text-gray-500">No applications to display.</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ManagerDashboard;
