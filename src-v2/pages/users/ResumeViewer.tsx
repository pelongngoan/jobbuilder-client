import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Paper,
  Typography,
  Divider,
  Chip,
  IconButton,
  CircularProgress,
} from "@mui/material";
import {
  ArrowBack,
  Edit as EditIcon,
  Print as PrintIcon,
} from "@mui/icons-material";
import { useResume } from "../../hooks/useResume";
import { useTranslation } from "react-i18next";

export const ResumeViewer = () => {
  const { t } = useTranslation();
  const { resumeId } = useParams<{ resumeId: string }>();
  const navigate = useNavigate();
  const { currentResume, getResumeById } = useResume();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (resumeId) {
      setLoading(true);
      getResumeById(resumeId).finally(() => setLoading(false));
    }
  }, [resumeId, getResumeById]);

  const handleBack = () => {
    navigate("/user/resumes");
  };

  const handleEdit = () => {
    navigate(`/user/resumes/edit/${resumeId}`);
  };

  const handlePrint = () => {
    window.print();
  };

  const formatDate = (date: string | Date | undefined) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString();
  };

  const formatDateRange = (
    startDate: string | Date | undefined,
    endDate: string | Date | undefined
  ) => {
    const start = formatDate(startDate);
    const end = endDate ? formatDate(endDate) : t("resumeViewer.present");
    return start && end ? `${start} - ${end}` : start || end;
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4, textAlign: "center" }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>
          {t("resumeViewer.loading")}
        </Typography>
      </Container>
    );
  }

  if (!currentResume) {
    return (
      <Container maxWidth="md" sx={{ py: 4, textAlign: "center" }}>
        <Typography variant="h6" color="error">
          {t("resumeViewer.notFound")}
        </Typography>
        <Button onClick={handleBack} sx={{ mt: 2 }}>
          {t("common.goBack")}
        </Button>
      </Container>
    );
  }

  const resume = currentResume;
  const content = resume.content;

  return (
    <Box>
      {/* Action Bar - No Print */}
      <Box
        sx={{
          backgroundColor: "background.paper",
          borderBottom: 1,
          borderColor: "divider",
          py: 2,
          px: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          "@media print": {
            display: "none",
          },
        }}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <IconButton onClick={handleBack}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h6">{resume.title}</Typography>
          <Chip
            label={t("resumeCard.builderGenerated")}
            color="primary"
            size="small"
          />
        </Box>
        <Box display="flex" gap={1}>
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={handleEdit}
          >
            {t("common.edit")}
          </Button>
          <Button
            variant="contained"
            startIcon={<PrintIcon />}
            onClick={handlePrint}
          >
            {t("common.print")}
          </Button>
        </Box>
      </Box>

      {/* Resume Content */}
      <Container
        maxWidth="md"
        sx={{
          py: 4,
          "@media print": {
            maxWidth: "none",
            padding: 0,
            margin: 0,
          },
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 6,
            minHeight: "297mm", // A4 height
            backgroundColor: "white",
            "@media print": {
              boxShadow: "none",
              minHeight: "auto",
              padding: "20mm",
            },
          }}
        >
          {/* Header - Personal Information */}
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Typography
              variant="h3"
              component="h1"
              sx={{
                fontWeight: "bold",
                color: "primary.main",
                mb: 1,
                fontSize: { xs: "2rem", md: "3rem" },
              }}
            >
              {content?.personalInfo?.fullName}
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: 2,
                color: "text.secondary",
                fontSize: "1.1rem",
              }}
            >
              {content?.personalInfo?.email && (
                <Typography variant="body1">
                  {content.personalInfo.email}
                </Typography>
              )}
              {content?.personalInfo?.phone && (
                <Typography variant="body1">
                  {content.personalInfo.phone}
                </Typography>
              )}
              {content?.personalInfo?.address && (
                <Typography variant="body1">
                  {content.personalInfo.address}
                </Typography>
              )}
            </Box>
          </Box>

          <Divider sx={{ mb: 4 }} />

          {/* Professional Summary */}
          {content?.summary && (
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h5"
                component="h2"
                sx={{
                  fontWeight: "bold",
                  color: "primary.main",
                  mb: 2,
                  borderBottom: 2,
                  borderColor: "primary.main",
                  pb: 1,
                }}
              >
                {t("resumeViewer.professionalSummary")}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  lineHeight: 1.8,
                  textAlign: "justify",
                  fontSize: "1.1rem",
                }}
              >
                {content.summary}
              </Typography>
            </Box>
          )}

          {/* Work Experience */}
          {content?.workExperience && content.workExperience.length > 0 && (
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h5"
                component="h2"
                sx={{
                  fontWeight: "bold",
                  color: "primary.main",
                  mb: 3,
                  borderBottom: 2,
                  borderColor: "primary.main",
                  pb: 1,
                }}
              >
                {t("resumeViewer.workExperience")}
              </Typography>
              {content.workExperience.map((job, index) => (
                <Box key={index} sx={{ mb: 3 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      mb: 1,
                      flexWrap: "wrap",
                    }}
                  >
                    <Box>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: "bold", fontSize: "1.2rem" }}
                      >
                        {job.position}
                      </Typography>
                      <Typography
                        variant="subtitle1"
                        sx={{ color: "primary.main", fontWeight: "medium" }}
                      >
                        {job.company}
                        {job.location && ` • ${job.location}`}
                      </Typography>
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "text.secondary",
                        fontStyle: "italic",
                        mt: { xs: 1, md: 0 },
                      }}
                    >
                      {formatDateRange(job.startDate, job.endDate)}
                    </Typography>
                  </Box>
                  {job.description && (
                    <Typography
                      variant="body1"
                      sx={{ mb: 2, lineHeight: 1.7, textAlign: "justify" }}
                    >
                      {job.description}
                    </Typography>
                  )}
                  {job.highlights &&
                    job.highlights.length > 0 &&
                    job.highlights[0] && (
                      <Box component="ul" sx={{ m: 0, pl: 3 }}>
                        {job.highlights
                          .filter((highlight) => highlight.trim())
                          .map((highlight, hIndex) => (
                            <Typography
                              key={hIndex}
                              component="li"
                              variant="body1"
                              sx={{ mb: 0.5, lineHeight: 1.6 }}
                            >
                              {highlight}
                            </Typography>
                          ))}
                      </Box>
                    )}
                </Box>
              ))}
            </Box>
          )}

          {/* Education */}
          {content?.education && content.education.length > 0 && (
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h5"
                component="h2"
                sx={{
                  fontWeight: "bold",
                  color: "primary.main",
                  mb: 3,
                  borderBottom: 2,
                  borderColor: "primary.main",
                  pb: 1,
                }}
              >
                {t("resumeViewer.education")}
              </Typography>
              {content.education.map((edu, index) => (
                <Box key={index} sx={{ mb: 3 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      mb: 1,
                      flexWrap: "wrap",
                    }}
                  >
                    <Box>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: "bold", fontSize: "1.2rem" }}
                      >
                        {edu.degree} {edu.field && `in ${edu.field}`}
                      </Typography>
                      <Typography
                        variant="subtitle1"
                        sx={{ color: "primary.main", fontWeight: "medium" }}
                      >
                        {edu.institution}
                        {edu.location && ` • ${edu.location}`}
                      </Typography>
                      {edu.gpa && (
                        <Typography variant="body2" color="text.secondary">
                          GPA: {edu.gpa}
                        </Typography>
                      )}
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "text.secondary",
                        fontStyle: "italic",
                        mt: { xs: 1, md: 0 },
                      }}
                    >
                      {formatDateRange(edu.startDate, edu.endDate)}
                    </Typography>
                  </Box>
                  {edu.highlights &&
                    edu.highlights.length > 0 &&
                    edu.highlights[0] && (
                      <Box component="ul" sx={{ m: 0, pl: 3 }}>
                        {edu.highlights
                          .filter((highlight) => highlight.trim())
                          .map((highlight, hIndex) => (
                            <Typography
                              key={hIndex}
                              component="li"
                              variant="body1"
                              sx={{ mb: 0.5, lineHeight: 1.6 }}
                            >
                              {highlight}
                            </Typography>
                          ))}
                      </Box>
                    )}
                </Box>
              ))}
            </Box>
          )}

          {/* Skills */}
          {content?.skills && content.skills.length > 0 && (
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h5"
                component="h2"
                sx={{
                  fontWeight: "bold",
                  color: "primary.main",
                  mb: 3,
                  borderBottom: 2,
                  borderColor: "primary.main",
                  pb: 1,
                }}
              >
                {t("resumeViewer.skills")}
              </Typography>
              {content.skills.map((skillGroup, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: "bold", mb: 1, fontSize: "1.1rem" }}
                  >
                    {skillGroup.category}:
                  </Typography>
                  <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                    {skillGroup.items
                      ?.filter((item) => item.trim())
                      .join(" • ")}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}

          {/* Projects */}
          {content?.projects &&
            content.projects.length > 0 &&
            content.projects[0].name && (
              <Box sx={{ mb: 4 }}>
                <Typography
                  variant="h5"
                  component="h2"
                  sx={{
                    fontWeight: "bold",
                    color: "primary.main",
                    mb: 3,
                    borderBottom: 2,
                    borderColor: "primary.main",
                    pb: 1,
                  }}
                >
                  {t("resumeViewer.projects")}
                </Typography>
                {content.projects
                  .filter((project) => project.name?.trim())
                  .map((project, index) => (
                    <Box key={index} sx={{ mb: 3 }}>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: "bold", mb: 1, fontSize: "1.2rem" }}
                      >
                        {project.name}
                      </Typography>
                      {project.description && (
                        <Typography
                          variant="body1"
                          sx={{ mb: 1, lineHeight: 1.7, textAlign: "justify" }}
                        >
                          {project.description}
                        </Typography>
                      )}
                      {project.technologies &&
                        project.technologies.length > 0 &&
                        project.technologies[0] && (
                          <Typography
                            variant="body2"
                            sx={{ mb: 1, fontStyle: "italic" }}
                          >
                            <strong>{t("resumeViewer.technologies")}:</strong>{" "}
                            {project.technologies
                              .filter((tech) => tech.trim())
                              .join(", ")}
                          </Typography>
                        )}
                      {project.highlights &&
                        project.highlights.length > 0 &&
                        project.highlights[0] && (
                          <Box component="ul" sx={{ m: 0, pl: 3 }}>
                            {project.highlights
                              .filter((highlight) => highlight.trim())
                              .map((highlight, hIndex) => (
                                <Typography
                                  key={hIndex}
                                  component="li"
                                  variant="body1"
                                  sx={{ mb: 0.5, lineHeight: 1.6 }}
                                >
                                  {highlight}
                                </Typography>
                              ))}
                          </Box>
                        )}
                    </Box>
                  ))}
              </Box>
            )}

          {/* Languages */}
          {content?.languages &&
            content.languages.length > 0 &&
            content.languages[0].language && (
              <Box sx={{ mb: 4 }}>
                <Typography
                  variant="h5"
                  component="h2"
                  sx={{
                    fontWeight: "bold",
                    color: "primary.main",
                    mb: 3,
                    borderBottom: 2,
                    borderColor: "primary.main",
                    pb: 1,
                  }}
                >
                  {t("resumeViewer.languages")}
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                  {content.languages
                    .filter((lang) => lang.language?.trim())
                    .map((lang, index) => (
                      <Typography key={index} variant="body1" sx={{ mr: 3 }}>
                        <strong>{lang.language}</strong>
                        {lang.proficiency && ` - ${lang.proficiency}`}
                      </Typography>
                    ))}
                </Box>
              </Box>
            )}

          {/* Certifications */}
          {content?.certifications &&
            content.certifications.length > 0 &&
            content.certifications[0].name && (
              <Box sx={{ mb: 4 }}>
                <Typography
                  variant="h5"
                  component="h2"
                  sx={{
                    fontWeight: "bold",
                    color: "primary.main",
                    mb: 3,
                    borderBottom: 2,
                    borderColor: "primary.main",
                    pb: 1,
                  }}
                >
                  {t("resumeViewer.certifications")}
                </Typography>
                {content.certifications
                  .filter((cert) => cert.name?.trim())
                  .map((cert, index) => (
                    <Box key={index} sx={{ mb: 2 }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          flexWrap: "wrap",
                        }}
                      >
                        <Box>
                          <Typography
                            variant="h6"
                            sx={{ fontWeight: "bold", fontSize: "1.1rem" }}
                          >
                            {cert.name}
                          </Typography>
                          {cert.issuer && (
                            <Typography
                              variant="subtitle1"
                              color="primary.main"
                            >
                              {cert.issuer}
                            </Typography>
                          )}
                        </Box>
                        {cert.date && (
                          <Typography
                            variant="body2"
                            sx={{
                              color: "text.secondary",
                              fontStyle: "italic",
                              mt: { xs: 1, md: 0 },
                            }}
                          >
                            {formatDate(cert.date)}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  ))}
              </Box>
            )}
        </Paper>
      </Container>
    </Box>
  );
};
