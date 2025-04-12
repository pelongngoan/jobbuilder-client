import { createContext, ReactNode, useContext } from "react";
import {
  useQuery,
  useMutation,
  UseMutationResult,
} from "@tanstack/react-query";
import { User as SelectUser, InsertUser } from "../shared/schema";
import { getQueryFn, apiRequest, queryClient } from "../lib/queryClient";

type AuthContextType = {
  user: SelectUser | null;
  isLoading: boolean;
  error: Error | null;
  isVerified: boolean;
  checkVerificationStatus: () => Promise<boolean>;
  loginMutation: UseMutationResult<SelectUser, Error, LoginData>;
  logoutMutation: UseMutationResult<void, Error, void>;
  registerMutation: UseMutationResult<SelectUser, Error, InsertUser>;
  resendVerificationEmail: () => Promise<boolean>;
};

type LoginData = Pick<InsertUser, "username" | "password">;

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const {
    data: user,
    error,
    isLoading,
  } = useQuery<SelectUser | undefined, Error>({
    queryKey: ["/api/user"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  // Check if the user is verified
  const isVerified = user?.isVerified ?? false;

  // Function to check verification status from the server
  const checkVerificationStatus = async (): Promise<boolean> => {
    try {
      if (!user) return false;

      const res = await apiRequest("GET", "/api/verify-status");
      const data = await res.json();

      // Update user data with verification status
      if (data.isVerified && !user.isVerified) {
        queryClient.setQueryData(["/api/user"], { ...user, isVerified: true });

        toast({
          title: "Email Verified",
          description: "Your email has been successfully verified.",
        });
      }

      return data.isVerified;
    } catch (error) {
      console.error("Error checking verification status:", error);
      return false;
    }
  };

  // Function to resend verification email
  const resendVerificationEmail = async (): Promise<boolean> => {
    try {
      if (!user) return false;

      const res = await apiRequest("POST", "/api/resend-verification");

      toast({
        title: "Verification Email Sent",
        description: "Please check your inbox for the verification link.",
      });

      return true;
    } catch (error) {
      console.error("Error resending verification email:", error);

      toast({
        title: "Error",
        description:
          "Failed to resend verification email. Please try again later.",
        variant: "destructive",
      });

      return false;
    }
  };

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginData) => {
      const res = await apiRequest("POST", "/api/login", credentials);
      return await res.json();
    },
    onSuccess: (user: SelectUser) => {
      queryClient.setQueryData(["/api/user"], user);
    },
    onError: (error: Error) => {
      toast({
        title: "Login failed",
        description: error.message || "Invalid username or password",
        variant: "destructive",
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (credentials: InsertUser) => {
      const res = await apiRequest("POST", "/api/register", credentials);
      return await res.json();
    },
    onSuccess: (user: SelectUser) => {
      queryClient.setQueryData(["/api/user"], user);

      // Show registration success toast
      toast({
        title: "Registration successful",
        description: `Welcome to JobConnect, ${user.name || user.username}!`,
      });

      // Show verification email instructions
      setTimeout(() => {
        toast({
          title: "Please verify your email",
          description:
            "We've sent a verification link to your email address. Please check your inbox and click the link to verify your account.",
          duration: 8000,
        });
      }, 1000);
    },
    onError: (error: Error) => {
      toast({
        title: "Registration failed",
        description: error.message || "Username or email already exists",
        variant: "destructive",
      });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/logout");
    },
    onSuccess: () => {
      queryClient.setQueryData(["/api/user"], null);
      toast({
        title: "Logout successful",
        description: "You have been logged out successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Logout failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        isLoading,
        error,
        isVerified,
        checkVerificationStatus,
        resendVerificationEmail,
        loginMutation,
        logoutMutation,
        registerMutation,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
