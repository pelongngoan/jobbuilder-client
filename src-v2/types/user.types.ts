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
