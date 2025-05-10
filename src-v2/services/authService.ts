import apiClient from "./api";
import {
  User,
  LoginRequest,
  RegisterRequest,
  PasswordResetRequest,
  PasswordUpdateRequest,
} from "../types";

// Authentication service
const authService = {
  // Login user
  login: async (credentials: LoginRequest) => {
    const response = await apiClient.post<{ user: User; token: string }>(
      "/auth/login",
      credentials
    );
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Register new user
  register: async (userData: RegisterRequest) => {
    const response = await apiClient.post<{ user: User; token: string }>(
      "/auth/register",
      userData
    );
    return response.data;
  },

  // Logout user
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  // Get current authenticated user
  getCurrentUser: (): User | null => {
    const userJson = localStorage.getItem("user");
    if (userJson) {
      return JSON.parse(userJson) as User;
    }
    return null;
  },

  // Request password reset
  requestPasswordReset: async (data: PasswordResetRequest) => {
    const response = await apiClient.post("/auth/forgot-password", data);
    return response.data;
  },

  // Reset password with token
  resetPassword: async (data: PasswordUpdateRequest) => {
    const response = await apiClient.post("/auth/reset-password", data);
    return response.data;
  },

  // Verify email with token
  verifyEmail: async (token: string) => {
    const response = await apiClient.get(`/auth/verify-email/${token}`);
    return response.data;
  },
};

export default authService;
