import React, { useState, useEffect } from "react";
import {
  Search,
  Eye,
  Check,
  X,
  Clock,
  User,
  Briefcase,
  Calendar,
  Download,
} from "lucide-react";
import {
  fetchApplications,
  updateApplicationStatus,
} from "../../lib/api/services/applications";
import { Application } from "../../types/application";

export const ApplicationsPage = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [jobFilter, setJobFilter] = useState("all");
  const [selectedApplication, setSelectedApplication] =
    useState<Application | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    const loadApplications = async () => {
      try {
        const data = await fetchApplications();
        setApplications(data);
      } catch {
        // Handle error (show toast, etc.)
      }
    };
    loadApplications();
  }, []);

  // Filter applications based on search term and filters
  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.applicantName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      "" ||
      app.jobTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      "" ||
      app.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      "";

    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    const matchesJob = jobFilter === "all" || app.jobTitle === jobFilter;

    return matchesSearch && matchesStatus && matchesJob;
  });

  // Get unique job titles and statuses for filter dropdowns
  const jobTitles = [
    ...new Set(applications.map((app) => app.jobTitle)),
  ].filter(Boolean) as string[];
  const statuses = [...new Set(applications.map((app) => app.status))];

  const handleViewApplication = (application: Application) => {
    setSelectedApplication(application);
    setIsDrawerOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "New":
        return "bg-blue-100 text-blue-800";
      case "In Review":
        return "bg-yellow-100 text-yellow-800";
      case "Shortlisted":
        return "bg-green-100 text-green-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      case "Offer Extended":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRatingStars = (rating: number = 0) => {
    return "★".repeat(rating) + "☆".repeat(5 - rating);
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const updated = await updateApplicationStatus(id, newStatus);
      setApplications((prev) =>
        prev.map((app) =>
          app._id === updated._id ? { ...app, status: updated.status } : app
        )
      );
      if (selectedApplication && selectedApplication._id === updated._id) {
        setSelectedApplication({
          ...selectedApplication,
          status: updated.status,
        });
      }
    } catch {
      // Handle error (show toast, etc.)
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Applications</h1>
        <div className="flex space-x-2">
          <button className="bg-blue-600 text-white px-4 py-2 rounded flex items-center">
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Filter and search bar */}
      <div className="bg-white p-4 rounded-lg shadow flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search applicants..."
            className="pl-10 pr-4 py-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex space-x-4">
          <div>
            <select
              className="border rounded p-2 text-sm"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              {statuses.map((status, index) => (
                <option key={index} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              className="border rounded p-2 text-sm"
              value={jobFilter}
              onChange={(e) => setJobFilter(e.target.value)}
            >
              <option value="all">All Jobs</option>
              {jobTitles.map((job, index) => (
                <option key={index} value={job}>
                  {job}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Applications table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Applicant
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Job Position
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Applied Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rating
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredApplications.map((application) => (
              <tr key={application._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-semibold">
                        {application.applicantName
                          ? application.applicantName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                          : "NA"}
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {application.applicantName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {application.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {application.jobTitle}
                  </div>
                  <div className="text-xs text-gray-500">
                    Stage: {application.stage}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                      application.status
                    )}`}
                  >
                    {application.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {application.appliedAt}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-yellow-500">
                    {getRatingStars(application.rating)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => handleViewApplication(application)}
                      className="p-1 text-blue-600 hover:bg-blue-100 rounded-full"
                      title="View details"
                    >
                      <Eye className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() =>
                        handleUpdateStatus(application._id, "Shortlisted")
                      }
                      className="p-1 text-green-600 hover:bg-green-100 rounded-full"
                      title="Shortlist applicant"
                    >
                      <Check className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() =>
                        handleUpdateStatus(application._id, "Rejected")
                      }
                      className="p-1 text-red-600 hover:bg-red-100 rounded-full"
                      title="Reject applicant"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredApplications.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">
              No applications found matching your filters.
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Showing{" "}
          <span className="font-medium">{filteredApplications.length}</span> of{" "}
          <span className="font-medium">{applications.length}</span>{" "}
          applications
        </div>
        <div className="flex space-x-2">
          <button className="px-3 py-1 border rounded text-sm disabled:opacity-50">
            Previous
          </button>
          <button className="px-3 py-1 border rounded bg-blue-50 border-blue-500 text-blue-600 text-sm">
            1
          </button>
          <button className="px-3 py-1 border rounded text-sm disabled:opacity-50">
            Next
          </button>
        </div>
      </div>

      {/* Application detail drawer */}
      {isDrawerOpen && selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-end z-50">
          <div className="bg-white w-full max-w-md h-full overflow-y-auto">
            <div className="p-6 space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Application Details</h2>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-1 rounded-full hover:bg-gray-100"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-center flex-col">
                  <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-2xl font-semibold">
                    {selectedApplication.applicantName
                      ? selectedApplication.applicantName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                      : "NA"}
                  </div>
                  <h3 className="text-xl font-semibold mt-2">
                    {selectedApplication.applicantName}
                  </h3>
                  <div className="text-gray-500">
                    {selectedApplication.email}
                  </div>
                  <div className="text-gray-500">
                    {selectedApplication.phone}
                  </div>
                  <div className="mt-2">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        selectedApplication.status
                      )}`}
                    >
                      {selectedApplication.status}
                    </span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Briefcase className="h-4 w-4 text-gray-500" />
                      <div>
                        <div className="text-xs text-gray-500">Position</div>
                        <div className="text-sm font-medium">
                          {selectedApplication.jobTitle}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <div>
                        <div className="text-xs text-gray-500">Applied On</div>
                        <div className="text-sm font-medium">
                          {selectedApplication.appliedAt}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <div>
                        <div className="text-xs text-gray-500">HR Assigned</div>
                        <div className="text-sm font-medium">
                          {selectedApplication.hrAssigned}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <div>
                        <div className="text-xs text-gray-500">Stage</div>
                        <div className="text-sm font-medium">
                          {selectedApplication.stage}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2">Rating</h4>
                  <div className="text-xl text-yellow-500">
                    {getRatingStars(selectedApplication.rating)}
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2">Resume</h4>
                  <a
                    href={selectedApplication.resumeUrl}
                    className="flex items-center space-x-2 text-blue-600 hover:underline"
                  >
                    <Download className="h-4 w-4" />
                    <span>Download Resume</span>
                  </a>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2">Notes</h4>
                  <p className="text-sm text-gray-600">
                    {selectedApplication.notes}
                  </p>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2">Actions</h4>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        handleUpdateStatus(
                          selectedApplication._id,
                          "Shortlisted"
                        );
                      }}
                      className="bg-green-600 text-white px-3 py-1 rounded text-sm"
                    >
                      Shortlist
                    </button>
                    <button
                      onClick={() => {
                        handleUpdateStatus(selectedApplication._id, "Rejected");
                      }}
                      className="bg-red-600 text-white px-3 py-1 rounded text-sm"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => {
                        handleUpdateStatus(
                          selectedApplication._id,
                          "Offer Extended"
                        );
                      }}
                      className="bg-purple-600 text-white px-3 py-1 rounded text-sm"
                    >
                      Extend Offer
                    </button>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2">Add Comment</h4>
                  <textarea
                    className="w-full border rounded p-2 text-sm"
                    rows={3}
                    placeholder="Add a comment or note..."
                  ></textarea>
                  <button className="mt-2 bg-blue-600 text-white px-4 py-2 rounded text-sm">
                    Save Comment
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
