import { ObjectId } from "./common.types";

// Skill category type
export type SkillCategory =
  | "Technical"
  | "Soft Skills"
  | "Languages"
  | "Tools"
  | "Frameworks"
  | "Other";

// Skill interface matching the backend model
export interface Skill {
  _id: ObjectId;
  name: string;
  category: SkillCategory;
  description?: string;
  popularity: number;
  createdAt: Date | string;
  updatedAt: Date | string;
}

// Skill creation/update request
export interface SkillRequest {
  name: string;
  category: SkillCategory;
  description?: string;
}

// Skill with usage count (for displaying popular skills)
export interface SkillWithUsage extends Skill {
  usageCount: number;
}

// Grouped skills by category
export interface GroupedSkills {
  category: SkillCategory;
  skills: Skill[];
}
