import React, { useEffect, useState, FormEvent } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  CircularProgress,
  Alert,
  TextField,
  Stack,
  Divider,
} from "@mui/material";
import {
  CheckCircle,
  Error as ErrorIcon,
  Email,
  Refresh,
  Login,
  Send,
} from "@mui/icons-material";
import { useAuth } from "../../hooks/useAuth";

// ActionButton props interface
interface ActionButtonProps {
  to?: string;
  icon?: React.ReactNode;
  text: string;
  variant: "text" | "outlined" | "contained";
  color:
    | "inherit"
    | "primary"
    | "secondary"
    | "success"
    | "error"
    | "info"
    | "warning";
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  isLoading?: boolean;
  sx?: Record<string, unknown>;
}

const VerifyEmailPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const location = useLocation();
  const { verifyEmail, resendEmailVerification } = useAuth();
  const [isLoading, setIsLoading] = useState(!!token);
  const [verificationStatus, setVerificationStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  // Get email from query parameter if available
  const queryParams = new URLSearchParams(location.search);
  const emailFromQuery = queryParams.get("email") || "";
  const [email, setEmail] = useState(emailFromQuery);

  const [resending, setResending] = useState(false);
  const [resendStatus, setResendStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  useEffect(() => {
    const verifyUserEmail = async () => {
      if (!token) {
        // If no token, we show waiting state instead of error
        setIsLoading(false);
        return;
      }

      try {
        const response = await verifyEmail(token);
        if (response) {
          setVerificationStatus({
            success: response.success,
            message: response.message,
          });
        } else {
          throw new Error("No response received");
        }
      } catch (err) {
        console.error("Email verification error:", err);
        setVerificationStatus({
          success: false,
          message: "Failed to verify email. Please try again later.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    verifyUserEmail();
  }, [token, verifyEmail]);

  const handleResendEmail = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setResendStatus({
        success: false,
        message: "Please enter a valid email address",
      });
      return;
    }

    setResending(true);
    setResendStatus(null);

    try {
      const response = await resendEmailVerification(email);
      if (response) {
        setResendStatus({
          success: response.success,
          message: response.message || "Verification email sent successfully!",
        });
      }
    } catch (err) {
      console.error("Resend verification email error:", err);
      setResendStatus({
        success: false,
        message: "Failed to resend verification email. Please try again later.",
      });
    } finally {
      setResending(false);
    }
  };

  // Type for component prop of Button
  type ButtonComponentType = React.ElementType;

  const ActionButton = ({
    to,
    icon,
    text,
    variant,
    color,
    onClick,
    disabled = false,
    isLoading = false,
    sx = {},
  }: ActionButtonProps) => (
    <Button
      component={
        to ? (Link as ButtonComponentType) : ("button" as ButtonComponentType)
      }
      to={to}
      variant={variant}
      color={color}
      startIcon={isLoading ? <CircularProgress size={20} /> : icon}
      disabled={disabled || isLoading}
      onClick={onClick}
      fullWidth
      sx={{
        py: 1.5,
        fontWeight: 600,
        boxShadow: variant === "contained" ? 2 : 0,
        borderRadius: 2,
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: variant === "contained" ? 4 : 1,
        },
        ...sx,
      }}
    >
      {text}
    </Button>
  );

  return (
    <Container maxWidth="sm" sx={{ mt: 8, mb: 8 }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          borderRadius: 3,
          overflow: "hidden",
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "6px",
            background: "linear-gradient(90deg, #3f51b5 0%, #2196f3 100%)",
          },
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 700,
            background: "linear-gradient(90deg, #3f51b5 0%, #2196f3 100%)",
            backgroundClip: "text",
            textFillColor: "transparent",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Email Verification
        </Typography>

        {isLoading ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              my: 4,
            }}
          >
            <CircularProgress size={60} sx={{ mb: 3 }} />
            <Typography variant="body1" sx={{ mt: 2 }}>
              Verifying your email...
            </Typography>
          </Box>
        ) : token && verificationStatus?.success ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              my: 4,
              width: "100%",
            }}
          >
            <CheckCircle color="success" sx={{ fontSize: 80, mb: 3 }} />
            <Alert
              severity="success"
              sx={{
                mb: 3,
                width: "100%",
                borderRadius: 2,
                "& .MuiAlert-icon": {
                  fontSize: 28,
                },
              }}
            >
              {verificationStatus.message}
            </Alert>
            <Typography variant="body1" paragraph align="center" sx={{ mb: 3 }}>
              Your email has been verified successfully. You can now log in to
              your account.
            </Typography>

            <ActionButton
              to="/user/login"
              icon={<Login />}
              text="Log In"
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
            />
          </Box>
        ) : token && !verificationStatus?.success ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              my: 4,
              width: "100%",
            }}
          >
            <ErrorIcon color="error" sx={{ fontSize: 80, mb: 3 }} />
            <Alert
              severity="error"
              sx={{
                mb: 3,
                width: "100%",
                borderRadius: 2,
                "& .MuiAlert-icon": {
                  fontSize: 28,
                },
              }}
            >
              {verificationStatus?.message || "Verification failed."}
            </Alert>
            <Typography variant="body1" paragraph align="center" sx={{ mb: 3 }}>
              We couldn't verify your email. The verification link may have
              expired or is invalid.
            </Typography>

            <Box sx={{ mt: 2, width: "100%", mb: 3 }}>
              <form onSubmit={handleResendEmail}>
                <Typography variant="body2" sx={{ mb: 2, fontWeight: 500 }}>
                  Enter your email to request a new verification link:
                </Typography>
                <TextField
                  fullWidth
                  label="Email Address"
                  variant="outlined"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  sx={{
                    mb: 2,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    },
                  }}
                />
                <ActionButton
                  text="Resend Verification Email"
                  variant="contained"
                  color="primary"
                  icon={<Send />}
                  disabled={resending}
                  isLoading={resending}
                  onClick={handleResendEmail}
                />

                {resendStatus && (
                  <Alert
                    severity={resendStatus.success ? "success" : "error"}
                    sx={{ mt: 2, borderRadius: 2 }}
                  >
                    {resendStatus.message}
                  </Alert>
                )}
              </form>
            </Box>

            <Divider sx={{ width: "100%", my: 2 }}>
              <Typography variant="body2" color="text.secondary">
                OR
              </Typography>
            </Divider>

            <ActionButton
              to="/user/login"
              icon={<Login />}
              text="Back to Login"
              variant="outlined"
              color="primary"
            />
          </Box>
        ) : (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              my: 4,
              width: "100%",
            }}
          >
            <Email color="info" sx={{ fontSize: 80, mb: 3 }} />
            <Alert
              severity="info"
              sx={{
                mb: 3,
                width: "100%",
                borderRadius: 2,
                "& .MuiAlert-icon": {
                  fontSize: 28,
                },
              }}
            >
              Please check your email for the verification link.
            </Alert>

            <Typography variant="body1" paragraph align="center" sx={{ mb: 1 }}>
              We've sent a verification link to{" "}
              <strong>{email || "your email address"}</strong>. Please click the
              link in the email to verify your account.
            </Typography>

            <Typography variant="body2" paragraph align="center" sx={{ mb: 3 }}>
              If you don't see the email in your inbox, please check your spam
              folder.
            </Typography>

            <Stack direction="column" spacing={2} width="100%" sx={{ mb: 3 }}>
              <ActionButton
                icon={<Refresh />}
                text="Resend Verification Email"
                variant="contained"
                color="primary"
                disabled={resending || !email}
                isLoading={resending}
                onClick={handleResendEmail}
              />

              {resendStatus && (
                <Alert
                  severity={resendStatus.success ? "success" : "error"}
                  sx={{
                    mt: 2,
                    borderRadius: 2,
                    "& .MuiAlert-icon": {
                      fontSize: 24,
                    },
                  }}
                >
                  {resendStatus.message}
                </Alert>
              )}
            </Stack>

            <Divider sx={{ width: "100%", my: 2 }}>
              <Typography variant="body2" color="text.secondary">
                OR
              </Typography>
            </Divider>

            <ActionButton
              to="/user/login"
              icon={<Login />}
              text="Back to Login"
              variant="outlined"
              color="primary"
            />
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default VerifyEmailPage;
