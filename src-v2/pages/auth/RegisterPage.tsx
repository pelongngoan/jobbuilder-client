import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button, Input, Card } from "../../components/common";
import { useAuth } from "../../hooks/useAuth";
import { UserRole } from "../../types";

interface RegisterPageProps {
  variant: "user" | "manager";
}

const RegisterPage = ({ variant }: RegisterPageProps) => {
  const navigate = useNavigate();
  const auth = useAuth();
  const { t } = useTranslation();

  // Text and styling variations based on variant
  const headings = {
    user: t("auth.register.title"),
    manager: t("auth.register.managerTitle"),
  };

  const subheadings = {
    user: t("auth.register.subtitle"),
    manager: t("auth.register.managerSubtitle"),
  };

  const ctaText = {
    user: t("auth.register.createAccount"),
    manager: t("auth.register.createRecruiterAccount"),
  };

  const alternateLinks = {
    user: "/manager/register",
    manager: "/user/register",
  };

  const loginLinks = {
    user: "/user/login",
    manager: "/manager/login",
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
    },
    manager: {
      primary: "text-indigo-600 hover:text-indigo-800",
      secondary: "text-gray-600 hover:text-gray-800",
    },
  };

  const [userFormData, setUserFormData] = useState({
    firstName: "",
    lastName: "",
    companyName: "",
    domain: "",
    website: "",
    address: "",
    phoneNumber: "",
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

    if (validateUserForm()) {
      try {
        const userData = {
          firstName: userFormData.firstName,
          lastName: userFormData.lastName,
          companyName: userFormData.companyName,
          domain: userFormData.domain,
          website: userFormData.website,
          address: userFormData.address,
          phoneNumber: userFormData.phoneNumber,
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

  const renderInput = () => {
    if (variant === "user") {
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label={t("auth.register.firstName")}
              name="firstName"
              type="text"
              value={userFormData.firstName}
              onChange={handleUserChange}
              placeholder={t("auth.register.firstName")}
              fullWidth
              autoComplete="given-name"
            />
            <Input
              label={t("auth.register.lastName")}
              name="lastName"
              type="text"
              value={userFormData.lastName}
              onChange={handleUserChange}
              placeholder={t("auth.register.lastName")}
              fullWidth
              autoComplete="family-name"
            />
          </div>
        </div>
      );
    } else {
      return (
        <div className="space-y-4">
          <Input
            label={t("auth.register.companyName")}
            name="companyName"
            type="text"
            value={userFormData.companyName}
            onChange={handleUserChange}
            placeholder={t("auth.register.companyNamePlaceholder")}
            fullWidth
            autoComplete="organization"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label={t("auth.register.domain")}
              name="domain"
              type="text"
              value={userFormData.domain}
              onChange={handleUserChange}
              placeholder={t("auth.register.domainPlaceholder")}
              fullWidth
            />
            <Input
              label={t("auth.register.website")}
              name="website"
              type="url"
              value={userFormData.website}
              onChange={handleUserChange}
              placeholder={t("auth.register.websitePlaceholder")}
              fullWidth
              autoComplete="url"
            />
          </div>
          <Input
            label={t("auth.register.address")}
            name="address"
            type="text"
            value={userFormData.address}
            onChange={handleUserChange}
            placeholder={t("auth.register.addressPlaceholder")}
            fullWidth
            autoComplete="street-address"
          />
        </div>
      );
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
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
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
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                )}
              </div>
              <h1 className={headingClasses[variant]}>{headings[variant]}</h1>
              <p className={subheadingClasses[variant]}>
                {subheadings[variant]}
              </p>
            </div>

            <form onSubmit={handleUserSubmit} className="space-y-6">
              {renderInput()}

              <Input
                label={t("auth.register.emailLabel")}
                name="email"
                type="email"
                value={userFormData.email}
                onChange={handleUserChange}
                placeholder={t("auth.register.emailPlaceholder")}
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
                label={t("auth.register.phoneLabel")}
                name="phoneNumber"
                type="tel"
                value={userFormData.phoneNumber}
                onChange={handleUserChange}
                placeholder={t("auth.register.phonePlaceholder")}
                fullWidth
                autoComplete="tel"
                icon={
                  <svg
                    className="h-5 w-5 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                }
              />

              <Input
                label={t("auth.register.passwordLabel")}
                name="password"
                type="password"
                value={userFormData.password}
                onChange={handleUserChange}
                placeholder={t("auth.register.passwordPlaceholder")}
                hint={t("auth.register.passwordHint")}
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
                {ctaText[variant]}
              </Button>
            </form>

            {/* Footer */}
            <div className="mt-8 space-y-4">
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  {t("auth.alreadyHaveAccount")}{" "}
                  <Link
                    to={loginLinks[variant]}
                    className={`${linkColors[variant].primary} font-semibold hover:underline`}
                  >
                    {t("auth.register.signIn")}
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
                  <p className="text-sm text-gray-500">
                    {t("auth.register.areYouRecruiter")}{" "}
                    <Link
                      to={alternateLinks[variant]}
                      className={`${linkColors[variant].secondary} font-medium hover:underline`}
                    >
                      {t("auth.register.registerAsRecruiter")}
                    </Link>
                  </p>
                )}
                {variant === "manager" && (
                  <p className="text-sm text-gray-500">
                    {t("auth.register.lookingForJob")}{" "}
                    <Link
                      to={alternateLinks[variant]}
                      className={`${linkColors[variant].secondary} font-medium hover:underline`}
                    >
                      {t("auth.register.registerAsJobSeeker")}
                    </Link>
                  </p>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
