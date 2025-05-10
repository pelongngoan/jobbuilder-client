import { ObjectId } from "./common.types";

// Admin level type
export type AdminLevel = "super" | "standard" | "limited";

// Admin permissions interface
export interface AdminPermissions {
  canManageUsers: boolean;
  canManageCompanies: boolean;
  canManageJobs: boolean;
  canManageSkills: boolean;
  canManageCategories: boolean;
  canAccessLogs: boolean;
  canManageSettings: boolean;
}

// Admin last action interface
export interface AdminLastAction {
  type: string;
  description: string;
  timestamp: Date | string;
}

// Admin profile interface matching the backend model
export interface AdminProfile {
  _id: ObjectId;
  userId: ObjectId;
  adminLevel: AdminLevel;
  permissions: AdminPermissions;
  lastAction?: AdminLastAction;
  createdAt: Date | string;
  updatedAt: Date | string;
}

// Admin profile update request
export interface AdminProfileUpdateRequest {
  adminLevel?: AdminLevel;
  permissions?: Partial<AdminPermissions>;
}

// Admin action record request
export interface AdminActionRequest {
  type: string;
  description: string;
}
