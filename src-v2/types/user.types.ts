import { Application } from "./application.types";
import { ObjectId } from "./common.types";
import { JobPost } from "./job.types";
import { Profile } from "./profile.types";
import { Resume } from "./resume.types";

// User role type from backend
export type UserRole = "user" | "admin" | "staff" | "company";

// Login request payload
export interface LoginRequest {
  email: string;
  password: string;
}

// Register request payload
export interface RegisterRequest {
  firstName?: string;
  lastName?: string;
  companyName?: string;
  domain?: string;
  website?: string;
  address?: string;
  phoneNumber?: string;
  email: string;
  password: string;
  role?: UserRole;
}
export interface User {
  _id: ObjectId;
  email: string;
  password: string;
  role: UserRole;
  isVerified: boolean;
  verificationToken?: string;
  verificationTokenExpires?: Date;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  lastLogin?: Date;
}
export interface UserProfile {
  _id: ObjectId;
  userId: User | string;
  profile?: Profile | string;
  savedJobs?: JobPost[] | string[];
  applications?: Application[] | string[];
  resumes?: Resume[] | string[];
  createdAt?: Date;
  updatedAt?: Date;
}
