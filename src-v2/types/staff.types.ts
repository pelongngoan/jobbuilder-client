import { Application } from "./application.types";
import { ObjectId } from "./common.types";
import { CompanyProfile } from "./company.types";
import { JobPost } from "./job.types";
import { Profile } from "./profile.types";
import { User } from "./user.types";
export enum StaffRole {
  HR = "hr",
  INTERVIEWER = "interviewer",
  OTHER = "other",
}
export interface StaffProfile {
  _id: ObjectId;
  userId: User | string;
  companyId: CompanyProfile | string;
  role: StaffRole;
  profile?: Profile | string;
  active?: boolean;
  jobPosts?: JobPost[] | string[];
  applications?: Application[] | string[];
  createdAt?: Date;
  updatedAt?: Date;
}
