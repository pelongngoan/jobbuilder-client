import { ObjectId } from "./common.types";
import { CompanyProfile, CompanyStaff } from "./company.types";
import { Profile } from "./profile.types";

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

export interface JobCategory {
  name: string;
  description: string;
  parentCategory?: JobCategory;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}
// Job creation/update request
export interface JobPost {
  companyId: CompanyProfile;
  title: string;
  location: string;
  jobType: "full-time" | "part-time" | "contract" | "internship" | "remote";
  description: string;
  salaryFrom: number;
  salaryTo: number;
  salaryCurrency: string;
  benefits?: string[];
  category?: JobCategory;
  skills?: string[];
  status?: "open" | "closed" | "draft";
  deadline?: Date;
  requirements?: string[];
  contacterId: CompanyStaff;
  profile?: Profile;
  keyResponsibilities?: string[];
  applications: Profile[];
  experienceLevel?: "Entry" | "Mid" | "Senior" | "Executive";
  other?: { title?: string; description?: string; [key: string]: any };
  viewCount: number;
  applicationCount: number;
  isFeatured: boolean;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}
