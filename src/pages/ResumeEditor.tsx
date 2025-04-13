import React, { useState, ChangeEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Card, CardContent } from "../components/ui/Card";
import { Navigation } from "../components/Navigation";
import { ArrowLeft, Save, Download, Eye, Edit2 } from "lucide-react";
import type {
  ResumeData,
  SectionType,
  PersonalContent,
  ExperienceItem,
  EducationItem,
  SkillItem,
  ProjectItem,
  SectionContent,
  ResumeSection,
} from "../features/resume/types";

// Type guards
function isPersonalContent(content: unknown): content is PersonalContent {
  return (
    typeof content === "object" &&
    content !== null &&
    "firstName" in content &&
    "lastName" in content
  );
}

function isArrayContent(content: unknown): content is Array<unknown> {
  return Array.isArray(content);
}

function isExperienceArray(content: unknown[]): content is ExperienceItem[] {
  return content.every(
    (item) =>
      typeof item === "object" &&
      item !== null &&
      "position" in item &&
      "company" in item
  );
}

function isEducationArray(content: unknown[]): content is EducationItem[] {
  return content.every(
    (item) =>
      typeof item === "object" &&
      item !== null &&
      "school" in item &&
      "degree" in item
  );
}

function isSkillArray(content: unknown[]): content is SkillItem[] {
  return content.every(
    (item) =>
      typeof item === "object" &&
      item !== null &&
      "name" in item &&
      "level" in item
  );
}

function isProjectArray(content: unknown[]): content is ProjectItem[] {
  return content.every(
    (item) =>
      typeof item === "object" &&
      item !== null &&
      "name" in item &&
      "technologies" in item
  );
}

export const ResumeEditor = () => {
  const { templateId } = useParams<{ templateId: string }>();
  const navigate = useNavigate();

  const [resumeData, setResumeData] = useState<ResumeData>({
    id: "1",
    title: "My Resume",
    templateId: templateId || "default",
    sections: [
      {
        id: "personal",
        title: "Personal Information",
        content: {
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          location: "",
          website: "",
          linkedin: "",
        },
      },
      {
        id: "summary",
        title: "Professional Summary",
        content: "",
      },
      {
        id: "experience",
        title: "Work Experience",
        content: [],
      },
      {
        id: "education",
        title: "Education",
        content: [],
      },
      {
        id: "skills",
        title: "Skills",
        content: [],
      },
      {
        id: "projects",
        title: "Projects",
        content: [],
      },
    ],
  });

  const [activeSection, setActiveSection] = useState<SectionType>("personal");
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  // Update section content
  const updateSectionContent = (
    sectionId: SectionType,
    content: SectionContent[SectionType]
  ) => {
    setResumeData((prev) => ({
      ...prev,
      sections: prev.sections.map((section) =>
        section.id === sectionId ? { ...section, content } : section
      ),
    }));
  };

  // Add item to section
  const addItem = (sectionId: SectionType) => {
    setResumeData((prev) => {
      const newData = { ...prev };
      const section = newData.sections.find((s) => s.id === sectionId);
      if (!section) return prev;

      switch (sectionId) {
        case "experience":
          if (Array.isArray(section.content)) {
            (section.content as ExperienceItem[]).push({
              id: crypto.randomUUID(),
              company: "",
              position: "",
              startDate: "",
              endDate: "",
              description: "",
            });
          }
          break;
        case "education":
          if (Array.isArray(section.content)) {
            (section.content as EducationItem[]).push({
              id: crypto.randomUUID(),
              school: "",
              degree: "",
              field: "",
              startDate: "",
              endDate: "",
              gpa: "",
            });
          }
          break;
        case "skills":
          if (Array.isArray(section.content)) {
            (section.content as SkillItem[]).push({
              id: crypto.randomUUID(),
              name: "",
              level: "beginner",
            });
          }
          break;
        case "projects":
          if (Array.isArray(section.content)) {
            (section.content as ProjectItem[]).push({
              id: crypto.randomUUID(),
              name: "",
              description: "",
              technologies: [],
              link: "",
            });
          }
          break;
      }

      return newData;
    });
  };

  // Remove item from section
  const removeItemFromSection = (sectionId: SectionType, itemId: string) => {
    setResumeData((prev) => ({
      ...prev,
      sections: prev.sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              content: Array.isArray(section.content)
                ? (section.content as any[]).filter(
                    (item) => item.id !== itemId
                  )
                : section.content,
            }
          : section
      ),
    }));
  };

  // Update item in section
  function updateItemInSection<T extends SectionType>(
    sectionId: T,
    itemId: string,
    updates: T extends "summary"
      ? string
      : T extends "personal"
      ? Partial<PersonalContent>
      : T extends "experience"
      ? Partial<ExperienceItem>
      : T extends "education"
      ? Partial<EducationItem>
      : T extends "skills"
      ? Partial<SkillItem>
      : T extends "projects"
      ? Partial<ProjectItem>
      : never
  ) {
    setResumeData((prev) => {
      const newData = { ...prev };
      const section = newData.sections.find((s) => s.id === sectionId);
      if (!section) return prev;

      if (sectionId === "personal" && isPersonalContent(section.content)) {
        section.content = Object.assign(
          {},
          section.content,
          updates
        ) as PersonalContent;
      } else if (sectionId === "summary") {
        section.content = updates as string;
      } else if (isArrayContent(section.content)) {
        const index = section.content.findIndex(
          (item: any) => item.id === itemId
        );
        if (index !== -1) {
          section.content[index] = Object.assign(
            {},
            section.content[index],
            updates
          );
        }
      }

      return newData;
    });
  }

  // Update the section content rendering
  const renderSectionContent = (section: ResumeSection) => {
    switch (section.id) {
      case "personal": {
        if (!isPersonalContent(section.content)) {
          return null;
        }
        const personalContent = section.content as PersonalContent;
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="First Name"
                value={personalContent.firstName}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  updateItemInSection("personal", "", {
                    firstName: e.target.value,
                  })
                }
              />
              <Input
                label="Last Name"
                value={personalContent.lastName}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  updateItemInSection("personal", "", {
                    lastName: e.target.value,
                  })
                }
              />
            </div>
            <Input
              label="Email"
              type="email"
              value={personalContent.email}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                updateItemInSection("personal", "", {
                  email: e.target.value,
                })
              }
            />
            <Input
              label="Phone"
              type="tel"
              value={personalContent.phone}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                updateItemInSection("personal", "", {
                  phone: e.target.value,
                })
              }
            />
            <Input
              label="Location"
              value={personalContent.location}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                updateItemInSection("personal", "", {
                  location: e.target.value,
                })
              }
            />
            <Input
              label="Website"
              value={personalContent.website || ""}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                updateItemInSection("personal", "", {
                  website: e.target.value,
                })
              }
            />
            <Input
              label="LinkedIn"
              value={personalContent.linkedin || ""}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                updateItemInSection("personal", "", {
                  linkedin: e.target.value,
                })
              }
            />
          </div>
        );
      }

      case "experience":
        if (
          !isArrayContent(section.content) ||
          !isExperienceArray(section.content)
        ) {
          return null;
        }
        const experienceContent = section.content as ExperienceItem[];
        return experienceContent.map((exp) => (
          <Card key={exp.id} className="p-4">
            <div className="space-y-4">
              <Input
                label="Company"
                value={exp.company}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  updateItemInSection("experience", exp.id, {
                    company: e.target.value,
                  } as Partial<ExperienceItem>)
                }
              />
              <Input
                label="Position"
                value={exp.position}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  updateItemInSection("experience", exp.id, {
                    position: e.target.value,
                  } as Partial<ExperienceItem>)
                }
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Start Date"
                  type="date"
                  value={exp.startDate}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    updateItemInSection("experience", exp.id, {
                      startDate: e.target.value,
                    } as Partial<ExperienceItem>)
                  }
                />
                <Input
                  label="End Date"
                  type="date"
                  value={exp.endDate}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    updateItemInSection("experience", exp.id, {
                      endDate: e.target.value,
                    } as Partial<ExperienceItem>)
                  }
                />
              </div>
              <textarea
                className="w-full p-2 border rounded-md"
                value={exp.description}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                  updateItemInSection("experience", exp.id, {
                    description: e.target.value,
                  } as Partial<ExperienceItem>)
                }
                placeholder="Describe your responsibilities and achievements..."
              />
            </div>
          </Card>
        ));

      case "education":
        if (
          !isArrayContent(section.content) ||
          !isEducationArray(section.content)
        ) {
          return null;
        }
        const educationContent = section.content as EducationItem[];
        return educationContent.map((edu) => (
          <Card key={edu.id} className="p-4">
            <div className="space-y-4">
              <Input
                label="School"
                value={edu.school}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  updateItemInSection("education", edu.id, {
                    school: e.target.value,
                  } as Partial<EducationItem>)
                }
              />
              <Input
                label="Degree"
                value={edu.degree}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  updateItemInSection("education", edu.id, {
                    degree: e.target.value,
                  } as Partial<EducationItem>)
                }
              />
              <Input
                label="Field of Study"
                value={edu.field}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  updateItemInSection("education", edu.id, {
                    field: e.target.value,
                  } as Partial<EducationItem>)
                }
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Start Date"
                  type="date"
                  value={edu.startDate}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    updateItemInSection("education", edu.id, {
                      startDate: e.target.value,
                    } as Partial<EducationItem>)
                  }
                />
                <Input
                  label="End Date"
                  type="date"
                  value={edu.endDate}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    updateItemInSection("education", edu.id, {
                      endDate: e.target.value,
                    } as Partial<EducationItem>)
                  }
                />
              </div>
              <Input
                label="GPA (optional)"
                value={edu.gpa || ""}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  updateItemInSection("education", edu.id, {
                    gpa: e.target.value,
                  } as Partial<EducationItem>)
                }
              />
            </div>
          </Card>
        ));

      case "skills":
        if (
          !isArrayContent(section.content) ||
          !isSkillArray(section.content)
        ) {
          return null;
        }
        const skillsContent = section.content as SkillItem[];
        return skillsContent.map((skill) => (
          <Card key={skill.id} className="p-4">
            <div className="space-y-4">
              <Input
                label="Skill Name"
                value={skill.name}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  updateItemInSection("skills", skill.id, {
                    name: e.target.value,
                  } as Partial<SkillItem>)
                }
              />
              <select
                className="w-full p-2 border rounded-md"
                value={skill.level}
                onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                  updateItemInSection("skills", skill.id, {
                    level: e.target.value as
                      | "beginner"
                      | "intermediate"
                      | "advanced"
                      | "expert",
                  } as Partial<SkillItem>)
                }
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
                <option value="expert">Expert</option>
              </select>
            </div>
          </Card>
        ));

      case "projects":
        if (
          !isArrayContent(section.content) ||
          !isProjectArray(section.content)
        ) {
          return null;
        }
        const projectsContent = section.content as ProjectItem[];
        return projectsContent.map((project) => (
          <Card key={project.id} className="p-4">
            <div className="space-y-4">
              <Input
                label="Project Name"
                value={project.name}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  updateItemInSection("projects", project.id, {
                    name: e.target.value,
                  } as Partial<ProjectItem>)
                }
              />
              <textarea
                className="w-full p-2 border rounded-md"
                value={project.description}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                  updateItemInSection("projects", project.id, {
                    description: e.target.value,
                  } as Partial<ProjectItem>)
                }
                placeholder="Describe your project..."
              />
              <Input
                label="Technologies (comma-separated)"
                value={project.technologies.join(", ")}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  updateItemInSection("projects", project.id, {
                    technologies: e.target.value
                      .split(",")
                      .map((tech) => tech.trim()),
                  } as Partial<ProjectItem>)
                }
              />
              <Input
                label="Project Link (optional)"
                value={project.link || ""}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  updateItemInSection("projects", project.id, {
                    link: e.target.value,
                  } as Partial<ProjectItem>)
                }
              />
            </div>
          </Card>
        ));

      case "summary":
        return (
          <textarea
            className="w-full p-2 border rounded-md"
            value={section.content as string}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
              updateItemInSection("summary", "", e.target.value)
            }
            placeholder="Write a brief summary of your professional background..."
            rows={5}
          />
        );

      default:
        return null;
    }
  };

  // Render the personal information section
  const renderPersonalSection = () => {
    const personalSection = resumeData.sections.find(
      (s) => s.id === "personal"
    );
    if (!personalSection || !isPersonalContent(personalSection.content)) {
      return null;
    }

    const personalContent = personalSection.content;
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="First Name"
            value={personalContent.firstName}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              updateItemInSection("personal", "", {
                firstName: e.target.value,
              })
            }
          />
          <Input
            label="Last Name"
            value={personalContent.lastName}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              updateItemInSection("personal", "", {
                lastName: e.target.value,
              })
            }
          />
        </div>
        <Input
          label="Email"
          type="email"
          value={personalContent.email}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            updateItemInSection("personal", "", {
              email: e.target.value,
            })
          }
        />
        <Input
          label="Phone"
          type="tel"
          value={personalContent.phone}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            updateItemInSection("personal", "", {
              phone: e.target.value,
            })
          }
        />
        <Input
          label="Location"
          value={personalContent.location}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            updateItemInSection("personal", "", {
              location: e.target.value,
            })
          }
        />
        <Input
          label="Website"
          value={personalContent.website || ""}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            updateItemInSection("personal", "", {
              website: e.target.value,
            })
          }
        />
        <Input
          label="LinkedIn"
          value={personalContent.linkedin || ""}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            updateItemInSection("personal", "", {
              linkedin: e.target.value,
            })
          }
        />
      </div>
    );
  };

  // Add section render functions
  const renderSummarySection = () => {
    const summarySection = resumeData.sections.find((s) => s.id === "summary");
    if (!summarySection || typeof summarySection.content !== "string")
      return null;

    return (
      <div className="space-y-4">
        <textarea
          className="w-full p-2 border rounded"
          value={summarySection.content}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
            updateItemInSection("summary", "summary", e.target.value)
          }
        />
      </div>
    );
  };

  const renderExperienceSection = () => {
    const experienceSection = resumeData.sections.find(
      (s) => s.id === "experience"
    );
    if (
      !experienceSection ||
      !isArrayContent(experienceSection.content) ||
      !isExperienceArray(experienceSection.content)
    )
      return null;

    return (
      <div className="space-y-4">
        {experienceSection.content.map((item) => (
          <div key={item.id} className="p-4 border rounded">
            <Input
              label="Position"
              value={item.position}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                updateItemInSection("experience", item.id, {
                  position: e.target.value,
                })
              }
            />
            <Input
              label="Company"
              value={item.company}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                updateItemInSection("experience", item.id, {
                  company: e.target.value,
                })
              }
            />
          </div>
        ))}
        <Button onClick={() => addItem("experience")}>Add Experience</Button>
      </div>
    );
  };

  const renderEducationSection = () => {
    const educationSection = resumeData.sections.find(
      (s) => s.id === "education"
    );
    if (
      !educationSection ||
      !isArrayContent(educationSection.content) ||
      !isEducationArray(educationSection.content)
    )
      return null;

    return (
      <div className="space-y-4">
        {educationSection.content.map((item) => (
          <div key={item.id} className="p-4 border rounded">
            <Input
              label="School"
              value={item.school}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                updateItemInSection("education", item.id, {
                  school: e.target.value,
                })
              }
            />
            <Input
              label="Degree"
              value={item.degree}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                updateItemInSection("education", item.id, {
                  degree: e.target.value,
                })
              }
            />
          </div>
        ))}
        <Button onClick={() => addItem("education")}>Add Education</Button>
      </div>
    );
  };

  const renderSkillsSection = () => {
    const skillsSection = resumeData.sections.find((s) => s.id === "skills");
    if (
      !skillsSection ||
      !isArrayContent(skillsSection.content) ||
      !isSkillArray(skillsSection.content)
    )
      return null;

    return (
      <div className="space-y-4">
        {skillsSection.content.map((item) => (
          <div key={item.id} className="p-4 border rounded">
            <Input
              label="Skill"
              value={item.name}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                updateItemInSection("skills", item.id, {
                  name: e.target.value,
                })
              }
            />
            <Input
              value={item.level}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                updateItemInSection("skills", item.id, {
                  level: e.target.value as SkillItem["level"],
                })
              }
            />
          </div>
        ))}
        <Button onClick={() => addItem("skills")}>Add Skill</Button>
      </div>
    );
  };

  const renderProjectsSection = () => {
    const projectsSection = resumeData.sections.find(
      (s) => s.id === "projects"
    );
    if (
      !projectsSection ||
      !isArrayContent(projectsSection.content) ||
      !isProjectArray(projectsSection.content)
    )
      return null;

    return (
      <div className="space-y-4">
        {projectsSection.content.map((item) => (
          <div key={item.id} className="p-4 border rounded">
            <Input
              label="Project Name"
              value={item.name}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                updateItemInSection("projects", item.id, {
                  name: e.target.value,
                })
              }
            />
            <Input
              label="Description"
              value={item.description}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                updateItemInSection("projects", item.id, {
                  description: e.target.value,
                })
              }
            />
          </div>
        ))}
        <Button onClick={() => addItem("projects")}>Add Project</Button>
      </div>
    );
  };

  // Render the active section based on selection
  const renderActiveSection = () => {
    switch (activeSection) {
      case "personal":
        return renderPersonalSection();
      case "summary":
        return renderSummarySection();
      case "experience":
        return renderExperienceSection();
      case "education":
        return renderEducationSection();
      case "skills":
        return renderSkillsSection();
      case "projects":
        return renderProjectsSection();
      default:
        return null;
    }
  };

  // Render the resume preview
  const renderResumePreview = () => {
    // This is a simplified preview - in a real app, you would render the actual resume template
    return (
      <div className="bg-white p-8 shadow-lg max-w-[800px] mx-auto">
        <div className="border-b-2 border-gray-300 pb-4 mb-6">
          <h1 className="text-3xl font-bold text-center">
            {resumeData.sections.find((s) => s.id === "personal")?.content
              .fullName || "Your Name"}
          </h1>
          <div className="flex flex-wrap justify-center gap-2 mt-2 text-sm text-gray-600">
            <span>
              {resumeData.sections.find((s) => s.id === "personal")?.content
                .email || "email@example.com"}
            </span>
            <span>•</span>
            <span>
              {resumeData.sections.find((s) => s.id === "personal")?.content
                .phone || "(555) 123-4567"}
            </span>
            <span>•</span>
            <span>
              {resumeData.sections.find((s) => s.id === "personal")?.content
                .location || "City, State"}
            </span>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Professional Summary</h2>
          <p className="text-gray-700">
            {resumeData.sections.find((s) => s.id === "summary")?.content ||
              "Your professional summary will appear here."}
          </p>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Work Experience</h2>
          {resumeData.sections.find((s) => s.id === "experience")?.content
            .length > 0 ? (
            resumeData.sections
              .find((s) => s.id === "experience")
              ?.content.map((exp: any) => (
                <div key={exp.id} className="mb-4">
                  <div className="flex justify-between">
                    <h3 className="font-semibold">
                      {exp.position || "Position"}
                    </h3>
                    <span className="text-gray-600">
                      {exp.startDate || "Start"} - {exp.endDate || "End"}
                    </span>
                  </div>
                  <div className="text-gray-600 mb-1">
                    {exp.company || "Company"} | {exp.location || "Location"}
                  </div>
                  <p className="text-gray-700">
                    {exp.description ||
                      "Description of your role and achievements."}
                  </p>
                </div>
              ))
          ) : (
            <p className="text-gray-500 italic">No experience added yet.</p>
          )}
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Education</h2>
          {resumeData.sections.find((s) => s.id === "education")?.content
            .length > 0 ? (
            resumeData.sections
              .find((s) => s.id === "education")
              ?.content.map((edu: any) => (
                <div key={edu.id} className="mb-4">
                  <div className="flex justify-between">
                    <h3 className="font-semibold">
                      {edu.institution || "Institution"}
                    </h3>
                    <span className="text-gray-600">
                      {edu.startDate || "Start"} - {edu.endDate || "End"}
                    </span>
                  </div>
                  <div className="text-gray-600 mb-1">
                    {edu.degree || "Degree"} in {edu.field || "Field of Study"}
                  </div>
                  {edu.gpa && (
                    <div className="text-gray-600">GPA: {edu.gpa}</div>
                  )}
                </div>
              ))
          ) : (
            <p className="text-gray-500 italic">No education added yet.</p>
          )}
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {resumeData.sections.find((s) => s.id === "skills")?.content
              .length > 0 ? (
              resumeData.sections
                .find((s) => s.id === "skills")
                ?.content.map((skill: any) => (
                  <span
                    key={skill.id}
                    className="bg-gray-200 px-3 py-1 rounded-full text-sm"
                  >
                    {skill.name || "Skill"}
                  </span>
                ))
            ) : (
              <p className="text-gray-500 italic">No skills added yet.</p>
            )}
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Projects</h2>
          {resumeData.sections.find((s) => s.id === "projects")?.content
            .length > 0 ? (
            resumeData.sections
              .find((s) => s.id === "projects")
              ?.content.map((project: any) => (
                <div key={project.id} className="mb-4">
                  <h3 className="font-semibold">
                    {project.name || "Project Name"}
                  </h3>
                  <div className="text-gray-600 mb-1">
                    {project.technologies || "Technologies used"}
                  </div>
                  <p className="text-gray-700">
                    {project.description || "Description of your project."}
                  </p>
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      View Project
                    </a>
                  )}
                </div>
              ))
          ) : (
            <p className="text-gray-500 italic">No projects added yet.</p>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-slate-50 pt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-slate-900">
                  {isPreviewMode ? "Resume Preview" : "Edit Resume"}
                </h1>
                <p className="text-slate-600 mt-2">
                  {isPreviewMode
                    ? "Preview your resume before saving"
                    : "Fill in your information to create your resume"}
                </p>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={() => navigate("/create-resume")}
                  leftIcon={<ArrowLeft className="h-4 w-4" />}
                >
                  Back to Templates
                </Button>
                {!isPreviewMode && (
                  <Button
                    variant="outline"
                    onClick={() => setIsPreviewMode(true)}
                    leftIcon={<Eye className="h-4 w-4" />}
                  >
                    Preview
                  </Button>
                )}
                {isPreviewMode && (
                  <Button
                    variant="outline"
                    onClick={() => setIsPreviewMode(false)}
                    leftIcon={<Edit2 className="h-4 w-4" />}
                  >
                    Edit
                  </Button>
                )}
                <Button
                  variant="primary"
                  onClick={() => console.log("Saving resume:", resumeData)}
                  leftIcon={<Save className="h-4 w-4" />}
                >
                  Save Resume
                </Button>
                <Button
                  variant="outline"
                  onClick={() => console.log("Downloading resume")}
                  leftIcon={<Download className="h-4 w-4" />}
                >
                  Download
                </Button>
              </div>
            </div>

            {isPreviewMode ? (
              <div className="bg-white rounded-lg shadow-md p-6 overflow-auto max-h-[calc(100vh-200px)]">
                {renderResumePreview()}
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-1">
                  <Card>
                    <CardContent className="p-4">
                      <h2 className="text-lg font-semibold mb-4">
                        Resume Sections
                      </h2>
                      <div className="space-y-2">
                        {resumeData.sections.map((section) => (
                          <button
                            key={section.id}
                            className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                              activeSection === section.id
                                ? "bg-blue-100 text-blue-700"
                                : "hover:bg-gray-100"
                            }`}
                            onClick={() =>
                              setActiveSection(section.id as SectionType)
                            }
                          >
                            {section.title}
                          </button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="lg:col-span-3">
                  <Card>
                    <CardContent className="p-6">
                      <h2 className="text-xl font-semibold mb-4">
                        {
                          resumeData.sections.find(
                            (s) => s.id === activeSection
                          )?.title
                        }
                      </h2>
                      {renderActiveSection()}
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
