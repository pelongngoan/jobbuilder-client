import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { RootState } from "../../redux/store";
import applicationService from "../../services/applicationService";
import { Application, ApplicationStatus } from "../../types";

const ApplicationsReviewPage: React.FC = () => {
  const { user, role } = useSelector((state: RootState) => state.auth);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | "all">(
    "all"
  );
  const [selectedApplication, setSelectedApplication] =
    useState<Application | null>(null);
  const [feedback, setFeedback] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Load applications on component mount
  useEffect(() => {
    fetchApplications();
  }, [currentPage, statusFilter]);

  const fetchApplications = async () => {
    setLoading(true);
    setError(null);

    try {
      // Filter by status if not "all"
      const filters = statusFilter !== "all" ? { status: [statusFilter] } : {};

      // Use the appropriate service method based on available data
      const response = await applicationService.getMyApplications(
        filters,
        currentPage,
        10
      );

      if (response.success && response.data) {
        setApplications(response.data.items);
        setTotalPages(response.data.totalPages);
      } else {
        setError(response.error || "Failed to load applications");
      }
    } catch (err) {
      setError("An error occurred while fetching applications");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (
    applicationId: string,
    newStatus: ApplicationStatus
  ) => {
    setUpdatingStatus(true);
    try {
      const response = await applicationService.updateApplicationStatus(
        applicationId,
        {
          status: newStatus,
          feedback: feedback.trim() || undefined,
        }
      );

      if (response.success) {
        // Update the application in the local state
        setApplications(
          applications.map((app) =>
            app._id.toString() === applicationId
              ? { ...app, status: newStatus }
              : app
          )
        );
        setSelectedApplication(null);
        setFeedback("");
      } else {
        setError(response.error || "Failed to update application status");
      }
    } catch (err) {
      setError("An error occurred while updating the application");
      console.error(err);
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Only authorized roles can view this page
  if (role !== "company" && role !== "hr" && role !== "admin") {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
        <p>You do not have permission to review applications.</p>
      </div>
    );
  }

  // Status Badge component
  const StatusBadge = ({ status }: { status: ApplicationStatus }) => {
    const colorMap = {
      pending: "bg-yellow-100 text-yellow-800",
      reviewed: "bg-blue-100 text-blue-800",
      shortlisted: "bg-purple-100 text-purple-800",
      interview: "bg-indigo-100 text-indigo-800",
      accepted: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
    };

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${colorMap[status]}`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Applications Review
      </h1>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <div>
          <label
            htmlFor="statusFilter"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Filter by Status
          </label>
          <select
            id="statusFilter"
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as ApplicationStatus | "all")
            }
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Applications</option>
            <option value="pending">Pending</option>
            <option value="reviewed">Reviewed</option>
            <option value="shortlisted">Shortlisted</option>
            <option value="interview">Interview</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Applications List */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : applications.length === 0 ? (
        <div className="bg-gray-50 p-8 rounded-lg text-center">
          <p className="text-gray-600 mb-4">No applications found.</p>
          <p className="text-gray-500 text-sm">
            Try adjusting your filters or checking back later.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Applicant
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Job
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Applied On
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {applications.map((application) => (
                <tr key={application._id.toString()}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {application.user?.name || "Applicant"}
                    </div>
                    <div className="text-sm text-gray-500">
                      {application.user?.email || "No email"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {application.job?.title || "Job Title"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {new Date(application.appliedAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={application.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      onClick={() => setSelectedApplication(application)}
                      className="text-blue-600 hover:text-blue-800 mr-3"
                    >
                      Review
                    </button>
                    <Link
                      to={`/management/applications/${application._id}`}
                      className="text-purple-600 hover:text-purple-800"
                    >
                      Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`px-4 py-2 border rounded-md ${
              currentPage === 1
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            Previous
          </button>
          <span className="px-4 py-2 text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className={`px-4 py-2 border rounded-md ${
              currentPage === totalPages
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            Next
          </button>
        </div>
      )}

      {/* Application Review Modal */}
      {selectedApplication && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                  Review Application
                </h2>
                <button
                  onClick={() => {
                    setSelectedApplication(null);
                    setFeedback("");
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">
                  Applicant Information
                </h3>
                <p>
                  <span className="font-medium">Name:</span>{" "}
                  {selectedApplication.user?.name || "N/A"}
                </p>
                <p>
                  <span className="font-medium">Email:</span>{" "}
                  {selectedApplication.user?.email || "N/A"}
                </p>
                <p>
                  <span className="font-medium">Applied For:</span>{" "}
                  {selectedApplication.job?.title || "N/A"}
                </p>
                <p>
                  <span className="font-medium">Applied On:</span>{" "}
                  {new Date(selectedApplication.appliedAt).toLocaleDateString()}
                </p>
                <p>
                  <span className="font-medium">Current Status:</span>{" "}
                  <StatusBadge status={selectedApplication.status} />
                </p>
              </div>

              {selectedApplication.coverLetter && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Cover Letter</h3>
                  <div className="p-4 bg-gray-50 rounded-md whitespace-pre-wrap">
                    {selectedApplication.coverLetter}
                  </div>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">
                  Update Application Status
                </h3>

                <div className="mb-4">
                  <label
                    htmlFor="feedback"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Feedback/Notes (optional)
                  </label>
                  <textarea
                    id="feedback"
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Add notes or feedback for this application..."
                  ></textarea>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {selectedApplication.status !== "reviewed" && (
                    <button
                      onClick={() =>
                        handleStatusChange(
                          selectedApplication._id.toString(),
                          "reviewed"
                        )
                      }
                      disabled={updatingStatus}
                      className="px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
                    >
                      Mark as Reviewed
                    </button>
                  )}

                  {selectedApplication.status !== "shortlisted" && (
                    <button
                      onClick={() =>
                        handleStatusChange(
                          selectedApplication._id.toString(),
                          "shortlisted"
                        )
                      }
                      disabled={updatingStatus}
                      className="px-4 py-2 bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200"
                    >
                      Shortlist
                    </button>
                  )}

                  {selectedApplication.status !== "interview" && (
                    <button
                      onClick={() =>
                        handleStatusChange(
                          selectedApplication._id.toString(),
                          "interview"
                        )
                      }
                      disabled={updatingStatus}
                      className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200"
                    >
                      Schedule Interview
                    </button>
                  )}

                  {selectedApplication.status !== "accepted" && (
                    <button
                      onClick={() =>
                        handleStatusChange(
                          selectedApplication._id.toString(),
                          "accepted"
                        )
                      }
                      disabled={updatingStatus}
                      className="px-4 py-2 bg-green-100 text-green-700 rounded-md hover:bg-green-200"
                    >
                      Accept
                    </button>
                  )}

                  {selectedApplication.status !== "rejected" && (
                    <button
                      onClick={() =>
                        handleStatusChange(
                          selectedApplication._id.toString(),
                          "rejected"
                        )
                      }
                      disabled={updatingStatus}
                      className="px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200"
                    >
                      Reject
                    </button>
                  )}
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => {
                    setSelectedApplication(null);
                    setFeedback("");
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationsReviewPage;
