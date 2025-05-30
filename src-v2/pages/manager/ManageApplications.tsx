import { useCallback, useEffect, useState } from "react";
import { DataTable, Button, Input, Badge } from "../../components/common";
import { useApplication } from "../../hooks/useApplication";
import { useAuth } from "../../hooks/useAuth";
import { Application, ApplicationStatus } from "../../types/application.types";
import { useAppSelector } from "../../redux/store";
import { useDispatch } from "react-redux";
import { setPage } from "../../redux/slices/paginationSlice";
import { Pagination } from "@mui/material";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  Person as PersonIcon,
  Description as ResumeIcon,
} from "@mui/icons-material";
import { ApplicationDetailsView } from "../users/ApplicationDetailsView";
import { useSocket } from "../../hooks/useSocket";
import { useNotifications } from "../../hooks/useNotifications";
// Define types for table data
interface TableApplication extends Application {
  [key: string]: unknown;
}

interface UserProfile {
  profile: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

interface JobData {
  title: string;
  location: string;
}

interface ResumeData {
  title: string;
  type: "uploaded" | "generated";
}

interface SocketEventData {
  applicationId: string;
  userId: string;
  companyId: string;
  jobId: string;
  status: string;
}

// Status color mapping
const getStatusColor = (status: ApplicationStatus) => {
  switch (status) {
    case ApplicationStatus.PENDING:
      return "warning";
    case ApplicationStatus.REVIEWED:
      return "info";
    case ApplicationStatus.SHORTLISTED:
      return "primary";
    case ApplicationStatus.INTERVIEW:
      return "secondary";
    case ApplicationStatus.ACCEPTED:
      return "success";
    case ApplicationStatus.REJECTED:
      return "danger";
    default:
      return "primary";
  }
};

export const ManageApplications = () => {
  const dispatch = useDispatch();
  const { role, useProfileId } = useAuth();
  const {
    applications,
    getCompanyApplications,
    getStaffApplications,
    updateApplicationStatus,
  } = useApplication();
  const { page, limit, totalPages } = useAppSelector(
    (state) => state.pagination
  );
  const { socket, isConnected } = useSocket();
  const { unreadCount } = useNotifications();

  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedApplication, setSelectedApplication] =
    useState<Application | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [realtimeStats, setRealtimeStats] = useState({
    newApplications: 0,
    statusUpdates: 0,
  });

  // Table columns configuration
  const columns = [
    {
      id: "candidate",
      header: "Candidate",
      accessor: "userId",
      render: (userProfile: unknown) => {
        const profile = (userProfile as UserProfile).profile;
        return (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <PersonIcon className="w-5 h-5 text-blue-600" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-medium text-gray-900 truncate">
                {profile?.firstName && profile?.lastName
                  ? `${profile.firstName} ${profile.lastName}`
                  : "N/A"}
              </div>
              <div className="text-sm text-gray-500 truncate">
                {profile?.email || "N/A"}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      id: "job",
      header: "Job Position",
      accessor: "jobId",
      render: (job: unknown) => {
        const jobPost = job as JobData;
        return (
          <div className="min-w-0">
            <div className="font-medium text-gray-900 truncate">
              {jobPost?.title || "N/A"}
            </div>
            <div className="text-sm text-gray-500 truncate">
              {jobPost?.location || "N/A"}
            </div>
          </div>
        );
      },
    },
    {
      id: "resume",
      header: "Resume",
      accessor: "resumeId",
      render: (resume: unknown) => {
        const resumeData = resume as ResumeData;
        return (
          <div className="flex items-center gap-2">
            <ResumeIcon className="w-4 h-4 text-gray-500 flex-shrink-0" />
            <span className="text-sm text-gray-900 truncate">
              {resumeData?.title || "N/A"}
            </span>
            <Badge
              variant={
                resumeData?.type === "uploaded" ? "primary" : "secondary"
              }
              className="ml-1 flex-shrink-0"
            >
              {resumeData?.type === "uploaded" ? "PDF" : "Generated"}
            </Badge>
          </div>
        );
      },
    },
    {
      id: "status",
      header: "Status",
      accessor: "status",
      render: (status: unknown) => {
        const statusData = status as ApplicationStatus;
        return (
          <Badge
            variant={getStatusColor(statusData)}
            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
          >
            {statusData}
          </Badge>
        );
      },
    },
    {
      id: "appliedAt",
      header: "Applied Date",
      accessor: "appliedAt",
      render: (date: unknown) => {
        if (!date) return <span className="text-gray-500">N/A</span>;
        const dateData = date as Date;
        return (
          <span className="text-sm text-gray-900">
            {dateData.toLocaleDateString("vi-VN")}
          </span>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      accessor: "_id",
      render: (_value: unknown, row: TableApplication) => {
        return (
          <div className="flex gap-2">
            <Button
              onClick={() => handleViewApplication(row)}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm transition-colors"
            >
              View
            </Button>
          </div>
        );
      },
    },
  ];

  // Socket.io event listeners for real-time updates
  useEffect(() => {
    if (!socket) return;

    const handleNewApplication = (data: SocketEventData) => {
      console.log("New application received:", data);
      setRealtimeStats((prev) => ({
        ...prev,
        newApplications: prev.newApplications + 1,
      }));
      // Refresh applications list
      fetchApplications();
    };

    const handleApplicationUpdate = (data: SocketEventData) => {
      console.log("Application updated:", data);
      setRealtimeStats((prev) => ({
        ...prev,
        statusUpdates: prev.statusUpdates + 1,
      }));
      // Refresh applications list
      fetchApplications();
    };

    socket.on("new_application", handleNewApplication);
    socket.on("application_update", handleApplicationUpdate);

    return () => {
      socket.off("new_application", handleNewApplication);
      socket.off("application_update", handleApplicationUpdate);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

  // Fetch applications based on user role
  const fetchApplications = useCallback(async () => {
    if (!useProfileId) return;

    setIsLoading(true);
    try {
      if (role === "company") {
        await getCompanyApplications(useProfileId, page, limit, searchQuery);
      } else if (role === "staff") {
        await getStaffApplications({
          staffId: useProfileId,
          page,
          limit,
        });
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role, useProfileId, page, limit, searchQuery]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  // Handle search
  const handleSearch = () => {
    fetchApplications();
  };

  // Handle viewing application details
  const handleViewApplication = (application: Application) => {
    setSelectedApplication(application);
    setIsDetailModalOpen(true);
  };

  // Handle status update from modal
  const handleStatusUpdate = async (
    applicationId: string,
    status: ApplicationStatus,
    interviewerId?: string
  ) => {
    try {
      await updateApplicationStatus(applicationId, status, interviewerId);
      await fetchApplications(); // Refresh the list
      setIsDetailModalOpen(false);
    } catch (error) {
      console.error("Error updating application status:", error);
    }
  };

  // Reset real-time stats when user views them
  const resetStats = () => {
    setRealtimeStats({
      newApplications: 0,
      statusUpdates: 0,
    });
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header with Real-time Status */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="flex items-center space-x-4">
            <h1 className="text-3xl font-bold text-gray-900">
              Manage Applications
            </h1>
            <div
              className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${
                isConnected
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  isConnected ? "bg-green-500" : "bg-red-500"
                }`}
              ></div>
              <span>{isConnected ? "Live" : "Disconnected"}</span>
            </div>
            {unreadCount > 0 && (
              <div className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-medium">
                {unreadCount} notifications
              </div>
            )}
          </div>
          <p className="text-gray-600">Review and manage job applications</p>
        </div>
      </div>

      {/* Real-time Stats */}
      {(realtimeStats.newApplications > 0 ||
        realtimeStats.statusUpdates > 0) && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center">
            <div className="flex space-x-6">
              {realtimeStats.newApplications > 0 && (
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {realtimeStats.newApplications}
                  </div>
                  <div className="text-sm text-blue-700">New Applications</div>
                </div>
              )}
              {realtimeStats.statusUpdates > 0 && (
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {realtimeStats.statusUpdates}
                  </div>
                  <div className="text-sm text-green-700">Status Updates</div>
                </div>
              )}
            </div>
            <Button
              onClick={resetStats}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Refresh
            </Button>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="flex gap-3">
          <Input
            placeholder="Search by candidate name, job title, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
          <Button
            onClick={handleSearch}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors"
          >
            Search
          </Button>
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <DataTable<TableApplication>
          columns={columns}
          data={applications as TableApplication[]}
          isLoading={isLoading}
          emptyMessage="No applications found"
          className="w-full"
        />
      </div>

      {/* Pagination */}
      <div className="mt-6 flex justify-center">
        <div className="bg-white px-4 py-2 rounded-lg shadow-sm">
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, value) => dispatch(setPage(value))}
            color="primary"
          />
        </div>
      </div>

      {/* Application Details Modal */}
      {selectedApplication && (
        <Dialog
          open={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          maxWidth="lg"
          fullWidth
          className="z-50"
        >
          <DialogTitle className="border-b border-gray-200 bg-gray-50">
            <span className="text-xl font-semibold text-gray-900">
              Application Details
            </span>
          </DialogTitle>
          <DialogContent className="p-0">
            <ApplicationDetailsView
              application={selectedApplication}
              onStatusUpdate={handleStatusUpdate}
              showStatusUpdate={true}
            />
          </DialogContent>
          <DialogActions className="border-t border-gray-200 bg-gray-50 px-6 py-4">
            <Button
              onClick={() => setIsDetailModalOpen(false)}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition-colors"
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
};
