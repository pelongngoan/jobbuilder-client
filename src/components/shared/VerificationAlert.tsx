import { AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/useAuth";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Button } from "../ui/button";

export default function VerificationAlert() {
  const { user, isVerified, resendVerificationEmail } = useAuth();
  const [showAlert, setShowAlert] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Show the alert if the user is not verified
  useEffect(() => {
    if (user && !isVerified) {
      setShowAlert(true);
    } else {
      setShowAlert(false);
    }
  }, [user, isVerified]);

  // Handle cooldown timer for resend button
  useEffect(() => {
    let timerId: number | undefined;

    if (resendCooldown > 0) {
      timerId = window.setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(timerId);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerId) clearInterval(timerId);
    };
  }, [resendCooldown]);

  const handleResend = async () => {
    if (resendCooldown > 0 || isResending) return;

    setIsResending(true);
    try {
      await resendVerificationEmail();
      // Set a 60-second cooldown
      setResendCooldown(60);
    } finally {
      setIsResending(false);
    }
  };

  if (!showAlert) return null;

  return (
    <Alert className="mb-4 border-amber-500 bg-amber-50 text-amber-900">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Verify your email address</AlertTitle>
      <AlertDescription className="mt-2">
        <p>
          Please verify your email address to access all features. Check your
          inbox for the verification link.
        </p>
        <div className="mt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleResend}
            disabled={isResending || resendCooldown > 0}
          >
            {isResending
              ? "Sending..."
              : resendCooldown > 0
              ? `Resend in ${resendCooldown}s`
              : "Resend verification email"}
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
}
