import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Input, Card } from "../../components/common";
import { useAuth } from "../../hooks/useAuth";

interface LoginPageProps {
  variant: "user" | "manager";
}

const LoginPage = ({ variant }: LoginPageProps) => {
  const navigate = useNavigate();
  const auth = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Text variations based on variant
  const headings = {
    user: "Welcome Back",
    manager: "Manager Login",
  };

  const subheadings = {
    user: "Log in to your JobBuilder account",
    manager: "Log in to your JobBuilder management portal",
  };

  const ctaText = {
    user: "Sign In",
    manager: "Access Dashboard",
  };

  const alternateLinks = {
    user: "/manager/login",
    manager: "/user/login",
  };

  const registrationLinks = {
    user: "/user/register",
    manager: "/manager/register",
  };

  const variantClasses = {
    user: "bg-blue-50",
    manager: "bg-gray-100",
  };

  // Define a type for button variants
  type ButtonVariant = "primary" | "secondary";

  const buttonVariants: Record<string, ButtonVariant> = {
    user: "primary",
    manager: "secondary",
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    }
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        const result = await auth.login(formData);
        console.log(result);
        navigate(variant === "user" ? "/user" : "/manager/dashboard");
      } catch (error) {
        console.log(error);
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
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
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

            <div className="space-y-1">
              <Input
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                fullWidth
                autoComplete="current-password"
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
              <div className="text-right">
                <Link
                  to={
                    variant === "user"
                      ? "/user/forgot-password"
                      : "/manager/forgot-password"
                  }
                  className="text-sm text-blue-600 hover:text-blue-800 inline-block mt-1"
                >
                  Forgot your password?
                </Link>
              </div>
            </div>

            <Button type="submit" variant={buttonVariants[variant]} fullWidth>
              {ctaText[variant]}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link
                to={registrationLinks[variant]}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Sign up
              </Link>
            </p>
            {variant === "user" && (
              <p className="text-xs text-gray-500 mt-2">
                Are you a recruiter?{" "}
                <Link
                  to={alternateLinks[variant]}
                  className="text-indigo-600 hover:text-indigo-800"
                >
                  Manager login
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
                  Job seeker login
                </Link>
              </p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
