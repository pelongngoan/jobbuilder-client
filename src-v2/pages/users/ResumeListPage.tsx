import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  Container,
  Grid,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Fade,
  CircularProgress,
  Snackbar,
  Alert,
  Chip,
} from "@mui/material";
import {
  Add as AddIcon,
  Upload as UploadIcon,
  Refresh as RefreshIcon,
  FilterList as FilterIcon,
} from "@mui/icons-material";
import { useResume } from "../../hooks/useResume";
import { useNavigate } from "react-router-dom";
import { ResumeCard } from "./ResumeCard";
import { useTranslation } from "react-i18next";

export const ResumeListPage = () => {
  const { t } = useTranslation();
  const { resumes, fetchResumes, uploadResumeFile, deleteResume } = useResume();
  const navigate = useNavigate();

  const [confirmDelete, setConfirmDelete] = useState<{
    id: string;
    title: string;
  } | null>(null);

  const [titleDialog, setTitleDialog] = useState({
    open: false,
    title: "",
    file: null as File | null,
  });

  const [loading, setLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [filter, setFilter] = useState<"all" | "uploaded" | "generated">("all");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "info",
  });

  useEffect(() => {
    setLoading(true);
    fetchResumes().finally(() => setLoading(false));
  }, [fetchResumes]);

  const handleCreateNew = () => {
    navigate("/user/resumes/create");
  };

  const handleUpload = () => {
    document.getElementById("resume-upload")?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];

      // Validate for PDF files only
      if (file.type !== "application/pdf") {
        setSnackbar({
          open: true,
          message: t("resumeList.onlyPdfAllowed"),
          severity: "error",
        });
        return;
      }

      const fileName = file.name.split(".")[0]; // Remove extension for default title
      setTitleDialog({
        open: true,
        title: fileName,
        file: file,
      });
    }
    // Reset the input value so the same file can be selected again
    event.target.value = "";
  };

  const handleConfirmUpload = async () => {
    if (titleDialog.file && titleDialog.title.trim()) {
      setUploadLoading(true);
      try {
        await uploadResumeFile(titleDialog.file, titleDialog.title.trim());
        setSnackbar({
          open: true,
          message: t("resumeList.resumeUploadedSuccess"),
          severity: "success",
        });
        await fetchResumes(); // Refresh the list
      } catch (err) {
        console.error("Error uploading resume:", err);
        setSnackbar({
          open: true,
          message:
            err instanceof Error ? err.message : t("resumeList.uploadFailed"),
          severity: "error",
        });
      } finally {
        setUploadLoading(false);
      }
    }
    setTitleDialog({ open: false, title: "", file: null });
  };

  const handleDeleteConfirm = async () => {
    if (confirmDelete) {
      setLoading(true);
      try {
        await deleteResume(confirmDelete.id);
        setSnackbar({
          open: true,
          message: t("resumeList.resumeDeletedSuccess"),
          severity: "success",
        });
        await fetchResumes(); // Refresh the list
      } catch (err) {
        console.error("Error deleting resume:", err);
        setSnackbar({
          open: true,
          message:
            err instanceof Error ? err.message : t("resumeList.deleteFailed"),
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    }
    setConfirmDelete(null);
  };

  const handleRefresh = async () => {
    setLoading(true);
    try {
      await fetchResumes();
      setSnackbar({
        open: true,
        message: t("resumeList.resumesRefreshed"),
        severity: "info",
      });
    } finally {
      setLoading(false);
    }
  };

  // Filter resumes based on type
  const filteredResumes = resumes.filter((resume) => {
    if (filter === "all") return true;
    return resume.type === filter;
  });

  const getFilterCounts = () => {
    return {
      all: resumes.length,
      uploaded: resumes.filter((r) => r.type === "uploaded").length,
      generated: resumes.filter((r) => r.type === "generated").length,
    };
  };

  const counts = getFilterCounts();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header Section */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            {t("resumeList.title")}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t("resumeList.subtitle")}
          </Typography>
        </Box>

        <Box display="flex" gap={1}>
          <input
            id="resume-upload"
            type="file"
            accept="application/pdf"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />

          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            disabled={loading}
            size="small"
          >
            {t("resumeList.refresh")}
          </Button>

          <Button
            variant="outlined"
            startIcon={<UploadIcon />}
            onClick={handleUpload}
            disabled={uploadLoading}
          >
            {t("resumeList.uploadPdfResume")}
          </Button>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateNew}
          >
            {t("resumeList.createNew")}
          </Button>
        </Box>
      </Box>

      {/* Filter Section */}
      {resumes.length > 0 && (
        <Box mb={3}>
          <Box display="flex" alignItems="center" gap={2} mb={2}>
            <FilterIcon color="action" />
            <Typography variant="subtitle1">
              {t("resumeList.filterByType")}
            </Typography>
          </Box>
          <Box display="flex" gap={1}>
            <Chip
              label={`${t("resumeList.all")} (${counts.all})`}
              variant={filter === "all" ? "filled" : "outlined"}
              color={filter === "all" ? "primary" : "default"}
              onClick={() => setFilter("all")}
              clickable
            />
            <Chip
              label={`${t("resumeList.generated")} (${counts.generated})`}
              variant={filter === "generated" ? "filled" : "outlined"}
              color={filter === "generated" ? "primary" : "default"}
              onClick={() => setFilter("generated")}
              clickable
            />
            <Chip
              label={`${t("resumeList.uploaded")} (${counts.uploaded})`}
              variant={filter === "uploaded" ? "filled" : "outlined"}
              color={filter === "uploaded" ? "secondary" : "default"}
              onClick={() => setFilter("uploaded")}
              clickable
            />
          </Box>
        </Box>
      )}

      {/* Loading State */}
      {loading && (
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress />
        </Box>
      )}

      {/* Empty State */}
      {!loading && resumes.length === 0 && (
        <Fade in={true}>
          <Card
            sx={{
              p: 6,
              textAlign: "center",
              background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
            }}
          >
            <Typography variant="h5" gutterBottom color="primary">
              {t("resumeList.welcomeTitle")}
            </Typography>
            <Typography color="text.secondary" mb={4} variant="body1">
              {t("resumeList.welcomeDescription")}
            </Typography>
            <Box display="flex" justifyContent="center" gap={2}>
              <Button
                variant="outlined"
                startIcon={<UploadIcon />}
                onClick={handleUpload}
                size="large"
              >
                {t("resumeList.uploadPdfResume")}
              </Button>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleCreateNew}
                size="large"
              >
                {t("resumeList.createNewResume")}
              </Button>
            </Box>
          </Card>
        </Fade>
      )}

      {/* Resume Grid */}
      {!loading && filteredResumes.length > 0 && (
        <Fade in={true}>
          <Grid container spacing={3}>
            {filteredResumes.map((resume, index) => (
              <Grid key={index} size={{ xs: 12, sm: 6, md: 4 }}>
                <ResumeCard
                  resume={resume}
                  onDelete={(id, title) => setConfirmDelete({ id, title })}
                />
              </Grid>
            ))}
          </Grid>
        </Fade>
      )}

      {/* No Results for Filter */}
      {!loading && resumes.length > 0 && filteredResumes.length === 0 && (
        <Card sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h6" gutterBottom>
            {t("resumeList.noResumesFound", { type: filter })}
          </Typography>
          <Typography color="text.secondary" mb={3}>
            {t("resumeList.tryChangingFilter")}
          </Typography>
          <Button variant="outlined" onClick={() => setFilter("all")}>
            {t("resumeList.showAllResumes")}
          </Button>
        </Card>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{t("resumeList.deleteResume")}</DialogTitle>
        <DialogContent>
          <Typography>
            {t("resumeList.deleteConfirmation", {
              title: confirmDelete?.title,
            })}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDelete(null)}>
            {t("common.cancel")}
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={loading}
          >
            {loading ? <CircularProgress size={20} /> : t("common.delete")}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Title Dialog for Upload */}
      <Dialog
        open={titleDialog.open}
        onClose={() =>
          !uploadLoading && setTitleDialog({ ...titleDialog, open: false })
        }
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{t("resumeList.resumeTitle")}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label={t("resumeList.enterResumeTitle")}
            fullWidth
            value={titleDialog.title}
            onChange={(e) =>
              setTitleDialog({ ...titleDialog, title: e.target.value })
            }
            disabled={uploadLoading}
            helperText={`${t("resumeList.file")}: ${
              titleDialog.file?.name || ""
            }`}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setTitleDialog({ ...titleDialog, open: false })}
            disabled={uploadLoading}
          >
            {t("common.cancel")}
          </Button>
          <Button
            onClick={handleConfirmUpload}
            color="primary"
            variant="contained"
            disabled={!titleDialog.title.trim() || uploadLoading}
          >
            {uploadLoading ? (
              <CircularProgress size={20} />
            ) : (
              t("common.upload")
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};
