import React, { useEffect, useState } from "react";
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
} from "@mui/icons-material";
import { useApplication } from "../../hooks/useApplication";
import { Application, ApplicationStatus } from "../../types/application.types";
import { JobPost } from "../../types/job.types";
import { Resume } from "../../types/resume.types";
import { CompanyProfile } from "../../types/company.types";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

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
  const job = application.jobId as JobPost;
  const resume = application.resumeId as Resume;
  const company = job?.companyId as CompanyProfile;

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
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: 3,
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
          />
          <Box>
            <IconButton
              onClick={() => onView(application)}
              color="primary"
              size="small"
              title={t("applications.viewDetails")}
            >
              <ViewIcon />
            </IconButton>
            <IconButton
              onClick={() => onDelete(application._id)}
              color="error"
              size="small"
              title={t("applications.deleteApplication")}
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
    const job = application.jobId as JobPost;
    if (job?._id) {
      navigate(`/user/jobs/${job._id}`);
    }
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
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          component="h1"
          fontWeight={700}
          color="primary.main"
          sx={{ mb: 1 }}
        >
          {t("applications.applicationList")}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {t("applications.manageApplications")}
        </Typography>
      </Box>

      {/* Applications List */}
      {applications && applications.length > 0 ? (
        <>
          <Typography variant="h6" sx={{ mb: 3 }}>
            {t("applications.totalApplications", {
              count: applications.length,
            })}
          </Typography>
          <Grid container spacing={3}>
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
        </>
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
