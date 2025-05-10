import { ObjectId } from "./common.types";

// HR permissions interface
export interface HRPermissions {
  canPostJobs: boolean;
  canManageApplications: boolean;
  canAddHRMembers: boolean;
  canEditCompanyProfile: boolean;
}

// HR profile interface matching the backend model
export interface HRProfile {
  _id: ObjectId;
  userId: ObjectId;
  companyId: ObjectId;
  position?: string;
  department?: string;
  jobPosts?: ObjectId[];
  managedApplications?: ObjectId[];
  permissions?: HRPermissions;
  createdAt: Date | string;
  updatedAt: Date | string;
}

// HR profile with populated company and job posts
export interface HRProfileWithDetails extends HRProfile {
  company?: {
    _id: ObjectId;
    companyName: string;
    logo?: string;
    industry?: string;
  };
  jobPostsData?: Array<{
    _id: ObjectId;
    title: string;
    location: string;
    jobType: string;
    status: string;
  }>;
  managedApplicationsCount?: number;
}

// HR profile creation request
export interface HRProfileCreateRequest {
  userId: ObjectId;
  companyId: ObjectId;
  position?: string;
  department?: string;
  permissions?: Partial<HRPermissions>;
}

// HR profile update request
export interface HRProfileUpdateRequest {
  position?: string;
  department?: string;
  permissions?: Partial<HRPermissions>;
}
