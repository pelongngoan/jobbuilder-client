import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Divider,
  Paper,
  Typography,
  TextField,
  IconButton,
  Card,
  CardContent,
} from "@mui/material";
import { ArrowBack, Save, Delete, Add as AddIcon } from "@mui/icons-material";
import { useResume } from "../../hooks/useResume";
import { Resume } from "../../types";
import { useTranslation } from "react-i18next";
import { Theme } from "@mui/material/styles";
import { SxProps } from "@mui/system";

export const JobSearchPage = () => {
  const { t } = useTranslation();
  const { resumeId } = useParams<{ resumeId: string }>();
  const navigate = useNavigate();
  const { currentResume, getResumeById, createResume, updateResume } =
    useResume();

  const [resumeData, setResumeData] = useState<Partial<Resume>>({
    title: currentResume?.title || "",
    type: "generated",
    content: {
      personalInfo: {
        fullName: currentResume?.content?.personalInfo?.fullName || "",
        email: currentResume?.content?.personalInfo?.email || "",
        phone: currentResume?.content?.personalInfo?.phone || "",
        address: currentResume?.content?.personalInfo?.address || "",
        linkedin: currentResume?.content?.personalInfo?.linkedin || "",
        website: currentResume?.content?.personalInfo?.website || "",
      },
      summary: currentResume?.content?.summary || "",
      workExperience: [
        {
          company: currentResume?.content?.workExperience?.[0]?.company || "",
          position: currentResume?.content?.workExperience?.[0]?.position || "",
          location: currentResume?.content?.workExperience?.[0]?.location || "",
          startDate:
            currentResume?.content?.workExperience?.[0]?.startDate || "",
          endDate: currentResume?.content?.workExperience?.[0]?.endDate || "",
          description:
            currentResume?.content?.workExperience?.[0]?.description || "",
          highlights: currentResume?.content?.workExperience?.[0]
            ?.highlights || [""],
        },
      ],
      education: [
        {
          institution:
            currentResume?.content?.education?.[0]?.institution || "",
          degree: currentResume?.content?.education?.[0]?.degree || "",
          field: currentResume?.content?.education?.[0]?.field || "",
          location: currentResume?.content?.education?.[0]?.location || "",
          startDate: currentResume?.content?.education?.[0]?.startDate || "",
          endDate: currentResume?.content?.education?.[0]?.endDate || "",
          gpa: currentResume?.content?.education?.[0]?.gpa || "",
          highlights: currentResume?.content?.education?.[0]?.highlights || [
            "",
          ],
        },
      ],
      skills: [
        {
          category:
            currentResume?.content?.skills?.[0]?.category || "Technical Skills",
          items: currentResume?.content?.skills?.[0]?.items || [""],
        },
      ],
      languages: [
        {
          language: currentResume?.content?.languages?.[0]?.language || "",
          proficiency:
            currentResume?.content?.languages?.[0]?.proficiency || "",
        },
      ],
      projects: [
        {
          name: currentResume?.content?.projects?.[0]?.name || "",
          description: currentResume?.content?.projects?.[0]?.description || "",
          technologies: currentResume?.content?.projects?.[0]?.technologies || [
            "",
          ],
          highlights: currentResume?.content?.projects?.[0]?.highlights || [""],
        },
      ],
      certifications: [
        {
          name: currentResume?.content?.certifications?.[0]?.name || "",
          issuer: currentResume?.content?.certifications?.[0]?.issuer || "",
          date: currentResume?.content?.certifications?.[0]?.date || "",
        },
      ],
    },
  });

  useEffect(() => {
    if (resumeId) {
      getResumeById(resumeId);
    }
  }, [resumeId, getResumeById]);

  useEffect(() => {
    if (currentResume && resumeId) {
      setResumeData(currentResume);
    }
  }, [currentResume, resumeId]);

  const handleInputChange = (section: keyof ResumeContent, value: string) => {
    setResumeData((prev) => ({
      ...prev,
      content: {
        ...(prev.content || {}),
        [section]: value,
      },
    }));
  };

  type ResumeContent = NonNullable<Resume["content"]>;
  type ArraySection = Extract<
    keyof ResumeContent,
    | "workExperience"
    | "education"
    | "skills"
    | "certifications"
    | "languages"
    | "projects"
  >;
  type SectionItem<T extends ArraySection> = NonNullable<
    ResumeContent[T]
  >[number];

  type PersonalInfoField =
    | "fullName"
    | "email"
    | "phone"
    | "address"
    | "linkedin"
    | "website";

  const handlePersonalInfoChange = (
    field: PersonalInfoField,
    value: string
  ) => {
    setResumeData((prev) => {
      const content = prev.content || ({} as ResumeContent);
      return {
        ...prev,
        content: {
          ...content,
          personalInfo: {
            ...content.personalInfo,
            [field]: value,
          },
        },
      };
    });
  };

  const handleArrayChange = (
    section: ArraySection,
    index: number,
    field: string,
    value: string | string[]
  ) => {
    setResumeData((prev) => {
      const content = prev.content || ({} as ResumeContent);
      const sectionData = [...(content[section] || [])] as SectionItem<
        typeof section
      >[];
      sectionData[index] = {
        ...sectionData[index],
        [field]: value,
      };

      return {
        ...prev,
        content: {
          ...content,
          [section]: sectionData,
        },
      };
    });
  };

  const handleHighlightChange = (
    section: string,
    itemIndex: number,
    highlightIndex: number,
    value: string
  ) => {
    setResumeData((prev) => {
      const sectionData = [
        ...((prev.content?.[
          section as keyof Resume["content"]
        ] as unknown as any[]) || []),
      ];
      const highlights = [...(sectionData[itemIndex]?.highlights || [])];
      highlights[highlightIndex] = value;

      sectionData[itemIndex] = {
        ...sectionData[itemIndex],
        highlights,
      };

      return {
        ...prev,
        content: {
          ...prev.content,
          [section]: sectionData,
        },
      };
    });
  };

  const addItem = <T extends ArraySection>(
    section: T,
    template: SectionItem<T>
  ) => {
    setResumeData((prev) => {
      const content = prev.content || ({} as ResumeContent);
      const sectionData = [...(content[section] || [])] as SectionItem<T>[];
      sectionData.push(template);

      return {
        ...prev,
        content: {
          ...content,
          [section]: sectionData,
        },
      };
    });
  };

  const removeItem = (section: ArraySection, index: number) => {
    setResumeData((prev) => {
      const content = prev.content || ({} as ResumeContent);
      const sectionData = [...(content[section] || [])] as SectionItem<
        typeof section
      >[];
      if (sectionData.length > 1) {
        sectionData.splice(index, 1);
      }

      return {
        ...prev,
        content: {
          ...content,
          [section]: sectionData,
        },
      };
    });
  };

  const addHighlight = (section: ArraySection, itemIndex: number) => {
    setResumeData((prev) => {
      const content = prev.content || ({} as ResumeContent);
      const sectionData = [...(content[section] || [])] as SectionItem<
        typeof section
      >[];
      const item = sectionData[itemIndex] as { highlights?: string[] };
      const highlights = [...(item.highlights || []), ""];

      sectionData[itemIndex] = {
        ...sectionData[itemIndex],
        highlights,
      } as SectionItem<typeof section>;

      return {
        ...prev,
        content: {
          ...content,
          [section]: sectionData,
        },
      };
    });
  };

  const removeHighlight = (
    section: ArraySection,
    itemIndex: number,
    highlightIndex: number
  ) => {
    setResumeData((prev) => {
      const content = prev.content || ({} as ResumeContent);
      const sectionData = [...(content[section] || [])] as SectionItem<
        typeof section
      >[];
      const item = sectionData[itemIndex] as { highlights?: string[] };
      const highlights = [...(item.highlights || [])];

      if (highlights.length > 1) {
        highlights.splice(highlightIndex, 1);
      }

      sectionData[itemIndex] = {
        ...sectionData[itemIndex],
        highlights,
      } as SectionItem<typeof section>;

      return {
        ...prev,
        content: {
          ...content,
          [section]: sectionData,
        },
      };
    });
  };

  const handleSave = async () => {
    try {
      if (resumeId) {
        await updateResume({ ...resumeData, _id: resumeId } as Resume);
      } else {
        await createResume(resumeData as Resume);
      }
      navigate("/user/resumes");
    } catch (error) {
      console.error("Error saving resume:", error);
    }
  };

  const handleCancel = () => {
    navigate("/user/resumes");
  };

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return "";
    return new Date(date).toISOString().split("T")[0];
  };

  const renderPersonalInfo = () => (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
      <Box sx={{ flex: "1 1 calc(50% - 8px)", minWidth: "250px" }}>
        <TextField
          label={t("resumeBuilder.personalInfo.fullName")}
          value={resumeData.content?.personalInfo?.fullName || ""}
          onChange={(e) => handlePersonalInfoChange("fullName", e.target.value)}
          fullWidth
          required
          size="small"
        />
      </Box>
      <Box sx={{ flex: "1 1 calc(50% - 8px)", minWidth: "250px" }}>
        <TextField
          label={t("resumeBuilder.personalInfo.email")}
          type="email"
          value={resumeData.content?.personalInfo?.email || ""}
          onChange={(e) => handlePersonalInfoChange("email", e.target.value)}
          fullWidth
          required
          size="small"
        />
      </Box>
      <Box sx={{ flex: "1 1 calc(50% - 8px)", minWidth: "250px" }}>
        <TextField
          label={t("resumeBuilder.personalInfo.phone")}
          value={resumeData.content?.personalInfo?.phone || ""}
          onChange={(e) => handlePersonalInfoChange("phone", e.target.value)}
          fullWidth
          size="small"
        />
      </Box>
      <Box sx={{ flex: "1 1 calc(50% - 8px)", minWidth: "250px" }}>
        <TextField
          label={t("resumeBuilder.personalInfo.address")}
          value={resumeData.content?.personalInfo?.address || ""}
          onChange={(e) => handlePersonalInfoChange("address", e.target.value)}
          fullWidth
          size="small"
        />
      </Box>
      <Box sx={{ flex: "1 1 calc(50% - 8px)", minWidth: "250px" }}>
        <TextField
          label={t("resumeBuilder.personalInfo.linkedin")}
          value={resumeData.content?.personalInfo?.linkedin || ""}
          onChange={(e) => handlePersonalInfoChange("linkedin", e.target.value)}
          fullWidth
          size="small"
        />
      </Box>
      <Box sx={{ flex: "1 1 calc(50% - 8px)", minWidth: "250px" }}>
        <TextField
          label={t("resumeBuilder.personalInfo.website")}
          value={resumeData.content?.personalInfo?.website || ""}
          onChange={(e) => handlePersonalInfoChange("website", e.target.value)}
          fullWidth
          size="small"
        />
      </Box>
    </Box>
  );

  const renderSummary = () => (
    <TextField
      label={t("resumeBuilder.summary.label")}
      value={resumeData.content?.summary || ""}
      onChange={(e) => handleInputChange("summary", e.target.value)}
      fullWidth
      multiline
      rows={4}
      size="small"
    />
  );

  const renderWorkExperience = () => (
    <Box>
      {resumeData.content?.workExperience?.map((job, index) => (
        <Paper key={index} elevation={1} sx={{ p: 2, mb: 2 }}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
              {job.position || t("resumeBuilder.workExperience.position")}{" "}
              {index + 1}
            </Typography>
            <Box>
              <IconButton
                size="small"
                color="error"
                onClick={() => removeItem("workExperience", index)}
                disabled={resumeData.content?.workExperience?.length === 1}
              >
                <Delete />
              </IconButton>
            </Box>
          </Box>

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
            <Box sx={{ flex: "1 1 calc(50% - 8px)", minWidth: "250px" }}>
              <TextField
                label={t("resumeBuilder.workExperience.company")}
                value={job.company || ""}
                onChange={(e) =>
                  handleArrayChange(
                    "workExperience",
                    index,
                    "company",
                    e.target.value
                  )
                }
                fullWidth
                required
                size="small"
              />
            </Box>
            <Box sx={{ flex: "1 1 calc(50% - 8px)", minWidth: "250px" }}>
              <TextField
                label={t("resumeBuilder.workExperience.position")}
                value={job.position || ""}
                onChange={(e) =>
                  handleArrayChange(
                    "workExperience",
                    index,
                    "position",
                    e.target.value
                  )
                }
                fullWidth
                required
                size="small"
              />
            </Box>
            <Box sx={{ flex: "1 1 calc(50% - 8px)", minWidth: "250px" }}>
              <TextField
                label={t("resumeBuilder.workExperience.location")}
                value={job.location || ""}
                onChange={(e) =>
                  handleArrayChange(
                    "workExperience",
                    index,
                    "location",
                    e.target.value
                  )
                }
                fullWidth
                size="small"
              />
            </Box>
            <Box sx={{ flex: "1 1 calc(25% - 8px)", minWidth: "200px" }}>
              <TextField
                label={t("resumeBuilder.workExperience.startDate")}
                type="date"
                value={formatDate(job.startDate)}
                onChange={(e) =>
                  handleArrayChange(
                    "workExperience",
                    index,
                    "startDate",
                    e.target.value
                  )
                }
                fullWidth
                InputLabelProps={{ shrink: true }}
                size="small"
              />
            </Box>
            <Box sx={{ flex: "1 1 calc(25% - 8px)", minWidth: "200px" }}>
              <TextField
                label={t("resumeBuilder.workExperience.endDate")}
                type="date"
                value={formatDate(job.endDate)}
                onChange={(e) =>
                  handleArrayChange(
                    "workExperience",
                    index,
                    "endDate",
                    e.target.value
                  )
                }
                fullWidth
                InputLabelProps={{ shrink: true }}
                size="small"
              />
            </Box>
            <Box sx={{ flex: "1 1 100%" }}>
              <TextField
                label={t("resumeBuilder.workExperience.description")}
                value={job.description || ""}
                onChange={(e) =>
                  handleArrayChange(
                    "workExperience",
                    index,
                    "description",
                    e.target.value
                  )
                }
                fullWidth
                multiline
                rows={3}
                size="small"
              />
            </Box>
          </Box>
        </Paper>
      ))}

      <Button
        variant="outlined"
        startIcon={<AddIcon />}
        onClick={() =>
          addItem("workExperience", {
            company: "",
            position: "",
            location: "",
            startDate: "",
            endDate: "",
            description: "",
            highlights: [""],
          })
        }
        sx={{ mt: 2 }}
        size="small"
      >
        {t("resumeBuilder.workExperience.addPosition")}
      </Button>
    </Box>
  );

  const renderEducation = () => (
    <Box>
      {resumeData.content?.education?.map((edu, index) => (
        <Paper key={index} elevation={1} sx={{ p: 2, mb: 2 }}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
              {edu.degree || t("resumeBuilder.education.degree")} {index + 1}
            </Typography>
            <Box>
              <IconButton
                size="small"
                color="error"
                onClick={() => removeItem("education", index)}
                disabled={resumeData.content?.education?.length === 1}
              >
                <Delete />
              </IconButton>
            </Box>
          </Box>

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
            <Box sx={{ flex: "1 1 calc(50% - 8px)", minWidth: "250px" }}>
              <TextField
                label={t("resumeBuilder.education.institution")}
                value={edu.institution || ""}
                onChange={(e) =>
                  handleArrayChange(
                    "education",
                    index,
                    "institution",
                    e.target.value
                  )
                }
                fullWidth
                required
                size="small"
              />
            </Box>
            <Box sx={{ flex: "1 1 calc(50% - 8px)", minWidth: "250px" }}>
              <TextField
                label={t("resumeBuilder.education.degree")}
                value={edu.degree || ""}
                onChange={(e) =>
                  handleArrayChange(
                    "education",
                    index,
                    "degree",
                    e.target.value
                  )
                }
                fullWidth
                size="small"
              />
            </Box>
            <Box sx={{ flex: "1 1 calc(50% - 8px)", minWidth: "250px" }}>
              <TextField
                label={t("resumeBuilder.education.field")}
                value={edu.field || ""}
                onChange={(e) =>
                  handleArrayChange("education", index, "field", e.target.value)
                }
                fullWidth
                size="small"
              />
            </Box>
            <Box sx={{ flex: "1 1 calc(25% - 8px)", minWidth: "200px" }}>
              <TextField
                label={t("resumeBuilder.education.startDate")}
                type="date"
                value={formatDate(edu.startDate)}
                onChange={(e) =>
                  handleArrayChange(
                    "education",
                    index,
                    "startDate",
                    e.target.value
                  )
                }
                fullWidth
                InputLabelProps={{ shrink: true }}
                size="small"
              />
            </Box>
            <Box sx={{ flex: "1 1 calc(25% - 8px)", minWidth: "200px" }}>
              <TextField
                label={t("resumeBuilder.education.endDate")}
                type="date"
                value={formatDate(edu.endDate)}
                onChange={(e) =>
                  handleArrayChange(
                    "education",
                    index,
                    "endDate",
                    e.target.value
                  )
                }
                fullWidth
                InputLabelProps={{ shrink: true }}
                size="small"
              />
            </Box>
            <Box sx={{ flex: "1 1 calc(25% - 8px)", minWidth: "200px" }}>
              <TextField
                label={t("resumeBuilder.education.gpa")}
                value={edu.gpa || ""}
                onChange={(e) =>
                  handleArrayChange("education", index, "gpa", e.target.value)
                }
                fullWidth
                size="small"
              />
            </Box>
          </Box>
        </Paper>
      ))}

      <Button
        variant="outlined"
        startIcon={<AddIcon />}
        onClick={() =>
          addItem("education", {
            institution: "",
            degree: "",
            field: "",
            location: "",
            startDate: "",
            endDate: "",
            gpa: "",
            highlights: [""],
          })
        }
        sx={{ mt: 2 }}
        size="small"
      >
        {t("resumeBuilder.education.addEducation")}
      </Button>
    </Box>
  );

  const renderSkills = () => (
    <Box>
      {resumeData.content?.skills?.map((skillGroup, index) => (
        <Paper key={index} elevation={1} sx={{ p: 2, mb: 2 }}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
              {skillGroup.category || t("resumeBuilder.skills.category")}{" "}
              {index + 1}
            </Typography>
            <Box>
              <IconButton
                size="small"
                color="error"
                onClick={() => removeItem("skills", index)}
                disabled={resumeData.content?.skills?.length === 1}
              >
                <Delete />
              </IconButton>
            </Box>
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Box>
              <TextField
                label={t("resumeBuilder.skills.category")}
                value={skillGroup.category || ""}
                onChange={(e) =>
                  handleArrayChange("skills", index, "category", e.target.value)
                }
                fullWidth
                size="small"
              />
            </Box>
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                {t("resumeBuilder.skills.items")}
              </Typography>

              {skillGroup.items?.map((skill, sIndex) => (
                <Box key={sIndex} display="flex" alignItems="center" mb={1}>
                  <TextField
                    value={skill}
                    onChange={(e) => {
                      const items = [...skillGroup.items];
                      items[sIndex] = e.target.value;
                      handleArrayChange("skills", index, "items", items);
                    }}
                    fullWidth
                    placeholder={`${t("resumeBuilder.skills.skill")} ${
                      sIndex + 1
                    }`}
                    size="small"
                  />
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => {
                      const items = [...skillGroup.items];
                      if (items.length > 1) {
                        items.splice(sIndex, 1);
                        handleArrayChange("skills", index, "items", items);
                      }
                    }}
                    disabled={skillGroup.items?.length === 1}
                    sx={{ ml: 1 }}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </Box>
              ))}

              <Button
                startIcon={<AddIcon />}
                onClick={() => {
                  const items = [...skillGroup.items, ""];
                  handleArrayChange("skills", index, "items", items);
                }}
                size="small"
                sx={{ mt: 1 }}
              >
                {t("resumeBuilder.skills.addSkill")}
              </Button>
            </Box>
          </Box>
        </Paper>
      ))}

      <Button
        variant="outlined"
        startIcon={<AddIcon />}
        onClick={() =>
          addItem("skills", {
            category: "",
            items: [""],
          })
        }
        sx={{ mt: 2 }}
        size="small"
      >
        {t("resumeBuilder.skills.addCategory")}
      </Button>
    </Box>
  );

  const renderAdditionalSections = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        {t("resumeBuilder.languages.title")}
      </Typography>

      {resumeData.content?.languages?.map((lang, index) => (
        <Box key={index} display="flex" alignItems="center" mb={2}>
          <Box sx={{ flex: "1 1 calc(50% - 8px)", minWidth: "250px", mr: 2 }}>
            <TextField
              label={t("resumeBuilder.languages.language")}
              value={lang.language || ""}
              onChange={(e) =>
                handleArrayChange(
                  "languages",
                  index,
                  "language",
                  e.target.value
                )
              }
              fullWidth
              size="small"
            />
          </Box>
          <Box sx={{ flex: "1 1 calc(50% - 8px)", minWidth: "250px" }}>
            <TextField
              label={t("resumeBuilder.languages.proficiency")}
              value={lang.proficiency || ""}
              onChange={(e) =>
                handleArrayChange(
                  "languages",
                  index,
                  "proficiency",
                  e.target.value
                )
              }
              fullWidth
              size="small"
            />
          </Box>
          <IconButton
            size="small"
            color="error"
            onClick={() => removeItem("languages", index)}
            disabled={resumeData.content?.languages?.length === 1}
            sx={{ ml: 1 }}
          >
            <Delete />
          </IconButton>
        </Box>
      ))}

      <Button
        variant="outlined"
        startIcon={<AddIcon />}
        onClick={() =>
          addItem("languages", {
            language: "",
            proficiency: "",
          })
        }
        sx={{ mb: 4, mt: 1 }}
        size="small"
      >
        {t("resumeBuilder.languages.addLanguage")}
      </Button>

      <Divider sx={{ my: 3 }} />

      <Typography variant="h6" gutterBottom>
        {t("resumeBuilder.certifications.title")}
      </Typography>

      {resumeData.content?.certifications?.map((cert, index) => (
        <Paper key={index} elevation={1} sx={{ p: 2, mb: 2 }}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
              {cert.name || t("resumeBuilder.certifications.name")} {index + 1}
            </Typography>
            <Box>
              <IconButton
                size="small"
                color="error"
                onClick={() => removeItem("certifications", index)}
                disabled={resumeData.content?.certifications?.length === 1}
              >
                <Delete />
              </IconButton>
            </Box>
          </Box>

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
            <Box sx={{ flex: "1 1 calc(50% - 8px)", minWidth: "250px" }}>
              <TextField
                label={t("resumeBuilder.certifications.name")}
                value={cert.name || ""}
                onChange={(e) =>
                  handleArrayChange(
                    "certifications",
                    index,
                    "name",
                    e.target.value
                  )
                }
                fullWidth
                required
                size="small"
              />
            </Box>
            <Box sx={{ flex: "1 1 calc(50% - 8px)", minWidth: "250px" }}>
              <TextField
                label={t("resumeBuilder.certifications.issuer")}
                value={cert.issuer || ""}
                onChange={(e) =>
                  handleArrayChange(
                    "certifications",
                    index,
                    "issuer",
                    e.target.value
                  )
                }
                fullWidth
                size="small"
              />
            </Box>
            <Box sx={{ flex: "1 1 calc(50% - 8px)", minWidth: "250px" }}>
              <TextField
                label={t("resumeBuilder.certifications.date")}
                type="date"
                value={formatDate(cert.date)}
                onChange={(e) =>
                  handleArrayChange(
                    "certifications",
                    index,
                    "date",
                    e.target.value
                  )
                }
                fullWidth
                InputLabelProps={{ shrink: true }}
                size="small"
              />
            </Box>
          </Box>
        </Paper>
      ))}

      <Button
        variant="outlined"
        startIcon={<AddIcon />}
        onClick={() =>
          addItem("certifications", {
            name: "",
            issuer: "",
            date: "",
          })
        }
        sx={{ mt: 2 }}
        size="small"
      >
        {t("resumeBuilder.certifications.addCertification")}
      </Button>
    </Box>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box display="flex" alignItems="center" mb={4}>
        <IconButton onClick={handleCancel} sx={{ mr: 2 }}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h4" component="h1">
          {resumeId
            ? t("resumeBuilder.editResume")
            : t("resumeBuilder.createNewResume")}
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <Button
          variant="contained"
          onClick={handleSave}
          startIcon={<Save />}
          disabled={!resumeData.title}
          sx={{ ml: 2 }}
        >
          {t("resumeBuilder.saveResume")}
        </Button>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <Paper elevation={1} sx={{ p: 3 }}>
          <TextField
            label={t("resumeBuilder.resumeTitle")}
            value={resumeData.title || ""}
            onChange={(e) =>
              setResumeData({ ...resumeData, title: e.target.value })
            }
            fullWidth
            required
            size="small"
          />
        </Paper>

        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {t("resumeBuilder.personalInfo.title")}
            </Typography>
            {renderPersonalInfo()}
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {t("resumeBuilder.summary.title")}
            </Typography>
            {renderSummary()}
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {t("resumeBuilder.workExperience.title")}
            </Typography>
            {renderWorkExperience()}
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {t("resumeBuilder.education.title")}
            </Typography>
            {renderEducation()}
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {t("resumeBuilder.skills.title")}
            </Typography>
            {renderSkills()}
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {t("resumeBuilder.additionalSections.title")}
            </Typography>
            {renderAdditionalSections()}
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};
