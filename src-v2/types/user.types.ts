import { ObjectId } from "./common.types";

// User role type from backend
export type UserRole = "user" | "admin" | "hr" | "company";

// User interface matching the backend model
export interface User {
  _id: ObjectId;
  name: string;
  email: string;
  role: UserRole;
  isVerified: boolean;
  profilePicture?: string;
  phone?: string;
  location?: string;
  lastLogin?: Date | string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

// User authentication data
export interface AuthUser extends User {
  token: string;
}

// Login request payload
export interface LoginRequest {
  email: string;
  password: string;
}

// Register request payload
export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

// Password reset request
export interface PasswordResetRequest {
  email: string;
}

// Password update request
export interface PasswordUpdateRequest {
  token: string;
  password: string;
}

// User update request
export interface UserUpdateRequest {
  name?: string;
  phone?: string;
  location?: string;
  profilePicture?: string;
}
