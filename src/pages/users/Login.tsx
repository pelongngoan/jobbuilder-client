import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LogIn,
  Briefcase,
  Search,
  Building,
  Users,
  Eye,
  EyeOff,
} from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "../../components/ui/Card";
import { useDispatch, useSelector } from "react-redux";
import { login, setCredentials } from "../../store/auth/authSlice";
import { RootState, AppDispatch } from "../../store";

interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading } = useSelector((state: RootState) => state.auth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = (await dispatch(
        login({ email, password })
      ).unwrap()) as LoginResponse;
      navigate("/home");
      dispatch(setCredentials({ token: result.token, user: result.user }));
    } catch (error) {
      // Handle error appropriately
      console.error("Login failed:", error);
    }
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
          <h2 className="text-4xl font-bold mb-4">Find Your Dream Job Today</h2>
          <p className="text-lg text-blue-100 mb-8">
            Connect with top employers, build your professional resume, and get
            hired faster.
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

      {/* Right side - Login form */}
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
                Welcome Back
              </h2>
              <p className="text-slate-600 mt-2">
                Sign in to continue your job search
              </p>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                  label="Email Address"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                />

                <Input
                  className="align-middle"
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  rightIcon={
                    <Button
                      className="h-8 w-8 p-0 rounded-full hover:bg-gray-100 border-none active:border-none active:scale-95"
                      variant="ghost"
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <Eye className="h-4 w-4" />
                      ) : (
                        <EyeOff className="h-4 w-4" />
                      )}
                    </Button>
                  }
                />

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                    />
                    <label
                      htmlFor="remember-me"
                      className="ml-2 block text-sm text-slate-700"
                    >
                      Remember me
                    </label>
                  </div>

                  <div className="text-sm">
                    <Link
                      to="/forgot-password"
                      className="font-medium text-blue-600 hover:text-blue-700"
                    >
                      Forgot your password?
                    </Link>
                  </div>
                </div>

                <Button
                  type="submit"
                  isLoading={loading}
                  leftIcon={<LogIn className="h-5 w-5" />}
                  className="w-full"
                >
                  Sign in
                </Button>
              </form>
            </CardContent>

            <CardFooter className="text-center">
              <p className="text-sm text-slate-600">
                Don't have an account?{" "}
                <Link
                  to="/users/register"
                  className="font-medium text-blue-600 hover:text-blue-700"
                >
                  Sign up
                </Link>
              </p>
            </CardFooter>
          </Card>

          <div className="mt-8 text-center text-sm text-slate-500">
            <p>
              By signing in, you agree to our{" "}
              <Link to="/terms" className="text-blue-600 hover:text-blue-700">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link to="/privacy" className="text-blue-600 hover:text-blue-700">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
