import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button, Input, Card } from "../../components/common";
import { useAuth } from "../../hooks";

const LoginPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const auth = useAuth();

  // Track which tab is active
  const [activeTab, setActiveTab] = useState<"user" | "company">("user");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  // Check for redirect message from other pages
  const [message] = useState<{
    type: "success" | "error" | "info";
    text: string;
  } | null>(() => {
    const params = new URLSearchParams(location.search);
    const msg = params.get("message");
    const type = params.get("type") as "success" | "error" | "info";

    if (msg && type) {
      return { text: msg, type: type };
    }
    return null;
  });

  useEffect(() => {
    // Redirect to dashboard if already logged in
    if (auth.isAuthenticated) {
      redirectBasedOnRole();
    }
  }, [auth.isAuthenticated]);

  // Function to redirect based on user role
  const redirectBasedOnRole = () => {
    if (
      auth.role === "admin" ||
      auth.role === "hr" ||
      auth.role === "company"
    ) {
      navigate("/management");
    } else {
      navigate("/dashboard/user");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear validation error when field is changed
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
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

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        const result = await auth.login(formData);

        if (result && result.success) {
          // Direct user based on role after successful login
          redirectBasedOnRole();
        }
      } catch {
        // Error is handled by the auth hook
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)] py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="w-full max-w-md">
        <Card className="p-8 shadow-xl border-0 rounded-xl">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-600">Log in to your JobBuilder account</p>
          </div>

          {message && (
            <div
              className={`mb-4 p-3 rounded-md text-sm ${
                message.type === "success"
                  ? "bg-green-50 text-green-700"
                  : message.type === "error"
                  ? "bg-red-50 text-red-700"
                  : "bg-blue-50 text-blue-700"
              }`}
            >
              {message.text}
            </div>
          )}

          {/* Login type selector tabs */}
          <div className="flex border-b border-gray-200 mb-6">
            <button
              className={`flex-1 py-2 px-4 text-center font-medium ${
                activeTab === "user"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("user")}
            >
              Job Seeker
            </button>
            <button
              className={`flex-1 py-2 px-4 text-center font-medium ${
                activeTab === "company"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("company")}
            >
              Company
            </button>
          </div>

          {auth.error[activeTab === "user" ? "login" : "loginCompany"] && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
              {auth.error[activeTab === "user" ? "login" : "loginCompany"]}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="name@example.com"
              fullWidth
              error={validationErrors.email}
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
                error={validationErrors.password}
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
                  to="/forgot-password"
                  className="text-sm text-blue-600 hover:text-blue-800 inline-block mt-1"
                >
                  Forgot your password?
                </Link>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              fullWidth
              isLoading={
                auth.loading[activeTab === "user" ? "login" : "loginCompany"]
              }
            >
              {activeTab === "user"
                ? "Sign In as Job Seeker"
                : "Sign In as Company"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Sign up
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
