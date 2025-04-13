import {
  PersonalContent,
  ExperienceItem,
  EducationItem,
  SkillItem,
  ProjectItem,
  SectionContent,
  SectionType,
} from "./types";

// Type guards
export const isPersonalContent = (
  content: unknown
): content is PersonalContent => {
  return (
    content !== null &&
    typeof content === "object" &&
    "firstName" in content &&
    "lastName" in content &&
    "email" in content &&
    "phone" in content &&
    "location" in content
  );
};

export const isExperienceContent = (
  content: unknown
): content is ExperienceItem[] => {
  return (
    Array.isArray(content) &&
    content.length > 0 &&
    content.every(
      (item) =>
        typeof item === "object" &&
        item !== null &&
        "id" in item &&
        "position" in item &&
        "company" in item &&
        "startDate" in item &&
        "endDate" in item &&
        "description" in item
    )
  );
};

export const isEducationContent = (
  content: unknown
): content is EducationItem[] => {
  return (
    Array.isArray(content) &&
    content.length > 0 &&
    content.every(
      (item) =>
        typeof item === "object" &&
        item !== null &&
        "id" in item &&
        "school" in item &&
        "degree" in item &&
        "field" in item &&
        "startDate" in item &&
        "endDate" in item
    )
  );
};

export const isSkillsContent = (content: unknown): content is SkillItem[] => {
  return (
    Array.isArray(content) &&
    content.length > 0 &&
    content.every(
      (item) =>
        typeof item === "object" &&
        item !== null &&
        "id" in item &&
        "name" in item &&
        "level" in item &&
        ["beginner", "intermediate", "advanced", "expert"].includes(item.level)
    )
  );
};

export const isProjectsContent = (
  content: unknown
): content is ProjectItem[] => {
  return (
    Array.isArray(content) &&
    content.length > 0 &&
    content.every(
      (item) =>
        typeof item === "object" &&
        item !== null &&
        "id" in item &&
        "name" in item &&
        "description" in item &&
        "technologies" in item
    )
  );
};

// Helper functions
export const createEmptyItem = (
  sectionType: SectionType
): SectionContent[SectionType] => {
  switch (sectionType) {
    case "personal":
      return {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        location: "",
        website: "",
        linkedin: "",
      };
    case "summary":
      return "";
    case "experience":
      return [
        {
          id: crypto.randomUUID(),
          company: "",
          position: "",
          startDate: "",
          endDate: "",
          description: "",
        },
      ];
    case "education":
      return [
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
    case "skills":
      return [
        {
          id: crypto.randomUUID(),
          name: "",
          level: "beginner",
        },
      ];
    case "projects":
      return [
        {
          id: crypto.randomUUID(),
          name: "",
          description: "",
          technologies: [],
          link: "",
        },
      ];
    default:
      throw new Error(`Unknown section type: ${sectionType}`);
  }
};
