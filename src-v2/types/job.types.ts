import { ObjectId } from "./common.types";

// Job type definitions matching backend models
export type JobType =
  | "full-time"
  | "part-time"
  | "contract"
  | "internship"
  | "remote";
export type JobStatus = "open" | "closed" | "draft";
export type SalaryType = "hourly" | "monthly" | "yearly";
export type ExperienceLevel = "Entry" | "Mid" | "Senior" | "Executive";

// Job interface matching the backend model
export interface Job {
  _id: ObjectId;
  companyId: ObjectId;
  hrId: ObjectId;
  title: string;
  location: string;
  jobType: JobType;
  salaryRange?: string;
  salaryCurrency: string;
  salaryType?: SalaryType;
  description: string;
  keyResponsibilities?: string[];
  benefits?: string[];
  category?: ObjectId;
  skills?: ObjectId[];
  status?: JobStatus;
  deadline?: Date | string;
  requirements?: string[];
  contactEmail?: string;
  contactPhone?: string;
  logoCompany?: string;
  companyName?: string;
  companyWebsite?: string;
  applications?: ObjectId[];
  other?: {
    title?: string;
    description?: string;
    [key: string]: any;
  };
  experienceLevel?: ExperienceLevel;
  viewCount: number;
  applicationCount: number;
  isFeatured: boolean;
  slug: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

// Job with populated references
export interface JobWithReferences extends Job {
  company?: {
    _id: ObjectId;
    name: string;
    logo?: string;
    website?: string;
  };
  categoryDetails?: {
    _id: ObjectId;
    name: string;
  };
  skillDetails?: Array<{
    _id: ObjectId;
    name: string;
  }>;
}

// Job creation/update request
export interface JobRequest {
  title: string;
  location: string;
  jobType: JobType;
  salaryRange?: string;
  salaryCurrency: string;
  salaryType?: SalaryType;
  description: string;
  keyResponsibilities?: string[];
  benefits?: string[];
  category?: ObjectId;
  skills?: ObjectId[];
  status?: JobStatus;
  deadline?: Date | string;
  requirements?: string[];
  contactEmail?: string;
  contactPhone?: string;
  logoCompany?: string;
  companyName?: string;
  companyWebsite?: string;
  experienceLevel?: ExperienceLevel;
  isFeatured?: boolean;
  other?: { [key: string]: any };
}

// Job search filters
export interface JobSearchFilters {
  query?: string;
  location?: string;
  jobType?: JobType[];
  experienceLevel?: ExperienceLevel[];
  category?: ObjectId;
  skills?: ObjectId[];
  salaryRange?: {
    min?: number;
    max?: number;
  };
  datePosted?: {
    startDate?: Date | string;
    endDate?: Date | string;
  };
  status?: JobStatus[];
  companyId?: ObjectId;
  isFeatured?: boolean;
}
