import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Input, Card } from "../../components/common";
import { useAuth } from "../../hooks/useAuth";
import { UserRole } from "../../types";

interface RegisterPageProps {
  variant: "user" | "manager";
}

const RegisterPage = ({ variant }: RegisterPageProps) => {
  const navigate = useNavigate();
  const auth = useAuth();

  // Text and styling variations based on variant
  const headings = {
    user: "Create Account",
    manager: "Create Recruiter Account",
  };

  const subheadings = {
    user: "Join JobBuilder to find your dream job",
    manager: "Join JobBuilder to post jobs and manage candidates",
  };

  const ctaText = {
    user: "Create Job Seeker Account",
    manager: "Create Recruiter Account",
  };

  const alternateLinks = {
    user: "/manager/register",
    manager: "/user/register",
  };

  const loginLinks = {
    user: "/user/login",
    manager: "/manager/login",
  };

  const variantClasses = {
    user: "bg-blue-50",
    manager: "bg-gray-100",
  };

  // Let's check the Button component's prop types
  type ButtonVariant = "primary" | "secondary"; // Assuming these are the variants available

  const buttonVariants: Record<string, ButtonVariant> = {
    user: "primary",
    manager: "secondary",
  };

  const [userFormData, setUserFormData] = useState({
    email: "",
    password: "",
    role: variant === "user" ? "user" : "company",
  });

  const handleUserChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setUserFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateUserForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!userFormData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(userFormData.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!userFormData.password) {
      errors.password = "Password is required";
    } else if (userFormData.password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    }

    return Object.keys(errors).length === 0;
  };

  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("first");

    if (validateUserForm()) {
      try {
        const userData = {
          role: userFormData.role as UserRole,
          email: userFormData.email,
          password: userFormData.password,
        };
        const result = await auth.register(userData);
        if (result) {
          navigate(
            `/verify-email?email=${encodeURIComponent(userFormData.email)}`
          );
        }
      } catch {
        // Error is handled by the auth hook
      }
    }
  };

  return (
    <div
      className={`flex items-center justify-center min-h-[calc(100vh-200px)] py-12 px-4 sm:px-6 lg:px-8 ${variantClasses[variant]}`}
    >
      <div className="w-full max-w-md">
        <Card
          className={`p-8 shadow-xl border-0 rounded-xl ${
            variant === "manager" ? "border-l-4 border-l-indigo-600" : ""
          }`}
        >
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {headings[variant]}
            </h1>
            <p className="text-gray-600">{subheadings[variant]}</p>
          </div>
          <form onSubmit={handleUserSubmit} className="space-y-6">
            <Input
              label="Email Address"
              name="email"
              type="email"
              value={userFormData.email}
              onChange={handleUserChange}
              placeholder="name@example.com"
              fullWidth
              autoComplete="email"
              icon={
                <svg
                  className="h-5 w-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              }
            />

            <Input
              label="Password"
              name="password"
              type="password"
              value={userFormData.password}
              onChange={handleUserChange}
              placeholder="Create a secure password"
              hint="Must be at least 8 characters"
              fullWidth
              autoComplete="new-password"
              icon={
                <svg
                  className="h-5 w-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clipRule="evenodd"
                  />
                </svg>
              }
            />

            <div className="mt-1">
              <p className="text-xs text-gray-500">
                By creating an account, you agree to our{" "}
                <Link to="/terms" className="text-blue-600 hover:text-blue-800">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  to="/privacy"
                  className="text-blue-600 hover:text-blue-800"
                >
                  Privacy Policy
                </Link>
              </p>
            </div>

            <Button type="submit" variant={buttonVariants[variant]} fullWidth>
              {ctaText[variant]}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                to={loginLinks[variant]}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Sign in
              </Link>
            </p>
            {variant === "user" && (
              <p className="text-xs text-gray-500 mt-2">
                Are you a recruiter?{" "}
                <Link
                  to={alternateLinks[variant]}
                  className="text-indigo-600 hover:text-indigo-800"
                >
                  Register as a recruiter
                </Link>
              </p>
            )}
            {variant === "manager" && (
              <p className="text-xs text-gray-500 mt-2">
                Looking for a job?{" "}
                <Link
                  to={alternateLinks[variant]}
                  className="text-indigo-600 hover:text-indigo-800"
                >
                  Register as a job seeker
                </Link>
              </p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default RegisterPage;
