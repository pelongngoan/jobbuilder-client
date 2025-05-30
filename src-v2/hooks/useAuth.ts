import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { setAuth, logout, setId, setRole } from "../redux/slices/authSlice";
import { clearAllLoading } from "../redux/slices/loadingSlice";
import authService from "../services/authService";
import { LoginRequest, RegisterRequest } from "../types";
import { setToast } from "../redux/slices/toastSlice";

export function useAuth() {
  const dispatch = useAppDispatch();
  const { token, id, role, useProfileId, companyId, companyProfileId } =
    useAppSelector((state) => state.auth);

  const login = useCallback(
    async (credentials: LoginRequest) => {
      const result = await authService.login(credentials);
      if (
        result &&
        result.success &&
        result.token &&
        result.id &&
        result.role
      ) {
        dispatch(setAuth({ token: result.token }));
        dispatch(setId({ id: result.id }));
        dispatch(setRole({ role: result.role }));
        localStorage.setItem("token", result.token);
        localStorage.setItem("id", result.id);
        localStorage.setItem("role", result.role);
        localStorage.setItem("useProfileId", result.useProfileId || "");
        localStorage.setItem("companyId", result.companyId || "");
        localStorage.setItem("companyProfileId", result.companyProfileId || "");
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
    dispatch(clearAllLoading());
    localStorage.removeItem("token");
    localStorage.removeItem("id");
    localStorage.removeItem("role");
    localStorage.removeItem("useProfileId");
    localStorage.removeItem("companyId");
    localStorage.removeItem("companyProfileId");
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
    id,
    role,
    useProfileId,
    companyId,
    companyProfileId,
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
