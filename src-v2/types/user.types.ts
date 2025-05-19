import { ObjectId } from "./common.types";

// User role type from backend
export type UserRole = "user" | "admin" | "hr" | "company";

// Login request payload
export interface LoginRequest {
  email: string;
  password: string;
}

// Register request payload
export interface RegisterRequest {
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
