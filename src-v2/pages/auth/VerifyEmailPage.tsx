import React, { useEffect, useState, FormEvent } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
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
          message: t("auth.verifyEmail.errorMessage"),
        });
      } finally {
        setIsLoading(false);
      }
    };

    verifyUserEmail();
  }, [token, verifyEmail, t]);

  const handleResendEmail = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setResendStatus({
        success: false,
        message: t("auth.verifyEmail.invalidEmail"),
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
          message: response.message || t("auth.verifyEmail.resendSuccess"),
        });
      }
    } catch (err) {
      console.error("Resend verification email error:", err);
      setResendStatus({
        success: false,
        message: t("auth.verifyEmail.resendError"),
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
          {t("auth.verifyEmail.title")}
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
              {t("auth.verifyEmail.verifying")}
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
              {t("auth.verifyEmail.successMessage")}
            </Typography>

            <ActionButton
              to="/user/login"
              icon={<Login />}
              text={t("auth.verifyEmail.loginButton")}
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
              {verificationStatus?.message ||
                t("auth.verifyEmail.errorMessage")}
            </Alert>
            <Typography variant="body1" paragraph align="center" sx={{ mb: 3 }}>
              {t("auth.verifyEmail.errorMessage")}
            </Typography>

            <Box sx={{ mt: 2, width: "100%", mb: 3 }}>
              <form onSubmit={handleResendEmail}>
                <Typography variant="body2" sx={{ mb: 2, fontWeight: 500 }}>
                  {t("auth.verifyEmail.enterEmailLabel")}
                </Typography>
                <TextField
                  fullWidth
                  label={t("auth.forgotPassword.emailLabel")}
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
                  text={t("auth.verifyEmail.resendButton")}
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
                {t("auth.verifyEmail.or")}
              </Typography>
            </Divider>

            <ActionButton
              to="/user/login"
              icon={<Login />}
              text={t("auth.verifyEmail.backToLogin")}
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
              {t("auth.verifyEmail.checkEmailTitle")}
            </Alert>

            <Typography variant="body1" paragraph align="center" sx={{ mb: 1 }}>
              {t("auth.verifyEmail.checkEmailMessage")}
            </Typography>

            <Typography variant="body2" paragraph align="center" sx={{ mb: 3 }}>
              {t("auth.verifyEmail.checkEmailNote")}
            </Typography>

            <Stack direction="column" spacing={2} width="100%" sx={{ mb: 3 }}>
              <ActionButton
                icon={<Refresh />}
                text={t("auth.verifyEmail.resendButton")}
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
                {t("auth.verifyEmail.or")}
              </Typography>
            </Divider>

            <ActionButton
              to="/user/login"
              icon={<Login />}
              text={t("auth.verifyEmail.backToLogin")}
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
