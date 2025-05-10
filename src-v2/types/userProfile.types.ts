import { ObjectId } from "./common.types";

// Job type for job search preferences
export type JobPreferenceType =
  | "full-time"
  | "part-time"
  | "contract"
  | "internship"
  | "remote";

// Job search preferences interface
export interface JobSearchPreferences {
  jobType?: JobPreferenceType[];
  salaryRange?: string;
  remoteOnly?: boolean;
  availableForHire?: boolean;
}

// User experience entry
export interface UserExperience {
  company: string;
  role: string;
  description?: string;
  startDate?: Date | string;
  endDate?: Date | string;
  current?: boolean;
  location?: string;
}

// User education entry
export interface UserEducation {
  institution: string;
  degree?: string;
  field?: string;
  startDate?: Date | string;
  endDate?: Date | string;
  current?: boolean;
  description?: string;
}

// User certification entry
export interface UserCertification {
  name: string;
  issuer?: string;
  issueDate?: Date | string;
  expirationDate?: Date | string;
  credentialId?: string;
  url?: string;
}

// User social media links
export interface UserSocialMedia {
  linkedin?: string;
  github?: string;
  twitter?: string;
  portfolio?: string;
  other?: string;
}

// User portfolio project
export interface UserPortfolioProject {
  title: string;
  description?: string;
  url?: string;
  imageUrl?: string;
  technologies?: string[];
}

// User profile interface matching the backend model
export interface UserProfile {
  _id: ObjectId;
  userId: ObjectId;
  headline?: string;
  bio?: string;
  skills?: ObjectId[];
  savedJobs?: ObjectId[];
  resumes?: ObjectId[];
  applications?: ObjectId[];
  preferredCategories?: ObjectId[];
  preferredLocations?: string[];
  jobSearchPreferences?: JobSearchPreferences;
  experience?: UserExperience[];
  education?: UserEducation[];
  certifications?: UserCertification[];
  socialMedia?: UserSocialMedia;
  portfolioProjects?: UserPortfolioProject[];
  createdAt: Date | string;
  updatedAt: Date | string;
}

// User profile with populated references
export interface UserProfileWithDetails extends UserProfile {
  skillsData?: Array<{
    _id: ObjectId;
    name: string;
    category: string;
  }>;
  preferredCategoriesData?: Array<{
    _id: ObjectId;
    name: string;
  }>;
  savedJobsCount?: number;
  resumesCount?: number;
  applicationsCount?: number;
}

// User profile update request
export interface UserProfileUpdateRequest {
  headline?: string;
  bio?: string;
  skills?: ObjectId[];
  preferredCategories?: ObjectId[];
  preferredLocations?: string[];
  jobSearchPreferences?: Partial<JobSearchPreferences>;
  experience?: UserExperience[];
  education?: UserEducation[];
  certifications?: UserCertification[];
  socialMedia?: UserSocialMedia;
  portfolioProjects?: UserPortfolioProject[];
}
