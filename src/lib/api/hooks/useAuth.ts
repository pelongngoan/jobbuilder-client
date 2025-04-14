import { useMutation } from "@tanstack/react-query";
import { authService } from "../services/auth.service";
import type { LoginCredentials } from "../types";

export const useLogin = () => {
  return useMutation({
    mutationFn: (credentials: LoginCredentials) =>
      authService.login(credentials),
    onSuccess: (response) => {
      // You can add additional success handling here
      console.log("Login successful:", response);
    },
    onError: (error) => {
      // You can add additional error handling here
      console.error("Login failed:", error);
    },
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: (
      userData: Omit<LoginCredentials, "password"> & {
        password: string;
        name: string;
      }
    ) => authService.register(userData),
    onSuccess: (response) => {
      console.log("Registration successful:", response);
    },
    onError: (error) => {
      console.error("Registration failed:", error);
    },
  });
};
