import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  IconButton,
  Typography,
  Chip,
  Avatar,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  FileDownload as FileDownloadIcon,
  Description as DescriptionIcon,
  PictureAsPdf as PdfIcon,
} from "@mui/icons-material";
import { Resume } from "../../types";
import { useTranslation } from "react-i18next";

// Common card dimensions
const CARD_HEIGHT = 400;
const PREVIEW_HEIGHT = 200;

// Get backend URL from environment or use default
const BACKEND_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

interface ResumeCardProps {
  resume: Resume;
  onDelete?: (id: string, title: string) => void;
}

export const ResumeCard = ({ resume, onDelete }: ResumeCardProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    // If it's an uploaded file and a PDF, create a preview URL
    if (resume.type === "uploaded" && resume.fileUrl) {
      // Create absolute URL to the backend server
      setPreviewUrl(`${BACKEND_URL}/uploads/resumes/${resume.fileUrl}`);
    }
  }, [resume]);

  const handleEdit = (id: string) => {
    navigate(`/user/resumes/edit/${id}`);
  };

  const handleDownload = async () => {
    if (resume.type === "uploaded" && resume.fileUrl) {
      window.open(`${BACKEND_URL}/uploads/resumes/${resume.fileUrl}`, "_blank");
    }
  };

  const renderCardContent = () => {
    if (resume.type === "uploaded") {
      return (
        <>
          {/* PDF Preview Container - Fixed Height */}
          <Box
            sx={{
              height: PREVIEW_HEIGHT,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "grey.50",
              borderRadius: 1,
              mb: 2,
              border: "1px solid",
              borderColor: "grey.200",
              overflow: "hidden", // Ensure content doesn't overflow
            }}
          >
            {previewUrl ? (
              <Paper
                elevation={0}
                sx={{
                  width: "100%",
                  height: "100%",
                  overflow: "hidden",
                }}
              >
                <object
                  data={previewUrl}
                  type="application/pdf"
                  width="100%"
                  height="100%"
                  style={{ pointerEvents: "none" }} // Prevent interaction with the PDF
                >
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    height="100%"
                  >
                    <Avatar
                      sx={{
                        width: 64,
                        height: 64,
                        bgcolor: "primary.light",
                        mb: 1,
                      }}
                    >
                      <PdfIcon fontSize="large" />
                    </Avatar>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      align="center"
                    >
                      {t("resumeCard.pdfPreviewUnavailable")}
                    </Typography>
                  </Box>
                </object>
              </Paper>
            ) : (
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                height="100%"
                color="text.secondary"
              >
                <Avatar
                  sx={{
                    width: 64,
                    height: 64,
                    bgcolor: "primary.light",
                    mb: 1,
                  }}
                >
                  <PdfIcon fontSize="large" />
                </Avatar>
                <Typography variant="body2" align="center">
                  {resume.title || t("resumeCard.pdfResume")}
                </Typography>
              </Box>
            )}
          </Box>

          {/* File Type Chip */}
          <Box display="flex" justifyContent="center" mb={2}>
            <Chip
              label={t("resumeCard.pdfResume")}
              color="secondary"
              variant="outlined"
              size="small"
              icon={<PdfIcon />}
            />
          </Box>
        </>
      );
    } else {
      return (
        <>
          {/* Generated Resume Preview - Same Fixed Height */}
          <Box
            sx={{
              height: PREVIEW_HEIGHT,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 1,
              mb: 2,
              backgroundImage:
                "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            }}
          >
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              textAlign="center"
              color="white"
            >
              <Avatar
                sx={{
                  width: 64,
                  height: 64,
                  bgcolor: "rgba(255,255,255,0.2)",
                  mb: 1,
                }}
              >
                <DescriptionIcon sx={{ fontSize: 32 }} />
              </Avatar>
              <Typography variant="h6" color="inherit">
                {t("resumeCard.resumeBuilder")}
              </Typography>
              <Typography variant="caption" color="inherit">
                {t("resumeCard.generatedTemplate")}
              </Typography>
            </Box>
          </Box>

          {/* Generated Type Chip */}
          <Box display="flex" justifyContent="center" mb={2}>
            <Chip
              label={t("resumeCard.builderGenerated")}
              color="primary"
              variant="filled"
              size="small"
              icon={<DescriptionIcon />}
            />
          </Box>
        </>
      );
    }
  };

  return (
    <Card
      sx={{
        p: 3,
        height: CARD_HEIGHT,
        display: "flex",
        flexDirection: "column",
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 4,
        },
        border: resume.isDefault ? "2px solid" : "1px solid",
        borderColor: resume.isDefault ? "primary.main" : "grey.200",
      }}
    >
      {/* Header with Title and Default Star */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="flex-start"
        mb={2}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            flexGrow: 1,
            mr: 1,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
          title={resume.title}
        >
          {resume.title}
        </Typography>
        <IconButton
          size="small"
          color={resume.isDefault ? "primary" : "default"}
          title={
            resume.isDefault
              ? t("resumeCard.defaultResume")
              : t("resumeCard.setAsDefault")
          }
          sx={{
            animation: resume.isDefault ? "pulse 2s infinite" : "none",
            "@keyframes pulse": {
              "0%": { transform: "scale(1)" },
              "50%": { transform: "scale(1.1)" },
              "100%": { transform: "scale(1)" },
            },
          }}
        >
          {resume.isDefault ? <StarIcon /> : <StarBorderIcon />}
        </IconButton>
      </Box>

      {/* Dynamic Content Based on Type */}
      {renderCardContent()}

      {/* Created Date */}
      <Typography
        color="text.secondary"
        variant="body2"
        mb={2}
        textAlign="center"
      >
        {t("resumeCard.created")}:{" "}
        {new Date(resume.createdAt as string).toLocaleDateString()}
      </Typography>

      {/* Action Buttons */}
      <Box
        display="flex"
        justifyContent="space-between"
        mt="auto"
        pt={1}
        borderTop="1px solid"
        borderColor="grey.100"
      >
        <Box display="flex" gap={0.5}>
          <IconButton
            size="small"
            color="primary"
            onClick={() => handleEdit(resume._id.toString())}
            title={t("resumeCard.editResume")}
            sx={{
              "&:hover": {
                backgroundColor: "primary.light",
                color: "primary.contrastText",
              },
            }}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            size="small"
            color="error"
            title={t("resumeCard.deleteResume")}
            onClick={() => onDelete?.(resume._id.toString(), resume.title)}
            sx={{
              "&:hover": {
                backgroundColor: "error.light",
                color: "error.contrastText",
              },
            }}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
        <IconButton
          size="small"
          color="primary"
          title={t("resumeCard.downloadAsPdf")}
          onClick={handleDownload}
          disabled={resume.type !== "uploaded"}
          sx={{
            "&:hover": {
              backgroundColor: "success.light",
              color: "success.contrastText",
            },
          }}
        >
          <FileDownloadIcon />
        </IconButton>
      </Box>
    </Card>
  );
};
