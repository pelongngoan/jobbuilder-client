import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus, Briefcase, Search, Building, Users } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "../../components/ui/Card";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { login, setCredentials } from "../../store/auth/authSlice";

export const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading } = useSelector((state: RootState) => state.auth);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    //  try {
    //    const result = (await dispatch(
    //      si({ email, password })
    //    ).unwrap()) as LoginResponse;
    //    navigate("/home");
    //    dispatch(setCredentials({ token: result.token, user: result.user }));
    //  } catch (error) {
    //    // Handle error appropriately
    //    console.error("Login failed:", error);
    //  }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // Handle registration logic here
      console.log("Registration attempt with:", formData);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Left side - Job search illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-blue-900 p-12 flex-col justify-between text-white">
        <div>
          <div className="flex items-center mb-8">
            <Briefcase className="h-8 w-8 mr-2" />
            <h1 className="text-2xl font-bold">JobBuilder</h1>
          </div>
          <h2 className="text-4xl font-bold mb-4">Start Your Career Journey</h2>
          <p className="text-lg text-blue-100 mb-8">
            Join our community of professionals and take the first step towards
            your dream job.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="bg-blue-800/50 hover:bg-blue-800/70 transition-colors p-4 rounded-lg">
            <Search className="h-6 w-6 mb-2 text-blue-200" />
            <h3 className="font-semibold text-white">Search Jobs</h3>
            <p className="text-sm text-blue-200">
              Find opportunities that match your skills
            </p>
          </div>
          <div className="bg-blue-800/50 hover:bg-blue-800/70 transition-colors p-4 rounded-lg">
            <Building className="h-6 w-6 mb-2 text-blue-200" />
            <h3 className="font-semibold text-white">Company Profiles</h3>
            <p className="text-sm text-blue-200">
              Explore top companies and their culture
            </p>
          </div>
          <div className="bg-blue-800/50 hover:bg-blue-800/70 transition-colors p-4 rounded-lg">
            <Users className="h-6 w-6 mb-2 text-blue-200" />
            <h3 className="font-semibold text-white">Career Community</h3>
            <p className="text-sm text-blue-200">
              Connect with professionals in your field
            </p>
          </div>
          <div className="bg-blue-800/50 hover:bg-blue-800/70 transition-colors p-4 rounded-lg">
            <Briefcase className="h-6 w-6 mb-2 text-blue-200" />
            <h3 className="font-semibold text-white">Resume Builder</h3>
            <p className="text-sm text-blue-200">
              Create a professional resume in minutes
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Registration form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center">
              <Briefcase className="h-6 w-6 mr-2 text-blue-900" />
              <h1 className="text-xl font-bold text-blue-900">JobBuilder</h1>
            </div>
          </div>

          <Card>
            <CardHeader className="text-center">
              <h2 className="text-2xl font-bold text-slate-900">
                Create an Account
              </h2>
              <p className="text-slate-600 mt-2">
                Join our community of professionals
              </p>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="First Name"
                    name="firstName"
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="John"
                  />
                  <Input
                    label="Last Name"
                    name="lastName"
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Doe"
                  />
                </div>

                <Input
                  label="Email Address"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                />

                <div className="relative">
                  <Input
                    label="Password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-8 text-sm text-slate-500 hover:text-slate-700"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>

                <div className="relative">
                  <Input
                    label="Confirm Password"
                    name="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    required
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                  />
                  <label
                    htmlFor="terms"
                    className="ml-2 block text-sm text-slate-700"
                  >
                    I agree to the{" "}
                    <Link
                      to="/terms"
                      className="text-blue-600 hover:text-blue-700"
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      to="/privacy"
                      className="text-blue-600 hover:text-blue-700"
                    >
                      Privacy Policy
                    </Link>
                  </label>
                </div>

                <Button
                  type="submit"
                  isLoading={isLoading}
                  leftIcon={<UserPlus className="h-5 w-5" />}
                  className="w-full"
                >
                  Create Account
                </Button>
              </form>
            </CardContent>

            <CardFooter className="text-center">
              <p className="text-sm text-slate-600">
                Already have an account?{" "}
                <Link
                  to="/users/login"
                  className="font-medium text-blue-600 hover:text-blue-700"
                >
                  Sign in
                </Link>
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};
