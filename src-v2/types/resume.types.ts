import { ObjectId } from "./common.types";

// Resume type
export type ResumeType = "generated" | "uploaded";

// Resume interface matching the backend model
export interface Resume {
  _id: ObjectId;
  userId: ObjectId;
  title: string;
  type: ResumeType;
  fileUrl?: string;
  isDefault?: boolean;
  skills?: ObjectId[];
  content?: {
    personalInfo?: {
      fullName: string;
      email: string;
      phone?: string;
      address?: string;
      linkedin?: string;
      website?: string;
    };
    summary?: string;
    workExperience?: {
      company: string;
      position: string;
      location?: string;
      startDate?: Date | string;
      endDate?: Date | string;
      current?: boolean;
      description?: string;
      highlights?: string[];
    }[];
    education?: {
      institution: string;
      degree?: string;
      field?: string;
      location?: string;
      startDate?: Date | string;
      endDate?: Date | string;
      current?: boolean;
      gpa?: string;
      highlights?: string[];
    }[];
    skills?: {
      category?: string;
      items: string[];
    }[];
    certifications?: {
      name: string;
      issuer?: string;
      date?: Date | string;
      url?: string;
    }[];
    languages?: {
      language: string;
      proficiency?: string;
    }[];
    projects?: {
      name: string;
      description?: string;
      url?: string;
      technologies?: string[];
      highlights?: string[];
    }[];
    references?: {
      name: string;
      position?: string;
      company?: string;
      email?: string;
      phone?: string;
    }[];
  };
  createdAt: Date | string;
  updatedAt: Date | string;
}

// Resume with populated skills
export interface ResumeWithSkills extends Resume {
  skillDetails?: Array<{
    _id: ObjectId;
    name: string;
    category?: string;
  }>;
}

// Resume creation request
export interface ResumeRequest {
  title: string;
  type: ResumeType;
  fileUrl?: string;
  isDefault?: boolean;
  skills?: ObjectId[];
  content?: Resume["content"];
}

// Resume update request
export interface ResumeUpdateRequest {
  title?: string;
  isDefault?: boolean;
  skills?: ObjectId[];
  content?: Partial<Resume["content"]>;
}
