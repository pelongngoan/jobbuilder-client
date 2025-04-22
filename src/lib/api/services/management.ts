import { apiClient } from "../config";
import type {
  AccountCredentials,
  ApiResponse,
  AuthResponse,
  LoginCredentials,
} from "../types";

export const managementService = {
  async login(
    credentials: LoginCredentials
  ): Promise<ApiResponse<AuthResponse>> {
    console.log("first");
    console.log("/management/login");

    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      "/management/login",
      credentials
    );
    return response.data;
  },

  async signup(
    userData: AccountCredentials
  ): Promise<ApiResponse<AuthResponse>> {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      "/management/signup",
      userData
    );
    return response.data;
  },

  logout(): void {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  getToken(): string | null {
    return localStorage.getItem("token");
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },
};
