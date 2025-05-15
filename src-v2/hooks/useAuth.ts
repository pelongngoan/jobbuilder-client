import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { setAuth, logout } from "../redux/slices/authSlice";
import { clearUserProfile } from "../redux/slices/userSlice";
import { clearAllLoading } from "../redux/slices/loadingSlice";
import { resetJobs } from "../redux/slices/jobsSlice";
import authService from "../services/authService";
import { LoginRequest, RegisterRequest } from "../types";
import { setToast } from "../redux/slices/toastSlice";

export function useAuth() {
  const dispatch = useAppDispatch();
  const { token } = useAppSelector((state) => state.auth);

  const login = useCallback(
    async (credentials: LoginRequest) => {
      const result = await authService.login(credentials);
      if (result && result.success && result.token) {
        dispatch(setAuth({ token: result.token }));
        localStorage.setItem("token", result.token);
        dispatch(setToast({ message: "Login successful", type: "success" }));
      }
      return result;
    },
    [dispatch]
  );

  // Register user
  const register = useCallback(
    async (userData: RegisterRequest) => {
      const result = await authService.register(userData);
      if (result && result.success && result.token) {
        dispatch(setAuth({ token: result.token }));
        dispatch(setToast({ message: "Register successful", type: "success" }));
      }
      return result;
    },
    [dispatch]
  );

  // Logout
  const logoutUser = useCallback(() => {
    authService.logout();
    dispatch(logout());
    dispatch(clearUserProfile());
    dispatch(resetJobs());
    dispatch(clearAllLoading());
  }, [dispatch]);
  // Verify email
  const verifyEmail = useCallback(
    async (token: string) => {
      const result = await authService.verifyEmail(token);
      if (result && result.success) {
        dispatch(setToast({ message: "Email verified", type: "success" }));
      } else {
        dispatch(
          setToast({ message: "Email verification failed", type: "error" })
        );
      }
      return result;
    },
    [dispatch]
  );

  // Resend email verification
  const resendEmailVerification = useCallback(
    async (email: string) => {
      const result = await authService.resendEmailVerification({ email });
      if (result && result.success) {
        dispatch(
          setToast({ message: "Email verification resent", type: "success" })
        );
      } else {
        dispatch(
          setToast({
            message: "Email verification resend failed",
            type: "error",
          })
        );
      }
      return result;
    },
    [dispatch]
  );

  // Request password reset
  const requestPasswordReset = useCallback(
    async (email: string) => {
      const result = await authService.requestPasswordReset({ email });
      if (result && result.success) {
        dispatch(
          setToast({ message: "Password reset request sent", type: "success" })
        );
      } else {
        dispatch(
          setToast({ message: "Password reset request failed", type: "error" })
        );
      }
      return result;
    },
    [dispatch]
  );

  // Reset password
  const resetPassword = useCallback(
    async (data: { token: string; password: string }) => {
      const result = await authService.resetPassword(data);
      if (result && result.success) {
        dispatch(
          setToast({ message: "Password reset successful", type: "success" })
        );
      } else {
        dispatch(setToast({ message: "Password reset failed", type: "error" }));
      }
      return result;
    },
    [dispatch]
  );

  return {
    token,
    login,
    register,
    logout: logoutUser,
    requestPasswordReset,
    resetPassword,
    verifyEmail,
    resendEmailVerification,
    setToast,
    logoutUser,
    dispatch,
  };
}

export default useAuth;
