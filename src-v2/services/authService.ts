import apiClient from "./api";
import { LoginRequest, RegisterRequest } from "../types";

// Define response interfaces to match the actual API responses
interface AuthResponse {
  success?: boolean;
  message?: string;
  token?: string;
  id?: string;
  useProfileId?: string;
  role?: "user" | "admin" | "staff" | "company";
}
export interface MessageResponse {
  success: boolean;
  message: string;
}

// Authentication service
const authService = {
  // Login user
  login: async (credentials: LoginRequest) => {
    const response = await apiClient.post<AuthResponse>(
      "/auth/login",
      credentials
    );
    return response.data;
  },

  // Register new user
  register: async (userData: RegisterRequest) => {
    const response = await apiClient.post<AuthResponse>(
      "/auth/register",
      userData
    );
    return response.data;
  },

  // Verify email with token
  verifyEmail: async (token: string) => {
    const response = await apiClient.get<MessageResponse>(
      `/auth/verify-email/${token}`
    );
    return response.data;
  },

  //Resend email verification
  resendEmailVerification: async ({ email }: { email: string }) => {
    const response = await apiClient.post<MessageResponse>(
      "/auth/resend-verification",
      { email }
    );
    return response.data;
  },

  // Request password reset
  requestPasswordReset: async ({ email }: { email: string }) => {
    const response = await apiClient.post<MessageResponse>(
      "/auth/forgot-password",
      { email }
    );
    return response.data;
  },

  // Reset password with token
  resetPassword: async ({
    token,
    password,
  }: {
    token: string;
    password: string;
  }) => {
    const response = await apiClient.post<MessageResponse>(
      "/auth/reset-password",
      { token, password }
    );
    return response.data;
  },

  // Logout user
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },
};

export default authService;
