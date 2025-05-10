import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { setAuth, logout } from "../redux/slices/authSlice";
import { clearUserProfile } from "../redux/slices/userSlice";
import { clearAllLoading } from "../redux/slices/loadingSlice";
import { resetJobs } from "../redux/slices/jobsSlice";
import authService from "../services/authService";
import useApiCall from "./useApiCall";
import {
  LoginRequest,
  RegisterRequest,
  PasswordResetRequest,
  PasswordUpdateRequest,
} from "../types";

/**
 * Hook for handling authentication
 */
export function useAuth() {
  const dispatch = useAppDispatch();
  const { user, token, isAuthenticated, role } = useAppSelector(
    (state) => state.auth
  );

  // API loading states
  const loginApi = useApiCall("login");
  const registerApi = useApiCall("register");
  const forgotPasswordApi = useApiCall("forgotPassword");
  const resetPasswordApi = useApiCall("resetPassword");
  const verifyEmailApi = useApiCall("verifyEmail");

  // Login user
  const login = useCallback(
    async (credentials: LoginRequest) => {
      const result = await loginApi.execute(
        () => authService.login(credentials),
        (data) => {
          if (data.user && data.token) {
            dispatch(setAuth({ user: data.user, token: data.token }));
          }
        }
      );
      return result;
    },
    [dispatch, loginApi]
  );

  // Register user
  const register = useCallback(
    async (userData: RegisterRequest) => {
      const result = await registerApi.execute(
        () => authService.register(userData),
        (data) => {
          if (data.user && data.token) {
            dispatch(setAuth({ user: data.user, token: data.token }));
          }
        }
      );
      return result;
    },
    [dispatch, registerApi]
  );

  // Logout
  const logoutUser = useCallback(() => {
    authService.logout();
    dispatch(logout());
    dispatch(clearUserProfile());
    dispatch(resetJobs());
    dispatch(clearAllLoading());
  }, [dispatch]);

  // Get current user
  const getCurrentUser = useCallback(() => {
    return authService.getCurrentUser();
  }, []);

  // Request password reset
  const requestPasswordReset = useCallback(
    async (email: PasswordResetRequest) => {
      const result = await forgotPasswordApi.execute(() =>
        authService.requestPasswordReset(email)
      );
      return result;
    },
    [forgotPasswordApi]
  );

  // Reset password
  const resetPassword = useCallback(
    async (data: PasswordUpdateRequest) => {
      const result = await resetPasswordApi.execute(() =>
        authService.resetPassword(data)
      );
      return result;
    },
    [resetPasswordApi]
  );

  // Verify email
  const verifyEmail = useCallback(
    async (token: string) => {
      const result = await verifyEmailApi.execute(() =>
        authService.verifyEmail(token)
      );
      return result;
    },
    [verifyEmailApi]
  );

  return {
    // State
    user,
    token,
    isAuthenticated,
    role,

    // Loading states
    loading: {
      login: loginApi.error !== null,
      register: registerApi.error !== null,
      forgotPassword: forgotPasswordApi.error !== null,
      resetPassword: resetPasswordApi.error !== null,
      verifyEmail: verifyEmailApi.error !== null,
    },

    // Error states
    error: {
      login: loginApi.error,
      register: registerApi.error,
      forgotPassword: forgotPasswordApi.error,
      resetPassword: resetPasswordApi.error,
      verifyEmail: verifyEmailApi.error,
    },

    // Methods
    login,
    register,
    logout: logoutUser,
    getCurrentUser,
    requestPasswordReset,
    resetPassword,
    verifyEmail,
  };
}

export default useAuth;
