import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogIn, Eye, EyeOff, Building } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "../../components/ui/Card";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { login } from "../../lib/api/services/management";

interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

export const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const { loading } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      login({ ...formData }).then((response: LoginResponse) => {
        console.log("Login successful:", response);
        const { token, user } = response;
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        navigate("/management/dashboard");
      });
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Right side - Login form */}
      <div className="w-full  flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center">
              <Building className="h-6 w-6 mr-2 text-indigo-900" />
              <h1 className="text-xl font-bold text-indigo-900">
                ManagementPortal
              </h1>
            </div>
          </div>

          <Card>
            <CardHeader className="text-center">
              <h2 className="text-2xl font-bold text-slate-900">
                Management Login
              </h2>
              <p className="text-slate-600 mt-2">
                Sign in to access your management dashboard
              </p>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                  label="Email Address"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@company.com"
                />

                <Input
                  className="align-middle"
                  label="Password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleChange}
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
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-300 rounded"
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
                      to="/management/forgot-password"
                      className="font-medium text-indigo-600 hover:text-indigo-700"
                    >
                      Forgot your password?
                    </Link>
                  </div>
                </div>

                <Button
                  type="submit"
                  isLoading={loading}
                  leftIcon={<LogIn className="h-5 w-5" />}
                  className="w-full bg-indigo-600 hover:bg-indigo-700"
                >
                  Management Sign In
                </Button>
              </form>
            </CardContent>

            <CardFooter className="text-center">
              <p className="text-sm text-slate-600">
                Need a management account?{" "}
                <Link
                  to="/management/signup"
                  className="font-medium text-indigo-600 hover:text-indigo-700"
                >
                  Request Access
                </Link>
              </p>
            </CardFooter>
          </Card>

          <div className="mt-8 text-center text-sm text-slate-500">
            <p>
              By signing in, you agree to our{" "}
              <Link
                to="/terms"
                className="text-indigo-600 hover:text-indigo-700"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                to="/privacy"
                className="text-indigo-600 hover:text-indigo-700"
              >
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
