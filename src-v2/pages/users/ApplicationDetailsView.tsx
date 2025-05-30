import React, { useEffect, useState } from "react";
import { Typography, Chip, Card, CardContent, Avatar } from "@mui/material";
import {
  Person as PersonIcon,
  Work as WorkIcon,
  Description as ResumeIcon,
  CalendarToday as DateIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Business as BusinessIcon,
  AttachMoney as SalaryIcon,
  Assignment as AssignmentIcon,
} from "@mui/icons-material";
import { Button, Select } from "../../components/common";
import { Application, ApplicationStatus } from "../../types/application.types";
import { JobPost } from "../../types/job.types";
import { Resume } from "../../types/resume.types";
import { CompanyProfile } from "../../types/company.types";
import { UserProfile, Profile } from "../../types";
import { useStaff } from "../../hooks/useStaff";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import useChat from "../../hooks/useChat";
// const BACKEND_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
// const USER_URL = import.meta.env.VITE_USER_URL || "http://localhost:5173";

const BACKEND_URL =
  import.meta.env.VITE_API_URL || "https://jobbuilder-server.onrender.com";
const USER_URL = import.meta.env.VITE_USER_URL || "http://localhost:5173";

// Status options for the select dropdown
const statusOptions = [
  { value: ApplicationStatus.PENDING, label: "Pending" },
  { value: ApplicationStatus.REVIEWED, label: "Reviewed" },
  { value: ApplicationStatus.SHORTLISTED, label: "Shortlisted" },
  { value: ApplicationStatus.INTERVIEW, label: "Interview" },
  { value: ApplicationStatus.ACCEPTED, label: "Accepted" },
  { value: ApplicationStatus.REJECTED, label: "Rejected" },
];

interface ApplicationDetailsViewProps {
  application: Application;
  onStatusUpdate?: (
    applicationId: string,
    status: ApplicationStatus,
    interviewerId?: string
  ) => void;
  showStatusUpdate?: boolean;
}

export const ApplicationDetailsView: React.FC<ApplicationDetailsViewProps> = ({
  application,
  onStatusUpdate,
  showStatusUpdate = false,
}) => {
  const [newStatus, setNewStatus] = useState<ApplicationStatus>(
    application.status
  );
  const [selectedInterviewer, setSelectedInterviewer] = useState<string>(
    (application.interviewerId as string) || ""
  );
  const { getStaffs, staffs } = useStaff();
  const { role } = useAuth();

  useEffect(() => {
    if (newStatus === ApplicationStatus.SHORTLISTED && role === "company") {
      getStaffs(1, 100);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newStatus]);

  const job = application.jobId as JobPost;
  const resume = application.resumeId as Resume;
  const userProfile = application.userId as unknown as UserProfile;
  const profile = userProfile?.profile as any; // eslint-disable-line @typescript-eslint/no-explicit-any
  const interviewer = application.interviewerId as any; // eslint-disable-line @typescript-eslint/no-explicit-any

  const handleStatusUpdate = () => {
    if (newStatus !== application.status && onStatusUpdate) {
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

  const formatSalary = () => {
    if (!job?.salaryFrom && !job?.salaryTo) return "Negotiable";

    const currency = job.salaryCurrency || "VND";
    const from = job.salaryFrom
      ? new Intl.NumberFormat("vi-VN").format(job.salaryFrom)
      : "";
    const to = job.salaryTo
      ? new Intl.NumberFormat("vi-VN").format(job.salaryTo)
      : "";

    if (from && to) return `${from} - ${to} ${currency}`;
    if (from) return `From ${from} ${currency}`;
    if (to) return `Up to ${to} ${currency}`;
    return "Negotiable";
  };
  const navigate = useNavigate();
  const { getChatByReceiverId, getChatMessages, createChat } = useChat();
  const { useProfileId } = useAuth();

  const handleContactThroughChat = async (id: string) => {
    const existingChat = await getChatByReceiverId(id);
    if (existingChat?.success && existingChat.data !== null) {
      await getChatMessages((existingChat.data as any)._id); // eslint-disable-line @typescript-eslint/no-explicit-any
    } else {
      await createChat(useProfileId as string, id);
    }
    navigate(`/user/chat`);
  };

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-white min-h-full">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header with Status */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <Typography variant="h4" className="font-bold text-gray-900 mb-2">
                Application Details
              </Typography>
              <Typography variant="body1" className="text-gray-600">
                Comprehensive overview of application status and information
              </Typography>
            </div>
            <div className="text-right">
              <div className="mb-2">
                <Chip
                  label={application.status}
                  color={
                    application.status === ApplicationStatus.ACCEPTED
                      ? "success"
                      : application.status === ApplicationStatus.REJECTED
                      ? "error"
                      : application.status === ApplicationStatus.INTERVIEW
                      ? "secondary"
                      : "primary"
                  }
                  className="text-sm font-semibold px-4 py-2"
                />
              </div>
              <Typography
                variant="caption"
                className="text-gray-500 flex items-center"
              >
                <DateIcon className="w-4 h-4 mr-1" />
                Applied: {formatDate(application.appliedAt)}
              </Typography>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Candidate Information */}
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-0 rounded-xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4">
              <div className="flex items-center text-white">
                <Avatar className="bg-white bg-opacity-20 mr-3">
                  <PersonIcon className="text-white" />
                </Avatar>
                <Typography variant="h6" className="font-semibold">
                  Candidate Information
                </Typography>
              </div>
            </div>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <PersonIcon className="text-blue-500 w-5 h-5" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Full Name
                    </p>
                    <p className="text-gray-900 font-semibold">
                      {profile?.firstName && profile?.lastName
                        ? `${profile.firstName} ${profile.lastName}`
                        : "N/A"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <EmailIcon className="text-blue-500 w-5 h-5" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Email</p>
                    <p className="text-gray-900">{profile?.email || "N/A"}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <PhoneIcon className="text-blue-500 w-5 h-5" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Phone</p>
                    <p className="text-gray-900">{profile?.phone || "N/A"}</p>
                  </div>
                </div>

                {interviewer && (
                  <div className="flex items-center space-x-3 bg-yellow-50 p-3 rounded-lg">
                    <AssignmentIcon className="text-yellow-600 w-5 h-5" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Assigned Interviewer
                      </p>
                      <p className="text-gray-900 font-semibold">
                        {interviewer?.profile?.firstName &&
                        interviewer?.profile?.lastName
                          ? `${interviewer.profile.firstName} ${interviewer.profile.lastName}`
                          : interviewer?.email || "N/A"}
                        {interviewer?.profile?.email && (
                          <p
                            className="text-gray-500 text-xs cursor-pointer hover:text-yellow-700 transition-colors duration-200"
                            onClick={() => {
                              handleContactThroughChat(
                                interviewer?._id as string
                              );
                            }}
                          >
                            {interviewer?.profile?.email}
                          </p>
                        )}
                      </p>
                    </div>
                    {/* <EmailIcon
                      className="text-yellow-600 w-5 h-5 cursor-pointer hover:text-yellow-700 transition-colors duration-200"
                      titleAccess="Contact through chat"
                      onClick={() => {
                        handleContactThroughChat(interviewer?._id as string);
                      }}
                    /> */}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Job Information */}
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-0 rounded-xl overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-green-600 p-4">
              <div className="flex items-center text-white">
                <Avatar className="bg-white bg-opacity-20 mr-3">
                  <WorkIcon className="text-white" />
                </Avatar>
                <Typography variant="h6" className="font-semibold">
                  Job Information
                </Typography>
              </div>
            </div>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <WorkIcon className="text-green-500 w-5 h-5" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Position
                    </p>
                    <p className="text-gray-900 font-semibold">
                      {job?.title || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <BusinessIcon className="text-green-500 w-5 h-5" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Company</p>
                    <p className="text-gray-900">
                      {(application?.companyId as CompanyProfile)
                        ?.companyName || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <LocationIcon className="text-green-500 w-5 h-5" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Location
                    </p>
                    <p className="text-gray-900">{job?.location || "N/A"}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <SalaryIcon className="text-green-500 w-5 h-5" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Salary</p>
                    <p className="text-gray-900 font-semibold">
                      {formatSalary()}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Resume Information */}
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-0 rounded-xl overflow-hidden">
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-4">
            <div className="flex items-center text-white">
              <Avatar className="bg-white bg-opacity-20 mr-3">
                <ResumeIcon className="text-white" />
              </Avatar>
              <Typography variant="h6" className="font-semibold">
                Resume Information
              </Typography>
            </div>
          </div>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="flex-1 space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Title
                  </p>
                  <p className="text-gray-900 font-semibold text-lg mb-3">
                    {resume?.title || "N/A"}
                  </p>
                  <Chip
                    label={
                      resume?.type === "uploaded" ? "PDF Upload" : "Generated"
                    }
                    size="small"
                    className={`${
                      resume?.type === "uploaded"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-purple-100 text-purple-800"
                    } font-medium`}
                  />
                </div>
              </div>
              {resume?.fileUrl && (
                <div className="ml-6">
                  <Button
                    onClick={() => {
                      if (resume.type === "generated") {
                        window.open(
                          `${USER_URL}/user/resumes/view/${resume._id}`,
                          "_blank"
                        );
                      }
                      if (resume.type === "uploaded" && resume.fileUrl) {
                        window.open(
                          `${BACKEND_URL}/uploads/resumes/${resume.fileUrl}`,
                          "_blank"
                        );
                      }
                    }}
                    size="sm"
                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  >
                    <ResumeIcon className="w-4 h-4 mr-2" />
                    View Resume
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Status Update Section (if allowed) */}
        {showStatusUpdate && onStatusUpdate && (
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-0 rounded-xl overflow-hidden">
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4">
              <div className="flex items-center text-white">
                <Avatar className="bg-white bg-opacity-20 mr-3">
                  <AssignmentIcon className="text-white" />
                </Avatar>
                <Typography variant="h6" className="font-semibold">
                  Update Application Status
                </Typography>
              </div>
            </div>
            <CardContent className="p-6">
              <div className="max-w-md mx-auto space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
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
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Assign Interviewer
                    </label>
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

                <Button
                  onClick={handleStatusUpdate}
                  disabled={
                    newStatus === application.status ||
                    (newStatus === ApplicationStatus.SHORTLISTED &&
                      !selectedInterviewer)
                  }
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white py-3 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:transform-none font-semibold"
                >
                  Update Status
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
