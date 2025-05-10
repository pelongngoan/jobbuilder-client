import { ObjectId } from "./common.types";
import { Job } from "./job.types";
import { Resume } from "./resume.types";
import { User } from "./user.types";

// Application status type from backend
export type ApplicationStatus =
  | "pending"
  | "reviewed"
  | "shortlisted"
  | "interview"
  | "accepted"
  | "rejected";

// Interview type
export type InterviewType = "phone" | "technical" | "behavioral" | "final";

// Application interface matching the backend model
export interface Application {
  _id: ObjectId;
  userId: ObjectId;
  jobId: ObjectId;
  resumeId: ObjectId;
  coverLetter?: string;
  status: ApplicationStatus;
  feedback?: string;
  interview?: {
    scheduledFor?: Date | string;
    location?: string;
    isOnline?: boolean;
    meetingLink?: string;
    interviewers?: string[];
    notes?: string;
    interviewType?: InterviewType;
    round?: number;
  };
  appliedAt: Date | string;
  updatedAt: Date | string;
}

// Application with populated references
export interface ApplicationWithReferences extends Application {
  user?: User;
  job?: Job;
  resume?: Resume;
}

// Application creation request
export interface ApplicationRequest {
  jobId: ObjectId;
  resumeId: ObjectId;
  coverLetter?: string;
}

// Application update request (for HR/Admin)
export interface ApplicationUpdateRequest {
  status?: ApplicationStatus;
  feedback?: string;
  interview?: {
    scheduledFor?: Date | string;
    location?: string;
    isOnline?: boolean;
    meetingLink?: string;
    interviewers?: string[];
    notes?: string;
    interviewType?: InterviewType;
    round?: number;
  };
}

// Application statistics
export interface ApplicationStats {
  total: number;
  pending: number;
  reviewed: number;
  shortlisted: number;
  interview: number;
  accepted: number;
  rejected: number;
}

// Application filters
export interface ApplicationFilters {
  jobId?: ObjectId;
  userId?: ObjectId;
  status?: ApplicationStatus[];
  dateRange?: {
    startDate?: Date | string;
    endDate?: Date | string;
  };
}
