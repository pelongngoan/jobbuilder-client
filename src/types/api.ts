export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
  token?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}

// Auth types
export interface LoginCredentials {
  email: string;
  password: string;
}
export interface AccountCredentials {
  email: string;
  password: string;
  role?: "admin" | "company" | "hr";
}

export interface AuthResponse {
  token: string;
}

// User types
export interface User {
  id: string;
  name: string;
  email: string;
  isVerified: boolean;
  savedJobs: Job[];
  resumes: Resume[];
  appliedJobs: Job[];
}

export interface Resume {
  id: string;
}
// Job types
export interface Job {
  id: string;
  title: string;
  description: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

// Application types
export interface Application {
  id: string;
  jobId: string;
  userId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}
