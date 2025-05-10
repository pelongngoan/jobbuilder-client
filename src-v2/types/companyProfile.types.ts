import { ObjectId } from "./common.types";

// Company size type
export type CompanySize =
  | "1-10"
  | "11-50"
  | "51-200"
  | "201-500"
  | "501-1000"
  | "1000+";

// Company social media links
export interface CompanySocialMedia {
  linkedin?: string;
  twitter?: string;
  facebook?: string;
  instagram?: string;
}

// Company profile interface matching the backend model
export interface CompanyProfile {
  _id: ObjectId;
  userId: ObjectId;
  companyName: string;
  industry?: string;
  website?: string;
  description?: string;
  logo?: string;
  companySize?: CompanySize;
  foundingYear?: number;
  companyValues?: string[];
  socialMedia?: CompanySocialMedia;
  benefits?: string[];
  hrMembers?: ObjectId[];
  jobPosts?: ObjectId[];
  slug: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

// Company profile with populated HR members and job posts
export interface CompanyProfileWithDetails extends CompanyProfile {
  hrMembersData?: Array<{
    _id: ObjectId;
    name: string;
    email: string;
    profilePicture?: string;
  }>;
  jobPostsData?: Array<{
    _id: ObjectId;
    title: string;
    location: string;
    jobType: string;
    status: string;
  }>;
}

// Company profile creation/update request
export interface CompanyProfileRequest {
  companyName: string;
  industry?: string;
  website?: string;
  description?: string;
  logo?: string;
  companySize?: CompanySize;
  foundingYear?: number;
  companyValues?: string[];
  socialMedia?: CompanySocialMedia;
  benefits?: string[];
}

// Company profile search filters
export interface CompanySearchFilters {
  query?: string;
  industry?: string;
  companySize?: CompanySize[];
}
