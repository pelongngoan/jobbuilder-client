import React, { useEffect, useState } from "react";
import { Card, Button } from "../../components/common";
import useApiCall from "../../hooks/useApiCall";
import applicationService from "../../services/applicationService";
import { Application } from "../../types";

const ApplicationsPage: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const getApplicationsApi = useApiCall("getApplications");

  useEffect(() => {
    const fetchApplications = async () => {
      await getApplicationsApi.execute(async () => {
        const response = await applicationService.getMyApplications();
        if (response.success && response.data) {
          setApplications(response.data.items || []);
        }
        return response;
      });
    };

    fetchApplications();
  }, [getApplicationsApi]);

  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "reviewing":
        return "bg-blue-100 text-blue-800";
      case "interview":
        return "bg-purple-100 text-purple-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "accepted":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (getApplicationsApi.error) {
    return (
      <div className="p-4">
        <p className="text-red-500">
          Error loading applications: {getApplicationsApi.error}
        </p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">My Job Applications</h1>

      {getApplicationsApi.loading ? (
        <p className="text-gray-500">Loading applications...</p>
      ) : applications.length === 0 ? (
        <Card className="p-6 text-center">
          <p className="text-gray-500 mb-4">
            You haven't applied to any jobs yet.
          </p>
          <Button
            variant="primary"
            onClick={() => (window.location.href = "/jobs")}
          >
            Browse Jobs
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {applications.map((application) => (
            <Card key={application._id} className="p-4">
              <div className="flex flex-col md:flex-row justify-between">
                <div className="mb-4 md:mb-0">
                  <h2 className="text-xl font-semibold">
                    {application.job?.title || "Job Title Unavailable"}
                  </h2>
                  <p className="text-gray-700">
                    {application.job?.company?.name || "Company Unavailable"}
                  </p>
                  <p className="text-gray-500 text-sm mt-1">
                    Applied on: {formatDate(application.appliedAt)}
                  </p>
                  <div className="mt-2">
                    <span
                      className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(
                        application.status
                      )}`}
                    >
                      {application.status}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      (window.location.href = `/jobs/${application.job?._id}`)
                    }
                  >
                    View Job
                  </Button>
                  {application.status === "interview" && (
                    <Button variant="primary" size="sm">
                      View Interview Details
                    </Button>
                  )}
                </div>
              </div>
              {application.feedback && (
                <div className="mt-4 p-3 bg-gray-50 rounded-md">
                  <h3 className="font-semibold mb-1">Feedback:</h3>
                  <p className="text-gray-700">{application.feedback}</p>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApplicationsPage;
