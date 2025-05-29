import React, { useCallback, useEffect, useState } from "react";
import {
  DataTable,
  Button,
  Input,
  Select,
  Badge,
} from "../../components/common";
import { useApplication } from "../../hooks/useApplication";
import { useAuth } from "../../hooks/useAuth";
import { Application, ApplicationStatus } from "../../types/application.types";
import { JobPost } from "../../types/job.types";
import { Resume } from "../../types/resume.types";
import { CompanyProfile } from "../../types/company.types";
import { useAppSelector } from "../../redux/store";
import { useDispatch } from "react-redux";
import { setPage } from "../../redux/slices/paginationSlice";
import { Pagination } from "@mui/material";
import {
  Typography,
  Chip,
  Card,
  CardContent,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  Person as PersonIcon,
  Work as WorkIcon,
  Description as ResumeIcon,
} from "@mui/icons-material";
import { useStaff } from "../../hooks/useStaff";
import { UserProfile } from "../../types";

// Status options for the select dropdown
const statusOptions = [
  { value: ApplicationStatus.PENDING, label: "Pending" },
  { value: ApplicationStatus.REVIEWED, label: "Reviewed" },
  { value: ApplicationStatus.SHORTLISTED, label: "Shortlisted" },
  { value: ApplicationStatus.INTERVIEW, label: "Interview" },
  { value: ApplicationStatus.ACCEPTED, label: "Accepted" },
  { value: ApplicationStatus.REJECTED, label: "Rejected" },
];

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

// Application Details Component
const ApplicationDetailsView = ({
  application,
  onStatusUpdate,
}: {
  application: Application;
  onStatusUpdate: (
    applicationId: string,
    status: ApplicationStatus,
    interviewerId?: string
  ) => void;
}) => {
  const [newStatus, setNewStatus] = useState<ApplicationStatus>(
    application.status
  );
  const [selectedInterviewer, setSelectedInterviewer] = useState<string>(
    (application.interviewerId as string) || ""
  );
  const { getStaffs, staffs } = useStaff();

  useEffect(() => {
    if (newStatus === ApplicationStatus.SHORTLISTED) {
      getStaffs(1, 100);
    }
  }, [newStatus]);

  const job = application.jobId as JobPost;
  const resume = application.resumeId as Resume;
  const company = job?.companyId as CompanyProfile;
  const userProfile = application.userId as UserProfile;
  const profile = userProfile?.profile as any; // eslint-disable-line @typescript-eslint/no-explicit-any

  const handleStatusUpdate = () => {
    if (newStatus !== application.status) {
      onStatusUpdate(
        application._id,
        newStatus,
        newStatus === ApplicationStatus.SHORTLISTED
          ? selectedInterviewer
          : undefined
      );
    }
  };

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Candidate Information */}
        <div className="col-span-1">
          <Card className="h-full">
            <CardContent className="p-4">
              <div className="flex items-center mb-4">
                <PersonIcon className="mr-2 text-blue-600" />
                <Typography
                  variant="h6"
                  className="font-semibold text-gray-800"
                >
                  Candidate Information
                </Typography>
              </div>
              <Divider className="mb-4" />

              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Name:
                  </p>
                  <p className="text-gray-900">
                    {profile?.firstName && profile?.lastName
                      ? `${profile.firstName} ${profile.lastName}`
                      : "N/A"}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Email:
                  </p>
                  <p className="text-gray-900">{profile?.email || "N/A"}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Phone:
                  </p>
                  <p className="text-gray-900">{profile?.phone || "N/A"}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Applied Date:
                  </p>
                  <p className="text-gray-900">
                    {formatDate(application.appliedAt)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Job Information */}
        <div className="col-span-1">
          <Card className="h-full">
            <CardContent className="p-4">
              <div className="flex items-center mb-4">
                <WorkIcon className="mr-2 text-green-600" />
                <Typography
                  variant="h6"
                  className="font-semibold text-gray-800"
                >
                  Job Information
                </Typography>
              </div>
              <Divider className="mb-4" />

              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Position:
                  </p>
                  <p className="text-gray-900">{job?.title || "N/A"}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Company:
                  </p>
                  <p className="text-gray-900">
                    {company?.companyName || "N/A"}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Location:
                  </p>
                  <p className="text-gray-900">{job?.location || "N/A"}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Salary:
                  </p>
                  <p className="text-gray-900">
                    {job?.salaryFrom && job?.salaryTo
                      ? `${job.salaryFrom.toLocaleString()} - ${job.salaryTo.toLocaleString()} ${
                          job.salaryCurrency || "VND"
                        }`
                      : "Negotiable"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Resume Information */}
        <div className="col-span-1 md:col-span-2">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center mb-4">
                <ResumeIcon className="mr-2 text-purple-600" />
                <Typography
                  variant="h6"
                  className="font-semibold text-gray-800"
                >
                  Resume Information
                </Typography>
              </div>
              <Divider className="mb-4" />

              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="mb-2">
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      Title:
                    </p>
                    <p className="text-gray-900 mb-2">
                      {resume?.title || "N/A"}
                    </p>
                    <Chip
                      label={
                        resume?.type === "uploaded" ? "PDF Upload" : "Generated"
                      }
                      size="small"
                      className="bg-blue-100 text-blue-800"
                    />
                  </div>
                </div>
                {resume?.fileUrl && (
                  <div className="ml-4">
                    <Button
                      onClick={() =>
                        window.open(
                          `${import.meta.env.VITE_API_URL}/uploads/resumes/${
                            resume.fileUrl
                          }`,
                          "_blank"
                        )
                      }
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
                    >
                      View Resume
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Status Update */}
        <div className="col-span-1 md:col-span-2">
          <Card>
            <CardContent className="p-4">
              <Typography
                variant="h6"
                className="font-semibold text-gray-800 mb-4"
              >
                Update Status
              </Typography>
              <Divider className="mb-4" />

              <div className="flex flex-col gap-4 w-full max-w-md mx-auto">
                <div className="w-full">
                  <Select
                    value={newStatus}
                    onChange={(e) =>
                      setNewStatus(e.target.value as ApplicationStatus)
                    }
                    options={statusOptions}
                    className="w-full"
                  />
                </div>

                {newStatus === ApplicationStatus.SHORTLISTED && (
                  <div className="w-full">
                    <Select
                      value={selectedInterviewer}
                      onChange={(e) => setSelectedInterviewer(e.target.value)}
                      options={staffs
                        .filter(
                          (staff) =>
                            staff.role === "interviewer" && staff.active
                        )
                        .map((staff) => ({
                          value: staff._id,
                          label: `${
                            (staff.profile as Profile)?.firstName || ""
                          } ${(staff.profile as Profile)?.lastName || ""}`,
                        }))}
                      className="w-full"
                      placeholder="Select interviewer"
                    />
                  </div>
                )}

                <div className="w-full">
                  <Button
                    onClick={handleStatusUpdate}
                    disabled={
                      newStatus === application.status ||
                      (newStatus === ApplicationStatus.SHORTLISTED &&
                        !selectedInterviewer)
                    }
                    className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-2 px-4 rounded-md transition-colors"
                  >
                    Update Status
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
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

  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedApplication, setSelectedApplication] =
    useState<Application | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Table columns configuration
  const columns = [
    {
      id: "candidate",
      header: "Candidate",
      accessor: "userId",
      render: (userProfile: any, row: any) => {
        const profile = userProfile?.profile as any; // eslint-disable-line @typescript-eslint/no-explicit-any
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
      render: (job: any) => (
        <div className="min-w-0">
          <div className="font-medium text-gray-900 truncate">
            {job?.title || "N/A"}
          </div>
          <div className="text-sm text-gray-500 truncate">
            {job?.location || "N/A"}
          </div>
        </div>
      ),
    },
    {
      id: "resume",
      header: "Resume",
      accessor: "resumeId",
      render: (resume: any) => (
        <div className="flex items-center gap-2">
          <ResumeIcon className="w-4 h-4 text-gray-500 flex-shrink-0" />
          <span className="text-sm text-gray-900 truncate">
            {resume?.title || "N/A"}
          </span>
          <Badge
            variant={resume?.type === "uploaded" ? "primary" : "secondary"}
            className="ml-1 flex-shrink-0"
          >
            {resume?.type === "uploaded" ? "PDF" : "Generated"}
          </Badge>
        </div>
      ),
    },
    {
      id: "status",
      header: "Status",
      accessor: "status",
      render: (status: ApplicationStatus) => (
        <Badge
          variant={getStatusColor(status)}
          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
        >
          {status}
        </Badge>
      ),
    },
    {
      id: "appliedAt",
      header: "Applied Date",
      accessor: "appliedAt",
      render: (date: Date | string) => {
        if (!date) return <span className="text-gray-500">N/A</span>;
        return (
          <span className="text-sm text-gray-900">
            {new Date(date).toLocaleDateString("vi-VN")}
          </span>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      accessor: "_id",
      render: (_: any, row: any) => (
        <div className="flex gap-2">
          <Button
            onClick={() => handleViewApplication(row as Application)}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm transition-colors"
          >
            View
          </Button>
        </div>
      ),
    },
  ];

  // Fetch applications based on user role
  const fetchApplications = useCallback(async () => {
    if (!useProfileId) return;

    setIsLoading(true);
    try {
      if (role === "company") {
        await getCompanyApplications(useProfileId, page, limit, searchQuery);
      } else if (role === "staff") {
        await getStaffApplications(useProfileId, page, limit, searchQuery);
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

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Manage Applications
          </h1>
          <p className="text-gray-600">Review and manage job applications</p>
        </div>
      </div>

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
        <DataTable
          columns={columns}
          data={applications as unknown as Record<string, unknown>[]}
          keyExtractor={(item) => (item as Application)._id}
          onRowClick={(item) => handleViewApplication(item as Application)}
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
