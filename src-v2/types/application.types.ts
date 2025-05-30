import { ObjectId } from "./common.types";
import { CompanyProfile } from "./company.types";
import { JobPost } from "./job.types";
import { Resume } from "./resume.types";
import { StaffProfile } from "./staff.types";
import { User } from "./user.types";
export enum ApplicationStatus {
  PENDING = "pending",
  REVIEWED = "reviewed",
  SHORTLISTED = "shortlisted",
  INTERVIEW = "interview",
  ACCEPTED = "accepted",
  REJECTED = "rejected",
}
export interface Application {
  _id: ObjectId;
  userId: User | string;
  jobId: JobPost | string;
  resumeId: Resume | string;
  hrId: StaffProfile | string;
  status: ApplicationStatus;
  interviewerId?: StaffProfile | string;
  companyId?: CompanyProfile | string;
  appliedAt?: Date;
  updatedAt?: Date;
}
