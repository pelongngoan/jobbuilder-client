import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Chip,
  IconButton,
  Button,
  Avatar,
  Paper,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Work as WorkIcon,
  Description as ResumeIcon,
  CalendarToday as DateIcon,
  LocationOn as LocationIcon,
  Business as BusinessIcon,
  Assignment as AssignmentIcon,
} from "@mui/icons-material";
import { useApplication } from "../../hooks/useApplication";
import { Application, ApplicationStatus } from "../../types/application.types";
import { JobPost } from "../../types/job.types";
import { Resume } from "../../types/resume.types";
import { CompanyProfile } from "../../types/company.types";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ApplicationDetailsView } from "./ApplicationDetailsView";
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
      return "error";
    default:
      return "default";
  }
};

// Status text mapping with translation
const getStatusText = (
  status: ApplicationStatus,
  t: (key: string) => string
) => {
  switch (status) {
    case ApplicationStatus.PENDING:
      return t("applications.status.pending");
    case ApplicationStatus.REVIEWED:
      return t("applications.status.reviewed");
    case ApplicationStatus.SHORTLISTED:
      return t("applications.status.shortlisted");
    case ApplicationStatus.INTERVIEW:
      return t("applications.status.interview");
    case ApplicationStatus.ACCEPTED:
      return t("applications.status.accepted");
    case ApplicationStatus.REJECTED:
      return t("applications.status.rejected");
    default:
      return status;
  }
};

// Application Card Component
const ApplicationCard = ({
  application,
  onDelete,
  onView,
}: {
  application: Application;
  onDelete: (id: string) => void;
  onView: (application: Application) => void;
}) => {
  const { t } = useTranslation();
  console.log(application);

  const job = application.jobId as JobPost;
  const resume = application.resumeId as Resume;
  const company = application.companyId as CompanyProfile;
  const interviewer = application.interviewerId as any; // eslint-disable-line @typescript-eslint/no-explicit-any

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatSalary = () => {
    if (!job?.salaryFrom && !job?.salaryTo) return t("jobCard.negotiable");

    const currency = job.salaryCurrency || "VND";
    const from = job.salaryFrom
      ? new Intl.NumberFormat("vi-VN").format(job.salaryFrom)
      : "";
    const to = job.salaryTo
      ? new Intl.NumberFormat("vi-VN").format(job.salaryTo)
      : "";

    if (from && to) return `${from} - ${to} ${currency}`;
    if (from) return `${t("jobCard.from")} ${from} ${currency}`;
    if (to) return `${t("jobCard.upTo")} ${to} ${currency}`;
    return t("jobCard.negotiable");
  };

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "all 0.3s ease",
        borderRadius: 3,
        border: "1px solid rgba(0, 0, 0, 0.08)",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 12px 24px rgba(0, 0, 0, 0.15)",
          borderColor: "primary.light",
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        {/* Status Badge */}
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Chip
            label={getStatusText(application.status, t)}
            color={getStatusColor(application.status)}
            size="small"
            variant="filled"
            sx={{
              fontWeight: 600,
              fontSize: "0.75rem",
              height: 28,
              "& .MuiChip-label": {
                px: 1.5,
              },
            }}
          />
          <Box>
            <IconButton
              onClick={() => onView(application)}
              color="primary"
              size="small"
              title={t("applications.viewDetails")}
              sx={{
                "&:hover": {
                  backgroundColor: "primary.light",
                  color: "white",
                },
              }}
            >
              <ViewIcon />
            </IconButton>
            <IconButton
              onClick={() => onDelete(application._id)}
              color="error"
              size="small"
              title={t("applications.deleteApplication")}
              sx={{
                "&:hover": {
                  backgroundColor: "error.light",
                  color: "white",
                },
              }}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>

        {/* Job Information */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <Avatar
              sx={{
                width: 40,
                height: 40,
                mr: 2,
                bgcolor: "primary.light",
              }}
            >
              <WorkIcon />
            </Avatar>
            <Box sx={{ flexGrow: 1 }}>
              <Typography
                variant="h6"
                component="h3"
                sx={{
                  fontWeight: 600,
                  mb: 0.5,
                  lineHeight: 1.2,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                }}
              >
                {job?.title || t("applications.jobUndefined")}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
                <BusinessIcon
                  sx={{ fontSize: 16, mr: 0.5, color: "text.secondary" }}
                />
                <Typography variant="body2" color="text.secondary">
                  {company?.companyName || t("applications.companyUndefined")}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
                <LocationIcon
                  sx={{ fontSize: 16, mr: 0.5, color: "text.secondary" }}
                />
                <Typography variant="body2" color="text.secondary">
                  {job?.location || t("applications.locationUndefined")}
                </Typography>
              </Box>
              <Typography variant="body2" color="success.main" fontWeight={500}>
                {formatSalary()}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Interview Information */}
        {interviewer && (
          <Paper
            sx={{
              p: 2,
              bgcolor: "rgba(255, 152, 0, 0.08)",
              borderRadius: 2,
              mb: 2,
              border: "1px solid rgba(255, 152, 0, 0.2)",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  mr: 1.5,
                  bgcolor: "warning.main",
                  color: "white",
                }}
              >
                <AssignmentIcon sx={{ fontSize: 18 }} />
              </Avatar>
              <Box sx={{ flexGrow: 1 }}>
                <Typography
                  variant="subtitle2"
                  fontWeight={600}
                  color="warning.dark"
                >
                  {t("applications.assignedInterviewer")}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.primary"
                  sx={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    fontWeight: 500,
                  }}
                >
                  {interviewer?.profile?.firstName &&
                  interviewer?.profile?.lastName
                    ? `${interviewer.profile.firstName} ${interviewer.profile.lastName}`
                    : interviewer?.email ||
                      t("applications.interviewerUndefined")}
                </Typography>
                {application.status === ApplicationStatus.SHORTLISTED && (
                  <Chip
                    label="Shortlisted"
                    size="small"
                    sx={{
                      mt: 0.5,
                      bgcolor: "warning.light",
                      color: "warning.dark",
                      fontSize: "0.7rem",
                      height: 18,
                      "& .MuiChip-label": {
                        px: 1,
                      },
                    }}
                  />
                )}
              </Box>
            </Box>
          </Paper>
        )}

        {/* Resume Information */}
        <Paper
          sx={{
            p: 2,
            bgcolor: "grey.50",
            borderRadius: 2,
            mb: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Avatar
              sx={{
                width: 32,
                height: 32,
                mr: 1.5,
                bgcolor: "secondary.light",
              }}
            >
              <ResumeIcon sx={{ fontSize: 18 }} />
            </Avatar>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="subtitle2" fontWeight={500}>
                {t("applications.resumeUsed")}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {resume?.title || t("applications.resumeUndefined")}
              </Typography>
              <Chip
                label={
                  resume?.type === "uploaded"
                    ? t("applications.resumeType.uploaded")
                    : t("applications.resumeType.generated")
                }
                size="small"
                variant="outlined"
                sx={{ mt: 0.5, fontSize: "0.7rem", height: 20 }}
              />
            </Box>
          </Box>
        </Paper>

        {/* Application Date */}
        <Box sx={{ display: "flex", alignItems: "center", mt: "auto" }}>
          <DateIcon sx={{ fontSize: 16, mr: 0.5, color: "text.secondary" }} />
          <Typography variant="caption" color="text.secondary">
            {t("applications.appliedOn", {
              date: formatDate(application.appliedAt),
            })}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export const ApplicationListPage = () => {
  const { t } = useTranslation();
  const { applications, getUserApplications, deleteApplication } =
    useApplication();
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [applicationToDelete, setApplicationToDelete] = useState<string | null>(
    null
  );
  const [selectedApplication, setSelectedApplication] =
    useState<Application | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        await getUserApplications();
      } catch (error) {
        console.error("Error fetching applications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDeleteClick = (applicationId: string) => {
    setApplicationToDelete(applicationId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (applicationToDelete) {
      try {
        await deleteApplication(applicationToDelete);
        await getUserApplications(); // Refresh the list
      } catch (error) {
        console.error("Error deleting application:", error);
      }
    }
    setDeleteDialogOpen(false);
    setApplicationToDelete(null);
  };

  const handleView = (application: Application) => {
    setSelectedApplication(application);
    setDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setDetailModalOpen(false);
    setSelectedApplication(null);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4, textAlign: "center" }}>
        <Typography
          variant="h3"
          component="h1"
          fontWeight={700}
          sx={{
            mb: 1,
            background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {t("applications.applicationList")}
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
          {t("applications.manageApplications")}
        </Typography>
        {applications && applications.length > 0 && (
          <Chip
            label={t("applications.totalApplications", {
              count: applications.length,
            })}
            color="primary"
            variant="outlined"
            sx={{ fontSize: "0.875rem", fontWeight: 500 }}
          />
        )}
      </Box>

      {/* Applications List */}
      {applications && applications.length > 0 ? (
        <Grid
          container
          spacing={3}
          sx={{
            "& .MuiGrid-item": {
              animation: "fadeInUp 0.6s ease-out",
              animationFillMode: "both",
            },
            "& .MuiGrid-item:nth-of-type(1)": { animationDelay: "0.1s" },
            "& .MuiGrid-item:nth-of-type(2)": { animationDelay: "0.2s" },
            "& .MuiGrid-item:nth-of-type(3)": { animationDelay: "0.3s" },
            "& .MuiGrid-item:nth-of-type(4)": { animationDelay: "0.4s" },
            "& .MuiGrid-item:nth-of-type(5)": { animationDelay: "0.5s" },
            "& .MuiGrid-item:nth-of-type(6)": { animationDelay: "0.6s" },
            "@keyframes fadeInUp": {
              "0%": {
                opacity: 0,
                transform: "translateY(30px)",
              },
              "100%": {
                opacity: 1,
                transform: "translateY(0)",
              },
            },
          }}
        >
          {applications.map((application) => (
            <Grid key={application._id} size={{ xs: 12, md: 6, lg: 4 }}>
              <ApplicationCard
                application={application}
                onDelete={handleDeleteClick}
                onView={handleView}
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Alert severity="info" sx={{ mt: 4 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            {t("applications.noApplicationsTitle")}
          </Typography>
          <Typography variant="body2">
            {t("applications.noApplicationsDescription")}
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate("/user/jobs")}
            sx={{ mt: 2 }}
          >
            {t("applications.findJobs")}
          </Button>
        </Alert>
      )}

      {/* Application Details Modal */}
      {selectedApplication && (
        <Dialog
          open={detailModalOpen}
          onClose={handleCloseDetailModal}
          maxWidth="xl"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              maxHeight: "95vh",
              margin: 2,
              boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)",
            },
          }}
          sx={{
            "& .MuiBackdrop-root": {
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              backdropFilter: "blur(4px)",
            },
          }}
        >
          <DialogContent sx={{ p: 0, overflow: "auto" }}>
            <ApplicationDetailsView
              application={selectedApplication}
              showStatusUpdate={false}
            />
          </DialogContent>
          <DialogActions
            sx={{
              p: 3,
              borderTop: 1,
              borderColor: "divider",
              background: "linear-gradient(to right, #f8fafc, #f1f5f9)",
              gap: 2,
            }}
          >
            <Button
              onClick={handleCloseDetailModal}
              variant="outlined"
              color="inherit"
              sx={{
                borderRadius: 2,
                px: 4,
                py: 1.5,
                textTransform: "none",
                fontWeight: 500,
              }}
            >
              {t("common.close")}
            </Button>
            <Button
              onClick={() => {
                const job = selectedApplication.jobId as JobPost;
                if (job?._id) {
                  window.open(`/user/jobs/${job._id}`, "_blank");
                }
              }}
              variant="contained"
              color="primary"
              sx={{
                borderRadius: 2,
                px: 4,
                py: 1.5,
                textTransform: "none",
                fontWeight: 500,
                background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
                "&:hover": {
                  background:
                    "linear-gradient(45deg, #1976D2 30%, #1CABF3 90%)",
                },
              }}
            >
              View Job Post
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{t("applications.confirmDeleteTitle")}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t("applications.confirmDeleteMessage")}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="inherit">
            {t("common.cancel")}
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
          >
            {t("applications.delete")}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};
