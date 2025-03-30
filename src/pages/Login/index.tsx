import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Paper,
  Link,
  CircularProgress,
  InputAdornment,
  IconButton,
  Snackbar,
  Alert,
  Divider,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  LoginOutlined,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

// You'll want to replace this with your actual API call
const loginUser = async (email: string, password: string) => {
  // Simulate API call
  return new Promise<{ success: boolean; message: string }>((resolve) => {
    setTimeout(() => {
      if (email === "test@example.com" && password === "password") {
        resolve({ success: true, message: "Login successful" });
      } else {
        resolve({ success: false, message: "Invalid email or password" });
      }
    }, 1000);
  });
};

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [alert, setAlert] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = re.test(email);
    setEmailError(isValid ? "" : "Please enter a valid email address");
    return isValid;
  };

  const validatePassword = (password: string): boolean => {
    const isValid = password.length >= 6;
    setPasswordError(isValid ? "" : "Password must be at least 6 characters");
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (!isEmailValid || !isPasswordValid) {
      return;
    }

    setLoading(true);

    try {
      const response = await loginUser(email, password);

      if (response.success) {
        setAlert({
          open: true,
          message: "Login successful! Redirecting...",
          severity: "success",
        });

        // Store auth token or user info in localStorage/context
        localStorage.setItem("isLoggedIn", "true");

        // Redirect to dashboard after a short delay
        setTimeout(() => {
          navigate("/dashboard");
        }, 1500);
      } else {
        setAlert({
          open: true,
          message: response.message,
          severity: "error",
        });
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setAlert({
        open: true,
        message: "An error occurred. Please try again.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseAlert = () => {
    setAlert({ ...alert, open: false });
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #6B73FF 0%, #000DFF 100%)",
        padding: 2,
      }}
    >
      <Container component="main" maxWidth="sm">
        <Paper
          elevation={24}
          sx={{
            borderRadius: 4,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            position: "relative",
          }}
        >
          <Box
            sx={{
              padding: isMobile ? 3 : 6,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {/* Logo/Brand Area */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 4,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 60,
                  height: 60,
                  borderRadius: "50%",
                  backgroundColor: "primary.main",
                  boxShadow: "0 4px 20px rgba(0, 13, 255, 0.5)",
                  mb: 1,
                }}
              >
                <LoginOutlined sx={{ fontSize: 30, color: "#fff" }} />
              </Box>
            </Box>

            <Typography
              component="h1"
              variant="h4"
              fontWeight="bold"
              color="primary.main"
              sx={{ mb: 1 }}
            >
              Job Finder
            </Typography>

            <Typography
              variant="body1"
              color="text.secondary"
              align="center"
              sx={{ mb: 4 }}
            >
              Sign in to access your account and find your dream job
            </Typography>

            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{ width: "100%" }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => validateEmail(email)}
                error={!!emailError}
                helperText={emailError}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    "&.Mui-focused fieldset": {
                      borderWidth: 2,
                    },
                  },
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => validatePassword(password)}
                error={!!passwordError}
                helperText={passwordError}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    "&.Mui-focused fieldset": {
                      borderWidth: 2,
                    },
                  },
                }}
              />

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  mt: 1,
                  mb: 2,
                }}
              >
                <Link
                  href="#"
                  variant="body2"
                  sx={{ color: "primary.main", fontWeight: 500 }}
                  onClick={() => navigate("/forgot-password")}
                >
                  Forgot password?
                </Link>
              </Box>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mt: 1,
                  mb: 3,
                  py: 1.5,
                  fontSize: "1rem",
                  borderRadius: 2,
                  fontWeight: "bold",
                  boxShadow: "0 4px 10px rgba(0, 13, 255, 0.3)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 6px 15px rgba(0, 13, 255, 0.4)",
                  },
                }}
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Sign In"
                )}
              </Button>

              <Divider sx={{ my: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  OR
                </Typography>
              </Divider>

              <Box sx={{ display: "flex", justifyContent: "center", mb: 1 }}>
                <Button
                  variant="outlined"
                  color="primary"
                  sx={{
                    borderRadius: 2,
                    py: 1.25,
                    width: "100%",
                    fontWeight: "medium",
                    borderWidth: 1.5,
                    "&:hover": {
                      borderWidth: 1.5,
                      backgroundColor: "rgba(0, 13, 255, 0.04)",
                    },
                  }}
                  onClick={() => navigate("/register")}
                >
                  Create New Account
                </Button>
              </Box>
            </Box>
          </Box>

          {/* Footer */}
          <Box
            sx={{
              py: 2,
              px: 3,
              backgroundColor: "rgba(0, 0, 0, 0.02)",
              borderTop: "1px solid rgba(0, 0, 0, 0.05)",
              textAlign: "center",
            }}
          >
            <Typography variant="body2" color="text.secondary">
              By signing in, you agree to our{" "}
              <Link href="#" sx={{ fontWeight: 500 }}>
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="#" sx={{ fontWeight: 500 }}>
                Privacy Policy
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>

      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseAlert}
          severity={alert.severity}
          sx={{
            width: "100%",
            borderRadius: 2,
            fontWeight: 500,
            alignItems: "center",
          }}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Login;
