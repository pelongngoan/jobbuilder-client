import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button, Input, Card } from "../../components/common";
import { useAuth } from "../../hooks/useAuth";

interface LoginPageProps {
  variant: "user" | "manager";
}

const LoginPage = ({ variant }: LoginPageProps) => {
  const navigate = useNavigate();
  const auth = useAuth();
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Text variations based on variant
  const headings = {
    user: t("auth.login.title"),
    manager: t("auth.login.managerTitle"),
  };

  const subheadings = {
    user: t("auth.login.subtitle"),
    manager: t("auth.login.managerSubtitle"),
  };

  const ctaText = {
    user: t("auth.login.signIn"),
    manager: t("auth.login.accessDashboard"),
  };

  const alternateLinks = {
    user: "/manager/login",
    manager: "/user/login",
  };

  const registrationLinks = {
    user: "/user/register",
    manager: "/manager/register",
  };

  // Enhanced styling variations
  const variantClasses = {
    user: "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50",
    manager: "bg-gradient-to-br from-gray-50 via-slate-50 to-zinc-50",
  };

  const cardClasses = {
    user: "shadow-xl border-0 rounded-2xl bg-white/80 backdrop-blur-sm border-l-4 border-l-blue-500",
    manager:
      "shadow-xl border-0 rounded-2xl bg-white/80 backdrop-blur-sm border-l-4 border-l-indigo-600",
  };

  const headingClasses = {
    user: "text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2",
    manager:
      "text-3xl font-bold bg-gradient-to-r from-indigo-600 to-gray-700 bg-clip-text text-transparent mb-2",
  };

  const subheadingClasses = {
    user: "text-gray-600 text-base",
    manager: "text-gray-700 text-base font-medium",
  };

  // Define a type for button variants
  type ButtonVariant = "primary" | "secondary";

  const buttonVariants: Record<string, ButtonVariant> = {
    user: "primary",
    manager: "secondary",
  };

  // Enhanced accent colors for links
  const linkColors = {
    user: {
      primary: "text-blue-600 hover:text-blue-800",
      secondary: "text-purple-600 hover:text-purple-800",
      forgot: "text-blue-500 hover:text-blue-700",
    },
    manager: {
      primary: "text-indigo-600 hover:text-indigo-800",
      secondary: "text-gray-600 hover:text-gray-800",
      forgot: "text-indigo-500 hover:text-indigo-700",
    },
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
      className={`min-h-screen py-12 px-4 sm:px-6 lg:px-8 ${variantClasses[variant]}`}
    >
      <div className="flex items-center justify-center min-h-[calc(100vh-6rem)]">
        <div className="w-full max-w-lg">
          {/* Decorative elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div
              className={`absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-20 ${
                variant === "user"
                  ? "bg-gradient-to-br from-blue-400 to-purple-400"
                  : "bg-gradient-to-br from-indigo-400 to-gray-400"
              }`}
            ></div>
            <div
              className={`absolute -bottom-40 -left-40 w-80 h-80 rounded-full opacity-20 ${
                variant === "user"
                  ? "bg-gradient-to-tr from-purple-400 to-pink-400"
                  : "bg-gradient-to-tr from-gray-400 to-slate-400"
              }`}
            ></div>
          </div>

          <Card className={`p-8 relative ${cardClasses[variant]}`}>
            {/* Header with icon */}
            <div className="text-center mb-8">
              <div
                className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                  variant === "user"
                    ? "bg-gradient-to-br from-blue-100 to-purple-100"
                    : "bg-gradient-to-br from-indigo-100 to-gray-100"
                }`}
              >
                {variant === "user" ? (
                  <svg
                    className="w-8 h-8 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-8 h-8 text-indigo-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                )}
              </div>
              <h1 className={headingClasses[variant]}>{headings[variant]}</h1>
              <p className={subheadingClasses[variant]}>
                {subheadings[variant]}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label={t("auth.login.emailLabel")}
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder={t("auth.login.emailPlaceholder")}
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

              <div className="space-y-2">
                <Input
                  label={t("auth.login.passwordLabel")}
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder={t("auth.login.passwordPlaceholder")}
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
                    className={`text-sm ${linkColors[variant].forgot} hover:underline inline-flex items-center font-medium transition-colors duration-200`}
                  >
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                      />
                    </svg>
                    {t("auth.login.forgotPasswordLink")}
                  </Link>
                </div>
              </div>

              {/* Enhanced login button */}
              <Button
                type="submit"
                variant={buttonVariants[variant]}
                fullWidth
                className={`py-3 text-lg font-semibold transition-all duration-200 transform hover:scale-[1.02] ${
                  variant === "user"
                    ? "shadow-lg hover:shadow-xl"
                    : "shadow-md hover:shadow-lg"
                }`}
              >
                <span className="flex items-center justify-center">
                  {ctaText[variant]}
                  <svg
                    className="w-5 h-5 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </span>
              </Button>
            </form>

            {/* Enhanced footer section */}
            <div className="mt-8 space-y-4">
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  {t("auth.dontHaveAccount")}{" "}
                  <Link
                    to={registrationLinks[variant]}
                    className={`${linkColors[variant].primary} font-semibold hover:underline`}
                  >
                    {t("auth.login.signUp")}
                  </Link>
                </p>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">
                    {t("auth.register.or")}
                  </span>
                </div>
              </div>

              <div className="text-center">
                {variant === "user" && (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500">
                      {t("auth.login.areYouRecruiter")}{" "}
                      <Link
                        to={alternateLinks[variant]}
                        className={`${linkColors[variant].secondary} font-medium hover:underline inline-flex items-center`}
                      >
                        {t("auth.login.managerLogin")}
                        <svg
                          className="w-4 h-4 ml-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                      </Link>
                    </p>
                  </div>
                )}
                {variant === "manager" && (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500">
                      {t("auth.login.lookingForJob")}{" "}
                      <Link
                        to={alternateLinks[variant]}
                        className={`${linkColors[variant].secondary} font-medium hover:underline inline-flex items-center`}
                      >
                        {t("auth.login.jobSeekerLogin")}
                        <svg
                          className="w-4 h-4 ml-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 01-2 2H10a2 2 0 01-2-2V6"
                          />
                        </svg>
                      </Link>
                    </p>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
