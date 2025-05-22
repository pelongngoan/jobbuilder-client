import { UserProfile } from "./user.types";

export type ResumeType = "generated" | "uploaded";

export interface Resume {
  _id: string;
  userId: UserProfile | string;
  title: string;
  type: ResumeType;
  fileUrl?: string;
  isDefault?: boolean;
  skills?: string[];
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
  createdAt?: Date | string;
  updatedAt?: Date | string;
}
