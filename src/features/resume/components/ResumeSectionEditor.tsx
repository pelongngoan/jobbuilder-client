import React, { useState } from "react";
import {
  ResumeSection,
  SectionType,
  SectionContent,
  PersonalContent,
  ExperienceItem,
  EducationItem,
  SkillItem,
  ProjectItem,
} from "../types";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Textarea } from "../../../components/ui/Textarea";
import { ChevronDown, ChevronUp } from "lucide-react";

interface ResumeSectionEditorProps {
  section: ResumeSection;
  onUpdate: (section: ResumeSection) => void;
}

export const ResumeSectionEditor: React.FC<ResumeSectionEditorProps> = ({
  section,
  onUpdate,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [content, setContent] = useState<SectionContent[SectionType]>(
    section.content
  );

  const handleContentChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
    field: string,
    sectionType: SectionType
  ) => {
    if (sectionType === "summary") {
      setContent(e.target.value);
      onUpdate({ ...section, content: e.target.value });
      return;
    }

    if (typeof content === "object" && content !== null) {
      const newContent = { ...content, [field]: e.target.value };
      setContent(newContent);
      onUpdate({ ...section, content: newContent });
    }
  };

  const renderPersonalSection = () => {
    const personalContent = content as PersonalContent;
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="First Name"
            value={personalContent.firstName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleContentChange(e, "firstName", "personal")
            }
          />
          <Input
            label="Last Name"
            value={personalContent.lastName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleContentChange(e, "lastName", "personal")
            }
          />
        </div>
        <Input
          label="Email"
          value={personalContent.email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            handleContentChange(e, "email", "personal")
          }
        />
        <Input
          label="Phone"
          value={personalContent.phone}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            handleContentChange(e, "phone", "personal")
          }
        />
        <Input
          label="Location"
          value={personalContent.location}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            handleContentChange(e, "location", "personal")
          }
        />
        <Input
          label="Website (optional)"
          value={personalContent.website || ""}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            handleContentChange(e, "website", "personal")
          }
        />
        <Input
          label="LinkedIn (optional)"
          value={personalContent.linkedin || ""}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            handleContentChange(e, "linkedin", "personal")
          }
        />
      </div>
    );
  };

  const renderSummarySection = () => {
    const summaryContent = content as string;
    return (
      <Textarea
        label="Professional Summary"
        value={summaryContent}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
          handleContentChange(e, "summary", "summary")
        }
        rows={5}
      />
    );
  };

  const renderExperienceSection = () => {
    const experienceContent = content as ExperienceItem[];
    return (
      <div className="space-y-4">
        {experienceContent.map((item, index) => (
          <div key={item.id || index} className="border p-4 rounded-lg">
            <Input
              label="Company"
              value={item.company}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleContentChange(e, "company", "experience")
              }
            />
            <Input
              label="Position"
              value={item.position}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleContentChange(e, "position", "experience")
              }
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Start Date"
                value={item.startDate}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleContentChange(e, "startDate", "experience")
                }
              />
              <Input
                label="End Date"
                value={item.endDate}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleContentChange(e, "endDate", "experience")
                }
              />
            </div>
            <Textarea
              label="Description"
              value={item.description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                handleContentChange(e, "description", "experience")
              }
              rows={3}
            />
          </div>
        ))}
        <Button
          onClick={() => {
            const newExp = [
              ...experienceContent,
              {
                id: crypto.randomUUID(),
                company: "",
                position: "",
                description: "",
                startDate: "",
                endDate: "",
              },
            ];
            setContent(newExp);
            onUpdate({ ...section, content: newExp });
          }}
        >
          Add Experience
        </Button>
      </div>
    );
  };

  const renderEducationSection = () => {
    const educationContent = content as EducationItem[];
    return (
      <div className="space-y-4">
        {educationContent.map((item, index) => (
          <div key={item.id || index} className="border p-4 rounded-lg">
            <Input
              label="School"
              value={item.school}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleContentChange(e, "school", "education")
              }
            />
            <Input
              label="Degree"
              value={item.degree}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleContentChange(e, "degree", "education")
              }
            />
            <Input
              label="Field of Study"
              value={item.field}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleContentChange(e, "field", "education")
              }
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Start Date"
                value={item.startDate}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleContentChange(e, "startDate", "education")
                }
              />
              <Input
                label="End Date"
                value={item.endDate}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleContentChange(e, "endDate", "education")
                }
              />
            </div>
            <Input
              label="GPA (optional)"
              value={item.gpa || ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleContentChange(e, "gpa", "education")
              }
            />
          </div>
        ))}
        <Button
          onClick={() => {
            const newEdu = [
              ...educationContent,
              {
                id: crypto.randomUUID(),
                school: "",
                degree: "",
                field: "",
                startDate: "",
                endDate: "",
                gpa: "",
              },
            ];
            setContent(newEdu);
            onUpdate({ ...section, content: newEdu });
          }}
        >
          Add Education
        </Button>
      </div>
    );
  };

  const renderSkillsSection = () => {
    const skillsContent = content as SkillItem[];
    return (
      <div className="space-y-4">
        {skillsContent.map((item, index) => (
          <div key={item.id || index} className="border p-4 rounded-lg">
            <Input
              label="Skill Name"
              value={item.name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleContentChange(e, "name", "skills")
              }
            />
            <select
              className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              value={item.level}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                handleContentChange(e, "level", "skills")
              }
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
              <option value="expert">Expert</option>
            </select>
          </div>
        ))}
        <Button
          onClick={() => {
            const newSkills: SkillItem[] = [
              ...skillsContent,
              {
                id: crypto.randomUUID(),
                name: "",
                level: "beginner",
              },
            ];
            setContent(newSkills);
            onUpdate({ ...section, content: newSkills });
          }}
        >
          Add Skill
        </Button>
      </div>
    );
  };

  const renderProjectsSection = () => {
    const projectsContent = content as ProjectItem[];
    return (
      <div className="space-y-4">
        {projectsContent.map((item, index) => (
          <div key={item.id || index} className="border p-4 rounded-lg">
            <Input
              label="Project Name"
              value={item.name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleContentChange(e, "name", "projects")
              }
            />
            <Textarea
              label="Description"
              value={item.description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                handleContentChange(e, "description", "projects")
              }
              rows={3}
            />
            <Input
              label="Technologies (comma-separated)"
              value={item.technologies.join(", ")}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleContentChange(e, "technologies", "projects")
              }
            />
            <Input
              label="Project Link (optional)"
              value={item.link || ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleContentChange(e, "link", "projects")
              }
            />
          </div>
        ))}
        <Button
          onClick={() => {
            const newProjects = [
              ...projectsContent,
              {
                id: crypto.randomUUID(),
                name: "",
                description: "",
                technologies: [],
                link: "",
              },
            ];
            setContent(newProjects);
            onUpdate({ ...section, content: newProjects });
          }}
        >
          Add Project
        </Button>
      </div>
    );
  };

  const renderSection = () => {
    switch (section.id) {
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

  return (
    <div className="border rounded-lg overflow-hidden">
      <div
        className="flex items-center justify-between p-4 bg-gray-50 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h3 className="text-lg font-semibold capitalize">{section.id}</h3>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5" />
        ) : (
          <ChevronDown className="w-5 h-5" />
        )}
      </div>
      {isExpanded && <div className="p-4">{renderSection()}</div>}
    </div>
  );
};
